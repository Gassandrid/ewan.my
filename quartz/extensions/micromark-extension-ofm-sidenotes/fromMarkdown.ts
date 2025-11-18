import type { Extension as MdastExtension, CompileContext, Token } from "mdast-util-from-markdown"
import type { Extension as MicromarkExtension } from "micromark-util-types"
import type { Sidenote } from "./types"
import { fromMarkdown } from "mdast-util-from-markdown"
import type { PhrasingContent, Paragraph } from "mdast"

export interface FromMarkdownOptions {
  micromarkExtensions?: MicromarkExtension[]
  mdastExtensions?: MdastExtension[]
}

export function sidenoteFromMarkdown(options: FromMarkdownOptions = {}): MdastExtension {
  const micromarkExts = options.micromarkExtensions || []
  const mdastExts = options.mdastExtensions || []

  return {
    enter: {
      sidenote: enterSidenote,
      sidenoteProperties: enterProperties,
      sidenoteLabel: enterLabel,
      sidenoteContent: enterContent,
    },
    exit: {
      sidenote: exitSidenote,
      sidenotePropertiesChunk: exitPropertiesChunk,
      sidenoteProperties: exitProperties,
      sidenoteLabelChunk: exitLabelChunk,
      sidenoteLabel: exitLabel,
      sidenoteContentChunk: exitContentChunk,
      sidenoteContent: exitContent,
    },
  }

  function enterSidenote(this: CompileContext, token: Token): undefined {
    const node: Sidenote = {
      type: "sidenote",
      value: "",
      children: [],
      data: {
        sidenoteParsed: {
          raw: "",
          content: "",
        },
      },
    }
    this.enter(node as any, token)
    return undefined
  }

  function exitSidenote(this: CompileContext, token: Token): undefined {
    const node = this.stack[this.stack.length - 1] as any as Sidenote

    if (node) {
      node.value = this.sliceSerialize(token)

      if (node.data?.sidenoteParsed) {
        node.data.sidenoteParsed.raw = node.value
      }
    }

    this.exit(token)
    return undefined
  }

  function enterProperties(this: CompileContext): undefined {
    return undefined
  }

  function exitPropertiesChunk(this: CompileContext, token: Token): undefined {
    const node = this.stack[this.stack.length - 1] as any as Sidenote
    if (!node || !node.data?.sidenoteParsed) return undefined

    const raw = this.sliceSerialize(token)
    const parsed = parseProperties(raw)
    node.data.sidenoteParsed.properties = parsed
    return undefined
  }

  function exitProperties(this: CompileContext): undefined {
    return undefined
  }

  function enterLabel(this: CompileContext): undefined {
    return undefined
  }

  function exitLabelChunk(this: CompileContext, token: Token): undefined {
    const node = this.stack[this.stack.length - 1] as any as Sidenote
    if (!node || !node.data?.sidenoteParsed) return undefined

    const raw = this.sliceSerialize(token)
    node.data.sidenoteParsed.label = raw
    return undefined
  }

  function exitLabel(this: CompileContext): undefined {
    return undefined
  }

  function enterContent(this: CompileContext): undefined {
    return undefined
  }

  function exitContentChunk(this: CompileContext, token: Token): undefined {
    const node = this.stack[this.stack.length - 1] as any as Sidenote
    if (!node || !node.data?.sidenoteParsed) return undefined

    const contentRaw = this.sliceSerialize(token)
    node.data.sidenoteParsed.content = contentRaw
    return undefined
  }

  function exitContent(this: CompileContext): undefined {
    const node = this.stack[this.stack.length - 1] as any as Sidenote
    const contentRaw = node.data?.sidenoteParsed?.content || ""

    if (node.data?.sidenoteParsed) {
      try {
        const contentTree = fromMarkdown(contentRaw, {
          extensions: micromarkExts,
          mdastExtensions: mdastExts,
        })

        const children: PhrasingContent[] = []
        for (const child of contentTree.children) {
          if (child.type === "paragraph") {
            children.push(...((child as Paragraph).children as PhrasingContent[]))
          } else if (isPhrasingContent(child)) {
            children.push(child as PhrasingContent)
          }
        }

        node.children = children
      } catch (e) {
        node.children = [{ type: "text", value: contentRaw }]
      }
    }

    return undefined
  }
}

function parseProperties(raw: string): Record<string, string | string[]> {
  const props: Record<string, string | string[]> = {}

  const regex = /(\w+)\s*:\s*((?:\[\[[^\]]+\]\]\s*,?\s*)+|[^,]+?)(?=\s*,\s*\w+\s*:|$)/g
  let match: RegExpExecArray | null

  while ((match = regex.exec(raw)) !== null) {
    const key = match[1]?.trim()
    if (!key) continue

    const value = (match[2] ?? "").trim()

    if (value.includes("[[")) {
      const wikilinks = value.match(/\[\[[^\]]+\]\]/g) || []
      props[key] = wikilinks.length > 0 ? wikilinks : value
    } else {
      props[key] = value
    }
  }

  return props
}

function isPhrasingContent(node: any): boolean {
  const phrasingTypes = new Set([
    "text",
    "emphasis",
    "strong",
    "delete",
    "inlineCode",
    "break",
    "link",
    "image",
    "linkReference",
    "imageReference",
    "html",
  ])
  return phrasingTypes.has(node.type)
}
