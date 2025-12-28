import { QuartzPluginData } from "../../plugins/vfile"
import {
  ComparisonOp,
  compileExpression,
  parseDuration,
  FormulaDefinition,
  SummaryDefinition,
  ViewSummaryConfig,
  BuiltinSummaryType,
} from "./types"
import { simplifySlug, FullSlug } from "../path"

// filter AST types matching obsidian bases syntax
export type BaseFilter =
  | { type: "and"; conditions: BaseFilter[] }
  | { type: "or"; conditions: BaseFilter[] }
  | { type: "not"; conditions: BaseFilter[] }
  | { type: "function"; name: string; args: string[] }
  | {
      type: "comparison"
      property: string
      operator: ComparisonOp
      value: string | number | boolean | Date
      isExpression?: boolean
    }
  | { type: "method"; property: string; method: string; args: string[]; negated: boolean }

export type FilePredicate = (file: QuartzPluginData, allFiles: QuartzPluginData[]) => boolean

// resolve a property reference (frontmatter or file.* helper) to its value
export function resolvePropertyValue(
  file: QuartzPluginData,
  property: string,
  allFiles: QuartzPluginData[] = [],
): any {
  if (property.startsWith("file.")) {
    switch (property) {
      case "file.name": {
        const filePath = file.filePath as string | undefined
        if (filePath) {
          const segment = filePath.split("/").pop() || ""
          return segment.replace(/\.[^/.]+$/, "")
        }
        const slug = file.slug || ""
        const segment = slug.split("/").pop() || ""
        return segment.replace(/\.[^/.]+$/, "")
      }
      case "file.title": {
        const title = file.frontmatter?.title
        if (typeof title === "string" && title.length > 0) {
          return title
        }
        const filePath = file.filePath as string | undefined
        if (filePath) {
          const segment = filePath.split("/").pop() || ""
          return segment.replace(/\.[^/.]+$/, "")
        }
        const slug = file.slug || ""
        const segment = slug.split("/").pop() || ""
        return segment.replace(/\.[^/.]+$/, "")
      }
      case "file.path":
        return file.filePath || file.slug || ""
      case "file.link":
        return file.slug || ""
      case "file.folder": {
        const parts = file.slug?.split("/") || []
        return parts.length > 1 ? parts.slice(0, -1).join("/") : ""
      }
      case "file.ext": {
        const name = file.filePath?.split("/").pop() || file.slug?.split("/").pop() || ""
        const match = name.match(/\.([^.]+)$/)
        return match ? match[1] : "md"
      }
      case "file.tags":
        return file.frontmatter?.tags || []
      case "file.outlinks":
      case "file.links":
        return file.links || []
      case "file.inlinks":
      case "file.backlinks": {
        const slug = file.slug
        if (!slug) {
          return []
        }
        const simpleSlug = simplifySlug(slug)
        return allFiles
          .filter((f) => f.links?.includes(simpleSlug))
          .map((f) => f.slug)
          .filter(Boolean)
      }
      case "file.aliases":
        return file.frontmatter?.aliases || []
      case "file.ctime":
        return file.dates?.created ? new Date(file.dates.created) : undefined
      case "file.mtime":
        return file.dates?.modified ? new Date(file.dates.modified) : undefined
      default:
        return undefined
    }
  }

  let key = property
  if (key.startsWith("note.")) {
    key = key.slice("note.".length)
  }

  if (key.includes(".")) {
    const segments = key.split(".")
    let current: any = file.frontmatter
    for (const segment of segments) {
      if (current && typeof current === "object" && segment in current) {
        current = current[segment as keyof typeof current]
      } else {
        return undefined
      }
    }
    return current
  }

  return file.frontmatter?.[key]
}

