import { QuartzPluginData } from '../../plugins/vfile'
import { evaluateSummaryExpression, valueToUnknown, EvalContext, ProgramIR } from './compiler'
import { SummaryDefinition, ViewSummaryConfig, BuiltinSummaryType } from './types'

type SummaryValueResolver = (
  file: QuartzPluginData,
  column: string,
  allFiles: QuartzPluginData[],
) => unknown

type SummaryContextFactory = (file: QuartzPluginData) => EvalContext

export function computeColumnSummary(
  column: string,
  files: QuartzPluginData[],
  summary: SummaryDefinition,
  allFiles: QuartzPluginData[] = [],
  valueResolver: SummaryValueResolver,
  getContext: SummaryContextFactory,
  summaryExpression?: ProgramIR,
): string | number | undefined {
  if (files.length === 0) {
    return undefined
  }

  const values = files.map(file => valueResolver(file, column, allFiles))

  if (summary.type === 'builtin' && summary.builtinType) {
    return computeBuiltinSummary(values, summary.builtinType)
  }

  if (summary.type === 'formula' && summary.expression) {
    if (summaryExpression) {
      const summaryCtx = getContext(files[0])
      summaryCtx.diagnosticContext = `summaries.${column}`
      summaryCtx.diagnosticSource = summary.expression
      summaryCtx.rows = files
      const value = evaluateSummaryExpression(summaryExpression, values, summaryCtx)
      const unknownValue = valueToUnknown(value)
      if (typeof unknownValue === 'number' || typeof unknownValue === 'string') {
        return unknownValue
      }
      return undefined
    }
  }

  return undefined
}

function computeBuiltinSummary(
  values: any[],
  type: BuiltinSummaryType,
): string | number | undefined {
  switch (type) {
    case 'count':
      return values.length

    case 'sum': {
      const nums = values.filter(v => typeof v === 'number')
      if (nums.length === 0) return undefined
      return nums.reduce((acc, v) => acc + v, 0)
    }

    case 'average':
    case 'avg': {
      const nums = values.filter(v => typeof v === 'number')
      if (nums.length === 0) return undefined
      const sum = nums.reduce((acc, v) => acc + v, 0)
      return Math.round((sum / nums.length) * 100) / 100
    }

    case 'min': {
      const comparable = values.filter(
        v => typeof v === 'number' || v instanceof Date || typeof v === 'string',
      )
      if (comparable.length === 0) return undefined
      const normalized = comparable.map(v => (v instanceof Date ? v.getTime() : v))
      const min = Math.min(...normalized.filter(v => typeof v === 'number'))
      if (isNaN(min)) {
        const strings = comparable.filter(v => typeof v === 'string') as string[]
        if (strings.length === 0) return undefined
        return strings.sort()[0]
      }
      if (comparable.some(v => v instanceof Date)) {
        return new Date(min).toISOString().split('T')[0]
      }
      return min
    }

    case 'max': {
      const comparable = values.filter(
        v => typeof v === 'number' || v instanceof Date || typeof v === 'string',
      )
      if (comparable.length === 0) return undefined
      const normalized = comparable.map(v => (v instanceof Date ? v.getTime() : v))
      const max = Math.max(...normalized.filter(v => typeof v === 'number'))
      if (isNaN(max)) {
        const strings = comparable.filter(v => typeof v === 'string') as string[]
        if (strings.length === 0) return undefined
        return strings.sort().reverse()[0]
      }
      if (comparable.some(v => v instanceof Date)) {
        return new Date(max).toISOString().split('T')[0]
      }
      return max
    }

    case 'range': {
      const comparable = values.filter(
        v => typeof v === 'number' || v instanceof Date || typeof v === 'string',
      )
      if (comparable.length === 0) return undefined
      const normalized = comparable.map(v => (v instanceof Date ? v.getTime() : v))
      const nums = normalized.filter(v => typeof v === 'number')
      if (nums.length === 0) return undefined
      const min = Math.min(...nums)
      const max = Math.max(...nums)
      if (comparable.some(v => v instanceof Date)) {
        return `${new Date(min).toISOString().split('T')[0]} - ${new Date(max).toISOString().split('T')[0]}`
      }
      return `${min} - ${max}`
    }

    case 'unique': {
      const nonNull = values.filter(v => v !== undefined && v !== null && v !== '')
      const unique = new Set(nonNull.map(v => (v instanceof Date ? v.toISOString() : String(v))))
      return unique.size
    }

    case 'filled': {
      const filled = values.filter(v => v !== undefined && v !== null && v !== '')
      return filled.length
    }

    case 'missing': {
      const missing = values.filter(v => v === undefined || v === null || v === '')
      return missing.length
    }

    case 'median': {
      const nums = values.filter(v => typeof v === 'number') as number[]
      if (nums.length === 0) return undefined
      const sorted = [...nums].sort((a, b) => a - b)
      const mid = Math.floor(sorted.length / 2)
      if (sorted.length % 2 === 0) {
        return (sorted[mid - 1] + sorted[mid]) / 2
      }
      return sorted[mid]
    }

    case 'stddev': {
      const nums = values.filter(v => typeof v === 'number') as number[]
      if (nums.length === 0) return undefined
      const mean = nums.reduce((acc, v) => acc + v, 0) / nums.length
      const variance = nums.reduce((acc, v) => acc + (v - mean) * (v - mean), 0) / nums.length
      return Math.round(Math.sqrt(variance) * 100) / 100
    }

    case 'checked':
      return values.filter(v => v === true).length

    case 'unchecked':
      return values.filter(v => v === false).length

    case 'empty': {
      const count = values.filter(
        v =>
          v === undefined ||
          v === null ||
          v === '' ||
          (Array.isArray(v) && v.length === 0) ||
          (typeof v === 'object' && v !== null && !Array.isArray(v) && Object.keys(v).length === 0),
      ).length
      return count
    }

    case 'earliest': {
      const dates = values.filter(
        v =>
          v instanceof Date ||
          (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v)) ||
          typeof v === 'number',
      )
      if (dates.length === 0) return undefined
      const timestamps = dates.map(v => {
        if (v instanceof Date) return v.getTime()
        if (typeof v === 'string') return new Date(v).getTime()
        return v
      })
      const earliest = Math.min(...timestamps)
      return new Date(earliest).toISOString().split('T')[0]
    }

    case 'latest': {
      const dates = values.filter(
        v =>
          v instanceof Date ||
          (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}/.test(v)) ||
          typeof v === 'number',
      )
      if (dates.length === 0) return undefined
      const timestamps = dates.map(v => {
        if (v instanceof Date) return v.getTime()
        if (typeof v === 'string') return new Date(v).getTime()
        return v
      })
      const latest = Math.max(...timestamps)
      return new Date(latest).toISOString().split('T')[0]
    }

    default:
      return undefined
  }
}

export function computeViewSummaries(
  columns: string[],
  files: QuartzPluginData[],
  summaryConfig: ViewSummaryConfig | undefined,
  allFiles: QuartzPluginData[] = [],
  getContext: SummaryContextFactory,
  valueResolver: SummaryValueResolver,
  summaryExpressions?: Record<string, ProgramIR>,
): Record<string, string | number | undefined> {
  const results: Record<string, string | number | undefined> = {}

  if (!summaryConfig?.columns) {
    return results
  }

  for (const column of columns) {
    const summary = summaryConfig.columns[column]
    if (summary) {
      const expression = summaryExpressions ? summaryExpressions[column] : undefined
      results[column] = computeColumnSummary(
        column,
        files,
        summary,
        allFiles,
        valueResolver,
        getContext,
        expression,
      )
    }
  }

  return results
}
