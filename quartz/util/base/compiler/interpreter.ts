import { QuartzPluginData } from '../../../plugins/vfile'
import { FilePath, FullSlug, simplifySlug, slugifyFilePath, splitAnchor } from '../../path'
import { parseWikilink, resolveWikilinkTarget } from '../../wikilinks'
import { BinaryExpr, Literal, Span } from './ast'
import { BaseExpressionDiagnostic } from './diagnostics'
import { ProgramIR, Instruction } from './ir'

export type NullValue = { kind: 'null' }
export type BooleanValue = { kind: 'boolean'; value: boolean }
export type NumberValue = { kind: 'number'; value: number }
export type StringValue = { kind: 'string'; value: string }
export type DateValue = { kind: 'date'; value: Date }
export type DurationValue = { kind: 'duration'; value: number; months: number }
export type ListValue = { kind: 'list'; value: Value[] }
export type ObjectValue = { kind: 'object'; value: Record<string, Value> }
export type FileValue = { kind: 'file'; value: QuartzPluginData }
export type LinkValue = { kind: 'link'; value: string; display?: string }
export type RegexValue = { kind: 'regex'; value: RegExp }
export type HtmlValue = { kind: 'html'; value: string }
export type IconValue = { kind: 'icon'; value: string }
export type ImageValue = { kind: 'image'; value: string }

export type Value =
  | NullValue
  | BooleanValue
  | NumberValue
  | StringValue
  | DateValue
  | DurationValue
  | ListValue
  | ObjectValue
  | FileValue
  | LinkValue
  | RegexValue
  | HtmlValue
  | IconValue
  | ImageValue

export type ValueKind = Value['kind']
export type ValueOf<K extends ValueKind> = Extract<Value, { kind: K }>

export function isValueKind(value: Value, kind: 'null'): value is NullValue
export function isValueKind(value: Value, kind: 'boolean'): value is BooleanValue
export function isValueKind(value: Value, kind: 'number'): value is NumberValue
export function isValueKind(value: Value, kind: 'string'): value is StringValue
export function isValueKind(value: Value, kind: 'date'): value is DateValue
export function isValueKind(value: Value, kind: 'duration'): value is DurationValue
export function isValueKind(value: Value, kind: 'list'): value is ListValue
export function isValueKind(value: Value, kind: 'object'): value is ObjectValue
export function isValueKind(value: Value, kind: 'file'): value is FileValue
export function isValueKind(value: Value, kind: 'link'): value is LinkValue
export function isValueKind(value: Value, kind: 'regex'): value is RegexValue
export function isValueKind(value: Value, kind: 'html'): value is HtmlValue
export function isValueKind(value: Value, kind: 'icon'): value is IconValue
export function isValueKind(value: Value, kind: 'image'): value is ImageValue
export function isValueKind(value: Value, kind: ValueKind): value is Value {
  return value.kind === kind
}

export type EvalContext = {
  file: QuartzPluginData
  thisFile?: QuartzPluginData
  allFiles: QuartzPluginData[]
  rows?: QuartzPluginData[]
  fileIndex?: Map<string, QuartzPluginData>
  backlinksIndex?: Map<string, string[]>
  formulas?: Record<string, ProgramIR>
  formulaSources?: Record<string, string>
  formulaCache?: Map<string, Value>
  formulaStack?: Set<string>
  locals?: Record<string, Value>
  values?: Value[]
  diagnostics?: BaseExpressionDiagnostic[]
  diagnosticContext?: string
  diagnosticSource?: string
  diagnosticSet?: Set<string>
  propertyCache?: Map<string, Value>
}

const nullValue: NullValue = { kind: 'null' }

const makeNull = (): NullValue => nullValue
const makeBoolean = (value: boolean): BooleanValue => ({ kind: 'boolean', value })
const makeNumber = (value: number): NumberValue => ({ kind: 'number', value })
const makeString = (value: string): StringValue => ({ kind: 'string', value })
const makeDate = (value: Date): DateValue => ({ kind: 'date', value })
const makeDuration = (value: number, months = 0): DurationValue => ({
  kind: 'duration',
  value,
  months,
})
const makeList = (value: Value[]): ListValue => ({ kind: 'list', value })
const makeObject = (value: Record<string, Value>): ObjectValue => ({ kind: 'object', value })
const makeFile = (value: QuartzPluginData): FileValue => ({ kind: 'file', value })
const makeLink = (value: string, display?: string): LinkValue => ({ kind: 'link', value, display })
const makeRegex = (value: RegExp): RegexValue => ({ kind: 'regex', value })
const makeHtml = (value: string): HtmlValue => ({ kind: 'html', value })
const makeIcon = (value: string): IconValue => ({ kind: 'icon', value })
const makeImage = (value: string): ImageValue => ({ kind: 'image', value })

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isValue = (value: unknown): value is Value =>
  typeof value === 'object' && value !== null && 'kind' in value

const isNumberValue = (value: Value): value is NumberValue => isValueKind(value, 'number')

const isStringValue = (value: Value): value is StringValue => isValueKind(value, 'string')

const isBooleanValue = (value: Value): value is BooleanValue => isValueKind(value, 'boolean')

const isListValue = (value: Value): value is ListValue => isValueKind(value, 'list')

const isObjectValue = (value: Value): value is ObjectValue => isValueKind(value, 'object')

const isDateValue = (value: Value): value is DateValue => isValueKind(value, 'date')

const isDurationValue = (value: Value): value is DurationValue => isValueKind(value, 'duration')

const isFileValue = (value: Value): value is FileValue => isValueKind(value, 'file')

const isLinkValue = (value: Value): value is LinkValue => isValueKind(value, 'link')

const isRegexValue = (value: Value): value is RegexValue => isValueKind(value, 'regex')

const stringMethods = new Set([
  'contains',
  'containsAny',
  'containsAll',
  'startsWith',
  'endsWith',
  'isEmpty',
  'lower',
  'title',
  'trim',
  'replace',
  'repeat',
  'reverse',
  'slice',
  'split',
  'length',
])

const numberMethods = new Set(['abs', 'ceil', 'floor', 'round', 'toFixed', 'isEmpty'])

const listMethods = new Set([
  'contains',
  'containsAny',
  'containsAll',
  'flat',
  'join',
  'reverse',
  'slice',
  'sort',
  'unique',
  'isEmpty',
  'length',
  'sum',
  'mean',
  'average',
  'median',
  'stddev',
  'min',
  'max',
])

const dateMethods = new Set([
  'date',
  'format',
  'time',
  'relative',
  'isEmpty',
  'year',
  'month',
  'day',
  'hour',
  'minute',
  'second',
  'millisecond',
])

const fileMethods = new Set(['asLink', 'hasTag', 'inFolder', 'hasProperty', 'hasLink'])

const linkMethods = new Set(['asFile', 'linksTo'])

const objectMethods = new Set(['isEmpty', 'keys', 'values'])

const formatLinkValue = (value: LinkValue): string => {
  const target = value.value
  const display = value.display?.trim()
  if (display && display.length > 0) {
    return `[[${target}|${display}]]`
  }
  return `[[${target}]]`
}

const valueToString = (value: Value): string => {
  switch (value.kind) {
    case 'null':
      return ''
    case 'boolean':
      return value.value ? 'true' : 'false'
    case 'number':
      return Number.isFinite(value.value) ? String(value.value) : ''
    case 'string':
      return value.value
    case 'date':
      return formatDate(value.value)
    case 'duration':
      return String(durationToMs(value))
    case 'list':
      return value.value.map(valueToString).join(', ')
    case 'object':
      return Object.keys(value.value).length > 0 ? '[object]' : ''
    case 'file':
      return value.value.slug ? String(value.value.slug) : ''
    case 'link':
      return value.value
    case 'regex':
      return value.value.source
    case 'html':
      return value.value
    case 'icon':
      return value.value
    case 'image':
      return value.value
  }
}

