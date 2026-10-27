import { createHash } from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import katex from "katex"
import { toJsxRuntime } from "hast-util-to-jsx-runtime"
import { h } from "preact"
import { Fragment, jsx, jsxs } from "preact/jsx-runtime"
import { render } from "preact-render-to-string"
import { slugTag, slugifyFilePath, transformLink } from "@quartz-community/utils/path"

const MARIMO_ISLANDS_VERSION = "0.25.2"
const OBSIDIAN_WIKILINK = /(?<!!)\[\[([^\[\]\n]+)\]\]/g
// Pandoc-style `[@key]` and `[@a; @b, p. 3]`, as notes write them. obsidian.py
// matches the same groups when it renders Markdown.
const CITATION_GROUP = /(?<![\\\[!])\[(?:[^\[\]\n]*?[\s;])?-?@\w[^\[\]\n]*\](?![\[(\]])/g
const RENDER_SCRIPT_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), "render.py")
const CITATIONS_SCRIPT_PATH = path.join(path.dirname(RENDER_SCRIPT_PATH), "citations.mjs")
const COMPILER_FILES = ["render.py", "obsidian.py", "dependencies.py"].map((name) =>
  path.join(path.dirname(RENDER_SCRIPT_PATH), name),
)
const COMPILER_SOURCE = fs.readFileSync(fileURLToPath(import.meta.url), "utf8")
const DISK_CACHE_DIR = path.join(process.cwd(), ".quartz-cache", "marimo")
// Build-time execution matches Pyodide 314's interpreter.
const EXECUTION_PYTHON = "3.14"
const WARM_PAGE_PATH = "static/marimo-warm.html"
const DEFERRED_OUTPUT_DIR = "static/marimo-outputs"
const INLINE_OUTPUT_LIMIT = 48 * 1024
const LINK_INDEX_PATH = "static/marimo-links.json"
// Stands in for the index version inside compiled cells, so a Vault edit only
// changes a string in cached output instead of re-running Python per notebook.
const LINK_INDEX_VERSION = "EWANMARIMOLINKINDEXVERSION"

let pythonMissingWarned = false
let versionMismatchWarned = false
const renderCache = new Map()
// Written by generate(); the dispatcher always runs before other emitters.
let latestLinkIndex = null
let latestWarmPage = null
let deferredOutputs = new Map()
let uvAvailable

function parseWikiLink(raw) {
  const divider = raw.indexOf("|")
  const target = (divider === -1 ? raw : raw.slice(0, divider)).trim()
  const alias = divider === -1 ? "" : raw.slice(divider + 1).trim()
  const withoutAnchor = target.split("#", 1)[0]
  const fallbackLabel = withoutAnchor.split("/").at(-1) || target
  return { raw, target, label: alias || fallbackLabel }
}

export function buildObsidianContext(ctx, content) {
  const published = new Map(
    (content ?? []).map(([tree, file]) => [file.data.relativePath, { tree, data: file.data }]),
  )
  const files = (ctx.allFiles ?? []).flatMap((fp) => {
    if (fp.endsWith(".md") && content !== undefined && !published.has(fp)) return []
    const page = published.get(fp)
    const slug = page?.data.slug ?? slugifyFilePath(fp.replace(/\.marimo\.py$/, ".md"))
    const aliases = page?.data.frontmatter?.aliases ?? []
    const headings = {}
    const stack = []
    function text(node) {
      return node.value ?? (node.children ?? []).map(text).join("")
    }
    function visit(node) {
      if (/^h[1-6]$/.test(node.tagName) && node.properties?.id) {
        const depth = Number(node.tagName[1])
        const title = text(node)
        while (stack.length && stack.at(-1).depth >= depth) stack.pop()
        stack.push({ depth, title })
        headings[title] ??= node.properties.id
        headings[stack.map((h) => h.title).join("#")] = node.properties.id
      }
      for (const child of node.children ?? []) visit(child)
    }
    if (page) visit(page.tree)
    return [{ path: fp, slug, aliases: Array.isArray(aliases) ? aliases : [aliases], headings }]
  })
  return { files }
}

