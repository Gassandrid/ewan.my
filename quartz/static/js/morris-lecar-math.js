// Pure numerical model shared by the browser and regression tests.
// Time: ms; voltage: mV; current: µA/cm²; conductance: mS/cm².
export const BASE = Object.freeze({
  C: 20,
  gCa: 4.4,
  gK: 8,
  gL: 2,
  ECa: 120,
  EK: -84,
  EL: -60,
  V1: -1.2,
  V2: 18,
  V3: 2,
  V4: 30,
  phi: 0.04,
  I: 90,
})

export const PRESETS = {
  hopf: { ...BASE },
  saddle: { ...BASE, gCa: 4, V3: 12, V4: 17.4, phi: 0.0667, I: 30 },
}

export const activation = (v, midpoint, width) => 0.5 * (1 + Math.tanh((v - midpoint) / width))
export const slope = (v, midpoint, width) => 0.5 / width / Math.cosh((v - midpoint) / width) ** 2
export const nInf = (v, p) => activation(v, p.V3, p.V4)
export const rate = (v, p) => p.phi * Math.cosh((v - p.V3) / (2 * p.V4))

export function field([v, n], p) {
  const m = activation(v, p.V1, p.V2)
  return [
    (p.I - p.gCa * m * (v - p.ECa) - p.gK * n * (v - p.EK) - p.gL * (v - p.EL)) / p.C,
    rate(v, p) * (nInf(v, p) - n),
  ]
}

export function jacobian([v, n], p) {
  const m = activation(v, p.V1, p.V2)
  const q = rate(v, p)
  const dq = (p.phi * Math.sinh((v - p.V3) / (2 * p.V4))) / (2 * p.V4)
  return [
    [
      (p.gCa * (slope(v, p.V1, p.V2) * (p.ECa - v) - m) - p.gK * n - p.gL) / p.C,
      (p.gK * (p.EK - v)) / p.C,
    ],
    [q * slope(v, p.V3, p.V4) + dq * (nInf(v, p) - n), -q],
  ]
}

export function spectrum(J) {
  const [[a, b], [c, d]] = J
  const trace = a + d
  const det = a * d - b * c
  const disc = trace * trace - 4 * det
  const alpha = trace / 2
  const omega = Math.sqrt(Math.max(0, -disc)) / 2
  const root = Math.sqrt(Math.max(0, disc)) / 2
  const values =
    disc < 0
      ? [
          [alpha, omega],
          [alpha, -omega],
        ]
      : [
          [alpha + root, 0],
          [alpha - root, 0],
        ]
  // Tolerance identifies a numerically resolved boundary, not a nonlinear center.
  const neutral = values.some(([re]) => Math.abs(re) < 1e-8)
  const type = neutral
    ? "Nonhyperbolic"
    : det < 0
      ? "Saddle"
      : `${trace < 0 ? "Stable" : "Unstable"} ${disc < 0 ? "focus" : "node"}`
  const vectors =
    disc >= 0
      ? values.map(([lambda]) => {
          let v =
            Math.hypot(b, lambda - a) > Math.hypot(lambda - d, c)
              ? [b, lambda - a]
              : [lambda - d, c]
          const norm = Math.hypot(v[0] / 20, v[1] / 0.2)
          v = norm > 1e-14 ? v.map((x) => x / norm) : [20, 0]
          return { lambda, v }
        })
      : []
  return { trace, det, disc, alpha, omega, values, vectors, type }
}

// Parameterize the entire equilibrium branch by V, including its folds.
export function equilibriumCurrent(v, p) {
  return (
    p.gCa * activation(v, p.V1, p.V2) * (v - p.ECa) +
    p.gK * nInf(v, p) * (v - p.EK) +
    p.gL * (v - p.EL)
  )
}

export function currentSlope(v, p) {
  const J = jacobian([v, nInf(v, p)], p)
  return -p.C * (J[0][0] + J[0][1] * slope(v, p.V3, p.V4))
}

export function bisect(fn, a, b) {
  let fa = fn(a)
  if (Math.abs(fa) < 1e-12) return a
  if (Math.abs(fn(b)) < 1e-12) return b
  for (let k = 0; k < 60; k++) {
    const m = (a + b) / 2
    const fm = fn(m)
    if (fa * fm <= 0) b = m
    else {
      a = m
      fa = fm
    }
  }
  return (a + b) / 2
}

function crossings(fn, lo = -160, hi = 200, step = 0.25) {
  const result = []
  for (let a = lo; a < hi; a += step) {
    const b = Math.min(hi, a + step)
    if (fn(a) * fn(b) < 0 || Math.abs(fn(a)) < 1e-12) {
      const root = bisect(fn, a, b)
      if (!result.some((x) => Math.abs(x - root) < 1e-6)) result.push(root)
    }
  }
  return result
}

