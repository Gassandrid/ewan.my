import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"
import { pageResources, renderPage } from "../../components/renderPage"
import { FullPageLayout } from "../../cfg"
import { BuildCtx } from "../../util/ctx"
import {
  pathToRoot,
  resolveRelative,
  FullSlug,
  joinSegments,
  FilePath,
  slugifyFilePath,
  simplifySlug,
  splitAnchor,
  isAbsoluteURL,
} from "../../util/path"
import { defaultContentPageLayout, sharedPageComponents } from "../../../quartz.layout"
import { Content, BaseSearchBar, BaseViewSelector } from "../../components"
import { write } from "./helpers"
import {
  evaluateFilter,
  resolvePropertyValue,
  evaluateFormula,
  computeViewSummaries,
} from "../../util/base/query"
import {
  BaseView,
  BaseGroupBy,
  PropertyConfig,
  FormulaDefinition,
  ViewSummaryConfig,
  parseViewSummaries,
} from "../../util/base/types"
import { QuartzPluginData } from "../vfile"
import { Root } from "hast"
import { h } from "hastscript"
import { createWikilinkRegex } from "../../util/wikilinks"
import { StaticResources } from "../../util/resources"

const wikilinkRegex = createWikilinkRegex()
const INLINE_WIKILINK_REGEX = createWikilinkRegex()
const wikilinkFlags = wikilinkRegex.flags.includes("g")
  ? wikilinkRegex.flags
  : `${wikilinkRegex.flags}g`

function getFileBaseName(filePath?: string, slug?: string): string | undefined {
  const source = filePath ?? slug
  if (!source) {
    return undefined
  }
  const fragment = source.split("/").pop() || source
  return fragment.replace(/\.[^/.]+$/, "")
}

function getFileDisplayName(file?: QuartzPluginData): string | undefined {
  if (!file) {
    return undefined
  }
  const title = file.frontmatter?.title
  if (typeof title === "string" && title.length > 0) {
    return title
  }
  const baseFromPath = getFileBaseName(file.filePath as string | undefined)
  if (baseFromPath) {
    return baseFromPath
  }
  const baseFromSlug = getFileBaseName(file.slug)
  if (baseFromSlug) {
    return baseFromSlug.replace(/-/g, " ")
  }
  return undefined
}

function fallbackNameFromSlug(slug: FullSlug): string {
  const base = getFileBaseName(slug) ?? slug
  return base.replace(/-/g, " ")
}

function findFileBySlug(
  allFiles: QuartzPluginData[],
  targetSlug: FullSlug,
): QuartzPluginData | undefined {
  const targetSimple = simplifySlug(targetSlug)
  return allFiles.find(
    (entry) => entry.slug && simplifySlug(entry.slug as FullSlug) === targetSimple,
  )
}

function renderInternalLinkNode(
  targetSlug: FullSlug,
  currentSlug: FullSlug,
  allFiles: QuartzPluginData[],
  alias?: string,
  anchor?: string,
) {
  const targetFile = findFileBySlug(allFiles, targetSlug)
  const displayText =
    alias && alias.trim().length > 0
      ? alias.trim()
      : (getFileDisplayName(targetFile) ?? fallbackNameFromSlug(targetSlug))

  const hrefBase = resolveRelative(currentSlug, targetSlug)
  const href = anchor && anchor.length > 0 ? `${hrefBase}${anchor}` : hrefBase
  const dataSlug = anchor && anchor.length > 0 ? `${targetSlug}${anchor}` : targetSlug

  return h("a.internal", { href, "data-slug": dataSlug }, displayText)
}

function splitTargetAndAlias(raw: string): { target: string; alias?: string } {
  let buffer = ""
  let alias: string | undefined
  let escaped = false
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i]
    if (escaped) {
      buffer += ch
      escaped = false
      continue
    }
    if (ch === "\\") {
      escaped = true
      continue
    }
    if (ch === "|" && alias === undefined) {
      alias = raw.slice(i + 1)
      break
    }
    buffer += ch
  }

  const target = buffer.replace(/\\\|/g, "|").trim()
  const cleanedAlias = alias?.replace(/\\\|/g, "|").trim()
  return { target, alias: cleanedAlias?.length ? cleanedAlias : undefined }
}

function normalizeTargetSlug(
  target: string,
  currentSlug: FullSlug,
): { slug: FullSlug; anchor?: string } {
  const trimmed = target.trim()
  const [fp, rawAnchor] = splitAnchor(trimmed)
  const anchor = rawAnchor.length > 0 ? rawAnchor : undefined
  if (!fp) {
    return { slug: currentSlug, anchor }
  }
  const slug = slugifyFilePath(fp as FilePath)
  return { slug, anchor }
}