const valueToNumber = (value: Value): number => {
  switch (value.kind) {
    case 'number':
      return value.value
    case 'duration':
      return durationToMs(value)
    case 'boolean':
      return value.value ? 1 : 0
    case 'string': {
      const num = Number(value.value)
      return Number.isFinite(num) ? num : Number.NaN
    }
    case 'date':
      return value.value.getTime()
    default:
      return Number.NaN
  }
}

const coerceToNumber = (value: Value): number | null => {
  const num = valueToNumber(value)
  return Number.isFinite(num) ? num : null
}

const coerceToDate = (value: Value): Date | null => {
  if (isDateValue(value)) return value.value
  if (isNumberValue(value)) {
    const date = new Date(value.value)
    return Number.isNaN(date.getTime()) ? null : date
  }
  if (isStringValue(value)) {
    const parsed = new Date(value.value)
    return Number.isNaN(parsed.getTime()) ? null : parsed
  }
  return null
}

const isScalarValue = (value: Value): boolean =>
  !(
    value.kind === 'list' ||
    value.kind === 'object' ||
    value.kind === 'file' ||
    value.kind === 'link' ||
    value.kind === 'regex' ||
    value.kind === 'html' ||
    value.kind === 'icon' ||
    value.kind === 'image'
  )

const valueToBoolean = (value: Value): boolean => {
  switch (value.kind) {
    case 'null':
      return false
    case 'boolean':
      return value.value
    case 'number':
      return Number.isFinite(value.value) && value.value !== 0
    case 'string':
      return value.value.length > 0
    case 'date':
      return true
    case 'duration':
      return durationToMs(value) !== 0
    case 'list':
      return value.value.length > 0
    case 'object':
      return Object.keys(value.value).length > 0
    case 'file':
      return true
    case 'link':
      return value.value.length > 0
    case 'regex':
      return true
    case 'html':
      return value.value.length > 0
    case 'icon':
      return value.value.length > 0
    case 'image':
      return value.value.length > 0
  }
}

const valueEquals = (left: Value, right: Value, ctx: EvalContext): boolean => {
  const leftLinkish = isLinkValue(left) || isFileValue(left)
  const rightLinkish = isLinkValue(right) || isFileValue(right)
  if (
    (leftLinkish && (rightLinkish || isStringValue(right))) ||
    (rightLinkish && isStringValue(left))
  ) {
    const leftKey = resolveLinkComparisonKey(left, ctx)
    const rightKey = resolveLinkComparisonKey(right, ctx)
    if (leftKey.slug && rightKey.slug) return leftKey.slug === rightKey.slug
    if (!leftKey.slug && !rightKey.slug) return leftKey.text === rightKey.text
    return false
  }
  if (left.kind !== right.kind) {
    if (isScalarValue(left) && isScalarValue(right)) {
      const leftDate = coerceToDate(left)
      const rightDate = coerceToDate(right)
      if (leftDate && rightDate) return leftDate.getTime() === rightDate.getTime()
      const leftNum = coerceToNumber(left)
      const rightNum = coerceToNumber(right)
      if (leftNum !== null && rightNum !== null) return leftNum === rightNum
      return valueToString(left) === valueToString(right)
    }
    return false
  }
  if (left.kind === 'null') return true
  if (isBooleanValue(left) && isBooleanValue(right)) return left.value === right.value
  if (isNumberValue(left) && isNumberValue(right)) return left.value === right.value
  if (isStringValue(left) && isStringValue(right)) return left.value === right.value
  if (isDateValue(left) && isDateValue(right)) return left.value.getTime() === right.value.getTime()
  if (isDurationValue(left) && isDurationValue(right)) {
    return left.value === right.value && left.months === right.months
  }
  if (isRegexValue(left) && isRegexValue(right)) return left.value.source === right.value.source
  if (isListValue(left) && isListValue(right)) {
    if (left.value.length !== right.value.length) return false
    for (let i = 0; i < left.value.length; i += 1) {
      if (!valueEquals(left.value[i], right.value[i], ctx)) return false
    }
    return true
  }
  if (isObjectValue(left) && isObjectValue(right)) {
    const leftKeys = Object.keys(left.value)
    const rightKeys = Object.keys(right.value)
    if (leftKeys.length !== rightKeys.length) return false
    for (const key of leftKeys) {
      const l = left.value[key]
      const r = right.value[key]
      if (!r || !valueEquals(l, r, ctx)) return false
    }
    return true
  }
  return false
}

