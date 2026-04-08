import { render } from "preact-render-to-string"
import { fromHtml } from "hast-util-from-html"
import { VFile } from "vfile"
import { ProcessedContent } from "../plugins/vfile"
import { FilePath, FullSlug } from "../util/path"
import customPages from "./pages"

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
}

export function injectCustomPages(content: ProcessedContent[]): void {
  for (const pageDef of customPages) {
    const jsx = pageDef.body()
    const htmlString = render(jsx)
    const tree = fromHtml(htmlString, { fragment: true })

    const vfile = new VFile("")
    const cssclasses: string[] = []
    if (pageDef.fullWidth) cssclasses.push("full-width")

    vfile.data = {
      slug: pageDef.slug as FullSlug,
      relativePath: `custom/${pageDef.slug}.tsx` as FilePath,
      filePath: `custom/${pageDef.slug}.tsx` as FilePath,
      frontmatter: {
        title: pageDef.title,
        tags: pageDef.tags ?? [],
        description: pageDef.description ?? "",
        cssclasses,
      },
      text: stripHtml(htmlString),
      description: pageDef.description ?? "",
      links: [],
    }

    content.push([tree, vfile])
  }
}
