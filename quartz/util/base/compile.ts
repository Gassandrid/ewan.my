import yaml from 'js-yaml'
import {
  parseExpressionSource,
  compileExpression,
  buildPropertyExpressionSource,
  BaseExpressionDiagnostic,
  BasesExpressions,
  ProgramIR,
} from './compiler'
import { Expr, LogicalExpr, UnaryExpr, spanFrom } from './compiler/ast'
import { BUILTIN_SUMMARY_TYPES } from './compiler/schema'
import { parseViews, BaseFile, PropertyConfig } from './types'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const normalizeProperties = (raw: unknown): Record<string, PropertyConfig> | undefined => {
  if (!isRecord(raw)) return undefined
  const normalized: Record<string, PropertyConfig> = {}

  for (const [key, value] of Object.entries(raw)) {
    if (!isRecord(value)) continue
    const displayName = typeof value.displayName === 'string' ? value.displayName : undefined
    const propConfig: PropertyConfig = displayName ? { displayName } : {}
    normalized[key] = propConfig

    const withoutPrefix = key.replace(/^(?:note|file)\./, '')
    if (withoutPrefix !== key && !(withoutPrefix in normalized)) {
      normalized[withoutPrefix] = propConfig
    }

    const segments = withoutPrefix.split('.')
    const lastSegment = segments[segments.length - 1]
    if (lastSegment && !(lastSegment in normalized)) {
      normalized[lastSegment] = propConfig
    }
  }

  return Object.keys(normalized).length > 0 ? normalized : undefined
}

type CompileBaseResult = {
  config: BaseFile
  diagnostics: BaseExpressionDiagnostic[]
  expressions: BasesExpressions
}

