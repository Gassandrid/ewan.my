import path from "path"
import isAbsoluteUrl from "is-absolute-url"

import {
  FilePath,
  FullSlug,
  getFileExtension,
  slugAnchor,
  slugifyFilePath,
  splitAnchor,
  stripSlashes,
} from "./path"
import {
  WikilinkData,
  Wikilink,
} from "../extensions/micromark-extension-ofm-wikilinks/fromMarkdown"

export type { WikilinkData, Wikilink }

// !?                 -> optional embedding
// \[\[               -> open brace
// ([^\[\]\|\#]+)     -> one or more non-special characters ([,],|, or #) (name)
// (#[^\[\]\|\#]+)?   -> # then one or more non-special characters (heading link)
// (\\?\|[^\[\]\#]+)? -> optional escape \ then | then zero or more non-special characters (alias)
export const WIKILINK_PATTERN = /!?\[\[([^\[\]\|#\\]+)?(#+[^\[\]\|#\\]+)?(\\?\|[^\[\]#]*)?\]\]/

/**
 * Create a fresh wikilink regex. Consumers should prefer using this helper instead of sharing
 * a singleton RegExp to avoid `lastIndex` state across different callers.
 */
export function createWikilinkRegex(flags: string = "g"): RegExp {
  const normalizedFlags = Array.from(new Set((flags + "g").split(""))).join("")
  return new RegExp(WIKILINK_PATTERN.source, normalizedFlags)
}

export const singleWikilinkRegex = new RegExp(`^${WIKILINK_PATTERN.source}$`, "i")

export function parseWikilink(raw: string): WikilinkData | null {
  const trimmed = raw.trim()
  const match = trimmed.match(singleWikilinkRegex)
  if (!match) {
    return null
  }

  const isEmbed = trimmed.startsWith("!")

  const [, rawFp, rawHeader, rawAlias] = match

  const [_target, anchor] = splitAnchor(`${rawFp ?? ""}${rawHeader ?? ""}`)
  const blockRef = rawHeader?.startsWith("#^") ? "^" : ""
  const displayAnchor = anchor ? `#${blockRef}${anchor.trim().replace(/^#+/, "")}` : undefined
  const alias = rawAlias ? rawAlias.replace(/^\\?\|/, "") : undefined

  return {
    raw: trimmed,
    target: rawFp ?? "",
    anchor: displayAnchor,
    alias,
    embed: isEmbed,
  }
}

export function extractWikilinks(text: string): WikilinkData[] {
  const links: WikilinkData[] = []
  const regex = createWikilinkRegex()
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    const parsed = parseWikilink(match[0])
    if (parsed) {
      links.push(parsed)
    }
  }

  return links
}

export interface ResolvedWikilinkTarget {
  slug: FullSlug
  anchor?: string
}

function ensureFilePath(target: string): FilePath {
  if (target.length === 0) {
    return "index.md" as FilePath
  }

  if (target.endsWith("/")) {
    return `${target}index.md` as FilePath
  }

  const ext = getFileExtension(target as FilePath)
  if (ext) {
    return target as FilePath
  }

  return `${target}.md` as FilePath
}

export function resolveWikilinkTarget(
  link: WikilinkData,
  currentSlug: FullSlug,
): ResolvedWikilinkTarget | null {
  const baseSlug = stripSlashes(currentSlug)

  if (link.target && isAbsoluteUrl(link.target, { httpOnly: false })) {
    return null
  }

  const normalizedTarget = link.target?.replace(/\\/g, "/") ?? ""

  let combined: string

  if (normalizedTarget.startsWith("/")) {
    combined = normalizedTarget.slice(1)
  } else if (normalizedTarget.length === 0) {
    combined = baseSlug
  } else {
    const dir = path.posix.dirname(baseSlug)
    const baseDir = dir === "." ? "" : dir
    combined = path.posix.join(baseDir, normalizedTarget)
  }

  let normalized = path.posix.normalize(combined)
  while (normalized.startsWith("../")) {
    normalized = normalized.slice(3)
  }
  if (normalized.startsWith("./")) {
    normalized = normalized.slice(2)
  }

  const filePath = ensureFilePath(normalized)
  const slug = slugifyFilePath(stripSlashes(filePath) as FilePath)

  return {
    slug,
    anchor: link.anchor,
  }
}

export function stripWikilinkFormatting(text: string): string {
  if (!text) {
    return text
  }

  return text.replace(createWikilinkRegex(), (value) => {
    const parsed = parseWikilink(value)
    if (!parsed) return value
    return parsed.alias ?? parsed.target
  })
}

/**
 * Resolve wikilink anchor text to a heading slug.
 *
 * Matches Obsidian's behavior:
 * - LaTeX normalization: "architectural skeleton of $ mu$" → "architectural-skeleton-of-mu"
 * - Nested paths: "Parent#Child#Grandchild" uses only the last segment ("Grandchild")
 * - No validation of document structure or parent/child relationships
 *
 * The browser handles anchor navigation - we just normalize the text to match
 * the slugs that github-slugger produces for headings.
 *
 * @param anchorText - The anchor portion of a wikilink (e.g., "section" or "Parent#Child")
 * @returns The normalized slug (e.g., "section" or "child")
 *
 * @example
 * resolveAnchor("Section") → "section"
 * resolveAnchor("NVIDIA#cuda") → "cuda"
 * resolveAnchor("architectural skeleton of $ mu$") → "architectural-skeleton-of-mu"
 * resolveAnchor("Parent#Child#Grandchild") → "grandchild"
 */
export function resolveAnchor(anchorText: string): string {
  // if anchor contains #, take the last segment (Obsidian behavior)
  let text = anchorText.trim()
  if (text.includes("#")) {
    const segments = text.split("#")
    text = segments[segments.length - 1].trim()
  }
  // slugify using github-slugger (same as heading slugs)
  return slugAnchor(text)
}

/**
 * escape wikilinks in table context.
 * obsidian requires escaping pipes and hashes inside table cells.
 *
 * @param wikilink - raw wikilink string
 * @returns escaped wikilink suitable for tables
 */
export function escapeWikilinkForTable(wikilink: string): string {
  let escaped = wikilink
  // escape hash for headers
  escaped = escaped.replace("#", "\\#")
  // escape pipe characters if not already escaped
  // regex: match pipe that's not preceded by backslash (or preceded by even number of backslashes)
  escaped = escaped.replace(/((^|[^\\])(\\\\)*)\|/g, "$1\\|")
  return escaped
}