const formatDate = (date: Date): string => {
  const year = String(date.getUTCFullYear()).padStart(4, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatTime = (date: Date): string => {
  const hour = String(date.getUTCHours()).padStart(2, '0')
  const minute = String(date.getUTCMinutes()).padStart(2, '0')
  const second = String(date.getUTCSeconds()).padStart(2, '0')
  return `${hour}:${minute}:${second}`
}

const formatDatePattern = (date: Date, pattern: string): string => {
  const replacements: Record<string, string> = {
    YYYY: String(date.getUTCFullYear()).padStart(4, '0'),
    YY: String(date.getUTCFullYear() % 100).padStart(2, '0'),
    MM: String(date.getUTCMonth() + 1).padStart(2, '0'),
    DD: String(date.getUTCDate()).padStart(2, '0'),
    HH: String(date.getUTCHours()).padStart(2, '0'),
    mm: String(date.getUTCMinutes()).padStart(2, '0'),
    ss: String(date.getUTCSeconds()).padStart(2, '0'),
    SSS: String(date.getUTCMilliseconds()).padStart(3, '0'),
  }
  let result = pattern
  for (const [token, replacement] of Object.entries(replacements)) {
    result = result.split(token).join(replacement)
  }
  return result
}

const formatRelative = (date: Date): string => {
  const now = Date.now()
  const diff = date.getTime() - now
  const abs = Math.abs(diff)
  const seconds = Math.round(abs / 1000)
  const minutes = Math.round(abs / 60000)
  const hours = Math.round(abs / 3600000)
  const days = Math.round(abs / 86400000)
  const weeks = Math.round(abs / 604800000)
  const direction = diff < 0 ? 'ago' : 'from now'
  if (seconds < 60) return `${seconds}s ${direction}`
  if (minutes < 60) return `${minutes}m ${direction}`
  if (hours < 24) return `${hours}h ${direction}`
  if (days < 7) return `${days}d ${direction}`
  return `${weeks}w ${direction}`
}

const durationToMs = (duration: DurationValue): number =>
  duration.value + duration.months * 30 * 24 * 60 * 60 * 1000

const parseDurationParts = (input: string): { months: number; ms: number } => {
  const trimmed = input.trim()
  const asNumber = Number(trimmed)
  if (!isNaN(asNumber)) {
    return { months: 0, ms: asNumber }
  }

  let months = 0
  let ms = 0
  const regex = /(\d+(?:\.\d+)?)\s*([a-zA-Z]+)/g
  let match
  while ((match = regex.exec(trimmed)) !== null) {
    const value = parseFloat(match[1])
    const unitRaw = match[2]
    const unit = unitRaw.toLowerCase()
    if (unitRaw === 'M' || unit === 'mo' || unit === 'month' || unit === 'months') {
      months += value
      continue
    }
    if (unit === 'y' || unit === 'yr' || unit === 'yrs' || unit === 'year' || unit === 'years') {
      months += value * 12
      continue
    }
    if (unit === 'ms' || unit === 'millisecond' || unit === 'milliseconds') {
      ms += value
      continue
    }
    if (
      unit === 's' ||
      unit === 'sec' ||
      unit === 'secs' ||
      unit === 'second' ||
      unit === 'seconds'
    ) {
      ms += value * 1000
      continue
    }
    if (
      unit === 'm' ||
      unit === 'min' ||
      unit === 'mins' ||
      unit === 'minute' ||
      unit === 'minutes'
    ) {
      ms += value * 60 * 1000
      continue
    }
    if (unit === 'h' || unit === 'hr' || unit === 'hrs' || unit === 'hour' || unit === 'hours') {
      ms += value * 60 * 60 * 1000
      continue
    }
    if (unit === 'd' || unit === 'day' || unit === 'days') {
      ms += value * 24 * 60 * 60 * 1000
      continue
    }
    if (unit === 'w' || unit === 'week' || unit === 'weeks') {
      ms += value * 7 * 24 * 60 * 60 * 1000
      continue
    }
  }

  return { months, ms }
}

const addDurationToDate = (date: Date, duration: DurationValue, direction: 1 | -1): Date => {
  const result = new Date(date.getTime())
  if (duration.months !== 0) {
    const totalMonths = duration.months * direction
    const wholeMonths = Math.trunc(totalMonths)
    const fractional = totalMonths - wholeMonths
    if (wholeMonths !== 0) {
      result.setUTCMonth(result.getUTCMonth() + wholeMonths)
    }
    if (fractional !== 0) {
      result.setTime(result.getTime() + fractional * 30 * 24 * 60 * 60 * 1000)
    }
  }
  if (duration.value !== 0) {
    result.setTime(result.getTime() + direction * duration.value)
  }
  return result
}

const pushRuntimeDiagnostic = (ctx: EvalContext, message: string, span: Span) => {
  if (!ctx.diagnostics || !ctx.diagnosticContext) return
  const source = ctx.diagnosticSource ?? ''
  const key = `${ctx.diagnosticContext}|${message}|${span.start.offset}|${span.end.offset}|${source}`
  if (ctx.diagnosticSet) {
    if (ctx.diagnosticSet.has(key)) return
    ctx.diagnosticSet.add(key)
  }
  ctx.diagnostics.push({ kind: 'runtime', message, span, context: ctx.diagnosticContext, source })
}

const parseDurationValue = (raw: Value): DurationValue | null => {
  if (isDurationValue(raw)) return raw
  if (isNumberValue(raw)) return makeDuration(raw.value)
  if (isStringValue(raw)) {
    const parsed = parseDurationParts(raw.value)
    return makeDuration(parsed.ms, parsed.months)
  }
  return null
}

const toValue = (input: unknown): Value => {
  if (input === null || input === undefined) return makeNull()
  if (typeof input === 'boolean') return makeBoolean(input)
  if (typeof input === 'number') return makeNumber(input)
  if (typeof input === 'string') {
    const trimmed = input.trim()
    if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
      const parsed = new Date(trimmed)
      if (!Number.isNaN(parsed.getTime())) {
        return makeDate(parsed)
      }
    }
    return makeString(input)
  }
  if (input instanceof Date) return makeDate(input)
  if (input instanceof RegExp) return makeRegex(input)
  if (Array.isArray(input)) return makeList(input.map(toValue))
  if (isRecord(input)) {
    const obj: Record<string, Value> = {}
    for (const [key, value] of Object.entries(input)) {
      obj[key] = toValue(value)
    }
    return makeObject(obj)
  }
  return makeNull()
}

export const valueToUnknown = (value: Value): unknown => {
  switch (value.kind) {
    case 'null':
      return undefined
    case 'boolean':
      return value.value
    case 'number':
      return value.value
    case 'string':
      return value.value
    case 'date':
      return value.value
    case 'duration':
      return durationToMs(value)
    case 'list':
      return value.value.map(valueToUnknown)
    case 'object': {
      const obj: Record<string, unknown> = {}
      for (const [key, entry] of Object.entries(value.value)) {
        obj[key] = valueToUnknown(entry)
      }
      return obj
    }
    case 'file':
      return value.value
    case 'link':
      return formatLinkValue(value)
    case 'regex':
      return value.value
    case 'html':
      return value.value
    case 'icon':
      return { kind: 'icon', value: value.value }
    case 'image':
      return value.value
  }
}

const literalToValue = (expr: Literal): Value => {
  if (expr.kind === 'number') return makeNumber(expr.value)
  if (expr.kind === 'string') return makeString(expr.value)
  if (expr.kind === 'boolean') return makeBoolean(expr.value)
  if (expr.kind === 'null') return makeNull()
  if (expr.kind === 'date') return makeDate(new Date(expr.value))
  if (expr.kind === 'duration') {
    const parsed = parseDurationParts(expr.value)
    return makeDuration(parsed.ms, parsed.months)
  }
  if (expr.kind === 'regex') {
    const regex = new RegExp(expr.value, expr.flags)
    return makeRegex(regex)
  }
  return makeNull()
}

const evaluateProgram = (program: ProgramIR, ctx: EvalContext): Value => {
  const stack: Value[] = []
  const instructions = program.instructions
  let ip = 0

  const popValue = (): Value => stack.pop() ?? makeNull()
  const popArgs = (count: number): Value[] => {
    if (count <= 0) return []
    const start = Math.max(0, stack.length - count)
    return stack.splice(start, stack.length - start)
  }

  while (ip < instructions.length) {
    const instr = instructions[ip] as Instruction
    switch (instr.op) {
      case 'const':
        stack.push(literalToValue(instr.literal))
        break
      case 'ident':
        stack.push(resolveIdentifier(instr.name, ctx))
        break
      case 'load_formula':
        stack.push(resolveFormulaProperty(instr.name, ctx))
        break
      case 'load_formula_index': {
        const indexValue = popValue()
        if (isStringValue(indexValue)) {
          stack.push(resolveFormulaProperty(indexValue.value, ctx))
        } else {
          stack.push(makeNull())
        }
        break
      }
      case 'member': {
        const objectValue = popValue()
        stack.push(accessProperty(objectValue, instr.property, ctx))
        break
      }
      case 'index': {
        const indexValue = popValue()
        const objectValue = popValue()
        stack.push(accessIndex(objectValue, indexValue))
        break
      }
      case 'list': {
        const count = Math.max(0, instr.count)
        const items = count > 0 ? stack.splice(stack.length - count, count) : []
        stack.push(makeList(items))
        break
      }
      case 'unary': {
        const value = popValue()
        stack.push(applyUnary(instr.operator, value))
        break
      }
      case 'binary': {
        const right = popValue()
        const left = popValue()
        stack.push(applyBinary(instr.operator, left, right, ctx))
        break
      }
      case 'to_bool': {
        const value = popValue()
        stack.push(makeBoolean(valueToBoolean(value)))
        break
      }
      case 'call_global': {
        const args = popArgs(instr.argc)
        stack.push(evalGlobalCallValues(instr.name, args, ctx, instr.span))
        break
      }
      case 'call_method': {
        const args = popArgs(instr.argc)
        const receiver = popValue()
        stack.push(evalMethodCallValues(receiver, instr.name, args, ctx, instr.span))
        break
      }
      case 'call_dynamic': {
        const calleeValue = popValue()
        if (calleeValue.kind === 'html') {
          stack.push(makeHtml(calleeValue.value))
        } else {
          stack.push(makeNull())
        }
        break
      }
      case 'filter': {
        const receiver = popValue()
        stack.push(applyListFilter(receiver, instr.program, ctx))
        break
      }
      case 'map': {
        const receiver = popValue()
        stack.push(applyListMap(receiver, instr.program, ctx))
        break
      }
      case 'reduce': {
        const receiver = popValue()
        stack.push(applyListReduce(receiver, instr.program, instr.initial, ctx))
        break
      }
      case 'jump':
        ip = instr.target
        continue
      case 'jump_if_false': {
        const value = popValue()
        if (!valueToBoolean(value)) {
          ip = instr.target
          continue
        }
        break
      }
      case 'jump_if_true': {
        const value = popValue()
        if (valueToBoolean(value)) {
          ip = instr.target
          continue
        }
        break
      }
    }
    ip += 1
  }

  return popValue()
}

export const evaluateExpression = (program: ProgramIR, ctx: EvalContext): Value =>
  evaluateProgram(program, ctx)

export const evaluateFilterExpression = (program: ProgramIR, ctx: EvalContext): boolean =>
  valueToBoolean(evaluateExpression(program, ctx))

export const evaluateSummaryExpression = (
  program: ProgramIR,
  values: unknown[],
  ctx: EvalContext,
): Value => {
  const valueList = values.map(toValue)
  const summaryCtx: EvalContext = { ...ctx, values: valueList }
  return evaluateExpression(program, summaryCtx)
}

const resolveIdentifier = (name: string, ctx: EvalContext): Value => {
  if (name === 'this') return ctx.thisFile ? makeFile(ctx.thisFile) : makeNull()
  if (ctx.locals && name in ctx.locals) {
    const local = ctx.locals[name]
    if (isValue(local)) return local
  }
  if (name === 'file') return makeFile(ctx.file)
  if (name === 'note') {
    const fm = ctx.file.frontmatter
    return toValue(fm)
  }
  if (name === 'values' && ctx.values) {
    return makeList(ctx.values)
  }
  if (name === 'rows' && ctx.rows) {
    return makeList(ctx.rows.map(row => makeFile(row)))
  }
  if (name === 'formula') {
    return makeObject({})
  }
  const raw: unknown = ctx.file.frontmatter ? ctx.file.frontmatter[name] : undefined
  return toValue(raw)
}

const applyUnary = (operator: '!' | '-', value: Value): Value => {
  if (operator === '!') {
    return makeBoolean(!valueToBoolean(value))
  }
  const num = valueToNumber(value)
  return Number.isFinite(num) ? makeNumber(-num) : makeNull()
}

const applyBinary = (
  operator: BinaryExpr['operator'],
  left: Value,
  right: Value,
  ctx: EvalContext,
): Value => {
  if (operator === '==') return makeBoolean(valueEquals(left, right, ctx))
  if (operator === '!=') return makeBoolean(!valueEquals(left, right, ctx))

  if (operator === '+' || operator === '-') {
    return evalAdditive(operator, left, right)
  }
  if (operator === '*' || operator === '/' || operator === '%') {
    if (isDurationValue(left)) {
      const rightNum = valueToNumber(right)
      if (!Number.isFinite(rightNum)) return makeNull()
      if (operator === '*') return makeDuration(left.value * rightNum, left.months * rightNum)
      if (operator === '/') {
        if (rightNum === 0) return makeNull()
        return makeDuration(left.value / rightNum, left.months / rightNum)
      }
      return makeNull()
    }
    if (isDurationValue(right)) return makeNull()
    const leftNum = valueToNumber(left)
    const rightNum = valueToNumber(right)
    if (!Number.isFinite(leftNum) || !Number.isFinite(rightNum)) return makeNull()
    if (operator === '*') return makeNumber(leftNum * rightNum)
    if (operator === '/') return makeNumber(rightNum === 0 ? Number.NaN : leftNum / rightNum)
    return makeNumber(rightNum === 0 ? Number.NaN : leftNum % rightNum)
  }

  const compare = compareValues(left, right)
  if (compare === null) return makeNull()
  if (operator === '>') return makeBoolean(compare > 0)
  if (operator === '>=') return makeBoolean(compare >= 0)
  if (operator === '<') return makeBoolean(compare < 0)
  if (operator === '<=') return makeBoolean(compare <= 0)
  return makeNull()
}

const evalAdditive = (operator: '+' | '-', left: Value, right: Value): Value => {
  if (isDateValue(left) && isDateValue(right) && operator === '-') {
    return makeDuration(left.value.getTime() - right.value.getTime())
  }
  if (isDateValue(left)) {
    const duration = parseDurationValue(right)
    if (duration === null) return makeNull()
    return makeDate(addDurationToDate(left.value, duration, operator === '+' ? 1 : -1))
  }
  if (isDateValue(right) && operator === '+') {
    const duration = parseDurationValue(left)
    if (duration === null) return makeNull()
    return makeDate(addDurationToDate(right.value, duration, 1))
  }
  if (operator === '+' && (isStringValue(left) || isStringValue(right))) {
    return makeString(`${valueToString(left)}${valueToString(right)}`)
  }
  if (isDurationValue(left) && isDurationValue(right)) {
    return makeDuration(
      operator === '+' ? left.value + right.value : left.value - right.value,
      operator === '+' ? left.months + right.months : left.months - right.months,
    )
  }
  const leftNum = valueToNumber(left)
  const rightNum = valueToNumber(right)
  if (!Number.isFinite(leftNum) || !Number.isFinite(rightNum)) return makeNull()
  return makeNumber(operator === '+' ? leftNum + rightNum : leftNum - rightNum)
}

const compareValues = (left: Value, right: Value): number | null => {
  const leftDate = coerceToDate(left)
  const rightDate = coerceToDate(right)
  if (leftDate && rightDate) return leftDate.getTime() - rightDate.getTime()

  const leftNum = coerceToNumber(left)
  const rightNum = coerceToNumber(right)
  if (leftNum !== null && rightNum !== null) return leftNum - rightNum

  if (isScalarValue(left) && isScalarValue(right)) {
    const leftStr = valueToString(left)
    const rightStr = valueToString(right)
    if (leftStr === rightStr) return 0
    return leftStr > rightStr ? 1 : -1
  }

  return null
}

const accessIndex = (objectValue: Value, indexValue: Value): Value => {
  if (isListValue(objectValue)) {
    const index = Math.trunc(valueToNumber(indexValue))
    if (!Number.isFinite(index)) return makeNull()
    const item = objectValue.value[index]
    return item ?? makeNull()
  }
  if (isObjectValue(objectValue) && isStringValue(indexValue)) {
    const item = objectValue.value[indexValue.value]
    return item ?? makeNull()
  }
  return makeNull()
}

const evalGlobalCallValues = (name: string, args: Value[], ctx: EvalContext, span: Span): Value => {
  if (name === 'if') {
    if (args.length < 2) {
      pushRuntimeDiagnostic(ctx, 'if() expects at least 2 arguments', span)
    }
    const condition = args[0] ?? makeNull()
    if (valueToBoolean(condition)) {
      return args[1] ?? makeNull()
    }
    return args[2] ?? makeNull()
  }
  if (name === 'now') return makeDate(new Date())
  if (name === 'today') {
    const d = new Date()
    d.setUTCHours(0, 0, 0, 0)
    return makeDate(d)
  }
  if (name === 'date') {
    if (args.length < 1) {
      pushRuntimeDiagnostic(ctx, 'date() expects 1 argument', span)
    }
    const arg = args[0] ?? makeNull()
    const str = valueToString(arg)
    const parsed = new Date(str)
    if (Number.isNaN(parsed.getTime())) return makeNull()
    return makeDate(parsed)
  }
  if (name === 'duration') {
    if (args.length < 1) {
      pushRuntimeDiagnostic(ctx, 'duration() expects 1 argument', span)
    }
    const arg = args[0] ?? makeNull()
    const parsed = parseDurationParts(valueToString(arg))
    return makeDuration(parsed.ms, parsed.months)
  }
  if (name === 'min' || name === 'max') {
    if (args.length < 1) {
      pushRuntimeDiagnostic(ctx, `${name}() expects at least 1 argument`, span)
    }
    const values = args.map(arg => valueToNumber(arg))
    const nums = values.filter(value => Number.isFinite(value))
    if (nums.length === 0) return makeNull()
    return makeNumber(name === 'min' ? Math.min(...nums) : Math.max(...nums))
  }
  if (name === 'number') {
    if (args.length < 1) {
      pushRuntimeDiagnostic(ctx, 'number() expects 1 argument', span)
    }
    const value = args[0] ?? makeNull()
    const num = valueToNumber(value)
    return Number.isFinite(num) ? makeNumber(num) : makeNull()
  }
  if (name === 'link') {
    if (args.length < 1) {
      pushRuntimeDiagnostic(ctx, 'link() expects at least 1 argument', span)
    }
    const target = args[0] ?? makeNull()
    const display = args[1] ?? makeNull()
    const targetStr = valueToString(target)
    const displayStr = valueToString(display)
    return makeLink(targetStr, displayStr.length > 0 ? displayStr : undefined)
  }
  if (name === 'list') {
    if (args.length < 1) {
      pushRuntimeDiagnostic(ctx, 'list() expects 1 argument', span)
    }
    const value = args[0] ?? makeNull()
    if (isListValue(value)) return value
    return makeList([value])
  }
  if (name === 'file') {
    if (args.length < 1) {
      pushRuntimeDiagnostic(ctx, 'file() expects 1 argument', span)
    }
    const arg = args[0] ?? makeNull()
    const target = valueToString(arg)
    const file = findFileByTarget(target, ctx)
    return file ? makeFile(file) : makeNull()
  }
  if (name === 'image') {
    if (args.length < 1) {
      pushRuntimeDiagnostic(ctx, 'image() expects 1 argument', span)
    }
    const arg = args[0] ?? makeNull()
    const target = valueToString(arg)
    return makeImage(target)
  }
  if (name === 'icon') {
    if (args.length < 1) {
      pushRuntimeDiagnostic(ctx, 'icon() expects 1 argument', span)
    }
    const arg = args[0] ?? makeNull()
    const target = valueToString(arg)
    return makeIcon(target)
  }
  if (name === 'html') {
    if (args.length < 1) {
      pushRuntimeDiagnostic(ctx, 'html() expects 1 argument', span)
    }
    const arg = args[0] ?? makeNull()
    const target = valueToString(arg)
    return makeHtml(target)
  }
  if (name === 'escapeHTML') {
    if (args.length < 1) {
      pushRuntimeDiagnostic(ctx, 'escapeHTML() expects 1 argument', span)
    }
    const arg = args[0] ?? makeNull()
    const target = valueToString(arg)
    const escaped = target
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
    return makeString(escaped)
  }
  pushRuntimeDiagnostic(ctx, `unknown function: ${name}`, span)
  return makeNull()
}

const evalMethodCallValues = (
  receiver: Value,
  method: string,
  args: Value[],
  ctx: EvalContext,
  span: Span,
): Value => {
  if (method === 'isTruthy') {
    return makeBoolean(valueToBoolean(receiver))
  }
  if (method === 'isType') {
    const arg = args[0] ?? makeNull()
    const typeName = valueToString(arg).toLowerCase()
    return makeBoolean(isValueType(receiver, typeName))
  }
  if (method === 'toString') {
    return makeString(valueToString(receiver))
  }
  if (receiver.kind === 'null') {
    if (method === 'isEmpty') return makeBoolean(true)
    if (method === 'length') return makeNumber(0)
    if (
      method === 'contains' ||
      method === 'containsAny' ||
      method === 'containsAll' ||
      method === 'startsWith' ||
      method === 'endsWith' ||
      method === 'matches'
    ) {
      return makeBoolean(false)
    }
    if (method === 'asFile' || method === 'asLink') {
      return makeNull()
    }
    return makeNull()
  }

  if (isStringValue(receiver)) {
    if (method === 'asFile') {
      const file = findFileByTarget(receiver.value, ctx)
      return file ? makeFile(file) : makeNull()
    }
    if (!stringMethods.has(method)) {
      pushRuntimeDiagnostic(ctx, `unknown string method: ${method}`, span)
      return makeNull()
    }
    return evalStringMethod(receiver, method, args)
  }
  if (isNumberValue(receiver)) {
    if (!numberMethods.has(method)) {
      pushRuntimeDiagnostic(ctx, `unknown number method: ${method}`, span)
      return makeNull()
    }
    return evalNumberMethod(receiver, method, args)
  }
  if (isListValue(receiver)) {
    if (!listMethods.has(method)) {
      pushRuntimeDiagnostic(ctx, `unknown list method: ${method}`, span)
      return makeNull()
    }
    return evalListMethod(receiver, method, args, ctx)
  }
  if (isDateValue(receiver)) {
    if (!dateMethods.has(method)) {
      pushRuntimeDiagnostic(ctx, `unknown date method: ${method}`, span)
      return makeNull()
    }
    return evalDateMethod(receiver, method, args)
  }
  if (isFileValue(receiver)) {
    if (!fileMethods.has(method)) {
      pushRuntimeDiagnostic(ctx, `unknown file method: ${method}`, span)
      return makeNull()
    }
    return evalFileMethod(receiver, method, args, ctx)
  }
  if (isLinkValue(receiver)) {
    if (!linkMethods.has(method)) {
      pushRuntimeDiagnostic(ctx, `unknown link method: ${method}`, span)
      return makeNull()
    }
    return evalLinkMethod(receiver, method, args, ctx)
  }
  if (isObjectValue(receiver)) {
    if (!objectMethods.has(method)) {
      pushRuntimeDiagnostic(ctx, `unknown object method: ${method}`, span)
      return makeNull()
    }
    return evalObjectMethod(receiver, method)
  }
  if (isRegexValue(receiver)) {
    if (method === 'matches') {
      const value = args[0] ?? makeNull()
      return makeBoolean(receiver.value.test(valueToString(value)))
    }
    pushRuntimeDiagnostic(ctx, `unknown regex method: ${method}`, span)
    return makeNull()
  }
  pushRuntimeDiagnostic(ctx, `unknown ${receiver.kind} method: ${method}`, span)
  return makeNull()
}

const evalStringMethod = (receiver: StringValue, method: string, args: Value[]): Value => {
  const value = receiver.value
  if (method === 'contains') {
    const arg = args[0] ?? makeNull()
    return makeBoolean(value.includes(valueToString(arg)))
  }
  if (method === 'containsAny') {
    const values = args.map(arg => valueToString(arg))
    return makeBoolean(values.some(entry => value.includes(entry)))
  }
  if (method === 'containsAll') {
    const values = args.map(arg => valueToString(arg))
    return makeBoolean(values.every(entry => value.includes(entry)))
  }
  if (method === 'startsWith') {
    const arg = args[0] ?? makeNull()
    return makeBoolean(value.startsWith(valueToString(arg)))
  }
  if (method === 'endsWith') {
    const arg = args[0] ?? makeNull()
    return makeBoolean(value.endsWith(valueToString(arg)))
  }
  if (method === 'isEmpty') {
    return makeBoolean(value.length === 0)
  }
  if (method === 'lower') {
    return makeString(value.toLowerCase())
  }
  if (method === 'title') {
    const parts = value.split(/\s+/).map(part => {
      const lower = part.toLowerCase()
      return lower.length > 0 ? `${lower[0].toUpperCase()}${lower.slice(1)}` : lower
    })
    return makeString(parts.join(' '))
  }
  if (method === 'trim') {
    return makeString(value.trim())
  }
  if (method === 'replace') {
    const patternVal = args[0] ?? makeNull()
    const replacementVal = args[1] ?? makeNull()
    const replacement = valueToString(replacementVal)
    if (isRegexValue(patternVal)) {
      return makeString(value.replace(patternVal.value, replacement))
    }
    return makeString(value.replace(valueToString(patternVal), replacement))
  }
  if (method === 'repeat') {
    const count = args[0] ? valueToNumber(args[0]) : 0
    return makeString(value.repeat(Number.isFinite(count) ? Math.max(0, count) : 0))
  }
  if (method === 'reverse') {
    return makeString(value.split('').reverse().join(''))
  }
  if (method === 'slice') {
    const start = args[0] ? valueToNumber(args[0]) : 0
    const end = args[1] ? valueToNumber(args[1]) : undefined
    const startIndex = Number.isFinite(start) ? Math.trunc(start) : 0
    const endIndex = end !== undefined && Number.isFinite(end) ? Math.trunc(end) : undefined
    return makeString(value.slice(startIndex, endIndex))
  }
  if (method === 'split') {
    const separatorValue = args[0] ?? makeString('')
    const separator = isRegexValue(separatorValue)
      ? separatorValue.value
      : valueToString(separatorValue)
    const limitValue = args[1] ? valueToNumber(args[1]) : undefined
    const limit =
      limitValue !== undefined && Number.isFinite(limitValue) ? Math.trunc(limitValue) : undefined
    const parts = limit !== undefined ? value.split(separator, limit) : value.split(separator)
    return makeList(parts.map(entry => makeString(entry)))
  }
  if (method === 'length') {
    return makeNumber(value.length)
  }
  return makeNull()
}

const evalNumberMethod = (receiver: NumberValue, method: string, args: Value[]): Value => {
  const value = receiver.value
  if (method === 'abs') return makeNumber(Math.abs(value))
  if (method === 'ceil') return makeNumber(Math.ceil(value))
  if (method === 'floor') return makeNumber(Math.floor(value))
  if (method === 'round') {
    const digits = args[0] ? valueToNumber(args[0]) : 0
    if (!Number.isFinite(digits)) return makeNumber(Math.round(value))
    const factor = 10 ** Math.trunc(digits)
    return makeNumber(Math.round(value * factor) / factor)
  }
  if (method === 'toFixed') {
    const digits = args[0] ? valueToNumber(args[0]) : 0
    const precision = Number.isFinite(digits) ? Math.trunc(digits) : 0
    return makeString(value.toFixed(Math.max(0, precision)))
  }
  if (method === 'isEmpty') {
    return makeBoolean(!Number.isFinite(value))
  }
  return makeNull()
}

const evalListMethod = (
  receiver: ListValue,
  method: string,
  args: Value[],
  ctx: EvalContext,
): Value => {
  const list = receiver.value
  if (method === 'contains') {
    const arg = args[0] ?? makeNull()
    return makeBoolean(list.some(entry => valueEquals(entry, arg, ctx)))
  }
  if (method === 'containsAny') {
    const values = args
    return makeBoolean(values.some(entry => list.some(item => valueEquals(item, entry, ctx))))
  }
  if (method === 'containsAll') {
    const values = args
    return makeBoolean(values.every(entry => list.some(item => valueEquals(item, entry, ctx))))
  }
  if (method === 'flat') {
    const flattened: Value[] = []
    for (const item of list) {
      if (isListValue(item)) {
        flattened.push(...item.value)
      } else {
        flattened.push(item)
      }
    }
    return makeList(flattened)
  }
  if (method === 'join') {
    const separator = args[0] ? valueToString(args[0]) : ','
    return makeString(list.map(valueToString).join(separator))
  }
  if (method === 'reverse') {
    return makeList([...list].reverse())
  }
  if (method === 'slice') {
    const start = args[0] ? valueToNumber(args[0]) : 0
    const end = args[1] ? valueToNumber(args[1]) : undefined
    const startIndex = Number.isFinite(start) ? Math.trunc(start) : 0
    const endIndex = end !== undefined && Number.isFinite(end) ? Math.trunc(end) : undefined
    return makeList(list.slice(startIndex, endIndex))
  }
  if (method === 'sort') {
    const sorted = [...list].sort((a, b) => {
      const aNum = valueToNumber(a)
      const bNum = valueToNumber(b)
      if (Number.isFinite(aNum) && Number.isFinite(bNum)) return aNum - bNum
      const aStr = valueToString(a)
      const bStr = valueToString(b)
      if (aStr === bStr) return 0
      return aStr > bStr ? 1 : -1
    })
    return makeList(sorted)
  }
  if (method === 'unique') {
    const unique: Value[] = []
    for (const item of list) {
      if (!unique.some(entry => valueEquals(entry, item, ctx))) {
        unique.push(item)
      }
    }
    return makeList(unique)
  }
  if (method === 'sum') {
    const nums = list.map(valueToNumber).filter(value => Number.isFinite(value))
    if (nums.length === 0) return makeNull()
    return makeNumber(nums.reduce((acc, value) => acc + value, 0))
  }
  if (method === 'mean' || method === 'average') {
    const nums = list.map(valueToNumber).filter(value => Number.isFinite(value))
    if (nums.length === 0) return makeNull()
    const sum = nums.reduce((acc, value) => acc + value, 0)
    return makeNumber(sum / nums.length)
  }
  if (method === 'median') {
    const nums = list.map(valueToNumber).filter(value => Number.isFinite(value))
    if (nums.length === 0) return makeNull()
    const sorted = [...nums].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)
    if (sorted.length % 2 === 0) {
      return makeNumber((sorted[mid - 1] + sorted[mid]) / 2)
    }
    return makeNumber(sorted[mid])
  }
  if (method === 'stddev') {
    const nums = list.map(valueToNumber).filter(value => Number.isFinite(value))
    if (nums.length === 0) return makeNull()
    const mean = nums.reduce((acc, value) => acc + value, 0) / nums.length
    const variance = nums.reduce((acc, value) => acc + (value - mean) ** 2, 0) / nums.length
    return makeNumber(Math.sqrt(variance))
  }
  if (method === 'min' || method === 'max') {
    const nums = list.map(valueToNumber).filter(value => Number.isFinite(value))
    if (nums.length === 0) return makeNull()
    const value = method === 'min' ? Math.min(...nums) : Math.max(...nums)
    return makeNumber(value)
  }
  if (method === 'isEmpty') {
    return makeBoolean(list.length === 0)
  }
  if (method === 'length') {
    return makeNumber(list.length)
  }
  return makeNull()
}

