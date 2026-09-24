import {
  BASE,
  PRESETS,
  activation,
  nInf,
  field,
  branch,
  equilibria,
  integrate,
  linearFlow,
  manifolds,
} from "./morris-lecar-math.js"

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const fmt = (v, n = 3) => (Math.abs(v) < 5e-9 ? "0" : Number(v.toFixed(n)).toString())
const small = (v) => (Math.abs(v) > 0 && Math.abs(v) < 0.001 ? v.toExponential(2) : fmt(v, 4))
const PARAMS = [
  ["gCa", "gCa · mS/cm²", 0.5, 8, 0.1],
  ["gK", "gK · mS/cm²", 1, 15, 0.1],
  ["gL", "gL · mS/cm²", 0.5, 5, 0.1],
  ["C", "C · µF/cm²", 5, 40, 1],
  ["V1", "V₁ · mV", -15, 15, 0.1],
  ["V2", "V₂ · mV", 5, 40, 0.1],
  ["V3", "V₃ · mV", -10, 20, 0.1],
  ["V4", "V₄ · mV", 10, 40, 0.1],
  ["ECa", "ECa · mV", 80, 150, 1],
  ["EK", "EK · mV", -110, -60, 1],
  ["EL", "EL · mV", -80, -40, 1],
]
const ENTRIES = [
  [
    "∂V̇/∂V",
    "J₁₁ = [gCa(m′∞(ECa − V*) − m∞) − gK n* − gL] / C. Voltage feedback: activation of calcium competes with leak and outward conductance.",
  ],
  [
    "∂V̇/∂n",
    "J₁₂ = gK(EK − V*) / C. More open potassium channels drive voltage toward EK; this coupling is negative when V* > EK.",
  ],
  [
    "∂ṅ/∂V",
    "J₂₁ = q(V*) n′∞(V*). Depolarization recruits potassium activation. Together with J₁₂ this supplies delayed negative feedback.",
  ],
  ["∂ṅ/∂n", "J₂₂ = −q(V*). Potassium activation relaxes back toward n∞ with time constant 1/q."],
]

// Canvas figures use CSS pixels, with device scaling applied only at the boundary.
class Plot {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
  }
  begin(bounds, colors, xLabel, yLabel, ticks = 4) {
    this.bounds = bounds
    this.colors = colors
    const box = this.canvas.getBoundingClientRect()
    this.w = box.width
    this.h = box.height
    if (this.w < 1 || this.h < 1) return false
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = Math.round(this.w * dpr),
      h = Math.round(this.h * dpr)
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w
      this.canvas.height = h
    }
    const c = this.ctx
    c.setTransform(dpr, 0, 0, dpr, 0, 0)
    c.clearRect(0, 0, this.w, this.h)
    c.fillStyle = colors.light
    c.fillRect(0, 0, this.w, this.h)
    this.rect = { l: 56, r: this.w - 17, t: 27, b: this.h - 37 }
    c.font = `12px ${colors.font}`
    c.lineWidth = 1
    c.setLineDash([])
    const [xmin, xmax, ymin, ymax] = bounds
    for (let i = 0; i <= ticks; i++) {
      const x = xmin + ((xmax - xmin) * i) / ticks,
        y = ymin + ((ymax - ymin) * i) / ticks
      this.line(
        [
          [x, ymin],
          [x, ymax],
        ],
        colors.lightgray,
        0.7,
      )
      this.line(
        [
          [xmin, y],
          [xmax, y],
        ],
        colors.lightgray,
        0.7,
      )
      c.fillStyle = colors.darkgray
      c.textAlign = "center"
      c.fillText(fmt(x, Math.abs(xmax - xmin) < 2 ? 3 : 1), this.xy([x, ymin])[0], this.rect.b + 17)
      c.textAlign = "right"
      c.fillText(
        fmt(y, Math.abs(ymax - ymin) < 2 ? 3 : 1),
        this.rect.l - 8,
        this.xy([xmin, y])[1] + 4,
      )
    }
    if (xmin < 0 && xmax > 0)
      this.line(
        [
          [0, ymin],
          [0, ymax],
        ],
        colors.gray,
        1,
      )
    if (ymin < 0 && ymax > 0)
      this.line(
        [
          [xmin, 0],
          [xmax, 0],
        ],
        colors.gray,
        1,
      )
    c.fillStyle = colors.darkgray
    c.textAlign = "left"
    c.fillText(yLabel, this.rect.l, 15)
    c.textAlign = "right"
    c.fillText(xLabel, this.rect.r, this.h - 3)
    return true
  }
  xy([x, y]) {
    const [xmin, xmax, ymin, ymax] = this.bounds,
      { l, r, t, b } = this.rect
    return [l + ((x - xmin) / (xmax - xmin)) * (r - l), b - ((y - ymin) / (ymax - ymin)) * (b - t)]
  }
  point(event) {
    const box = this.canvas.getBoundingClientRect(),
      { l, r, t, b } = this.rect
    const px = event.clientX - box.left,
      py = event.clientY - box.top
    const [xmin, xmax, ymin, ymax] = this.bounds
    return [
      xmin + clamp((px - l) / (r - l), 0, 1) * (xmax - xmin),
      ymin + clamp((b - py) / (b - t), 0, 1) * (ymax - ymin),
    ]
  }
  clip(draw) {
    const c = this.ctx,
      r = this.rect
    c.save()
    c.beginPath()
    c.rect(r.l, r.t, r.r - r.l, r.b - r.t)
    c.clip()
    draw(c)
    c.restore()
  }
  line(points, color, width = 1.5, dash = []) {
    this.clip((c) => {
      c.strokeStyle = color
      c.lineWidth = width
      c.setLineDash(dash)
      c.beginPath()
      let start = true
      for (const point of points) {
        if (!point?.every(Number.isFinite)) {
          start = true
          continue
        }
        const [x, y] = this.xy(point)
        if (start) c.moveTo(x, y)
        else c.lineTo(x, y)
        start = false
      }
      c.stroke()
    })
  }
  dot(point, color, radius = 4, fill = true, label) {
    if (!point.every(Number.isFinite)) return
    this.clip((c) => {
      const [x, y] = this.xy(point)
      c.beginPath()
      c.arc(x, y, radius, 0, 2 * Math.PI)
      c.fillStyle = fill ? color : this.colors.light
      c.fill()
      c.strokeStyle = color
      c.lineWidth = 1.8
      c.setLineDash([])
      c.stroke()
      if (label) {
        c.fillStyle = this.colors.dark
        c.textAlign = "left"
        c.fillText(label, x + radius + 4, y - radius - 3)
      }
    })
  }
  label(point, text, color = this.colors.darkgray, align = "left") {
    const [x, y] = this.xy(point),
      c = this.ctx
    c.fillStyle = color
    c.textAlign = align
    c.fillText(text, x, y)
  }
  arrow(a, b, color, size = 4) {
    this.clip((c) => {
      const [x, y] = this.xy(a),
        [xx, yy] = this.xy(b),
        angle = Math.atan2(yy - y, xx - x)
      c.strokeStyle = color
      c.lineWidth = 1
      c.setLineDash([])
      c.beginPath()
      c.moveTo(x, y)
      c.lineTo(xx, yy)
      for (const sign of [-1, 1]) {
        c.moveTo(xx, yy)
        c.lineTo(
          xx - size * Math.cos(angle + sign * 0.55),
          yy - size * Math.sin(angle + sign * 0.55),
        )
      }
      c.stroke()
    })
  }
}

