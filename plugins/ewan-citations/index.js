import { visit } from "unist-util-visit"

const URL_PATTERN = /https?:\/\/[^\s<>)"]+/g

const EXTERNAL_LINK_TYPES = [
  {
    label: "[arXiv]",
    matches: (url) => arxivId(url) !== null,
  },
  {
    label: "[lesswrong]",
    matches: (url) => url.toLowerCase().includes("lesswrong.com"),
  },
  {
    label: "[GitHub]",
    matches: (url) => url.toLowerCase().includes("github.com"),
  },
  {
    label: "[transformer circuit]",
    matches: (url) => url.toLowerCase().includes("transformer-circuits.pub"),
  },
  {
    label: "[alignment forum]",
    matches: (url) => url.toLowerCase().includes("alignmentforum.org"),
  },
]

function text(value) {
  return { type: "text", value }
}

function element(tagName, properties = {}, children = []) {
  return { type: "element", tagName, properties, children }
}

function arxivId(url) {
  const match = url.match(/arxiv\.org\/(?:abs|pdf)\/([^?#\s]+)/i)
  if (!match) return null
  return match[1].replace(/\.pdf$/i, "").replace(/v\d+$/i, "")
}

function externalLink(url) {
  const type = EXTERNAL_LINK_TYPES.find(({ matches }) => matches(url))
  return element(
    "a",
    {
      className: ["csl-external-link"],
      href: url,
      target: "_blank",
      rel: ["noopener", "noreferrer"],
    },
    [text(type?.label ?? url)],
  )
}

function formatTextNode(node) {
  const matches = [...node.value.matchAll(URL_PATTERN)]
  if (matches.length === 0) return [node]

  const children = []
  let cursor = 0
  for (const match of matches) {
    const url = match[0]
    const start = match.index
    if (start > cursor) children.push(text(node.value.slice(cursor, start)))

    const id = arxivId(url)
    if (id) children.push(text(`arXiv preprint arXiv:${id} `))
    children.push(externalLink(url))
    cursor = start + url.length
  }

  if (cursor < node.value.length) children.push(text(node.value.slice(cursor)))
  return children
}

function formatReferenceNodes(nodes) {
  return nodes.flatMap((node) => {
    if (node.type === "text") return formatTextNode(node)
    if (node.type === "element") {
      return [{ ...node, children: formatReferenceNodes(node.children ?? []) }]
    }
    return [node]
  })
}

function isBibliographyLink(node) {
  const href = node?.properties?.href
  return node?.type === "element" && node.tagName === "a" && typeof href === "string"
    ? href.startsWith("#bib")
    : false
}

function hasClass(node, className) {
  const classes = node?.properties?.className
  return node?.type === "element" && Array.isArray(classes) && classes.includes(className)
}

export function formatBibliography(tree) {
  visit(
    tree,
    (node) => hasClass(node, "references"),
    (node, index, parent) => {
      if (index === undefined || (parent?.type !== "element" && parent?.type !== "root")) {
        return
      }

      const entries = []
      visit(
        node,
        (candidate) => hasClass(candidate, "csl-entry"),
        (entry) => {
          entries.push(
            element("li", { ...entry.properties }, formatReferenceNodes(entry.children ?? [])),
          )
        },
      )

      if (entries.length === 0) return
      parent.children.splice(
        index,
        1,
        element("section", { className: ["bibliography"], dataReferences: "" }, [
          element("h2", { id: "reference-label" }, [text("Bibliography")]),
          element("ul", {}, entries),
        ]),
      )
    },
  )
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
        () => formatBibliography,
      ]
    },
  }
}
