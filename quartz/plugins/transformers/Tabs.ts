import { QuartzTransformerPlugin } from "../types"
import { Root } from "mdast"
import { visit } from "unist-util-visit"

function parseTabContent(content: string): Array<[string, string]> {
  const lines = content.split("\n").filter((line) => line.trim())
  const tabs: Array<[string, string]> = []
  let currentLabel: string | null = null
  let currentContent: string[] = []

  for (const line of lines) {
    if (line.startsWith("tab:")) {
      if (currentLabel) {
        tabs.push([currentLabel, currentContent.join("\n")])
        currentContent = []
      }
      currentLabel = line.substring(4).trim()
    } else if (currentLabel) {
      currentContent.push(line)
    }
  }

  if (currentLabel) {
    tabs.push([currentLabel, currentContent.join("\n")])
  }

  return tabs
}

export const Tabs: QuartzTransformerPlugin = () => ({
  name: "Tabs",
  markdownPlugins() {
    return [
      () => (tree: Root, _file) => {
        visit(tree, "code", (node, index, parent) => {
          if (node.lang === "tabs" && parent?.children) {
            const id = Math.random().toString(36).substr(2, 9)
            const tabs = parseTabContent(node.value)

            // Create buttons HTML
            let buttonsHtml = ""
            tabs.forEach(([label, _], index) => {
              const isFirst = index === 0
              const isLast = index === tabs.length - 1
              const borderRadius = isFirst
                ? "border-top-left-radius: 8px;"
                : isLast
                  ? "border-top-right-radius: 8px;"
                  : ""
              buttonsHtml +=
                "<button onclick='showTab" +
                index +
                "()' " +
                "style='flex: 1; padding: 10px; border: none; background-color: #f8f8f8; " +
                "cursor: pointer; " +
                borderRadius +
                "'>" +
                label +
                "</button>"
            })

            // Create content divs
            let contentHtml = ""
            tabs.forEach(([_, content], index) => {
              contentHtml +=
                "<div id='tab" +
                index +
                "' style='padding: 20px; " +
                (index !== 0 ? "display: none;" : "") +
                "'>" +
                content +
                "</div>"
            })

            // Create JavaScript functions
            let functionsJs = ""
            tabs.forEach((_, i) => {
              let hideAllTabs = ""
              tabs.forEach((_, j) => {
                hideAllTabs += "document.getElementById('tab" + j + "').style.display = 'none';"
              })

              functionsJs +=
                "function showTab" +
                i +
                "() {" +
                hideAllTabs +
                "document.getElementById('tab" +
                i +
                "').style.display = 'block';" +
                "const buttons = document.getElementsByTagName('button');" +
                "for (let i = 0; i < buttons.length; i++) {" +
                "buttons[i].style.backgroundColor = '#f8f8f8';" +
                "buttons[i].style.fontWeight = 'normal';" +
                "}" +
                "buttons[" +
                i +
                "].style.backgroundColor = 'white';" +
                "buttons[" +
                i +
                "].style.fontWeight = 'bold';" +
                "}"
            })

            const htmlContent =
              "<div class='tabs-wrapper' style='width: 100%; max-width: 800px;'>" +
              "<div style='background-color: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);'>" +
              "<div style='display: flex; border-bottom: 1px solid #e0e0e0;'>" +
              buttonsHtml +
              "</div>" +
              "<div style='background-color: white; padding: 10px;'>" +
              contentHtml +
              "</div>" +
              "</div>" +
              "</div>" +
              "<script>" +
              functionsJs +
              "showTab0();" +
              "</script>"

            node.type = "html" as "code"
            node.value = htmlContent
          }
        })
      },
    ]
  },
})
