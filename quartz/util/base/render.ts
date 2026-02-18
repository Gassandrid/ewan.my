import { Root } from 'hast'
import { h } from 'hastscript'
import { QuartzPluginData } from '../../plugins/vfile'
import {
  resolveRelative,
  FullSlug,
  joinSegments,
  FilePath,
  slugifyFilePath,
  simplifySlug,
  isAbsoluteURL,
} from '../../util/path'
import { extractWikilinksWithPositions, resolveWikilinkTarget } from '../../util/wikilinks'
import {
  BaseExpressionDiagnostic,
  ProgramIR,
  buildPropertyExpressionSource,
  evaluateExpression,
  evaluateFilterExpression,
  valueToUnknown,
  EvalContext,
  Value,
} from './compiler'
import { computeViewSummaries } from './query'
import {
  BaseView,
  BaseGroupBy,
  BaseFile,
  BaseSortConfig,
  PropertyConfig,
  ViewSummaryConfig,
  parseViewSummaries,
} from './types'

type RenderElement = ReturnType<typeof h>
type RenderNode = RenderElement | string
type IconToken = { kind: 'icon'; value: string }

const isIconToken = (value: unknown): value is IconToken =>
  typeof value === 'object' &&
  value !== null &&
  (value as IconToken).kind === 'icon' &&
  typeof (value as IconToken).value === 'string'

const splitIconClasses = (raw: string): string[] =>
  raw
    .trim()
    .split(/\s+/)
    .filter(part => part.length > 0)

const normalizeIconName = (raw: string): string => {
  const trimmed = raw.trim()
  if (!trimmed) return ''
  const colonIndex = trimmed.lastIndexOf(':')
  return colonIndex >= 0 ? trimmed.slice(colonIndex + 1).trim() : trimmed
}

const buildIconClassList = (raw: string): string[] => {
  const parts = splitIconClasses(raw)
  if (parts.length === 0) return []
  if (parts.length > 1) return parts
  const normalized = normalizeIconName(parts[0])
  if (!normalized) return []
  if (normalized.startsWith('icon-')) return [normalized]
  return [`icon-${normalized}`]
}

const renderIconNode = (raw: string): RenderElement => {
  const classList = buildIconClassList(raw)
  return h('i', { class: classList.join(' '), ariaHidden: true })
}

const renderIconHtml = (raw: string): string => {
  const classList = buildIconClassList(raw)
  if (classList.length === 0) return ''
  return `<i class="${classList.join(' ')}" aria-hidden="true"></i>`
}

function getFileBaseName(filePath?: string, slug?: string): string | undefined {
  const source = filePath ?? slug
  if (!source) return undefined
  const fragment = source.split('/').pop() || source
  return fragment.replace(/\.[^/.]+$/, '')
}

function getFileDisplayName(file?: QuartzPluginData): string | undefined {
  if (!file) return undefined
  const title = file.frontmatter?.title
  if (typeof title === 'string' && title.length > 0) return title
  const baseFromPath = getFileBaseName(file.filePath as string | undefined)
  if (baseFromPath) return baseFromPath
  const baseFromSlug = getFileBaseName(file.slug)
  if (baseFromSlug) return baseFromSlug.replace(/-/g, ' ')
  return undefined
}

function fallbackNameFromSlug(slug: FullSlug): string {
  const base = getFileBaseName(slug) ?? slug
  return base.replace(/-/g, ' ')
}

function findFileBySlug(
  allFiles: QuartzPluginData[],
  targetSlug: FullSlug,
): QuartzPluginData | undefined {
  const targetSimple = simplifySlug(targetSlug)
  return allFiles.find(entry => entry.slug && simplifySlug(entry.slug as FullSlug) === targetSimple)
}

function renderInternalLinkNode(
  targetSlug: FullSlug,
  currentSlug: FullSlug,
  allFiles: QuartzPluginData[],
  alias?: string,
  anchor?: string,
): RenderElement {
  const targetFile = findFileBySlug(allFiles, targetSlug)
  const displayText =
    alias && alias.trim().length > 0
      ? alias.trim()
      : (getFileDisplayName(targetFile) ?? fallbackNameFromSlug(targetSlug))

  const hrefBase = resolveRelative(currentSlug, targetSlug)
  const href = anchor && anchor.length > 0 ? `${hrefBase}${anchor}` : hrefBase
  const dataSlug = anchor && anchor.length > 0 ? `${targetSlug}${anchor}` : targetSlug

  return h('a.internal', { href, 'data-slug': dataSlug }, displayText)
}

function buildFileLinkNode(slug: FullSlug, currentSlug: FullSlug, label: string): RenderElement {
  const href = resolveRelative(currentSlug, slug)
  return h('a.internal', { href, 'data-slug': slug }, label)
}

function splitTargetAndAlias(raw: string): { target: string; alias?: string } {
  let buffer = ''
  let alias: string | undefined
  let escaped = false
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i]
    if (escaped) {
      buffer += ch
      escaped = false
      continue
    }
    if (ch === '\\') {
      escaped = true
      continue
    }
    if (ch === '|' && alias === undefined) {
      alias = raw.slice(i + 1)
      break
    }
    buffer += ch
  }

  const target = buffer.replace(/\\\|/g, '|').trim()
  const cleanedAlias = alias?.replace(/\\\|/g, '|').trim()
  return { target, alias: cleanedAlias?.length ? cleanedAlias : undefined }
}

function normalizeTargetSlug(
  target: string,
  currentSlug: FullSlug,
  anchor?: string,
): { slug: FullSlug; anchor?: string } {
  const trimmed = target.trim()
  if (!trimmed) return { slug: currentSlug, anchor }
  const slug = slugifyFilePath(trimmed as FilePath)
  return { slug, anchor }
}