const applyListFilter = (receiver: Value, program: ProgramIR | null, ctx: EvalContext): Value => {
  if (!isListValue(receiver)) return makeNull()
  if (!program) return makeList(receiver.value)
  const list = receiver.value
  const filtered = list.filter((value, index) => {
    const locals: Record<string, Value> = { value, index: makeNumber(index) }
    const baseLocals = ctx.locals ? ctx.locals : {}
    const fileCtx = isFileValue(value)
      ? {
          ...ctx,
          file: value.value,
          propertyCache: undefined,
          formulaCache: undefined,
          formulaStack: new Set<string>(),
        }
      : ctx
    const nextCtx: EvalContext = { ...fileCtx, locals: { ...baseLocals, ...locals } }
    return valueToBoolean(evaluateProgram(program, nextCtx))
  })
  return makeList(filtered)
}

const applyListMap = (receiver: Value, program: ProgramIR | null, ctx: EvalContext): Value => {
  if (!isListValue(receiver)) return makeNull()
  if (!program) return makeList(receiver.value)
  const list = receiver.value
  const mapped = list.map((value, index) => {
    const locals: Record<string, Value> = { value, index: makeNumber(index) }
    const baseLocals = ctx.locals ? ctx.locals : {}
    const fileCtx = isFileValue(value)
      ? {
          ...ctx,
          file: value.value,
          propertyCache: undefined,
          formulaCache: undefined,
          formulaStack: new Set<string>(),
        }
      : ctx
    const nextCtx: EvalContext = { ...fileCtx, locals: { ...baseLocals, ...locals } }
    return evaluateProgram(program, nextCtx)
  })
  return makeList(mapped)
}