// evaluate a formula definition against a file, returning the computed value
export function evaluateFormula(
  formula: FormulaDefinition,
  file: QuartzPluginData,
  allFiles: QuartzPluginData[] = [],
): any {
  // if we have a parsed comparison formula, evaluate it
  if (formula.property && formula.operator !== undefined && formula.value !== undefined) {
    const propValue = resolvePropertyValue(file, formula.property, allFiles)

    // normalize values for comparison
    const normalizeValue = (val: any): any => {
      if (val instanceof Date) return val.getTime()
      if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}/.test(val)) {
        const parsed = new Date(val)
        if (!isNaN(parsed.getTime())) return parsed.getTime()
      }
      return val
    }

    const normalizedProp = normalizeValue(propValue)
    const normalizedTarget = normalizeValue(formula.value)

    switch (formula.operator) {
      case "==":
        return normalizedProp === normalizedTarget
      case "!=":
        return normalizedProp !== normalizedTarget
      case ">":
        return (
          typeof normalizedProp === "number" &&
          typeof normalizedTarget === "number" &&
          normalizedProp > normalizedTarget
        )
      case "<":
        return (
          typeof normalizedProp === "number" &&
          typeof normalizedTarget === "number" &&
          normalizedProp < normalizedTarget
        )
      case ">=":
        return (
          typeof normalizedProp === "number" &&
          typeof normalizedTarget === "number" &&
          normalizedProp >= normalizedTarget
        )
      case "<=":
        return (
          typeof normalizedProp === "number" &&
          typeof normalizedTarget === "number" &&
          normalizedProp <= normalizedTarget
        )
      default:
        return undefined
    }
  }

  // fallback: return undefined for unparsed expressions
  return undefined
}

function normalizeLinkTarget(raw: unknown): string | undefined {
  if (typeof raw !== "string") {
    return undefined
  }

  let slug = raw.trim()
  if (!slug) {
    return undefined
  }

  if (slug.startsWith("!")) {
    slug = slug.slice(1)
  }

  if (slug.startsWith("[[") && slug.endsWith("]]")) {
    slug = slug.slice(2, -2)
  }

  slug = slug.replace(/\.md$/i, "")
  slug = slug.replace(/\\/g, "/")
  slug = slug.replace(/^\/+/, "")

  try {
    return simplifySlug(slug as FullSlug)
  } catch {
    return slug.toLowerCase()
  }
}

function findFileByNormalizedSlug(
  normalized: string | undefined,
  allFiles: QuartzPluginData[],
): QuartzPluginData | undefined {
  if (!normalized) {
    return undefined
  }

  return allFiles.find((candidate) => {
    if (!candidate.slug) {
      return false
    }
    const candidateSlug = normalizeLinkTarget(candidate.slug as string)
    return candidateSlug === normalized
  })
}

function parseRegexInput(pattern: string): RegExp | null {
  if (!pattern) {
    return null
  }

  let source = pattern
  let flags = ""

  const literalMatch = pattern.match(/^\/(.*)\/([gimsuy]*)$/)
  if (literalMatch) {
    source = literalMatch[1]
    flags = literalMatch[2]
  }

  try {
    return new RegExp(source, flags)
  } catch {
    return null
  }
}

// evaluate filter against all files, return matching subset
export function evaluateFilter(
  filter: BaseFilter,
  allFiles: QuartzPluginData[],
): QuartzPluginData[] {
  const predicate = buildPredicate(filter)
  return allFiles.filter((file) => predicate(file, allFiles))
}

// recursively build predicate function from filter AST
function buildPredicate(filter: BaseFilter): FilePredicate {
  switch (filter.type) {
    case "and":
      return and(filter.conditions.map(buildPredicate))
    case "or":
      return or(filter.conditions.map(buildPredicate))
    case "not":
      return not(buildPredicate(filter.conditions[0]))
    case "function":
      return parseFunction(filter.name, filter.args)
    case "comparison":
      return parseComparison(filter.property, filter.operator, filter.value, filter.isExpression)
    case "method":
      return buildMethodCall(filter.property, filter.method, filter.args, filter.negated)
  }
}

// boolean combinators
function and(predicates: FilePredicate[]): FilePredicate {
  return (file, allFiles) => predicates.every((p) => p(file, allFiles))
}

function or(predicates: FilePredicate[]): FilePredicate {
  return (file, allFiles) => predicates.some((p) => p(file, allFiles))
}

