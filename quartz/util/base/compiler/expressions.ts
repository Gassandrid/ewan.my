import { ProgramIR } from './ir'

export type BasesExpressions = {
  filters?: ProgramIR
  viewFilters: Record<string, ProgramIR>
  formulas: Record<string, ProgramIR>
  summaries: Record<string, ProgramIR>
  viewSummaries: Record<string, Record<string, ProgramIR>>
  propertyExpressions: Record<string, ProgramIR>
}