const applyListReduce = (
  receiver: Value,
  program: ProgramIR | null,
  initial: ProgramIR | null,
  ctx: EvalContext,
): Value => {
  if (!isListValue(receiver)) return makeNull()
  const initialValue = initial ? evaluateProgram(initial, ctx) : makeNull()
  if (!program) return initialValue
  let acc = initialValue
  const list = receiver.value
  for (let index = 0; index < list.length; index += 1) {
    const value = list[index]
    const locals: Record<string, Value> = { value, index: makeNumber(index), acc }
    const baseLocals = ctx.locals ? ctx.locals : {}
    const fileCtx = isFileValue(value)
      ? {
          ...ctx,
          file: value.value,
          propertyCache: undefined,
          formulaCache: undefined,
          formulaStack: new Set<string>(),
        }
      : ctx
    const nextCtx: EvalContext = { ...fileCtx, locals: { ...baseLocals, ...locals } }
    acc = evaluateProgram(program, nextCtx)
  }
  return acc
}

const evalDateMethod = (receiver: DateValue, method: string, args: Value[]): Value => {
  const value = receiver.value
  if (method === 'date') {
    const date = new Date(value.getTime())
    date.setUTCHours(0, 0, 0, 0)
    return makeDate(date)
  }
  if (method === 'format') {
    const pattern = args[0] ? valueToString(args[0]) : 'YYYY-MM-DD'
    return makeString(formatDatePattern(value, pattern))
  }
  if (method === 'time') {
    return makeString(formatTime(value))
  }
  if (method === 'relative') {
    return makeString(formatRelative(value))
  }
  if (method === 'isEmpty') {
    return makeBoolean(false)
  }
  if (method === 'year') return makeNumber(value.getUTCFullYear())
  if (method === 'month') return makeNumber(value.getUTCMonth() + 1)
  if (method === 'day') return makeNumber(value.getUTCDate())
  if (method === 'hour') return makeNumber(value.getUTCHours())
  if (method === 'minute') return makeNumber(value.getUTCMinutes())
  if (method === 'second') return makeNumber(value.getUTCSeconds())
  if (method === 'millisecond') return makeNumber(value.getUTCMilliseconds())
  return makeNull()
}

