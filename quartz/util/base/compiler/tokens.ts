import { Span } from './ast'

export type Operator =
  | '=='
  | '!='
  | '>='
  | '<='
  | '>'
  | '<'
  | '&&'
  | '||'
  | '+'
  | '-'
  | '*'
  | '/'
  | '%'
  | '!'

export type Punctuation = '.' | ',' | '(' | ')' | '[' | ']'

export type NumberToken = { type: 'number'; value: number; span: Span }
export type StringToken = { type: 'string'; value: string; span: Span }
export type BooleanToken = { type: 'boolean'; value: boolean; span: Span }
export type NullToken = { type: 'null'; span: Span }
export type IdentifierToken = { type: 'identifier'; value: string; span: Span }
export type ThisToken = { type: 'this'; span: Span }
export type OperatorToken = { type: 'operator'; value: Operator; span: Span }
export type PunctuationToken = { type: 'punctuation'; value: Punctuation; span: Span }
export type RegexToken = { type: 'regex'; pattern: string; flags: string; span: Span }
export type EofToken = { type: 'eof'; span: Span }

export type Token =
  | NumberToken
  | StringToken
  | BooleanToken
  | NullToken
  | IdentifierToken
  | ThisToken
  | OperatorToken
  | PunctuationToken
  | RegexToken
  | EofToken
