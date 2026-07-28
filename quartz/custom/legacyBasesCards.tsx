import type { ComponentChild, JSX } from "preact"
import { transformLink, slugifyPath } from "@quartz-community/utils"
import type { FullSlug } from "@quartz-community/types"

type LinkResolution = "absolute" | "relative" | "shortest"

interface BasesEntry {
  slug: string
  title: string
  properties: Record<string, unknown>
  fileProperties: Record<string, unknown>
  formulaValues: Record<string, unknown>
}

interface GroupBy {
  property: string
  direction?: "ASC" | "DESC"
}

interface BasesView {
  order?: string[]
  image?: string
  cardSize?: number
  imageAspectRatio?: number
  imageFit?: "cover" | "contain"
  cardAspect?: number
  groupBy?: string | GroupBy
  groupSizes?: Record<string, number>
  groupAspects?: Record<string, number>
}

interface BasesData {
  properties?: Record<string, { displayName?: string }>
}

export interface LegacyCardsViewProps {
  entries: BasesEntry[]
  view: BasesView
  basesData: BasesData
  total: number
  locale: string
  slug: string
  allSlugs: string[]
  linkResolution: LinkResolution
}

interface RenderContext {
  slug: string
  allSlugs: string[]
  linkResolution: LinkResolution
}

const HEX_COLOR_RE = /^#(?:[0-9a-f]{3}){1,2}$/i
const IMAGE_WIKILINK_RE = /^\[\[(.+?)(?:\|.*)?\]\]$/
const WIKILINK_RE = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g
const MDLINK_RE = /\[([^\]]*)\]\(([^)]+)\)/g
const URL_RE = /https?:\/\/[^\s<>]+/g

function getNestedValue(value: unknown, path: string[]): unknown {
  let current = value
  for (const segment of path) {
    if (segment === "") continue
    if (Array.isArray(current)) {
      const index = Number(segment)
      if (Number.isNaN(index)) return undefined
      current = current[index]
    } else if (current && typeof current === "object") {
      current = (current as Record<string, unknown>)[segment]
    } else {
      return undefined
    }
  }
  return current
}

export function resolveEntryPropertyValue(column: string, entry: BasesEntry): unknown {
  if (column.startsWith("note.")) {
    return getNestedValue(entry.properties, column.slice(5).split("."))
  }
  if (column.startsWith("file.")) {
    return getNestedValue(entry.fileProperties, column.slice(5).split("."))
  }
  if (column.startsWith("formula.")) {
    return getNestedValue(entry.formulaValues, column.slice(8).split("."))
  }
  return getNestedValue(entry.properties, column.split("."))
}

function isEmptyValue(value: unknown): boolean {
  return (
    value === undefined ||
    value === null ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  )
}

function getColumnLabel(column: string, basesData: BasesData): string {
  const configured = basesData.properties?.[column]?.displayName
  if (configured) return configured

  const segment = column.split(".").pop() ?? column
  return segment
    .split("_")
    .map((part) => (part ? part.charAt(0).toUpperCase() + part.slice(1) : part))
    .join(" ")
}