const evalObjectMethod = (receiver: ObjectValue, method: string): Value => {
  const entries = Object.entries(receiver.value)
  if (method === 'isEmpty') return makeBoolean(entries.length === 0)
  if (method === 'keys') return makeList(entries.map(([key]) => makeString(key)))
  if (method === 'values') return makeList(entries.map(([, value]) => value))
  return makeNull()
}

const evalFileMethod = (
  receiver: FileValue,
  method: string,
  args: Value[],
  ctx: EvalContext,
): Value => {
  const file = receiver.value
  if (method === 'asLink') {
    const display = args[0] ? valueToString(args[0]) : undefined
    const slug = file.slug ? String(file.slug) : ''
    return makeLink(slug, display)
  }
  if (method === 'hasTag') {
    const tags = args.map(arg => valueToString(arg))
    const rawTags = file.frontmatter?.tags
    const fileTags = Array.isArray(rawTags) ? rawTags : typeof rawTags === 'string' ? [rawTags] : []
    return makeBoolean(tags.some(tag => fileTags.includes(tag)))
  }
  if (method === 'inFolder') {
    const folder = args[0] ? valueToString(args[0]) : ''
    const slug = file.slug ? String(file.slug) : ''
    const normalized = folder.endsWith('/') ? folder : `${folder}/`
    return makeBoolean(slug.startsWith(normalized))
  }
  if (method === 'hasProperty') {
    const prop = args[0] ? valueToString(args[0]) : ''
    const fm = file.frontmatter
    return makeBoolean(Boolean(fm && prop in fm))
  }
  if (method === 'hasLink') {
    const arg = args[0] ?? makeNull()
    const targetSlug = resolveLinkSlugFromValue(arg, ctx)
    if (!targetSlug) return makeBoolean(false)
    const links = Array.isArray(file.links) ? file.links.map(link => String(link)) : []
    return makeBoolean(links.includes(targetSlug))
  }
  return makeNull()
}

