;(() => {
  if (window.__ewanTimeline) return
  window.__ewanTimeline = true

  const PITCH = 6
  const DAY = 864e5
  const MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ")
  let data = null
  let switcher = null
  let lastBuzz = 0

  const load = (url) =>
    (data ??= fetch(url, { cache: "no-cache" })
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status))
        return r.json()
      })
      .catch((error) => {
        data = null
        throw error
      }))

  const dayIndex = (iso) =>
    Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10)) / DAY
  const today = () => {
    const d = new Date()
    return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY
  }
  const esc = (s) =>
    String(s).replace(
      /[&<>"]/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
    )
  // One note already stands twice as tall as an empty day; more grow by the square root.
  const seg = (count, base, cap) =>
    Math.min(cap, Math.round(base * (1 + 0.9 * (Math.sqrt(count) - 1))))
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))

  // A detent under the finger: the Vibration API where there is one; on iOS,
  // toggling a native switch plays the system haptic.
  function buzz() {
    const now = performance.now()
    if (now - lastBuzz < 45) return
    lastBuzz = now
    if (typeof navigator.vibrate === "function") {
      navigator.vibrate(6)
      return
    }
    if (!switcher?.isConnected) {
      switcher = document.createElement("label")
      switcher.setAttribute("aria-hidden", "true")
      switcher.style.cssText =
        "position:fixed;left:0;top:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none"
      const input = document.createElement("input")
      input.type = "checkbox"
      input.tabIndex = -1
      input.setAttribute("switch", "")
      switcher.append(input)
      document.documentElement.append(switcher)
    }
    switcher.click()
  }

  function go(url, event) {
    if (event?.metaKey || event?.ctrlKey) window.open(url, "_blank", "noopener")
    else if (window.spaNavigate) window.spaNavigate(new URL(url))
    else location.assign(url)
  }

  function build(root, json, on) {
    const src = new URL(root.dataset.src, location.href)
    const base = new URL("../", src)
    const { notes, events } = json
    if (!events.length) throw new Error("empty")
    const first = dayIndex(events[0][0])
    const n = Math.max(today(), dayIndex(events.at(-1)[0])) - first + 1
    const days = new Array(n).fill(null)
    for (const [iso, k, note, label, anchor] of events) {
      const i = dayIndex(iso) - first
      if (i >= 0 && i < n) (days[i] ??= []).push({ k, note, label, anchor })
    }

    let html = ""
    for (let i = 0; i < n; i++) {
      const date = new Date((first + i) * DAY)
      const month = date.getUTCDate() === 1
      const list = days[i]
      let inner = '<i class="nt-t"></i>'
      if (list) {
        const created = list.filter((e) => !e.k).length
        const updated = list.length - created
        inner =
          (created ? `<i class="nt-n" style="height:${seg(created, 11, 34)}px"></i>` : "") +
          (updated ? `<i class="nt-u" style="height:${seg(updated, 8, 12)}px"></i>` : "")
      }
      html += `<span class="nt-d" style="--i:${i}"${list ? " data-a" : ""}${month ? " data-m" : ""}>${inner}</span>`
      const m = date.getUTCMonth()
      const roomy = i === 0 && 32 - date.getUTCDate() > 10
      if (month || roomy) {
        const text =
          m === 0
            ? date.getUTCFullYear()
            : i === 0
              ? `${MONTHS[m]} ${date.getUTCFullYear()}`
              : MONTHS[m]
        html += `<span class="nt-m" style="--i:${i}">${text}</span>`
      }
    }

    root.innerHTML =
      `<div class="nt-scroll" tabindex="0" role="group" aria-label="Notes by day">` +
      `<div class="nt-track" style="width:calc(var(--nt-pad) * 2 + ${n} * var(--nt-pitch))">` +
      `<span class="nt-cursor"></span>${html}</div></div>` +
      `<div class="nt-card" aria-live="polite"></div>`
    const scroll = root.querySelector(".nt-scroll")
    const track = root.querySelector(".nt-track")
    const card = root.querySelector(".nt-card")
    const dayEls = track.querySelectorAll(".nt-d")
    const touch = matchMedia("(hover: none)").matches
    const active = days.flatMap((d, i) => (d ? [i] : []))
    let pad = 0
    let sel = -1
    let pinned = false
    let hoverX = null
    let lifted = []

    const href = (e) => new URL(notes[e.note][0] + (e.anchor ? `#${e.anchor}` : ""), base).href
    const dayAt = (x) =>
      clamp(Math.floor((x - track.getBoundingClientRect().left - pad) / PITCH), 0, n - 1)
    // Days with notes pull the cursor from two days away.
    const snap = (i) => {
      if (days[i]) return i
      for (let d = 1; d <= 2; d++) {
        if (days[i - d]) return i - d
        if (days[i + d]) return i + d
      }
      return i
    }

    function lift(c) {
      for (const el of lifted) el.style.transform = ""
      lifted = []
      if (c < 0) return
      for (let d = -4; d <= 4; d++) {
        const el = dayEls[c + d]
        if (!el) continue
        el.style.transform = `scaleY(${(1 + 0.25 * Math.exp(-(d * d) / 3)).toFixed(3)})`
        lifted.push(el)
      }
    }

    function place() {
      if (sel < 0) return
      const x = pad + sel * PITCH + PITCH / 2 - scroll.scrollLeft
      const width = card.offsetWidth
      root.style.setProperty("--x", `${clamp(x - width / 2, 0, root.clientWidth - width)}px`)
    }

    function render(i) {
      const date = new Date((first + i) * DAY)
      const list = days[i] ?? []
      card.innerHTML =
        `<time>${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}</time>` +
        (list.length
          ? `<ul>${list
              .map((e) => {
                const sub = e.k && e.label && !/^update$/i.test(e.label) ? e.label : ""
                return (
                  `<li><a href="${esc(href(e))}"><span class="nt-k" data-k="${e.k}">${e.k ? "update" : "new"}</span>` +
                  `${esc(notes[e.note][1])}${sub ? `<span class="nt-sub"> — ${esc(sub)}</span>` : ""}</a></li>`
                )
              })
              .join("")}</ul>`
          : "")
      card.scrollTop = 0
    }

    function select(i) {
      if (i === sel) return false
      dayEls[sel]?.classList.remove("on")
      sel = i
      lift(i)
      if (i < 0) {
        delete root.dataset.active
        return true
      }
      dayEls[i].classList.add("on")
      root.style.setProperty("--c", String(i))
      render(i)
      root.dataset.active = ""
      place()
      return true
    }

    const unpin = () => {
      pinned = false
      delete root.dataset.pinned
    }

    function activate(i, event) {
      const list = days[i]
      if (pinned && i === sel) return unpin()
      unpin()
      if (list?.length === 1) return go(href(list[0]), event)
      select(i)
      if (list) {
        pinned = true
        root.dataset.pinned = ""
      }
    }

    function reveal(i) {
      const x = pad + i * PITCH
      if (touch) scroll.scrollLeft = i * PITCH
      else if (x < scroll.scrollLeft + 24 || x > scroll.scrollLeft + scroll.clientWidth - 24)
        scroll.scrollLeft = x - scroll.clientWidth / 2
    }

    const edges = () => {
      const max = scroll.scrollWidth - scroll.clientWidth
      scroll.toggleAttribute("data-start", scroll.scrollLeft > 1)
      scroll.toggleAttribute("data-end", scroll.scrollLeft < max - 1)
    }

    const setPad = () => {
      pad = touch ? Math.max(0, scroll.clientWidth / 2 - PITCH / 2) : 0
      root.style.setProperty("--nt-pad", `${pad}px`)
    }

    if (touch) root.dataset.touch = ""
    setPad()
    scroll.scrollLeft = scroll.scrollWidth
    edges()
    root.dataset.state = "ready"

    on(window, "resize", () => {
      setPad()
      edges()
      place()
    })
    on(document, "pointerdown", (e) => {
      if (root.contains(e.target)) return
      unpin()
      select(-1)
    })

    let frame = 0
    on(
      scroll,
      "scroll",
      () => {
        if (frame) return
        frame = requestAnimationFrame(() => {
          frame = 0
          edges()
          if (touch) {
            if (!root.hasAttribute("data-engaged")) return
            const i = clamp(Math.round(scroll.scrollLeft / PITCH), 0, n - 1)
            if (select(i) && days[i]) buzz()
          } else if (hoverX !== null && !pinned) select(snap(dayAt(hoverX)))
          else place()
        })
      },
      { passive: true },
    )

    if (touch) {
      on(scroll, "touchstart", () => (root.dataset.engaged = ""), { passive: true })
      on(scroll, "click", (e) => {
        root.dataset.engaged = ""
        const i = snap(dayAt(e.clientX))
        if (i === sel && days[i]?.length === 1) return go(href(days[i][0]), e)
        scroll.scrollTo({ left: i * PITCH, behavior: "smooth" })
        if (select(i) && days[i]) buzz()
      })
    } else {
      let drag = null
      on(scroll, "pointerdown", (e) => {
        if (e.pointerType === "touch" || e.button !== 0) return
        drag = { x: e.clientX, left: scroll.scrollLeft, moved: false }
      })
      on(scroll, "pointermove", (e) => {
        if (e.pointerType === "touch") return
        hoverX = e.clientX
        if (drag) {
          const dx = e.clientX - drag.x
          if (!drag.moved && Math.abs(dx) > 4) {
            drag.moved = true
            scroll.dataset.dragging = ""
            scroll.setPointerCapture(e.pointerId)
          }
          if (drag.moved) {
            scroll.scrollLeft = drag.left - dx
            return
          }
        }
        if (!pinned) select(snap(dayAt(e.clientX)))
      })
      on(scroll, "pointerup", (e) => {
        if (e.pointerType === "touch") return
        const d = drag
        drag = null
        delete scroll.dataset.dragging
        if (d && !d.moved) activate(snap(dayAt(e.clientX)), e)
      })
      on(scroll, "pointerleave", (e) => {
        if (e.pointerType === "touch" || drag?.moved) return
        hoverX = null
        if (!pinned) select(-1)
      })
    }

    on(scroll, "keydown", (e) => {
      let i = -1
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const dir = e.key === "ArrowRight" ? 1 : -1
        const from = sel >= 0 ? sel : dir > 0 ? -1 : n
        i =
          dir > 0 ? (active.find((a) => a > from) ?? -1) : (active.findLast((a) => a < from) ?? -1)
      } else if (e.key === "Home") i = active[0]
      else if (e.key === "End") i = active.at(-1)
      else if (e.key === "Enter" && sel >= 0) {
        e.preventDefault()
        activate(sel, e)
        if (pinned) card.querySelector("a")?.focus()
        return
      } else if (e.key === "Escape") {
        unpin()
        select(-1)
        return
      } else return
      e.preventDefault()
      if (i < 0) return
      unpin()
      reveal(i)
      select(i)
    })
    on(root, "keydown", (e) => {
      if (e.key !== "Escape" || !card.contains(e.target)) return
      unpin()
      scroll.focus()
    })
    on(root, "focusout", (e) => {
      if (root.contains(e.relatedTarget)) return
      unpin()
      if (hoverX === null) select(-1)
    })
  }

  function mount(root, ready) {
    const controller = new AbortController()
    const on = (target, type, fn, options) =>
      target.addEventListener(type, fn, { ...options, signal: controller.signal })
    load(new URL(root.dataset.src, location.href).href)
      .then((json) => {
        if (controller.signal.aborted) return
        build(root, json, on)
        ready?.()
      })
      .catch(() => {
        if (!controller.signal.aborted) root.dataset.state = "error"
      })
    return () => controller.abort()
  }

  // The toolbar's strip opens below the header rule, pushing the page down. The
  // panel renders inside the toolbar and moves after the header bar here, and
  // back before the next navigation so the page swap sees the rendered layout.
  // The strip is built on first open, once it has a width to lay out against.
  function wire(button, drop) {
    const controller = new AbortController()
    const on = (target, type, fn, options) =>
      target.addEventListener(type, fn, { ...options, signal: controller.signal })
    const home = drop.parentElement
    const bar = button.closest(".sticky-header-bar")
    // The bar's bottom margin moves below the drop, so it opens right at the rule
    // and leaves the page exactly as it was when closed.
    const seat = () => {
      if (!bar) return
      bar.style.marginBottom = ""
      drop.style.marginBottom = getComputedStyle(bar).marginBottom
      bar.style.marginBottom = "0px"
    }
    bar?.after(drop)
    seat()
    const root = drop.querySelector(".note-timeline")
    const focus = () => root.querySelector(".nt-scroll")?.focus({ preventScroll: true })
    let built = null
    let settle = 0
    const isOpen = () => drop.hasAttribute("data-open")
    const set = (open) => {
      button.setAttribute("aria-expanded", String(open))
      drop.toggleAttribute("data-open", open)
      drop.removeAttribute("data-settled")
      clearTimeout(settle)
      if (!open) return
      settle = setTimeout(() => drop.setAttribute("data-settled", ""), 320)
      if (built) focus()
      else built = mount(root, focus)
    }
    on(button, "click", () => set(!isOpen()))
    on(window, "resize", seat)
    // The first Escape clears a selected day, the next closes the drop.
    on(
      document,
      "keydown",
      (e) => {
        if (e.key !== "Escape" || !isOpen()) return
        if (root.hasAttribute("data-active") && drop.contains(e.target)) return
        set(false)
        button.focus()
      },
      { capture: true },
    )
    return () => {
      controller.abort()
      clearTimeout(settle)
      built?.()
      set(false)
      if (bar) bar.style.marginBottom = ""
      drop.style.marginBottom = ""
      if (home?.isConnected) home.append(drop)
    }
  }

  let stops = []
  function teardown() {
    for (const stop of stops) stop()
    stops = []
  }
  function init() {
    teardown()
    for (const root of document.querySelectorAll(".note-timeline[data-src]:not([data-lazy])"))
      stops.push(mount(root))
    const button = document.querySelector(".nt-toggle")
    const drop = button && document.getElementById(button.getAttribute("aria-controls"))
    if (drop) stops.push(wire(button, drop))
  }

  document.addEventListener("nav", init)
  document.addEventListener("prenav", teardown)
  if (document.readyState !== "loading") init()
})()