function not(predicate: FilePredicate): FilePredicate {
  return (file, allFiles) => !predicate(file, allFiles)
}

// comparison predicate builder
function parseComparison(
  property: string,
  operator: ComparisonOp,
  value: string | number | boolean | Date,
  isExpression?: boolean,
): FilePredicate {
  // if isExpression is true, property is an arithmetic expression
  if (isExpression) {
    const evaluator = compileExpression(property)
    return (file, _allFiles) => {
      try {
        const computedValue = evaluator(file.frontmatter || {})

        switch (operator) {
          case "==":
            return computedValue === value
          case "!=":
            return computedValue !== value
          case ">":
            if (typeof value === "number") {
              return computedValue > value
            }
            return false
          case "<":
            if (typeof value === "number") {
              return computedValue < value
            }
            return false
          case ">=":
            if (typeof value === "number") {
              return computedValue >= value
            }
            return false
          case "<=":
            if (typeof value === "number") {
              return computedValue <= value
            }
            return false
          default:
            return false
        }
      } catch (err) {
        // if evaluation fails (e.g., property not a number), return false
        return false
      }
    }
  }

  // standard property comparison
  return (file, allFiles) => {
    const fileValue = resolvePropertyValue(file, property, allFiles)

    // helper to normalize values for comparison
    const normalizeForComparison = (val: any) => {
      if (val instanceof Date) {
        return val.getTime()
      }
      if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}/.test(val)) {
        // looks like a date string, parse it
        const parsed = new Date(val)
        if (!isNaN(parsed.getTime())) {
          return parsed.getTime()
        }
      }
      return val
    }

    switch (operator) {
      case "==": {
        const normalizedFile = normalizeForComparison(fileValue)
        const normalizedValue = normalizeForComparison(value)
        return normalizedFile === normalizedValue
      }
      case "!=": {
        const normalizedFile = normalizeForComparison(fileValue)
        const normalizedValue = normalizeForComparison(value)
        return normalizedFile !== normalizedValue
      }
      case ">": {
        const normalizedFile = normalizeForComparison(fileValue)
        const normalizedValue = normalizeForComparison(value)
        if (typeof normalizedFile === "number" && typeof normalizedValue === "number") {
          return normalizedFile > normalizedValue
        }
        if (typeof normalizedFile === "string" && typeof normalizedValue === "string") {
          return normalizedFile > normalizedValue
        }
        return false
      }
      case "<": {
        const normalizedFile = normalizeForComparison(fileValue)
        const normalizedValue = normalizeForComparison(value)
        if (typeof normalizedFile === "number" && typeof normalizedValue === "number") {
          return normalizedFile < normalizedValue
        }
        if (typeof normalizedFile === "string" && typeof normalizedValue === "string") {
          return normalizedFile < normalizedValue
        }
        return false
      }
      case ">=": {
        const normalizedFile = normalizeForComparison(fileValue)
        const normalizedValue = normalizeForComparison(value)
        if (typeof normalizedFile === "number" && typeof normalizedValue === "number") {
          return normalizedFile >= normalizedValue
        }
        if (typeof normalizedFile === "string" && typeof normalizedValue === "string") {
          return normalizedFile >= normalizedValue
        }
        return false
      }
      case "<=": {
        const normalizedFile = normalizeForComparison(fileValue)
        const normalizedValue = normalizeForComparison(value)
        if (typeof normalizedFile === "number" && typeof normalizedValue === "number") {
          return normalizedFile <= normalizedValue
        }
        if (typeof normalizedFile === "string" && typeof normalizedValue === "string") {
          return normalizedFile <= normalizedValue
        }
        return false
      }
      case "contains":
        if (Array.isArray(fileValue)) {
          return fileValue.includes(value)
        }
        if (typeof fileValue === "string" && typeof value === "string") {
          return fileValue.includes(value)
        }
        return false
      case "!contains":
        if (Array.isArray(fileValue)) {
          return !fileValue.includes(value)
        }
        if (typeof fileValue === "string" && typeof value === "string") {
          return !fileValue.includes(value)
        }
        return false
      default:
        return false
    }
  }
}

