import { fromHtml } from "hast-util-from-html"
import { VFile } from "vfile"
import { spawn } from "child_process"
import path from "path"
import fs from "fs"
import { ProcessedContent } from "../plugins/vfile"
import { FilePath, FullSlug } from "../util/path"
import { glob } from "../util/glob"
import { Argv } from "../util/ctx"
import { MARIMO_ISLANDS_VERSION } from "./marimoConfig"

function filenameToTitle(name: string): string {
  return name
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function parseAppTitle(src: string): string | null {
  const m = src.match(/marimo\.App\s*\([^)]*app_title\s*=\s*["']([^"']+)["']/)
  return m ? m[1] : null
}

function parseDescription(src: string): string | null {
  const m = src.match(/^#\s*description:\s*(.+)$/m)
  return m ? m[1].trim() : null
}

function parseTags(src: string): string[] {
  const m = src.match(/^#\s*tags:\s*(.+)$/m)
  if (!m) return []
  return m[1]
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
}

// Python helper: invokes marimo's island generator and prints the rendered body
// as JSON. Exits 0 on every path so we can warn-and-skip rather than fail the build.
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

function parseRenderJson(stdout: string): Record<string, unknown> | null {
  const lines = stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  for (const line of lines.reverse()) {
    try {
      return JSON.parse(line)
    } catch {
      // continue scanning: notebooks or libraries may print before our JSON
    }
  }

  return null
}

function escapeHtmlAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;")
}

// Async spawn. `spawnSync` was hitting EBADF on Quartz's hot-reload worker
// context, where Node's internal fd bookkeeping for sync-mode child-process
// allocation breaks. The async variant uses libuv pipes and works reliably.
interface RenderedIsland {
  body: string
  marimoVersion: string | null
  islandCount: number
  reactiveIslandCount: number
}

function renderIsland(notebookPath: string): Promise<RenderedIsland | null> {
  return new Promise((resolve) => {
    let child
    try {
      child = spawn("python3", ["-c", RENDER_SCRIPT, notebookPath], {
        stdio: ["ignore", "pipe", "pipe"],
      })
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code
      if (code === "ENOENT" && !pythonMissingWarned) {
        console.warn(
          "[marimo] python3 not found — skipping all marimo notebooks. Install Python + `pip install marimo` to enable.",
        )
        pythonMissingWarned = true
      } else if (code !== "ENOENT") {
        console.warn(`[marimo] failed to spawn python: ${(err as Error).message}`)
      }
      resolve(null)
      return
    }

    let stdout = ""
    let stderr = ""
    child.stdout!.setEncoding("utf-8").on("data", (d) => (stdout += d))
    child.stderr!.setEncoding("utf-8").on("data", (d) => (stderr += d))

    const timeout = setTimeout(() => {
      child.kill("SIGKILL")
      console.warn(`[marimo] timeout rendering ${notebookPath}`)
      resolve(null)
    }, 120_000)

    child.on("error", (err) => {
      clearTimeout(timeout)
      const code = (err as NodeJS.ErrnoException).code
      if (code === "ENOENT" && !pythonMissingWarned) {
        console.warn(
          "[marimo] python3 not found — skipping all marimo notebooks. Install Python + `pip install marimo` to enable.",
        )
        pythonMissingWarned = true
      } else if (code !== "ENOENT") {
        console.warn(`[marimo] failed to spawn python: ${err.message}`)
      }
      resolve(null)
    })

    child.on("close", (code) => {
      clearTimeout(timeout)
      const parsed = parseRenderJson(stdout)
      if (!parsed) {
        console.warn(
          `[marimo] could not parse generator output for ${notebookPath} (exit ${code ?? "unknown"})\nstdout: ${stdout}\nstderr: ${stderr}`,
        )
        resolve(null)
        return
      }

      if (parsed.error) {
        console.warn(`[marimo] ${notebookPath}: ${parsed.error}`)
        resolve(null)
        return
      }

      const marimoVersion = typeof parsed.marimoVersion === "string" ? parsed.marimoVersion : null
      if (marimoVersion && marimoVersion !== MARIMO_ISLANDS_VERSION && !versionMismatchWarned) {
        console.warn(
          `[marimo] local marimo ${marimoVersion} does not match islands runtime ${MARIMO_ISLANDS_VERSION}; update quartz/custom/marimoConfig.ts after upgrading marimo.`,
        )
        versionMismatchWarned = true
      }

      resolve({
        body: String(parsed.body ?? ""),
        marimoVersion,
        islandCount:
          typeof parsed.islandCount === "number"
            ? parsed.islandCount
            : (String(parsed.body ?? "").match(/<marimo-island/g)?.length ?? 0),
        reactiveIslandCount:
          typeof parsed.reactiveIslandCount === "number"
            ? parsed.reactiveIslandCount
            : (String(parsed.body ?? "").match(/data-reactive="true"/g)?.length ?? 0),
      })
    })
  })
}

export async function injectMarimoPages(content: ProcessedContent[], argv: Argv): Promise<void> {
  const marimoFiles = await glob("**/*.marimo.py", argv.directory, [])
  if (marimoFiles.length === 0) return

  for (const fp of marimoFiles) {
    const src = path.join(argv.directory, fp)
    const slug = fp.replace(/\.marimo\.py$/, "") as FullSlug
    const basename = fp
      .split("/")
      .pop()!
      .replace(/\.marimo\.py$/, "")

    let title = filenameToTitle(basename)
    let description = `Interactive marimo notebook: ${title}`
    let tags: string[] = []

    try {
      const fileContent = await fs.promises.readFile(src, "utf-8")
      title = parseAppTitle(fileContent) ?? title
      description = parseDescription(fileContent) ?? description
      tags = parseTags(fileContent)
    } catch {
      // file unreadable — fall back to filename-derived values
    }

    const rendered = await renderIsland(src)
    if (!rendered?.body) continue

    // The `.marimo-loading` block is hidden by CSS once at least one reactive
    // island gets a `data-status` attribute (set by the runtime when its cell
    // is done running). Until then it shows a spinner.
    const loading = `<div class="marimo-loading" aria-live="polite"><span class="marimo-loading-spinner" aria-hidden="true"></span><span class="marimo-loading-text">Loading interactive Python kernel…</span></div>`
    const versionAttr = rendered.marimoVersion
      ? ` data-marimo-version="${escapeHtmlAttr(rendered.marimoVersion)}"`
      : ""
    const htmlContent = `<div class="marimo-notebook-page" data-marimo-runtime="${escapeHtmlAttr(MARIMO_ISLANDS_VERSION)}"${versionAttr} data-marimo-islands="${rendered.islandCount}" data-marimo-reactive-islands="${rendered.reactiveIslandCount}">${loading}${rendered.body}</div>`
    const tree = fromHtml(htmlContent, { fragment: true })

    const vfile = new VFile("")
    vfile.data = {
      slug,
      relativePath: fp as FilePath,
      filePath: fp as FilePath,
      frontmatter: {
        title,
        tags,
        description,
        cssclasses: ["marimo-page"],
      },
      text: `${title}. ${description}`,
      description,
      links: [],
    }

    content.push([tree, vfile])
  }
}
