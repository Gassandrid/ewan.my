;(function () {
  if (window.__ewanTelemetry) return
  window.__ewanTelemetry = true

  function track(event, props) {
    window.plausible?.(event, { props })
  }

  // --- Scroll Depth ---
  // Milestones reset on every SPA navigation so each page is tracked
  // independently. Reading the document height forces layout, so it is
  // sampled at most once per frame rather than on every scroll event.
  var reached = new Set()
  var milestones = [25, 50, 75, 100]
  var scrollFrame = 0
  function measureScroll() {
    scrollFrame = 0
    if (reached.size === milestones.length) return
    var height = document.documentElement.scrollHeight || document.body.scrollHeight
    var pct = Math.round(((window.scrollY + window.innerHeight) / Math.max(1, height)) * 100)
    for (var i = 0; i < milestones.length; i++) {
      var m = milestones[i]
      if (pct >= m && !reached.has(m)) {
        reached.add(m)
        track("Scroll Depth", { depth: m + "%", page: location.pathname })
      }
    }
  }
  window.addEventListener(
    "scroll",
    function () {
      if (!scrollFrame && reached.size < milestones.length)
        scrollFrame = requestAnimationFrame(measureScroll)
    },
    { passive: true },
  )

  // --- Clicks ---
  // One delegated listener instead of a listener per link, re-attached on
  // every navigation: outbound links, citation links, Python runs, graphs.
  document.addEventListener(
    "click",
    function (event) {
      var target = event.target
      if (!target || !target.closest) return
      var link = target.closest("a[href]")
      if (link) {
        if (link.classList.contains("csl-external-link")) {
          track("Citation Click", { url: link.href })
        }
        if (/^https?:/.test(link.href) && link.hostname !== location.hostname) {
          track("Outbound Click", { url: link.href, text: (link.innerText || "").slice(0, 60) })
        }
      }
      if (target.closest(".python-run-button")) track("Python Run", { page: location.pathname })
      if (target.closest(".graph-container, .global-graph-container"))
        track("Graph Click", { from: location.pathname })
    },
    { capture: true, passive: true },
  )

  // --- Search ---
  // Fires after 800ms of inactivity so we capture the intended query, not every keystroke
  var lastQuery = ""
  var debounce
  document.addEventListener(
    "input",
    function (event) {
      var bar = event.target
      if (!bar || !bar.classList || !bar.classList.contains("search-bar")) return
      clearTimeout(debounce)
      debounce = setTimeout(function () {
        var q = bar.value.trim()
        if (q.length > 2 && q !== lastQuery) {
          lastQuery = q
          track("Search", { query: q })
        }
      }, 800)
    },
    { passive: true },
  )

  function init() {
    reached = new Set()
    cancelAnimationFrame(scrollFrame)
    scrollFrame = 0
  }

  // Run on initial load and re-run after every SPA navigation
  document.addEventListener("nav", init)
  init()
})()
