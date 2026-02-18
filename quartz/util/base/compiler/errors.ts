import { Span } from './ast'

export type Diagnostic = { kind: 'lex' | 'parse'; message: string; span: Span }
