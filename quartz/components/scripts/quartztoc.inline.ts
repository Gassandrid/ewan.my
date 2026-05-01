// QuartzTOC inline behavior — LessWrong-style FixedPositionToC.
//
// The rail represents the article's vertical axis. Both dots and the
// thumb live in the same percentage coordinate system, so when a heading
// is on screen, its dot is inside the thumb by construction.
//
//   --toc-top    (per row)   — heading offset / article height, %
//   --scroll-amount (on toc) — thumb top, % of rail (= scroll progress)
//   --thumb-amount  (on toc) — thumb height, % of rail (= viewport / article)
//
// Active highlight: the heading whose center is closest to (and above)
// 35% of the viewport — matches LW's centerOfElement landmark.

const TOP_LANDMARK = "__top__"

function setupQuartzTOC() {
  const toc = document.getElementById("quartztoc") as HTMLElement | null
  if (!toc) return

  const article =
    (document.querySelector("article") as HTMLElement | null) ??
    (document.querySelector(".center") as HTMLElement | null)

  const rows = Array.from(toc.querySelectorAll(".toc-row[data-for]")) as HTMLElement[]
  const links = Array.from(toc.querySelectorAll("a.toc-link[data-for]")) as HTMLAnchorElement[]
  if (rows.length === 0) return

  const slugToRow = new Map<string, HTMLElement>()
  for (const row of rows) {
    const slug = row.dataset.for
    if (slug) slugToRow.set(slug, row)
  }

  // Skip the synthetic "__top__" row when collecting article headings.
  const headings: { slug: string; el: HTMLElement }[] = []
  for (const row of rows) {
    const slug = row.dataset.for
    if (!slug || slug === TOP_LANDMARK) continue
    const el = document.getElementById(slug)
    if (el) headings.push({ slug, el })
  }
  if (headings.length === 0 && !slugToRow.has(TOP_LANDMARK)) return

  // ── Active-row highlighting ────────────────────────────────────────
  let currentActive: string | null = null
  const setActive = (slug: string | null) => {
    if (slug === currentActive) return
    if (currentActive) {
      const prev = slugToRow.get(currentActive)
      if (prev) prev.classList.remove("is-active")
    }
    if (slug) {
      const row = slugToRow.get(slug)
      if (row) row.classList.add("is-active")
    }
    currentActive = slug
  }

  const computeActive = () => {
    // Topmost heading whose center is at or above 35% of the viewport.
    // If none, the title row is active (we're above the first heading).
    const target = window.innerHeight * 0.35
    let active: string | null = null
    for (const { slug, el } of headings) {
      const rect = el.getBoundingClientRect()
      const center = rect.top + rect.height / 2
      if (center <= target) {
        active = slug
      } else {
        break
      }
    }
    if (!active) {
      active = slugToRow.has(TOP_LANDMARK) ? TOP_LANDMARK : null
    }
    setActive(active)
  }

  // ── Per-row heading-offset positioning ─────────────────────────────
  // Set --toc-top on each row to its heading's percent offset within the
  // article. Title row pins to 0%. Recomputed on resize and after image
  // loads (since heading offsets shift as content reflows).
  const positionRows = () => {
    const titleRow = slugToRow.get(TOP_LANDMARK)
    if (titleRow) titleRow.style.setProperty("--toc-top", "0")

    if (!article || headings.length === 0) return
    const rect = article.getBoundingClientRect()
    const articleTop = rect.top + window.scrollY
    const articleHeight = rect.height
    if (articleHeight <= 0) return

    for (const { slug, el } of headings) {
      const row = slugToRow.get(slug)
      if (!row) continue
      const headingTop = el.getBoundingClientRect().top + window.scrollY
      const offset = Math.max(0, headingTop - articleTop)
      const pct = Math.max(0, Math.min(100, (offset / articleHeight) * 100))
      row.style.setProperty("--toc-top", pct.toFixed(3))
    }
  }

  // ── Thumb: viewport projected onto the article ─────────────────────
  // height % = viewport / article    (capped 2..100)
  // top    % = scrollProgress * (100 - height%)
  // Reference is the article element if present; otherwise document.
  const updateThumb = () => {
    const ref = article ?? document.documentElement
    const refRect = ref.getBoundingClientRect()
    const refHeight = refRect.height
    const viewport = window.innerHeight
    if (refHeight <= 0) {
      toc.style.setProperty("--scroll-amount", "0")
      toc.style.setProperty("--thumb-amount", "0")
      return
    }

    const heightPct = Math.max(2, Math.min(100, (viewport / refHeight) * 100))
    // How far through the reference element we've scrolled (0..1).
    // refRect.top < 0 means the reference top is above the viewport top.
    const scrolled = Math.max(0, -refRect.top)
    const scrollable = Math.max(1, refHeight - viewport)
    const progress = Math.max(0, Math.min(1, scrolled / scrollable))
    const topPct = progress * (100 - heightPct)

    toc.style.setProperty("--scroll-amount", topPct.toFixed(3))
    toc.style.setProperty("--thumb-amount", heightPct.toFixed(3))
  }

  // ── Click → smooth scroll ──────────────────────────────────────────
  const onClick = (evt: MouseEvent) => {
    const anchor = evt.currentTarget as HTMLAnchorElement | null
    if (!anchor) return
    const slug = anchor.dataset.for
    if (!slug) return
    evt.preventDefault()
    if (slug === TOP_LANDMARK) {
      window.scrollTo({ top: 0, behavior: "smooth" })
      history.pushState(null, "", "#")
      setActive(TOP_LANDMARK)
      return
    }
    const el = document.getElementById(slug)
    if (!el) return
    el.scrollIntoView({ behavior: "smooth", block: "start" })
    history.pushState(null, "", `#${slug}`)
    setActive(slug)
  }

  for (const a of links) {
    a.addEventListener("click", onClick)
    window.addCleanup(() => a.removeEventListener("click", onClick))
  }

  // ── rAF-throttled scroll/resize handlers ───────────────────────────
  let ticking = false
  const onScroll = () => {
    if (ticking) return
    ticking = true
    window.requestAnimationFrame(() => {
      computeActive()
      updateThumb()
      ticking = false
    })
  }

  const onResize = () => {
    positionRows()
    onScroll()
  }

  document.addEventListener("scroll", onScroll, { passive: true })
  window.addEventListener("resize", onResize, { passive: true })
  window.addCleanup(() => {
    document.removeEventListener("scroll", onScroll)
    window.removeEventListener("resize", onResize)
  })

  // Initial pass.
  positionRows()
  computeActive()
  updateThumb()

  // Images and KaTeX shift heading offsets after first paint — re-measure
  // once everything has settled.
  const reflow = () => {
    positionRows()
    onScroll()
  }
  if (document.readyState !== "complete") {
    window.addEventListener("load", reflow, { once: true })
    window.addCleanup(() => window.removeEventListener("load", reflow))
  } else {
    setTimeout(reflow, 100)
  }
}

document.addEventListener("nav", setupQuartzTOC)
