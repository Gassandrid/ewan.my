import { eigencells } from "./eigencells.js"
import { POOL } from "./pool.js"

// The banner slot stays the florilegium embed (ewan-svg-embeds), so the boats
// remain the no-script fallback and disabling this plugin restores them. The
// slot override lives in custom.scss: component CSS is layered and loses to it.
const CSS = `
.florilegium-banner>canvas.eigencells{position:absolute;inset:0;width:100%;height:100%;display:block;opacity:var(--eigencells-ink,.86)}
`

// Grows one culture per visit: cells are placed and developed one per frame,
// so the strip fills in like a plate under the microscope. Click to reseed;
// ?cells=<seed> reproduces a culture.
function eigencellsRuntime(eigencells, POOL) {
  if (window.__ewanEigencells) {
    window.__ewanEigencells.mount()
    return
  }
  const E = eigencells(POOL),
    PER_PIXEL = 6,
    SCALE = 2,
    GAIN = 1.0,
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
    let w = 0,
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
      for (const cell of cells) E.develop(cell, buf, w, h, PER_PIXEL)
    }
    function paint() {
      E.paint(buf, w, h, PER_PIXEL, color, GAIN, image.data)
      ctx.putImageData(image, 0, 0)
    }
    // placement and development interleaved in small slices, ~10 ms a frame
    function* work() {
      for (const cell of colony.cells) {
        if (!cell) {
          yield
          continue
        }
        cells.push(cell)
        yield* E.developing(cell, buf, w, h, PER_PIXEL)
      }
    }
    const pending = work()
    function step() {
      if (stopped) return
      const begin = performance.now()
      while (performance.now() - begin < 10) {
        if (pending.next().done) {
          done = true
          canvas.dataset.state = "grown"
          canvas.dataset.cells = String(cells.length)
          break
        }
      }
      // with reduced motion the culture appears once, fully grown
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

  function mount() {
    const host = document.querySelector('body[data-slug="index"] .florilegium-banner')
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
  document.addEventListener("prenav", () => {
    job?.stop()
    job = null
  })
  document.addEventListener("nav", mount)
  window.__ewanEigencells = { mount }
  mount()
}

export function EigencellsBanner() {
  function Component() {
    return null
  }
  Component.displayName = "EigencellsBanner"
  Component.css = CSS
  Component.beforeDOMLoaded = `document.documentElement.classList.add("eigencells");`
  Component.afterDOMLoaded = `(${eigencellsRuntime.toString()})(${eigencells.toString()},${JSON.stringify(POOL)});`
  return Component
}
