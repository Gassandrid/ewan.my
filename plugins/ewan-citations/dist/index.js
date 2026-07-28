import { visit } from "unist-util-visit"

function isBibliographyLink(node) {
  const href = node?.properties?.href
  return node?.type === "element" && node.tagName === "a" && typeof href === "string"
    ? href.startsWith("#bib")
    : false
}

export default function EwanCitations() {
  return {
    name: "EwanCitations",
    htmlPlugins() {
      return [
        () => (tree) => {
          visit(tree, isBibliographyLink, (node, _index, parent) => {
            node.properties["data-bib"] = true
            node.properties["data-no-popover"] = true

            if (parent?.type === "element") {
              parent.tagName = "cite"
            }
          })
        },
      ]
    },
  }
}