export function linkIndex(context, basePath = "/") {
  const files = context.files.map(({ path, slug, aliases, headings }) => ({
    path,
    slug,
    ...(aliases.length ? { aliases } : {}),
    ...(Object.keys(headings).length ? { headings } : {}),
  }))
  const json = JSON.stringify({ files })
  const version = createHash("sha256").update(json).digest("hex").slice(0, 12)
  return { json, path: `${basePath}${LINK_INDEX_PATH}`, version }
}

function resolveLinkedSlug(target, allSlugs, currentSlug) {
  // Obsidian names notebooks `name.marimo`; their pages live at `name`.
  const withoutAnchor = target.split("#", 1)[0].replace(/\.marimo(?:\.py)?$/i, ".md")
  const canonical = slugifyFilePath(withoutAnchor)
  const matches = allSlugs.filter((slug) => {
    if (canonical.includes("/")) return slug === canonical || slug.endsWith(`/${canonical}`)
    return slug.split("/").at(-1) === canonical
  })
  const exact = matches.find((slug) => slug === canonical)
  const nearby = matches.filter(
    (slug) => path.posix.dirname(slug) === path.posix.dirname(currentSlug),
  )
  if (canonical.includes("/") && exact) return exact
  return matches.length === 1 ? matches[0] : nearby.length === 1 ? nearby[0] : null
}

export function compileObsidianLinks(src, currentSlug, allSlugs) {
  const parsed = Array.from(src.matchAll(OBSIDIAN_WIKILINK), (match) => parseWikiLink(match[1]))
  const replacements = {}
  const links = new Set()
  for (const link of parsed) {
    const resolved = resolveLinkedSlug(link.target, allSlugs, currentSlug)
    if (!resolved) continue
    const anchor = link.target.includes("#") ? link.target.slice(link.target.indexOf("#")) : ""
    replacements[link.raw] = {
      label: link.label,
      href: transformLink(currentSlug, resolved + anchor, { strategy: "absolute", allSlugs }),
    }
    links.add(resolved)
  }
  return { replacements, links: [...links] }
}

