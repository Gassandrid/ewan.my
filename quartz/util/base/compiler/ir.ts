import { BinaryExpr, Expr, Literal, Span, UnaryExpr } from './ast'

export type JumpInstruction = {
  op: 'jump' | 'jump_if_false' | 'jump_if_true'
  target: number
  span: Span
}

export type Instruction =
  | { op: 'const'; literal: Literal; span: Span }
  | { op: 'ident'; name: string; span: Span }
  | { op: 'load_formula'; name: string; span: Span }
  | { op: 'load_formula_index'; span: Span }
  | { op: 'member'; property: string; span: Span }
  | { op: 'index'; span: Span }
  | { op: 'list'; count: number; span: Span }
  | { op: 'unary'; operator: UnaryExpr['operator']; span: Span }
  | { op: 'binary'; operator: BinaryExpr['operator']; span: Span }
  | { op: 'to_bool'; span: Span }
  | { op: 'call_global'; name: string; argc: number; span: Span }
  | { op: 'call_method'; name: string; argc: number; span: Span }
  | { op: 'call_dynamic'; span: Span }
  | { op: 'filter'; program: ProgramIR | null; span: Span }
  | { op: 'map'; program: ProgramIR | null; span: Span }
  | { op: 'reduce'; program: ProgramIR | null; initial: ProgramIR | null; span: Span }
  | JumpInstruction

export type ProgramIR = { instructions: Instruction[]; span: Span }

const compileExpr = (expr: Expr, out: Instruction[]) => {
  switch (expr.type) {
    case 'Literal':
      out.push({ op: 'const', literal: expr, span: expr.span })
      return
    case 'Identifier':
      out.push({ op: 'ident', name: expr.name, span: expr.span })
      return
    case 'UnaryExpr':
      compileExpr(expr.argument, out)
      out.push({ op: 'unary', operator: expr.operator, span: expr.span })
      return
    case 'BinaryExpr':
      compileExpr(expr.left, out)
      compileExpr(expr.right, out)
      out.push({ op: 'binary', operator: expr.operator, span: expr.span })
      return
    case 'LogicalExpr': {
      if (expr.operator === '&&') {
        compileExpr(expr.left, out)
        const jumpFalse: JumpInstruction = { op: 'jump_if_false', target: -1, span: expr.span }
        out.push(jumpFalse)
        compileExpr(expr.right, out)
        out.push({ op: 'to_bool', span: expr.span })
        const jumpEnd: JumpInstruction = { op: 'jump', target: -1, span: expr.span }
        out.push(jumpEnd)
        const falseTarget = out.length
        jumpFalse.target = falseTarget
        out.push({
          op: 'const',
          literal: { type: 'Literal', kind: 'boolean', value: false, span: expr.span },
          span: expr.span,
        })
        jumpEnd.target = out.length
        return
      }
      compileExpr(expr.left, out)
      const jumpTrue: JumpInstruction = { op: 'jump_if_true', target: -1, span: expr.span }
      out.push(jumpTrue)
      compileExpr(expr.right, out)
      out.push({ op: 'to_bool', span: expr.span })
      const jumpEnd: JumpInstruction = { op: 'jump', target: -1, span: expr.span }
      out.push(jumpEnd)
      const trueTarget = out.length
      jumpTrue.target = trueTarget
      out.push({
        op: 'const',
        literal: { type: 'Literal', kind: 'boolean', value: true, span: expr.span },
        span: expr.span,
      })
      jumpEnd.target = out.length
      return
    }
    case 'MemberExpr':
      if (expr.object.type === 'Identifier' && expr.object.name === 'formula') {
        out.push({ op: 'load_formula', name: expr.property, span: expr.span })
        return
      }
      compileExpr(expr.object, out)
      out.push({ op: 'member', property: expr.property, span: expr.span })
      return
    case 'IndexExpr':
      if (expr.object.type === 'Identifier' && expr.object.name === 'formula') {
        compileExpr(expr.index, out)
        out.push({ op: 'load_formula_index', span: expr.span })
        return
      }
      compileExpr(expr.object, out)
      compileExpr(expr.index, out)
      out.push({ op: 'index', span: expr.span })
      return
    case 'ListExpr':
      for (const element of expr.elements) {
        compileExpr(element, out)
      }
      out.push({ op: 'list', count: expr.elements.length, span: expr.span })
      return
    case 'CallExpr': {
      if (expr.callee.type === 'Identifier') {
        for (const arg of expr.args) {
          compileExpr(arg, out)
        }
        out.push({
          op: 'call_global',
          name: expr.callee.name,
          argc: expr.args.length,
          span: expr.span,
        })
        return
      }
      if (expr.callee.type === 'MemberExpr') {
        const method = expr.callee.property
        if (method === 'filter' || method === 'map' || method === 'reduce') {
          compileExpr(expr.callee.object, out)
          const exprArg = expr.args[0]
          const program = exprArg ? compileExpression(exprArg) : null
          if (method === 'filter') {
            out.push({ op: 'filter', program, span: expr.span })
            return
          }
          if (method === 'map') {
            out.push({ op: 'map', program, span: expr.span })
            return
          }
          const initialArg = expr.args[1]
          const initial = initialArg ? compileExpression(initialArg) : null
          out.push({ op: 'reduce', program, initial, span: expr.span })
          return
        }
        compileExpr(expr.callee.object, out)
        for (const arg of expr.args) {
          compileExpr(arg, out)
        }
        out.push({ op: 'call_method', name: method, argc: expr.args.length, span: expr.span })
        return
      }
      compileExpr(expr.callee, out)
      out.push({ op: 'call_dynamic', span: expr.span })
      return
    }
    case 'ErrorExpr':
      out.push({
        op: 'const',
        literal: { type: 'Literal', kind: 'null', value: null, span: expr.span },
        span: expr.span,
      })
      return
  }
}

export const compileExpression = (expr: Expr): ProgramIR => {
  const instructions: Instruction[] = []
  compileExpr(expr, instructions)
  return { instructions, span: expr.span }
}