export function analyze(v, p) {
  const point = [v, nInf(v, p)]
  const J = jacobian(point, p)
  return { point, J, I: equilibriumCurrent(v, p), ...spectrum(J) }
}

export function branch(p) {
  const folds = crossings((v) => currentSlope(v, p))
  const hops = crossings((v) => analyze(v, p).trace).filter((v) => analyze(v, p).det > 1e-8)
  const nodes = crossings((v) => analyze(v, p).disc).filter((v) => analyze(v, p).det > 0)
  const events = [
    ...folds.map((v) => ({ kind: "Fold", ...analyze(v, p) })),
    ...hops.map((v) => ({ kind: "Hopf", ...analyze(v, p) })),
    ...nodes.map((v) => ({ kind: "Node–focus", ...analyze(v, p) })),
  ].sort((a, b) => a.I - b.I)
  const voltages = Array.from({ length: 1441 }, (_, i) => -160 + i / 4)
  voltages.push(...events.map((e) => e.point[0]))
  voltages.sort((a, b) => a - b)
  return { folds, events, samples: voltages.map((v) => analyze(v, p)) }
}

export function equilibria(p, folds = branch(p).folds) {
  const edges = [-160, ...folds, 200]
  const roots = []
  const f = (v) => equilibriumCurrent(v, p) - p.I
  const add = (v) => {
    if (!roots.some((r) => Math.abs(v - r) < 1e-5)) roots.push(v)
  }
  for (const v of edges) if (Math.abs(f(v)) < 1e-8) add(v)
  for (let i = 0; i < edges.length - 1; i++) {
    if (f(edges[i]) * f(edges[i + 1]) < 0) add(bisect(f, edges[i], edges[i + 1]))
  }
  return roots.sort((a, b) => a - b).map((v) => analyze(v, p))
}

export function rk4(f, x, dt) {
  const k1 = f(x)
  const k2 = f(x.map((v, i) => v + (dt * k1[i]) / 2))
  const k3 = f(x.map((v, i) => v + (dt * k2[i]) / 2))
  const k4 = f(x.map((v, i) => v + dt * k3[i]))
  return x.map((v, i) => v + (dt * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i])) / 6)
}

export function integrate(
  f,
  initial,
  duration = 600,
  dt = 0.05,
  stop = (x) => Math.abs(x[0]) > 200 || Math.abs(x[1]) > 3,
) {
  let x = [...initial]
  const data = [{ t: 0, x }]
  const every = Math.max(1, Math.round(0.5 / Math.abs(dt)))
  let stopped = false
  const steps = Math.ceil(duration / Math.abs(dt))
  for (let i = 1; i <= steps; i++) {
    x = rk4(f, x, dt)
    if (!x.every(Number.isFinite) || stop(x)) {
      stopped = true
      break
    }
    if (i % every === 0 || i === steps) data.push({ t: i * dt, x })
  }
  return { data, stopped }
}

// exp(Jt)x via Cayley–Hamilton; works at repeated eigenvalues as well.
export function linearFlow(J, x, t) {
  const { alpha, disc } = spectrum(J)
  const q = Math.sqrt(Math.abs(disc)) / 2
  const factor = Math.exp(alpha * t)
  let c, s
  if (disc >= 0 && q > 1e-10) {
    // Avoid 0 * Infinity for a stiff stable node at long times.
    const plus = Math.exp((alpha + q) * t)
    const minus = Math.exp((alpha - q) * t)
    c = (plus + minus) / 2
    s = (plus - minus) / (2 * q)
  } else {
    c = factor * Math.cos(q * t)
    s = factor * (q < 1e-10 ? t : Math.sin(q * t) / q)
  }
  return [0, 1].map((i) => c * x[i] + s * ((J[i][i] - alpha) * x[i] + J[i][1 - i] * x[1 - i]))
}

export function manifolds(eq, p) {
  if (eq.type !== "Saddle") return []
  return eq.vectors.flatMap(({ lambda, v }) =>
    [-1, 1].map((sign) => {
      const initial = eq.point.map((x, i) => x + sign * 1e-5 * v[i])
      const stable = lambda < 0
      const result = integrate(
        (x) => field(x, p),
        initial,
        1800,
        stable ? -0.05 : 0.05,
        (x) => x[0] < -110 || x[0] > 80 || x[1] < -0.06 || x[1] > 1.06,
      )
      return { stable, ...result }
    }),
  )
}