const evalLinkMethod = (
  receiver: LinkValue,
  method: string,
  args: Value[],
  ctx: EvalContext,
): Value => {
  if (method === 'asFile') {
    const file = findFileByTarget(receiver.value, ctx)
    return file ? makeFile(file) : makeNull()
  }
  if (method === 'linksTo') {
    const arg = args[0] ?? makeNull()
    const targetSlug = resolveLinkSlugFromValue(arg, ctx)
    const receiverSlug = resolveLinkSlugFromText(receiver.value, ctx)
    if (!targetSlug || !receiverSlug) return makeBoolean(false)
    return makeBoolean(receiverSlug === targetSlug)
  }
  return makeNull()
}

const resolveFormulaProperty = (name: string, ctx: EvalContext): Value => {
  if (!ctx.formulas || !ctx.formulas[name]) return makeNull()
  if (!ctx.formulaCache) ctx.formulaCache = new Map()
  if (!ctx.formulaStack) ctx.formulaStack = new Set()
  const cached = ctx.formulaCache.get(name)
  if (cached) return cached
  if (ctx.formulaStack.has(name)) return makeNull()
  ctx.formulaStack.add(name)
  const expr = ctx.formulas[name]
  const nextCtx: EvalContext = {
    ...ctx,
    diagnosticContext: `formula.${name}`,
    diagnosticSource: ctx.formulaSources?.[name] ?? ctx.diagnosticSource,
  }
  const value = evaluateExpression(expr, nextCtx)
  ctx.formulaCache.set(name, value)
  ctx.formulaStack.delete(name)
  return value
}

