;(() => {
  const SVG = "http://www.w3.org/2000/svg"
  const BINS = 40

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

  function mount() {
    const table = document.getElementById("rk-table")
    const raw = document.getElementById("rank-data")
    if (!table || !raw || table.dataset.ready) return
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
    function drawChart() {
      const logs = rel()
      lo = Math.min(...logs)
      hi = Math.max(...logs)
      const counts = new Array(BINS).fill(0)
      logs.forEach((v) => (counts[binOf(v)] += 1))
      const W = 640
      const H = 150
      const bw = W / BINS
      const peak = Math.log1p(Math.max(...counts))
      chart.setAttribute("viewBox", `0 0 ${W} ${H}`)
      chart.replaceChildren()
      counts.forEach((c, i) => {
        const r = document.createElementNS(SVG, "rect")
        const t = c ? Math.max(2, (Math.log1p(c) / peak) * (H - 28)) : 0
        r.setAttribute("x", (i * bw + 0.5).toFixed(1))
        r.setAttribute("y", (H - 18 - t).toFixed(1))
        r.setAttribute("width", Math.max(1, bw - 1).toFixed(1))
        r.setAttribute("height", t.toFixed(1))
        r.setAttribute("class", "rk-bin" + (state.bin === i ? " on" : ""))
        r.dataset.bin = String(i)
        const a = Math.pow(10, lo + (i / BINS) * (hi - lo))
        const b = Math.pow(10, lo + ((i + 1) / BINS) * (hi - lo))
        const title = document.createElementNS(SVG, "title")
        title.textContent = `${c} note${c === 1 ? "" : "s"} at ${a.toFixed(2)}–${b.toFixed(2)}× the mean`
        r.append(title)
        if (c) chart.append(r)
      })
      const axis = document.createElementNS(SVG, "line")
      axis.setAttribute("x1", "0")
      axis.setAttribute("x2", String(W))
      axis.setAttribute("y1", String(H - 17.5))
      axis.setAttribute("y2", String(H - 17.5))
      axis.setAttribute("class", "rk-axis")
      chart.append(axis)
      for (const f of [0, 0.5, 1]) {
        const t = document.createElementNS(SVG, "text")
        t.setAttribute("x", String(f * W))
        t.setAttribute("y", String(H - 3))
        t.setAttribute("class", "rk-tick")
        t.setAttribute("text-anchor", f === 0 ? "start" : f === 1 ? "end" : "middle")
        t.textContent = Math.pow(10, lo + f * (hi - lo)).toFixed(2) + "×"
        chart.append(t)
      }
    }
    function binOf(v) {
      return Math.min(BINS - 1, Math.floor(((v - lo) / (hi - lo || 1)) * BINS))
    }

    function apply() {
      const logs = rel()
      const needle = q.value.trim().toLowerCase()
      const col = columns[state.sort]()
      const order = [...rows.keys()].sort((a, b) => {
        const x = col[a]
        const y = col[b]
        const c = typeof x === "string" ? x.localeCompare(y) : x - y
        return state.dir * c || d.title[a].localeCompare(d.title[b])
      })
      let visible = 0
      order.forEach((i, position) => {
        const tr = rows.get(i)
        const keep =
          (!needle || d.title[i].toLowerCase().includes(needle)) &&
          (!folder.value || d.folder[i] === folder.value) &&
          (!orphans.checked || d.in[i] + d.out[i] === 0) &&
          (state.bin === null || binOf(logs[i]) === state.bin)
        tr.hidden = !keep
        if (keep) visible += 1
        tr.cells[0].textContent = String(position + 1)
        tr.querySelector('[data-col="score"]').textContent = (state.score[i] * d.n).toFixed(2)
        body.append(tr)
      })
      shown.textContent = `${visible} of ${d.n}`
      for (const th of table.tHead.rows[0].cells)
        th.classList.toggle("on", th.dataset.sort === state.sort)
      caption.textContent =
        state.bin === null
          ? baseCaption
          : `Showing the ${visible} notes in the highlighted bar. Click it again to clear.`
    }

    chart.addEventListener("click", (e) => {
      const bin = e.target.closest?.("[data-bin]")
      if (!bin) return
      const i = Number(bin.dataset.bin)
      state.bin = state.bin === i ? null : i
      drawChart()
      apply()
    })
    table.tHead.addEventListener("click", (e) => {
      const th = e.target.closest("th[data-sort]")
      if (!th) return
      const key = th.dataset.sort
      state.dir = state.sort === key ? -state.dir : key === "title" ? 1 : -1
      state.sort = key === "rank" ? "score" : key
      apply()
    })
    for (const el of [q, folder, orphans]) el.addEventListener("input", apply)
    damp.addEventListener("input", () => {
      dampOut.textContent = Number(damp.value).toFixed(2)
      state.score = Array.from(pageRank(d.n, state.edges, Number(damp.value)))
      state.bin = null
      drawChart()
      apply()
    })

    drawChart()
    apply()
  }

  document.addEventListener("nav", mount)
  if (document.readyState !== "loading") mount()
})()