function renderInlineString(
  value: string,
  currentSlug: FullSlug,
  allFiles: QuartzPluginData[],
): RenderNode[] {
  if (!value.includes('[[')) {
    return [value]
  }

  const nodes: RenderNode[] = []
  const ranges = extractWikilinksWithPositions(value)
  let lastIndex = 0
  for (const range of ranges) {
    const start = range.start
    if (start > lastIndex) nodes.push(value.slice(lastIndex, start))

    const parsed = range.wikilink
    const raw = value.slice(range.start, range.end)
    if (parsed.embed) {
      nodes.push(raw)
      lastIndex = range.end
      continue
    }

    const resolved = resolveWikilinkTarget(parsed, currentSlug)
    if (!resolved) {
      nodes.push(parsed.alias ?? parsed.target ?? raw)
      lastIndex = range.end
      continue
    }

    nodes.push(
      renderInternalLinkNode(resolved.slug, currentSlug, allFiles, parsed.alias, resolved.anchor),
    )
    lastIndex = range.end
  }

  if (lastIndex < value.length) {
    nodes.push(value.slice(lastIndex))
  }

  return nodes
}

function renderBacklinkNodes(
  backlinks: string[],
  currentSlug: FullSlug,
  allFiles: QuartzPluginData[],
): RenderNode[] {
  const nodes: RenderNode[] = []
  for (const entry of backlinks) {
    if (!entry) continue
    let raw = entry.trim()
    if (!raw) continue
    let alias: string | undefined
    if (raw.startsWith('!')) {
      raw = raw.slice(1)
    }
    if (raw.startsWith('[[') && raw.endsWith(']]')) {
      const inner = raw.slice(2, -2)
      const parsed = splitTargetAndAlias(inner)
      raw = parsed.target
      alias = parsed.alias
    }
    const { slug: targetSlug, anchor } = normalizeTargetSlug(raw, currentSlug)
    if (nodes.length > 0) {
      nodes.push(', ')
    }
    nodes.push(
      renderInternalLinkNode(
        targetSlug,
        currentSlug,
        allFiles,
        alias,
        anchor && anchor.length > 0 ? anchor : undefined,
      ),
    )
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

  const withoutPrefix = property.replace(/^(?:note|file)\./, '')
  addCandidate(withoutPrefix)

  if (!property.startsWith('note.')) {
    addCandidate(`note.${property}`)
  }
  if (!property.startsWith('file.')) {
    addCandidate(`file.${property}`)
  }

  addCandidate(withoutPrefix.split('.').pop())

  for (const candidate of candidates) {
    const displayName = properties?.[candidate]?.displayName
    if (displayName && displayName.length > 0) {
      return displayName
    }
  }

  const base = withoutPrefix.length > 0 ? withoutPrefix : property
  return base
    .split('.')
    .pop()!
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .trim()
}

function renderBooleanCheckbox(value: boolean): RenderElement {
  return h('input', {
    type: 'checkbox',
    checked: value ? true : undefined,
    disabled: true,
    class: 'base-checkbox',
  })
}

function wrapTableCellContent(content: RenderNode | RenderNode[]): RenderElement {
  const nodes = Array.isArray(content) ? content : [content]
  return h('td', {}, [h('div.base-table-cell-content', nodes)])
}

function buildTableHead(
  columns: string[],
  properties?: Record<string, PropertyConfig>,
): RenderElement {
  return h(
    'tr',
    columns.map(col => h('th', {}, getPropertyDisplayName(col, properties))),
  )
}

type EvalContextFactory = (file: QuartzPluginData) => EvalContext

type PropertyExprGetter = (property: string) => ProgramIR | null

function resolveValueWithFormulas(
  file: QuartzPluginData,
  property: string,
  getContext: EvalContextFactory,
  getPropertyExpr: PropertyExprGetter,
): unknown {
  const expr = getPropertyExpr(property)
  if (!expr) return undefined
  const ctx = getContext(file)
  const cacheKey = property.trim()
  if (cacheKey.length > 0 && ctx.propertyCache?.has(cacheKey)) {
    return valueToUnknown(ctx.propertyCache.get(cacheKey)!)
  }
  ctx.diagnosticContext = `property.${property}`
  ctx.diagnosticSource = buildPropertyExpressionSource(property) ?? property
  const value = evaluateExpression(expr, ctx)
  if (cacheKey.length > 0 && ctx.propertyCache) {
    ctx.propertyCache.set(cacheKey, value)
  }
  return valueToUnknown(value)
}

function buildTableCell(
  file: QuartzPluginData,
  column: string,
  currentSlug: FullSlug,
  allFiles: QuartzPluginData[],
  getContext: EvalContextFactory,
  getPropertyExpr: PropertyExprGetter,
): RenderElement {
  const slug = (file.slug || '') as FullSlug
  const fallbackSlugSegment = file.slug?.split('/').pop() || ''
  const fallbackTitle =
    getFileBaseName(file.filePath as string | undefined) ||
    fallbackSlugSegment.replace(/\.[^/.]+$/, '').replace(/-/g, ' ')

  const linkProperty =
    column === 'file.name'
      ? 'file.name'
      : column === 'title' || column === 'file.title' || column === 'note.title'
        ? 'file.title'
        : undefined

  if (linkProperty) {
    const rawValue = resolveValueWithFormulas(file, linkProperty, getContext, getPropertyExpr)
    const resolvedValue =
      typeof rawValue === 'string' && rawValue.length > 0 ? rawValue : fallbackTitle
    return wrapTableCellContent(buildFileLinkNode(slug, currentSlug, resolvedValue))
  }

  if (column === 'file.links') {
    const links = resolveValueWithFormulas(file, 'file.links', getContext, getPropertyExpr)
    const count = Array.isArray(links) ? links.length : 0
    return wrapTableCellContent(String(count))
  }

  if (column === 'file.backlinks' || column === 'file.inlinks') {
    const backlinks = resolveValueWithFormulas(file, column, getContext, getPropertyExpr)
    if (!Array.isArray(backlinks) || backlinks.length === 0) {
      return wrapTableCellContent('')
    }
    const entries = backlinks.filter((entry): entry is string => typeof entry === 'string')
    if (entries.length === 0) {
      return wrapTableCellContent('')
    }
    const nodes = renderBacklinkNodes(entries, currentSlug, allFiles)
    return wrapTableCellContent(nodes)
  }

  const canEvalExpr = Boolean(getPropertyExpr(column))

  if (!canEvalExpr && column.startsWith('note.')) {
    const actualColumn = column.replace('note.', '')
    return buildTableCell(file, actualColumn, currentSlug, allFiles, getContext, getPropertyExpr)
  }

  const value = resolveValueWithFormulas(file, column, getContext, getPropertyExpr)

  if (value === undefined || value === null) {
    return wrapTableCellContent('')
  }

  if (isIconToken(value)) {
    const cleaned = value.value.trim()
    return cleaned.length > 0
      ? wrapTableCellContent(renderIconNode(cleaned))
      : wrapTableCellContent('')
  }

  if (Array.isArray(value)) {
    const parts: RenderNode[] = []
    value.forEach((item, idx) => {
      if (isIconToken(item)) {
        const cleaned = item.value.trim()
        if (cleaned.length > 0) {
          parts.push(renderIconNode(cleaned))
        }
      } else if (typeof item === 'string') {
        parts.push(...renderInlineString(item, currentSlug, allFiles))
      } else {
        parts.push(String(item))
      }
      if (idx < value.length - 1) {
        parts.push(', ')
      }
    })
    return wrapTableCellContent(parts)
  }

  if (value instanceof Date) {
    return wrapTableCellContent(value.toISOString().split('T')[0])
  }

  if (typeof value === 'string') {
    const rendered = renderInlineString(value, currentSlug, allFiles)
    return wrapTableCellContent(rendered)
  }

  if (typeof value === 'boolean') {
    return wrapTableCellContent(renderBooleanCheckbox(value))
  }

  return wrapTableCellContent(String(value))
}

function applySorting(
  files: QuartzPluginData[],
  sortConfig: BaseSortConfig[] = [],
  getContext: EvalContextFactory,
  getPropertyExpr: PropertyExprGetter,
): QuartzPluginData[] {
  if (sortConfig.length === 0) return files

  const normalizeSortValue = (val: unknown): string | number | null | undefined => {
    if (isIconToken(val)) {
      return val.value
    }
    if (val instanceof Date) {
      return val.getTime()
    }
    if (Array.isArray(val)) {
      return val.join(', ')
    }
    if (typeof val === 'string' || typeof val === 'number') {
      return val
    }
    if (typeof val === 'boolean') {
      return val ? 1 : 0
    }
    if (val === null || val === undefined) {
      return val
    }
    return String(val)
  }

  return [...files].sort((a, b) => {
    for (const { property, direction } of sortConfig) {
      const aRaw = resolveValueWithFormulas(a, property, getContext, getPropertyExpr)
      const bRaw = resolveValueWithFormulas(b, property, getContext, getPropertyExpr)

      const aVal = normalizeSortValue(aRaw)
      const bVal = normalizeSortValue(bRaw)

      let comparison = 0
      if (aVal === undefined || aVal === null || aVal === '') {
        if (bVal === undefined || bVal === null || bVal === '') {
          comparison = 0
        } else {
          comparison = 1
        }
      } else if (bVal === undefined || bVal === null || bVal === '') {
        comparison = -1
      } else if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal)
      } else {
        const aNumber = typeof aVal === 'number' ? aVal : Number(aVal)
        const bNumber = typeof bVal === 'number' ? bVal : Number(bVal)
        if (Number.isFinite(aNumber) && Number.isFinite(bNumber)) {
          comparison = aNumber > bNumber ? 1 : aNumber < bNumber ? -1 : 0
        } else {
          comparison = String(aVal).localeCompare(String(bVal))
        }
      }

      if (comparison !== 0) {
        return direction === 'ASC' ? comparison : -comparison
      }
    }
    return 0
  })
}

