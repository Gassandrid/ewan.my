export type Position = { offset: number; line: number; column: number }

export type Span = { start: Position; end: Position; file?: string }

export type Program = { type: 'Program'; body: Expr | null; span: Span }

export type Expr =
  | Literal
  | Identifier
  | UnaryExpr
  | BinaryExpr
  | LogicalExpr
  | CallExpr
  | MemberExpr
  | IndexExpr
  | ListExpr
  | ErrorExpr

export type LiteralKind = 'number' | 'string' | 'boolean' | 'null' | 'date' | 'duration' | 'regex'

export type NumberLiteral = { type: 'Literal'; kind: 'number'; value: number; span: Span }
export type StringLiteral = { type: 'Literal'; kind: 'string'; value: string; span: Span }
export type BooleanLiteral = { type: 'Literal'; kind: 'boolean'; value: boolean; span: Span }
export type NullLiteral = { type: 'Literal'; kind: 'null'; value: null; span: Span }
export type DateLiteral = { type: 'Literal'; kind: 'date'; value: string; span: Span }
export type DurationLiteral = { type: 'Literal'; kind: 'duration'; value: string; span: Span }
export type RegexLiteral = {
  type: 'Literal'
  kind: 'regex'
  value: string
  flags: string
  span: Span
}

export type Literal =
  | NumberLiteral
  | StringLiteral
  | BooleanLiteral
  | NullLiteral
  | DateLiteral
  | DurationLiteral
  | RegexLiteral

export type Identifier = { type: 'Identifier'; name: string; span: Span }

export type UnaryExpr = { type: 'UnaryExpr'; operator: '!' | '-'; argument: Expr; span: Span }

export type BinaryExpr = {
  type: 'BinaryExpr'
  operator: '+' | '-' | '*' | '/' | '%' | '==' | '!=' | '>' | '>=' | '<' | '<='
  left: Expr
  right: Expr
  span: Span
}

export type LogicalExpr = {
  type: 'LogicalExpr'
  operator: '&&' | '||'
  left: Expr
  right: Expr
  span: Span
}

export type CallExpr = { type: 'CallExpr'; callee: Expr; args: Expr[]; span: Span }

export type MemberExpr = { type: 'MemberExpr'; object: Expr; property: string; span: Span }

export type IndexExpr = { type: 'IndexExpr'; object: Expr; index: Expr; span: Span }

export type ListExpr = { type: 'ListExpr'; elements: Expr[]; span: Span }

export type ErrorExpr = { type: 'ErrorExpr'; message: string; span: Span }

export function spanFrom(start: Span, end: Span): Span {
  return { start: start.start, end: end.end, file: start.file || end.file }
}
