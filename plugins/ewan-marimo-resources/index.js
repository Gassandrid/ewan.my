import fs from "node:fs"
import { Fragment, h } from "preact"
import { simplifySlug, slugifyFilePath } from "@quartz-community/utils/path"

const MARIMO_ISLANDS_VERSION = "0.25.2"
const MARIMO_CDN_ORIGIN = "https://cdn.jsdelivr.net"
const MARIMO_PACKAGE_ROOT = `${MARIMO_CDN_ORIGIN}/npm/@marimo-team/islands@${MARIMO_ISLANDS_VERSION}/dist`
const MARIMO_RUNTIME_URL = `${MARIMO_PACKAGE_ROOT}/main.js`
const MARIMO_STYLE_URL = `${MARIMO_PACKAGE_ROOT}/style.css`
const PYODIDE_VERSION = "314.0.0"
const PYODIDE_ROOT = `${MARIMO_CDN_ORIGIN}/pyodide/v${PYODIDE_VERSION}/full/`
const OBSIDIAN_EMBEDS_RUNTIME = fs
  .readFileSync(new URL("./obsidian-embeds.js", import.meta.url), "utf8")
  .replace("export function", "function")
const THEME_RUNTIME = fs
  .readFileSync(new URL("./theme.js", import.meta.url), "utf8")
  .replace("export function", "function")

function warmPageUrl(ctx) {
  const base = new URL(`https://${ctx?.cfg?.configuration?.baseUrl ?? "example.com"}`).pathname
  return `${base.replace(/\/?$/, "/")}static/marimo-warm.html?v=${MARIMO_ISLANDS_VERSION}`
}

function marimoRoutes(ctx) {
  return (ctx?.allFiles ?? [])
    .filter((fp) => fp.endsWith(".marimo.py"))
    .map((fp) => simplifySlug(slugifyFilePath(fp.replace(/\.marimo\.py$/, ".md"))))
    .map((slug) => (slug === "/" ? "/" : `/${slug}`))
}

