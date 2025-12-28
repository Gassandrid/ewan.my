import { BaseFilter } from "./query"
import { QuartzPluginData } from "../../plugins/vfile"

export type ComparisonOp = "==" | "!=" | ">" | "<" | ">=" | "<=" | "contains" | "!contains"

export type BasesConfigFileFilter =
  | string
  | { and: BasesConfigFileFilter[] }
  | { or: BasesConfigFileFilter[] }
  | { not: BasesConfigFileFilter[] }

export interface FormulaDefinition {
  expression: string
  property?: string
  operator?: ComparisonOp
  value?: string | number | boolean | Date
}

export type BuiltinSummaryType =
  | "count"
  | "sum"
  | "average"
  | "avg"
  | "min"
  | "max"
  | "range"
  | "unique"
  | "filled"
  | "missing"
  | "earliest"
  | "latest"

export interface SummaryDefinition {
  type: "builtin" | "formula"
  builtinType?: BuiltinSummaryType
  formulaRef?: string
  expression?: string
}

export interface BasesConfigFile {
  filters: BaseFilter
  views: BasesConfigFileView[]
  properties?: Record<string, PropertyConfig>
  summaries?: Record<string, string>
  formulas?: Record<string, FormulaDefinition>
}

export type BaseFile = BasesConfigFile

export interface ViewSummaryConfig {
  columns: Record<string, SummaryDefinition>
}

export interface PropertyConfig {
  displayName?: string
}

export interface BasesConfigFileView {
  type: "table" | "list" | "gallery" | "board" | "calendar" | "card" | "cards" | "map"
  name: string
  order?: string[]
  sort?: BasesSortConfig[]
  columnSize?: Record<string, number>
  groupBy?: string | BasesGroupByConfig
  limit?: number
  filters?: BaseFilter
  summaries?: Record<string, string> | ViewSummaryConfig
  image?: string
  cardSize?: number
  nestedProperties?: boolean
  coordinates?: string
  markerIcon?: string
  markerColor?: string
  defaultZoom?: number
  defaultCenter?: [number, number]
  clustering?: boolean
  [key: string]: any
}

export type BaseView = BasesConfigFileView

export interface BasesSortConfig {
  property: string
  direction: "ASC" | "DESC"
}

export type BaseSortConfig = BasesSortConfig

export interface BasesGroupByConfig {
  property: string
  direction: "ASC" | "DESC"
}

export type BaseGroupBy = BasesGroupByConfig

export interface BaseTableData {
  view: BaseView
  rows: QuartzPluginData[]
  columns: string[]
}

// tokenize arithmetic expression
type Token =
  | { type: "number"; value: number }
  | { type: "property"; value: string }
  | { type: "operator"; value: "+" | "-" | "*" | "/" | "%" }
  | { type: "lparen" }
  | { type: "rparen" }

function tokenizeExpression(expr: string): Token[] {
  const tokens: Token[] = []
  let i = 0

  while (i < expr.length) {
    const char = expr[i]

    // skip whitespace
    if (/\s/.test(char)) {
      i++
      continue
    }

    // operators
    if (["+", "-", "*", "/", "%"].includes(char)) {
      tokens.push({ type: "operator", value: char as "+" | "-" | "*" | "/" | "%" })
      i++
      continue
    }

    // parentheses
    if (char === "(") {
      tokens.push({ type: "lparen" })
      i++
      continue
    }

    if (char === ")") {
      tokens.push({ type: "rparen" })
      i++
      continue
    }

    // numbers (including decimals)
    if (/\d/.test(char)) {
      let numStr = ""
      while (i < expr.length && /[\d.]/.test(expr[i])) {
        numStr += expr[i]
        i++
      }
      tokens.push({ type: "number", value: parseFloat(numStr) })
      continue
    }

    // property references (alphanumeric, dots, underscores)
    if (/[a-zA-Z_]/.test(char)) {
      let propStr = ""
      while (i < expr.length && /[a-zA-Z0-9_.]/.test(expr[i])) {
        propStr += expr[i]
        i++
      }
      tokens.push({ type: "property", value: propStr })
      continue
    }

    throw new Error(`Unexpected character in expression: ${char}`)
  }

  return tokens
}

// recursive descent parser for arithmetic expressions
// grammar:
//   expr    -> term (('+' | '-') term)*
//   term    -> factor (('*' | '/' | '%') factor)*
//   factor  -> number | property | '(' expr ')'
class ExpressionParser {
  private tokens: Token[]
  private pos: number