export function compileBaseConfig(source: string, path?: string): CompileBaseResult {
  const parsed = yaml.load(source)
  const parsedConfig: Record<string, unknown> = isRecord(parsed) ? parsed : {}

  const properties = normalizeProperties(parsedConfig.properties)
  const diagnostics: BaseExpressionDiagnostic[] = []
  const expressions: BasesExpressions = {
    viewFilters: {},
    formulas: {},
    summaries: {},
    viewSummaries: {},
    propertyExpressions: {},
  }

  const summariesRaw = parsedConfig.summaries
  const summaries = isRecord(summariesRaw)
    ? Object.entries(summariesRaw).reduce<Record<string, string>>((acc, [key, value]) => {
        if (typeof value === 'string') {
          acc[key] = value
        }
        return acc
      }, {})
    : undefined

  const builtinSummaries = new Set<string>(BUILTIN_SUMMARY_TYPES)
  const summaryKeys = summaries ? Object.keys(summaries) : []

  const addExpressionDiagnostics = (exprSource: string, context: string) => {
    const result = parseExpressionSource(exprSource, path)
    if (result.diagnostics.length === 0) return
    for (const diagnostic of result.diagnostics) {
      diagnostics.push({
        kind: diagnostic.kind,
        message: diagnostic.message,
        span: diagnostic.span,
        context,
        source: exprSource,
      })
    }
  }

  const parseExpression = (exprSource: string): Expr | null => {
    const result = parseExpressionSource(exprSource, path)
    if (!result.program.body) return null
    return result.program.body
  }

  const parseExpressionWithDiagnostics = (exprSource: string, context: string): Expr | null => {
    const result = parseExpressionSource(exprSource, path)
    if (result.diagnostics.length > 0) {
      for (const diagnostic of result.diagnostics) {
        diagnostics.push({
          kind: diagnostic.kind,
          message: diagnostic.message,
          span: diagnostic.span,
          context,
          source: exprSource,
        })
      }
    }
    return result.program.body ?? null
  }

  const addPropertyExpression = (property: string, context: string) => {
    const key = property.trim()
    if (!key || expressions.propertyExpressions[key]) return
    const exprSource = buildPropertyExpressionSource(key)
    if (!exprSource) return
    const expr = parseExpressionWithDiagnostics(exprSource, context)
    if (expr) {
      expressions.propertyExpressions[key] = compileExpression(expr)
    }
  }

  const buildLogical = (operator: '&&' | '||', expressionsList: Expr[]): Expr | null => {
    if (expressionsList.length === 0) return null
    let current: Expr | null = null
    for (const next of expressionsList) {
      if (!current) {
        current = next
        continue
      }
      const span = spanFrom(current.span, next.span)
      const node: LogicalExpr = { type: 'LogicalExpr', operator, left: current, right: next, span }
      current = node
    }
    return current
  }

  const negateExpressions = (expressionsList: Expr[]): Expr[] =>
    expressionsList.map(expr => {
      const node: UnaryExpr = {
        type: 'UnaryExpr',
        operator: '!',
        argument: expr,
        span: spanFrom(expr.span, expr.span),
      }
      return node
    })

  const buildFilterExpr = (raw: unknown, context: string): Expr | null => {
    if (typeof raw === 'string') {
      addExpressionDiagnostics(raw, context)
      return parseExpression(raw)
    }
    if (!isRecord(raw)) return null
    const record = raw
    if (Array.isArray(record.and)) {
      const parts = record.and
        .map((entry, index) => buildFilterExpr(entry, `${context}.and[${index}]`))
        .filter((entry): entry is Expr => Boolean(entry))
      return buildLogical('&&', parts)
    }
    if (Array.isArray(record.or)) {
      const parts = record.or
        .map((entry, index) => buildFilterExpr(entry, `${context}.or[${index}]`))
        .filter((entry): entry is Expr => Boolean(entry))
      return buildLogical('||', parts)
    }
    if (Array.isArray(record.not)) {
      const parts = record.not
        .map((entry, index) => buildFilterExpr(entry, `${context}.not[${index}]`))
        .filter((entry): entry is Expr => Boolean(entry))
      return buildLogical('&&', negateExpressions(parts))
    }
    return null
  }

  const walkSummaries = (raw: unknown, context: string) => {
    if (!isRecord(raw)) return
    const columns = 'columns' in raw && isRecord(raw.columns) ? raw.columns : raw
    for (const [key, value] of Object.entries(columns)) {
      if (typeof value !== 'string') continue
      const normalized = value.toLowerCase().trim()
      if (builtinSummaries.has(normalized)) continue
      if (summaryKeys.includes(value)) continue
      addExpressionDiagnostics(value, `${context}.${key}`)
    }
  }

  const collectViewProperties = (view: Record<string, unknown>, viewIndex: number) => {
    const viewContext = `views[${viewIndex}]`
    if (Array.isArray(view.order)) {
      view.order.forEach((entry, orderIndex) => {
        if (typeof entry === 'string') {
          addPropertyExpression(entry, `${viewContext}.order[${orderIndex}]`)
        }
      })
    }

    if (Array.isArray(view.sort)) {
      view.sort.forEach((entry, sortIndex) => {
        if (isRecord(entry) && typeof entry.property === 'string') {
          addPropertyExpression(entry.property, `${viewContext}.sort[${sortIndex}].property`)
        }
      })
    }

    if (typeof view.groupBy === 'string') {
      addPropertyExpression(view.groupBy, `${viewContext}.groupBy`)
    } else if (isRecord(view.groupBy) && typeof view.groupBy.property === 'string') {
      addPropertyExpression(view.groupBy.property, `${viewContext}.groupBy.property`)
    }

    if (typeof view.image === 'string') {
      addPropertyExpression(view.image, `${viewContext}.image`)
    }

    if (typeof view.coordinates === 'string') {
      addPropertyExpression(view.coordinates, `${viewContext}.coordinates`)
    } else if (view.type === 'map') {
      addPropertyExpression('coordinates', `${viewContext}.coordinates`)
    }

    if (typeof view.markerIcon === 'string') {
      addPropertyExpression(view.markerIcon, `${viewContext}.markerIcon`)
    }

    if (typeof view.markerColor === 'string') {
      addPropertyExpression(view.markerColor, `${viewContext}.markerColor`)
    }

    if (view.summaries && isRecord(view.summaries)) {
      const columns =
        'columns' in view.summaries && isRecord(view.summaries.columns)
          ? view.summaries.columns
          : view.summaries
      for (const key of Object.keys(columns)) {
        addPropertyExpression(key, `${viewContext}.summaries.${key}`)
      }
    }

    if (view.type === 'list') {
      const hasOrder = Array.isArray(view.order) && view.order.length > 0
      if (!hasOrder) {
        addPropertyExpression('title', `${viewContext}.order`)
      }
    }

    if (view.type === 'card' || view.type === 'cards') {
      const imageProp = typeof view.image === 'string' ? view.image : 'image'
      addPropertyExpression(imageProp, `${viewContext}.image`)
    }

    if (view.type === 'table') {
      const orderList = Array.isArray(view.order) ? view.order : []
      for (const entry of orderList) {
        if (entry === 'title' || entry === 'file.title' || entry === 'note.title') {
          addPropertyExpression('file.title', `${viewContext}.order`)
          break
        }
      }
      for (const entry of orderList) {
        if (entry === 'file.name') {
          addPropertyExpression('file.name', `${viewContext}.order`)
          break
        }
      }
    }
  }

  if (parsedConfig.filters) {
    const expr = buildFilterExpr(parsedConfig.filters, 'filters')
    if (expr) {
      expressions.filters = compileExpression(expr)
    }
  }

  if (Array.isArray(parsedConfig.views)) {
    parsedConfig.views.forEach((view, index) => {
      if (!isRecord(view)) return
      collectViewProperties(view, index)
      if (view.filters) {
        const expr = buildFilterExpr(view.filters, `views[${index}].filters`)
        if (expr) {
          expressions.viewFilters[String(index)] = compileExpression(expr)
        }
      }
      if (view.summaries) {
        walkSummaries(view.summaries, `views[${index}].summaries`)
      }
    })
  }

  if (isRecord(parsedConfig.formulas)) {
    for (const [name, expression] of Object.entries(parsedConfig.formulas)) {
      if (typeof expression === 'string') {
        addExpressionDiagnostics(expression, `formulas.${name}`)
        const expr = parseExpression(expression)
        if (expr) {
          expressions.formulas[name] = compileExpression(expr)
        }
      }
    }
  }

  if (summaries) {
    for (const [name, expression] of Object.entries(summaries)) {
      if (typeof expression === 'string') {
        addExpressionDiagnostics(expression, `summaries.${name}`)
        const expr = parseExpression(expression)
        if (expr) {
          expressions.summaries[name] = compileExpression(expr)
        }
      }
    }
  }

  if (Array.isArray(parsedConfig.views)) {
    parsedConfig.views.forEach((view, index) => {
      if (!isRecord(view) || !view.summaries) return
      const viewSummaries = view.summaries
      if (!isRecord(viewSummaries)) return
      const columns =
        'columns' in viewSummaries && isRecord(viewSummaries.columns)
          ? viewSummaries.columns
          : viewSummaries
      const viewKey = String(index)
      const viewMap: Record<string, ProgramIR> = {}
      for (const [column, summaryValue] of Object.entries(columns)) {
        if (typeof summaryValue !== 'string') continue
        const normalized = summaryValue.toLowerCase().trim()
        if (builtinSummaries.has(normalized)) continue
        const topLevel = expressions.summaries[summaryValue]
        if (topLevel) {
          viewMap[column] = topLevel
          continue
        }
        const expr = parseExpression(summaryValue)
        if (expr) {
          viewMap[column] = compileExpression(expr)
        }
      }
      if (Object.keys(viewMap).length > 0) {
        expressions.viewSummaries[viewKey] = viewMap
      }
    })
  }

  const rawFilters = parsedConfig.filters
  const filters: BaseFile['filters'] =
    typeof rawFilters === 'string' || isRecord(rawFilters)
      ? (rawFilters as BaseFile['filters'])
      : undefined

  const config: BaseFile = {
    filters,
    views: parseViews(parsedConfig.views as any[]),
    properties,
    summaries,
    formulas: isRecord(parsedConfig.formulas)
      ? Object.entries(parsedConfig.formulas).reduce<Record<string, string>>(
          (acc, [key, value]) => {
            if (typeof value === 'string') {
              acc[key] = value
            }
            return acc
          },
          {},
        )
      : undefined,
  }

  return { config, diagnostics, expressions }
}
