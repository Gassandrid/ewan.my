import { QuartzEmitterPlugin } from "../types"
import { QuartzComponent, QuartzComponentProps } from "../../components/types"
import { pageResources, renderPage } from "../../components/renderPage"
import { ProcessedContent } from "../vfile"
import { FullPageLayout } from "../../cfg"
import { FilePath, FullSlug, joinSegments, pathToRoot } from "../../util/path"
import { sharedPageComponents } from "../../../quartz.layout"
import { write } from "./helpers"
import { BuildCtx } from "../../util/ctx"
import { StaticResources } from "../../util/resources"
import { styleText } from "node:util"
import fs from "node:fs/promises"
import { defaultListPageLayout } from "../../../quartz.layout"

// for extracting HTML
function extractHtmlFromMarkdown(content: string): string {
  const htmlCodeBlockRegex = /```html\s*\n([\s\S]*?)\n```/g
  let extractedHtml = ""
  let match

  while ((match = htmlCodeBlockRegex.exec(content)) !== null) {
    extractedHtml += match[1] + "\n"
  }

  return extractedHtml.trim()
}

//renderer
const RawHtml: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  return {
    type: "raw",
    value: fileData.frontmatter?.html_content ?? "",
  }
}

export const HtmlMarkdownEmitter: QuartzEmitterPlugin<Partial<FullPageLayout>> = (userOpts) => {
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    ...defaultListPageLayout,
    ...userOpts,
  }

  return {
    name: "HtmlMarkdownEmitter",
    getQuartzComponents() {
      return [RawHtml]
    },
    async *emit(ctx: BuildCtx, content: ProcessedContent[], resources: StaticResources) {
      const allFiles = content.map((c) => c[1].data)
      const htmlFiles = content.filter((c) => c[1].data.slug?.endsWith(".html"))

      for (const [tree, file] of htmlFiles) {
        const slug = file.data.slug! as FullSlug
        const src = file.data.filePath! as FilePath

        try {
          const fileContent = await fs.readFile(src, "utf-8")
          const htmlContent = extractHtmlFromMarkdown(fileContent)

          if (!htmlContent) {
            console.warn(styleText("yellow", `No HTML code blocks in ${file.data.filePath}`))
            continue
          }

          file.data.frontmatter.html_content = htmlContent

          const componentData: QuartzComponentProps = {
            ctx,
            fileData: file.data,
            externalResources: pageResources(pathToRoot(slug), resources),
            cfg: ctx.cfg.configuration,
            children: [],
            tree,
            allFiles,
          }

          const layout: FullPageLayout = {
            ...opts,
            pageBody: RawHtml,
          }

          const renderedContent = renderPage(
            ctx.cfg.configuration,
            slug,
            componentData,
            layout,
            pageResources(pathToRoot(slug), resources),
          )

          const dest = joinSegments(
            ctx.argv.output,
            (slug.replace(/\/$/, "") + ".html") as FilePath,
          )

          yield write({
            ctx,
            content: renderedContent,
            slug,
            ext: ".html",
          })

          console.log(styleText("green", `✓ Emitted HTML page: ${dest}`))
        } catch (err) {
          console.error(styleText("red", `\n[HtmlMarkdownEmitter] Error processing ${src}:`), err)
          continue
        }
      }
    },
  }
}
