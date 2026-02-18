import { Position, Span } from './ast'
import { Diagnostic } from './errors'
import {
  Operator,
  Punctuation,
  Token,
  StringToken,
  RegexToken,
  NumberToken,
  BooleanToken,
  NullToken,
  ThisToken,
  IdentifierToken,
  OperatorToken,
  PunctuationToken,
  EofToken,
} from './tokens'

type LexResult = { tokens: Token[]; diagnostics: Diagnostic[] }

const operatorTokens: Operator[] = [
  '==',
  '!=',
  '>=',
  '<=',
  '&&',
  '||',
  '+',
  '-',
  '*',
  '/',
  '%',
  '!',
  '>',
  '<',
]

const punctuationTokens: Punctuation[] = ['.', ',', '(', ')', '[', ']']

const isOperator = (value: string): value is Operator =>
  operatorTokens.some(token => token === value)

const isPunctuation = (value: string): value is Punctuation =>
  punctuationTokens.some(token => token === value)

export function lex(input: string, file?: string): LexResult {
  const tokens: Token[] = []
  const diagnostics: Diagnostic[] = []
  let index = 0
  let line = 1
  let column = 1
  let canStartRegex = true

  const makePosition = (offset: number, lineValue: number, columnValue: number): Position => ({
    offset,
    line: lineValue,
    column: columnValue,
  })

  const currentPosition = (): Position => makePosition(index, line, column)

  const makeSpan = (start: Position, end: Position): Span => ({ start, end, file })

  const advance = (): string => {
    const ch = input[index]
    index += 1
    if (ch === '\n') {
      line += 1
      column = 1
    } else {
      column += 1
    }
    return ch
  }

  const peek = (offset = 0): string => input[index + offset] ?? ''

  const addDiagnostic = (message: string, span: Span) => {
    diagnostics.push({ kind: 'lex', message, span })
  }

  const updateRegexState = (token: Token | null) => {
    if (!token) {
      canStartRegex = true
      return
    }
    if (token.type === 'operator') {
      canStartRegex = true
      return
    }
    if (token.type === 'punctuation') {
      canStartRegex = token.value === '(' || token.value === '[' || token.value === ','
      return
    }
    canStartRegex = false
  }

  const isWhitespace = (ch: string) => ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r'
  const isDigit = (ch: string) => ch >= '0' && ch <= '9'
  const isIdentStart = (ch: string) =>
    (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch === '_'
  const isIdentContinue = (ch: string) => isIdentStart(ch) || isDigit(ch)

  while (index < input.length) {
    const ch = peek()

    if (isWhitespace(ch)) {
      advance()
      continue
    }

    const start = currentPosition()

    if (ch === '=' && peek(1) !== '=') {
      let offset = 1
      while (isWhitespace(peek(offset))) {
        offset += 1
      }
      if (peek(offset) === '>') {
        advance()
        for (let step = 1; step < offset; step += 1) {
          advance()
        }
        if (peek() === '>') {
          advance()
        }
        const end = currentPosition()
        addDiagnostic(
          'arrow functions are not supported, use list.filter(expression)',
          makeSpan(start, end),
        )
        continue
      }
    }

    if (ch === '"' || ch === "'") {
      const quote = advance()
      let value = ''
      let closed = false

      while (index < input.length) {
        const curr = advance()
        if (curr === quote) {
          closed = true
          break
        }
        if (curr === '\\') {
          const next = advance()
          if (next === 'n') value += '\n'
          else if (next === 't') value += '\t'
          else if (next === 'r') value += '\r'
          else if (next === '\\' || next === "'" || next === '"') value += next
          else value += next
        } else {
          value += curr
        }
      }

      const end = currentPosition()
      const span = makeSpan(start, end)
      if (!closed) addDiagnostic('unterminated string literal', span)
      const token: StringToken = { type: 'string', value, span }
      tokens.push(token)
      updateRegexState(token)
      continue
    }

    if (ch === '/' && canStartRegex) {
      const next = peek(1)
      if (next !== '/' && next !== '') {
        advance()
        let pattern = ''
        let closed = false
        let inClass = false
        while (index < input.length) {
          const curr = advance()
          if (curr === '\\' && index < input.length) {
            const escaped = advance()
            pattern += `\\${escaped}`
            continue
          }
          if (curr === '[' && !inClass) inClass = true
          if (curr === ']' && inClass) inClass = false
          if (curr === '/' && !inClass) {
            closed = true
            break
          }
          pattern += curr
        }
        let flags = ''
        while (index < input.length) {
          const flag = peek()
          if (!/^[gimsuy]$/.test(flag)) break
          flags += advance()
        }
        const end = currentPosition()
        const span = makeSpan(start, end)
        if (!closed) addDiagnostic('unterminated regex literal', span)
        const token: RegexToken = { type: 'regex', pattern, flags, span }
        tokens.push(token)
        updateRegexState(token)
        continue
      }
    }

    if (isDigit(ch)) {
      let num = ''
      while (index < input.length && isDigit(peek())) {
        num += advance()
      }
      if (peek() === '.' && isDigit(peek(1))) {
        num += advance()
        while (index < input.length && isDigit(peek())) {
          num += advance()
        }
      }
      const end = currentPosition()
      const span = makeSpan(start, end)
      const token: NumberToken = { type: 'number', value: Number(num), span }
      tokens.push(token)
      updateRegexState(token)
      continue
    }

    if (isIdentStart(ch)) {
      let ident = ''
      while (index < input.length && isIdentContinue(peek())) {
        ident += advance()
      }
      const end = currentPosition()
      const span = makeSpan(start, end)
      if (ident === 'true' || ident === 'false') {
        const token: BooleanToken = { type: 'boolean', value: ident === 'true', span }
        tokens.push(token)
        updateRegexState(token)
        continue
      }
      if (ident === 'null') {
        const token: NullToken = { type: 'null', span }
        tokens.push(token)
        updateRegexState(token)
        continue
      }
      if (ident === 'this') {
        const token: ThisToken = { type: 'this', span }
        tokens.push(token)
        updateRegexState(token)
        continue
      }
      const token: IdentifierToken = { type: 'identifier', value: ident, span }
      tokens.push(token)
      updateRegexState(token)
      continue
    }

    const twoChar = ch + peek(1)
    if (isOperator(twoChar)) {
      advance()
      advance()
      const end = currentPosition()
      const span = makeSpan(start, end)
      const token: OperatorToken = { type: 'operator', value: twoChar, span }
      tokens.push(token)
      updateRegexState(token)
      continue
    }

    if (isOperator(ch)) {
      advance()
      const end = currentPosition()
      const span = makeSpan(start, end)
      const token: OperatorToken = { type: 'operator', value: ch, span }
      tokens.push(token)
      updateRegexState(token)
      continue
    }

    if (isPunctuation(ch)) {
      advance()
      const end = currentPosition()
      const span = makeSpan(start, end)
      const token: PunctuationToken = { type: 'punctuation', value: ch, span }
      tokens.push(token)
      updateRegexState(token)
      continue
    }

    advance()
    const end = currentPosition()
    addDiagnostic(`unexpected character: ${ch}`, makeSpan(start, end))
  }

  const eofPos = currentPosition()
  const eofSpan = makeSpan(eofPos, eofPos)
  const eofToken: EofToken = { type: 'eof', span: eofSpan }
  tokens.push(eofToken)
  updateRegexState(eofToken)

  return { tokens, diagnostics }
}