function groupFiles(
  files: QuartzPluginData[],
  groupBy: string | BaseGroupBy,
  getContext: EvalContextFactory,
  getPropertyExpr: PropertyExprGetter,
): Map<string, QuartzPluginData[]> {
  const groups = new Map<string, QuartzPluginData[]>()

  const property = typeof groupBy === 'string' ? groupBy : groupBy.property
  const direction = typeof groupBy === 'string' ? 'ASC' : groupBy.direction

  for (const file of files) {
    const value = resolveValueWithFormulas(file, property, getContext, getPropertyExpr)
    const key = isIconToken(value)
      ? value.value
      : value === undefined || value === null
        ? '(empty)'
        : String(value)

    if (!groups.has(key)) {
      groups.set(key, [])
    }
    groups.get(key)!.push(file)
  }

  const sortedGroups = new Map(
    [...groups.entries()].sort(([a], [b]) => {
      if (direction === 'ASC') {
        return a.localeCompare(b)
      } else {
        return b.localeCompare(a)
      }
    }),
  )

  return sortedGroups
}

function buildTableSummaryRow(
  columns: string[],
  files: QuartzPluginData[],
  summaryConfig: ViewSummaryConfig | undefined,
  allFiles: QuartzPluginData[],
  summaryExpressions: Record<string, ProgramIR> | undefined,
  getContext: EvalContextFactory,
  getPropertyExpr: PropertyExprGetter,
): RenderElement | undefined {
  if (!summaryConfig?.columns || Object.keys(summaryConfig.columns).length === 0) {
    return undefined
  }

  const summaryValues = computeViewSummaries(
    columns,
    files,
    summaryConfig,
    allFiles,
    getContext,
    (file, column) => resolveValueWithFormulas(file, column, getContext, getPropertyExpr),
    summaryExpressions,
  )

  const hasValues = Object.values(summaryValues).some(v => v !== undefined)
  if (!hasValues) {
    return undefined
  }

  const cells: RenderElement[] = columns.map(col => {
    const value = summaryValues[col]
    if (value === undefined) {
      return h('td.base-summary-cell', {}, '')
    }
    if (isIconToken(value)) {
      const cleaned = value.value.trim()
      return cleaned.length > 0
        ? h('td.base-summary-cell', {}, [renderIconNode(cleaned)])
        : h('td.base-summary-cell', {}, '')
    }
    return h('td.base-summary-cell', {}, String(value))
  })

  return h('tfoot', [h('tr.base-summary-row', cells)])
}