// Notes link a notebook as Obsidian needs, `[[Name.marimo.py]]`. Quartz would
// resolve that to the source file, which downloads; point it at the page.
export function linkNotebookPages(src, allFiles = []) {
  const stems = allFiles
    .filter((fp) => fp.endsWith(".marimo.py"))
    .map((fp) => fp.slice(0, -".marimo.py".length))
  return src.replace(
    /(?<!!)\[\[([^\[\]|#\n]+?)\.marimo(?:\.py)?(#[^\[\]|\n]*)?(\\?\|[^\[\]\n]*)?\]\]/gi,
    (link, target, anchor = "", alias) => {
      const name = target.trim().toLowerCase()
      const matches = stems.filter((stem) => {
        const lower = stem.toLowerCase()
        return lower === name || lower.endsWith(`/${name}`)
      })
      if (matches.length !== 1) return link
      return `[[${matches[0]}${anchor}${alias ?? `|${target.trim().split("/").at(-1)}`}]]`
    },
  )
}

export function createMarimoLoader(routes = [], warmUrl = null) {
  return `
(function() {
  if (window.__ewanMarimoLoader) {
    window.__ewanMarimoLoader.ensure();
    return;
  }

  var marimoRoutes = new Set(${JSON.stringify(routes)});
  var runtimeUrl = ${JSON.stringify(MARIMO_RUNTIME_URL)};
  var styleUrl = ${JSON.stringify(MARIMO_STYLE_URL)};
  var pyodideRoot = ${JSON.stringify(PYODIDE_ROOT)};
  var exportContextSource = "ewan-quartz-marimo";
  var mountedRoute = null;
  var readyObserver = null;
  var readyTimeout = null;
  var hoverTimer = null;
  var mountedPage = null;
  var clearMarkdown = null;
  var markdownPage = null;
  var clearTheme = null;
  var warmUrl = ${JSON.stringify(warmUrl)};
  var warmFrame = null;
  ${OBSIDIAN_EMBEDS_RUNTIME}
  ${THEME_RUNTIME}
  var watchMarkdown = watchObsidianEmbeds;

  function activeNotebook() {
    return Array.from(document.querySelectorAll(".marimo-notebook-page"))
      .find(function(page) { return !page.closest(".popover, .search, .preview-container"); }) || null;
  }

  function normalizedPath(value) {
    var pathname;
    try {
      pathname = new URL(value, window.location.href).pathname;
    } catch (_) {
      pathname = String(value || "");
    }
    try { pathname = decodeURIComponent(pathname); } catch (_) {}
    pathname = pathname.replace(/\\.html$/, "").replace(/\\/index$/, "");
    if (pathname.length > 1) pathname = pathname.replace(/\\/$/, "");
    return pathname || "/";
  }

  function isMarimoLink(anchor) {
    if (!anchor || anchor.target || anchor.hasAttribute("download")) return false;
    var url;
    try { url = new URL(anchor.href, window.location.href); } catch (_) { return false; }
    return url.origin === window.location.origin && marimoRoutes.has(normalizedPath(url.pathname));
  }

  function ensureConnection(origin) {
    if (document.querySelector('link[data-ewan-marimo-origin="' + origin + '"]')) return;
    var link = document.createElement("link");
    link.rel = "preconnect";
    link.href = origin;
    link.crossOrigin = "anonymous";
    link.dataset.ewanMarimoOrigin = origin;
    link.dataset.persist = "true";
    document.head.appendChild(link);
  }

  function ensureHint(rel, href, as) {
    var existing = document.querySelector('link[data-ewan-marimo-href="' + href + '"]');
    if (existing) return existing;
    var link = document.createElement("link");
    link.rel = rel;
    link.href = href;
    if (as) link.as = as;
    link.crossOrigin = "anonymous";
    link.dataset.ewanMarimoHref = href;
    link.dataset.persist = "true";
    document.head.appendChild(link);
    return link;
  }

  function preload(full = false) {
    if (!full && (navigator.connection?.saveData || /(?:slow-)?2g/.test(navigator.connection?.effectiveType || ""))) return;
    ensureConnection(${JSON.stringify(MARIMO_CDN_ORIGIN)});
    ensureConnection("https://wasm.marimo.app");
    // Hover only warms the connection. Module preloads pull the full import
    // graph even when the reader never opens the notebook.
    if (!full) return;
    ensureHint("modulepreload", runtimeUrl);

    ensureHint("preload", styleUrl, "style");
    if (full && !navigator.connection?.saveData) {
      ensureHint("prefetch", pyodideRoot + "pyodide.asm.wasm", "fetch");
      ensureHint("prefetch", pyodideRoot + "python_stdlib.zip", "fetch");
    }
  }

  function syncExportTrust(hasIslands) {
    var current = window.__MARIMO_EXPORT_CONTEXT__;
    if (hasIslands) {
      if (current?.trusted === true) return;
      Object.defineProperty(window, "__MARIMO_EXPORT_CONTEXT__", {
        value: Object.freeze({ trusted: true, source: exportContextSource }),
        writable: false,
        configurable: true,
      });
      return;
    }
    if (current?.source === exportContextSource) delete window.__MARIMO_EXPORT_CONTEXT__;
  }

  function ensureStyle() {
    var link = document.querySelector('link[data-ewan-marimo-href="' + styleUrl + '"]');
    if (link) {
      link.disabled = false;
      link.rel = "stylesheet";
      link.removeAttribute("as");
      link.dataset.ewanMarimoCss = "true";
      return;
    }
    link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = styleUrl;
    link.crossOrigin = "anonymous";
    link.dataset.ewanMarimoCss = "true";
    link.dataset.ewanMarimoHref = styleUrl;
    link.dataset.persist = "true";
    document.head.appendChild(link);
  }

  function setState(page, state, message) {
    if (!page?.isConnected) return;
    page.dataset.marimoState = state;
    var label = page.querySelector(".marimo-loading-text");
    if (label && message) label.textContent = message;
  }

  function clearReadiness() {
    readyObserver?.disconnect();
    readyObserver = null;
    window.clearTimeout(readyTimeout);
    readyTimeout = null;
  }

  function watchReadiness(page) {
    clearReadiness();
    var update = function() {
      var cells = Array.from(page.querySelectorAll('marimo-island[data-reactive="true"]'));
      var ready = cells.length > 0 && cells.every(function(cell) { return cell.dataset.status === "idle"; });
      // The first reactive cell is the compiler's setup cell; if it raised,
      // every notebook cell only shows "An ancestor raised an exception".
      var error = page.querySelector('marimo-island[data-status="error"]') ||
        (ready && cells[0].querySelector('[role="alert"]'));
      if (error) {
        setState(page, "error", "Python could not start on this page.");
        return true;
      }
      if (ready) {
        setState(page, "ready", "Interactive Python ready.");
        return true;
      }
      return false;
    };
    if (update()) return;
    readyObserver = new MutationObserver(function() {
      if (update()) clearReadiness();
    });
    readyObserver.observe(page, { subtree: true, attributes: true, attributeFilter: ["data-status"] });
    readyTimeout = window.setTimeout(function() {
      if (!update()) setState(page, "slow", "Still starting Python; the first visit is the slowest.");
    }, 60000);
  }

  function ensureScript(page) {
    var existing = document.querySelector("script[data-ewan-marimo-runtime]");
    if (existing) return;
    // Plotly loads MathJax for chart labels. Its default startup scan would
    // typeset KaTeX's accessibility MathML a second time, producing NaN SVGs.
    // Keep explicit chart typesetting, but let marimo/Quartz own page math.
    window.MathJax = window.MathJax || {};
    window.MathJax.startup = window.MathJax.startup || {};
    window.MathJax.startup.typeset = false;
    var script = document.createElement("script");
    script.type = "module";
    script.src = runtimeUrl;
    script.crossOrigin = "anonymous";
    script.dataset.ewanMarimoRuntime = "true";
    script.dataset.persist = "true";
    script.addEventListener("error", function() {
      script.remove();
      setState(activeNotebook(), "error", "Python runtime failed to download. Reload to retry.");
    });
    document.head.appendChild(script);
  }

  // Large build-time outputs ship as separate files; show each one unless the
  // live session has already rendered that cell.
  function fillDeferredOutputs(page) {
    page.querySelectorAll("marimo-island[data-ewan-output]").forEach(function(island) {
      var url = island.dataset.ewanOutput;
      island.removeAttribute("data-ewan-output");
      fetch(url)
        .then(function(response) { return response.ok ? response.text() : ""; })
        .then(function(html) {
          var output = island.querySelector("marimo-cell-output");
          if (!html || !output || output.childElementCount || output.textContent.trim()) return;
          output.innerHTML = html;
        })
        .catch(function() {});
    });
  }

  function hardNavigateCurrentPage() {
    // marimo 0.25.2 owns one global Pyodide session. A second, different
    // notebook needs a fresh browsing context; make that boundary automatic.
    window.location.replace(window.location.href);
  }

  function ensure() {
    var page = activeNotebook();
    var hasIslands = Boolean(page && page.querySelector("marimo-island"));
    syncExportTrust(hasIslands);
    if (!hasIslands) {
      clearReadiness();
      if (clearMarkdown) clearMarkdown();
      clearMarkdown = null;
      if (clearTheme) clearTheme();
      clearTheme = null;
      markdownPage = null;
      var css = document.querySelector("link[data-ewan-marimo-css]");
      if (css) css.disabled = true;
      return;
    }

    var route = normalizedPath(window.location.pathname);
    if (mountedPage && mountedPage !== page && document.querySelector("script[data-ewan-marimo-runtime]")) {
      hardNavigateCurrentPage();
      return;
    }
    mountedRoute = route;
    mountedPage = page;
    if (markdownPage !== page) {
      if (clearMarkdown) clearMarkdown();
      clearMarkdown = watchMarkdown(page);
      if (clearTheme) clearTheme();
      clearTheme = watchMarimoTheme(page);
      markdownPage = page;
    }
    preload(true);
    if (page.dataset.marimoLinks) ensureHint("prefetch", page.dataset.marimoLinks, "fetch");
    fillDeferredOutputs(page);
    ensureStyle();
    watchReadiness(page);
    ensureScript(page);
  }

  document.addEventListener("pointerover", function(event) {
    var anchor = event.target?.closest?.("a[href]");
    clearTimeout(hoverTimer);
    if (isMarimoLink(anchor)) hoverTimer = setTimeout(function() { preload(); }, 120);
  }, { passive: true, capture: true });
  document.addEventListener("pointerout", function(event) {
    var anchor = event.target?.closest?.("a[href]");
    if (anchor && !anchor.contains(event.relatedTarget)) clearTimeout(hoverTimer);
  }, { passive: true, capture: true });
  document.addEventListener("focusin", function(event) {
    var anchor = event.target?.closest?.("a[href]");
    if (isMarimoLink(anchor)) preload();
  }, true);
  document.addEventListener("click", function(event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    var anchor = event.target?.closest?.("a[href]");
    if (!isMarimoLink(anchor)) return;
    // A click (or search Enter) is intent: download the runtime and Pyodide
    // while the router is still fetching and swapping in the page.
    preload(true);
    if (!mountedRoute) return;
    var targetRoute = normalizedPath(anchor.href);
    if (targetRoute === mountedRoute || !document.querySelector("script[data-ewan-marimo-runtime]")) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.location.assign(anchor.href);
  }, true);
  document.addEventListener("nav", function() {
    window.setTimeout(ensure, 0);
  });
  window.addEventListener("popstate", function() {
    if (marimoRoutes.has(normalizedPath(window.location.pathname))) preload(true);
  });
  document.addEventListener("prenav", function(event) {
    var target = event.detail?.url;
    if (!target || !marimoRoutes.has(normalizedPath(target))) return;
    preload(true);
    if (!mountedPage || !document.querySelector("script[data-ewan-marimo-runtime]")) return;
    // The pinned runtime has no session teardown. Apply this boundary before
    // DOM replacement, including keyboard search, programmatic nav and Back.
    event.preventDefault();
    if (event.detail.isBack) window.location.replace(target);
    else window.location.assign(target);
  });

  // Most readers arrive on an ordinary note. Once that page is idle, a hidden
  // warm-up page downloads the runtime, Pyodide and every notebook's packages
  // into the HTTP cache, so opening a notebook later costs only Python startup.
  function warm() {
    if (!warmUrl || warmFrame || !marimoRoutes.size || activeNotebook()) return;
    var connection = navigator.connection;
    if (connection?.saveData || /(?:slow-)?2g|3g/.test(connection?.effectiveType || "")) return;
    var stampKey = "ewan-marimo-warm:" + warmUrl;
    try {
      if (Number(localStorage.getItem(stampKey)) > Date.now() - 12 * 3600 * 1000) return;
    } catch (_) {}
    var timeout = window.setTimeout(function() { finish(false); }, 180000);
    function finish(completed) {
      window.clearTimeout(timeout);
      window.removeEventListener("message", onMessage);
      warmFrame?.remove();
      if (completed) try { localStorage.setItem(stampKey, String(Date.now())); } catch (_) {}
    }
    function onMessage(event) {
      if (event.origin !== window.location.origin || event.source !== warmFrame?.contentWindow) return;
      if (event.data?.type === "ewan-marimo-warm") finish(event.data.status === "done");
    }
    window.addEventListener("message", onMessage);
    warmFrame = document.createElement("iframe");
    warmFrame.src = warmUrl;
    warmFrame.hidden = true;
    warmFrame.tabIndex = -1;
    warmFrame.setAttribute("aria-hidden", "true");
    // Outside <body>: SPA navigation morphs the body and would remove it.
    document.documentElement.appendChild(warmFrame);
  }

  function warmWhenIdle() {
    var idle = window.requestIdleCallback || function(fn) { return window.setTimeout(fn, 1500); };
    idle(warm, { timeout: 5000 });
  }

  window.__ewanMarimoLoader = { ensure: ensure, preload: preload };
  if (document.readyState === "complete") warmWhenIdle();
  else window.addEventListener("load", warmWhenIdle, { once: true });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensure, { once: true });
  } else {
    ensure();
  }
})();
`
}

function MarimoHints() {
  const hint = (rel, href, as) =>
    h("link", {
      rel,
      href,
      as,
      crossorigin: "anonymous",
      "data-ewan-marimo-href": href,
      "data-persist": "true",
    })
  return h(
    Fragment,
    null,
    h("link", { rel: "preconnect", href: MARIMO_CDN_ORIGIN, crossorigin: "anonymous" }),
    hint("modulepreload", MARIMO_RUNTIME_URL),
    hint("preload", MARIMO_STYLE_URL, "style"),
    hint("prefetch", `${PYODIDE_ROOT}pyodide.asm.wasm`, "fetch"),
    hint("prefetch", `${PYODIDE_ROOT}python_stdlib.zip`, "fetch"),
  )
}

export default function MarimoResources() {
  return {
    name: "MarimoResources",
    textTransform(ctx, src) {
      return linkNotebookPages(src, ctx?.allFiles)
    },
    externalResources(ctx) {
      return {
        // Direct visits: start the runtime and Pyodide while the HTML is still
        // parsing, instead of after the deferred loader runs. The loader finds
        // these by data-ewan-marimo-href and does not request them twice.
        additionalHead: [(fileData) => (fileData.isMarimo ? MarimoHints() : null)],
        js: [
          {
            script: createMarimoLoader(marimoRoutes(ctx), warmPageUrl(ctx)),
            loadTime: "afterDOMReady",
            contentType: "inline",
            spaPreserve: true,
          },
        ],
      }
    },
  }
}
