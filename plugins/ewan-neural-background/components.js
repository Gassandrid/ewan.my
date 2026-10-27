import { h } from "preact"
import { createNetwork, equipNetwork, modulators, stepNetwork } from "./network.js"
import { createVaultNetwork } from "./vault.js"

const CSS = `
#neural-canvas{position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:-1;opacity:var(--neural-ink,.78);mask-image:linear-gradient(90deg,#000 0%,#000b 17%,#0006 29%,#0004 36%,#0004 64%,#0006 71%,#000b 83%,#000 100%)}
#neural-canvas[data-neural-state="off"],#neural-canvas[data-neural-state="waiting"]{visibility:hidden;opacity:0}
#neural-label{position:fixed;left:0;top:0;z-index:40;pointer-events:none;width:17.5rem;box-sizing:border-box;padding:.7rem .8rem .65rem;background:var(--raised,var(--light));border:1px solid var(--hair,var(--lightgray));color:var(--darkgray);font:.72rem/1.35 var(--bodyFont);opacity:0;transition:opacity .12s}
#neural-label[data-visible]{opacity:1}
#neural-label .nl-title{display:block;font:400 1.08rem/1.15 var(--fell,var(--headerFont));color:var(--dark)}
#neural-label .nl-kind{display:block;margin-top:.15rem;font:italic .8rem/1.3 var(--fell,var(--headerFont));color:var(--muted,var(--gray))}
#neural-label canvas{display:block;width:100%;height:68px;margin:.55rem 0 .4rem}
#neural-label dl{display:grid;grid-template-columns:auto 1fr auto 1fr;gap:.1rem .55rem;align-items:baseline;margin:0;padding-top:.45rem;border-top:1px solid var(--hair,var(--lightgray))}
#neural-label dt{font:.76rem/1.35 var(--fell-sc,var(--headerFont));letter-spacing:.04em;color:var(--muted,var(--gray))}
#neural-label dd{margin:0;font:.66rem/1.35 var(--mono,var(--codeFont));font-variant-numeric:tabular-nums;color:var(--dark);white-space:nowrap}
#neural-label dd.nl-wide{grid-column:2/-1}
#neural-label .nl-with{margin:.45rem 0 0;padding-top:.4rem;border-top:1px solid var(--hair,var(--lightgray));font:italic .8rem/1.35 var(--fell,var(--headerFont));color:var(--darkgray)}
#neural-label .nl-with:empty{display:none}
#neural-controls{position:fixed;right:1rem;bottom:1rem;z-index:50;color:var(--darkgray);font: .75rem var(--bodyFont)}
#neural-controls>summary{list-style:none;cursor:pointer;display:flex;gap:.45rem;align-items:center;padding:.42rem .65rem;background:var(--light);border:1px solid var(--lightgray);border-radius:5px}
#neural-controls>summary::-webkit-details-marker{display:none}
#neural-controls>summary::before{content:"";width:5px;height:5px;border-radius:50%;background:var(--darkgray)}
#neural-controls[open]>summary{border-color:var(--gray)}
#neural-controls .neural-panel{position:absolute;right:0;bottom:2.7rem;width:min(310px,calc(100vw - 2rem));box-sizing:border-box;padding:1rem;background:var(--light);border:1px solid var(--lightgray);border-radius:6px;box-shadow:0 5px 20px var(--highlight);max-height:70vh;overflow:auto}
#neural-controls label{display:block;margin:.75rem 0;color:var(--darkgray)}
#neural-controls label>span{display:flex;justify-content:space-between;gap:1rem}
#neural-controls input,#neural-controls select{display:block;box-sizing:border-box;width:100%;margin-top:.4rem;accent-color:var(--darkgray);font:inherit}
#neural-controls select{padding:.3rem;background:var(--light);color:var(--dark);border:1px solid var(--lightgray);border-radius:3px}
#neural-controls .neural-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 1rem}
#neural-controls .neural-grid label{min-width:0}
#neural-controls .neural-grid label>span{display:block}
#neural-controls .neural-grid output{display:block;margin-top:.15rem;font-size:.68rem}
#neural-controls .neural-seed{display:flex;gap:.65rem;align-items:end;margin:.35rem 0 .75rem}
#neural-controls .neural-seed label{flex:1;min-width:0;margin:0}
#neural-controls input[type=number]{padding:.3rem;background:var(--light);color:var(--darkgray);border:1px solid var(--lightgray);border-radius:3px}
#neural-controls button{padding:.4rem .6rem;border:1px solid var(--lightgray);background:var(--light);color:var(--darkgray);font:inherit;border-radius:3px;cursor:pointer;white-space:nowrap}
#neural-controls button:hover{border-color:var(--secondary);color:var(--dark)}
#neural-controls output{font-variant-numeric:tabular-nums;color:var(--darkgray);opacity:.85}
#neural-controls :focus-visible{outline:2px solid var(--secondary);outline-offset:3px}
@media print{#neural-canvas,#neural-controls,#neural-label{display:none}}
`