export class MorrisLecarApp {
  constructor(root) {
    this.root = root
    this.abort = new AbortController()
    this.dead = false
    this.params = { ...BASE }
    this.regime = "hopf"
    this.selectedV = -27
    this.entry = 2
    this.amplitude = 1
    this.angle = 0
    this.duration = 400
    this.time = 80
    this.focusWindow = null
    this.paths = []
    this.zoomed = false
    this.localRange = 0.12
    this.plots = Object.fromEntries(
      [...root.querySelectorAll("canvas")].map((c) => [c.id, new Plot(c)]),
    )
    this.readLink()
    this.$("ml-parameters").innerHTML = PARAMS.map(
      ([key, label, min, max, step]) =>
        `<label>${label}<input type="number" data-param="${key}" aria-label="${label}" min="${min}" max="${max}" step="${step}" value="${this.params[key]}"></label>`,
    ).join("")
    this.bind()
    this.resize = new ResizeObserver(() => this.scheduleRender())
    root.querySelectorAll("canvas").forEach((c) => this.resize.observe(c))
    this.themeObserver = new MutationObserver(() => this.scheduleRender())
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["saved-theme"],
    })
    document.fonts.ready.then(() => this.scheduleRender())
    this.recompute(true)
    this.$("ml-status").textContent = ""
  }
  $(id) {
    return this.root.querySelector(`#${id}`)
  }
  on(el, event, handler) {
    el.addEventListener(event, handler, { signal: this.abort.signal })
  }
  readLink() {
    const query = new URLSearchParams(location.hash.slice(1))
    if (!query.has("ml")) return
    this.regime = query.get("ml") === "saddle" ? "saddle" : "hopf"
    this.params = { ...PRESETS[this.regime] }
    for (const [key, , min, max] of [...PARAMS, ["I", "", -20, 250], ["phi", "", 0.01, 0.15]]) {
      if (!query.has(key)) continue
      const v = Number(query.get(key))
      if (Number.isFinite(v)) this.params[key] = clamp(v, min, max)
    }
    const v = Number(query.get("eq"))
    if (query.has("eq") && Number.isFinite(v)) this.selectedV = clamp(v, -160, 200)
    for (const [key, lo, hi] of [
      ["amplitude", 0.1, 12],
      ["angle", -180, 180],
    ]) {
      const v = Number(query.get(key))
      if (query.has(key) && Number.isFinite(v)) this[key] = clamp(v, lo, hi)
    }
  }
  bind() {
    this.on(this.$("preset-select"), "change", (e) => this.preset(e.target.value))
    this.root
      .querySelectorAll("[data-scene]")
      .forEach((b) => this.on(b, "click", () => this.scene(b.dataset.scene)))
    this.on(this.$("ml-reset"), "click", () => this.preset(this.regime))
    this.on(this.$("ml-range"), "click", () => {
      if (this.focusWindow) this.focusWindow = null
      else {
        const event = this.branch.events
          .filter((e) => e.kind !== "Node–focus")
          .reduce(
            (best, e) =>
              !best || Math.abs(e.I - this.params.I) < Math.abs(best.I - this.params.I) ? e : best,
            null,
          )
        if (event) this.focusWindow = [event.I - 6, event.I + 6]
      }
      this.syncControls()
      this.scheduleRender()
    })
    this.on(this.$("ml-current"), "input", (e) => this.setCurrent(Number(e.target.value)))
    this.on(this.$("ml-current-number"), "change", (e) => {
      if (e.target.value === "" || !e.target.checkValidity()) {
        this.syncControls()
        return
      }
      this.setCurrent(Number(e.target.value))
    })
    this.on(this.$("ml-phi"), "input", (e) => {
      this.params.phi = Number(e.target.value)
      this.recompute(true)
    })
    this.root.querySelectorAll("[data-param]").forEach((el) =>
      this.on(el, "change", () => {
        if (el.value === "" || !el.checkValidity()) {
          this.syncControls()
          return
        }
        this.params[el.dataset.param] = Number(el.value)
        this.recompute(true)
      }),
    )
    for (const key of ["field", "nullclines", "manifolds", "vectors"])
      this.on(this.$(`ml-${key}`), "change", () => this.scheduleRender())
    this.on(this.$("ml-equilibria"), "click", (e) => {
      const button = e.target.closest("[data-eq]")
      if (!button) return
      this.select(this.equilibria[Number(button.dataset.eq)])
    })
    this.on(this.$("ml-matrix"), "click", (e) => {
      const b = e.target.closest("[data-entry]")
      if (!b) return
      this.entry = Number(b.dataset.entry)
      this.updateMatrix()
    })
    this.on(this.$("ml-zoom"), "click", () => {
      this.zoomed = !this.zoomed
      this.scheduleRender()
      this.$("ml-zoom").textContent = this.zoomed ? "Full phase plane" : "Zoom to equilibrium"
    })
    this.on(this.$("ml-clear"), "click", () => {
      this.paths = []
      this.probe = null
      this.scheduleRender()
    })
    this.on(this.$("phase-canvas"), "click", (e) => {
      const plot = this.plots["phase-canvas"],
        point = plot.point(e)
      const eq = this.equilibria.find((eq) => {
        const a = plot.xy(eq.point),
          b = plot.xy(point)
        return Math.hypot(a[0] - b[0], a[1] - b[1]) < 12
      })
      if (eq) this.select(eq)
      else {
        this.addPath(point)
        this.scheduleRender()
      }
    })
    this.on(this.$("ml-straddle"), "click", () => this.straddle())
    for (const key of ["amplitude", "angle"])
      this.on(this.$(`ml-${key}`), "input", (e) => {
        this[key] = Number(e.target.value)
        this.localRange = Math.max(0.06, (this.amplitude / 20) * 2.2)
        this.experiment()
        this.syncControls()
        this.scheduleRender()
      })
    this.on(this.$("ml-duration"), "change", (e) => {
      this.duration = Number(e.target.value)
      this.time = Math.min(this.time, this.duration)
      this.experiment()
      this.syncControls()
      this.scheduleRender()
    })
    this.on(this.$("ml-perturb"), "click", () => {
      this.time = 0
      this.experiment()
      this.addPath(this.initial)
      this.syncControls()
      this.scheduleRender()
    })
    this.on(this.$("ml-time"), "input", (e) => {
      this.pause()
      this.time = Number(e.target.value)
      this.syncTime()
      this.scheduleRender()
    })
    this.on(this.$("ml-play"), "click", () => (this.playing ? this.pause() : this.play()))
    this.on(this.$("ml-fit-local"), "click", () => {
      const points = this.local.data.slice(0, Math.round(this.time * 2) + 1)
      this.localRange =
        Math.max(
          (this.amplitude / 20) * 1.5,
          ...points.map((p) =>
            Math.max(
              Math.abs((p.x[0] - this.eq.point[0]) / 20),
              Math.abs((p.x[1] - this.eq.point[1]) / 0.2),
            ),
          ),
        ) * 1.15
      this.scheduleRender()
    })
    this.on(this.$("ml-events"), "click", (e) => {
      const b = e.target.closest("[data-event]")
      if (!b) return
      const event = this.visibleEvents[Number(b.dataset.event)]
      this.selectedV = event.point[0]
      if (this.focusWindow) this.focusWindow = [event.I - 6, event.I + 6]
      this.setCurrent(event.I)
    })
    for (const id of ["bifurc-canvas", "ml-eigen-branch"]) {
      const plot = this.plots[id]
      let dragging = false
      this.on(plot.canvas, "pointerdown", (e) => {
        if (e.button !== 0) return
        dragging = true
        plot.canvas.setPointerCapture(e.pointerId)
        const [I, v] = plot.point(e)
        if (id === "bifurc-canvas") this.selectedV = v
        this.setCurrent(I)
      })
      this.on(plot.canvas, "pointermove", (e) => {
        if (dragging) this.setCurrent(plot.point(e)[0])
      })
      this.on(plot.canvas, "pointerup", () => {
        dragging = false
      })
      this.on(plot.canvas, "pointercancel", () => {
        dragging = false
      })
    }
    this.root
      .querySelectorAll("details")
      .forEach((d) => this.on(d, "toggle", () => this.scheduleRender()))
    this.on(this.$("ml-share"), "click", () => this.share())
    this.on(document, "visibilitychange", () => {
      if (document.hidden) this.pause()
    })
  }
  preset(key) {
    this.pause()
    this.focusWindow = null
    this.regime = key
    this.params = { ...PRESETS[key] }
    this.selectedV = -60
    this.zoomed = false
    this.$("ml-zoom").textContent = "Zoom to equilibrium"
    this.amplitude = 1
    this.angle = 0
    this.localRange = 0.12
    this.time = 80
    this.recompute(true)
  }
  scene(name) {
    this.preset(name === "saddle" || name === "fold" ? "saddle" : "hopf")
    if (name === "saddle") {
      this.select(this.equilibria.find((e) => e.type === "Saddle"))
      this.straddle()
    } else if (name === "fold") {
      const fold = this.branch.events.find((e) => e.kind === "Fold" && e.point[0] < -15)
      this.focusWindow = [fold.I - 4, fold.I + 4]
      this.selectedV = fold.point[0] - 3
      this.setCurrent(fold.I - 0.3)
    } else if (name === "hopf") {
      const hopf = this.branch.events.find((e) => e.kind === "Hopf" && e.I > 0)
      this.focusWindow = [hopf.I - 6, hopf.I + 6]
      this.selectedV = hopf.point[0]
      this.setCurrent(hopf.I - 0.4)
    }
  }
  setCurrent(value) {
    this.params.I = clamp(value, -20, 250)
    this.recompute(false)
  }
  select(eq) {
    if (!eq) return
    this.eq = eq
    this.selectedV = eq.point[0]
    this.time = 80
    this.experiment()
    this.updateInfo()
    this.syncControls()
    this.scheduleRender()
  }
  recompute(shape) {
    this.pause()
    if (shape || !this.branch) this.branch = branch(this.params)
    this.equilibria = equilibria(this.params, this.branch.folds)
    this.eq = this.equilibria.reduce(
      (best, e) =>
        !best || Math.abs(e.point[0] - this.selectedV) < Math.abs(best.point[0] - this.selectedV)
          ? e
          : best,
      null,
    )
    // With positive conductances and the exposed parameter bounds a root exists.
    if (!this.eq) {
      this.$("ml-status").textContent = "No equilibrium in the analysis range (−160 to 200 mV)."
      return
    }
    this.selectedV = this.eq.point[0]
    this.manifoldPaths = this.equilibria.flatMap((eq) => manifolds(eq, this.params))
    this.paths = []
    this.probe = null
    this.experiment()
    this.updateInfo()
    this.syncControls()
    this.scheduleRender()
  }
  experiment() {
    if (!this.eq) return
    const angle = (this.angle * Math.PI) / 180
    this.delta = [this.amplitude * Math.cos(angle), (this.amplitude / 100) * Math.sin(angle)]
    this.initial = this.eq.point.map((v, i) => v + this.delta[i])
    this.local = integrate((x) => field(x, this.params), this.initial, this.duration)
    this.linear = this.local.data.map(({ t }) => ({
      t,
      x: linearFlow(this.eq.J, this.delta, t).map((v, i) => v + this.eq.point[i]),
    }))
  }
  addPath(point, color) {
    const path = {
      ...integrate((x) => field(x, this.params), point, this.duration),
      color: color || ["ochre", "mauve", "slate"][this.paths.length % 3],
    }
    this.paths.push(path)
    this.paths = this.paths.slice(-6)
    this.probe = path
    this.$("ml-status").textContent = path.stopped
      ? "Trajectory stopped at the integration bounds."
      : ""
  }
  straddle() {
    const saddle = this.equilibria.find((eq) => eq.type === "Saddle")
    if (!saddle) return
    this.select(saddle)
    const stable = this.manifoldPaths.find(
      (p) => p.stable && p.data.some((d) => d.x[1] > saddle.point[1] + 0.035),
    )
    if (!stable) return
    const index = stable.data.findIndex((p) => p.x[1] > saddle.point[1] + 0.035)
    const x = stable.data[index].x,
      f = field(x, this.params)
    const norm = Math.hypot(f[0] / 20, f[1] / 0.2)
    const normal = [(-f[1] / 0.2 / norm) * 20, (f[0] / 20 / norm) * 0.2]
    this.paths = []
    for (const sign of [-1, 1])
      this.addPath(
        x.map((v, i) => v + sign * 0.018 * normal[i]),
        sign < 0 ? "ochre" : "mauve",
      )
    this.scheduleRender()
  }
  syncControls() {
    this.$("preset-select").value = Object.keys(this.params).some(
      (k) => k !== "I" && Math.abs(this.params[k] - PRESETS[this.regime][k]) > 1e-9,
    )
      ? "custom"
      : this.regime
    const max = this.regime === "saddle" ? 100 : 220
    if (
      this.focusWindow &&
      (this.params.I < this.focusWindow[0] || this.params.I > this.focusWindow[1])
    )
      this.focusWindow = null
    this.currentBounds = this.focusWindow || [
      -20,
      Math.max(max, Math.ceil(this.params.I / 10) * 10),
    ]
    this.$("ml-range").textContent = this.focusWindow ? "Full current range" : "Near boundary"
    this.$("ml-current").min = this.currentBounds[0]
    this.$("ml-current").max = this.currentBounds[1]
    this.$("ml-current").value = this.params.I
    this.$("ml-current-number").value = fmt(this.params.I, 5)
    this.$("ml-phi").value = this.params.phi
    this.$("ml-phi-value").textContent = `${fmt(this.params.phi, 4)} ms⁻¹`
    this.$("ml-amplitude").value = this.amplitude
    this.$("ml-amplitude-value").textContent = `${fmt(this.amplitude, 1)} mV`
    this.$("ml-angle").value = this.angle
    this.$("ml-angle-value").textContent = `${this.angle}°`
    this.$("ml-duration").value = this.duration
    this.$("ml-time").max = this.duration
    this.root.querySelectorAll("[data-param]").forEach((el) => {
      el.value = this.params[el.dataset.param]
    })
    this.syncTime()
  }
  syncTime() {
    this.$("ml-time").value = this.time
    this.$("ml-time-value").textContent = `${fmt(this.time, 1)} ms`
  }
  updateMatrix() {
    this.$("ml-matrix").innerHTML = this.eq.J.flat()
      .map(
        (v, i) =>
          `<button data-entry="${i}" aria-pressed="${i === this.entry}"><small>${ENTRIES[i][0]}</small><b>${small(v)}</b></button>`,
      )
      .join("")
    this.$("ml-entry-note").textContent = ENTRIES[this.entry][1]
  }
  updateInfo() {
    const e = this.eq,
      complex = e.disc < 0,
      index = this.equilibria.indexOf(e)
    this.$("ml-eq-number").textContent = index + 1
    this.$("ml-type").textContent = e.type
    this.$("ml-type").style.color =
      `var(--${e.type === "Saddle" ? "mauve" : e.type.startsWith("Stable") ? "pine" : "rust"})`
    this.$("ml-equilibria").innerHTML = this.equilibria
      .map(
        (eq, i) =>
          `<button data-eq="${i}" aria-pressed="${eq === e}">${i + 1} · ${fmt(eq.point[0], 2)} mV · ${eq.type}</button>`,
      )
      .join("")
    this.updateMatrix()
    this.$("ml-eigenvalues").innerHTML = complex
      ? `<span class="ml-real">${small(e.alpha)}</span> ± <span class="ml-imag">${small(e.omega)}i</span> ms⁻¹`
      : e.values.map(([re], i) => `λ${i + 1} = ${small(re)} ms⁻¹`).join("<br>")
    this.$("ml-invariants").innerHTML =
      `<span>τ = tr J = ${small(e.trace)} ms⁻¹</span><span>D = det J = ${small(e.det)} ms⁻²</span>`
    const neutral = e.type === "Nonhyperbolic"
    const realMeaning = complex
      ? Math.abs(e.alpha) < 1e-8
        ? "Zero linear growth at this crossing; nonlinear terms decide the behavior."
        : `α = ${small(e.alpha)} ms⁻¹ → ${e.alpha < 0 ? "decay" : "growth"}; e-folding time ${fmt(1 / Math.abs(e.alpha), 1)} ms.`
      : e.type === "Saddle"
        ? "Opposite signs: approach along the stable direction, depart along the unstable direction."
        : neutral
          ? "One linear direction has zero growth. Nonlinear terms control its motion."
          : `${e.type.startsWith("Stable") ? "Both directions decay" : "Both directions grow"}. Im λ = 0: no local spiral.`
    const imaginaryMeaning = complex
      ? `ω = ${small(e.omega)} rad/ms → T = 2π/ω = ${fmt((2 * Math.PI) / e.omega, 1)} ms (${fmt((1000 * e.omega) / (2 * Math.PI), 1)} Hz). This is local rotation, not the spike rate.`
      : "Real eigenvectors give invariant lines of the linearized flow."
    this.$("ml-eigen-meaning").innerHTML =
      `${complex ? "<p>A real J can have complex eigenvalues: they describe rotation of real perturbations.</p>" : ""}<p>${realMeaning}</p><p>${imaginaryMeaning}</p>`
    const hasSaddle = this.equilibria.some((e) => e.type === "Saddle")
    this.$("ml-straddle").disabled = !hasSaddle
    this.$("ml-manifold-note").textContent = hasSaddle
      ? "Wˢ: approach the saddle in forward time. Wᵘ: leave it. The stable manifold can separate a small return from a large excursion, even when both return to the same rest state."
      : "No saddle at this current; one-dimensional saddle manifolds are absent."
    const [lo, hi] = [-20, this.regime === "saddle" ? 100 : 220]
    this.visibleEvents = this.branch.events.filter((e) => e.I >= lo && e.I <= hi)
    this.$("ml-events").innerHTML = this.visibleEvents
      .map(
        (e, i) =>
          `<button data-event="${i}">${e.kind} · I = ${fmt(e.I, 3)}<small>${e.kind === "Hopf" ? "Re λ = 0, Im λ ≠ 0" : e.kind === "Fold" ? "One eigenvalue reaches 0" : "Real ↔ complex; stability preserved"}</small></button>`,
      )
      .join("")
    const relevant = this.visibleEvents.filter((e) => e.kind !== "Node–focus")
    const nearest = relevant.reduce(
      (best, e) =>
        !best || Math.abs(e.I - this.params.I) < Math.abs(best.I - this.params.I) ? e : best,
      null,
    )
    this.$("ml-context").textContent =
      nearest?.kind === "Hopf"
        ? `Move I through ${nearest ? fmt(nearest.I, 3) : "the Hopf crossing"} and watch Re λ change sign. A damped spiral already has Im λ ≠ 0.`
        : nearest?.kind === "Fold"
          ? `Follow a rest state toward the fold; one eigenvalue slows to zero. Select the saddle to inspect the threshold geometry.`
          : `Select an equilibrium and vary current to follow its eigenvalues.`
  }
  async share() {
    const query = new URLSearchParams({
      ml: this.regime,
      ...Object.fromEntries(Object.entries(this.params).map(([k, v]) => [k, fmt(v, 8)])),
      eq: fmt(this.selectedV, 8),
      amplitude: this.amplitude,
      angle: this.angle,
    })
    const url = new URL(location.href)
    url.hash = query.toString()
    history.replaceState(null, "", url)
    try {
      await navigator.clipboard.writeText(url.href)
      this.$("ml-status").textContent = "Link copied."
    } catch {
      this.$("ml-status").textContent =
        "Parameters saved in the address bar. Copy its URL to share."
    }
  }
  play() {
    if (this.time >= this.duration) this.time = 0
    this.playing = true
    this.$("ml-play").textContent = "Pause"
    this.$("ml-play").setAttribute("aria-label", "Pause trajectory")
    let previous = performance.now()
    const tick = (now) => {
      if (!this.playing || this.dead) return
      this.time = Math.min(this.duration, this.time + Math.min(now - previous, 60) * 0.12)
      previous = now
      this.syncTime()
      this.render()
      if (this.time >= this.duration) this.pause()
      else this.animation = requestAnimationFrame(tick)
    }
    this.animation = requestAnimationFrame(tick)
  }
  pause() {
    this.playing = false
    cancelAnimationFrame(this.animation)
    this.$("ml-play").textContent = "Play"
    this.$("ml-play").setAttribute("aria-label", "Play trajectory")
  }
  scheduleRender() {
    if (this.dead || this.frame) return
    this.frame = requestAnimationFrame(() => {
      this.frame = null
      if (!this.dead) this.render()
    })
  }
  colors() {
    const css = getComputedStyle(this.root)
    return Object.fromEntries([
      ...[
        "light",
        "lightgray",
        "gray",
        "darkgray",
        "dark",
        "pine",
        "rust",
        "slate",
        "ochre",
        "clay",
        "mauve",
      ].map((k) => [k, css.getPropertyValue(`--${k}`).trim()]),
      ["font", css.fontFamily],
    ])
  }
  stabilityColor(e, c) {
    return e.type === "Saddle" ? c.mauve : e.type.startsWith("Stable") ? c.pine : c.rust
  }
  render() {
    if (!this.eq) return
    const c = this.colors()
    this.renderPhase(c)
    this.renderSpectrum(c)
    this.renderLocal(c)
    this.renderBranch(c)
    this.renderTraceDet(c)
  }
  renderPhase(c) {
    const plot = this.plots["phase-canvas"],
      eq = this.eq
    const bounds = this.zoomed
      ? [eq.point[0] - 15, eq.point[0] + 15, eq.point[1] - 0.075, eq.point[1] + 0.075]
      : [-85, 55, -0.03, 0.72]
    if (!plot.begin(bounds, c, "V · mV", "n · K⁺ activation")) return
    const [xmin, xmax, ymin, ymax] = bounds
    if (this.$("ml-field").checked) {
      for (let i = 0; i <= 22; i++)
        for (let j = 0; j <= 12; j++) {
          const x = xmin + ((xmax - xmin) * (i + 0.25)) / 23,
            y = ymin + ((ymax - ymin) * (j + 0.25)) / 13
          const f = field([x, y], this.params)
          const norm = Math.hypot(f[0] / (xmax - xmin), f[1] / (ymax - ymin))
          if (norm < 1e-10) continue
          plot.arrow([x, y], [x + (0.017 * f[0]) / norm, y + (0.017 * f[1]) / norm], c.gray, 3)
        }
    }
    if (this.$("ml-nullclines").checked) {
      const n = [],
        v = [],
        p = this.params
      for (let i = 0; i <= 700; i++) {
        const voltage = xmin + ((xmax - xmin) * i) / 700
        n.push([voltage, nInf(voltage, p)])
        const denominator = p.gK * (voltage - p.EK)
        const value =
          (p.I -
            p.gCa * activation(voltage, p.V1, p.V2) * (voltage - p.ECa) -
            p.gL * (voltage - p.EL)) /
          denominator
        v.push(Math.abs(denominator) < 0.5 || Math.abs(value) > 8 ? null : [voltage, value])
      }
      plot.line(v, c.slate, 2)
      plot.line(n, c.clay, 2)
    }
    if (this.$("ml-manifolds").checked)
      for (const path of this.manifoldPaths) {
        const color = path.stable ? c.pine : c.rust
        plot.line(
          path.data.map((p) => p.x),
          color,
          2,
          path.stable ? [] : [6, 3],
        )
        // Pick arrow positions by distance on the screen, not integration time.
        let last = plot.xy(path.data[0].x),
          distance = 0
        for (let i = 1; i < path.data.length; i++) {
          const point = plot.xy(path.data[i].x)
          distance += Math.hypot(point[0] - last[0], point[1] - last[1])
          last = point
          if (distance < 65) continue
          distance = 0
          const a = path.data[Math.max(0, i - 4)].x,
            b = path.data[i].x
          plot.arrow(path.stable ? b : a, path.stable ? a : b, color, 6)
        }
      }
    if (this.$("ml-vectors").checked) this.drawVectors(plot, eq, c, false)
    plot.line(
      this.local.data.map((p) => p.x),
      c.ochre,
      1.5,
    )
    this.paths.forEach((p) => {
      plot.line(
        p.data.map((d) => d.x),
        c[p.color],
        2,
      )
      plot.dot(p.data[0].x, c[p.color], 3)
    })
    this.equilibria.forEach((e, i) => {
      const color = this.stabilityColor(e, c)
      if (e === eq) plot.dot(e.point, c.dark, 8, false)
      plot.dot(e.point, color, 4, e.type.startsWith("Stable"), `${i + 1}`)
    })
    const now = this.local.data[Math.min(Math.round(this.time * 2), this.local.data.length - 1)]
    plot.dot(now.x, c.ochre, 4)
  }
  drawVectors(plot, eq, c, local) {
    for (const { lambda, v } of eq.vectors) {
      const center = local ? [0, 0] : eq.point
      const scale = local ? this.localRange * 0.85 : 0.5
      const vec = local ? [v[0] / 20, v[1] / 0.2] : v
      const a = center.map((x, i) => x - scale * vec[i]),
        b = center.map((x, i) => x + scale * vec[i])
      const color = lambda < 0 ? c.pine : c.rust
      plot.line([a, b], color, 1.2, [3, 4])
      for (const sign of [-1, 1]) {
        const near = center.map((x, i) => x + sign * scale * 0.38 * vec[i])
        const far = center.map((x, i) => x + sign * scale * 0.75 * vec[i])
        plot.arrow(lambda < 0 ? far : near, lambda < 0 ? near : far, color, 5)
      }
    }
  }
  renderSpectrum(c) {
    const plot = this.plots["ml-spectrum"],
      e = this.eq
    const scale =
      Math.max(0.15, ...e.values.flatMap((v) => v.map((x) => Math.ceil(Math.abs(x) * 10) / 10))) *
      1.15
    if (!plot.begin([-scale, scale, -scale, scale], c, "Re λ · ms⁻¹", "Im λ · rad/ms", 2)) return
    plot.clip((ctx) => {
      const r = plot.rect,
        x = plot.xy([0, 0])[0]
      ctx.globalAlpha = 0.055
      ctx.fillStyle = c.pine
      ctx.fillRect(r.l, r.t, x - r.l, r.b - r.t)
      ctx.fillStyle = c.rust
      ctx.fillRect(x, r.t, r.r - x, r.b - r.t)
    })
    plot.label([-scale * 0.92, scale * 0.76], "decay", c.pine)
    plot.label([scale * 0.92, scale * 0.76], "growth", c.rust, "right")
    // A faint nearby locus shows which way this branch crosses the imaginary axis.
    const nearby = this.branch.samples.filter((s) => Math.abs(s.point[0] - e.point[0]) < 7)
    for (let i = 0; i < 2; i++)
      plot.line(
        nearby.map((s) => s.values[i]),
        c.lightgray,
        2,
      )
    e.values.forEach((value, i) => {
      plot.line([[0, value[1]], value, [value[0], 0]], c.mauve, 1, [3, 3])
      plot.dot(
        value,
        value[0] < -1e-8 ? c.pine : value[0] > 1e-8 ? c.rust : c.darkgray,
        5,
        true,
        `λ${i + 1}`,
      )
    })
    if (e.disc < 0) {
      plot.label([scale * 0.95, -scale * 0.79], "±ω: one conjugate pair", c.mauve, "right")
    }
  }
  renderLocal(c) {
    const plot = this.plots["ml-local"],
      eq = this.eq,
      r = this.localRange
    const local = (x) => [(x[0] - eq.point[0]) / 20, (x[1] - eq.point[1]) / 0.2]
    const index = Math.min(Math.round(this.time * 2), this.local.data.length - 1)
    const nonlinearNow = this.local.data[index],
      linearDelta = linearFlow(eq.J, this.delta, this.time)
    const aspect = Math.max(
      0.6,
      (plot.canvas.getBoundingClientRect().width - 73) /
        (plot.canvas.getBoundingClientRect().height - 64),
    )
    const rx = r * aspect
    if (plot.begin([-rx, rx, -r, r], c, "δV / 20 mV", "δn / 0.2")) {
      const initialCircle = [],
        deformedCircle = []
      for (let i = 0; i <= 80; i++) {
        const a = (2 * Math.PI * i) / 80,
          x = [this.amplitude * Math.cos(a), (this.amplitude / 100) * Math.sin(a)]
        initialCircle.push([x[0] / 20, x[1] / 0.2])
        const y = linearFlow(eq.J, x, this.time)
        deformedCircle.push([y[0] / 20, y[1] / 0.2])
      }
      plot.line(initialCircle, c.gray, 1, [2, 4])
      plot.line(deformedCircle, c.slate, 1)
      this.drawVectors(plot, eq, c, true)
      plot.line(
        this.local.data.slice(0, index + 1).map((d) => local(d.x)),
        c.ochre,
        2,
      )
      plot.line(
        this.linear.slice(0, index + 1).map((d) => local(d.x)),
        c.slate,
        1.7,
        [6, 4],
      )
      plot.dot([0, 0], c.dark, 3)
      plot.dot(local(this.initial), c.darkgray, 3, false)
      plot.dot(local(nonlinearNow.x), c.ochre, 4)
      plot.dot([linearDelta[0] / 20, linearDelta[1] / 0.2], c.slate, 4, false)
      if (
        Math.abs(local(nonlinearNow.x)[0]) > rx ||
        Math.abs(local(nonlinearNow.x)[1]) > r ||
        Math.abs(linearDelta[0] / 20) > rx ||
        Math.abs(linearDelta[1] / 0.2) > r
      )
        plot.label(
          [rx * 0.94, r * 0.82],
          "Outside local view · fit or reduce t",
          c.darkgray,
          "right",
        )
    }
    const ts = this.plots["ts-canvas"]
    const volts = [
      ...this.local.data.map((p) => p.x[0]),
      ...this.paths.flatMap((p) => p.data.map((d) => d.x[0])),
      eq.point[0],
    ]
    const low = Math.min(...volts),
      high = Math.max(...volts),
      margin = Math.max(0.3, (high - low) * 0.12)
    if (ts.begin([0, this.duration, low - margin, high + margin], c, "t · ms", "V · mV")) {
      ts.line(
        [
          [0, eq.point[0]],
          [this.duration, eq.point[0]],
        ],
        c.gray,
        1,
        [2, 4],
      )
      ts.line(
        this.local.data.map((p) => [p.t, p.x[0]]),
        c.ochre,
        2,
      )
      ts.line(
        this.linear.map((p) => [p.t, p.x[0]]),
        c.slate,
        1.6,
        [6, 4],
      )
      this.paths.forEach((p) =>
        ts.line(
          p.data.map((d) => [d.t, d.x[0]]),
          c[p.color],
          1.6,
        ),
      )
      ts.line(
        [
          [this.time, low - margin],
          [this.time, high + margin],
        ],
        c.gray,
        1,
      )
      ts.dot([nonlinearNow.t, nonlinearNow.x[0]], c.ochre, 4)
      const linearV = eq.point[0] + linearDelta[0]
      ts.dot([this.time, linearV], c.slate, 4, false)
      if (linearV < low - margin || linearV > high + margin)
        ts.label([this.duration * 0.98, high], "Linear prediction outside view", c.slate, "right")
    }
    const linearV = eq.point[0] + linearDelta[0]
    const error = Math.abs(nonlinearNow.x[0] - linearV)
    const stopped = nonlinearNow.t + 0.5 < this.time
    const invalid =
      this.initial[1] < 0 || this.initial[1] > 1
        ? " Initial n is outside [0, 1]; this is a formal ODE perturbation."
        : ""
    this.$("ml-local-note").textContent =
      `δV₀ = ${fmt(this.delta[0], 2)} mV, δn₀ = ${fmt(this.delta[1], 4)}. Voltage error at t = ${fmt(this.time, 1)} ms: ${stopped ? "unavailable (full trajectory left the bounds)" : error > 1e4 ? error.toExponential(2) + " mV" : fmt(error, 4) + " mV"}. The thin ellipse is a perturbation circle transported by exp(Jt); its axes use 20 mV and 0.2 n.${invalid}`
  }
  segment(v) {
    return this.branch.folds.filter((f) => v > f + 1e-7).length
  }
  renderBranch(c) {
    const plot = this.plots["bifurc-canvas"],
      [lo, hi] = this.currentBounds
    const samples = this.branch.samples.filter((e) => e.I >= lo - 5 && e.I <= hi + 5)
    const vmin = Math.min(...samples.map((e) => e.point[0])) - (this.focusWindow ? 2 : 5),
      vmax = Math.max(...samples.map((e) => e.point[0])) + (this.focusWindow ? 2 : 5)
    if (
      plot.begin(
        [lo, hi, Math.floor(vmin / 10) * 10, Math.ceil(vmax / 10) * 10],
        c,
        "I · µA/cm²",
        "Equilibrium V* · mV",
      )
    ) {
      for (let i = 1; i < samples.length; i++) {
        const a = samples[i - 1],
          b = samples[i]
        if (b.point[0] - a.point[0] > 0.3) continue
        plot.line(
          [
            [a.I, a.point[0]],
            [b.I, b.point[0]],
          ],
          this.stabilityColor(a, c),
          2,
          a.type.startsWith("Stable") ? [] : [3, 3],
        )
      }
      const [, , ymin, ymax] = plot.bounds
      plot.line(
        [
          [this.params.I, ymin],
          [this.params.I, ymax],
        ],
        c.gray,
        1,
      )
      this.visibleEvents
        .filter((e) => e.kind !== "Node–focus")
        .forEach((e) => {
          plot.dot([e.I, e.point[0]], c.darkgray, 4, false, e.kind === "Hopf" ? "H" : "SN")
        })
      this.equilibria.forEach((e, i) =>
        plot.dot(
          [this.params.I, e.point[0]],
          this.stabilityColor(e, c),
          e === this.eq ? 6 : 3,
          e.type.startsWith("Stable"),
          e === this.eq ? `${i + 1}` : null,
        ),
      )
    }
    const eigen = this.plots["ml-eigen-branch"]
    const segment = this.segment(this.eq.point[0])
    const selected = samples.filter((s) => this.segment(s.point[0]) === segment)
    const values = selected.flatMap((e) => [...e.values.map((v) => v[0]), e.omega])
    const min = Math.min(-0.025, ...values),
      max = Math.max(0.025, ...values)
    const pad = (max - min) * 0.18
    if (eigen.begin([lo, hi, min - pad, max + pad], c, "I · µA/cm²", "λ · ms⁻¹")) {
      for (let i = 0; i < 2; i++)
        eigen.line(
          selected.map((e) => [e.I, e.values[i][0]]),
          c.pine,
          1.8,
          i ? [3, 3] : [],
        )
      eigen.line(
        selected.map((e) => [e.I, e.omega]),
        c.mauve,
        2,
      )
      eigen.label([lo + (hi - lo) * 0.04, max + pad * 0.35], "Re λ₁,₂", c.pine)
      eigen.label([lo + (hi - lo) * 0.3, max + pad * 0.35], "|Im λ|", c.mauve)
      eigen.line(
        [
          [this.params.I, min - pad],
          [this.params.I, max + pad],
        ],
        c.gray,
        1,
      )
      this.eq.values.forEach((v) => eigen.dot([this.params.I, v[0]], c.pine, 4))
      eigen.dot([this.params.I, this.eq.omega], c.mauve, 4)
      this.visibleEvents
        .filter((e) => e.kind !== "Node–focus" && this.segment(e.point[0]) === segment)
        .forEach((e) => {
          eigen.line(
            [
              [e.I, min - pad],
              [e.I, max],
            ],
            c.gray,
            0.8,
            [2, 4],
          )
        })
    }
  }
  renderTraceDet(c) {
    if (!this.root.querySelector(".ml-determinant").open) return
    const plot = this.plots["ml-trace-det"],
      e = this.eq
    const x = Math.max(0.2, Math.abs(e.trace) * 1.3),
      y = Math.max(0.02, Math.abs(e.det) * 1.5)
    if (!plot.begin([-x, x, -y * 0.4, y], c, "τ = tr J · ms⁻¹", "D = det J · ms⁻²")) return
    const parabola = Array.from({ length: 161 }, (_, i) => {
      const t = -x + (2 * x * i) / 160
      return [t, (t * t) / 4]
    })
    plot.line(parabola, c.mauve, 1.5)
    plot.label([-x * 0.95, y * 0.86], "stable focus", c.pine)
    plot.label([x * 0.95, y * 0.86], "unstable focus", c.rust, "right")
    plot.label([-x * 0.95, -y * 0.25], "saddle · D < 0", c.mauve)
    plot.label([-x * 0.95, y * 0.07], "node", c.pine)
    plot.label([x * 0.95, y * 0.07], "node", c.rust, "right")
    const nearby = this.branch.samples.filter((s) => Math.abs(s.point[0] - e.point[0]) < 12)
    plot.line(
      nearby.map((s) => [s.trace, s.det]),
      c.slate,
      1.5,
      [3, 3],
    )
    plot.dot([e.trace, e.det], this.stabilityColor(e, c), 6)
  }
  destroy() {
    this.dead = true
    this.abort.abort()
    this.resize.disconnect()
    this.themeObserver.disconnect()
    cancelAnimationFrame(this.frame)
    cancelAnimationFrame(this.animation)
  }
}