function buildTable(
  files: QuartzPluginData[],
  view: BaseView,
  currentSlug: FullSlug,
  allFiles: QuartzPluginData[],
  getContext: EvalContextFactory,
  getPropertyExpr: PropertyExprGetter,
  properties?: Record<string, PropertyConfig>,
  topLevelSummaries?: Record<string, string>,
  summaryExpressions?: Record<string, ProgramIR>,
): RenderElement {
  const columns = view.order || []

  const summaryConfig = parseViewSummaries(view.summaries, topLevelSummaries)

  if (view.groupBy) {
    const groups = groupFiles(files, view.groupBy, getContext, getPropertyExpr)
    const allRows: RenderElement[] = []
    const groupByKey = typeof view.groupBy === 'string' ? view.groupBy : view.groupBy.property
    const groupByLabel = getPropertyDisplayName(groupByKey, properties)

    for (const [groupName, groupFiles] of groups) {
      const groupHeader = h('tr.base-group-header', [
        h('td', { colspan: columns.length }, [
          h('span.base-group-header-label', groupByLabel.toLowerCase()),
          ' ',
          groupName,
        ]),
      ])
      allRows.push(groupHeader)

      for (const file of groupFiles) {
        const cells = columns.map(col =>
          buildTableCell(file, col, currentSlug, allFiles, getContext, getPropertyExpr),
        )
        allRows.push(h('tr', cells))
      }
    }

    const tbody = h('tbody', allRows)
    const thead = h('thead', buildTableHead(columns, properties))
    const table = h('table.base-table', [thead, tbody])
    return h('div.base-table-wrapper', [table])
  }

  const rows = files.map(f => {
    const cells = columns.map(col =>
      buildTableCell(f, col, currentSlug, allFiles, getContext, getPropertyExpr),
    )
    return h('tr', cells)
  })

  const tbody = h('tbody', rows)
  const thead = h('thead', buildTableHead(columns, properties))
  const tfoot = buildTableSummaryRow(
    columns,
    files,
    summaryConfig,
    allFiles,
    summaryExpressions,
    getContext,
    getPropertyExpr,
  )
  const tableChildren = tfoot ? [thead, tbody, tfoot] : [thead, tbody]
  const table = h('table.base-table', tableChildren)
  return h('div.base-table-wrapper', [table])
}

function listValueToPlainText(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined
  }
  if (isIconToken(value)) {
    const cleaned = value.value.trim()
    return cleaned.length > 0 ? cleaned : undefined
  }
  if (Array.isArray(value)) {
    const parts = value
      .map(item => listValueToPlainText(item))
      .filter((part): part is string => Boolean(part && part.length > 0))
    if (parts.length === 0) return undefined
    return parts.join(', ')
  }
  if (value instanceof Date) {
    return value.toISOString().split('T')[0]
  }
  if (typeof value === 'string') {
    const cleaned = value
      .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
      .replace(/\[\[([^\]]+)\]\]/g, '$1')
      .trim()
    return cleaned.length > 0 ? cleaned : undefined
  }
  const stringified = String(value).trim()
  return stringified.length > 0 ? stringified : undefined
}

function hasRenderableValue(value: unknown): boolean {
  if (value === undefined || value === null) return false
  if (isIconToken(value)) {
    return value.value.trim().length > 0
  }
  if (Array.isArray(value)) {
    return value.some(item => hasRenderableValue(item))
  }
  if (value instanceof Date) return true
  if (typeof value === 'string') return value.trim().length > 0
  return true
}

function renderPropertyValueNodes(
  value: unknown,
  currentSlug: FullSlug,
  allFiles: QuartzPluginData[],
): RenderNode[] {
  if (value === undefined || value === null) return []
  if (isIconToken(value)) {
    const cleaned = value.value.trim()
    if (cleaned.length === 0) return []
    return [renderIconNode(cleaned)]
  }
  if (Array.isArray(value)) {
    const nodes: RenderNode[] = []
    value.forEach((item, idx) => {
      nodes.push(...renderPropertyValueNodes(item, currentSlug, allFiles))
      if (idx < value.length - 1) {
        nodes.push(', ')
      }
    })
    return nodes
  }
  if (value instanceof Date) {
    return [value.toISOString().split('T')[0]]
  }
  if (typeof value === 'string') {
    return renderInlineString(value, currentSlug, allFiles)
  }
  return [String(value)]
}

