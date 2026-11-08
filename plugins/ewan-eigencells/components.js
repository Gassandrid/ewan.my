import { h } from "preact"
import { eigencells } from "./eigencells.js"
import { POOL } from "./pool.js"

// The culture grows on the homepage alone, so its solver and pool are a
// module of their own (emitted by index.js) rather than part of every page's
// scripts; the homepage announces it up front with a modulepreload.
export const MODULE_PATH = "static/ewan-eigencells.js"

// The banner slot stays the florilegium embed (ewan-svg-embeds), so the boats
// remain the no-script fallback and disabling this plugin restores them. The
// slot override lives in custom.scss: component CSS is layered and loses to it.
const CSS = `
.florilegium-banner>canvas.eigencells{position:absolute;inset:0;width:100%;height:100%;display:block;opacity:var(--eigencells-ink,.86)}
`

// Grows one culture per visit. Each placed cell condenses out of scattered
// eigenvalues: its points arrive in SLICES even dustings over REVEAL ms, all
// cells at once, so the strip fills in like a plate under the microscope.
// Click to reseed; ?cells=<seed> reproduces a culture.
function eigencellsRuntime(eigencells, POOL) {
  const E = eigencells(POOL),
    PER_PIXEL = 6,
    SCALE = 2,
    GAIN = 1.0,
    SLICES = 48,
    REVEAL = 3000,
    BUDGET = 10,
    motion = matchMedia("(prefers-reduced-motion: reduce)")
  let job = null

  function ink() {
    const probe = document.createElement("canvas").getContext("2d")
    probe.fillStyle =
      getComputedStyle(document.documentElement).getPropertyValue("--dark").trim() || "#303B49"
    probe.fillRect(0, 0, 1, 1)
    return Array.from(probe.getImageData(0, 0, 1, 1).data.slice(0, 3))
  }

  function grow(host, seed) {
    let canvas = host.querySelector("canvas.eigencells")
    if (!canvas) {
      canvas = document.createElement("canvas")
      canvas.className = "eigencells"
      canvas.setAttribute("role", "img")
      host.appendChild(canvas)
    }
    host.querySelector("img")?.setAttribute("aria-hidden", "true")
    canvas.dataset.seed = String(seed)
    canvas.dataset.state = "growing"
    canvas.setAttribute(
      "aria-label",
      "A culture of Eigenfish cells: eigenvalue clouds of random matrices, grown anew on each visit",
    )
    const ctx = canvas.getContext("2d")
    const aspect = host.clientWidth / Math.max(host.clientHeight, 1) || 296460 / 46009
    // the smallest cell stays ~26 CSS px across, so a phone grows fewer, larger cells
    const small = Math.min(0.3, Math.max(0.11, 13 / Math.max(host.clientHeight, 1)))
    const colony = E.culture(seed, aspect, { small, fullness: 0.72 })
    const cells = []
    // cells still condensing: { gen, born, slices developed so far }
    let growing = [],
      placing = true,
      turn = 0,
      w = 0,
      h = 0,
      buf = null,
      image = null,
      color = ink(),
      done = false,
      stopped = false,
      frame = 0,
      resizeTimer = 0

    function allocate() {
      // always 2x: supersampling keeps the stipple fine on 1x screens too
      w = Math.max(1, Math.round(host.clientWidth * SCALE))
      h = Math.max(1, Math.round(w / aspect))
      canvas.width = w
      canvas.height = h
      buf = new Float32Array(w * h)
      image = ctx.createImageData(w, h)
      // a resize lands every placed cell at once; the unplaced still condense
      growing = []
      for (const cell of cells) E.develop(cell, buf, w, h, PER_PIXEL)
    }
    function paint() {
      E.paint(buf, w, h, PER_PIXEL, color, GAIN, image.data)
      ctx.putImageData(image, 0, 0)
    }
    function place(until) {
      while (placing && performance.now() < until) {
        const next = colony.cells.next()
        if (next.done) placing = false
        else if (next.value) {
          cells.push(next.value)
          growing.push({
            gen: E.developing(next.value, buf, w, h, PER_PIXEL, SLICES),
            born: performance.now(),
            slices: 0,
          })
        }
      }
    }
    // Round-robin one slice at a time, each cell held to its share of the
    // reveal clock (eased in, so the scatter lingers before it condenses).
    // With reduced motion the clock is ignored and the culture appears grown.
    function condense(until) {
      let moved = true
      while (moved && growing.length && performance.now() < until) {
        moved = false
        const now = performance.now()
        for (let n = 0; n < growing.length && performance.now() < until; n++) {
          const g = growing[(turn + n) % growing.length],
            t = Math.min(1, (now - g.born) / REVEAL),
            due = motion.matches ? SLICES + 1 : Math.ceil(SLICES * t * t) + (t >= 1)
          if (g.slices >= due) continue
          g.slices++
          moved = true
          if (g.gen.next().done) g.slices = Infinity
        }
        turn++
        growing = growing.filter((g) => g.slices !== Infinity)
      }
    }
    // ~10 ms a frame: placement always gets a turn so cells keep arriving
    function step() {
      if (stopped) return
      const begin = performance.now()
      place(begin + BUDGET * 0.3)
      condense(begin + BUDGET)
      place(begin + BUDGET)
      done = !placing && !growing.length
      if (done) {
        canvas.dataset.state = "grown"
        canvas.dataset.cells = String(cells.length)
      }
      if (done || !motion.matches) paint()
      if (!done) frame = requestAnimationFrame(step)
    }
    const theme = new MutationObserver(() => {
      color = ink()
      paint()
    })
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["saved-theme"] })
    const resize = new ResizeObserver(() => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        if (Math.abs(Math.round(host.clientWidth * SCALE) - w) < 2) return
        allocate()
        paint()
      }, 150)
    })
    resize.observe(host)
    canvas.onclick = () => {
      job?.stop()
      job = grow(host, (Math.random() * 4294967296) >>> 0)
    }
    allocate()
    frame = requestAnimationFrame(step)
    return {
      host,
      stop() {
        stopped = true
        cancelAnimationFrame(frame)
        clearTimeout(resizeTimer)
        theme.disconnect()
        resize.disconnect()
      },
    }
  }

  function mount(host) {
    if (job && job.host === host && host?.isConnected) return
    job?.stop()
    job = null
    if (!host) return
    const asked = Number(new URLSearchParams(location.search).get("cells"))
    const seed =
      Number.isFinite(asked) && asked > 0
        ? asked >>> 0
        : crypto.getRandomValues(new Uint32Array(1))[0]
    job = grow(host, seed)
  }
  function stop() {
    job?.stop()
    job = null
  }
  return { mount, stop }
}

