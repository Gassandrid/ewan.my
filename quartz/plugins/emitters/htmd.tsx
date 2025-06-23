import { QuartzEmitterPlugin } from "../types"
import { QuartzComponent, QuartzComponentProps } from "../../components/types"
import { pageResources, renderPage } from "../../components/renderPage"
import { ProcessedContent } from "../vfile"
import { FullPageLayout } from "../../cfg"
import { FilePath, FullSlug, joinSegments, pathToRoot } from "../../util/path"
import { sharedPageComponents, defaultListPageLayout } from "../../../quartz.layout"
import { write } from "./helpers"
import { BuildCtx } from "../../util/ctx"
import { StaticResources } from "../../util/resources"
import { styleText } from "node:util"
import fs from "node:fs/promises"
import { Root as HastRoot } from "hast"

// Extract the first HTML code block from markdown content
function extractHtmlFromMarkdown(content: string): string {
  const htmlCodeBlockRegex = /```html\s*\n([\s\S]*?)\n```/m
  const match = htmlCodeBlockRegex.exec(content)
  return match ? match[1].trim() : ""
}

// Component to render raw HTML from frontmatter
const RawHtml: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  return <div dangerouslySetInnerHTML={{ __html: String(fileData.frontmatter?.html_content ?? "") }} />
}

export const HtmlMarkdownEmitter: QuartzEmitterPlugin = () => {
  const opts = {
    head: () => null,
    header: [],
    beforeBody: [],
    pageBody: RawHtml,
    afterBody: [],
    left: [],
    right: [],
    footer: () => null,
  }

  return {
    name: "HtmlMarkdownEmitter",
    getQuartzComponents() {
      return [RawHtml]
    },
    async *emit(ctx: BuildCtx, content: ProcessedContent[], resources: StaticResources) {
      // Only process files with fileClass: page
      const htmlFiles = content.filter((c) => {
        const fm = c[1].data.frontmatter
        return fm && typeof fm === "object" && fm.fileClass === "page"
      })

      for (const [tree, file] of htmlFiles) {
        const slug = file.data.slug! as FullSlug
        const src = file.data.filePath! as FilePath

        // Output slug: if ends with .md, strip it
        const outputSlug = (slug.endsWith('.md') ? slug.slice(0, -3) : slug) as FullSlug

        // Extract HTML code block
        const fileContent = await fs.readFile(src, "utf-8")
        const htmlContent = extractHtmlFromMarkdown(fileContent)
        console.log(`[HtmlMarkdownEmitter] Processing: ${src}`)
        console.log(`[HtmlMarkdownEmitter] Output slug: ${outputSlug}`)
        if (!htmlContent) {
          console.warn(`[HtmlMarkdownEmitter] No HTML block found in ${src}`)
        } else {
          console.log(`[HtmlMarkdownEmitter] Extracted HTML:`, htmlContent)
        }

        // Set frontmatter for rendering
        if (!file.data.frontmatter || typeof file.data.frontmatter !== "object") {
          file.data.frontmatter = { title: outputSlug.split("/").pop() || "Untitled" }
        }
        file.data.frontmatter.html_content = htmlContent

        // Only pass an empty tree so nothing else is rendered
        const componentData: QuartzComponentProps = {
          ctx,
          fileData: file.data,
          externalResources: pageResources(pathToRoot(outputSlug), resources),
          cfg: ctx.cfg.configuration,
          children: [],
          tree: { type: "root", children: [] } as HastRoot,
          allFiles: content.map((c) => c[1].data),
        }

        const renderedContent = renderPage(
          ctx.cfg.configuration,
          outputSlug,
          componentData,
          opts,
          pageResources(pathToRoot(outputSlug), resources),
        )

        const dest = joinSegments(
          ctx.argv.output,
          ((outputSlug as string).replace(/\/$/, "") + ".html") as FilePath,
        )

        yield write({
          ctx,
          content: renderedContent,
          slug: outputSlug,
          ext: ".html",
        })

        console.log(`[HtmlMarkdownEmitter] Wrote: ${dest}`)
      }
    },
  }
}
