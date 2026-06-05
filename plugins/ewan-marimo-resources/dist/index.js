import { h } from "preact"

const MARIMO_ISLANDS_VERSION = "0.23.8"
const MARIMO_CDN_ORIGIN = "https://cdn.jsdelivr.net"
const LORA_CSS =
  "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap"

function marimoIslandsJsUrl(version = MARIMO_ISLANDS_VERSION) {
  return `${MARIMO_CDN_ORIGIN}/npm/@marimo-team/islands@${version}/dist/main.js`
}

function marimoIslandsCssUrl(version = MARIMO_ISLANDS_VERSION) {
  return `${MARIMO_CDN_ORIGIN}/npm/@marimo-team/islands@${version}/dist/style.css`
}

const NAV_RELOAD_SCRIPT = `
document.addEventListener("nav", () => {
  setTimeout(() => {
    const islands = document.querySelectorAll("marimo-island")
    if (islands.length === 0) return
    const untouched = [...islands].some((island) => !island.classList.contains("marimo"))
    if (untouched) window.location.reload()
  }, 50)
})
`

export default function MarimoResources(opts = {}) {
  return {
    name: "MarimoResources",
    textTransform(_ctx, src) {
      return src
    },
    externalResources() {
      const version = opts.version ?? MARIMO_ISLANDS_VERSION
      const loadLoraFont = opts.loadLoraFont ?? true
      const hardReloadOnSpaNav = opts.hardReloadOnSpaNav ?? true

      return {
        js: [
          {
            src: marimoIslandsJsUrl(version),
            loadTime: "afterDOMReady",
            contentType: "external",
            moduleType: "module",
            spaPreserve: true,
          },
          ...(hardReloadOnSpaNav
            ? [
                {
                  contentType: "inline",
                  loadTime: "afterDOMReady",
                  spaPreserve: true,
                  script: NAV_RELOAD_SCRIPT,
                },
              ]
            : []),
        ],
        additionalHead: [
          h("link", {
            rel: "preconnect",
            href: MARIMO_CDN_ORIGIN,
            crossorigin: "anonymous",
            "data-persist": "true",
          }),
          h("link", {
            rel: "stylesheet",
            href: marimoIslandsCssUrl(version),
            crossorigin: "anonymous",
            "data-persist": "true",
          }),
          ...(loadLoraFont
            ? [
                h("link", {
                  rel: "stylesheet",
                  href: LORA_CSS,
                  "data-persist": "true",
                }),
              ]
            : []),
        ],
      }
    },
  }
}
