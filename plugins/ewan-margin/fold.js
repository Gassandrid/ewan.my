import { h } from "preact"

// Sidebar panels fold the way the explorer does: the heading is a button with
// the explorer's chevron. Which panels are folded is one space-separated list,
// kept in localStorage and mirrored on <html data-folded>. The head script
// applies it before first paint, so a folded panel never flashes open, and the
// attribute survives SPA navigation because only <body> is morphed.

export const FOLD_KEY = "ewan-folded"
const PANELS = {
  sources: '[data-panel="sources"] > .panel-body',
  cited: '[data-panel="cited"] > .panel-body',
  graph: '.graph[data-panel="graph"] > .graph-outer',
  explorer: ".sidebar .explorer > .explorer-content",
}

export function foldButton(panel, title, controls) {
  return h(
    "button",
    {
      type: "button",
      class: "fold-toggle",
      "data-fold": panel,
      "aria-expanded": "true",
      ...(controls ? { "aria-controls": controls } : {}),
    },
    h("span", null, title),
    h(
      "svg",
      {
        class: "fold",
        width: 14,
        height: 14,
        viewBox: "5 8 14 8",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": 2,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "aria-hidden": "true",
      },
      h("polyline", { points: "6 9 12 15 18 9" }),
    ),
  )
}

// Component CSS is layered under the site's own sheets, so the folded state
// is !important: it must win over any unlayered display rule.
export const FOLD_CSS =
  `
.fold-toggle{all:unset;box-sizing:border-box;display:flex;align-items:center;width:100%;cursor:pointer;font:inherit;color:inherit;letter-spacing:inherit;text-transform:inherit}
.fold-toggle>span{min-width:0}
.fold-toggle .fold{flex:none;margin-left:.5rem;opacity:.8;transition:transform .3s ease}
.fold-toggle:hover{color:var(--rust)}
.fold-toggle:focus-visible{outline:1.5px solid var(--ochre);outline-offset:2px}
@media (prefers-reduced-motion:reduce){.fold-toggle .fold{transition:none}}
` +
  Object.entries(PANELS)
    .map(
      ([panel, body]) =>
        `html[data-folded~="${panel}"] ${body}{display:none!important}` +
        `html[data-folded~="${panel}"] [data-fold="${panel}"] .fold{transform:rotateZ(-90deg)}`,
    )
    .join("\n") +
  `
html[data-folded~="explorer"] .sidebar .explorer .desktop-explorer .fold{transform:rotateZ(-90deg)}
html[data-folded~="explorer"] .sidebar.right>.explorer{flex:0 1 auto}
`

export const FOLD_PRESCRIPT = `try{var f=localStorage.getItem(${JSON.stringify(FOLD_KEY)});if(f)document.documentElement.dataset.folded=f}catch(e){}`

export const FOLD_RUNTIME = `(() => {
  if (window.__ewanFold) return
  window.__ewanFold = true
  const root = document.documentElement
  const KEY = ${JSON.stringify(FOLD_KEY)}
  const read = () => new Set((root.dataset.folded || "").split(/\\s+/).filter(Boolean))
  function write(folded) {
    const value = [...folded].sort().join(" ")
    if (value) root.dataset.folded = value
    else delete root.dataset.folded
    try {
      if (value) localStorage.setItem(KEY, value)
      else localStorage.removeItem(KEY)
    } catch {}
  }
  function sync() {
    const folded = read()
    for (const button of document.querySelectorAll("[data-fold]"))
      button.setAttribute("aria-expanded", String(!folded.has(button.dataset.fold)))
    // The explorer folds itself; a fresh page renders it open, so restore it.
    if (folded.has("explorer"))
      for (const explorer of document.querySelectorAll(".sidebar .explorer")) {
        explorer.classList.add("collapsed")
        explorer.setAttribute("aria-expanded", "false")
      }
  }
  document.addEventListener("click", (event) => {
    const target = event.target
    if (!target?.closest) return
    const button = target.closest("[data-fold]")
    if (button) {
      const folded = read()
      const panel = button.dataset.fold
      if (folded.has(panel)) folded.delete(panel)
      else folded.add(panel)
      write(folded)
      sync()
      // A graph laid out while folded had no width; draw it at its real size.
      if (panel === "graph" && !folded.has(panel)) document.dispatchEvent(new CustomEvent("render"))
      return
    }
    const explorer = target.closest(".sidebar .explorer")
    if (explorer && target.closest(".desktop-explorer")) {
      const folded = read()
      if (explorer.classList.contains("collapsed")) folded.add("explorer")
      else folded.delete("explorer")
      write(folded)
    }
  })
  document.addEventListener("nav", sync)
  sync()
})()`
