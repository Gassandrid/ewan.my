import {
  BinaryExpr,
  CallExpr,
  ErrorExpr,
  Expr,
  Identifier,
  IndexExpr,
  ListExpr,
  Literal,
  LogicalExpr,
  MemberExpr,
  Program,
  UnaryExpr,
  spanFrom,
} from './ast'
import { Diagnostic } from './errors'
import { lex } from './lexer'
import { Operator, Token } from './tokens'

export type ParseResult = { program: Program; tokens: Token[]; diagnostics: Diagnostic[] }

type InfixInfo = { lbp: number; rbp: number; kind: 'binary' | 'logical' }

const infixBindingPowers: Record<string, InfixInfo> = {
  '||': { lbp: 1, rbp: 2, kind: 'logical' },
  '&&': { lbp: 3, rbp: 4, kind: 'logical' },
  '==': { lbp: 5, rbp: 6, kind: 'binary' },
  '!=': { lbp: 5, rbp: 6, kind: 'binary' },
  '>': { lbp: 7, rbp: 8, kind: 'binary' },
  '>=': { lbp: 7, rbp: 8, kind: 'binary' },
  '<': { lbp: 7, rbp: 8, kind: 'binary' },
  '<=': { lbp: 7, rbp: 8, kind: 'binary' },
  '+': { lbp: 9, rbp: 10, kind: 'binary' },
  '-': { lbp: 9, rbp: 10, kind: 'binary' },
  '*': { lbp: 11, rbp: 12, kind: 'binary' },
  '/': { lbp: 11, rbp: 12, kind: 'binary' },
  '%': { lbp: 11, rbp: 12, kind: 'binary' },
}

const isLogicalOperator = (value: Operator): value is LogicalExpr['operator'] =>
  value === '&&' || value === '||'

const isBinaryOperator = (value: Operator): value is BinaryExpr['operator'] =>
  value === '+' ||
  value === '-' ||
  value === '*' ||
  value === '/' ||
  value === '%' ||
  value === '==' ||
  value === '!=' ||
  value === '>' ||
  value === '>=' ||
  value === '<' ||
  value === '<='

export function parseExpressionSource(source: string, file?: string): ParseResult {
  const { tokens, diagnostics } = lex(source, file)
  const parser = new Parser(tokens, diagnostics)
  const program = parser.parseProgram()
  return { program, tokens, diagnostics }
}

class Parser {
  private tokens: Token[]
  private index: number
  private diagnostics: Diagnostic[]

  constructor(tokens: Token[], diagnostics: Diagnostic[]) {
    this.tokens = tokens
    this.index = 0
    this.diagnostics = diagnostics
  }

  parseProgram(): Program {
    const start = this.tokens[0]?.span ?? this.tokens[this.tokens.length - 1].span
    const body = this.peek().type === 'eof' ? null : this.parseExpression(0)
    const end = this.tokens[this.tokens.length - 1]?.span ?? start
    return { type: 'Program', body, span: spanFrom(start, end) }
  }

  private parseExpression(minBp: number): Expr {
    let left = this.parsePrefix()
    left = this.parsePostfix(left)

    while (true) {
      const token = this.peek()
      if (token.type !== 'operator') break
      const info = infixBindingPowers[token.value]
      if (!info || info.lbp < minBp) break
      this.advance()
      const right = this.parseExpression(info.rbp)
      const span = spanFrom(left.span, right.span)
      if (info.kind === 'logical' && isLogicalOperator(token.value)) {
        left = { type: 'LogicalExpr', operator: token.value, left, right, span }
      } else if (info.kind === 'binary' && isBinaryOperator(token.value)) {
        left = { type: 'BinaryExpr', operator: token.value, left, right, span }
      } else {
        this.error('unexpected operator', token.span)
      }
    }

    return left
  }

  private parsePrefix(): Expr {
    const token = this.peek()
    if (token.type === 'operator' && (token.value === '!' || token.value === '-')) {
      this.advance()
      const argument = this.parseExpression(13)
      const span = spanFrom(token.span, argument.span)
      const node: UnaryExpr = { type: 'UnaryExpr', operator: token.value, argument, span }
      return node
    }
    return this.parsePrimary()
  }

  private parsePostfix(expr: Expr): Expr {
    let current = expr
    while (true) {
      const token = this.peek()
      if (token.type === 'punctuation' && token.value === '.') {
        this.advance()
        const propToken = this.peek()
        if (propToken.type !== 'identifier') {
          this.error("expected identifier after '.'", propToken.span)
          return current
        }
        this.advance()
        const span = spanFrom(current.span, propToken.span)
        const node: MemberExpr = {
          type: 'MemberExpr',
          object: current,
          property: propToken.value,
          span,
        }
        current = node
        continue
      }

      if (token.type === 'punctuation' && token.value === '[') {
        this.advance()
        const indexExpr = this.parseExpression(0)
        const endToken = this.peek()
        if (!(endToken.type === 'punctuation' && endToken.value === ']')) {
          this.error("expected ']'", endToken.span)
          this.syncTo(']')
        } else {
          this.advance()
        }
        const span = spanFrom(current.span, endToken.span)
        const node: IndexExpr = { type: 'IndexExpr', object: current, index: indexExpr, span }
        current = node
        continue
      }

      if (token.type === 'punctuation' && token.value === '(') {
        this.advance()
        const args: Expr[] = []
        while (this.peek().type !== 'eof') {
          const next = this.peek()
          if (next.type === 'punctuation' && next.value === ')') {
            this.advance()
            break
          }
          const arg = this.parseExpression(0)
          args.push(arg)
          const sep = this.peek()
          if (sep.type === 'punctuation' && sep.value === ',') {
            this.advance()
            const maybeClose = this.peek()
            if (maybeClose.type === 'punctuation' && maybeClose.value === ')') {
              this.advance()
              break
            }
            continue
          }
          if (sep.type === 'punctuation' && sep.value === ')') {
            this.advance()
            break
          }
          this.error("expected ',' or ')'", sep.span)
          this.syncTo(')')
          const maybeClose = this.peek()
          if (maybeClose.type === 'punctuation' && maybeClose.value === ')') {
            this.advance()
          }
          break
        }
        const endToken = this.previous()
        const span = spanFrom(current.span, endToken.span)
        const node: CallExpr = { type: 'CallExpr', callee: current, args, span }
        current = node
        continue
      }

      break
    }
    return current
  }