function renderInlineString(
  value: string,
  currentSlug: FullSlug,
  allFiles: QuartzPluginData[],
): (string | ReturnType<typeof h>)[] {
  if (!value.includes("[[")) {
    return [value]
  }

  const nodes: (string | ReturnType<typeof h>)[] = []
  const regex = new RegExp(INLINE_WIKILINK_REGEX.source, wikilinkFlags)
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(value)) !== null) {
    const start = match.index
    if (start > lastIndex) {
      nodes.push(value.slice(lastIndex, start))
    }

    const raw = match[0]
    if (raw.startsWith("!")) {
      nodes.push(raw)
      lastIndex = regex.lastIndex
      continue
    }

    const inner = raw.slice(2, -2)
    const { target, alias } = splitTargetAndAlias(inner)
    const { slug, anchor } = normalizeTargetSlug(target, currentSlug)
    nodes.push(renderInternalLinkNode(slug, currentSlug, allFiles, alias, anchor))
    lastIndex = regex.lastIndex
  }

  if (lastIndex < value.length) {
    nodes.push(value.slice(lastIndex))
  }

  return nodes
}

function getPropertyDisplayName(
  property: string,
  properties?: Record<string, PropertyConfig>,
): string {
  const candidates: string[] = []

  const addCandidate = (candidate: string | undefined) => {
    if (!candidate) return
    if (!candidates.includes(candidate)) {
      candidates.push(candidate)
    }
  }

  addCandidate(property)

  const withoutPrefix = property.replace(/^(?:note|file)\./, "")
  addCandidate(withoutPrefix)

  if (!property.startsWith("note.")) {
    addCandidate(`note.${property}`)
  }
  if (!property.startsWith("file.")) {
    addCandidate(`file.${property}`)
  }

  addCandidate(withoutPrefix.split(".").pop())

  for (const candidate of candidates) {
    const displayName = properties?.[candidate]?.displayName
    if (displayName && displayName.length > 0) {
      return displayName
    }
  }

  const base = withoutPrefix.length > 0 ? withoutPrefix : property
  return base
    .split(".")
    .pop()!
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .trim()
}

// render a boolean value as a checkbox (obsidian behavior)
function renderBooleanCheckbox(value: boolean): any {
  return h("input", {
    type: "checkbox",
    checked: value ? true : undefined,
    disabled: true,
    class: "base-checkbox",
  })
}

// Helper functions for table building
function buildTableHead(columns: string[], properties?: Record<string, PropertyConfig>): any {
  return h(
    "tr",
    columns.map((col) => h("th", {}, getPropertyDisplayName(col, properties))),
  )
}