function createListItemRenderer(
  view: BaseView,
  currentSlug: FullSlug,
  allFiles: QuartzPluginData[],
  getContext: EvalContextFactory,
  getPropertyExpr: PropertyExprGetter,
  properties?: Record<string, PropertyConfig>,
): (file: QuartzPluginData) => RenderElement {
  const nestedProperties = view.nestedProperties === true || view.indentProperties === true
  const order = Array.isArray(view.order) && view.order.length > 0 ? view.order : ['title']
  const [primaryProp, ...secondaryProps] = order
  const rawSeparator = typeof view.separator === 'string' ? view.separator : ','
  const separator = rawSeparator.endsWith(' ') ? rawSeparator : `${rawSeparator} `

  return file => {
    const slug = (file.slug || '') as FullSlug
    const fallbackTitle = getFileDisplayName(file) ?? fallbackNameFromSlug(slug)

    const primaryValue = primaryProp
      ? resolveValueWithFormulas(file, primaryProp, getContext, getPropertyExpr)
      : resolveValueWithFormulas(file, 'title', getContext, getPropertyExpr)
    const primaryText = listValueToPlainText(primaryValue) ?? fallbackTitle
    const anchor = buildFileLinkNode(slug, currentSlug, primaryText)

    const seen = new Set<string>()
    if (primaryProp) {
      seen.add(primaryProp)
    }

    if (!nestedProperties) {
      const inlineNodes: RenderNode[] = []

      for (const propertyKey of secondaryProps) {
        if (!propertyKey || seen.has(propertyKey)) continue
        const value = resolveValueWithFormulas(file, propertyKey, getContext, getPropertyExpr)
        if (!hasRenderableValue(value)) continue

        const renderedValue = renderPropertyValueNodes(value, currentSlug, allFiles)
        if (renderedValue.length === 0) continue

        inlineNodes.push(separator)
        inlineNodes.push(...renderedValue)
        seen.add(propertyKey)
      }

      return inlineNodes.length > 0 ? h('li', [anchor, ...inlineNodes]) : h('li', [anchor])
    }

    const metadataItems: RenderElement[] = []

    for (const propertyKey of secondaryProps) {
      if (!propertyKey || seen.has(propertyKey)) continue
      const value = resolveValueWithFormulas(file, propertyKey, getContext, getPropertyExpr)
      if (!hasRenderableValue(value)) continue

      const renderedValue = renderPropertyValueNodes(value, currentSlug, allFiles)
      if (renderedValue.length === 0) continue

      const label = getPropertyDisplayName(propertyKey, properties)
      metadataItems.push(h('li', [h('span.base-list-meta-label', `${label}: `), ...renderedValue]))
      seen.add(propertyKey)
    }

    if (metadataItems.length === 0) {
      return h('li', [anchor])
    }

    return h('li', [anchor, h('ul.base-list-nested', metadataItems)])
  }
}

function buildList(
  files: QuartzPluginData[],
  view: BaseView,
  currentSlug: FullSlug,
  allFiles: QuartzPluginData[],
  getContext: EvalContextFactory,
  getPropertyExpr: PropertyExprGetter,
  properties?: Record<string, PropertyConfig>,
): RenderElement {
  const renderListItem = createListItemRenderer(
    view,
    currentSlug,
    allFiles,
    getContext,
    getPropertyExpr,
    properties,
  )

  if (view.groupBy) {
    const groups = groupFiles(files, view.groupBy, getContext, getPropertyExpr)
    const groupElements: RenderElement[] = []

    for (const [groupName, groupedFiles] of groups) {
      const items = groupedFiles.map(file => renderListItem(file))
      groupElements.push(
        h('div.base-list-group', [
          h('h3.base-list-group-header', groupName),
          h('ul.base-list', items),
        ]),
      )
    }

    return h('div.base-list-container', groupElements)
  }

  const items = files.map(file => renderListItem(file))
  return h('ul.base-list', items)
}

function normalizeCalendarDate(value: unknown): string | undefined {
  if (value instanceof Date) {
    return value.toISOString().split('T')[0]
  }
  if (typeof value === 'string') {
    const match = value.match(/^\d{4}-\d{2}-\d{2}/)
    if (match) return match[0]
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().split('T')[0]
    }
    return undefined
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().split('T')[0]
    }
  }
  return undefined
}

function buildCalendar(
  files: QuartzPluginData[],
  view: BaseView,
  currentSlug: FullSlug,
  allFiles: QuartzPluginData[],
  getContext: EvalContextFactory,
  getPropertyExpr: PropertyExprGetter,
  properties?: Record<string, PropertyConfig>,
): RenderElement {
  const dateField =
    typeof view.date === 'string'
      ? view.date
      : typeof view.dateField === 'string'
        ? view.dateField
        : typeof view.dateProperty === 'string'
          ? view.dateProperty
          : 'date'

  const renderListItem = createListItemRenderer(
    view,
    currentSlug,
    allFiles,
    getContext,
    getPropertyExpr,
    properties,
  )

  const groups = new Map<string, QuartzPluginData[]>()
  for (const file of files) {
    const dateValue = resolveValueWithFormulas(file, dateField, getContext, getPropertyExpr)
    const dateKey = normalizeCalendarDate(dateValue) ?? '(no date)'
    if (!groups.has(dateKey)) {
      groups.set(dateKey, [])
    }
    groups.get(dateKey)!.push(file)
  }

  const groupElements: RenderElement[] = []
  const sorted = [...groups.entries()].sort(([a], [b]) => a.localeCompare(b))
  for (const [dateKey, groupedFiles] of sorted) {
    const items = groupedFiles.map(file => renderListItem(file))
    groupElements.push(
      h('div.base-calendar-group', [
        h('h3.base-calendar-group-header', dateKey),
        h('ul.base-list', items),
      ]),
    )
  }

  return h('div.base-calendar-container', groupElements)
}