  constructor(tokens: Token[]) {
    this.tokens = tokens
    this.pos = 0
  }

  private current(): Token | undefined {
    return this.tokens[this.pos]
  }

  private advance(): void {
    this.pos++
  }

  parse(): (props: Record<string, any>) => number {
    const tree = this.parseExpr()
    return tree
  }

  private parseExpr(): (props: Record<string, any>) => number {
    let left = this.parseTerm()

    while (this.current()?.type === "operator") {
      const op = this.current() as { type: "operator"; value: "+" | "-" | "*" | "/" | "%" }
      if (op.value !== "+" && op.value !== "-") break

      this.advance()
      const right = this.parseTerm()
      const operator = op.value

      const prevLeft = left
      left = (props: Record<string, any>) => {
        const leftVal = prevLeft(props)
        const rightVal = right(props)
        if (operator === "+") return leftVal + rightVal
        if (operator === "-") return leftVal - rightVal
        throw new Error(`Unexpected operator: ${operator}`)
      }
    }

    return left
  }

  private parseTerm(): (props: Record<string, any>) => number {
    let left = this.parseFactor()

    while (this.current()?.type === "operator") {
      const op = this.current() as { type: "operator"; value: "+" | "-" | "*" | "/" | "%" }
      if (op.value !== "*" && op.value !== "/" && op.value !== "%") break

      this.advance()
      const right = this.parseFactor()
      const operator = op.value

      const prevLeft = left
      left = (props: Record<string, any>) => {
        const leftVal = prevLeft(props)
        const rightVal = right(props)
        if (operator === "*") return leftVal * rightVal
        if (operator === "/") return leftVal / rightVal
        if (operator === "%") return leftVal % rightVal
        throw new Error(`Unexpected operator: ${operator}`)
      }
    }

    return left
  }

  private parseFactor(): (props: Record<string, any>) => number {
    const token = this.current()

    if (!token) {
      throw new Error("Unexpected end of expression")
    }

    if (token.type === "number") {
      this.advance()
      const value = token.value
      return () => value
    }

    if (token.type === "property") {
      this.advance()
      const propName = token.value
      return (props: Record<string, any>) => {
        const value = props[propName]
        if (typeof value !== "number") {
          throw new Error(`Property ${propName} is not a number: ${value}`)
        }
        return value
      }
    }

    if (token.type === "lparen") {
      this.advance()
      const expr = this.parseExpr()
      const closeParen = this.current()
      if (!closeParen || closeParen.type !== "rparen") {
        throw new Error("Expected closing parenthesis")
      }
      this.advance()
      return expr
    }

    throw new Error(`Unexpected token: ${JSON.stringify(token)}`)
  }
}

// compile arithmetic expression to evaluator function
export function compileExpression(expr: string): (props: Record<string, any>) => number {
  const tokens = tokenizeExpression(expr)
  const parser = new ExpressionParser(tokens)
  return parser.parse()
}

// check if string contains arithmetic operators
function hasArithmeticOperators(str: string): boolean {
  return /[+\-*/%()]/.test(str)
}

// parse value from string to proper type
// note: now() and today() return Date objects (not timestamps) for compatibility with date arithmetic
export function parseDuration(durationStr: string): number {
  const str = durationStr.toLowerCase().trim()

  const asNumber = Number(str)
  if (!isNaN(asNumber)) {
    return asNumber
  }

  let totalMs = 0
  const patterns = [
    { regex: /(\d+(?:\.\d+)?)\s*(?:ms|milliseconds?)/g, multiplier: 1 },
    { regex: /(\d+(?:\.\d+)?)\s*(?:s|secs?|seconds?)/g, multiplier: 1000 },
    { regex: /(\d+(?:\.\d+)?)\s*(?:m|mins?|minutes?)/g, multiplier: 60 * 1000 },
    { regex: /(\d+(?:\.\d+)?)\s*(?:h|hrs?|hours?)/g, multiplier: 60 * 60 * 1000 },
    { regex: /(\d+(?:\.\d+)?)\s*(?:d|days?)/g, multiplier: 24 * 60 * 60 * 1000 },
    { regex: /(\d+(?:\.\d+)?)\s*(?:w|weeks?)/g, multiplier: 7 * 24 * 60 * 60 * 1000 },
    { regex: /(\d+(?:\.\d+)?)\s*(?:mo|months?)/g, multiplier: 30 * 24 * 60 * 60 * 1000 },
    { regex: /(\d+(?:\.\d+)?)\s*(?:y|yrs?|years?)/g, multiplier: 365 * 24 * 60 * 60 * 1000 },
  ]

  for (const { regex, multiplier } of patterns) {
    let match
    while ((match = regex.exec(str)) !== null) {
      const value = parseFloat(match[1])
      totalMs += value * multiplier
    }
  }

  return totalMs
}

