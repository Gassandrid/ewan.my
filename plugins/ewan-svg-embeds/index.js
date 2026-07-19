import path from "node:path"
import { joinSegments, pathToRoot } from "@quartz-community/utils"
import { visit } from "unist-util-visit"

function basename(value) {
  return value.slice(value.lastIndexOf("/") + 1).toLowerCase()
}

export function buildSvgIndex(slugs) {
  const candidates = new Map()
  for (const slug of slugs) {
    if (!String(slug).toLowerCase().endsWith(".svg")) continue
    const key = basename(String(slug))
    const matches = candidates.get(key) ?? []
    matches.push(String(slug))
    candidates.set(key, matches)
  }

  const unique = new Map()
  for (const [key, matches] of candidates) {
    if (matches.length === 1) unique.set(key, matches[0])
  }
  return unique
}

export function resolveSvgObjects(html, slug, svgIndex) {
  const base = pathToRoot(slug)
  return html.replace(
    /(<object\b[^>]*\bdata=["'])([^"']+\.svg)(["'])/gi,
    (match, open, value, close) => {
      if (/^(?:[a-z]+:|\/|\.\.\/|\.\/)/i.test(value) || value.includes("/")) return match
      const target = svgIndex.get(basename(value))
      if (!target) return match
      return `${open}${joinSegments(base, target)}${close}`
    },
  )
}

export default function EwanSvgEmbeds() {
  return {
    name: "EwanSvgEmbeds",
    markdownPlugins(ctx) {
      const svgIndex = buildSvgIndex(ctx.allSlugs)
      return [
        () => (tree, file) => {
          const slug = String(file.data.slug ?? path.basename(file.path, path.extname(file.path)))
          visit(tree, "html", (node) => {
            node.value = resolveSvgObjects(node.value, slug, svgIndex)
          })
        },
      ]
    },
  }
}