function resolveCardImageUrl(imageValue: unknown, currentSlug: FullSlug): string | undefined {
  const source =
    typeof imageValue === 'string'
      ? imageValue
      : Array.isArray(imageValue) && typeof imageValue[0] === 'string'
        ? imageValue[0]
        : undefined

  if (!source) return undefined

  const trimmed = source.trim()
  if (!trimmed) return undefined

  const toRelativeFromSlug = (target: string): string => {
    if (isAbsoluteURL(target)) return target
    const imgSlug = slugifyFilePath(target as FilePath)
    return resolveRelative(currentSlug, imgSlug)
  }

  const wl = trimmed.match(/^\[\[(.+?)\]\]$/)
  if (wl) {
    const inner = wl[1]
    const { target } = splitTargetAndAlias(inner)
    const { slug } = normalizeTargetSlug(target, currentSlug)
    return resolveRelative(currentSlug, slug)
  }

  return toRelativeFromSlug(trimmed)
}

function buildCards(
  files: QuartzPluginData[],
  view: BaseView,
  currentSlug: FullSlug,
  allFiles: QuartzPluginData[],
  getContext: EvalContextFactory,
  getPropertyExpr: PropertyExprGetter,
  properties?: Record<string, PropertyConfig>,
): RenderElement {
  const imageField = view.image || 'image'

  const renderCard = (file: QuartzPluginData): RenderElement => {
    const slug = (file.slug || '') as FullSlug
    const title = getFileDisplayName(file) ?? fallbackNameFromSlug(slug)
    const href = resolveRelative(currentSlug, slug)

    const imageValue = resolveValueWithFormulas(file, imageField, getContext, getPropertyExpr)
    const imageUrl = resolveCardImageUrl(imageValue, currentSlug)

    const metadataItems: RenderElement[] = []
    const order = Array.isArray(view.order) ? view.order : []
    const metadataFields = order.filter(
      (field): field is string =>
        typeof field === 'string' &&
        field !== 'title' &&
        field !== 'file.title' &&
        field !== 'note.title' &&
        field !== imageField,
    )

    for (const field of metadataFields) {
      const value = resolveValueWithFormulas(file, field, getContext, getPropertyExpr)
      if (!hasRenderableValue(value)) continue
      const renderedValue = renderPropertyValueNodes(value, currentSlug, allFiles)
      if (renderedValue.length === 0) continue
      const label = getPropertyDisplayName(field, properties)
      metadataItems.push(
        h('div.base-card-meta-item', [
          h('span.base-card-meta-label', label),
          h('span.base-card-meta-value', renderedValue),
        ]),
      )
    }

    const cardChildren: RenderElement[] = []
    if (imageUrl) {
      cardChildren.push(
        h(
          'a.base-card-image-link',
          {
            href,
            'data-slug': slug,
            style: {
              'background-image': `url(${imageUrl})`,
              'background-size': 'cover',
              top: '0px',
              'inset-inline': '0px',
            },
          },
          [],
        ),
      )
    }

    const contentChildren: RenderElement[] = [
      h('a.base-card-title-link', { href, 'data-slug': slug }, [h('h3.base-card-title', title)]),
    ]
    if (metadataItems.length > 0) {
      contentChildren.push(h('div.base-card-meta', metadataItems))
    }

    cardChildren.push(h('div.base-card-content', contentChildren))

    return h('div.base-card', cardChildren)
  }

  const styleParts: string[] = []
  if (typeof view.cardSize === 'number' && view.cardSize > 0) {
    styleParts.push(`--base-card-min: ${view.cardSize}px;`)
  }
  if (typeof view.cardAspect === 'number' && view.cardAspect > 0) {
    styleParts.push(`--base-card-aspect: ${view.cardAspect};`)
  }
  const varStyle = styleParts.length > 0 ? styleParts.join(' ') : undefined

  if (view.groupBy) {
    const groups = groupFiles(files, view.groupBy, getContext, getPropertyExpr)
    const groupElements: RenderElement[] = []

    const groupSizes = view.groupSizes
    const groupAspects = view.groupAspects

    for (const [groupName, groupFiles] of groups) {
      const cards = groupFiles.map(file => renderCard(file))
      const parts: string[] = []
      const size = groupSizes?.[groupName]
      if (typeof size === 'number' && size > 0) {
        parts.push(`--base-card-min: ${size}px;`)
      }
      const aspect = groupAspects?.[groupName]
      if (typeof aspect === 'number' && aspect > 0) {
        parts.push(`--base-card-aspect: ${aspect};`)
      }
      const gridStyle = parts.length > 0 ? parts.join(' ') : undefined

      groupElements.push(
        h('div.base-card-group', [
          h('h3.base-card-group-header', groupName),
          h('div.base-card-grid', gridStyle ? { style: gridStyle } : {}, cards),
        ]),
      )
    }

    return h('div.base-card-container', varStyle ? { style: varStyle } : {}, groupElements)
  }

  const cards = files.map(file => renderCard(file))
  return h('div.base-card-grid', varStyle ? { style: varStyle } : {}, cards)
}

type MapMarker = {
  lat: number
  lon: number
  title: string
  slug: FullSlug
  icon?: string
  color?: string
  popupFields: Record<string, unknown>
}

