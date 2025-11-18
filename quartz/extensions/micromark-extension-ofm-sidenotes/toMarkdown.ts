import type { Options } from "mdast-util-to-markdown"
import type { Sidenote } from "./types"

export function sidenoteToMarkdown(): Options {
  return {
    handlers: {
      sidenote: handleSidenote as any,
    } as any,
    unsafe: [
      { character: "{", inConstruct: ["phrasing"] },
      { character: "}", inConstruct: ["phrasing"] },
    ],
  }
}

function handleSidenote(node: Sidenote, _: any, state: any, info: any): string {
  const parsed = node.data?.sidenoteParsed

  if (!parsed) {
    return node.value || ""
  }

  let output = "{{sidenotes"

  if (parsed.properties && Object.keys(parsed.properties).length > 0) {
    const props = Object.entries(parsed.properties)
      .map(([k, v]) => {
        if (Array.isArray(v)) {
          return `${k}: ${v.join(", ")}`
        }
        return `${k}: ${v}`
      })
      .join(", ")
    output += `<${props}>`
  }

  if (parsed.label) {
    output += `[${parsed.label}]`
  }

  output += ": "

  const exit = state.enter("sidenote")
  output += state.containerPhrasing(node, info)
  exit()

  output += "}}"

  return output
}