function buildTableCell(
  file: QuartzPluginData,
  column: string,
  currentSlug: FullSlug,
  allFiles: QuartzPluginData[],
  formulas?: Record<string, FormulaDefinition>,
): any {
  const fallbackSlugSegment = file.slug?.split("/").pop() || ""
  const fallbackTitle =
    getFileBaseName(file.filePath as string | undefined) ||
    fallbackSlugSegment.replace(/\.[^/.]+$/, "").replace(/-/g, " ")

  // handle formula.* columns
  if (column.startsWith("formula.")) {
    const formulaName = column.slice("formula.".length)
    const formula = formulas?.[formulaName]
    if (!formula) {
      return h("td", {}, "")
    }

    const value = evaluateFormula(formula, file, allFiles)
    if (typeof value === "boolean") {
      return h("td", {}, [renderBooleanCheckbox(value)])
    }
    if (value === undefined || value === null) {
      return h("td", {}, "")
    }
    return h("td", {}, String(value))
  }

  if (column === "title" || column === "file.title" || column === "note.title") {
    const resolvedTitle =
      (resolvePropertyValue(file, "file.title", allFiles) as string | undefined) ??
      file.frontmatter?.title ??
      fallbackTitle
    const slug = (file.slug || "") as FullSlug
    const href = resolveRelative(currentSlug, slug)
    return h("td", [h("a.internal", { href, "data-slug": slug }, resolvedTitle)])
  }

  if (column === "file.name") {
    const resolvedName =
      (resolvePropertyValue(file, "file.name", allFiles) as string | undefined) ?? fallbackTitle
    const slug = (file.slug || "") as FullSlug
    const href = resolveRelative(currentSlug, slug)
    return h("td", [h("a.internal", { href, "data-slug": slug }, resolvedName)])
  }

  if (column === "file.links") {
    const links = resolvePropertyValue(file, "file.links", allFiles)
    const count = Array.isArray(links) ? links.length : 0
    return h("td", {}, String(count))
  }

  if (column === "file.backlinks" || column === "file.inlinks") {
    const backlinks = resolvePropertyValue(file, column, allFiles)
    if (!Array.isArray(backlinks) || backlinks.length === 0) {
      return h("td", {}, "")
    }
    const nodes: any[] = []
    backlinks.forEach((entry: string, _index: number) => {
      if (!entry) {
        return
      }
      const [base, anchor] = splitAnchor(entry)
      const targetSlug = (base || entry) as FullSlug
      if (nodes.length > 0) {
        nodes.push(", ")
      }
      nodes.push(
        renderInternalLinkNode(
          targetSlug,
          currentSlug,
          allFiles,
          undefined,
          anchor && anchor.length > 0 ? anchor : undefined,
        ),
      )
    })
    return h("td", {}, nodes)
  }

  if (column.startsWith("note.")) {
    const actualColumn = column.replace("note.", "")
    return buildTableCell(file, actualColumn, currentSlug, allFiles, formulas)
  }

  let value: any
  if (column.startsWith("file.")) {
    value = resolvePropertyValue(file, column, allFiles)
  } else {
    value = file.frontmatter?.[column]
  }

  if (value === undefined || value === null) {
    return h("td", {}, "")
  }

  if (Array.isArray(value)) {
    const parts: any[] = []
    value.forEach((item, idx) => {
      if (typeof item === "string") {
        parts.push(...renderInlineString(item, currentSlug, allFiles))
      } else {
        parts.push(String(item))
      }
      if (idx < value.length - 1) {
        parts.push(", ")
      }
    })
    return h("td", {}, parts)
  }

  if (value instanceof Date) {
    return h("td", {}, value.toISOString().split("T")[0])
  }

  if (typeof value === "string") {
    const rendered = renderInlineString(value, currentSlug, allFiles)
    return h("td", {}, rendered)
  }

  // render boolean values as checkboxes (obsidian behavior)
  if (typeof value === "boolean") {
    return h("td", {}, [renderBooleanCheckbox(value)])
  }

  return h("td", {}, String(value))
}

function applySorting(
  files: QuartzPluginData[],
  sortConfig: { property: string; direction: "ASC" | "DESC" }[] = [],
  allFiles: QuartzPluginData[] = [],
): QuartzPluginData[] {
  if (sortConfig.length === 0) return files

  const normalizeSortValue = (val: any) => {
    if (val instanceof Date) {
      return val.getTime()
    }
    if (Array.isArray(val)) {
      return val.join(", ")
    }
    return val
  }

  return [...files].sort((a, b) => {
    for (const { property, direction } of sortConfig) {
      const aRaw = resolvePropertyValue(a, property, allFiles)
      const bRaw = resolvePropertyValue(b, property, allFiles)

      const aVal = normalizeSortValue(aRaw)
      const bVal = normalizeSortValue(bRaw)

      let comparison = 0
      const aMissing = aVal === undefined || aVal === null || aVal === ""
      const bMissing = bVal === undefined || bVal === null || bVal === ""

      if (aMissing && bMissing) {
        comparison = 0
      } else if (aMissing) {
        comparison = 1
      } else if (bMissing) {
        comparison = -1
      } else if (typeof aVal === "string" && typeof bVal === "string") {
        comparison = aVal.localeCompare(bVal)
      } else {
        comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0
      }

      if (comparison !== 0) {
        return direction === "ASC" ? comparison : -comparison
      }
    }
    return 0
  })
}

// group files by property value
function groupFiles(
  files: QuartzPluginData[],
  groupBy: string | BaseGroupBy,
): Map<string, QuartzPluginData[]> {
  const groups = new Map<string, QuartzPluginData[]>()

  const property = typeof groupBy === "string" ? groupBy : groupBy.property
  const direction = typeof groupBy === "string" ? "ASC" : groupBy.direction

  for (const file of files) {
    const value = file.frontmatter?.[property]
    const key = value === undefined || value === null ? "(empty)" : String(value)

    if (!groups.has(key)) {
      groups.set(key, [])
    }
    groups.get(key)!.push(file)
  }

  // sort groups by key
  const sortedGroups = new Map(
    [...groups.entries()].sort(([a], [b]) => {
      if (direction === "ASC") {
        return a.localeCompare(b)
      } else {
        return b.localeCompare(a)
      }
    }),
  )

  return sortedGroups
}

