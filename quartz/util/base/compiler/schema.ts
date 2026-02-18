export const BUILTIN_SUMMARY_TYPES = [
  'count',
  'sum',
  'average',
  'avg',
  'min',
  'max',
  'range',
  'unique',
  'filled',
  'missing',
  'median',
  'stddev',
  'checked',
  'unchecked',
  'empty',
  'earliest',
  'latest',
] as const

export type BuiltinSummaryType = (typeof BUILTIN_SUMMARY_TYPES)[number]

export interface SummaryDefinition {
  type: 'builtin' | 'formula'
  builtinType?: BuiltinSummaryType
  formulaRef?: string
  expression?: string
}

export interface ViewSummaryConfig {
  columns: Record<string, SummaryDefinition>
}

export interface PropertyConfig {
  displayName?: string
}
