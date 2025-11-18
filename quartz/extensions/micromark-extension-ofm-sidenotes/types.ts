import type { Node, PhrasingContent } from "mdast"
import type { Point } from "unist"

declare module "micromark-util-types" {
  interface TokenTypeMap {
    sidenote: "sidenote"
    sidenoteMarker: "sidenoteMarker"
    sidenoteKeyword: "sidenoteKeyword"
    sidenotePropertiesMarker: "sidenotePropertiesMarker"
    sidenoteProperties: "sidenoteProperties"
    sidenotePropertiesChunk: "sidenotePropertiesChunk"
    sidenoteLabelMarker: "sidenoteLabelMarker"
    sidenoteLabel: "sidenoteLabel"
    sidenoteLabelChunk: "sidenoteLabelChunk"
    sidenoteColonMarker: "sidenoteColonMarker"
    sidenoteContent: "sidenoteContent"
    sidenoteContentChunk: "sidenoteContentChunk"
  }
}

export interface SidenoteData {
  raw: string
  properties?: Record<string, string | string[]>
  label?: string
  content: string
}

export interface Sidenote extends Node {
  type: "sidenote"
  value: string
  data?: {
    sidenoteParsed?: SidenoteData
    hName?: string
    hProperties?: Record<string, any>
    hChildren?: any[]
  }
  children: PhrasingContent[]
  position?: { start: Point; end: Point }
}