// build summary row (tfoot) for table
function buildTableSummaryRow(
  columns: string[],
  files: QuartzPluginData[],
  summaryConfig: ViewSummaryConfig | undefined,
  allFiles: QuartzPluginData[],
): any | undefined {
  if (!summaryConfig?.columns || Object.keys(summaryConfig.columns).length === 0) {
    return undefined
  }

  const summaryValues = computeViewSummaries(columns, files, summaryConfig, allFiles)

  // check if we have any summary values to display
  const hasValues = Object.values(summaryValues).some((v) => v !== undefined)
  if (!hasValues) {
    return undefined
  }

  const cells = columns.map((col) => {
    const value = summaryValues[col]
    if (value === undefined) {
      return h("td.base-summary-cell", {}, "")
    }
    return h("td.base-summary-cell", {}, String(value))
  })

  return h("tfoot", [h("tr.base-summary-row", cells)])
}

// build table with optional grouping
function buildTable(
  files: QuartzPluginData[],
  view: BaseView,
  currentSlug: FullSlug,
  allFiles: QuartzPluginData[],
  properties?: Record<string, { displayName?: string }>,
  formulas?: Record<string, FormulaDefinition>,
  topLevelSummaries?: Record<string, string>,
): any {
  const columns = view.order || []

  // parse view summaries with top-level formula references
  const summaryConfig = parseViewSummaries(view.summaries, topLevelSummaries)

  // apply groupBy if specified - skip summaries for grouped tables
  if (view.groupBy) {
    const groups = groupFiles(files, view.groupBy)
    const allRows: any[] = []

    for (const [groupName, groupFiles] of groups) {
      const groupHeader = h("tr.base-group-header", [
        h("td", { colspan: columns.length }, groupName),
      ])
      allRows.push(groupHeader)

      for (const file of groupFiles) {
        const cells = columns.map((col) =>
          buildTableCell(file, col, currentSlug, allFiles, formulas),
        )
        allRows.push(h("tr", cells))
      }
    }

    const tbody = h("tbody", allRows)
    const thead = h("thead", buildTableHead(columns, properties))
    return h("table.base-table", [thead, tbody])
  }

  // no grouping - standard table
  const rows = files.map((f) => {
    const cells = columns.map((col) => buildTableCell(f, col, currentSlug, allFiles, formulas))
    return h("tr", cells)
  })

  const tbody = h("tbody", rows)
  const thead = h("thead", buildTableHead(columns, properties))
  const tfoot = buildTableSummaryRow(columns, files, summaryConfig, allFiles)
  const tableChildren = tfoot ? [thead, tbody, tfoot] : [thead, tbody]
  return h("table.base-table", tableChildren)
}

// build list view
function listValueToPlainText(value: any): string | undefined {
  if (value === undefined || value === null) {
    return undefined
  }
  if (Array.isArray(value)) {
    const parts = value
      .map((item) => listValueToPlainText(item))
      .filter((part): part is string => Boolean(part && part.length > 0))
    if (parts.length === 0) return undefined
    return parts.join(", ")
  }
  if (value instanceof Date) {
    return value.toISOString().split("T")[0]
  }
  if (typeof value === "string") {
    const cleaned = value
      .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
      .replace(/\[\[([^\]]+)\]\]/g, "$1")
      .trim()
    return cleaned.length > 0 ? cleaned : undefined
  }
  const stringified = String(value).trim()
  return stringified.length > 0 ? stringified : undefined
}

function hasRenderableValue(value: any): boolean {
  if (value === undefined || value === null) return false
  if (Array.isArray(value)) {
    return value.some((item) => hasRenderableValue(item))
  }
  if (value instanceof Date) return true
  if (typeof value === "string") return value.trim().length > 0
  return true
}

function renderPropertyValueNodes(
  value: any,
  currentSlug: FullSlug,
  allFiles: QuartzPluginData[],
): any[] {
  if (value === undefined || value === null) return []
  if (Array.isArray(value)) {
    const nodes: any[] = []
    value.forEach((item, idx) => {
      nodes.push(...renderPropertyValueNodes(item, currentSlug, allFiles))
      if (idx < value.length - 1) {
        nodes.push(", ")
      }
    })
    return nodes
  }
  if (value instanceof Date) {
    return [value.toISOString().split("T")[0]]
  }
  if (typeof value === "string") {
    return renderInlineString(value, currentSlug, allFiles)
  }
  return [String(value)]
}

