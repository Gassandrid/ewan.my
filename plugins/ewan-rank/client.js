;(() => {
  const SVG = "http://www.w3.org/2000/svg"
  const BINS = 40
  const TICKS = [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000]

  // PageRank as in the build: duplicate edges collapsed upstream, dangling mass spread evenly.
  function pageRank(n, edges, damping) {
    const out = Array.from({ length: n }, () => [])
    for (const [a, b] of edges) out[a].push(b)
    let rank = new Float64Array(n).fill(1 / n)
    for (let it = 0; it < 50; it += 1) {
      let dangling = 0
      for (let i = 0; i < n; i += 1) if (out[i].length === 0) dangling += rank[i]
      const base = (1 - damping) / n + (damping * dangling) / n
      const next = new Float64Array(n).fill(base)
      for (let i = 0; i < n; i += 1) {
        const share = (damping * rank[i]) / (out[i].length || 1)
        for (const j of out[i]) next[j] += share
      }
      let diff = 0
      for (let i = 0; i < n; i += 1) diff += Math.abs(next[i] - rank[i])
      rank = next
      if (diff < 1e-10) break
    }
    return rank
  }

  function svg(name, attributes, parent) {
    const element = document.createElementNS(SVG, name)
    for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, String(value))
    parent?.append(element)
    return element
  }

  const multiple = (x) => String(x) + "×"

  let disposeCurrent
  function mount() {
    const table = document.getElementById("rk-table")
    const raw = document.getElementById("rank-data")
    if (table?.dataset.ready) return
    disposeCurrent?.()
    disposeCurrent = undefined
    if (!table || !raw) return
    table.dataset.ready = "1"
    const d = JSON.parse(raw.textContent)
    const body = table.tBodies[0]
    const rows = new Map([...body.rows].map((tr) => [Number(tr.dataset.i), tr]))
    const q = document.getElementById("rk-q")
    const folder = document.getElementById("rk-folder")
    const orphans = document.getElementById("rk-orphans")
    const damp = document.getElementById("rk-damp")
    const dampOut = document.getElementById("rk-damp-out")
    const shown = document.getElementById("rk-shown")
    const chart = document.getElementById("rk-chart")
    const caption = document.getElementById("rk-caption")
    const baseCaption = caption.textContent

    const state = { score: d.score, sort: "score", dir: -1, bin: null, edges: d.edges }
    const rel = () => state.score.map((s) => Math.log10(Math.max(s * d.n, 1e-9)))
    const columns = {
      score: () => state.score,
      in: () => d.in,
      out: () => d.out,
      between: () => d.between,
      authority: () => d.authority,
      hub: () => d.hub,
      title: () => d.title,
      rank: () => state.score,
    }

    let lo = 0
    let hi = 1
    function binOf(v) {
      return Math.min(BINS - 1, Math.floor(((v - lo) / (hi - lo || 1)) * BINS))
    }

    // Drawn at the element's own width, so the type stays at its set size on
    // a phone instead of shrinking with a fixed viewBox.
    function drawChart() {
      const logs = rel()
      lo = Math.min(...logs)
      hi = Math.max(...logs)
      const counts = new Array(BINS).fill(0)
      logs.forEach((v) => (counts[binOf(v)] += 1))
      const W = Math.max(280, Math.round(chart.clientWidth || 640))
      const H = Math.max(120, Math.round(chart.clientHeight || 170))
      const top = 18
      const base = H - 22
      const bw = W / BINS
      const peak = Math.log1p(Math.max(...counts))
      const x = (log) => ((log - lo) / (hi - lo || 1)) * W
      chart.setAttribute("viewBox", `0 0 ${W} ${H}`)
      chart.replaceChildren()
      // The mean note scores 1×; draw where it falls.
      if (lo <= 0 && hi >= 0) {
        const mx = Math.round(x(0)) + 0.5
        svg("line", { x1: mx, x2: mx, y1: top - 4, y2: base, class: "rk-mean" }, chart)
        const label = svg("text", { x: mx + 4, y: top - 6, class: "rk-mean-label" }, chart)
        label.textContent = "mean"
      }
      counts.forEach((c, i) => {
        if (!c) return
        const t = Math.max(2, (Math.log1p(c) / peak) * (base - top))
        const a = Math.pow(10, lo + (i / BINS) * (hi - lo))
        const b = Math.pow(10, lo + ((i + 1) / BINS) * (hi - lo))
        const group = svg("g", { class: "rk-group", "data-bin": i }, chart)
        const title = svg("title", {}, group)
        title.textContent = `${c} note${c === 1 ? "" : "s"} at ${a.toFixed(2)}–${b.toFixed(2)}× the mean`
        // A full-height target, so a one-note bar is as easy to pick as a tall one.
        svg("rect", { x: i * bw, y: top, width: bw, height: base - top, class: "rk-hit" }, group)
        svg(
          "rect",
          {
            x: (i * bw + 0.75).toFixed(1),
            y: (base - t).toFixed(1),
            width: Math.max(1, bw - 1.5).toFixed(1),
            height: t.toFixed(1),
            class: "rk-bin" + (state.bin === i ? " on" : ""),
          },
          group,
        )
      })
      svg("line", { x1: 0, x2: W, y1: base + 0.5, y2: base + 0.5, class: "rk-axis" }, chart)
      const ticks = TICKS.filter((v) => {
        const p = x(Math.log10(v))
        return p >= -0.5 && p <= W + 0.5
      })
      // Keep the labels apart on a narrow chart: powers of ten only.
      const spaced =
        ticks.length * 34 > W ? ticks.filter((v) => Number.isInteger(Math.log10(v))) : ticks
      for (const v of spaced) {
        const p = Math.round(x(Math.log10(v))) + 0.5
        svg("line", { x1: p, x2: p, y1: base, y2: base + 4, class: "rk-tickmark" }, chart)
        const label = svg(
          "text",
          {
            x: p,
            y: H - 4,
            class: "rk-tick",
            "text-anchor": p < 12 ? "start" : p > W - 12 ? "end" : "middle",
          },
          chart,
        )
        label.textContent = multiple(v)
      }
    }

    const lowerTitles = d.title.map((t) => String(t).toLowerCase())
    const scoreCells = new Map(
      [...rows].map(([i, tr]) => [i, tr.querySelector('[data-col="score"]')]),
    )
    // Rows are only reordered when the order changes, not on every keystroke.
    let orderKey = ""
    let order = [...rows.keys()]
    function apply() {
      const logs = rel()
      const needle = q.value.trim().toLowerCase()
      const key = state.sort + ":" + state.dir + ":" + damp.value
      if (key !== orderKey) {
        orderKey = key
        const col = columns[state.sort]()
        order = [...rows.keys()].sort((a, b) => {
          const x = col[a]
          const y = col[b]
          const c = typeof x === "string" ? x.localeCompare(y) : x - y
          return state.dir * c || d.title[a].localeCompare(d.title[b])
        })
        const fragment = document.createDocumentFragment()
        order.forEach((i, position) => {
          const tr = rows.get(i)
          tr.cells[0].textContent = String(position + 1)
          scoreCells.get(i).textContent = (state.score[i] * d.n).toFixed(2)
          fragment.append(tr)
        })
        body.append(fragment)
      }
      let visible = 0
      for (const i of order) {
        const keep =
          (!needle || lowerTitles[i].includes(needle)) &&
          (!folder.value || d.folder[i] === folder.value) &&
          (!orphans.checked || d.in[i] + d.out[i] === 0) &&
          (state.bin === null || binOf(logs[i]) === state.bin)
        const tr = rows.get(i)
        if (tr.hidden === keep) tr.hidden = !keep
        if (keep) visible += 1
      }
      shown.textContent = `${visible} of ${d.n}`
      for (const th of table.tHead.rows[0].cells) {
        const active = th.dataset.sort === state.sort
        th.classList.toggle("on", active)
        if (active) {
          th.dataset.dir = String(state.dir)
          th.setAttribute("aria-sort", state.dir < 0 ? "descending" : "ascending")
        } else {
          delete th.dataset.dir
          th.removeAttribute("aria-sort")
        }
      }
      caption.textContent =
        state.bin === null
          ? baseCaption
          : `Showing the ${visible} notes in the highlighted bar. Click it again to clear.`
    }

    const controller = new AbortController()
    const signal = controller.signal
    chart.addEventListener(
      "click",
      (e) => {
        const bin = e.target.closest?.("[data-bin]")
        if (!bin) return
        const i = Number(bin.dataset.bin)
        state.bin = state.bin === i ? null : i
        drawChart()
        apply()
      },
      { signal },
    )
    table.tHead.addEventListener(
      "click",
      (e) => {
        const th = e.target.closest("th[data-sort]")
        if (!th) return
        const key = th.dataset.sort === "rank" ? "score" : th.dataset.sort
        state.dir = state.sort === key ? -state.dir : key === "title" ? 1 : -1
        state.sort = key
        apply()
      },
      { signal },
    )
    for (const el of [q, folder, orphans]) el.addEventListener("input", apply, { signal })
    // A dragged slider fires faster than frames; recompute once per frame.
    let dampFrame = 0
    damp.addEventListener(
      "input",
      () => {
        dampOut.textContent = Number(damp.value).toFixed(2)
        if (dampFrame) return
        dampFrame = requestAnimationFrame(() => {
          dampFrame = 0
          state.score = Array.from(pageRank(d.n, state.edges, Number(damp.value)))
          state.bin = null
          drawChart()
          apply()
        })
      },
      { signal },
    )
    let width = chart.clientWidth
    const resize = new ResizeObserver(() => {
      if (Math.abs(chart.clientWidth - width) < 1) return
      width = chart.clientWidth
      drawChart()
    })
    resize.observe(chart)

    drawChart()
    apply()
    disposeCurrent = () => {
      controller.abort()
      resize.disconnect()
      cancelAnimationFrame(dampFrame)
    }
  }

  document.addEventListener("prenav", () => {
    disposeCurrent?.()
    disposeCurrent = undefined
  })
  document.addEventListener("nav", mount)
  if (document.readyState !== "loading") mount()
})()