function renderTextWithLinks(text: string, ctx: RenderContext): ComponentChild[] {
  const segments: { start: number; end: number; node: ComponentChild }[] = []
  const transformOpts = {
    strategy: ctx.linkResolution,
    allSlugs: ctx.allSlugs as FullSlug[],
  }

  for (const match of text.matchAll(WIKILINK_RE)) {
    const target = match[1] ?? ""
    const display = match[2] ?? target
    const href = transformLink(ctx.slug as FullSlug, target, transformOpts)
    segments.push({
      start: match.index ?? 0,
      end: (match.index ?? 0) + match[0].length,
      node: (
        <a href={href} class="internal internal-link">
          {display}
        </a>
      ),
    })
  }

  for (const match of text.matchAll(MDLINK_RE)) {
    const start = match.index ?? 0
    const end = start + match[0].length
    if (segments.some((segment) => start < segment.end && end > segment.start)) continue

    const display = match[1] ?? ""
    const href = match[2] ?? ""
    const external = href.startsWith("http://") || href.startsWith("https://")
    const resolvedHref = external
      ? href
      : String(transformLink(ctx.slug as FullSlug, href, transformOpts))
    segments.push({
      start,
      end,
      node: (
        <a
          href={resolvedHref}
          class={external ? "external external-link" : "internal internal-link"}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {display || href}
        </a>
      ),
    })
  }

  for (const match of text.matchAll(URL_RE)) {
    const start = match.index ?? 0
    const end = start + match[0].length
    if (segments.some((segment) => start < segment.end && end > segment.start)) continue
    segments.push({
      start,
      end,
      node: (
        <a href={match[0]} class="external external-link" target="_blank" rel="noopener noreferrer">
          {match[0]}
        </a>
      ),
    })
  }

  if (segments.length === 0) return [text]
  segments.sort((a, b) => a.start - b.start)

  const result: ComponentChild[] = []
  let cursor = 0
  for (const segment of segments) {
    if (segment.start > cursor) result.push(text.slice(cursor, segment.start))
    result.push(segment.node)
    cursor = segment.end
  }
  if (cursor < text.length) result.push(text.slice(cursor))
  return result
}

function isFileValue(
  value: unknown,
): value is { basename: string; path: string; name: string; folder: string; ext: string } {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false
  const record = value as Record<string, unknown>
  return (
    typeof record.name === "string" &&
    typeof record.basename === "string" &&
    typeof record.path === "string" &&
    typeof record.folder === "string" &&
    typeof record.ext === "string"
  )
}

function renderCellValue(value: unknown, ctx: RenderContext): ComponentChild {
  if (value === null || value === undefined) return <span class="bases-empty">—</span>
  if (typeof value === "boolean") return <input type="checkbox" checked={value} disabled />
  if (typeof value === "number") return <span class="bases-number">{value}</span>
  if (typeof value === "string") {
    return <span class="bases-text">{renderTextWithLinks(value, ctx)}</span>
  }
  if (Array.isArray(value)) {
    return (
      <span class="bases-list">
        {value.map((item, index) => (
          <>
            {index > 0 && <span class="bases-separator">, </span>}
            {renderCellValue(item, ctx)}
          </>
        ))}
      </span>
    )
  }
  if (typeof value === "object") {
    if (isFileValue(value)) {
      const href = transformLink(
        ctx.slug as FullSlug,
        slugifyPath(value.path.replace(/\.md$/, "")),
        transformOpts(ctx),
      )
      return (
        <a href={href} class="internal internal-link">
          {value.basename}
        </a>
      )
    }
    return <code>{JSON.stringify(value)}</code>
  }
  return String(value)
}

function transformOpts(ctx: RenderContext) {
  return {
    strategy: ctx.linkResolution,
    allSlugs: ctx.allSlugs as FullSlug[],
  }
}

function resolveImageSrc(raw: string, ctx: RenderContext): { src: string; isColor: boolean } {
  if (!raw) return { src: "", isColor: false }
  if (HEX_COLOR_RE.test(raw)) return { src: raw, isColor: true }

  const wikiMatch = IMAGE_WIKILINK_RE.exec(raw)
  if (wikiMatch?.[1]) {
    return {
      src: String(transformLink(ctx.slug as FullSlug, wikiMatch[1].trim(), transformOpts(ctx))),
      isColor: false,
    }
  }
  return { src: raw, isColor: false }
}

function cardVariables(size?: number, aspect?: number): JSX.CSSProperties | undefined {
  const style: Record<string, string> = {}
  if (typeof size === "number" && size > 0) style["--base-card-min"] = `${size}px`
  if (typeof aspect === "number" && aspect > 0) style["--base-card-aspect"] = String(aspect)
  return Object.keys(style).length > 0 ? (style as JSX.CSSProperties) : undefined
}