function buildList(
  files: QuartzPluginData[],
  view: BaseView,
  currentSlug: FullSlug,
  allFiles: QuartzPluginData[],
  properties?: Record<string, PropertyConfig>,
): any {
  const nestedProperties = view.nestedProperties === true || view.indentProperties === true
  const order = Array.isArray(view.order) && view.order.length > 0 ? view.order : ["title"]
  const [primaryProp, ...secondaryProps] = order

  const renderListItem = (file: QuartzPluginData) => {
    const slug = (file.slug || "") as FullSlug
    const href = resolveRelative(currentSlug, slug)

    const fallbackTitle =
      getFileDisplayName(file) ?? fallbackNameFromSlug((file.slug || "") as FullSlug)

    const primaryValue = primaryProp
      ? resolvePropertyValue(file, primaryProp, allFiles)
      : resolvePropertyValue(file, "title", allFiles)
    const primaryText = listValueToPlainText(primaryValue) ?? fallbackTitle
    const anchor = h("a.internal", { href, "data-slug": slug }, primaryText)

    const seen = new Set<string>()
    if (primaryProp) {
      seen.add(primaryProp)
    }

    if (!nestedProperties) {
      const rawSeparator = typeof view.separator === "string" ? view.separator : ","
      const separator = rawSeparator.endsWith(" ") ? rawSeparator : `${rawSeparator} `
      const inlineNodes: any[] = []

      for (const propertyKey of secondaryProps) {
        if (!propertyKey || seen.has(propertyKey)) continue
        const value = resolvePropertyValue(file, propertyKey, allFiles)
        if (!hasRenderableValue(value)) continue

        const renderedValue = renderPropertyValueNodes(value, currentSlug, allFiles)
        if (renderedValue.length === 0) continue

        inlineNodes.push(separator)
        inlineNodes.push(...renderedValue)
        seen.add(propertyKey)
      }

      return inlineNodes.length > 0 ? h("li", [anchor, ...inlineNodes]) : h("li", [anchor])
    }

    const metadataItems: any[] = []

    for (const propertyKey of secondaryProps) {
      if (!propertyKey || seen.has(propertyKey)) continue
      const value = resolvePropertyValue(file, propertyKey, allFiles)
      if (!hasRenderableValue(value)) continue

      const renderedValue = renderPropertyValueNodes(value, currentSlug, allFiles)
      if (renderedValue.length === 0) continue

      const label = getPropertyDisplayName(propertyKey, properties)
      metadataItems.push(h("li", [h("span.base-list-meta-label", `${label}: `), ...renderedValue]))
      seen.add(propertyKey)
    }

    if (metadataItems.length === 0) {
      return h("li", [anchor])
    }

    return h("li", [anchor, h("ul.base-list-nested", metadataItems)])
  }

  if (view.groupBy) {
    const groups = groupFiles(files, view.groupBy)
    const groupElements: any[] = []

    for (const [groupName, groupedFiles] of groups) {
      const items = groupedFiles.map((file) => renderListItem(file))
      groupElements.push(
        h("div.base-list-group", [
          h("h3.base-list-group-header", groupName),
          h("ul.base-list", items),
        ]),
      )
    }

    return h("div.base-list-container", groupElements)
  }

  const items = files.map((file) => renderListItem(file))
  return h("ul.base-list", items)
}