function parseValue(val: string): string | number | boolean | Date {
  const trimmed = val.trim()

  // handle function calls
  const funcMatch = trimmed.match(/^(now|today|date|duration|number)\(/)
  if (funcMatch) {
    const funcName = funcMatch[1]
    if (funcName === "now") {
      // return Date object representing current moment
      return new Date()
    }
    if (funcName === "today") {
      // return Date object representing today at midnight
      const d = new Date()
      d.setHours(0, 0, 0, 0)
      return d
    }
    if (funcName === "date") {
      // extract argument from date("2023-01-01")
      const argMatch = trimmed.match(/^date\(['"](.+)['"]\)$/)
      if (argMatch) {
        const dateStr = argMatch[1]
        const d = new Date(dateStr)
        if (!isNaN(d.getTime())) {
          return d
        }
      }
    }
    if (funcName === "duration") {
      const argMatch = trimmed.match(/^duration\((.+)\)$/)
      if (argMatch) {
        const rawArg = argMatch[1].trim().replace(/^['"]|['"]$/g, "")
        return parseDuration(rawArg)
      }
    }
    if (funcName === "number") {
      const argMatch = trimmed.match(/^number\((.+)\)$/)
      if (argMatch) {
        const rawArg = argMatch[1].trim().replace(/^['"]|['"]$/g, "")
        const coerced = Number(rawArg)
        if (!isNaN(coerced)) {
          return coerced
        }
      }
    }
  }

  // handle quoted strings
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    const unquoted = trimmed.slice(1, -1)

    // try parsing as ISO date
    if (/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/.test(unquoted)) {
      const timestamp = new Date(unquoted).getTime()
      // check for invalid date
      if (!isNaN(timestamp)) {
        return timestamp
      }
    }

    return unquoted
  }
  // handle booleans
  if (trimmed === "true") return true
  if (trimmed === "false") return false
  // handle numbers
  const num = Number(trimmed)
  if (!isNaN(num)) return num

  // handle unquoted ISO dates (for backward compatibility)
  if (/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/.test(trimmed)) {
    const timestamp = new Date(trimmed).getTime()
    if (!isNaN(timestamp)) {
      return timestamp
    }
  }

  // fallback to string
  return trimmed
}

// tokenize filter expression for boolean operators
function tokenizeFilter(expr: string): string[] {
  const tokens: string[] = []
  let current = ""
  let parenDepth = 0
  let inQuotes = false
  let quoteChar = ""

  for (let i = 0; i < expr.length; i++) {
    const char = expr[i]
    const next = expr[i + 1]

    // track quote state
    if ((char === '"' || char === "'") && (i === 0 || expr[i - 1] !== "\\")) {
      if (!inQuotes) {
        inQuotes = true
        quoteChar = char
        current += char
      } else if (char === quoteChar) {
        inQuotes = false
        quoteChar = ""
        current += char
      } else {
        current += char
      }
      continue
    }

    // skip processing inside quotes
    if (inQuotes) {
      current += char
      continue
    }

    // track parentheses
    if (char === "(") {
      parenDepth++
      current += char
      continue
    }
    if (char === ")") {
      parenDepth--
      current += char
      continue
    }

    // detect && and || operators at depth 0
    if (parenDepth === 0) {
      if (char === "&" && next === "&") {
        if (current.trim()) tokens.push(current.trim())
        tokens.push("&&")
        current = ""
        i++ // skip next &
        continue
      }
      if (char === "|" && next === "|") {
        if (current.trim()) tokens.push(current.trim())
        tokens.push("||")
        current = ""
        i++ // skip next |
        continue
      }
    }

    current += char
  }

  if (current.trim()) {
    tokens.push(current.trim())
  }

  return tokens
}

// parse filter with inline boolean operators
function parseFilterWithBoolean(expr: string): BaseFilter {
  const tokens = tokenizeFilter(expr)

  // no boolean operators found
  if (tokens.length === 1) {
    return parseFilterAtom(tokens[0])
  }

  // parse with precedence: || has lower precedence than &&
  // first split by ||, then recursively split by &&
  const orGroups: string[][] = [[]]
  let currentGroup = 0

  for (const token of tokens) {
    if (token === "||") {
      currentGroup++
      orGroups[currentGroup] = []
    } else {
      orGroups[currentGroup].push(token)
    }
  }

  // if we have multiple OR groups
  if (orGroups.length > 1) {
    return {
      type: "or",
      conditions: orGroups.map((group) => parseAndGroup(group)),
    }
  }

  // single group, parse as AND
  return parseAndGroup(orGroups[0])
}

// parse a group of tokens connected by &&
function parseAndGroup(tokens: string[]): BaseFilter {
  const andConditions: BaseFilter[] = []

  for (const token of tokens) {
    if (token !== "&&") {
      andConditions.push(parseFilterAtom(token))
    }
  }

  if (andConditions.length === 1) {
    return andConditions[0]
  }

  return {
    type: "and",
    conditions: andConditions,
  }
}

// parse a single atomic filter expression (no boolean operators)
function parseFilterAtom(raw: string): BaseFilter {
  const trimmed = raw.trim()

  // check for negation prefix FIRST (before parentheses)
  const negated = trimmed.startsWith("!")
  const cleanRaw = negated ? trimmed.slice(1).trim() : trimmed

  // handle parentheses grouping (after negation check)
  if (cleanRaw.startsWith("(") && cleanRaw.endsWith(")")) {
    const inner = cleanRaw.slice(1, -1)
    const innerFilter = parseFilterWithBoolean(inner)
    // if negated, wrap in not
    if (negated) {
      return {
        type: "not",
        conditions: [innerFilter],
      }
    }
    return innerFilter
  }

  // try method call: 'property.method("arg1", "arg2")' or '!property.method("arg")'
  const methodMatch = cleanRaw.match(/^([\w.-]+)\.([\w]+)\((.*)\)$/)
  if (methodMatch) {
    const [, property, method, argsStr] = methodMatch

    // check if this is a file.* function (special case)
    if (property === "file") {
      const fullName = `${property}.${method}`
      const args = argsStr
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean)

      if (negated) {
        return {
          type: "not",
          conditions: [
            {
              type: "function",
              name: fullName,
              args,
            },
          ],
        }
      }

      return {
        type: "function",
        name: fullName,
        args,
      }
    }

    // regular method call on property
    const args = argsStr
      .split(",")
      .map((s) => s.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean)
    return {
      type: "method",
      property,
      method,
      args,
      negated,
    }
  }

  // try function call: 'file.hasTag("book", "article")'
  const funcMatch = cleanRaw.match(/^([\w.]+)\((.*)\)$/)
  if (funcMatch) {
    const [, name, argsStr] = funcMatch
    const args = argsStr
      .split(",")
      .map((s) => s.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean)

    if (negated) {
      return {
        type: "not",
        conditions: [
          {
            type: "function",
            name,
            args,
          },
        ],
      }
    }

    return {
      type: "function",
      name,
      args,
    }
  }

  // try comparison expression: 'property == "value"' or 'status != "finished"'
  // also support arithmetic: 'price * 1.13 > 50' or '(end - start) / 86400000 > 7'
  const comparisonMatch = trimmed.match(/^(.+?)\s*(==|!=|>=|<=|>|<|contains|!contains)\s*(.+)$/)
  if (comparisonMatch) {
    const [, leftStr, operator, rightStr] = comparisonMatch
    const left = leftStr.trim()
    const right = rightStr.trim()

    // check if left side has arithmetic operators
    if (hasArithmeticOperators(left)) {
      // parse right side as value (must be constant)
      const value = parseValue(right)
      return {
        type: "comparison",
        property: left,
        operator: operator.trim() as ComparisonOp,
        value,
        isExpression: true,
      }
    }

    // standard property comparison
    const value = parseValue(right)
    return {
      type: "comparison",
      property: left,
      operator: operator.trim() as ComparisonOp,
      value,
    }
  }

  // handle implicit boolean property reference: 'deleted' or '!deleted'
  // these are shorthand for 'deleted == true' or 'deleted == false'
  if (negated) {
    // !propertyName -> propertyName == false
    if (/^[a-zA-Z_][\w.]*$/.test(cleanRaw)) {
      return {
        type: "comparison",
        property: cleanRaw,
        operator: "==",
        value: false,
      }
    }
  } else {
    // propertyName -> propertyName == true (but only if no operators found)
    if (/^[a-zA-Z_][\w.]*$/.test(trimmed)) {
      return {
        type: "comparison",
        property: trimmed,
        operator: "==",
        value: true,
      }
    }
  }

  throw new Error(`Invalid filter string: ${trimmed}`)
}

export function parseFilter(raw: any): BaseFilter {
  if (typeof raw === "string") {
    if (raw.includes("&&") || raw.includes("||")) return parseFilterWithBoolean(raw)
    return parseFilterAtom(raw)
  }

  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid filter: must be an object or string")
  }

  if ("and" in raw && Array.isArray(raw.and)) {
    return { type: "and", conditions: raw.and.map(parseFilter) }
  }
  if ("or" in raw && Array.isArray(raw.or)) {
    return { type: "or", conditions: raw.or.map(parseFilter) }
  }
  if ("not" in raw && Array.isArray(raw.not)) {
    return { type: "not", conditions: raw.not.map(parseFilter) }
  }

  throw new Error(`Invalid filter structure: ${JSON.stringify(raw)}`)
}

export function parseFormula(_name: string, expression: string): FormulaDefinition {
  const trimmed = expression.trim()
  const comparisonMatch = trimmed.match(/^([\w.]+)\s*(==|!=|>=|<=|>|<)\s*(.+)$/)

  if (comparisonMatch) {
    const [, property, operator, valueStr] = comparisonMatch
    return {
      expression: trimmed,
      property: property.trim(),
      operator: operator.trim() as ComparisonOp,
      value: parseFormulaValue(valueStr.trim()),
    }
  }

  return { expression: trimmed }
}

function parseFormulaValue(val: string): string | number | boolean {
  const trimmed = val.trim()

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }

  if (trimmed === "true") return true
  if (trimmed === "false") return false

  const num = Number(trimmed)
  if (!isNaN(num)) return num

  return trimmed
}

export function parseFormulas(raw: any): Record<string, FormulaDefinition> | undefined {
  if (!raw || typeof raw !== "object") return undefined

  const formulas: Record<string, FormulaDefinition> = {}
  for (const [name, expression] of Object.entries(raw)) {
    if (typeof expression === "string") formulas[name] = parseFormula(name, expression)
  }

  return Object.keys(formulas).length > 0 ? formulas : undefined
}

export function parseViews(raw: any): BaseView[] {
  if (!Array.isArray(raw)) throw new Error("Views must be an array")

  return raw.map((v) => {
    if (!v || typeof v !== "object") throw new Error("Each view must be an object")
    if (!v.type || !v.name) throw new Error("Each view must have 'type' and 'name' fields")

    return {
      ...v,
      type: v.type,
      name: v.name,
      order: v.order,
      sort: v.sort,
      columnSize: v.columnSize,
      groupBy: v.groupBy,
      limit: v.limit,
      filters: v.filters ? parseFilter(v.filters) : undefined,
      summaries: v.summaries,
    } as BaseView
  })
}

const BUILTIN_SUMMARY_TYPES: BuiltinSummaryType[] = [
  "count",
  "sum",
  "average",
  "avg",
  "min",
  "max",
  "range",
  "unique",
  "filled",
  "missing",
  "earliest",
  "latest",
]

export function parseViewSummaries(
  viewSummaries: Record<string, string> | ViewSummaryConfig | undefined,
  topLevelSummaries?: Record<string, string>,
): ViewSummaryConfig | undefined {
  if (!viewSummaries || typeof viewSummaries !== "object") return undefined

  if ("columns" in viewSummaries && typeof viewSummaries.columns === "object") {
    return viewSummaries as ViewSummaryConfig
  }

  const columns: Record<string, SummaryDefinition> = {}

  for (const [column, summaryValue] of Object.entries(viewSummaries)) {
    if (typeof summaryValue !== "string") continue

    const normalized = summaryValue.toLowerCase().trim()

    if (BUILTIN_SUMMARY_TYPES.includes(normalized as BuiltinSummaryType)) {
      columns[column] = { type: "builtin", builtinType: normalized as BuiltinSummaryType }
      continue
    }

    if (topLevelSummaries && summaryValue in topLevelSummaries) {
      columns[column] = {
        type: "formula",
        formulaRef: summaryValue,
        expression: topLevelSummaries[summaryValue],
      }
      continue
    }

    if (summaryValue.includes("(") || summaryValue.includes(".")) {
      columns[column] = { type: "formula", expression: summaryValue }
    }
  }

  return Object.keys(columns).length > 0 ? { columns } : undefined
}