function groupEntries(entries: BasesEntry[], groupBy: string | GroupBy): Map<string, BasesEntry[]> {
  const property = typeof groupBy === "string" ? groupBy : groupBy.property
  const direction = typeof groupBy === "string" ? "ASC" : (groupBy.direction ?? "ASC")
  const grouped = new Map<string, BasesEntry[]>()

  for (const entry of entries) {
    const value = resolveEntryPropertyValue(property, entry)
    const key = value === undefined || value === null || value === "" ? "(empty)" : String(value)
    const group = grouped.get(key) ?? []
    group.push(entry)
    grouped.set(key, group)
  }

  return new Map(
    [...grouped.entries()].sort(([a], [b]) =>
      direction === "DESC" ? b.localeCompare(a) : a.localeCompare(b),
    ),
  )
}

function showingCount(count: number, total: number, locale: string): string {
  const formatter = new Intl.NumberFormat(locale)
  return `Showing ${formatter.format(count)} of ${formatter.format(total)} entries`
}

export const legacyCardsView = ({
  entries,
  view,
  basesData,
  total,
  locale,
  slug,
  allSlugs,
  linkResolution,
}: LegacyCardsViewProps): JSX.Element => {
  const imageProperty = typeof view.image === "string" ? view.image : undefined
  const metadataColumns = (view.order ?? []).filter(
    (column) => column !== imageProperty && column !== "file.name" && column !== "title",
  )
  const aspect = view.imageAspectRatio ?? view.cardAspect
  const imageFit = view.imageFit === "contain" ? "contain" : "cover"
  const ctx: RenderContext = { slug, allSlugs, linkResolution }

  const renderCard = (entry: BasesEntry) => {
    const href = transformLink(slug as FullSlug, entry.slug, transformOpts(ctx))
    const imageValue = imageProperty ? resolveEntryPropertyValue(imageProperty, entry) : undefined
    const { src: imageSrc, isColor } = resolveImageSrc(imageValue ? String(imageValue) : "", ctx)

    return (
      <div class="base-card">
        {imageSrc && (
          <a
            href={href}
            class={`base-card-image-link${isColor ? " base-card-color" : ""}`}
            data-slug={entry.slug}
            style={
              isColor
                ? { backgroundColor: imageSrc }
                : {
                    backgroundImage: `url(${imageSrc})`,
                    backgroundSize: imageFit,
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }
            }
            aria-label={entry.title}
          />
        )}
        <div class="base-card-content">
          <a href={href} class="base-card-title-link" data-slug={entry.slug}>
            <h3 class="base-card-title">{entry.title}</h3>
          </a>
          <div class="base-card-meta">
            {metadataColumns.map((column) => {
              const value = resolveEntryPropertyValue(column, entry)
              if (isEmptyValue(value)) return null
              return (
                <div class="base-card-meta-item">
                  <span class="base-card-meta-label">{getColumnLabel(column, basesData)}</span>
                  <span class="base-card-meta-value">{renderCellValue(value, ctx)}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const defaultVariables = cardVariables(view.cardSize, aspect)
  const cards = view.groupBy ? (
    <div class="base-card-container" style={defaultVariables}>
      {[...groupEntries(entries, view.groupBy)].map(([groupName, group]) => (
        <section class="base-card-group">
          <h3 class="base-card-group-header">{groupName}</h3>
          <div
            class="base-card-grid"
            style={cardVariables(view.groupSizes?.[groupName], view.groupAspects?.[groupName])}
          >
            {group.map(renderCard)}
          </div>
        </section>
      ))}
    </div>
  ) : (
    <div class="base-card-grid" style={defaultVariables}>
      {entries.map(renderCard)}
    </div>
  )

  return (
    <div class="bases-cards-wrapper bases-cards-legacy">
      <div class="bases-view-meta">{showingCount(entries.length, total, locale)}</div>
      {cards}
    </div>
  )
}
