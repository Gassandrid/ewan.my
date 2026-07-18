import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"
import { h } from "preact"
import { slugifyFilePath } from "@quartz-community/utils/path"

const MARIMO_ISLANDS_VERSION = "0.23.9"

const RENDER_SCRIPT = `
import sys, json
try:
    import marimo
    from marimo import MarimoIslandGenerator
except ImportError as e:
    print(json.dumps({"error": f"marimo not installed: {e}"}))
    sys.exit(0)
try:
    gen = MarimoIslandGenerator.from_file(sys.argv[1], display_code=False)
    body = gen.render_body(max_width="none", margin="0")
    print(json.dumps({
        "body": body,
        "marimoVersion": marimo.__version__,
        "islandCount": body.count("<marimo-island"),
        "reactiveIslandCount": body.count('data-reactive="true"'),
    }))
except Exception as e:
    print(json.dumps({"error": f"render failed: {e}"}))
    sys.exit(0)
`

let pythonMissingWarned = false
let versionMismatchWarned = false
const renderCache = new Map()

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

function renderIsland(notebookPath, { failOnError, runtimeVersion }) {
  const stat = fs.statSync(notebookPath)
  const cacheKey = `${stat.mtimeMs}:${runtimeVersion}`
  const cached = renderCache.get(notebookPath)
  if (cached?.key === cacheKey) return cached.value

  function fail(message) {
    if (failOnError) throw new Error(`[marimo] ${notebookPath}: ${message}`)
    console.warn(`[marimo] ${notebookPath}: ${message}`)
    return null
  }

  const result = spawnSync(resolvePython(), ["-c", RENDER_SCRIPT, notebookPath], {
    encoding: "utf8",
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

function marimoHtml(rendered, runtimeVersion) {
  const loading = `<div class="marimo-loading" aria-live="polite"><span class="marimo-loading-spinner" aria-hidden="true"></span><span class="marimo-loading-text">Loading interactive Python kernel...</span></div>`
  const versionAttr = rendered.marimoVersion
    ? ` data-marimo-version="${escapeHtmlAttr(rendered.marimoVersion)}"`
    : ""
  return `<div class="marimo-notebook-page" data-marimo-runtime="${escapeHtmlAttr(runtimeVersion)}"${versionAttr} data-marimo-islands="${rendered.islandCount}" data-marimo-reactive-islands="${rendered.reactiveIslandCount}">${loading}${rendered.body}</div>`
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
      return walk(contentRoot).flatMap((fp) => {
        const src = path.join(contentRoot, fp)
        const basename = path.basename(fp, ".marimo.py")
        let title = filenameToTitle(basename)
        let description = `Interactive marimo notebook: ${title}`
        let tags = []
        try {
          const fileContent = fs.readFileSync(src, "utf8")
          title = parseAppTitle(fileContent) ?? title
          description = parseDescription(fileContent) ?? description
          tags = parseTags(fileContent)
        } catch {}
        const rendered = renderIsland(src, { failOnError, runtimeVersion })
        if (!rendered?.body) return []
        const slug = slugifyFilePath(fp.replace(/\.marimo\.py$/, ".md"))
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
              links: [],
              isMarimo: true,
              marimoHtml: marimoHtml(rendered, runtimeVersion),
            },
          },
        ]
      })
    },
    layout: "content",
    body: MarimoBody,
  }
}