export const MODULE_SOURCE = `${eigencells.toString()}
const POOL = ${JSON.stringify(POOL)};
export const { mount, stop } = (${eigencellsRuntime.toString()})(eigencells, POOL);
`

// The only script every page carries: fetch the module where there is a
// banner to grow, and stop the culture when the reader leaves.
const LOADER = `(() => {
  let ticket = 0, current
  const stop = () => { ticket++; current?.stop(); current = undefined }
  document.addEventListener("prenav", stop)
  document.addEventListener("nav", async () => {
    const host = document.querySelector('body[data-slug="index"] .florilegium-banner')
    if (!host) return stop()
    const mine = ++ticket
    try {
      const module = await import(new URL(${JSON.stringify("./" + MODULE_PATH)}, document.baseURI).href)
      if (mine !== ticket || !host.isConnected) return
      current = module
      module.mount(host)
    } catch {}
  })
})();`

export function EigencellsBanner() {
  function Component({ fileData } = {}) {
    if (fileData?.slug !== "index") return null
    return h("link", { rel: "modulepreload", href: `./${MODULE_PATH}` })
  }
  Component.displayName = "EigencellsBanner"
  Component.css = CSS
  Component.beforeDOMLoaded = `document.documentElement.classList.add("eigencells");`
  Component.afterDOMLoaded = LOADER
  return Component
}
