import test from "node:test"
import assert from "node:assert/strict"
import {
  BASE,
  PRESETS,
  field,
  jacobian,
  spectrum,
  nInf,
  branch,
  equilibria,
  equilibriumCurrent,
  currentSlope,
  linearFlow,
  integrate,
  manifolds,
} from "../static/js/morris-lecar-math.js"

const close = (a, b, tolerance = 1e-7) =>
  assert.ok(Math.abs(a - b) < tolerance, `${a} differs from ${b}`)

test("analytic Jacobian agrees with central differences off and on equilibrium", () => {
  for (const p of Object.values(PRESETS)) {
    for (const x of [
      [-60, 0.02],
      [-25, 0.14],
      [10, 0.6],
      [-30, nInf(-30, p)],
    ]) {
      const J = jacobian(x, p)
      for (let column = 0; column < 2; column++) {
        const h = column === 0 ? 1e-4 : 1e-6
        const plus = [...x],
          minus = [...x]
        plus[column] += h
        minus[column] -= h
        const fp = field(plus, p),
          fm = field(minus, p)
        for (let row = 0; row < 2; row++) close(J[row][column], (fp[row] - fm[row]) / (2 * h), 1e-7)
      }
    }
  }
})

test("equilibrium continuation retains all three branches and the double root at a fold", () => {
  const p = PRESETS.saddle,
    b = branch(p)
  const fold = b.events.find((e) => e.kind === "Fold" && e.I > 0)
  close(fold.I, 39.96315309, 1e-7)
  close(fold.det, 0, 1e-10)
  assert.equal(equilibria({ ...p, I: fold.I - 0.001 }, b.folds).length, 3)
  assert.equal(equilibria({ ...p, I: fold.I }, b.folds).length, 2)
  assert.equal(equilibria({ ...p, I: fold.I + 0.001 }, b.folds).length, 1)
  for (const I of [-15, 0, 30, fold.I, 40, 80]) {
    for (const e of equilibria({ ...p, I }, b.folds)) {
      close(field(e.point, { ...p, I })[0], 0, 1e-8)
      close(field(e.point, { ...p, I })[1], 0, 1e-12)
    }
  }
})

test("current derivative and determinant encode the same fold", () => {
  for (const p of Object.values(PRESETS)) {
    for (const v of [-70, -40, -25, 0, 20]) {
      close(
        currentSlope(v, p),
        (equilibriumCurrent(v + 1e-4, p) - equilibriumCurrent(v - 1e-4, p)) / 2e-4,
        1e-6,
      )
      const J = jacobian([v, nInf(v, p)], p)
      close(spectrum(J).det, (-J[1][1] * currentSlope(v, p)) / p.C, 1e-10)
    }
  }
})

test("Hopf has nonzero imaginary eigenvalues and changes stability across current", () => {
  const b = branch(BASE),
    hopf = b.events.find((e) => e.kind === "Hopf")
  close(hopf.I, 93.85761837, 1e-7)
  close(hopf.trace, 0, 1e-10)
  assert.ok(hopf.det > 0 && hopf.omega > 0)
  assert.equal(hopf.type, "Nonhyperbolic")
  const before = equilibria({ ...BASE, I: hopf.I - 0.01 }, b.folds)[0]
  const after = equilibria({ ...BASE, I: hopf.I + 0.01 }, b.folds)[0]
  assert.equal(before.type, "Stable focus")
  assert.equal(after.type, "Unstable focus")
  assert.ok(before.omega > 0 && after.omega > 0)
  assert.ok(Math.abs((after.alpha - before.alpha) / 0.02) > 1e-4)
})

test("real-to-complex transitions do not change stability", () => {
  const b = branch(BASE)
  const event = b.events.find((e) => e.kind === "Node–focus" && e.I > 0)
  const before = equilibria({ ...BASE, I: event.I - 0.01 }, b.folds)[0]
  const after = equilibria({ ...BASE, I: event.I + 0.01 }, b.folds)[0]
  assert.ok(before.disc * after.disc < 0)
  assert.equal(before.type.split(" ")[0], after.type.split(" ")[0])
})

test("matrix exponential handles a spiral, saddle, and repeated eigenvalue", () => {
  const cases = [
    {
      J: [
        [-0.1, -0.2],
        [0.2, -0.1],
      ],
      expected: [Math.exp(-1) * Math.cos(2), Math.exp(-1) * Math.sin(2)],
    },
    {
      J: [
        [0.1, 0],
        [0, -0.2],
      ],
      expected: [Math.exp(1), 0],
    },
    {
      J: [
        [0, 0],
        [1, 0],
      ],
      expected: [1, 10],
    },
  ]
  for (const { J, expected } of cases)
    linearFlow(J, [1, 0], 10).forEach((x, i) => close(x, expected[i], 1e-10))
})

test("linearization error decreases quadratically with perturbation size", () => {
  const e = equilibria(BASE)[0]
  const error = (amplitude) => {
    const end = integrate((x) => field(x, BASE), [e.point[0] + amplitude, e.point[1]], 10).data.at(
      -1,
    ).x
    const linear = linearFlow(e.J, [amplitude, 0], 10)
    return Math.abs(end[0] - e.point[0] - linear[0])
  }
  const ratio = error(0.02) / error(0.01)
  assert.ok(ratio > 3.9 && ratio < 4.1)
})

test("RK4 converges and stops at bounds without clamping state", () => {
  const run = (dt) => integrate((x) => field(x, BASE), [-10, 0.1], 80, dt).data.at(-1).x
  const coarse = run(0.1),
    fine = run(0.05),
    reference = run(0.025)
  assert.ok(Math.abs(fine[0] - reference[0]) < 1e-5)
  assert.ok(Math.abs(fine[0] - reference[0]) < Math.abs(coarse[0] - reference[0]))
  const path = integrate(
    () => [1, 0],
    [0, 0],
    10,
    0.05,
    (x) => x[0] > 2,
  )
  assert.ok(path.stopped)
  assert.ok(path.data.at(-1).x[0] <= 2)
})

test("saddle eigenvectors satisfy Jv = λv and both manifold pairs follow the field", () => {
  const p = PRESETS.saddle,
    e = equilibria(p).find((e) => e.type === "Saddle")
  for (const { lambda, v } of e.vectors) {
    for (let i = 0; i < 2; i++) close(e.J[i][0] * v[0] + e.J[i][1] * v[1], lambda * v[i], 1e-9)
  }
  const paths = manifolds(e, p)
  assert.equal(paths.length, 4)
  assert.equal(paths.filter((p) => p.stable).length, 2)
  for (const path of paths) {
    assert.ok(path.data.length > 20)
    const a = path.data[5],
      b = path.data[6],
      f = field(a.x, p)
    assert.ok((b.x[0] - a.x[0]) * f[0] + (b.x[1] - a.x[1]) * f[1] > 0 === !path.stable)
  }
})

test("stiff stable flow stays finite and the exposed parameter extremes retain a root", () => {
  const flow = linearFlow(
    [
      [-3, 0],
      [0, -0.01],
    ],
    [1, 1],
    1000,
  )
  close(flow[0], 0, 1e-10)
  close(flow[1], Math.exp(-10), 1e-10)
  const p = { ...BASE, gCa: 8, gK: 1, gL: 0.5, ECa: 150, I: 250 }
  const eq = equilibria(p)
  assert.ok(eq.some((e) => e.point[0] > 100))
  eq.forEach((e) => close(field(e.point, p)[0], 0, 1e-8))
})
