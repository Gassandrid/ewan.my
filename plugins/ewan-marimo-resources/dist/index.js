const MARIMO_ISLANDS_VERSION = "0.23.9"
const MARIMO_CDN_ORIGIN = "https://cdn.jsdelivr.net"

const MARIMO_LOADER = `
(function() {
  if (window.__ewanMarimoLoader) {
    window.__ewanMarimoLoader.ensure();
    return;
  }
  var lastSlug = document.body?.dataset.slug || "";
  var exportContextSource = "ewan-quartz-marimo";
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
    if (current?.source === exportContextSource) {
      delete window.__MARIMO_EXPORT_CONTEXT__;
    }
  }
  function ensureStyle() {
    if (document.querySelector("link[data-ewan-marimo-css]")) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "${MARIMO_CDN_ORIGIN}/npm/@marimo-team/islands@${MARIMO_ISLANDS_VERSION}/dist/style.css";
    link.crossOrigin = "anonymous";
    link.dataset.ewanMarimoCss = "true";
    link.dataset.persist = "true";
    document.head.appendChild(link);
  }
  function ensureScript() {
    if (document.querySelector("script[data-ewan-marimo-runtime]")) return;
    var script = document.createElement("script");
    script.type = "module";
    script.src = "${MARIMO_CDN_ORIGIN}/npm/@marimo-team/islands@${MARIMO_ISLANDS_VERSION}/dist/main.js";
    script.crossOrigin = "anonymous";
    script.dataset.ewanMarimoRuntime = "true";
    script.dataset.persist = "true";
    document.head.appendChild(script);
  }
  function ensure(afterNavigation) {
    var islands = document.querySelectorAll("marimo-island");
    syncExportTrust(islands.length > 0);
    if (islands.length === 0) return;
    ensureStyle();
    ensureScript();
    if (afterNavigation) {
      setTimeout(function() {
        var current = Array.from(document.querySelectorAll("marimo-island"));
        var untouched = current.some(function(island) {
          return !island.classList.contains("marimo") && !island.hasAttribute("data-status");
        });
        if (untouched) window.location.reload();
      }, 250);
    }
  }
  document.addEventListener("nav", function() {
    var nextSlug = document.body?.dataset.slug || "";
    var changedPage = Boolean(lastSlug && nextSlug && nextSlug !== lastSlug);
    lastSlug = nextSlug;
    setTimeout(function() { ensure(changedPage); }, 0);
  });
  window.__ewanMarimoLoader = { ensure: ensure };
  ensure(false);
})();
`

export default function MarimoResources() {
  return {
    name: "MarimoResources",
    textTransform(_ctx, src) {
      return src
    },
    externalResources() {
      return {
        js: [
          {
            script: MARIMO_LOADER,
            loadTime: "afterDOMReady",
            contentType: "inline",
            spaPreserve: true,
          },
        ],
      }
    },
  }
}
