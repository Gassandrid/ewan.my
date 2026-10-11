import assert from "node:assert/strict"
import test from "node:test"
import vm from "node:vm"
import { EigencellsBanner } from "./ewan-eigencells/components.js"
import { eigencells } from "./ewan-eigencells/eigencells.js"
import { POOL } from "./ewan-eigencells/pool.js"

test("cell spectra match numpy eigenvalues", () => {
  // random_template(8) with t1 = 1, t2 = exp(0.7i); numpy.linalg.eigvals, sorted by real part
  const expected = [
    [-0.56796, -0.23315],
    [-0.20491, -1.21585],
    [-0.0497, -0.01895],
    [0.10733, -0.65981],
    [0.20684, 1.00529],
    [1.70838, 0.12247],
  ]
  const tpl = "j00f00jjjf00ii0b00iifaf00000fffi00ii"
  const draws = [0, 0.7 / (2 * Math.PI) + 0.6, 0]
  let k = 0
  const out = new Float64Array(12)
  eigencells([tpl])
    .solver(tpl, 0.2, 1, 1, () => draws[k++] ?? 0)
    .sweeps(1, 1, out, 0)
  const roots = [0, 1, 2, 3, 4, 5]
    .map((i) => [out[2 * i], out[2 * i + 1]])
    .sort((a, b) => a[0] - b[0])
  roots.forEach(([re, im], i) => {
    assert.ok(
      Math.abs(re - expected[i][0]) < 1e-4 && Math.abs(im - expected[i][1]) < 1e-4,
      `root ${i}`,
    )
  })
})

test("a culture is reproducible, fits the strip, and its cells never overlap", () => {
  const E = eigencells(POOL)
  const w = 644,
    h = 100,
    aspect = w / h
  const grow = (seed) => [...E.culture(seed, aspect, { small: 0.11 }).cells].filter(Boolean)
  for (const seed of [1, 2, 3]) {
    const cells = grow(seed)
    assert.ok(cells.length >= 6, `seed ${seed} grew ${cells.length} cells`)
    assert.deepEqual(
      grow(seed).map((c) => [c.tpl, c.cx, c.cy, c.s]),
      cells.map((c) => [c.tpl, c.cx, c.cy, c.s]),
    )
    const owner = new Int16Array(w * h).fill(-1)
    let shared = 0,
      edge = 0
    cells.forEach((cell, i) => {
      const buf = new Float32Array(w * h)
      E.develop(cell, buf, w, h, 2)
      for (let p = 0; p < w * h; p++) {
        if (!buf[p]) continue
        if (owner[p] >= 0 && owner[p] !== i) shared++
        owner[p] = i
        const x = p % w,
          y = (p - x) / w
        if (x === 0 || y === 0 || x === w - 1 || y === h - 1) edge++
      }
    })
    assert.equal(shared, 0, `seed ${seed}: overlapping cells`)
    assert.equal(edge, 0, `seed ${seed}: cells touch the strip edge`)
  }
})

test("banner component embeds a runnable runtime with the curated pool", () => {
  const component = EigencellsBanner()
  assert.equal(component(), null)
  assert.match(component.beforeDOMLoaded, /classList\.add\("eigencells"\)/)
  assert.ok(POOL.length > 100 && POOL.every((t) => /^[0ijfab]{36}$/.test(t)))
  assert.doesNotThrow(() => new vm.Script(component.afterDOMLoaded))
  assert.ok(component.afterDOMLoaded.includes(POOL[0]))
})