const resolveFileProperty = (file: QuartzPluginData, property: string, ctx: EvalContext): Value => {
  if (property === 'file') return makeFile(file)
  if (property === 'name' || property === 'basename') {
    const filePath = typeof file.filePath === 'string' ? file.filePath : ''
    const source = filePath.length > 0 ? filePath : file.slug ? String(file.slug) : ''
    const segment = source.split('/').pop() || ''
    if (property === 'name') return makeString(segment)
    const basename = segment.replace(/\.[^/.]+$/, '')
    return makeString(basename)
  }
  if (property === 'title') {
    const title = typeof file.frontmatter?.title === 'string' ? file.frontmatter.title : ''
    if (title.length > 0) return makeString(title)
    return resolveFileProperty(file, 'basename', ctx)
  }
  if (property === 'path') {
    const path = file.filePath || file.slug || ''
    return makeString(String(path))
  }
  if (property === 'folder') {
    const slug = file.slug ? String(file.slug) : ''
    const parts = slug.split('/')
    const folder = parts.length > 1 ? parts.slice(0, -1).join('/') : ''
    return makeString(folder)
  }
  if (property === 'ext') {
    const filePath = typeof file.filePath === 'string' ? file.filePath : ''
    const slug = file.slug ? String(file.slug) : ''
    const source = filePath.length > 0 ? filePath : slug
    const match = source.match(/\.([^.]+)$/)
    return makeString(match ? match[1] : 'md')
  }
  if (property === 'size') {
    if (isRecord(file) && typeof file.size === 'number') {
      return makeNumber(file.size)
    }
    return makeNull()
  }
  if (property === 'ctime') {
    const created = file.dates?.created
    if (!created) return makeNull()
    return makeDate(new Date(created))
  }
  if (property === 'mtime') {
    const modified = file.dates?.modified
    if (!modified) return makeNull()
    return makeDate(new Date(modified))
  }
  if (property === 'tags') {
    const rawTags = file.frontmatter?.tags
    const tags = Array.isArray(rawTags) ? rawTags : typeof rawTags === 'string' ? [rawTags] : []
    return makeList(tags.map(tag => makeString(String(tag))))
  }
  if (property === 'aliases') {
    const aliases = file.frontmatter?.aliases
    if (!aliases) return makeList([])
    const list = Array.isArray(aliases) ? aliases : [aliases]
    return makeList(list.map(alias => makeString(String(alias))))
  }
  if (property === 'links' || property === 'outlinks') {
    const links = Array.isArray(file.links) ? file.links : []
    return makeList(links.map(link => makeLink(String(link))))
  }
  if (property === 'backlinks' || property === 'inlinks') {
    const slug = file.slug ? String(file.slug) : ''
    const key = simplifySlug(slug as FullSlug)
    const backlinks =
      ctx.backlinksIndex?.get(key) ??
      ctx.allFiles
        .filter(entry => {
          const links = Array.isArray(entry.links) ? entry.links.map(link => String(link)) : []
          return key.length > 0 && links.includes(key)
        })
        .map(entry => (entry.slug ? simplifySlug(entry.slug as FullSlug) : ''))
        .filter(entry => entry.length > 0)
    return makeList(backlinks.map(link => makeLink(String(link))))
  }
  if (property === 'embeds') {
    const embeds = isRecord(file) && Array.isArray(file.embeds) ? file.embeds : []
    return makeList(embeds.map(entry => makeString(String(entry))))
  }
  if (property === 'properties') {
    return toValue(file.frontmatter)
  }
  if (property === 'link') {
    const slug = file.slug ? String(file.slug) : ''
    return makeLink(slug)
  }
  const raw: unknown = file.frontmatter ? file.frontmatter[property] : undefined
  return toValue(raw)
}

const accessProperty = (value: Value, property: string, ctx: EvalContext): Value => {
  if (isStringValue(value) && property === 'length') return makeNumber(value.value.length)
  if (isListValue(value) && property === 'length') return makeNumber(value.value.length)
  if (isDateValue(value)) {
    if (property === 'year') return makeNumber(value.value.getUTCFullYear())
    if (property === 'month') return makeNumber(value.value.getUTCMonth() + 1)
    if (property === 'day') return makeNumber(value.value.getUTCDate())
    if (property === 'hour') return makeNumber(value.value.getUTCHours())
    if (property === 'minute') return makeNumber(value.value.getUTCMinutes())
    if (property === 'second') return makeNumber(value.value.getUTCSeconds())
    if (property === 'millisecond') return makeNumber(value.value.getUTCMilliseconds())
  }
  if (isObjectValue(value)) {
    return value.value[property] ?? makeNull()
  }
  if (isFileValue(value)) {
    return resolveFileProperty(value.value, property, ctx)
  }
  if (isLinkValue(value)) {
    if (property === 'value') return makeString(value.value)
  }
  return makeNull()
}

const isValueType = (value: Value, typeName: string): boolean => {
  if (typeName === 'null' || typeName === 'undefined') return value.kind === 'null'
  if (typeName === 'string') return value.kind === 'string'
  if (typeName === 'number') return value.kind === 'number'
  if (typeName === 'boolean') return value.kind === 'boolean'
  if (typeName === 'array' || typeName === 'list') return value.kind === 'list'
  if (typeName === 'object') return value.kind === 'object'
  if (typeName === 'date') return value.kind === 'date'
  if (typeName === 'duration') return value.kind === 'duration'
  if (typeName === 'file') return value.kind === 'file'
  if (typeName === 'link') return value.kind === 'link'
  return false
}

const resolveFileSlug = (file: QuartzPluginData): string | undefined => {
  if (!file.slug) return undefined
  return simplifySlug(file.slug as FullSlug)
}

const normalizeLinkText = (value: string): string => value.trim()

const resolveLinkSlugFromText = (raw: string, ctx: EvalContext): string | undefined => {
  const trimmed = raw.trim()
  if (!trimmed) return undefined
  if (/^[a-z][a-z0-9+.-]*:/.test(trimmed)) return undefined
  const currentSlug = ctx.file.slug
    ? String(ctx.file.slug)
    : ctx.thisFile?.slug
      ? String(ctx.thisFile.slug)
      : undefined
  const parsed = parseWikilink(trimmed)
  if (parsed) {
    if (/^[a-z][a-z0-9+.-]*:/.test(parsed.target)) return undefined
    if (currentSlug) {
      const resolved = resolveWikilinkTarget(parsed, currentSlug as FullSlug)
      return resolved ? simplifySlug(resolved.slug) : undefined
    }
    const parsedTarget = parsed.target.trim()
    if (!parsedTarget) return undefined
    const slug = slugifyFilePath(parsedTarget as FilePath)
    return simplifySlug(slug)
  }
  const [target, anchor] = splitAnchor(trimmed)
  if (currentSlug) {
    const resolved = resolveWikilinkTarget(
      {
        raw: trimmed,
        target,
        anchor: anchor.length > 0 ? anchor : undefined,
        alias: undefined,
        embed: trimmed.startsWith('!'),
      },
      currentSlug as FullSlug,
    )
    if (resolved) return simplifySlug(resolved.slug)
  }
  if (!target) return undefined
  const normalized = target.replace(/\\/g, '/').replace(/^\/+/, '')
  if (!normalized) return undefined
  const slug = slugifyFilePath(normalized as FilePath)
  return simplifySlug(slug)
}

const resolveLinkSlugFromValue = (value: Value, ctx: EvalContext): string | undefined => {
  if (isFileValue(value)) return resolveFileSlug(value.value)
  if (isLinkValue(value)) return resolveLinkSlugFromText(value.value, ctx)
  if (isStringValue(value)) return resolveLinkSlugFromText(value.value, ctx)
  return undefined
}

const resolveLinkComparisonKey = (
  value: Value,
  ctx: EvalContext,
): { slug?: string; text: string } => {
  if (isFileValue(value)) {
    const slug = resolveFileSlug(value.value)
    return { slug, text: slug ?? '' }
  }
  if (isLinkValue(value)) {
    const slug = resolveLinkSlugFromText(value.value, ctx)
    const text = value.display && value.display.length > 0 ? value.display : value.value
    return { slug, text: normalizeLinkText(text) }
  }
  if (isStringValue(value)) {
    const slug = resolveLinkSlugFromText(value.value, ctx)
    return { slug, text: normalizeLinkText(value.value) }
  }
  return { text: normalizeLinkText(valueToString(value)) }
}

const findFileByTarget = (target: string, ctx: EvalContext): QuartzPluginData | undefined => {
  const slug = resolveLinkSlugFromText(target, ctx)
  if (!slug) return undefined
  const indexed = ctx.fileIndex?.get(slug)
  if (indexed) return indexed
  return ctx.allFiles.find(entry => resolveFileSlug(entry) === slug)
}
