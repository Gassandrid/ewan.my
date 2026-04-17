import { spawnSync } from "child_process"
import fs from "fs"
import path from "path"
import { glob } from "../../util/glob"
import { QuartzEmitterPlugin } from "../types"
import { joinSegments } from "../../util/path"
import { FilePath } from "../../util/path"

export interface MarimoNotebookOptions {
  /**
   * Glob pattern for marimo notebook files, relative to the content directory.
   * Default: "**\/*.marimo.py"
   */
  pattern: string
  /**
   * Extra CLI flags passed verbatim to `marimo export html-wasm`.
   * E.g. ["--no-show-code"] for app mode (hides code cells).
   * Default: [] (code cells visible, notebook mode)
   */
  exportFlags: string[]
}

const defaultOptions: MarimoNotebookOptions = {
  pattern: "**/*.marimo.py",
  // run mode + show-code: clean page-like output, code visible but read-only
  exportFlags: ["--mode", "run", "--show-code", "-f"],
}

const THEME_CSS_PATH = path.join("quartz", "styles", "custom", "marimo-theme.css")

async function readThemeCSS(): Promise<string> {
  try {
    return await fs.promises.readFile(THEME_CSS_PATH, "utf-8")
  } catch {
    console.warn("[MarimoNotebook] Could not read marimo-theme.css — skipping theme injection")
    return ""
  }
}

async function compileNotebook(
  src: string,
  outDir: string,
  exportFlags: string[],
): Promise<boolean> {
  const result = spawnSync("marimo", ["export", "html-wasm", src, "-o", outDir, ...exportFlags], {
    encoding: "utf-8",
    timeout: 300_000, // 5 min per notebook
  })

  if (result.error) {
    const msg = (result.error as NodeJS.ErrnoException).code === "ENOENT"
      ? "marimo not found — install it with: pip install marimo"
      : result.error.message
    console.error(`[MarimoNotebook] ${msg}`)
    return false
  }

  if (result.status !== 0) {
    const stderr = result.stderr?.trim() ?? ""
    console.error(`[MarimoNotebook] marimo export failed for ${src}:\n${stderr}`)
    return false
  }

  return true
}

async function injectThemeCSS(outDir: string, themeCSS: string): Promise<void> {
  if (!themeCSS) return
  const indexPath = path.join(outDir, "index.html")
  try {
    let html = await fs.promises.readFile(indexPath, "utf-8")
    html = html.replace(
      "</head>",
      `<style id="quartz-marimo-theme">\n${themeCSS}\n</style>\n</head>`,
    )
    await fs.promises.writeFile(indexPath, html)
  } catch {
    console.warn(`[MarimoNotebook] Could not inject CSS into ${indexPath}`)
  }
}

async function* yieldOutputFiles(outDir: string): AsyncGenerator<FilePath> {
  const files = await glob("**", outDir, [])
  for (const f of files) {
    yield path.join(outDir, f) as FilePath
  }
}

export const MarimoNotebook: QuartzEmitterPlugin<Partial<MarimoNotebookOptions>> = (
  userOpts,
) => {
  const opts = { ...defaultOptions, ...userOpts }

  return {
    name: "MarimoNotebook",

    async *emit({ argv }) {
      const notebooks = await glob(opts.pattern, argv.directory, [])

      if (notebooks.length === 0) return

      const themeCSS = await readThemeCSS()

      for (const fp of notebooks) {
        const src = joinSegments(argv.directory, fp)
        // Strip .marimo.py to get the URL slug, mirror the content directory structure
        const slug = fp.replace(/\.marimo\.py$/, "")
        const outDir = joinSegments(argv.output, "marimo-iframe", slug)

        console.log(`[MarimoNotebook] Compiling ${fp}…`)

        await fs.promises.mkdir(outDir, { recursive: true })

        const ok = await compileNotebook(src, outDir, opts.exportFlags)
        if (!ok) continue

        await injectThemeCSS(outDir, themeCSS)

        console.log(`[MarimoNotebook] Built → ${slug}/`)
        yield* yieldOutputFiles(outDir)
      }
    },

    async *partialEmit({ argv }, _content, _resources, changeEvents) {
      const themeCSS = await readThemeCSS()

      for (const event of changeEvents) {
        if (!event.path.endsWith(".marimo.py")) continue
        if (event.type === "delete") continue

        const src = joinSegments(argv.directory, event.path)
        const slug = event.path.replace(/\.marimo\.py$/, "")
        const outDir = joinSegments(argv.output, "marimo-iframe", slug)

        console.log(`[MarimoNotebook] Recompiling ${event.path}…`)

        await fs.promises.mkdir(outDir, { recursive: true })

        const ok = await compileNotebook(src, outDir, opts.exportFlags)
        if (!ok) continue

        await injectThemeCSS(outDir, themeCSS)
        yield* yieldOutputFiles(outDir)
      }
    },
  }
}