function neuralRuntime(create, step, createVault, modulators) {
  if (window.__ewanNeural) return
  const motion = matchMedia("(prefers-reduced-motion: reduce)")
  const compact = matchMedia("(max-width: 800px)")
  const connection = navigator.connection
  const preferenceKey = "ewan-neural-mode"
  let current = null
  let selectedMode = compact.matches ? "off" : "on"
  function freshSeed() {
    try {
      return crypto.getRandomValues(new Uint32Array(1))[0]
    } catch {
      return (Date.now() ^ Math.floor(Math.random() * 0x100000000)) >>> 0
    }
  }
  let seed = freshSeed()
  let layout = "vault"
  let parameters = null
  let ink = 0.8
  // The vault network outlives SPA navigation: it keeps firing while the
  // reader moves through the garden, and only the "you are here" mark moves.
  let vaultIndex
  let vaultRequest = null
  let shared = null
  let grown = ""
  const parameterFields = [
    ["drive", "Input current", 0, 1, 0.05, "Steady external drive toward the firing threshold"],
    ["coupling", "Recurrence", 0, 1.5, 0.05, "Strength of signals passed between neurons"],
    [
      "inhibition",
      "Inhibition",
      0,
      2,
      0.05,
      "How strongly inhibitory neurons suppress their neighbors",
    ],
    [
      "adaptation",
      "Adaptation",
      0,
      1,
      0.05,
      "How much recent firing makes a neuron less excitable",
    ],
    ["oscillation", "Oscillation", 0, 1, 0.05, "Strength of the rhythmic background current"],
    ["frequency", "Rhythm speed", 0.1, 2, 0.05, "Background cycles per animation second"],
    ["noise", "Fluctuation", 0, 1, 0.05, "Irregular changes in local input currents"],
  ]
  try {
    const value = localStorage.getItem(preferenceKey)
    if (["auto", "on", "off"].includes(value)) selectedMode = value
  } catch {}

  function mount(options = {}) {
    current?.destroy({ keepControls: options.keepOpen })
    current = null
    const canvas = document.getElementById("neural-canvas")
    if (!canvas) return
    if (layout === "vault" && vaultIndex === undefined) {
      vaultRequest ??= (
        typeof fetchData !== "undefined" ? Promise.resolve(fetchData) : Promise.reject()
      )
        .then((data) => (vaultIndex = data && typeof data === "object" ? data : null))
        .catch(() => (vaultIndex = null))
      vaultRequest.then(() => {
        if (canvas.isConnected && !current) mount(options)
      })
      return
    }
    const low = compact.matches || (navigator.hardwareConcurrency || 4) <= 4
    const count = low ? 80 : 112
    const key = layout + "|" + seed + "|" + count
    let network = shared?.key === key ? shared.network : null
    if (!network && layout === "vault" && vaultIndex) {
      const built = createVault(create, vaultIndex, {
        count,
        seed,
        parameters: parameters ?? undefined,
        aspect: innerWidth / Math.max(1, innerHeight),
      })
      if (!built.fallback) shared = { key, network: (network = built) }
    }
    network ??= create({
      count,
      seed,
      layout: layout === "vault" ? "clusters" : layout,
      parameters: parameters ?? undefined,
    })
    parameters = network.parameters
    const slug = document.body.dataset.slug || ""
    const here = (() => {
      if (!network.nodes[0]?.slug) return -1
      const bases = [slug, ...(vaultIndex?.[slug]?.links || [])].map((link) =>
        String(link).split("/").pop(),
      )
      for (const base of bases) {
        const found = network.nodes.findIndex((node) => node.slug.split("/").pop() === base)
        if (found >= 0) return found
      }
      return -1
    })()
    // A fresh per-page scope owns every renderer, timer, observer and control.
    const controller = new AbortController()
    const signal = controller.signal
    const retainedControls = document.getElementById("neural-controls")
    const controls = retainedControls ?? document.createElement("details")
    controls.id = "neural-controls"
    // Keep the live controls during a recipe change. Replacing them in a seed
    // input's blur/change event would swallow the click on the next control.
    if (!retainedControls)
      controls.innerHTML =
        '<summary aria-label="Neural background settings">Network</summary><div class="neural-panel"><div class="neural-grid"><label>Motion<select data-motion aria-label="Background motion"><option value="auto">Auto</option><option value="on">On</option><option value="off">Off</option></select></label><label>Geometry<select data-layout aria-label="Network geometry"><option value="vault">Vault</option><option value="clusters">Islands</option><option value="layers">Layers</option><option value="branches">Branches</option></select></label></div><div class="neural-seed"><label>Seed<input data-seed aria-label="Network seed" type="number" min="0" max="4294967295" step="1"></label><button type="button" data-new-network>New network</button></div><div class="neural-grid">' +
        parameterFields
          .map(
            ([key, label, min, max, stepSize, hint]) =>
              '<label title="' +
              hint +
              '"><span>' +
              label +
              '<output data-value="' +
              key +
              '"></output></span><input data-param="' +
              key +
              '" aria-label="' +
              label +
              '" type="range" min="' +
              min +
              '" max="' +
              max +
              '" step="' +
              stepSize +
              '"></label>',
          )
          .join("") +
        '<label><span>Ink<output data-ink-value></output></span><input data-ink aria-label="Background ink" type="range" min="0.3" max="1" step="0.05"></label></div></div>'
    if (!retainedControls) document.body.appendChild(controls)
    controls.open = Boolean(options.keepOpen)
    const label = document.getElementById("neural-label") ?? document.createElement("div")
    label.id = "neural-label"
    label.setAttribute("aria-hidden", "true")
    if (!label.isConnected) document.body.appendChild(label)
    const summary = controls.querySelector("summary")
    const select = controls.querySelector("[data-motion]")
    const geometryInput = controls.querySelector("[data-layout]")
    const seedInput = controls.querySelector("[data-seed]")
    const inkInput = controls.querySelector("[data-ink]")
    select.value = selectedMode
    geometryInput.value = layout
    seedInput.value = seed
    inkInput.value = ink
    const parameterInputs = parameterFields.map(([key]) =>
      controls.querySelector('[data-param="' + key + '"]'),
    )
    parameterInputs.forEach((input) => {
      input.value = parameters[input.dataset.param]
    })
    function readControls() {
      parameterInputs.forEach((input) => {
        const key = input.dataset.param
        parameters[key] = Number(input.value)
        controls.querySelector('[data-value="' + key + '"]').value =
          key === "frequency"
            ? parameters[key].toFixed(2) + " cycles/s"
            : Math.round(parameters[key] * 100) + "%"
      })
      ink = Number(inkInput.value)
      controls.querySelector("[data-ink-value]").value = Math.round(ink * 100) + "%"
      canvas.style.setProperty("--neural-ink", ink)
      canvas.dataset.neuralParameters = JSON.stringify(parameters)
    }
    readControls()
    parameterInputs.forEach((input) => input.addEventListener("input", readControls, { signal }))
    inkInput.addEventListener("input", readControls, { signal })
    geometryInput.addEventListener(
      "change",
      () => {
        layout = geometryInput.value
        mount({ keepOpen: true, focus: "[data-layout]" })
      },
      { signal },
    )
    seedInput.addEventListener(
      "change",
      () => {
        if (!seedInput.checkValidity() || seedInput.value === "") {
          seedInput.value = seed
          return
        }
        seed = Number(seedInput.value) >>> 0
        mount({ keepOpen: true, focus: "[data-seed]" })
      },
      { signal },
    )
    controls.querySelector("[data-new-network]").addEventListener(
      "click",
      () => {
        const next = freshSeed()
        seed = next === seed ? (next + 1) >>> 0 : next
        parameters = null
        mount({ keepOpen: true, focus: "[data-new-network]" })
      },
      { signal },
    )
    controls.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Escape") {
          controls.open = false
          summary.focus()
        }
      },
      { signal },
    )
    document.addEventListener(
      "pointerdown",
      (event) => {
        if (!controls.contains(event.target)) controls.open = false
      },
      { signal },
    )

    const base = document.createElement("canvas")
    canvas.width = canvas.height = base.width = base.height = 0
    let ctx = null
    let baseCtx = null
    try {
      ctx = canvas.getContext("2d", { alpha: true })
      baseCtx = base.getContext("2d", { alpha: true })
    } catch {}
    const interval = 1000 / (low ? 24 : 30)
    let width = 0
    let height = 0
    let paths = []
    let positions = []
    let shapes = []
    let inkColor = "#000"
    let raf = 0
    let pending = 0
    let last = 0
    let frames = 0
    let totalFrames = 0
    let totalCost = 0
    let destroyed = false
    let failed = false
    let overBudget = false
    let running = false
    let theme
    let hovered = -1
    let growStart = 0
    let growing = grown !== key
    let poke = here
    canvas.dataset.neuralSeed = String(seed)
    canvas.dataset.neuralLayout = network.layout
    canvas.dataset.neuralTopology = network.edges
      .reduce(
        (hash, edge) => Math.imul(hash ^ ((edge.from + 1) * 257 + edge.to), 16777619) >>> 0,
        2166136261,
      )
      .toString(16)
    canvas.dataset.neuralNodes = String(network.nodes.length)
    canvas.dataset.neuralEdges = String(network.edges.length)
    canvas.dataset.neuralPacketCapacity = String(network.edges.length * 4)
    canvas.dataset.neuralFrames = "0"
    canvas.dataset.neuralSpikes = String(network.spikes)
    canvas.dataset.neuralPending = String(network.pending)
    canvas.dataset.neuralDropped = String(network.dropped)
    canvas.dataset.neuralState = "waiting"
    canvas.dataset.neuralQuality = "off"
    canvas.dataset.neuralSimTime = network.time.toFixed(3)
    canvas.dataset.neuralFps = String(low ? 24 : 30)
    delete canvas.dataset.neuralDrawMs
    delete canvas.dataset.neuralFailure

    // Renderer-side history: when each synapse last delivered, the packets
    // seen last frame, and how often a delivery preceded a postsynaptic spike.
    const previous = new Float32Array(network.edges.length * 4)
    network.edges.forEach((edge, i) => previous.set(edge.packets, i * 4))
    const arrived = new Float64Array(network.edges.length).fill(-100)
    const credit = (network.credit ??= new Float32Array(network.edges.length))
    const incoming = network.nodes.map(() => [])
    network.edges.forEach((edge, i) => incoming[edge.to].push(i))

    // Seeded scribble noise, so the hand-drawn wobble is stable across frames.
    function noise(k) {
      let x = Math.imul((k + seed) ^ 0x5bd1e995, 0x27d4eb2d)
      x ^= x >>> 15
      x = Math.imul(x, 0x165667b1)
      x ^= x >>> 13
      return (x >>> 0) / 4294967296
    }
    // A polyline with cumulative length, traced in part for pen-like reveals.
    function polyline(points) {
      const pts = Float32Array.from(points)
      const cum = new Float32Array(pts.length / 2)
      for (let i = 1; i < cum.length; i++)
        cum[i] =
          cum[i - 1] + Math.hypot(pts[i * 2] - pts[i * 2 - 2], pts[i * 2 + 1] - pts[i * 2 - 1])
      return { pts, cum, len: cum[cum.length - 1] || 1 }
    }
    function trace(c, line, a = 0, b = 1, ox = 0, oy = 0) {
      const { pts, cum, len } = line
      const from = a * len
      const to = b * len
      if (to <= from) return
      let started = false
      for (let i = 1; i < cum.length; i++) {
        if (cum[i] < from) continue
        const x0 = pts[i * 2 - 2],
          y0 = pts[i * 2 - 1],
          x1 = pts[i * 2],
          y1 = pts[i * 2 + 1]
        const span = cum[i] - cum[i - 1] || 1
        if (!started) {
          const u = Math.max(0, (from - cum[i - 1]) / span)
          c.moveTo(ox + x0 + (x1 - x0) * u, oy + y0 + (y1 - y0) * u)
          started = true
        }
        if (cum[i] >= to) {
          const u = (to - cum[i - 1]) / span
          c.lineTo(ox + x0 + (x1 - x0) * u, oy + y0 + (y1 - y0) * u)
          return
        }
        c.lineTo(ox + x1, oy + y1)
      }
    }
    function traceAll(c, lines, p, ox, oy) {
      const total = lines.reduce((sum, line) => sum + line.len, 0)
      let budget = p * total
      for (const line of lines) {
        if (budget <= 0) return
        trace(c, line, 0, Math.min(1, budget / line.len), ox, oy)
        budget -= line.len
      }
    }
    // A rough loop that overshoots its start, as a pen does.
    function scribble(radius, k, wobble = 0.1) {
      const points = []
      const start = noise(k) * Math.PI * 2
      const steps = 14
      for (let i = 0; i <= steps + 2; i++) {
        const angle = start + (i / steps) * Math.PI * 2
        const r =
          radius * (1 + Math.sin(angle * 3 + noise(k + 1) * 6) * wobble + (i > steps ? 0.12 : 0))
        points.push(Math.cos(angle) * r, Math.sin(angle) * r)
      }
      return polyline(points)
    }
    // Pyramidal cells read as triangles with an apical dendrite; interneurons
    // as round somata with short multipolar stubs, and Martinotti cells add
    // their ascending axon with its tuft. Neuromodulatory cells are diamonds
    // around a nucleus. The shape alone says which class a neuron is.
    function soma(node, i) {
      const size = (low ? 2.3 : 2.6) + (node.hub ?? 0.35) * 2.6
      const k = i * 31
      if (modulators.includes(node.cell)) {
        const tilt = (noise(k + 2) - 0.5) * 0.4
        const r = size * 1.3
        const loop = []
        for (let n = 0; n <= 4; n++) {
          const angle = tilt + (n * Math.PI) / 2
          const reach = r * (n % 2 ? 0.72 : 1) * (0.92 + noise(k + n + 3) * 0.16)
          loop.push(Math.cos(angle) * reach, Math.sin(angle) * reach)
        }
        loop.push(loop[2] * 0.25 + loop[0] * 0.75, loop[3] * 0.25 + loop[1] * 0.75)
        return { size, lines: [polyline(loop), scribble(size * 0.28, k + 4, 0.05)] }
      }
      if (node.inhibitory) {
        const lines = [scribble(size * 0.95, k, 0.08)]
        if (node.cell === "martinotti") {
          const bend = (noise(k + 8) - 0.5) * size
          const top = -size * 3.6
          lines.push(
            polyline([0, -size * 0.95, bend, -size * 2.2, bend * 0.4, top]),
            polyline([
              bend * 0.4 - size * 0.9,
              top - size * 0.2,
              bend * 0.4 + size * 0.9,
              top + size * 0.15,
            ]),
          )
        }
        for (let s = 0; s < (node.cell === "martinotti" ? 2 : 3); s++) {
          const angle = noise(k + 5 + s) * Math.PI * 2
          lines.push(
            polyline([
              Math.cos(angle) * size,
              Math.sin(angle) * size,
              Math.cos(angle + 0.2) * size * 1.9,
              Math.sin(angle + 0.2) * size * 1.9,
            ]),
          )
        }
        return { size, lines }
      }
      const tilt = (noise(k + 2) - 0.5) * 0.6 - Math.PI / 2
      const corners = [0, 1, 2, 0, 1].map((n) => {
        const angle = tilt + (n * Math.PI * 2) / 3
        const r = size * 1.3 * (0.92 + noise(k + n + 3) * 0.16)
        return [Math.cos(angle) * r, Math.sin(angle) * r]
      })
      const loop = []
      corners.slice(0, 4).forEach(([x, y]) => loop.push(x, y))
      // Overshoot a little past the first corner instead of closing cleanly.
      loop.push(
        corners[0][0] + (corners[4][0] - corners[0][0]) * 0.22,
        corners[0][1] + (corners[4][1] - corners[0][1]) * 0.22,
      )
      const apex = corners[0]
      const bend = (noise(k + 9) - 0.5) * 0.5
      return {
        size,
        lines: [
          polyline(loop),
          polyline([
            apex[0],
            apex[1],
            apex[0] * 1.9 + bend * size,
            apex[1] * 1.9,
            apex[0] * 2.6 - bend * size,
            apex[1] * 2.7,
          ]),
        ],
      }
    }
    function rays(node, i) {
      const k = i * 53 + 7
      const total = node.inhibitory ? 7 : 9
      return Array.from({ length: total }, (_, n) => [
        ((n + (noise(k + n) - 0.5) * 0.45) / total) * Math.PI * 2,
        0.7 + noise(k + n + 40) * 0.5,
      ])
    }

    function colors() {
      const style = getComputedStyle(document.documentElement)
      inkColor =
        style.getPropertyValue("--dark").trim() || style.getPropertyValue("--darkgray").trim()
    }
    function resize() {
      if (!ctx || !baseCtx || destroyed || !running) return false
      try {
        width = Math.max(1, innerWidth)
        height = Math.max(1, innerHeight)
        // Cap total backing area as well as DPR: two RGBA stores stay below
        // 24 MB even on a large retina display (browser overhead is separate).
        const ratio = Math.min(
          devicePixelRatio || 1,
          low ? 1 : 1.5,
          Math.sqrt(3_000_000 / (width * height)),
        )
        canvas.width = base.width = Math.floor(width * ratio)
        canvas.height = base.height = Math.floor(height * ratio)
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
        baseCtx.setTransform(ratio, 0, 0, ratio, 0, 0)
        canvas.dataset.neuralDpr = String(ratio)
        positions = network.nodes.map((node) => [node.x * width, node.y * height])
        shapes = network.nodes.map((node, i) => ({ ...soma(node, i), rays: rays(node, i) }))
        paths = network.edges.map((edge, i) => {
          const [x, y] = positions[edge.from]
          const [tx, ty] = positions[edge.to]
          const cx = (x + tx) / 2 - (ty - y) * edge.bend
          const cy = (y + ty) / 2 + (tx - x) * edge.bend
          const length = Math.hypot(tx - x, ty - y)
          const steps = Math.max(6, Math.ceil(length / 14))
          const amplitude = Math.min(1.6, length * 0.012)
          const phase = noise(i * 13) * 6.28
          const points = []
          for (let s = 0; s <= steps; s++) {
            const t = s / steps
            const u = 1 - t
            const px = u * u * x + 2 * u * t * cx + t * t * tx
            const py = u * u * y + 2 * u * t * cy + t * t * ty
            const dx = 2 * u * (cx - x) + 2 * t * (tx - cx)
            const dy = 2 * u * (cy - y) + 2 * t * (ty - cy)
            const d = Math.hypot(dx, dy) || 1
            const offset =
              amplitude *
              Math.sin(Math.PI * t) *
              (Math.sin(t * 7 + phase) * 0.6 + Math.sin(t * 17 + phase * 2) * 0.4)
            points.push(px - (dy / d) * offset, py + (dx / d) * offset)
          }
          return polyline(points)
        })
        cacheStructure()
        return true
      } catch (error) {
        fail(error)
        return false
      }
    }
    function cacheStructure() {
      if (!baseCtx) return
      baseCtx.clearRect(0, 0, width, height)
      baseCtx.strokeStyle = inkColor
      baseCtx.lineCap = baseCtx.lineJoin = "round"
      baseCtx.lineWidth = 0.5
      network.edges.forEach((edge, i) => {
        if (!paths[i]) return
        baseCtx.globalAlpha = edge.callosal ? 0.035 : 0.065
        baseCtx.beginPath()
        trace(baseCtx, paths[i])
        baseCtx.stroke()
      })
      baseCtx.lineWidth = 0.75
      network.nodes.forEach((node, i) => {
        const [x, y] = positions[i]
        baseCtx.globalAlpha = 0.34 + (node.hub ?? 0.3) * 0.3
        baseCtx.beginPath()
        traceAll(baseCtx, shapes[i].lines, 1, x, y)
        baseCtx.stroke()
      })
      if (here >= 0) {
        const [x, y] = positions[here]
        baseCtx.globalAlpha = 0.5
        baseCtx.lineWidth = 0.7
        baseCtx.beginPath()
        trace(baseCtx, scribble(shapes[here].size + 7, here * 7, 0.06), 0, 1, x, y)
        baseCtx.stroke()
      }
      baseCtx.globalAlpha = 1
    }
    // Growth: the field is sketched outward from the current note, hop by hop
    // along its links, somata first and then the fibres between them.
    let births = []
    let growEnd = 0
    function planGrowth() {
      const root =
        here >= 0
          ? here
          : network.nodes.reduce(
              (best, node, i) => ((node.hub ?? 0) > (network.nodes[best].hub ?? 0) ? i : best),
              0,
            )
      const neighbours = network.nodes.map(() => [])
      network.edges.forEach((edge) => {
        neighbours[edge.from].push(edge.to)
        neighbours[edge.to].push(edge.from)
      })
      const hops = new Array(network.nodes.length).fill(-1)
      hops[root] = 0
      const queue = [root]
      for (let q = 0; q < queue.length; q++)
        for (const next of neighbours[queue[q]])
          if (hops[next] < 0) {
            hops[next] = hops[queue[q]] + 1
            queue.push(next)
          }
      const deepest = Math.max(...hops) + 1
      const spread = Math.min(0.38, 2.2 / deepest)
      births = hops.map(
        (hop, i) => 0.15 + (hop < 0 ? deepest : hop) * spread + noise(i * 3 + 1) * spread * 0.9,
      )
      growEnd = Math.max(...births) + 1.6
    }
    function renderGrowth(elapsed) {
      ctx.clearRect(0, 0, width, height)
      ctx.strokeStyle = inkColor
      ctx.lineCap = ctx.lineJoin = "round"
      ctx.lineWidth = 0.5
      network.edges.forEach((edge, i) => {
        const start = Math.max(births[edge.from], births[edge.to]) + 0.15
        const p = Math.min(1, (elapsed - start) / 0.55)
        if (p <= 0) return
        const settle = Math.min(1, Math.max(0, (elapsed - start - 0.55) / 1))
        const rest = edge.callosal ? 0.035 : 0.065
        ctx.globalAlpha = rest + (0.28 - rest) * (1 - settle)
        ctx.beginPath()
        trace(ctx, paths[i], 0, p)
        ctx.stroke()
      })
      ctx.lineWidth = 0.75
      network.nodes.forEach((node, i) => {
        const p = Math.min(1, (elapsed - births[i]) / 0.35)
        if (p <= 0) return
        const [x, y] = positions[i]
        ctx.globalAlpha = 0.34 + (node.hub ?? 0.3) * 0.3 + (1 - p) * 0.3
        ctx.beginPath()
        traceAll(ctx, shapes[i].lines, p, x, y)
        ctx.stroke()
      })
      if (here >= 0 && elapsed > births[here] + 0.2) {
        const [x, y] = positions[here]
        ctx.globalAlpha = 0.5
        ctx.lineWidth = 0.7
        ctx.beginPath()
        trace(
          ctx,
          scribble(shapes[here].size + 7, here * 7, 0.06),
          0,
          Math.min(1, (elapsed - births[here] - 0.2) / 0.5),
          x,
          y,
        )
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    }
    // The synapse glyph from circuit diagrams: an arrowhead for excitation,
    // a flat bar for inhibition, drawn where the fibre meets its target.
    function terminal(i, alpha) {
      const edge = network.edges[i]
      const { pts } = paths[i]
      const n = pts.length
      const dx = pts[n - 2] - pts[n - 4]
      const dy = pts[n - 1] - pts[n - 3]
      const d = Math.hypot(dx, dy) || 1
      const ux = dx / d,
        uy = dy / d
      const back = shapes[edge.to].size + 3.5
      const x = pts[n - 2] - ux * back
      const y = pts[n - 1] - uy * back
      ctx.globalAlpha = alpha
      ctx.setLineDash([])
      ctx.beginPath()
      if (edge.volume) {
        // A varicosity: neuromodulators are released from swellings en passant.
        ctx.moveTo(x + 1.8, y)
        ctx.arc(x, y, 1.8, 0, Math.PI * 2)
      } else if (edge.weight < 0) {
        ctx.moveTo(x - uy * 2.6, y + ux * 2.6)
        ctx.lineTo(x + uy * 2.6, y - ux * 2.6)
      } else {
        ctx.moveTo(x - ux * 3 - uy * 2, y - uy * 3 + ux * 2)
        ctx.lineTo(x, y)
        ctx.lineTo(x - ux * 3 + uy * 2, y - uy * 3 - ux * 2)
      }
      ctx.stroke()
    }
    const dashed = [3.2, 3.2]
    const dotted = [0.9, 2.8]
    const beaded = [5, 2.2, 0.9, 2.2]
    // Neuromodulatory release is slow and diffuse, so its mark lingers longer.
    const lives = network.nodes.map((node) => (modulators.includes(node.cell) ? 1.4 : 0.75))
    function render() {
      if (!ctx) return
      const now = network.time
      ctx.clearRect(0, 0, width, height)
      ctx.globalAlpha = 1
      ctx.drawImage(base, 0, 0, width, height)
      ctx.strokeStyle = inkColor
      ctx.lineCap = ctx.lineJoin = "round"
      ctx.lineWidth = 0.8
      for (let i = 0; i < network.edges.length; i++) {
        const edge = network.edges[i]
        const path = paths[i]
        if (!path) continue
        let head = -1
        for (let slot = 0; slot < 4; slot++) {
          const remaining = edge.packets[slot]
          if (previous[i * 4 + slot] > 0 && remaining === 0) arrived[i] = now
          previous[i * 4 + slot] = remaining
          if (remaining > 0) head = Math.max(head, 1 - remaining / edge.delay)
        }
        const dash = edge.volume ? beaded : edge.weight < 0 ? dotted : dashed
        // In flight: the dashed fibre is drawn out from the presynaptic soma.
        if (head > 0) {
          ctx.setLineDash(dash)
          ctx.lineDashOffset = 0
          ctx.globalAlpha = edge.callosal ? 0.28 : 0.45
          ctx.beginPath()
          trace(ctx, path, 0, head)
          ctx.stroke()
        }
        // Delivered: the trace is taken back up toward the target and fades.
        const age = now - arrived[i]
        if (age >= 0 && age < 0.6) {
          const fade = 1 - age / 0.6
          const tail = 1 - fade * fade
          ctx.setLineDash(dash)
          ctx.lineDashOffset = -tail * path.len
          ctx.globalAlpha = (edge.callosal ? 0.28 : 0.45) * fade
          ctx.beginPath()
          trace(ctx, path, tail, 1)
          ctx.stroke()
          terminal(i, 0.7 * fade)
        }
      }
      ctx.setLineDash([])
      network.nodes.forEach((node, i) => {
        const age = now - node.lastSpike
        if (age === 0) for (const e of incoming[i]) if (now - arrived[e] < 0.3) credit[e]++
        const life = lives[i]
        if (i !== hovered && (age < 0 || age > life)) return
        const [x, y] = positions[i]
        const shape = shapes[i]
        const fade = Math.max(0, 1 - age / life)
        ctx.lineWidth = 0.95
        ctx.globalAlpha = Math.max(i === hovered ? 0.75 : 0, 0.5 + fade * 0.45)
        ctx.beginPath()
        traceAll(ctx, shape.lines, 1, x, y)
        ctx.stroke()
        if (age < 0 || age > life) return
        ctx.lineWidth = 0.8
        ctx.globalAlpha = 0.8 * Math.min(1, fade * 1.6)
        ctx.beginPath()
        if (life > 0.75) {
          // Volume release: a dotted cloud blooms outward and thins.
          const k = 1 - Math.pow(1 - age / life, 2)
          ctx.globalAlpha = 0.55 * fade
          ctx.setLineDash(dotted)
          trace(ctx, scribble(shape.size + 4 + 26 * k, i * 19, 0.12), 0, 1, x, y)
          ctx.stroke()
          ctx.setLineDash([])
          return
        } else if (node.inhibitory) {
          // Inhibition clamps: a rough ring closes in, ticks pointing inward.
          const k = 1 - Math.pow(1 - Math.min(1, age / 0.4), 3)
          const r = shape.size + 11 - 7 * k
          trace(ctx, scribble(r, i * 17, 0.07), 0, 1, x, y)
          for (const [angle] of shape.rays) {
            const cx = Math.cos(angle),
              cy = Math.sin(angle)
            ctx.moveTo(x + cx * r, y + cy * r)
            ctx.lineTo(x + cx * (r - 2.6), y + cy * (r - 2.6))
          }
        } else {
          // Excitation radiates: rays shoot out like a sun and then detach.
          const out = 1 - Math.pow(1 - Math.min(1, age / 0.12), 2)
          const lift = Math.max(0, Math.min(1, (age - 0.12) / 0.55))
          const r0 = shape.size * 1.3 + 2.5
          for (const [angle, reach] of shape.rays) {
            const length = (5 + shape.size * 1.6) * reach
            const cx = Math.cos(angle),
              cy = Math.sin(angle)
            const a = r0 + length * lift * 0.85
            const b = r0 + length * out
            if (b <= a) continue
            ctx.moveTo(x + cx * a, y + cy * a)
            ctx.lineTo(x + cx * b, y + cy * b)
          }
        }
        ctx.stroke()
      })
      // Hover reveals the neuron's wiring as a still, faint dashed sketch.
      if (hovered >= 0) {
        ctx.lineWidth = 0.6
        ctx.globalAlpha = 0.24
        ctx.setLineDash([2.5, 3])
        ctx.beginPath()
        network.edges.forEach((edge, i) => {
          if (edge.from === hovered || edge.to === hovered) trace(ctx, paths[i])
        })
        ctx.stroke()
        ctx.setLineDash([])
        const [x, y] = positions[hovered]
        ctx.globalAlpha = 0.6
        ctx.beginPath()
        trace(ctx, scribble(shapes[hovered].size + 6, hovered * 11, 0.08), 0, 1, x, y)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    }
    function animate(now) {
      if (destroyed || !running || document.hidden) return
      if (now - last >= interval - 0.5) {
        try {
          const started = performance.now()
          if (growing) {
            growStart ||= now
            const elapsed = (now - growStart) / 1000
            renderGrowth(elapsed)
            if (elapsed >= growEnd) {
              growing = false
              grown = key
            }
            last = now
          } else {
            const dt = last ? Math.min(0.05, (now - last) / 1000) : interval / 1000
            last = now
            // Arriving on a page stimulates its neuron; the wave follows its links.
            if (poke >= 0) {
              const node = network.nodes[poke]
              node.refractory = 0
              node.voltage = 1.3
              poke = -1
            }
            step(network, dt, parameters)
            record()
            render()
            if (hovered >= 0) updateCard(totalFrames % 4 === 0)
          }
          totalCost += performance.now() - started
          frames++
          totalFrames++
          canvas.dataset.neuralFrames = String(totalFrames)
          if (frames >= 60) {
            const meanCost = totalCost / frames
            canvas.dataset.neuralDrawMs = meanCost.toFixed(3)
            canvas.dataset.neuralSimTime = network.time.toFixed(3)
            canvas.dataset.neuralSpikes = String(network.spikes)
            canvas.dataset.neuralPending = String(network.pending)
            canvas.dataset.neuralDropped = String(network.dropped)
            totalCost = 0
            frames = 0
            if (meanCost > 8 && selectedMode === "auto") {
              overBudget = true
              reconcile()
            }
          }
        } catch (error) {
          fail(error)
          return
        }
      }
      // Only a successful frame can schedule another. Context errors fail
      // closed instead of leaving an exception-producing animation loop.
      if (running && !destroyed) raf = requestAnimationFrame(animate)
    }

    // The last ten seconds of every neuron, kept on the network so the record
    // survives SPA navigation with it. At most 30 steps per second fit.
    const window10 = 10
    const tape = (network.tape ??= (() => {
      const size = 330
      return {
        size,
        head: 0,
        count: 0,
        time: new Float64Array(size),
        voltage: new Float32Array(size * network.nodes.length),
        spiked: new Uint8Array(size * network.nodes.length),
      }
    })())
    function record() {
      const n = network.nodes.length
      const at = tape.head
      tape.time[at] = network.time
      network.nodes.forEach((node, i) => {
        tape.voltage[at * n + i] = node.voltage
        tape.spiked[at * n + i] = node.lastSpike === network.time ? 1 : 0
      })
      tape.head = (at + 1) % tape.size
      tape.count = Math.min(tape.size, tape.count + 1)
    }
    // Samples of one neuron from oldest to newest, within the window.
    function samples(index, visit) {
      const n = network.nodes.length
      for (let k = tape.count; k >= 1; k--) {
        const at = (tape.head - k + tape.size) % tape.size
        const age = network.time - tape.time[at]
        if (age > window10) continue
        visit(age, tape.voltage[at * n + index], tape.spiked[at * n + index])
      }
    }

    // The hover card: what kind of cell this is, a strip chart of its
    // membrane, and its live state and constants.
    const cells = {
      pyramidal: ["Pyramidal cell", "glutamate"],
      basket: ["Basket cell", "GABA-A"],
      martinotti: ["Martinotti cell", "GABA-A, GABA-B"],
      dopamine: ["Dopaminergic cell", "dopamine, glutamate"],
      acetylcholine: ["Cholinergic cell", "acetylcholine, glutamate"],
      serotonin: ["Serotonergic cell", "serotonin, glutamate"],
    }
    const readings = [
      ["rate", "rate"],
      ["input", "input"],
      ["nmda", "NMDA"],
      ["gabaB", "GABA-B"],
      ["adaptation", "adaptation"],
      ["vesicles", "vesicles"],
      ["tau", "τ membrane"],
      ["refractory", "refractory"],
      ["synapses", "synapses", true],
      ["tone", "area tone", true],
    ]
    label.innerHTML =
      '<span class="nl-title"></span><span class="nl-kind"></span><canvas></canvas><dl>' +
      readings
        .map(
          ([key, name, wide]) =>
            "<dt>" +
            name +
            '</dt><dd data-reading="' +
            key +
            '"' +
            (wide ? ' class="nl-wide"' : "") +
            "></dd>",
        )
        .join("") +
      '</dl><p class="nl-with"></p>'
    const chart = label.querySelector("canvas")
    const chartCtx = chart.getContext("2d")
    const fields = Object.fromEntries(
      readings.map(([key]) => [key, label.querySelector('[data-reading="' + key + '"]')]),
    )
    let chartInk = {}
    function drawChart() {
      const w = chart.clientWidth
      const h = chart.clientHeight
      if (!w || !h || !chartCtx) return
      const ratio = Math.min(devicePixelRatio || 1, 2)
      if (chart.width !== Math.round(w * ratio)) {
        chart.width = Math.round(w * ratio)
        chart.height = Math.round(h * ratio)
      }
      const c = chartCtx
      c.setTransform(ratio, 0, 0, ratio, 0, 0)
      c.clearRect(0, 0, w, h)
      const right = w - 34
      const top = 2
      const bottom = h - 13
      const threshold = top + 13
      const x = (age) => right - (age / window10) * right
      const y = (v) =>
        bottom - ((Math.max(-0.4, Math.min(1, v)) + 0.4) / 1.4) * (bottom - threshold)
      // Strip-chart paper: a rule each second, every fifth stronger.
      c.lineWidth = 1
      c.strokeStyle = chartInk.rust
      for (let s = 0; s <= window10; s++) {
        c.globalAlpha = s % 5 ? 0.09 : 0.26
        const sx = Math.round(x(s)) + 0.5
        c.beginPath()
        c.moveTo(sx, top)
        c.lineTo(sx, bottom)
        c.stroke()
      }
      c.globalAlpha = 0.09
      c.beginPath()
      c.moveTo(0, Math.round(y(0)) + 0.5)
      c.lineTo(right, Math.round(y(0)) + 0.5)
      c.stroke()
      c.strokeStyle = chartInk.ink
      c.globalAlpha = 0.35
      c.setLineDash([2, 3])
      c.beginPath()
      c.moveTo(0, threshold + 0.5)
      c.lineTo(right, threshold + 0.5)
      c.stroke()
      c.setLineDash([])
      // The pen: subthreshold voltage, each spike struck up to the top.
      c.globalAlpha = 1
      c.lineJoin = c.lineCap = "round"
      c.beginPath()
      let started = false
      let latest = 0
      samples(hovered, (age, v, spiked) => {
        const px = x(age)
        if (!started) {
          c.moveTo(px, y(v))
          started = true
        } else if (spiked) {
          c.lineTo(px, threshold)
          c.lineTo(px, top)
          c.lineTo(px, y(v))
        } else c.lineTo(px, y(v))
        latest = v
      })
      c.stroke()
      // An ochre pointer and the present value at the pen's end.
      const py = y(latest)
      c.fillStyle = chartInk.ochre
      c.beginPath()
      c.moveTo(right + 2, py)
      c.lineTo(right + 7, py - 3)
      c.lineTo(right + 7, py + 3)
      c.fill()
      c.font = "9.5px " + chartInk.mono
      c.fillStyle = chartInk.ink
      c.textBaseline = "middle"
      c.textAlign = "left"
      c.fillText(latest.toFixed(2), right + 9, py)
      c.fillStyle = chartInk.muted
      c.textBaseline = "alphabetic"
      c.fillText("V", right + 9, threshold - 4)
      c.fillText("−10 s", 0, h - 2)
      c.textAlign = "center"
      c.fillText("−5", x(5), h - 2)
      c.textAlign = "right"
      c.fillText("0", right, h - 2)
    }
    function updateCard(text) {
      drawChart()
      if (!text) return
      const node = network.nodes[hovered]
      let spikes = 0
      let span = 0
      samples(hovered, (age, v, spiked) => {
        spikes += spiked
        span = Math.max(span, age)
      })
      const outgoing = node.outgoing.map((e) => network.edges[e])
      const vesicles = outgoing.length
        ? outgoing.reduce(
            (sum, edge) =>
              sum +
              1 -
              (1 - edge.resource) * Math.exp(-(network.time - edge.lastRelease) / edge.tauRecovery),
            0,
          ) / outgoing.length
        : 1
      const area = network.modules[node.group]
      fields.rate.textContent = (span > 0.5 ? spikes / span : 0).toFixed(2) + " /s"
      fields.input.textContent = node.input.toFixed(2)
      fields.nmda.textContent = node.nmda.toFixed(2)
      fields.gabaB.textContent = node.gabaB.toFixed(2)
      fields.adaptation.textContent = node.adaptation.toFixed(2)
      fields.vesicles.textContent = Math.round(vesicles * 100) + "%"
      fields.tone.textContent =
        "DA " +
        area.dopamine.toFixed(2) +
        " · ACh " +
        area.acetylcholine.toFixed(2) +
        " · 5-HT " +
        area.serotonin.toFixed(2)
    }

    // Hover reaches neurons only over bare page background, never through
    // text, links or controls. It reads a neuron; it does not navigate.
    const solid =
      "a,button,input,select,textarea,summary,label,p,li,h1,h2,h3,h4,h5,h6,pre,code,table,img,svg,video,iframe,figure,blockquote,canvas:not(#neural-canvas),.katex,.search,.graph,.explorer,.toc,.backlinks,#neural-controls"
    function setHover(index) {
      if (index === hovered) return
      hovered = index
      if (index < 0) {
        label.removeAttribute("data-visible")
        return
      }
      const node = network.nodes[index]
      const style = getComputedStyle(document.documentElement)
      const token = (name, fallback) => style.getPropertyValue(name).trim() || fallback
      chartInk = {
        ink: inkColor,
        muted: token("--muted", token("--gray", inkColor)),
        rust: token("--rust", inkColor),
        ochre: token("--ochre", inkColor),
        mono: token("--mono", "ui-monospace, monospace"),
      }
      const partners = []
      network.edges
        .map((edge, i) => [credit[i], edge.from === index ? edge.to : edge.from, edge])
        .filter(([score, , edge]) => score > 0 && (edge.from === index || edge.to === index))
        .sort((a, b) => b[0] - a[0])
        .forEach(([, other]) => {
          const title = network.nodes[other].title ?? "neuron " + (other + 1)
          if (partners.length < 2 && !partners.includes(title)) partners.push(title)
        })
      const [cell, transmitter] = cells[node.cell] ?? cells.pyramidal
      const subject = node.tag ?? network.modules[node.group]?.name
      label.querySelector(".nl-title").textContent = node.title ?? "Neuron " + (index + 1)
      label.querySelector(".nl-kind").textContent = [
        cell,
        transmitter,
        node.bridge ? "commissural" : "",
        subject,
      ]
        .filter(Boolean)
        .join(" · ")
      label.querySelector(".nl-with").textContent = partners.length
        ? "fires with " + partners.join(", ")
        : ""
      const facilitating = node.outgoing.filter((e) => network.edges[e].facilitating).length
      fields.synapses.textContent =
        incoming[index].length +
        " in · " +
        node.outgoing.length +
        " out" +
        (facilitating ? ", " + facilitating + " facilitating" : "")
      fields.tau.textContent = node.tau.toFixed(2) + " s"
      fields.refractory.textContent = node.refractoryPeriod.toFixed(2) + " s"
      updateCard(true)
      label.setAttribute("data-visible", "")
      placeLabel()
      if (node.refractory <= 0) node.voltage = Math.max(node.voltage, 1.3)
    }
    function placeLabel() {
      const [x, y] = positions[hovered]
      const box = label.getBoundingClientRect()
      const gap = shapes[hovered].size + 14
      const left = x > width / 2 ? x - box.width - gap : x + gap
      label.style.transform =
        "translate(" +
        Math.round(Math.max(8, Math.min(width - box.width - 8, left))) +
        "px," +
        Math.round(Math.max(8, Math.min(height - box.height - 8, y - box.height / 2))) +
        "px)"
    }
    document.addEventListener(
      "pointermove",
      (event) => {
        if (!running || growing || event.pointerType === "touch") return
        if (event.target?.closest?.(solid)) return setHover(-1)
        let best = -1,
          distance = 14
        positions.forEach(([x, y], i) => {
          const d = Math.hypot(x - event.clientX, y - event.clientY)
          if (d < distance) [best, distance] = [i, d]
        })
        setHover(best)
      },
      { passive: true, signal },
    )

    function fail(error) {
      failed = true
      canvas.dataset.neuralFailure = error?.name || "RenderingError"
      reconcile()
    }
    function reconcile() {
      if (destroyed) return
      clearTimeout(pending)
      cancelAnimationFrame(raf)
      running = false
      last = 0
      setHover(-1)
      const automatic = selectedMode === "auto"
      let reason = ""
      if (failed) reason = "Animation unavailable"
      else if (!ctx || !baseCtx) reason = "Canvas unavailable"
      else if (selectedMode === "off") reason = "Motion off"
      else if (automatic && compact.matches) reason = "Auto paused on a small screen"
      else if (automatic && motion.matches) reason = "Auto paused for reduced motion"
      else if (automatic && connection?.saveData) reason = "Auto paused to save data"
      else if (automatic && (navigator.deviceMemory || 8) <= 2)
        reason = "Auto paused for this device"
      else if (automatic && overBudget) reason = "Auto paused to keep reading responsive"
      canvas.dataset.neuralReason = reason
      if (reason) {
        canvas.dataset.neuralState = "off"
        canvas.dataset.neuralQuality = "off"
        // No full-screen backing stores, cache work or redraws in Off/Auto-off.
        canvas.width = canvas.height = base.width = base.height = 0
        return
      }
      canvas.dataset.neuralQuality = low ? "low" : "medium"
      if (document.hidden) {
        canvas.dataset.neuralState = "paused"
        return
      }
      // Defer initial art until page content has had an opportunity to paint.
      canvas.dataset.neuralState = "waiting"
      pending = setTimeout(() => {
        if (destroyed || !canvas.isConnected || document.hidden) return
        try {
          canvas.dataset.neuralState = "running"
          running = true
          colors()
          if (motion.matches) growing = false
          if (resize()) {
            if (growing) {
              growStart = 0
              planGrowth()
            }
            raf = requestAnimationFrame(animate)
          }
        } catch (error) {
          fail(error)
        }
      }, 160)
    }
    select.addEventListener(
      "change",
      () => {
        selectedMode = select.value
        try {
          localStorage.setItem(preferenceKey, selectedMode)
        } catch {}
        reconcile()
      },
      { signal },
    )
    document.addEventListener("visibilitychange", reconcile, { signal })
    canvas.addEventListener("contextlost", () => fail({ name: "ContextLost" }), { signal })
    base.addEventListener("contextlost", () => fail({ name: "ContextLost" }), { signal })
    motion.addEventListener("change", reconcile, { signal })
    compact.addEventListener("change", reconcile, { signal })
    connection?.addEventListener?.("change", reconcile, { signal })
    window.addEventListener("resize", resize, { passive: true, signal })
    if (ctx && baseCtx) {
      theme = new MutationObserver(() => {
        if (!running) return
        try {
          colors()
          cacheStructure()
        } catch (error) {
          fail(error)
        }
      })
      theme.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["saved-theme"],
      })
    }
    function destroy({ keepControls = false } = {}) {
      destroyed = true
      running = false
      clearTimeout(pending)
      cancelAnimationFrame(raf)
      controller.abort()
      theme?.disconnect()
      label.remove()
      if (!keepControls) controls.remove()
      canvas.dataset.neuralState = "destroyed"
      // Release backing stores promptly when a SPA route leaves this page.
      base.width = base.height = 0
      canvas.width = canvas.height = 0
    }
    current = { destroy }
    reconcile()
    if (options.focus && !retainedControls)
      controls.querySelector(options.focus)?.focus({ preventScroll: true })
  }
  document.addEventListener("prenav", () => {
    current?.destroy()
    current = null
  })
  document.addEventListener("nav", mount)
  window.__ewanNeural = { mount }
  mount()
}

export function NeuralBackground() {
  function Component() {
    return h("canvas", {
      id: "neural-canvas",
      "aria-hidden": "true",
      "data-neural-state": "waiting",
      width: 1,
      height: 1,
    })
  }
  Component.displayName = "NeuralBackground"
  Component.css = CSS
  // network.js and vault.js share one scope here, as they do as modules.
  Component.afterDOMLoaded = `(()=>{const modulators=${JSON.stringify(modulators)};${equipNetwork.toString()};${createNetwork.toString()};${stepNetwork.toString()};${createVaultNetwork.toString()};(${neuralRuntime.toString()})(createNetwork,stepNetwork,createVaultNetwork,modulators)})();`
  return Component
}
