import { h } from "preact"
import { QuartzTransformerPlugin } from "../types"

// Pin to match the locally installed `marimo` Python package — the generator
// embeds element protocol that needs to match the islands runtime version.
// Bump this when you upgrade marimo (`pip show marimo`).
const MARIMO_ISLANDS_VERSION = "0.23.4"

const ISLANDS_JS = `https://cdn.jsdelivr.net/npm/@marimo-team/islands@${MARIMO_ISLANDS_VERSION}/dist/main.js`
const ISLANDS_CSS = `https://cdn.jsdelivr.net/npm/@marimo-team/islands@${MARIMO_ISLANDS_VERSION}/dist/style.css`

// Lora — header font. Quartz's `fontOrigin: "googleFonts"` would bundle all
// three families (header + body + code) into a single Google Fonts URL, which
// 400s when `body: "ewanfont"` is included. So we keep `fontOrigin: "local"`
// and pull Lora in as a discrete <link> here.
const LORA_CSS =
  "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap"

// Marimo's runtime scans the DOM for islands exactly once, on initial page
// load. Quartz's SPA navigation swaps the article content via fetch+replace
// without re-firing that scan, so islands injected by SPA-nav never get
// upgraded. Detect that case on every `nav` event and force a hard reload —
// the user accepts the small UX cost (marimo's Pyodide payload is multi-MB
// anyway, so SPA savings on these pages were minor).
const NAV_RELOAD_SCRIPT = `
document.addEventListener("nav", () => {
  // Wait one tick so the new content is in the DOM.
  setTimeout(() => {
    const islands = document.querySelectorAll("marimo-island")
    if (islands.length === 0) return
    // marimo's runtime adds class="marimo" to every island it touches. If
    // any island lacks it, the runtime hasn't claimed this DOM and we need
    // a fresh page load to re-bootstrap it.
    const untouched = [...islands].some((i) => !i.classList.contains("marimo"))
    if (untouched) window.location.reload()
  }, 50)
})
`

export const MarimoIslandsPlugin: QuartzTransformerPlugin = () => ({
  name: "MarimoIslandsPlugin",
  externalResources() {
    return {
      js: [
        {
          src: ISLANDS_JS,
          loadTime: "afterDOMReady",
          contentType: "external",
          moduleType: "module",
          spaPreserve: true,
        },
        {
          contentType: "inline",
          loadTime: "afterDOMReady",
          spaPreserve: true,
          script: NAV_RELOAD_SCRIPT,
        },
      ],
      // Marimo's stylesheet must be loaded with `crossorigin="anonymous"` so
      // marimo's runtime can call `cssRules` on it and adopt its Tailwind
      // utility classes into each widget's shadow root via
      // `adoptedStyleSheets`. Without the CORS hint the rules are unreadable
      // and widgets render naked (slider track invisible, etc.). Quartz's
      // CSSResource type doesn't surface `crossorigin`, so we inject the link
      // directly through `additionalHead`.
      additionalHead: [
        h("link", {
          rel: "stylesheet",
          href: ISLANDS_CSS,
          crossorigin: "anonymous",
          "data-persist": "true",
        }),
        h("link", {
          rel: "stylesheet",
          href: LORA_CSS,
          "data-persist": "true",
        }),
      ],
    }
  },
})