  private parsePrimary(): Expr {
    const token = this.peek()

    if (token.type === 'number') {
      this.advance()
      const node: Literal = {
        type: 'Literal',
        kind: 'number',
        value: token.value,
        span: token.span,
      }
      return node
    }

    if (token.type === 'string') {
      this.advance()
      const node: Literal = {
        type: 'Literal',
        kind: 'string',
        value: token.value,
        span: token.span,
      }
      return node
    }

    if (token.type === 'boolean') {
      this.advance()
      const node: Literal = {
        type: 'Literal',
        kind: 'boolean',
        value: token.value,
        span: token.span,
      }
      return node
    }

    if (token.type === 'null') {
      this.advance()
      const node: Literal = { type: 'Literal', kind: 'null', value: null, span: token.span }
      return node
    }

    if (token.type === 'regex') {
      this.advance()
      const node: Literal = {
        type: 'Literal',
        kind: 'regex',
        value: token.pattern,
        flags: token.flags,
        span: token.span,
      }
      return node
    }

    if (token.type === 'identifier') {
      this.advance()
      const node: Identifier = { type: 'Identifier', name: token.value, span: token.span }
      return node
    }

    if (token.type === 'this') {
      this.advance()
      const node: Identifier = { type: 'Identifier', name: 'this', span: token.span }
      return node
    }

    if (token.type === 'punctuation' && token.value === '(') {
      this.advance()
      const expr = this.parseExpression(0)
      const closeToken = this.peek()
      if (closeToken.type === 'punctuation' && closeToken.value === ')') {
        this.advance()
      } else {
        this.error("expected ')'", closeToken.span)
        this.syncTo(')')
        const maybeClose = this.peek()
        if (maybeClose.type === 'punctuation' && maybeClose.value === ')') {
          this.advance()
        }
      }
      return expr
    }

    if (token.type === 'punctuation' && token.value === '[') {
      return this.parseList()
    }

    this.error('unexpected token', token.span)
    this.advance()
    const node: ErrorExpr = { type: 'ErrorExpr', message: 'unexpected token', span: token.span }
    return node
  }

  private parseList(): Expr {
    const startToken = this.peek()
    this.advance()
    const elements: Expr[] = []
    while (this.peek().type !== 'eof') {
      const next = this.peek()
      if (next.type === 'punctuation' && next.value === ']') {
        this.advance()
        const span = spanFrom(startToken.span, next.span)
        const node: ListExpr = { type: 'ListExpr', elements, span }
        return node
      }
      const element = this.parseExpression(0)
      elements.push(element)
      const sep = this.peek()
      if (sep.type === 'punctuation' && sep.value === ',') {
        this.advance()
        const maybeClose = this.peek()
        if (maybeClose.type === 'punctuation' && maybeClose.value === ']') {
          this.advance()
          const span = spanFrom(startToken.span, maybeClose.span)
          const node: ListExpr = { type: 'ListExpr', elements, span }
          return node
        }
        continue
      }
      if (sep.type === 'punctuation' && sep.value === ']') {
        this.advance()
        const span = spanFrom(startToken.span, sep.span)
        const node: ListExpr = { type: 'ListExpr', elements, span }
        return node
      }
      this.error("expected ',' or ']'", sep.span)
      this.syncTo(']')
      const maybeClose = this.peek()
      if (maybeClose.type === 'punctuation' && maybeClose.value === ']') {
        const endToken = maybeClose
        this.advance()
        const span = spanFrom(startToken.span, endToken.span)
        const node: ListExpr = { type: 'ListExpr', elements, span }
        return node
      }
      break
    }
    const endToken = this.previous()
    const span = spanFrom(startToken.span, endToken.span)
    return { type: 'ListExpr', elements, span }
  }

  private error(message: string, span: Token['span']) {
    this.diagnostics.push({ kind: 'parse', message, span })
  }

  private syncTo(value: ')' | ']') {
    while (this.peek().type !== 'eof') {
      const token = this.peek()
      if (token.type === 'punctuation' && token.value === value) {
        return
      }
      this.advance()
    }
  }

  private peek(): Token {
    return this.tokens[this.index]
  }

  private previous(): Token {
    return this.tokens[Math.max(0, this.index - 1)]
  }

  private advance(): Token {
    const token = this.tokens[this.index]
    if (this.index < this.tokens.length - 1) this.index += 1
    return token
  }
}
