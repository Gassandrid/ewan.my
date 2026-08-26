import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import { h } from "preact"
import { slugifyFilePath, transformLink } from "@quartz-community/utils/path"

const MARIMO_ISLANDS_VERSION = "0.23.9"
const OBSIDIAN_WIKILINK = /(?<!!)\[\[([^\[\]\n]+)\]\]/g
const RENDER_SCRIPT_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), "render.py")

let pythonMissingWarned = false
let versionMismatchWarned = false
const renderCache = new Map()

function parseWikiLink(raw) {
  const divider = raw.indexOf("|")
  const target = (divider === -1 ? raw : raw.slice(0, divider)).trim()
  const alias = divider === -1 ? "" : raw.slice(divider + 1).trim()
  const withoutAnchor = target.split("#", 1)[0]
  const fallbackLabel = withoutAnchor.split("/").at(-1) || target
  return { raw, target, label: alias || fallbackLabel }
}

function marimoPageSlugs(ctx) {
  return (ctx.allFiles ?? []).map((fp) =>
    slugifyFilePath(fp.endsWith(".marimo.py") ? fp.replace(/\.marimo\.py$/, ".md") : fp),
  )
}

function resolveLinkedSlug(target, allSlugs) {
  const withoutAnchor = target.split("#", 1)[0]
  const canonical = slugifyFilePath(withoutAnchor)
  const matches = allSlugs.filter((slug) => {
    if (canonical.includes("/")) return slug === canonical || slug.endsWith(`/${canonical}`)
    return slug.split("/").at(-1) === canonical
  })
  return matches.length === 1 ? matches[0] : canonical
}

export function compileObsidianLinks(src, currentSlug, allSlugs) {
  const parsed = Array.from(src.matchAll(OBSIDIAN_WIKILINK), (match) => parseWikiLink(match[1]))
  const replacements = {}
  const links = new Set()
  for (const link of parsed) {
    replacements[link.raw] = {
      label: link.label,
      href: transformLink(currentSlug, link.target, { strategy: "shortest", allSlugs }),
    }
    links.add(resolveLinkedSlug(link.target, allSlugs))
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

function parseDescription(src) {
  const match = src.match(/^#\s*description:\s*(.+)$/m)
  return match ? match[1].trim() : null
}

function parseTags(src) {
  const match = src.match(/^#\s*tags:\s*(.+)$/m)
  if (!match) return []
  return match[1]
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
}

function parseStaticPreview(src) {
  return /^#\s*static-preview:\s*true\s*$/im.test(src)
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

function shouldIgnore(relPath) {
  return relPath
    .split(path.sep)
    .some((part) => part === "private" || part === "templates" || part === ".obsidian")
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

function walk(dir, root = dir) {
  const files = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name)
    const rel = path.relative(root, abs)
    if (shouldIgnore(rel)) continue
    if (entry.isDirectory()) files.push(...walk(abs, root))
    else if (entry.isFile() && entry.name.endsWith(".marimo.py")) files.push(rel)
  }
  return files
}

function renderIsland(notebookPath, { failOnError, runtimeVersion, wikiLinks, staticPreview }) {
  const stat = fs.statSync(notebookPath)
  const cacheKey = `${stat.mtimeMs}:${runtimeVersion}:${staticPreview}:${JSON.stringify(wikiLinks)}`
  const cached = renderCache.get(notebookPath)
  if (cached?.key === cacheKey) return cached.value

  function fail(message) {
    if (failOnError) throw new Error(`[marimo] ${notebookPath}: ${message}`)
    console.warn(`[marimo] ${notebookPath}: ${message}`)
    return null
  }

  const result = spawnSync(resolvePython(), [RENDER_SCRIPT_PATH, notebookPath], {
    encoding: "utf8",
    input: JSON.stringify({ wikiLinks, staticPreview }),
    env: {
      ...process.env,
      EWAN_MARIMO_STATIC_PREVIEW: staticPreview ? "1" : "",
    },
    maxBuffer: 50 * 1024 * 1024,
    timeout: 120_000,
  })
  if (result.error) {
    if (result.error.code === "ENOENT" && !pythonMissingWarned) {
      console.warn("[marimo] python not found - skipping all marimo notebooks.")
      pythonMissingWarned = true
    }
    return fail(result.error.message)
  }
  const parsed = parseRenderJson(result.stdout ?? "")
  if (!parsed) {
    return fail(
      `could not parse generator output (exit ${result.status ?? "unknown"})\nstdout: ${result.stdout ?? ""}\nstderr: ${result.stderr ?? ""}`,
    )
  }
  if (parsed.error) return fail(parsed.error)

  const body = String(parsed.body ?? "")
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
  renderCache.set(notebookPath, { key: cacheKey, value: rendered })
  return rendered
}

function marimoHtml(rendered, runtimeVersion, slug) {
  const loading = `<div class="marimo-loading" aria-live="polite"><span class="marimo-loading-spinner" aria-hidden="true"></span><span class="marimo-loading-text">Starting interactive Python…</span></div>`
  const versionAttr = rendered.marimoVersion
    ? ` data-marimo-version="${escapeHtmlAttr(rendered.marimoVersion)}"`
    : ""
  return `<div class="marimo-notebook-page" data-marimo-page="${escapeHtmlAttr(slug)}" data-marimo-state="loading" data-marimo-runtime="${escapeHtmlAttr(runtimeVersion)}"${versionAttr} data-marimo-islands="${rendered.islandCount}" data-marimo-reactive-islands="${rendered.reactiveIslandCount}">${loading}${rendered.body}</div>`
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
  return {
    name: "MarimoPageType",
    priority: 10,
    match: () => false,
    generate({ ctx }) {
      const contentRoot = ctx.argv.directory
      const allSlugs = marimoPageSlugs(ctx)
      return walk(contentRoot).flatMap((fp) => {
        const src = path.join(contentRoot, fp)
        const basename = path.basename(fp, ".marimo.py")
        const slug = slugifyFilePath(fp.replace(/\.marimo\.py$/, ".md"))
        let title = filenameToTitle(basename)
        let description = `Interactive marimo notebook: ${title}`
        let tags = []
        let fileContent = ""
        try {
          fileContent = fs.readFileSync(src, "utf8")
          title = parseAppTitle(fileContent) ?? title
          description = parseDescription(fileContent) ?? description
          tags = parseTags(fileContent)
        } catch {}
        const obsidianLinks = compileObsidianLinks(fileContent, slug, allSlugs)
        const rendered = renderIsland(src, {
          failOnError,
          runtimeVersion,
          wikiLinks: obsidianLinks.replacements,
          staticPreview: parseStaticPreview(fileContent),
        })
        if (!rendered?.body) return []
        const stat = fs.statSync(src)
        return [
          {
            slug,
            title,
            data: {
              slug,
              relativePath: fp,
              filePath: fp,
              dates: { created: stat.birthtime, modified: stat.mtime, published: stat.birthtime },
              defaultDateType: "created",
              frontmatter: { title, tags, description, cssclasses: ["marimo-page"] },
              text: `${title}. ${description}`,
              description,
              links: obsidianLinks.links,
              isMarimo: true,
              marimoHtml: marimoHtml(rendered, runtimeVersion, slug),
            },
          },
        ]
      })
    },
    layout: "content",
    body: MarimoBody,
  }
}
