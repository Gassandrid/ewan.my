;(function () {
  function track(event, props) {
    window.plausible?.(event, { props })
  }

  // --- Scroll Depth ---
  // Resets on every SPA navigation so each page is tracked independently
  var _scrollHandler = null
  function initScrollDepth() {
    if (_scrollHandler) window.removeEventListener("scroll", _scrollHandler)
    var reached = new Set()
    var milestones = [25, 50, 75, 100]
    _scrollHandler = function () {
      var pct = Math.round(((window.scrollY + window.innerHeight) / document.body.scrollHeight) * 100)
      for (var i = 0; i < milestones.length; i++) {
        var m = milestones[i]
        if (pct >= m && !reached.has(m)) {
          reached.add(m)
          track("Scroll Depth", { depth: m + "%", page: location.pathname })
        }
      }
    }
    window.addEventListener("scroll", _scrollHandler, { passive: true })
  }

  // --- Outbound Links ---
  // Uses data-tel attribute to avoid attaching duplicate listeners across nav events
  function initOutboundLinks() {
    document.querySelectorAll("a[href^='http']").forEach(function (link) {
      if (link.hostname !== location.hostname && !link.dataset.tel) {
        link.dataset.tel = "1"
        link.addEventListener("click", function () {
          track("Outbound Click", { url: link.href, text: (link.innerText || "").slice(0, 60) })
        })
      }
    })
  }

  // --- Search ---
  // Fires after 800ms of inactivity so we capture the intended query, not every keystroke
  function initSearch() {
    var bar = document.querySelector(".search-bar")
    if (!bar || bar.dataset.tel) return
    bar.dataset.tel = "1"
    var lastQuery = ""
    var debounce
    bar.addEventListener("input", function () {
      clearTimeout(debounce)
      debounce = setTimeout(function () {
        var q = bar.value.trim()
        if (q.length > 2 && q !== lastQuery) {
          lastQuery = q
          track("Search", { query: q })
        }
      }, 800)
    })
  }

  // --- Python Runs ---
  function initPythonRuns() {
    document.querySelectorAll(".python-run-button").forEach(function (btn) {
      if (!btn.dataset.tel) {
        btn.dataset.tel = "1"
        btn.addEventListener("click", function () {
          track("Python Run", { page: location.pathname })
        })
      }
    })
  }

  // --- Graph Clicks ---
  // Tracks any click into the local or global graph containers
  function initGraphClicks() {
    document.querySelectorAll(".graph-container, .global-graph-container").forEach(function (el) {
      if (!el.dataset.tel) {
        el.dataset.tel = "1"
        el.addEventListener("click", function () {
          track("Graph Click", { from: location.pathname })
        })
      }
    })
  }

  // --- Citation Clicks ---
  function initCitationClicks() {
    document.querySelectorAll("a.csl-external-link").forEach(function (link) {
      if (!link.dataset.tel) {
        link.dataset.tel = "1"
        link.addEventListener("click", function () {
          track("Citation Click", { url: link.href })
        })
      }
    })
  }

  function init() {
    initScrollDepth()
    initOutboundLinks()
    initSearch()
    initPythonRuns()
    initGraphClicks()
    initCitationClicks()
  }

  // Run on initial load and re-run after every SPA navigation
  document.addEventListener("nav", init)
  init()
})()