// evaluate an argument that might contain a function call
function evaluateArgument(arg: string): string {
  const trimmed = arg.trim()

  // check for link() function call
  const linkMatch = trimmed.match(/^link\(["']?(.+?)["']?\)$/)
  if (linkMatch) {
    const target = linkMatch[1]
    // return wikilink format to match frontmatter
    return `[[${target}]]`
  }

  // return the arg as-is for other cases
  return arg
}

// method call predicate builder for property.method(args) syntax
function buildMethodCall(
  property: string,
  method: string,
  args: string[],
  negated: boolean,
): FilePredicate {
  return (file, allFiles) => {
    const propValue = resolvePropertyValue(file, property, allFiles)

    // evaluate args to handle function calls like link()
    const evaluatedArgs = args.map(evaluateArgument)

    switch (method) {
      case "toString": {
        // convert value to string
        if (propValue === undefined || propValue === null) {
          return negated ? true : false
        }
        // toString() always returns true as it's a transformation, not a boolean check
        // in obsidian, toString() is used in comparisons like: file.name.toString() == "something"
        // but as a standalone method call check, we just verify the value exists
        return negated ? false : true
      }

      case "contains": {
        if (evaluatedArgs.length === 0) {
          return negated ? true : false
        }
        const [needle] = evaluatedArgs
        let result = false
        if (Array.isArray(propValue)) {
          result = propValue.includes(needle)
        } else if (typeof propValue === "string") {
          result = propValue.includes(String(needle))
        }
        return negated ? !result : result
      }

      case "containsAny": {
        let result = false
        if (Array.isArray(propValue)) {
          result = evaluatedArgs.some((arg) => propValue.includes(arg))
        } else if (typeof propValue === "string") {
          result = evaluatedArgs.some((arg) => propValue.includes(String(arg)))
        }
        return negated ? !result : result
      }

      case "containsAll": {
        let result = false
        if (Array.isArray(propValue)) {
          result = evaluatedArgs.every((arg) => propValue.includes(arg))
        } else if (typeof propValue === "string") {
          result = evaluatedArgs.every((arg) => propValue.includes(String(arg)))
        }
        return negated ? !result : result
      }

      case "startsWith": {
        let result = false
        if (typeof propValue === "string" && evaluatedArgs.length > 0) {
          result = propValue.startsWith(String(evaluatedArgs[0]))
        }
        return negated ? !result : result
      }

      case "endsWith": {
        let result = false
        if (typeof propValue === "string" && evaluatedArgs.length > 0) {
          result = propValue.endsWith(String(evaluatedArgs[0]))
        }
        return negated ? !result : result
      }

      case "isEmpty": {
        const result =
          propValue === undefined ||
          propValue === null ||
          propValue === "" ||
          (Array.isArray(propValue) && propValue.length === 0) ||
          (typeof propValue === "object" &&
            propValue !== null &&
            !Array.isArray(propValue) &&
            Object.keys(propValue).length === 0)
        return negated ? !result : result
      }

      case "isTruthy": {
        const result = Boolean(propValue)
        return negated ? !result : result
      }

      case "isType": {
        if (evaluatedArgs.length === 0) return negated ? true : false
        const typeArg = evaluatedArgs[0].toLowerCase()
        let result = false

        switch (typeArg) {
          case "null":
            result = propValue === null || propValue === undefined
            break
          case "string":
            result = typeof propValue === "string"
            break
          case "number":
            result = typeof propValue === "number"
            break
          case "boolean":
            result = typeof propValue === "boolean"
            break
          case "array":
            result = Array.isArray(propValue)
            break
          case "object":
            result =
              typeof propValue === "object" && propValue !== null && !Array.isArray(propValue)
            break
          default:
            result = false
        }
        return negated ? !result : result
      }

      // string methods
      case "replace": {
        // replace(search, replacement) - used for transformation, not filtering
        // for filtering purposes, check if value is a string
        const result = typeof propValue === "string" && evaluatedArgs.length >= 2
        return negated ? !result : result
      }

      case "lower": {
        // convert to lowercase - for filtering, check if string exists
        const result = typeof propValue === "string"
        return negated ? !result : result
      }

      case "upper": {
        // convert to uppercase - for filtering, check if string exists
        const result = typeof propValue === "string"
        return negated ? !result : result
      }

      case "slice": {
        // slice(start, end) - for filtering, check if value is string or array
        const result =
          (typeof propValue === "string" || Array.isArray(propValue)) && evaluatedArgs.length >= 1
        return negated ? !result : result
      }

      case "split": {
        // split(delimiter) - for filtering, check if string with delimiter
        const result = typeof propValue === "string" && evaluatedArgs.length >= 1
        return negated ? !result : result
      }

      case "trim": {
        // trim whitespace - for filtering, check if string
        const result = typeof propValue === "string"
        return negated ? !result : result
      }

      // number methods
      case "abs": {
        // absolute value - for filtering, check if number
        const result = typeof propValue === "number"
        return negated ? !result : result
      }

      case "ceil": {
        // ceiling - for filtering, check if number
        const result = typeof propValue === "number"
        return negated ? !result : result
      }

      case "floor": {
        // floor - for filtering, check if number
        const result = typeof propValue === "number"
        return negated ? !result : result
      }

      case "round": {
        // round - for filtering, check if number
        const result = typeof propValue === "number"
        return negated ? !result : result
      }

      case "toFixed": {
        // toFixed(decimals) - for filtering, check if number
        const result = typeof propValue === "number" && evaluatedArgs.length >= 1
        return negated ? !result : result
      }

      // array methods
      case "join": {
        // join(separator) - for filtering, check if array
        const result = Array.isArray(propValue)
        return negated ? !result : result
      }

      case "reverse": {
        const result = typeof propValue === "string" || Array.isArray(propValue)
        return negated ? !result : result
      }

      case "sort": {
        // sort array - for filtering, check if array
        const result = Array.isArray(propValue)
        return negated ? !result : result
      }

      case "flat": {
        const result = Array.isArray(propValue)
        return negated ? !result : result
      }

      case "map":
      case "filter": {
        const result = Array.isArray(propValue)
        return negated ? !result : result
      }

      case "unique": {
        // remove duplicates - for filtering, check if array
        const result = Array.isArray(propValue)
        return negated ? !result : result
      }

      case "length": {
        // get length - for filtering, check if string or array
        const result =
          typeof propValue === "string" ||
          Array.isArray(propValue) ||
          (typeof propValue === "object" && propValue !== null)
        return negated ? !result : result
      }

      case "title": {
        const result = typeof propValue === "string"
        return negated ? !result : result
      }

      case "keys": {
        const result =
          typeof propValue === "object" && propValue !== null && !Array.isArray(propValue)
        return negated ? !result : result
      }

      case "values": {
        const result =
          typeof propValue === "object" && propValue !== null && !Array.isArray(propValue)
        return negated ? !result : result
      }

      case "matches": {
        if (typeof propValue !== "string" || evaluatedArgs.length === 0) {
          return negated ? true : false
        }
        const regex = parseRegexInput(evaluatedArgs[0])
        const result = regex ? regex.test(propValue) : false
        return negated ? !result : result
      }

      case "linksTo": {
        if (evaluatedArgs.length === 0) {
          return negated ? true : false
        }
        const normalizedTarget = normalizeLinkTarget(evaluatedArgs[0])
        if (!normalizedTarget) {
          return negated ? true : false
        }

        const values = Array.isArray(propValue) ? propValue : [propValue]
        const result = values.some((val) => {
          if (typeof val !== "string") {
            return false
          }
          const normalizedValue = normalizeLinkTarget(val)
          return normalizedValue === normalizedTarget
        })
        return negated ? !result : result
      }

      case "asFile": {
        if (typeof propValue !== "string") {
          return negated ? true : false
        }
        const normalized = normalizeLinkTarget(propValue)
        const exists = Boolean(findFileByNormalizedSlug(normalized, allFiles))
        return negated ? !exists : exists
      }

      default:
        throw new Error(`Unknown method: ${method}`)
    }
  }
}

// helper to parse and evaluate a value expression
function parseValueExpression(expr: string, file: QuartzPluginData): any {
  const trimmed = expr.trim()

  // handle quoted strings
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }

  // handle numbers
  const num = Number(trimmed)
  if (!isNaN(num)) return num

  // handle booleans
  if (trimmed === "true") return true
  if (trimmed === "false") return false

  // handle property access
  return file.frontmatter?.[trimmed]
}

// function registry - maps filter function names to predicates
function parseFunction(name: string, args: string[]): FilePredicate {
  const registry: Record<string, (...args: string[]) => FilePredicate> = {
    icon:
      (...params: string[]) =>
      () =>
        params.length > 0,
    image:
      (...params: string[]) =>
      () =>
        params.length > 0,
    file: (target?: string) => (_file, allFiles) => {
      const normalized = normalizeLinkTarget(target)
      return Boolean(findFileByNormalizedSlug(normalized, allFiles))
    },

    "file.asLink": () => (file) => Boolean(file.slug),
    "file.hasTag": (...tags: string[]) => {
      let matchCount = 0
      return (file, _allFiles) => {
        const fileTags = file.frontmatter?.tags
        if (!Array.isArray(fileTags)) return false
        // hasTag with multiple args means ANY of the tags (OR semantics)
        const matched = tags.some((tag) => fileTags.includes(tag))
        if (matched && matchCount < 3) {
          matchCount++
        }
        return matched
      }
    },

    "file.inFolder": (folder: string) => {
      let matchCount = 0
      let failCount = 0
      return (file, _allFiles) => {
        if (!file.slug) {
          if (failCount < 3) {
            failCount++
          }
          return false
        }
        // normalize folder path: library -> library/
        const normalizedFolder = folder.endsWith("/") ? folder : folder + "/"
        const matched = file.slug.startsWith(normalizedFolder)
        if (matched && matchCount < 3) {
          matchCount++
        } else if (!matched && failCount < 5) {
          failCount++
        }
        return matched
      }
    },

    "file.hasProperty": (prop: string) => (file, _allFiles) => {
      return file.frontmatter?.[prop] !== undefined
    },

    "file.hasLink": (target: string) => (file, _allFiles) => {
      const links = file.links ?? []
      return links.some((link) => link === target)
    },

    now: () => () => {
      // now() is typically used in comparisons, not as a predicate
      // this should not be called directly but here for completeness
      return true
    },

    today: () => () => {
      // today() is typically used in comparisons, not as a predicate
      return true
    },

    date: (value: string) => (_file, _allFiles) => {
      // convert value to date timestamp
      try {
        const timestamp = new Date(value).getTime()
        return !isNaN(timestamp)
      } catch {
        return false
      }
    },

    if: (conditionStr: string, valueIfTrue: string, valueIfFalse: string) => (file, _allFiles) => {
      // evaluate condition as a boolean expression
      // this is a simplified version - full implementation would need recursive parsing
      // XXX: more complex
      try {
        const conditionValue = parseValueExpression(conditionStr, file)
        const result = conditionValue
          ? parseValueExpression(valueIfTrue, file)
          : parseValueExpression(valueIfFalse, file)
        return !!result
      } catch {
        return false
      }
    },

    number: (_value: string) => () => {
      // convert value to number - used for transformation
      return true
    },

    max:
      (...values: string[]) =>
      (file, _allFiles) => {
        try {
          const nums = values.map((v) => {
            const parsed = parseValueExpression(v, file)
            return typeof parsed === "number" ? parsed : Number(parsed)
          })
          const result = Math.max(...nums)
          return !isNaN(result)
        } catch {
          return false
        }
      },

    min:
      (...values: string[]) =>
      (file, _allFiles) => {
        try {
          const nums = values.map((v) => {
            const parsed = parseValueExpression(v, file)
            return typeof parsed === "number" ? parsed : Number(parsed)
          })
          const result = Math.min(...nums)
          return !isNaN(result)
        } catch {
          return false
        }
      },

    duration: (durationStr: string) => () => {
      // parse duration string (e.g., "7 days", "3 hours", "30 minutes")
      // or accept raw milliseconds as number
      const ms = parseDuration(durationStr)
      return !isNaN(ms) && ms >= 0
    },

    link: (target: string) => (file, _allFiles) => {
      // create link reference - used for comparison
      const simpleTarget = simplifySlug(target as FullSlug)
      return file.links?.includes(simpleTarget) ?? false
    },

    list: () => () => {
      // create list - always returns true if called
      return true
    },
  }

  const factory = registry[name]
  if (!factory) {
    throw new Error(`Unknown filter function: ${name}`)
  }

  return factory(...args)
}

// compute summary value for a column across all matching files
export function computeColumnSummary(
  column: string,
  files: QuartzPluginData[],
  summary: SummaryDefinition,
  allFiles: QuartzPluginData[] = [],
): string | number | undefined {
  if (files.length === 0) {
    return undefined
  }

  // collect all values for this column
  const values: any[] = files.map((file) => resolvePropertyValue(file, column, allFiles))

  if (summary.type === "builtin" && summary.builtinType) {
    return computeBuiltinSummary(values, summary.builtinType)
  }

  if (summary.type === "formula" && summary.expression) {
    return computeFormulaSummary(values, summary.expression)
  }

  return undefined
}

// compute built-in summary aggregations
function computeBuiltinSummary(
  values: any[],
  type: BuiltinSummaryType,
): string | number | undefined {
  switch (type) {
    case "count":
      return values.length

    case "sum": {
      const nums = values.filter((v) => typeof v === "number")
      if (nums.length === 0) return undefined
      return nums.reduce((acc, v) => acc + v, 0)
    }

    case "average":
    case "avg": {
      const nums = values.filter((v) => typeof v === "number")
      if (nums.length === 0) return undefined
      const sum = nums.reduce((acc, v) => acc + v, 0)
      return Math.round((sum / nums.length) * 100) / 100
    }

    case "min": {
      const comparable = values.filter(
        (v) => typeof v === "number" || v instanceof Date || typeof v === "string",
      )
      if (comparable.length === 0) return undefined
      const normalized = comparable.map((v) => (v instanceof Date ? v.getTime() : v))
      const min = Math.min(...normalized.filter((v) => typeof v === "number"))
      if (isNaN(min)) {
        // string comparison
        const strings = comparable.filter((v) => typeof v === "string") as string[]
        if (strings.length === 0) return undefined
        return strings.sort()[0]
      }
      // check if original values were dates
      if (comparable.some((v) => v instanceof Date)) {
        return new Date(min).toISOString().split("T")[0]
      }
      return min
    }

    case "max": {
      const comparable = values.filter(
        (v) => typeof v === "number" || v instanceof Date || typeof v === "string",
      )
      if (comparable.length === 0) return undefined
      const normalized = comparable.map((v) => (v instanceof Date ? v.getTime() : v))
      const max = Math.max(...normalized.filter((v) => typeof v === "number"))
      if (isNaN(max)) {
        const strings = comparable.filter((v) => typeof v === "string") as string[]
        if (strings.length === 0) return undefined
        return strings.sort().reverse()[0]
      }
      if (comparable.some((v) => v instanceof Date)) {
        return new Date(max).toISOString().split("T")[0]
      }
      return max
    }

    case "range": {
      const comparable = values.filter(
        (v) => typeof v === "number" || v instanceof Date || typeof v === "string",
      )
      if (comparable.length === 0) return undefined
      const normalized = comparable.map((v) => (v instanceof Date ? v.getTime() : v))
      const nums = normalized.filter((v) => typeof v === "number")
      if (nums.length === 0) return undefined
      const min = Math.min(...nums)
      const max = Math.max(...nums)
      if (comparable.some((v) => v instanceof Date)) {
        return `${new Date(min).toISOString().split("T")[0]} - ${new Date(max).toISOString().split("T")[0]}`
      }
      return `${min} - ${max}`
    }

    case "unique": {
      const nonNull = values.filter((v) => v !== undefined && v !== null && v !== "")
      const unique = new Set(nonNull.map((v) => (v instanceof Date ? v.toISOString() : String(v))))
      return unique.size
    }

    case "filled": {
      const filled = values.filter((v) => v !== undefined && v !== null && v !== "")
      return filled.length
    }

    case "missing": {
      const missing = values.filter((v) => v === undefined || v === null || v === "")
      return missing.length
    }

    case "earliest": {
      const dates = values.filter(
        (v) =>
          v instanceof Date ||
          (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v)) ||
          typeof v === "number",
      )
      if (dates.length === 0) return undefined
      const timestamps = dates.map((v) => {
        if (v instanceof Date) return v.getTime()
        if (typeof v === "string") return new Date(v).getTime()
        return v
      })
      const earliest = Math.min(...timestamps)
      return new Date(earliest).toISOString().split("T")[0]
    }

    case "latest": {
      const dates = values.filter(
        (v) =>
          v instanceof Date ||
          (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v)) ||
          typeof v === "number",
      )
      if (dates.length === 0) return undefined
      const timestamps = dates.map((v) => {
        if (v instanceof Date) return v.getTime()
        if (typeof v === "string") return new Date(v).getTime()
        return v
      })
      const latest = Math.max(...timestamps)
      return new Date(latest).toISOString().split("T")[0]
    }

    default:
      return undefined
  }
}

