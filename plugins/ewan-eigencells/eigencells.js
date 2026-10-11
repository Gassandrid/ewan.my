// Eigencells: a population of Conradi Eigenfish packed into a banner strip.
//
// Each cell is one Eigenfish (Simone Conradi, MIT): a 6x6 matrix with entries
// from {0, i, -i, x} and two free entries t1, t2 sampled on the torus |t| = r.
// The browser varies a curated template inside a window that was checked
// offline (cheese/scan_cells.py): torus radii r1, r2 and the morph value x
// that replaces Conradi's 0.2 entries (his notebook's x-sweep). A cheap pilot
// check rejects any draw that splits into satellites or loses its holes.
//
// det(zI - A) is affine in each entry, so the characteristic polynomial is
// P00 + t1 P10 + t2 P01 + t1 t2 P11. Four Faddeev-LeVerrier runs per cell, then
// every sample is a degree-6 root solve, warm-started along continuous sweeps
// of arg t2 (Aberth-Ehrlich). Cells are placed by testing their filled
// silhouettes against an occupancy grid, so they fit the strip and each other.
//
// Self-contained on purpose: the site embeds this function via toString().
// All of it is generative; no measured data is involved.
function eigencells(POOL) {
  const N = 6,
    TAU = Math.PI * 2

  function rng(seed) {
    let a = seed >>> 0
    return () => {
      a = (a + 0x6d2b79f5) >>> 0
      let t = a
      t = Math.imul(t ^ (t >>> 15), t | 1)
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
  }

  // ---------------------------------------------------------------- spectra

  // Characteristic polynomial det(zI - A) by Faddeev-LeVerrier; c[k] is z^k.
  function charpoly(ar, ai) {
    let mr = new Float64Array(N * N),
      mi = new Float64Array(N * N)
    let tr = new Float64Array(N * N),
      ti = new Float64Array(N * N)
    const cr = new Float64Array(N + 1),
      ci = new Float64Array(N + 1)
    cr[N] = 1
    for (let k = 1; k <= N; k++) {
      // M <- A M + c[N-k+1] I
      for (let i = 0; i < N; i++)
        for (let j = 0; j < N; j++) {
          let sr = 0,
            si = 0
          for (let l = 0; l < N; l++) {
            const xr = ar[i * N + l],
              xi = ai[i * N + l],
              yr = mr[l * N + j],
              yi = mi[l * N + j]
            sr += xr * yr - xi * yi
            si += xr * yi + xi * yr
          }
          tr[i * N + j] = sr
          ti[i * N + j] = si
        }
      for (let i = 0; i < N; i++) {
        tr[i * N + i] += cr[N - k + 1]
        ti[i * N + i] += ci[N - k + 1]
      }
      ;[mr, tr] = [tr, mr]
      ;[mi, ti] = [ti, mi]
      // c[N-k] = -trace(A M) / k
      let sr = 0,
        si = 0
      for (let i = 0; i < N; i++)
        for (let l = 0; l < N; l++) {
          const xr = ar[i * N + l],
            xi = ai[i * N + l],
            yr = mr[l * N + i],
            yi = mi[l * N + i]
          sr += xr * yr - xi * yi
          si += xr * yi + xi * yr
        }
      cr[N - k] = -sr / k
      ci[N - k] = -si / k
    }
    return [cr, ci]
  }

  // Template string (36 chars, row-major): 0, i, j (-i), f (morph x), a (t1), b (t2).
  function bases(code, x) {
    const at = (t1, t2) => {
      const ar = new Float64Array(N * N),
        ai = new Float64Array(N * N)
      for (let k = 0; k < N * N; k++) {
        const c = code[k]
        if (c === "i") ai[k] = 1
        else if (c === "j") ai[k] = -1
        else if (c === "f") ar[k] = x
        else if (c === "a") ar[k] = t1
        else if (c === "b") ar[k] = t2
      }
      return charpoly(ar, ai)
    }
    const p00 = at(0, 0),
      p10 = at(1, 0),
      p01 = at(0, 1),
      p11 = at(1, 1)
    const out = new Float64Array(8 * (N + 1))
    for (let k = 0; k <= N; k++)
      for (let q = 0; q < 2; q++) {
        const o = q * 4 * (N + 1)
        out[o + k] = p00[q][k]
        out[o + (N + 1) + k] = p10[q][k] - p00[q][k]
        out[o + 2 * (N + 1) + k] = p01[q][k] - p00[q][k]
        out[o + 3 * (N + 1) + k] = p11[q][k] - p10[q][k] - p01[q][k] + p00[q][k]
      }
    return out
  }

  // A solver bound to one cell: sweeps(n) yields n * 6 eigenvalues.
  function solver(code, x, r1, r2, rand) {
    const B = bases(code, x),
      M = N + 1
    const cr = new Float64Array(M),
      ci = new Float64Array(M),
      zr = new Float64Array(N),
      zi = new Float64Array(N)
    let warm = false

    function coeffs(a1, a2) {
      const t1r = r1 * Math.cos(a1),
        t1i = r1 * Math.sin(a1),
        t2r = r2 * Math.cos(a2),
        t2i = r2 * Math.sin(a2),
        pr = t1r * t2r - t1i * t2i,
        pi = t1r * t2i + t1i * t2r
      for (let k = 0; k < M; k++) {
        const r0 = B[k],
          r10 = B[M + k],
          r01 = B[2 * M + k],
          r11 = B[3 * M + k]
        const i0 = B[4 * M + k],
          i10 = B[5 * M + k],
          i01 = B[6 * M + k],
          i11 = B[7 * M + k]
        cr[k] = r0 + t1r * r10 - t1i * i10 + t2r * r01 - t2i * i01 + pr * r11 - pi * i11
        ci[k] = i0 + t1r * i10 + t1i * r10 + t2r * i01 + t2i * r01 + pr * i11 + pi * r11
      }
    }

    function cold() {
      let R = 0
      for (let k = 0; k < N; k++) R = Math.max(R, Math.pow(Math.hypot(cr[k], ci[k]), 1 / (N - k)))
      R = 1.5 * R + 0.1
      for (let k = 0; k < N; k++) {
        zr[k] = R * Math.cos(0.4 + (TAU * k) / N)
        zi[k] = R * Math.sin(0.4 + (TAU * k) / N)
      }
    }

    // Aberth-Ehrlich, Gauss-Seidel order.
    function solve(limit) {
      for (let it = 0; it < limit; it++) {
        let moved = 0
        for (let i = 0; i < N; i++) {
          const xr = zr[i],
            xi = zi[i]
          let pr = 1,
            pi = 0,
            dr = 0,
            di = 0
          for (let k = N - 1; k >= 0; k--) {
            const ndr = dr * xr - di * xi + pr,
              ndi = dr * xi + di * xr + pi
            dr = ndr
            di = ndi
            const npr = pr * xr - pi * xi + cr[k],
              npi = pr * xi + pi * xr + ci[k]
            pr = npr
            pi = npi
          }
          const dd = dr * dr + di * di || 1e-300
          const wr = (pr * dr + pi * di) / dd,
            wi = (pi * dr - pr * di) / dd
          let sr = 0,
            si = 0
          for (let j = 0; j < N; j++) {
            if (j === i) continue
            const ur = xr - zr[j],
              ui = xi - zi[j],
              uu = ur * ur + ui * ui || 1e-300
            sr += ur / uu
            si -= ui / uu
          }
          const er = 1 - (wr * sr - wi * si),
            ei = -(wr * si + wi * sr),
            ee = er * er + ei * ei || 1e-300
          const stepr = (wr * er + wi * ei) / ee,
            stepi = (wi * er - wr * ei) / ee
          zr[i] = xr - stepr
          zi[i] = xi - stepi
          moved = Math.max(moved, (stepr * stepr + stepi * stepi) / (1 + xr * xr + xi * xi))
        }
        if (moved < 1e-22) return
      }
    }

    // One sweep: arg t1 fixed, arg t2 walked continuously with jittered steps.
    function sweeps(count, steps, out, offset) {
      let o = offset
      for (let s = 0; s < count; s++) {
        const a1 = rand() * TAU
        let a2 = rand() * TAU
        coeffs(a1, a2)
        if (!warm) cold()
        solve(warm ? 25 : 120)
        warm = true
        for (let j = 0; j < steps; j++) {
          a2 += (TAU / steps) * (0.4 + 1.2 * rand())
          coeffs(a1, a2)
          solve(25)
          for (let k = 0; k < N; k++) {
            out[o++] = zr[k]
            out[o++] = zi[k]
          }
        }
      }
      return o
    }
    return { sweeps }
  }

  // ---------------------------------------------------------------- shape

  // Normalise a pilot cloud: centre, unit outer radius, filled silhouette mask.
  const MG = 56
  function shape(pts, count) {
    let mx = 0,
      my = 0
    for (let k = 0; k < count; k++) {
      mx += pts[2 * k]
      my += pts[2 * k + 1]
    }
    mx /= count
    my /= count
    const rs = new Float64Array(count)
    for (let k = 0; k < count; k++) rs[k] = Math.hypot(pts[2 * k] - mx, pts[2 * k + 1] - my)
    const sorted = Float64Array.from(rs).sort()
    const R = sorted[Math.floor(count * 0.997)] * 1.02 || 1
    // occupancy on [-1.15, 1.15]^2
    const occ = new Uint8Array(MG * MG),
      span = 1.15
    let outside = 0
    for (let k = 0; k < count; k++) {
      const u = (pts[2 * k] - mx) / R,
        v = (pts[2 * k + 1] - my) / R
      const gx = Math.floor(((u + span) / (2 * span)) * MG),
        gy = Math.floor(((v + span) / (2 * span)) * MG)
      if (gx < 0 || gy < 0 || gx >= MG || gy >= MG) {
        outside++
        continue
      }
      occ[gy * MG + gx] = 1
    }
    // main component and its holes
    const lab = new Int32Array(MG * MG),
      stack = []
    let best = 0,
      bestSize = 0,
      label = 0
    for (let s = 0; s < MG * MG; s++) {
      if (!occ[s] || lab[s]) continue
      label++
      let size = 0
      stack.push(s)
      lab[s] = label
      while (stack.length) {
        const c = stack.pop()
        size++
        const cx = c % MG,
          cy = (c - cx) / MG
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) {
            const nx = cx + dx,
              ny = cy + dy
            if (nx < 0 || ny < 0 || nx >= MG || ny >= MG) continue
            const n = ny * MG + nx
            if (occ[n] && !lab[n]) {
              lab[n] = label
              stack.push(n)
            }
          }
      }
      if (size > bestSize) {
        bestSize = size
        best = label
      }
    }
    let total = 0
    for (let s = 0; s < MG * MG; s++) if (occ[s]) total++
    // flood the outside through non-main cells; what remains unreached is filled
    const outer = new Uint8Array(MG * MG)
    for (let i = 0; i < MG; i++)
      for (const s of [i, (MG - 1) * MG + i, i * MG, i * MG + MG - 1])
        if (lab[s] !== best && !outer[s]) {
          outer[s] = 1
          stack.push(s)
        }
    while (stack.length) {
      const c = stack.pop(),
        cx = c % MG,
        cy = (c - cx) / MG
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nx = cx + dx,
          ny = cy + dy
        if (nx < 0 || ny < 0 || nx >= MG || ny >= MG) continue
        const n = ny * MG + nx
        if (lab[n] !== best && !outer[n]) {
          outer[n] = 1
          stack.push(n)
        }
      }
    }
    // the silhouette, grown by one cell: packing reserves it and develop clips
    // to it, so a culture's cells provably stay apart and inside the strip
    const fill = new Uint8Array(MG * MG)
    let area = 0,
      holeCells = 0
    for (let s = 0; s < MG * MG; s++) {
      if (outer[s]) continue
      if (lab[s] !== best) holeCells++
      area++
      const cx = s % MG,
        cy = (s - cx) / MG
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const nx = cx + dx,
            ny = cy + dy
          if (nx >= 0 && ny >= 0 && nx < MG && ny < MG) fill[ny * MG + nx] = 1
        }
    }
    return {
      mx,
      my,
      R,
      fill,
      area: area / (MG * MG),
      main: bestSize / Math.max(total, 1),
      holes: holeCells / Math.max(area, 1),
      outside: outside / count,
    }
  }

  // ---------------------------------------------------------------- cells

  function makeCell(rand, species) {
    const pilot = new Float64Array(2 * N * 40 * 24)
    for (let attempt = 0; attempt < 8; attempt++) {
      const fallback = attempt === 7
      const tpl = species[Math.floor(rand() * species.length)]
      const x = fallback ? 0.2 : 0.08 + rand() * 0.32,
        r1 = fallback ? 1 : 0.8 + rand() * 0.45,
        r2 = fallback ? 1 : 0.8 + rand() * 0.45
      const n = solver(tpl, x, r1, r2, rand).sweeps(40, 24, pilot, 0) / 2
      const sh = shape(pilot, n)
      if (fallback || (sh.main > 0.93 && sh.holes > 0.02 && sh.outside < 0.01))
        return { tpl, x, r1, r2, seed: Math.floor(rand() * 4294967296), ...sh }
    }
  }

  // ---------------------------------------------------------------- layout

  // Slot-first packing into a W x 1 strip. Repeatedly find the roomiest free
  // spots (distance transform of the occupancy grid), then ask a reservoir of
  // matrix draws which one, at which rotation, fills that spot at the largest
  // scale without touching anything: the slot picks its spectrum. Placed cells
  // get cx, cy and s (outer radius in strip units).
  function* layout(W, rand, species, opts) {
    const GH = opts.grid ?? 72,
      GW = Math.round(GH * W),
      gap = opts.gap ?? 2,
      margin = Math.round((opts.margin ?? 0.02) * GH),
      smin = opts.small ?? 0.085,
      maxCells = opts.maxCells ?? Math.round(3 * W),
      fullness = opts.fullness ?? 0.8
    const blocked = new Uint8Array(GW * GH),
      dist = new Float32Array(GW * GH)
    for (let y = 0; y < GH; y++)
      for (let x = 0; x < GW; x++)
        if (x < margin || y < margin || x >= GW - margin || y >= GH - margin)
          blocked[y * GW + x] = 1
    const reservoir = [],
      placed = []
    let covered = 0
    const free0 = blocked.reduce((n, b) => n + (b ? 0 : 1), 0)
    // the first cells take a random size cap so not every strip leads with a giant
    // size caps: a few leads, then log-uniform sizes, so cells come in
    // several generations instead of one row of equals
    const big = opts.big ?? 0.5,
      leads = 2 + Math.floor(rand() * 3)
    const cap = () =>
      placed.length < leads
        ? big * (0.6 + 0.4 * rand())
        : 1.15 * smin * Math.pow(big / (1.15 * smin), Math.pow(rand(), opts.skew ?? 1.3))
    let misses = 0
    while (placed.length < maxCells && covered / free0 < fullness && misses < 6) {
      const limit = cap()
      transform()
      // candidate spots: roomiest few, plus some random roomy ones
      const spots = []
      for (let t = 0; t < 400; t++) {
        const p = Math.floor(rand() * GW * GH)
        if (dist[p] > smin * GH * 0.7) spots.push(p)
      }
      spots.sort((a, b) => dist[b] - dist[a])
      const tryspots = spots.slice(0, 6)
      if (!tryspots.length) break
      while (reservoir.length < (opts.reservoir ?? 6)) {
        reservoir.push(makeCell(rand, species))
        yield null
      }
      let best = null
      for (const p of tryspots) {
        const cx = ((p % GW) + 0.5) / GH,
          cy = (Math.floor(p / GW) + 0.5) / GH,
          d = dist[p] / GH
        for (let ci = 0; ci < reservoir.length; ci++) {
          const cell = reservoir[ci]
          for (let r = 0; r < 3; r++) {
            const angle = rand() * TAU,
              flip = rand() < 0.5
            let lo = d / 1.2,
              hi = Math.min(d * 1.9, limit)
            if (lo > hi) lo = hi * 0.8
            if (!fits(cell, cx, cy, lo, angle, flip)) continue
            for (let it = 0; it < 6; it++) {
              const mid = (lo + hi) / 2
              if (fits(cell, cx, cy, mid, angle, flip)) lo = mid
              else hi = mid
            }
            const score = lo * cell.area * (0.8 + 0.4 * rand())
            if (!best || score > best.score) best = { score, ci, cx, cy, s: lo, angle, flip }
          }
        }
        yield null
      }
      if (!best || best.s < smin) {
        misses++
        continue
      }
      const cell = reservoir.splice(best.ci, 1)[0]
      Object.assign(cell, {
        cx: best.cx,
        cy: best.cy,
        s: best.s,
        angle: best.angle,
        flip: best.flip,
      })
      covered += stamp(cell)
      placed.push(cell)
      yield cell
    }

    function cover(cell, cx, cy, s, angle, flip, fn) {
      const ext = s * 1.15,
        x0 = Math.max(0, Math.floor((cx - ext) * GH)),
        x1 = Math.min(GW - 1, Math.ceil((cx + ext) * GH)),
        y0 = Math.max(0, Math.floor((cy - ext) * GH)),
        y1 = Math.min(GH - 1, Math.ceil((cy + ext) * GH))
      if (
        (cx - ext) * GH < -1 ||
        (cy - ext) * GH < -1 ||
        (cx + ext) * GH > GW + 1 ||
        (cy + ext) * GH > GH + 1
      ) {
        // the mask may still fit: cells outside the grid count as blocked below
      }
      const ca = Math.cos(angle),
        sa = Math.sin(angle),
        span = 1.15
      for (let gy = Math.floor((cy - ext) * GH); gy <= Math.ceil((cy + ext) * GH); gy++)
        for (let gx = Math.floor((cx - ext) * GH); gx <= Math.ceil((cx + ext) * GH); gx++) {
          const dx = ((gx + 0.5) / GH - cx) / s,
            dy = ((gy + 0.5) / GH - cy) / s
          let u = dx * ca + dy * sa
          const v = -dx * sa + dy * ca
          if (flip) u = -u
          const mx = Math.floor(((u + span) / (2 * span)) * MG),
            my = Math.floor(((v + span) / (2 * span)) * MG)
          if (mx < 0 || my < 0 || mx >= MG || my >= MG || !cell.fill[my * MG + mx]) continue
          if (fn(gx, gy, gx < x0 || gx > x1 || gy < y0 || gy > y1)) return true
        }
      return false
    }
    function fits(cell, cx, cy, s, angle, flip) {
      return !cover(
        cell,
        cx,
        cy,
        s,
        angle,
        flip,
        (gx, gy, out) => out || blocked[gy * GW + gx] === 1,
      )
    }
    function stamp(cell) {
      let n = 0
      cover(cell, cell.cx, cell.cy, cell.s, cell.angle, cell.flip, (gx, gy, out) => {
        if (out) return false
        for (let dy = -gap; dy <= gap; dy++)
          for (let dx = -gap; dx <= gap; dx++) {
            const x = gx + dx,
              y = gy + dy
            if (x >= 0 && y >= 0 && x < GW && y < GH && !blocked[y * GW + x]) {
              blocked[y * GW + x] = 1
              n++
            }
          }
        return false
      })
      return n
    }
    // two-pass chamfer distance to the nearest blocked cell
    function transform() {
      const D = 1,
        D2 = 1.4142
      for (let p = 0; p < GW * GH; p++) dist[p] = blocked[p] ? 0 : 1e9
      for (let y = 0; y < GH; y++)
        for (let x = 0; x < GW; x++) {
          const p = y * GW + x
          if (!dist[p]) continue
          let v = dist[p]
          if (x > 0) v = Math.min(v, dist[p - 1] + D)
          if (y > 0) {
            v = Math.min(v, dist[p - GW] + D)
            if (x > 0) v = Math.min(v, dist[p - GW - 1] + D2)
            if (x < GW - 1) v = Math.min(v, dist[p - GW + 1] + D2)
          }
          dist[p] = v
        }
      for (let y = GH - 1; y >= 0; y--)
        for (let x = GW - 1; x >= 0; x--) {
          const p = y * GW + x
          if (!dist[p]) continue
          let v = dist[p]
          if (x < GW - 1) v = Math.min(v, dist[p + 1] + D)
          if (y < GH - 1) {
            v = Math.min(v, dist[p + GW] + D)
            if (x < GW - 1) v = Math.min(v, dist[p + GW + 1] + D2)
            if (x > 0) v = Math.min(v, dist[p + GW - 1] + D2)
          }
          dist[p] = v
        }
    }
  }

  // ---------------------------------------------------------------- render

  // A culture for one visit: a few species from the pool, then a generator
  // that yields each placed cell (and null while it is still deciding), so a
  // page can grow it a slice at a time. Pilot sweeps only; develop draws them.
  function culture(seed, W, opts = {}) {
    const rand = rng(seed),
      u = rand()
    const kinds = opts.species ?? (u < 0.5 ? 1 : u < 0.85 ? 2 : 3)
    const species = []
    for (let k = 0; k < kinds; k++) species.push(POOL[Math.floor(rand() * POOL.length)])
    return { seed, W, species, cells: layout(W, rand, species, opts) }
  }

  // Accumulate density for one cell into buf (w x h pixels; strip height h),
  // yielding between chunks of sweeps so a page can spread the work over frames.
  function* developing(cell, buf, w, h, perPixel, chunk = 120) {
    const rand = rng(cell.seed),
      px = cell.s * h,
      areaPx = cell.area * (2 * 1.15 * px) ** 2,
      total = Math.max(30, Math.round((areaPx * perPixel) / (N * 24))),
      sol = solver(cell.tpl, cell.x, cell.r1, cell.r2, rand),
      pts = new Float64Array(2 * N * 24 * Math.min(chunk, total)),
      ca = Math.cos(cell.angle),
      sa = Math.sin(cell.angle),
      ox = cell.cx * h,
      oy = cell.cy * h,
      span = 1.15
    for (let done = 0; done < total; done += chunk) {
      const n = sol.sweeps(Math.min(chunk, total - done), 24, pts, 0) / 2
      for (let q = 0; q < n; q++) {
        const nu = (pts[2 * q] - cell.mx) / cell.R,
          nv = (pts[2 * q + 1] - cell.my) / cell.R,
          mx = Math.floor(((nu + span) / (2 * span)) * MG),
          my = Math.floor(((nv + span) / (2 * span)) * MG)
        if (mx < 0 || my < 0 || mx >= MG || my >= MG || !cell.fill[my * MG + mx]) continue
        let u = nu * px
        const v = nv * px
        if (cell.flip) u = -u
        const X = Math.floor(ox + u * ca - v * sa + rand() - 0.5),
          Y = Math.floor(oy + u * sa + v * ca + rand() - 0.5)
        if (X >= 0 && Y >= 0 && X < w && Y < h) buf[Y * w + X] += 1
      }
      yield
    }
  }
  function develop(cell, buf, w, h, perPixel) {
    for (const _ of developing(cell, buf, w, h, perPixel));
  }

  // Density -> RGBA in one ink. gain sets how solid the cell bodies read.
  function paint(buf, w, h, perPixel, ink, gain = 1.4, rgba) {
    const out = rgba ?? new Uint8ClampedArray(w * h * 4),
      k = gain / perPixel
    for (let p = 0; p < w * h; p++) {
      const a = 1 - Math.exp(-buf[p] * k)
      out[4 * p] = ink[0]
      out[4 * p + 1] = ink[1]
      out[4 * p + 2] = ink[2]
      out[4 * p + 3] = Math.round(255 * a * (ink[3] ?? 1))
    }
    return out
  }

  return { rng, culture, developing, develop, paint, solver, shape }
}
export { eigencells }
