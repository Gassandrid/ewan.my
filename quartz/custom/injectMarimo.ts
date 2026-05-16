import { fromHtml } from "hast-util-from-html"
import { VFile } from "vfile"
import { spawn } from "child_process"
import path from "path"
import fs from "fs"
import { ProcessedContent } from "../plugins/vfile"
import { FilePath, FullSlug } from "../util/path"
import { glob } from "../util/glob"
import { Argv } from "../util/ctx"

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
    from marimo import MarimoIslandGenerator
except ImportError as e:
    print(json.dumps({"error": f"marimo not installed: {e}"}))
    sys.exit(0)
try:
    gen = MarimoIslandGenerator.from_file(sys.argv[1])
    print(json.dumps({"body": gen.render_body()}))
except Exception as e:
    print(json.dumps({"error": f"render failed: {e}"}))
    sys.exit(0)
`

let pythonMissingWarned = false

// Async spawn. `spawnSync` was hitting EBADF on Quartz's hot-reload worker
// context, where Node's internal fd bookkeeping for sync-mode child-process
// allocation breaks. The async variant uses libuv pipes and works reliably.
function renderIsland(notebookPath: string): Promise<string | null> {
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

    child.on("close", () => {
      clearTimeout(timeout)
      try {
        const parsed = JSON.parse(stdout)
        if (parsed.error) {
          console.warn(`[marimo] ${notebookPath}: ${parsed.error}`)
          resolve(null)
          return
        }
        resolve(parsed.body as string)
      } catch {
        console.warn(
          `[marimo] could not parse generator output for ${notebookPath}\nstdout: ${stdout}\nstderr: ${stderr}`,
        )
        resolve(null)
      }
    })
  })
}

export async function injectMarimoPages(
  content: ProcessedContent[],
  argv: Argv,
): Promise<void> {
  const marimoFiles = await glob("**/*.marimo.py", argv.directory, [])
  if (marimoFiles.length === 0) return

  for (const fp of marimoFiles) {
    const src = path.join(argv.directory, fp)
    const slug = fp.replace(/\.marimo\.py$/, "") as FullSlug
    const basename = fp.split("/").pop()!.replace(/\.marimo\.py$/, "")

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

    const body = await renderIsland(src)
    if (!body) continue

    // The `.marimo-loading` block is hidden by CSS once at least one reactive
    // island gets a `data-status` attribute (set by the runtime when its cell
    // is done running). Until then it shows a spinner.
    const loading = `<div class="marimo-loading" aria-live="polite"><span class="marimo-loading-spinner" aria-hidden="true"></span><span class="marimo-loading-text">Loading interactive Python kernel…</span></div>`
    const htmlContent = `<div class="marimo-notebook-page">${loading}${body}</div>`
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
