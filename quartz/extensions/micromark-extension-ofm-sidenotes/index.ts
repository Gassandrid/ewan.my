import type { Processor } from "unified"
import type { Root } from "mdast"
import type { Extension as MicromarkExtension } from "micromark-util-types"
import type { Extension as MdastExtension } from "mdast-util-from-markdown"
import { sidenote } from "./syntax"
import { sidenoteFromMarkdown, type FromMarkdownOptions } from "./fromMarkdown"
import { sidenoteToMarkdown } from "./toMarkdown"

export { sidenote, sidenoteFromMarkdown, sidenoteToMarkdown }
export type { Sidenote, SidenoteData } from "./types"

export interface RemarkSidenoteOptions {
  micromarkExtensions?: MicromarkExtension[]
  mdastExtensions?: MdastExtension[]
}

export function remarkSidenote(this: Processor<Root>, options: RemarkSidenoteOptions = {}): void {
  const data = this.data()

  const micromarkExtensions = (data.micromarkExtensions ||
    (data.micromarkExtensions = [])) as MicromarkExtension[]
  const fromMarkdownExtensions = (data.fromMarkdownExtensions ||
    (data.fromMarkdownExtensions = [])) as MdastExtension[]

  micromarkExtensions.push(sidenote())

  const fromMarkdownOpts: FromMarkdownOptions = {
    micromarkExtensions: options.micromarkExtensions || micromarkExtensions,
    mdastExtensions: options.mdastExtensions || fromMarkdownExtensions,
  }

  fromMarkdownExtensions.push(sidenoteFromMarkdown(fromMarkdownOpts))
}
