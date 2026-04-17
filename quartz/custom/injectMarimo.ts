import { fromHtml } from "hast-util-from-html"
import { VFile } from "vfile"
import { ProcessedContent } from "../plugins/vfile"
import { FilePath, FullSlug } from "../util/path"
import { glob } from "../util/glob"
import { Argv } from "../util/ctx"
import fs from "fs"

function filenameToTitle(name: string): string {
  return name
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

/** Parse `app_title` from `marimo.App(... app_title="..." ...)` */
function parseAppTitle(src: string): string | null {
  const m = src.match(/marimo\.App\s*\([^)]*app_title\s*=\s*["']([^"']+)["']/)
  return m ? m[1] : null
}

/** Parse a `# description: ...` comment from the top of the file */
function parseDescription(src: string): string | null {
  const m = src.match(/^#\s*description:\s*(.+)$/m)
  return m ? m[1].trim() : null
}

/** Parse `# tags: tag1, tag2` comment */
function parseTags(src: string): string[] {
  const m = src.match(/^#\s*tags:\s*(.+)$/m)
  if (!m) return []
  return m[1].split(",").map((t) => t.trim()).filter(Boolean)
}

export async function injectMarimoPages(
  content: ProcessedContent[],
  argv: Argv,
): Promise<void> {
  const marimoFiles = await glob("**/*.marimo.py", argv.directory, [])

  for (const fp of marimoFiles) {
    const src = `${argv.directory}/${fp}`
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

    // The WASM build lives at /marimo-iframe/<slug>/, served as a separate asset.
    // The Quartz page at /<slug> embeds it via iframe.
    const iframeSrc = `/marimo-iframe/${slug}/`

    // __resizeIframe is shipped inside every marimo WASM export and auto-sizes
    // the iframe once the notebook content is loaded.
    const htmlContent = `<div class="marimo-notebook-page"><iframe src="${iframeSrc}" class="marimo-iframe" id="marimo-frame-${slug.replace(/\//g, "-")}" loading="lazy" title="${title}" allowfullscreen onload="if(typeof this.contentWindow.__resizeIframe==='function')this.contentWindow.__resizeIframe(this)"></iframe></div>`

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
        cssclasses: [],
      },
      text: `${title}. ${description}`,
      description,
      links: [],
    }

    content.push([tree, vfile])
  }
}