function buildMap(
  files: QuartzPluginData[],
  view: BaseView,
  currentSlug: FullSlug,
  getContext: EvalContextFactory,
  getPropertyExpr: PropertyExprGetter,
  properties?: Record<string, PropertyConfig>,
): RenderElement {
  const resolveMapProperty = (file: QuartzPluginData, prop: string | undefined): unknown => {
    if (!prop) return undefined
    const key = prop.trim()
    if (!key) return undefined
    if (getPropertyExpr(key)) {
      return resolveValueWithFormulas(file, key, getContext, getPropertyExpr)
    }
    if (key.startsWith('note.')) {
      const stripped = key.replace(/^note\./, '')
      if (getPropertyExpr(stripped)) {
        return resolveValueWithFormulas(file, stripped, getContext, getPropertyExpr)
      }
    } else {
      const prefixed = `note.${key}`
      if (getPropertyExpr(prefixed)) {
        return resolveValueWithFormulas(file, prefixed, getContext, getPropertyExpr)
      }
    }
    return undefined
  }

  const coordinatesProp = view.coordinates || 'coordinates'

  const markers: MapMarker[] = []

  for (const file of files) {
    const coordsValue = resolveMapProperty(file, coordinatesProp)
    if (!coordsValue || !Array.isArray(coordsValue) || coordsValue.length < 2) {
      continue
    }

    const lat = parseFloat(String(coordsValue[0]))
    const lon = parseFloat(String(coordsValue[1]))

    if (isNaN(lat) || isNaN(lon)) {
      continue
    }

    const title = getFileDisplayName(file) ?? fallbackNameFromSlug((file.slug || '') as FullSlug)
    const slug = (file.slug || '') as FullSlug

    const popupFields: Record<string, unknown> = {}
    const order = Array.isArray(view.order) ? view.order : []
    for (const field of order) {
      if (typeof field !== 'string') continue
      if (field === 'title' || field === 'file.title' || field === 'note.title') continue
      const value = resolveValueWithFormulas(file, field, getContext, getPropertyExpr)
      if (hasRenderableValue(value)) {
        popupFields[field] = value
      }
    }

    const icon = resolveMapProperty(file, view.markerIcon)
    const color = resolveMapProperty(file, view.markerColor)
    const iconHtml = isIconToken(icon)
      ? renderIconHtml(icon.value)
      : icon
        ? String(icon)
        : undefined

    markers.push({
      lat,
      lon,
      title,
      slug,
      icon: iconHtml,
      color: color ? String(color) : undefined,
      popupFields,
    })
  }

  const config = {
    defaultZoom: view.defaultZoom ?? 12,
    defaultCenter: view.defaultCenter,
    clustering: view.clustering !== false,
  }

  const attrs: Record<string, string> = {
    'data-markers': JSON.stringify(markers),
    'data-config': JSON.stringify(config),
    'data-current-slug': currentSlug,
  }

  if (properties) {
    attrs['data-properties'] = JSON.stringify(properties)
  }

  return h('div.base-map', attrs)
}

function resolveViewSlug(baseSlug: FullSlug, viewName: string, viewIndex: number): FullSlug {
  if (viewIndex === 0) return baseSlug
  const slugifiedName = slugifyFilePath((viewName + '.tmp') as FilePath, true)
  return joinSegments(baseSlug, slugifiedName) as FullSlug
}

function renderDiagnostics(
  diagnostics: BaseExpressionDiagnostic[] | undefined,
  currentSlug: FullSlug,
): RenderElement | undefined {
  if (!diagnostics || diagnostics.length === 0) {
    return undefined
  }
  const items: RenderElement[] = diagnostics.map((diag, index) => {
    const line = diag.span.start.line
    const column = diag.span.start.column
    const location = Number.isFinite(line) && Number.isFinite(column) ? `${line}:${column}` : ''
    const label = location.length > 0 ? `${diag.context} (${location})` : diag.context
    return h('li.base-diagnostics-item', { key: String(index) }, [
      h('div.base-diagnostics-label', label),
      h('div.base-diagnostics-message', diag.message),
      h('code.base-diagnostics-source', diag.source),
    ])
  })
  return h('div.base-diagnostics', [
    h('div.base-diagnostics-title', 'bases diagnostics'),
    h('div.base-diagnostics-meta', [
      h('span', 'page'),
      h('span.base-diagnostics-page', currentSlug),
    ]),
    h('ul.base-diagnostics-list', items),
  ])
}

export type BaseViewMeta = { name: string; type: BaseView['type']; slug: FullSlug }

export type RenderedBaseView = {
  view: BaseView
  slug: FullSlug
  tree: Root
  resultCount: number
  totalCount: number
}

export type BaseMetadata = { baseSlug: FullSlug; currentView: string; allViews: BaseViewMeta[] }

