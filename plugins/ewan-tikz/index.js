import { visit } from "unist-util-visit"
import { load, tex, dvi2svg } from "node-tikzjax"

async function tex2svg(input, showConsole) {
  await load()
  const dvi = await tex(input, {
    texPackages: { pgfplots: "", amsmath: "intlimits" },
    tikzLibraries: "arrows.meta,calc,positioning",
    addToPreamble: "% comment",
    showConsole,
  })
  return dvi2svg(dvi)
}

function parseStyle(meta) {
  if (!meta) return ""
  const styleMatch = meta.match(/style\s*=\s*["']([^"']+)["']/)
  return styleMatch ? styleMatch[1] : ""
}

function docs(node) {
  return JSON.stringify(node.value)
}

function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/"/g, "&quot;")
}

function makeTikzGraph(node, svg, style = "") {
  const styleAttr = style ? ` style="${escapeAttr(style)}"` : ` style=""`

  return `<figure class="tikz" data-remark-tikz="true"${styleAttr}>
<span class="tikz-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">${escapeHtml(
    docs(node),
  )}</annotation></semantics></math></span>
${svg}
<figcaption><em>source code</em><button class="source-code-button" aria-label="copy source code for this tikz graph" title="copy source code for this tikz graph"><svg class="source-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 -4 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"></path><path d="m6 8-4 4 4 4"></path><path d="m14.5 4-5 16"></path></svg><svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 -4 16 16" fill="currentColor" stroke="none" stroke-width="0" stroke-linecap="round" stroke-linejoin="round"><path fill-rule="evenodd" fill="rgb(63, 185, 80)" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg></button></figcaption>
</figure>`
}

export default function EwanTikz(opts = {}) {
  const showConsole = opts.showConsole ?? false

  return {
    name: "EwanTikz",
    markdownPlugins({ argv }) {
      if (argv.watch) return []

      return [
        () => async (tree) => {
          const nodes = []

          visit(tree, "code", (node, index, parent) => {
            if (node.lang !== "tikz") return

            const base64Match = node.meta?.match(/alt\s*=\s*"data:image\/svg\+xml;base64,([^"]+)"/)
            const base64 = base64Match
              ? Buffer.from(base64Match[1], "base64").toString()
              : undefined
            nodes.push({ index, parent, node, base64 })
          })

          for (const { index, parent, node, base64 } of nodes) {
            const svg = base64 ?? (await tex2svg(node.value, showConsole))
            parent.children.splice(index, 1, {
              type: "html",
              value: makeTikzGraph(node, svg, parseStyle(node.meta)),
            })
          }
        },
      ]
    },
    externalResources() {
      return {
        css: [
          {
            content: "https://cdn.jsdelivr.net/npm/node-tikzjax@latest/css/fonts.css",
          },
        ],
      }
    },
  }
}
