declare module "@citation-js/core" {
  export class Cite {
    constructor(data: string | any, options?: { generateGraph?: boolean })
    data: any[]
    format(format: string): string
  }
}

declare module "@citation-js/plugin-bibtex"
declare module "@citation-js/plugin-doi"