// build card view
function buildCards(
  files: QuartzPluginData[],
  view: BaseView,
  currentSlug: FullSlug,
  allFiles: QuartzPluginData[],
  allSlugs?: string[],
): any {
  const imageField = view.image || "image"

  const renderCard = (file: QuartzPluginData) => {
    const title = file.frontmatter?.title || file.slug?.split("/").pop() || ""
    const slug = (file.slug || "") as FullSlug
    const href = resolveRelative(currentSlug, slug)

    // resolve image from frontmatter
    let imageUrl: string | undefined
    const imageValue = resolvePropertyValue(file, imageField, allFiles)
    const toRelativeFromSlug = (target: string): string => {
      // absolute external URL: keep as-is
      if (isAbsoluteURL(target)) return target

      // Check if it's just a filename (no path separators)
      // If so, try to find the actual file by searching all slugs
      if (!target.includes('/') && !target.includes('\\')) {
        // Remove extension from target for comparison
        const targetWithoutExt = target.replace(/\.[^/.]+$/, '')

        // Search for the file in allSlugs (includes static assets like images)
        if (allSlugs) {
          const matchingSlug = allSlugs.find((slug) => {
            const slugBasename = slug.split("/").pop() || slug
            const slugWithoutExt = slugBasename.replace(/\.[^/.]+$/, '')
            return slugWithoutExt === targetWithoutExt || slugBasename === target
          })

          if (matchingSlug) {
            return resolveRelative(currentSlug, matchingSlug as FullSlug)
          }
        }

        // Fallback: assume it's directly in the Attachments folder
        const imgSlug = slugifyFilePath(('Attachments/' + target) as FilePath)
        return resolveRelative(currentSlug, imgSlug)
      }

      // Otherwise, use the target as-is
      const imgSlug = slugifyFilePath(target as FilePath)
      return resolveRelative(currentSlug, imgSlug)
    }

    if (imageValue) {
      if (typeof imageValue === "string") {
        // parse wikilink format like [[path|alias]]
        const wl = imageValue.match(/^\[\[(.+?)\]\]$/)
        if (wl) {
          const inner = wl[1]
          const { target } = splitTargetAndAlias(inner)
          // Use toRelativeFromSlug to handle images properly
          imageUrl = toRelativeFromSlug(target)
        } else {
          imageUrl = toRelativeFromSlug(imageValue)
        }
      } else if (Array.isArray(imageValue) && imageValue.length > 0) {
        // take first image if it's an array
        const first = imageValue[0]
        if (typeof first === "string") {
          const wl = first.match(/^\[\[(.+?)\]\]$/)
          if (wl) {
            const inner = wl[1]
            const { target } = splitTargetAndAlias(inner)
            // Use toRelativeFromSlug to handle images properly
            imageUrl = toRelativeFromSlug(target)
          } else {
            imageUrl = toRelativeFromSlug(first)
          }
        }
      }
    }

    // extract metadata items from view.order
    const metadataItems: any[] = []
    const order = view.order || []
    const metadataFields = order.filter(
      (field) => field !== "title" && field !== imageField && field !== "file.title",
    )

    for (const field of metadataFields) {
      const value = resolvePropertyValue(file, field, allFiles)
      if (value !== undefined && value !== null && value !== "") {
        const label = field
          .replace("file.", "")
          .replace("note.", "")
          .replace(/-/g, " ")
          .replace(/([A-Z])/g, " $1")
          .trim()

        let displayValue: any
        if (Array.isArray(value)) {
          // render wikilinks in each array item
          const parts: any[] = []
          value.forEach((item, idx) => {
            if (typeof item === "string") {
              parts.push(...renderInlineString(item, currentSlug, allFiles))
            } else {
              parts.push(String(item))
            }
            if (idx < value.length - 1) {
              parts.push(", ")
            }
          })
          displayValue = parts
        } else if (value instanceof Date) {
          displayValue = value.toISOString().split("T")[0]
        } else if (typeof value === "string") {
          // render inline wikilinks
          const rendered = renderInlineString(value, currentSlug, allFiles)
          displayValue = rendered
        } else {
          displayValue = String(value)
        }

        metadataItems.push(
          h("div.base-card-meta-item", [
            h("span.base-card-meta-label", label),
            h("span.base-card-meta-value", displayValue),
          ]),
        )
      }
    }

    const cardChildren = []
    if (imageUrl) {
      cardChildren.push(
        h(
          "a.base-card-image-link",
          {
            href,
            "data-slug": slug,
          },
          [
            h("img.base-card-image", {
              src: imageUrl,
              alt: title,
              loading: "lazy",
            }),
          ],
        ),
      )
    }

    const contentChildren = [
      h("a.base-card-title-link", { href, "data-slug": slug }, [h("h3.base-card-title", title)]),
    ]
    if (metadataItems.length > 0) {
      contentChildren.push(h("div.base-card-meta", metadataItems))
    }

    cardChildren.push(h("div.base-card-content", contentChildren))

    return h("div.base-card", cardChildren)
  }

  // grouping support
  const styleParts: string[] = []
  if (typeof view.cardSize === "number" && view.cardSize > 0) {
    styleParts.push(`--base-card-min: ${view.cardSize}px;`)
  }
  if (typeof view.cardAspect === "number" && view.cardAspect > 0) {
    styleParts.push(`--base-card-aspect: ${view.cardAspect};`)
  }
  const varStyle = styleParts.length > 0 ? styleParts.join(" ") : undefined

  if (view.groupBy) {
    const groups = groupFiles(files, view.groupBy)
    const groupElements: any[] = []

    const groupSizes = view.groupSizes as Record<string, number> | undefined
    const groupAspects = view.groupAspects as Record<string, number> | undefined

    for (const [groupName, groupFiles] of groups) {
      const cards = groupFiles.map((file) => renderCard(file))
      let gridStyle: string | undefined
      const parts: string[] = []
      const size = groupSizes?.[groupName]
      if (typeof size === "number" && size > 0) {
        parts.push(`--base-card-min: ${size}px;`)
      }
      const aspect = groupAspects?.[groupName]
      if (typeof aspect === "number" && aspect > 0) {
        parts.push(`--base-card-aspect: ${aspect};`)
      }
      gridStyle = parts.length > 0 ? parts.join(" ") : undefined

      groupElements.push(
        h("div.base-card-group", [
          h("h3.base-card-group-header", groupName),
          h("div.base-card-grid", gridStyle ? { style: gridStyle } : {}, cards),
        ]),
      )
    }

    return h("div.base-card-container", varStyle ? { style: varStyle } : {}, groupElements)
  }

  // no grouping
  const cards = files.map((file) => renderCard(file))
  return h("div.base-card-grid", varStyle ? { style: varStyle } : {}, cards)
}

