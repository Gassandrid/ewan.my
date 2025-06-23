import { QuartzTransformerPlugin } from "../types"
import { visit } from "unist-util-visit"
import { Root } from "mdast"

export const HtmlBlockToFrontmatter: QuartzTransformerPlugin = () => {
  return {
    name: "HtmlBlockToFrontmatter",
    markdownPlugins() {
      return [
        () => (tree: Root, file) => {
          const fm = file.data.frontmatter
          if (fm && typeof fm === "object" && fm.fileClass === "page") {
            let found = false
            visit(tree, "code", (node, index, parent) => {
              if (!found && node.lang === "html" && parent && typeof index === "number") {
                found = true
                const htmlContent = node.value
                fm.html_content = htmlContent
                // Replace the entire tree with a single html node
                tree.children = [
                  {
                    type: "html",
                    value: htmlContent,
                  } as any,
                ]
                console.log(`[HtmlBlockToFrontmatter] Replaced page content for ${file.data.slug} with HTML block.`)
              }
            })
            if (!found) {
              fm.html_content = ""
              console.warn(`[HtmlBlockToFrontmatter] No HTML block found in ${file.data.slug}`)
            }
          }
        },
      ]
    },
  }
} 