function filenameToTitle(name) {
  return name
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function parseAppTitle(src) {
  const match = src.match(/marimo\.App\s*\([^)]*app_title\s*=\s*["']([^"']+)["']/)
  return match ? match[1] : null
}

// The comment lines above `# /// script` are the notebook's properties, written
// like a note's frontmatter: `# key: value`, list items as `#   - item`.
export function parseHeader(src) {
  const header = {}
  let key = null
  for (const line of src.split(/\r?\n/)) {
    if (!line.startsWith("#") || line.startsWith("# ///")) break
    const item = key && line.match(/^#\s+-\s+(.*)$/)
    const field = line.match(/^#\s*([A-Za-z][\w-]*):\s*(.*)$/)
    if (item) {
      header[key] = [...(Array.isArray(header[key]) ? header[key] : []), unquote(item[1])]
    } else if (field) {
      key = field[1]
      header[key] = field[2].trim() ? unquote(field[2]) : []
    }
  }
  return header
}

function unquote(value) {
  return value.trim().replace(/^(["'])(.*)\1$/, "$2")
}

function headerList(value) {
  if (value === undefined) return []
  return (Array.isArray(value) ? value : value.split(","))
    .map((item) => item.trim())
    .filter(Boolean)
}

function headerDate(value) {
  const date = typeof value === "string" && value ? new Date(value) : null
  return date && !Number.isNaN(date.getTime()) ? date : null
}

// Note-style properties for the page: tags are slugged as in notes, dates use
// the same aliases (`date`/`created`, `updated`/`modified`), and anything else
// (class, related, author, ...) passes through for properties and Bases.
export function notebookFrontmatter(header, title, description) {
  const tags = [
    ...new Set(headerList(header.tags ?? header.tag).map((tag) => slugTag(tag.replace(/^#/, "")))),
  ]
  const aliases = headerList(header.aliases ?? header.alias)
  const { tag, alias, prerender, ...rest } = header
  return {
    ...rest,
    title,
    description,
    tags,
    ...(aliases.length ? { aliases } : {}),
    cssclasses: ["marimo-page", ...headerList(header.cssclasses)],
  }
}

// Every string passed straight to mo.md(...), with its prefix (r, f, rf, ...).
function markdownBlocks(src) {
  return Array.from(
    src.matchAll(/mo\.md\(\s*([rRfFuU]{0,2})("""|'''|"|')([\s\S]*?)(?<!\\)\2/g),
    (match) => ({ formatted: /f/i.test(match[1]), text: match[3] }),
  )
}

// Search, previews and reading time see the notebook's prose, not only its
// title: links reduced to their labels, citations and f-string fields dropped.
export function notebookProse(src) {
  return markdownBlocks(src)
    .map(({ formatted, text }) => (formatted ? text.replace(/\{[^{}\n]*\}/g, "") : text))
    .join("\n\n")
    .replace(CITATION_GROUP, "")
    .replace(OBSIDIAN_WIKILINK, (_, raw) => parseWikiLink(raw).label)
    .replace(/\$\$[\s\S]*?\$\$|\$[^$\n]+\$/g, "")
    .replace(/^\s*(?:#{1,6}|[-*+]|\d+\.)\s+/gm, "")
    .replace(/[*_`>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

export function citationGroups(src) {
  const groups = markdownBlocks(src).flatMap(
    ({ text }) => text.replace(/(`+)[\s\S]*?\1/g, "").match(CITATION_GROUP) ?? [],
  )
  return [...new Set(groups)]
}

function hastToHtml(children) {
  return render(
    toJsxRuntime(
      { type: "root", children },
      { Fragment, jsx, jsxs, elementAttributeNameCase: "html" },
    ),
  )
}

// Citations go through the site's configured Citations and EwanCitations
// transformers, so a notebook's inline cites and bibliography match a note's.
// rehype-citation is async and generate() is not, so it runs in a child.
export function renderCitations(ctx, groups) {
  const transformers = ctx.cfg?.plugins?.transformers ?? []
  const citations = transformers.find((plugin) => plugin.name === "Citations")
  if (!groups.length || !citations) return null
  const [[, options], ...after] = citations.htmlPlugins(ctx)
  const follow = [
    ...after,
    ...(transformers.find((plugin) => plugin.name === "EwanCitations")?.htmlPlugins(ctx) ?? []),
  ]
  const locale = ctx.cfg?.configuration?.locale ?? "en-US"
  let bibliography = ""
  try {
    bibliography = fs.readFileSync(path.resolve(options.bibliography), "utf8")
  } catch {}
  const key = createHash("sha256")
    .update(
      JSON.stringify([groups, options, locale, fs.readFileSync(CITATIONS_SCRIPT_PATH, "utf8")]),
    )
    .update(bibliography)
    .digest("hex")
  let tree = readDiskCache(`citations-${key}`)
  if (!tree) {
    const result = spawnSync(process.execPath, [CITATIONS_SCRIPT_PATH], {
      encoding: "utf8",
      input: JSON.stringify({ groups, options, locale }),
      maxBuffer: 50 * 1024 * 1024,
      timeout: 120_000,
    })
    try {
      tree = JSON.parse(result.stdout)
    } catch {
      console.warn(
        `[marimo] citations skipped: ${(result.stderr || result.error?.message || "").trim().slice(-400)}`,
      )
      return null
    }
    writeDiskCache(`citations-${key}`, tree)
  }
  for (const plugin of follow) {
    const [attach, ...args] = Array.isArray(plugin) ? plugin : [plugin]
    attach(...args)(tree)
  }
  const paragraphs = tree.children.filter((node) => node.tagName === "p")
  if (paragraphs.length !== groups.length) return null
  const inline = {}
  groups.forEach((group, i) => {
    const cited = paragraphs[i].children.some((node) => node.type === "element")
    if (cited) inline[group] = hastToHtml(paragraphs[i].children)
  })
  const section = tree.children.find((node) => node.tagName === "section")
  return { inline, bibliography: section ? hastToHtml([section]) : "" }
}

function parseRenderJson(stdout) {
  const lines = stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  for (const line of lines.reverse()) {
    try {
      return JSON.parse(line)
    } catch {}
  }
  return null
}

function escapeHtmlAttr(value) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;")
}

function resolvePython() {
  const candidates = [
    process.env.MARIMO_PYTHON,
    "/opt/homebrew/Caskroom/miniconda/base/bin/python3",
    "/opt/homebrew/Caskroom/miniconda/base/bin/python",
    "python3",
  ].filter(Boolean)
  return (
    candidates.find((candidate) => candidate === "python3" || fs.existsSync(candidate)) ?? "python3"
  )
}

function hasUv() {
  uvAvailable ??= spawnSync(process.env.MARIMO_UV ?? "uv", ["--version"]).status === 0
  return uvAvailable
}

// Executing needs the packages the browser will have; uv builds (and caches) a
// matching environment per notebook. Without uv, the configured Python runs it
// and cells it cannot execute are left empty.
function renderCommand(notebookPath, execute, runtimeVersion) {
  const python = resolvePython()
  if (!execute || !hasUv()) return [python, [RENDER_SCRIPT_PATH, notebookPath]]
  const listed = spawnSync(python, [COMPILER_FILES[2], "build", notebookPath, runtimeVersion], {
    encoding: "utf8",
  })
  let requirements
  try {
    requirements = JSON.parse(listed.stdout)
  } catch {
    return [python, [RENDER_SCRIPT_PATH, notebookPath]]
  }
  const uv = process.env.MARIMO_UV ?? "uv"
  return [
    uv,
    [
      "run",
      "--no-project",
      "--quiet",
      "--python",
      EXECUTION_PYTHON,
      ...requirements.flatMap((requirement) => ["--with", requirement]),
      "python",
      RENDER_SCRIPT_PATH,
      notebookPath,
    ],
  ]
}

function readDiskCache(key) {
  try {
    return JSON.parse(fs.readFileSync(path.join(DISK_CACHE_DIR, `${key}.json`), "utf8"))
  } catch {
    return null
  }
}

function writeDiskCache(key, value) {
  try {
    fs.mkdirSync(DISK_CACHE_DIR, { recursive: true })
    fs.writeFileSync(path.join(DISK_CACHE_DIR, `${key}.json`), JSON.stringify(value))
  } catch {}
}

function renderIsland(
  notebookPath,
  { failOnError, runtimeVersion, markdownContext, execute, linkIndexFile },
) {
  // Static links come from the index current at render time; the live
  // session re-renders them with the deployed index, so it is not in the key.
  const key = createHash("sha256")
    .update(
      JSON.stringify([
        fs.readFileSync(notebookPath, "utf8"),
        COMPILER_FILES.map((fp) => fs.readFileSync(fp, "utf8")),
        COMPILER_SOURCE,
        runtimeVersion,
        markdownContext,
        execute,
        execute && hasUv(),
      ]),
    )
    .digest("hex")
  const cached = renderCache.get(notebookPath)
  if (cached?.key === key) return cached.value
  const stored = readDiskCache(key)
  if (stored) {
    renderCache.set(notebookPath, { key, value: stored })
    return stored
  }

  function fail(message) {
    if (failOnError) throw new Error(`[marimo] ${notebookPath}: ${message}`)
    console.warn(`[marimo] ${notebookPath}: ${message}`)
    return null
  }

  function run(executeNow) {
    const [command, args] = renderCommand(notebookPath, executeNow, runtimeVersion)
    return spawnSync(command, args, {
      encoding: "utf8",
      input: JSON.stringify({ markdownContext, execute: executeNow }),
      env: { ...process.env, EWAN_MARIMO_LINK_INDEX: linkIndexFile ?? "" },
      maxBuffer: 50 * 1024 * 1024,
      timeout: executeNow ? 600_000 : 120_000,
    })
  }

  let result = run(execute)
  let parsed = parseRenderJson(result.stdout ?? "")
  if (execute && (!parsed || parsed.error || typeof parsed.executed === "string")) {
    const reason =
      parsed?.executed ?? parsed?.error ?? (result.stderr || result.error?.message || "")
    console.warn(
      `[marimo] ${notebookPath}: build-time run failed, exporting without output: ${String(reason).trim().slice(-400)}`,
    )
    result = run(false)
    parsed = parseRenderJson(result.stdout ?? "")
  } else if (typeof parsed?.executed === "number" && parsed.executed > 0) {
    console.warn(
      `[marimo] ${notebookPath}: ${parsed.executed} cell(s) could not run at build time and start empty.`,
    )
  }
  if (result.error) {
    if (result.error.code === "ENOENT" && !pythonMissingWarned) {
      console.warn("[marimo] python not found - skipping all marimo notebooks.")
      pythonMissingWarned = true
    }
    return fail(result.error.message)
  }
  if (!parsed) {
    return fail(
      `could not parse generator output (exit ${result.status ?? "unknown"})\nstdout: ${result.stdout ?? ""}\nstderr: ${result.stderr ?? ""}`,
    )
  }
  if (parsed.error) return fail(parsed.error)

  const body = stripStaticWidgets(prerenderMath(String(parsed.body ?? "")))
  const marimoVersion = typeof parsed.marimoVersion === "string" ? parsed.marimoVersion : null
  if (marimoVersion && marimoVersion !== runtimeVersion) {
    const message = `local marimo ${marimoVersion} does not match islands runtime ${runtimeVersion}`
    if (failOnError) return fail(message)
    if (!versionMismatchWarned) {
      console.warn(`[marimo] ${message}.`)
      versionMismatchWarned = true
    }
  }
  const rendered = {
    body,
    marimoVersion,
    islandCount:
      typeof parsed.islandCount === "number"
        ? parsed.islandCount
        : (body.match(/<marimo-island/g) ?? []).length,
    reactiveIslandCount:
      typeof parsed.reactiveIslandCount === "number"
        ? parsed.reactiveIslandCount
        : (body.match(/data-reactive="true"/g) ?? []).length,
  }
  if (rendered.islandCount === 0) return fail("compiler emitted no marimo islands")
  renderCache.set(notebookPath, { key, value: rendered })
  writeDiskCache(key, rendered)
  return rendered
}

function decodeHtml(text) {
  return text.replace(/&(?:#(\d+)|#x([\da-f]+)|(amp|lt|gt|quot|apos));/gi, (_, dec, hex, name) =>
    dec
      ? String.fromCodePoint(Number(dec))
      : hex
        ? String.fromCodePoint(parseInt(hex, 16))
        : { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" }[name.toLowerCase()],
  )
}

// An anywidget needs its model in the live kernel; one from the build session
// only logs "Model not found" until the cell reruns, so it starts empty.
export function stripStaticWidgets(body) {
  return body
    .replace(
      /<marimo-ui-element\b[^>]*>\s*<marimo-anywidget\b[\s\S]*?<\/marimo-anywidget>\s*<\/marimo-ui-element>/g,
      "",
    )
    .replace(/<marimo-anywidget\b[\s\S]*?<\/marimo-anywidget>/g, "")
}

// <marimo-tex> typesets only once the islands runtime defines it. Until then
// the page shows the same KaTeX output, rendered here; CSS swaps them.
export function prerenderMath(body) {
  return body.replace(/<marimo-tex\b[^>]*>([\s\S]*?)<\/marimo-tex>/g, (element, raw) => {
    const delimited = decodeHtml(raw)
      .trim()
      .match(/^\|\|([(\[])([\s\S]*)\|\|[)\]]$/)
    if (!delimited) return element
    const html = katex.renderToString(delimited[2], {
      displayMode: delimited[1] === "[",
      throwOnError: false,
    })
    return `<span class="marimo-tex-static">${html}</span>${element}`
  })
}

function marimoHtml(rendered, runtimeVersion, slug, index, basePath, bibliography = "") {
  const loading = `<div class="marimo-loading" aria-live="polite"><span class="marimo-loading-spinner" aria-hidden="true"></span><span class="marimo-loading-text">Starting interactive Python…</span></div>`
  const versionAttr = rendered.marimoVersion
    ? ` data-marimo-version="${escapeHtmlAttr(rendered.marimoVersion)}"`
    : ""
  return `<div class="marimo-notebook-page" data-marimo-page="${escapeHtmlAttr(slug)}" data-marimo-state="loading" data-marimo-runtime="${escapeHtmlAttr(runtimeVersion)}"${versionAttr} data-marimo-islands="${rendered.islandCount}" data-marimo-reactive-islands="${rendered.reactiveIslandCount}" data-marimo-links="${escapeHtmlAttr(`${index.path}?v=${index.version}`)}">${loading}${deferLargeOutputs(rendered.body.replaceAll(LINK_INDEX_VERSION, index.version), basePath, deferredOutputs)}</div>${bibliography}`
}

// A standalone page the site loads in a hidden iframe from any page, so the
// HTTP cache holds the islands runtime, Pyodide, marimo and every notebook's
// packages before a reader opens one. It tells its parent when it is done.
function renderWarmPage(notebookPaths) {
  const result = spawnSync(resolvePython(), [RENDER_SCRIPT_PATH, "--warm", ...notebookPaths], {
    encoding: "utf8",
    timeout: 120_000,
  })
  const parsed = parseRenderJson(result.stdout ?? "")
  if (!parsed?.body) {
    console.warn(`[marimo] warm-up page skipped: ${parsed?.error ?? result.stderr ?? ""}`)
    return null
  }
  const runtime = `https://cdn.jsdelivr.net/npm/@marimo-team/islands@${MARIMO_ISLANDS_VERSION}/dist/main.js`
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="robots" content="noindex">
<title>Warm-up</title>
<script type="module" src="${runtime}" crossorigin="anonymous"></script>
</head>
<body>
${parsed.body}
<script>
(function() {
  var started = false;
  function report(status) {
    observer.disconnect();
    parent.postMessage({ type: "ewan-marimo-warm", status: status }, location.origin);
  }
  var observer = new MutationObserver(function(records) {
    records.forEach(function(record) {
      if (record.oldValue === "queued" || record.oldValue === "running") started = true;
    });
    var cell = document.querySelector('marimo-island[data-reactive="true"]');
    if (!cell) return;
    if (cell.querySelector('[role="alert"]')) report("error");
    else if (started && cell.dataset.status === "idle") report("done");
  });
  observer.observe(document.body, {
    subtree: true, childList: true, attributes: true,
    attributeFilter: ["data-status"], attributeOldValue: true,
  });
})();
</script>
</body>
</html>
`
}

// Big figures and images would otherwise ride along with every page view,
// hover preview and search preview. They move to their own cacheable files,
// which the loader fills in on the notebook page itself.
export function deferLargeOutputs(body, basePath, files) {
  return body.replace(
    /(<marimo-island\b)([^>]*>\s*<marimo-cell-output>)([\s\S]*?)(<\/marimo-cell-output>)/g,
    (island, open, rest, output, close) => {
      if (output.length <= INLINE_OUTPUT_LIMIT) return island
      const name = `${createHash("sha256").update(output).digest("hex").slice(0, 16)}.html`
      files.set(name, output)
      return `${open} data-ewan-output="${basePath}${DEFERRED_OUTPUT_DIR}/${name}"${rest}${close}`
    },
  )
}

function MarimoBody() {
  function Component({ fileData }) {
    const classes = fileData.frontmatter?.cssclasses ?? []
    return h(
      "article",
      { class: ["popover-hint", ...classes].join(" ") },
      h("div", {
        class: "markdown-preview-view markdown-rendered marimo-page-body",
        dangerouslySetInnerHTML: { __html: fileData.marimoHtml ?? "" },
      }),
    )
  }
  Component.displayName = "MarimoBody"
  return Component
}

export default function MarimoPageType(opts = {}) {
  const runtimeVersion = opts.version ?? MARIMO_ISLANDS_VERSION
  const failOnError = opts.failOnError ?? true
  const execute = opts.execute ?? process.env.EWAN_MARIMO_EXECUTE !== "0"
  return {
    name: "MarimoPageType",
    priority: 10,
    match: () => false,
    generate({ ctx, content }) {
      const contentRoot = ctx.argv.directory
      const markdownContext = buildObsidianContext(ctx, content)
      const allSlugs = markdownContext.files.map((file) => file.slug)
      const baseUrl = new URL(`https://${ctx.cfg?.configuration?.baseUrl ?? "example.com"}`)
      const basePath = baseUrl.pathname.replace(/\/?$/, "/")
      latestLinkIndex = linkIndex(markdownContext, basePath)
      deferredOutputs = new Map()
      const linkIndexFile = path.join(DISK_CACHE_DIR, "links.json")
      fs.mkdirSync(DISK_CACHE_DIR, { recursive: true })
      fs.writeFileSync(linkIndexFile, latestLinkIndex.json)
      const notebooks = (ctx.allFiles ?? []).filter((fp) => fp.endsWith(".marimo.py"))
      latestWarmPage = notebooks.length
        ? renderWarmPage(notebooks.map((fp) => path.join(contentRoot, fp)))
        : null
      return notebooks.flatMap((fp) => {
        const src = path.join(contentRoot, fp)
        const basename = path.basename(fp, ".marimo.py")
        const slug = slugifyFilePath(fp.replace(/\.marimo\.py$/, ".md"))
        let fileContent = ""
        try {
          fileContent = fs.readFileSync(src, "utf8")
        } catch {}
        const header = parseHeader(fileContent)
        if (String(header.draft).toLowerCase() === "true") return []
        const title = parseAppTitle(fileContent) ?? filenameToTitle(basename)
        const description = header.description || `Interactive marimo notebook: ${title}`
        const obsidianLinks = compileObsidianLinks(fileContent, slug, allSlugs)
        const citations = renderCitations(ctx, citationGroups(fileContent))
        const rendered = renderIsland(src, {
          failOnError,
          runtimeVersion,
          execute: execute && String(header.prerender).toLowerCase() !== "false",
          linkIndexFile,
          markdownContext: {
            currentSlug: slug,
            index: `${latestLinkIndex.path}?v=${LINK_INDEX_VERSION}`,
            ...(citations ? { citations: citations.inline } : {}),
          },
        })
        if (!rendered?.body) return []
        const stat = fs.statSync(src)
        const created = headerDate(header.created ?? header.date) ?? stat.birthtime
        const modified =
          headerDate(header.modified ?? header.updated ?? header.lastmod) ?? stat.mtime
        return [
          {
            slug,
            title,
            data: {
              slug,
              relativePath: fp,
              filePath: fp,
              dates: { created, modified, published: headerDate(header.published) ?? created },
              defaultDateType: "created",
              frontmatter: notebookFrontmatter(header, title, description),
              text: `${title}. ${description}\n\n${notebookProse(fileContent)}`,
              description,
              links: obsidianLinks.links,
              isMarimo: true,
              marimoHtml: marimoHtml(
                rendered,
                runtimeVersion,
                slug,
                latestLinkIndex,
                basePath,
                citations?.bibliography,
              ),
            },
          },
        ]
      })
    },
    layout: "content",
    body: MarimoBody,
    async emit(ctx) {
      if (!latestLinkIndex) return []
      const fp = path.join(ctx.argv.output, LINK_INDEX_PATH)
      await fs.promises.mkdir(path.dirname(fp), { recursive: true })
      await fs.promises.writeFile(fp, latestLinkIndex.json)
      const written = [fp]
      if (latestWarmPage) {
        written.push(path.join(ctx.argv.output, WARM_PAGE_PATH))
        await fs.promises.writeFile(written.at(-1), latestWarmPage)
      }
      const outputDir = path.join(ctx.argv.output, DEFERRED_OUTPUT_DIR)
      await fs.promises.mkdir(outputDir, { recursive: true })
      for (const [name, html] of deferredOutputs) {
        written.push(path.join(outputDir, name))
        await fs.promises.writeFile(written.at(-1), html)
      }
      return written
    },
  }
}