// build map view
function buildMap(
  files: QuartzPluginData[],
  view: BaseView,
  currentSlug: FullSlug,
  allFiles: QuartzPluginData[],
  properties?: Record<string, PropertyConfig>,
): any {
  // strip note. prefix if present (same pattern as buildTableCell)
  let coordinatesProp = view.coordinates || "coordinates"
  if (coordinatesProp.startsWith("note.")) {
    coordinatesProp = coordinatesProp.replace("note.", "")
  }

  const markers: any[] = []

  // extract markers from files with valid coordinates
  for (const file of files) {
    const coordsValue = resolvePropertyValue(file, coordinatesProp, allFiles)
    if (!coordsValue || !Array.isArray(coordsValue) || coordsValue.length < 2) {
      continue
    }

    const lat = parseFloat(String(coordsValue[0]))
    const lon = parseFloat(String(coordsValue[1]))

    if (isNaN(lat) || isNaN(lon)) {
      continue
    }

    const title = getFileDisplayName(file) ?? fallbackNameFromSlug((file.slug || "") as FullSlug)
    const slug = (file.slug || "") as FullSlug

    // collect popup metadata from view.order
    const popupFields: Record<string, any> = {}
    const order = view.order || []
    for (const field of order) {
      if (field === "title" || field === "file.title" || field === "note.title") continue
      const value = resolvePropertyValue(file, field, allFiles)
      if (value !== undefined && value !== null && value !== "") {
        popupFields[field] = value
      }
    }

    // get marker customization - strip note. prefix
    let iconProp = view.markerIcon
    if (iconProp && iconProp.startsWith("note.")) {
      iconProp = iconProp.replace("note.", "")
    }
    let colorProp = view.markerColor
    if (colorProp && colorProp.startsWith("note.")) {
      colorProp = colorProp.replace("note.", "")
    }

    const icon = iconProp ? resolvePropertyValue(file, iconProp, allFiles) : undefined
    const color = colorProp ? resolvePropertyValue(file, colorProp, allFiles) : undefined

    markers.push({
      lat,
      lon,
      title,
      slug,
      icon: icon ? String(icon) : undefined,
      color: color ? String(color) : undefined,
      popupFields,
    })
  }

  // prepare map configuration
  const config = {
    defaultZoom: view.defaultZoom ?? 12,
    defaultCenter: view.defaultCenter,
    clustering: view.clustering !== false, // default true
  }

  // create container with data attributes
  const attrs: Record<string, any> = {
    "data-markers": JSON.stringify(markers),
    "data-config": JSON.stringify(config),
    "data-current-slug": currentSlug,
  }

  // add properties metadata for display names
  if (properties) {
    attrs["data-properties"] = JSON.stringify(properties)
  }

  return h("div.base-map", attrs)
}

function resolveViewSlug(baseSlug: FullSlug, viewName: string, viewIndex: number): FullSlug {
  if (viewIndex === 0) {
    return baseSlug
  }
  const slugifiedName = slugifyFilePath((viewName + ".tmp") as FilePath, true)
  return joinSegments(baseSlug, slugifiedName) as FullSlug
}