// compute formula-based summary
// supports expressions like: values.filter(value.isType("null")).length
// XXX: This is mostly monkeypatched together. Proper implementation would require a small jit.
function computeFormulaSummary(values: any[], expression: string): string | number | undefined {
  try {
    // parse common formula patterns
    // pattern: values.filter(value.isType("null")).length -> count nulls
    const isTypeNullMatch = expression.match(
      /values\.filter\(value\.isType\(['"](null|undefined)['"]\)\)\.length/,
    )
    if (isTypeNullMatch) {
      return values.filter((v) => v === null || v === undefined).length
    }

    // pattern: values.filter(value == true).reduce(acc + 1, 0)
    const filterTrueMatch = expression.match(
      /values\.filter\(value\s*==\s*true\)\.reduce\(acc\s*\+\s*1,\s*0\)/,
    )
    if (filterTrueMatch) {
      return values.filter((v) => v === true).length
    }

    // pattern: values.filter(value == false).reduce(acc + 1, 0)
    const filterFalseMatch = expression.match(
      /values\.filter\(value\s*==\s*false\)\.reduce\(acc\s*\+\s*1,\s*0\)/,
    )
    if (filterFalseMatch) {
      return values.filter((v) => v === false).length
    }

    // pattern: values.reduce(acc + value, 0) -> sum
    const sumMatch = expression.match(/values\.reduce\(acc\s*\+\s*value,\s*0\)/)
    if (sumMatch) {
      const nums = values.filter((v) => typeof v === "number")
      return nums.reduce((acc, v) => acc + v, 0)
    }

    // pattern: values.length
    if (expression.trim() === "values.length") {
      return values.length
    }

    // pattern: values.filter(value => ...).length
    const filterLengthMatch = expression.match(/values\.filter\(.+\)\.length/)
    if (filterLengthMatch) {
      // for now, return count of non-null values as fallback
      return values.filter((v) => v !== null && v !== undefined).length
    }

    return undefined
  } catch {
    return undefined
  }
}

// compute all summaries for a view
export function computeViewSummaries(
  columns: string[],
  files: QuartzPluginData[],
  summaryConfig: ViewSummaryConfig | undefined,
  allFiles: QuartzPluginData[] = [],
): Record<string, string | number | undefined> {
  const results: Record<string, string | number | undefined> = {}

  if (!summaryConfig?.columns) {
    return results
  }

  for (const column of columns) {
    const summary = summaryConfig.columns[column]
    if (summary) {
      results[column] = computeColumnSummary(column, files, summary, allFiles)
    }
  }

  return results
}