export function renderBaseViewsForFile(
  baseFileData: QuartzPluginData,
  allFiles: QuartzPluginData[],
  thisFile?: QuartzPluginData,
): { views: RenderedBaseView[]; allViews: BaseViewMeta[] } {
  const config = baseFileData.basesConfig as BaseFile | undefined
  if (!config || !baseFileData.slug) {
    return { views: [], allViews: [] }
  }

  const baseSlug = baseFileData.slug as FullSlug
  const expressions = baseFileData.basesExpressions
  const formulaExpressions = expressions?.formulas
  const summaryExpressionsByView = expressions?.viewSummaries
  const viewFilterExpressions = expressions?.viewFilters
  const formulaCaches = new Map<string, Map<string, Value>>()
  const propertyCaches = new Map<string, Map<string, Value>>()
  const runtimeDiagnostics: BaseExpressionDiagnostic[] = []
  const runtimeDiagnosticSet = new Set<string>()
  const propertyExpressions = expressions?.propertyExpressions ?? {}

  const fileIndex = new Map<string, QuartzPluginData>()
  for (const entry of allFiles) {
    if (!entry.slug) continue
    fileIndex.set(simplifySlug(entry.slug as FullSlug), entry)
  }

  const backlinkSets = new Map<string, Set<string>>()
  for (const entry of allFiles) {
    if (!entry.slug) continue
    const sourceSlug = simplifySlug(entry.slug as FullSlug)
    const links = Array.isArray(entry.links) ? entry.links.map(link => String(link)) : []
    for (const link of links) {
      if (!link) continue
      let set = backlinkSets.get(link)
      if (!set) {
        set = new Set()
        backlinkSets.set(link, set)
      }
      set.add(sourceSlug)
    }
  }
  const backlinksIndex = new Map<string, string[]>()
  for (const [key, set] of backlinkSets) {
    backlinksIndex.set(key, [...set])
  }

  const getPropertyExpr: PropertyExprGetter = property => {
    const key = property.trim()
    if (!key) return null
    return propertyExpressions[key] ?? null
  }

  const baseThisFile = thisFile ?? baseFileData

  const getEvalContext: EvalContextFactory = file => {
    const slug = file.slug ? String(file.slug) : file.filePath ? String(file.filePath) : ''
    let cache = formulaCaches.get(slug)
    if (!cache) {
      cache = new Map()
      formulaCaches.set(slug, cache)
    }
    let propertyCache = propertyCaches.get(slug)
    if (!propertyCache) {
      propertyCache = new Map()
      propertyCaches.set(slug, propertyCache)
    }
    return {
      file,
      thisFile: baseThisFile,
      allFiles,
      fileIndex,
      backlinksIndex,
      formulas: formulaExpressions,
      formulaSources: config.formulas,
      formulaCache: cache,
      formulaStack: new Set(),
      propertyCache,
      diagnostics: runtimeDiagnostics,
      diagnosticSet: runtimeDiagnosticSet,
    }
  }

  const allViews = config.views.map((view, idx) => ({
    name: view.name,
    type: view.type,
    slug: resolveViewSlug(baseSlug, view.name, idx),
  }))

  const baseFilterSource = typeof config.filters === 'string' ? config.filters : ''
  const baseMatchedFiles = expressions?.filters
    ? allFiles.filter(file => {
        const ctx = getEvalContext(file)
        ctx.diagnosticContext = 'filters'
        ctx.diagnosticSource = baseFilterSource
        return evaluateFilterExpression(expressions.filters!, ctx)
      })
    : allFiles

  const views: RenderedBaseView[] = []

  for (const [viewIndex, view] of config.views.entries()) {
    const slug = resolveViewSlug(baseSlug, view.name, viewIndex)

    let matchedFiles = baseMatchedFiles
    const viewFilter = viewFilterExpressions ? viewFilterExpressions[String(viewIndex)] : undefined
    if (viewFilter) {
      const viewFilterSource = typeof view.filters === 'string' ? view.filters : ''
      matchedFiles = matchedFiles.filter(file => {
        const ctx = getEvalContext(file)
        ctx.diagnosticContext = `views[${viewIndex}].filters`
        ctx.diagnosticSource = viewFilterSource
        return evaluateFilterExpression(viewFilter, ctx)
      })
    }

    const sortedFiles = applySorting(matchedFiles, view.sort, getEvalContext, getPropertyExpr)
    const limitedFiles = view.limit ? sortedFiles.slice(0, view.limit) : sortedFiles
    const totalCount = matchedFiles.length
    const resultCount = limitedFiles.length

    const diagnostics = [...(baseFileData.basesDiagnostics ?? []), ...runtimeDiagnostics]
    const diagnosticsNode = renderDiagnostics(
      diagnostics.length > 0 ? diagnostics : undefined,
      slug,
    )
    const wrapView = (node: RenderElement) =>
      h('div.base-view', { 'data-base-view-type': view.type, 'data-base-view-name': view.name }, [
        node,
      ])

    let viewNode: RenderElement | undefined
    switch (view.type) {
      case 'table':
        viewNode = buildTable(
          limitedFiles,
          view,
          slug,
          allFiles,
          getEvalContext,
          getPropertyExpr,
          config.properties,
          config.summaries,
          summaryExpressionsByView ? summaryExpressionsByView[String(viewIndex)] : undefined,
        )
        break
      case 'list':
        viewNode = buildList(
          limitedFiles,
          view,
          slug,
          allFiles,
          getEvalContext,
          getPropertyExpr,
          config.properties,
        )
        break
      case 'card':
      case 'cards':
      case 'gallery':
      case 'board':
        viewNode = buildCards(
          limitedFiles,
          view,
          slug,
          allFiles,
          getEvalContext,
          getPropertyExpr,
          config.properties,
        )
        break
      case 'calendar':
        viewNode = buildCalendar(
          limitedFiles,
          view,
          slug,
          allFiles,
          getEvalContext,
          getPropertyExpr,
          config.properties,
        )
        break
      case 'map':
        viewNode = buildMap(
          limitedFiles,
          view,
          slug,
          getEvalContext,
          getPropertyExpr,
          config.properties,
        )
        break
      default:
        viewNode = undefined
    }

    if (!viewNode) continue

    const wrapped = wrapView(viewNode)
    const tree: Root = {
      type: 'root',
      children: diagnosticsNode ? [diagnosticsNode, wrapped] : [wrapped],
    }

    views.push({ view, slug, tree, resultCount, totalCount })
  }

  return { views, allViews }
}