async function* emitBaseViewsForFile(
  ctx: BuildCtx,
  baseFileData: QuartzPluginData,
  allFiles: QuartzPluginData[],
  resources: StaticResources,
  layout: FullPageLayout,
) {
  if (!baseFileData.bases || !baseFileData.basesConfig || !baseFileData.slug) {
    return
  }

  const config = baseFileData.basesConfig
  const baseSlug = baseFileData.slug as FullSlug

  const allViews = config.views.map((view, idx) => ({
    name: view.name,
    type: view.type,
    slug: resolveViewSlug(baseSlug, view.name, idx),
  }))

  const baseMatchedFiles = config.filters ? evaluateFilter(config.filters, allFiles) : allFiles

  for (const [viewIndex, view] of config.views.entries()) {
    const slug = resolveViewSlug(baseSlug, view.name, viewIndex)

    let matchedFiles = baseMatchedFiles
    if (view.filters) {
      matchedFiles = evaluateFilter(view.filters, matchedFiles)
    }

    const sortedFiles = applySorting(matchedFiles, view.sort, allFiles)
    const limitedFiles = view.limit ? sortedFiles.slice(0, view.limit) : sortedFiles

    let tree: Root
    if (view.type === "table") {
      const tableNode = buildTable(
        limitedFiles,
        view,
        slug,
        allFiles,
        config.properties,
        config.formulas,
        config.summaries,
      )
      tree = { type: "root", children: [tableNode] }
    } else if (view.type === "list") {
      const listNode = buildList(limitedFiles, view, slug, allFiles, config.properties)
      tree = { type: "root", children: [listNode] }
    } else if (view.type === "card" || view.type === "cards") {
      const cardsNode = buildCards(limitedFiles, view, slug, allFiles, ctx.allSlugs)
      tree = { type: "root", children: [cardsNode] }
    } else if (view.type === "map") {
      const mapNode = buildMap(limitedFiles, view, slug, allFiles, config.properties)
      tree = { type: "root", children: [mapNode] }
    } else {
      console.warn(`[BaseViewPage] Unsupported view type: ${view.type}`)
      continue
    }

    const fileData: QuartzPluginData = { ...baseFileData }
    fileData.slug = slug
    fileData.htmlAst = tree

    if (fileData.frontmatter) {
      fileData.frontmatter = {
        ...fileData.frontmatter,
        title: `${baseFileData.frontmatter?.title || baseSlug} - ${view.name}`,
        pageLayout: fileData.frontmatter.pageLayout || "default",
      }
    }

    fileData.basesMetadata = { baseSlug, currentView: view.name, allViews }

    const cfg = ctx.cfg.configuration
    const externalResources = pageResources(pathToRoot(slug), resources, ctx)
    const componentData: QuartzComponentProps = {
      ctx,
      fileData,
      externalResources,
      cfg,
      children: [],
      tree,
      allFiles,
    }

    const content = renderPage(ctx, slug, componentData, layout, externalResources, false)
    yield write({ ctx, content, slug, ext: ".html" })
  }
}

export const BasePage: QuartzEmitterPlugin<Partial<FullPageLayout>> = (userOpts) => {
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    ...defaultContentPageLayout,
    ...userOpts,
    pageBody: Content(),
    beforeBody: [BaseViewSelector(), BaseSearchBar()],
    afterBody: [],
  }

  const { head: Head, header, beforeBody, pageBody, afterBody, left, right, footer: Footer } = opts

  return {
    name: "BaseViewPage",
    getQuartzComponents() {
      return [Head, ...header, ...beforeBody, pageBody, ...afterBody, ...left, ...right, Footer]
    },
    async *partialEmit(ctx, content, resources, changeEvents) {
      const allFiles = content.map((c) => c[1].data)
      const baseFilesBySlug = new Map<FullSlug, QuartzPluginData>()

      for (const [, file] of content) {
        if (file.data.bases && file.data.basesConfig && file.data.slug) {
          baseFilesBySlug.set(file.data.slug as FullSlug, file.data)
        }
      }

      if (baseFilesBySlug.size === 0) {
        return
      }

      const slugsToRebuild = new Set<FullSlug>()
      let rebuildAllBases = false

      for (const changeEvent of changeEvents) {
        if (changeEvent.file) {
          const data = changeEvent.file.data
          if (data.bases && data.slug) {
            slugsToRebuild.add(data.slug as FullSlug)
          } else {
            rebuildAllBases = true
          }
          continue
        }

        if (changeEvent.type === "delete") {
          rebuildAllBases = true
          continue
        }

        const changedPath = changeEvent.path
        for (const [slug, baseData] of baseFilesBySlug.entries()) {
          const deps = (baseData.codeDependencies as string[] | undefined) ?? []
          if (deps.includes(changedPath)) {
            slugsToRebuild.add(slug)
          }
        }
      }

      if (rebuildAllBases) {
        for (const slug of baseFilesBySlug.keys()) {
          slugsToRebuild.add(slug)
        }
      }

      if (slugsToRebuild.size === 0) {
        return
      }

      for (const slug of slugsToRebuild) {
        const baseData = baseFilesBySlug.get(slug)
        if (!baseData) continue
        yield* emitBaseViewsForFile(ctx, baseData, allFiles, resources, opts)
      }
    },
    async *emit(ctx, content, resources) {
      const allFiles = content.map((c) => c[1].data)

      for (const [, file] of content) {
        if (!file.data.bases || !file.data.basesConfig || !file.data.slug) continue
        yield* emitBaseViewsForFile(ctx, file.data, allFiles, resources, opts)
      }
    },
  }
}

interface BaseMetadata {
  baseSlug: FullSlug
  currentView: string
  allViews: Array<{ name: string; type: string; slug: FullSlug }>
}

declare module "vfile" {
  interface DataMap {
    basesMetadata?: BaseMetadata
  }
}
