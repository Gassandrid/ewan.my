import { h } from "preact"
import { resolveRelative, simplifySlug } from "../ewan-margin/components.js"
import { neighbourhood } from "../ewan-rank/graph.js"
import { similarNotes } from "../ewan-rank/similar.js"

// Notes a few links away: a random walk that keeps returning to this note, with
// its direct links left out, so what is listed is what this note does not already say.

const CSS = `
.neighbourhood{margin:2.2rem 0 0;padding-top:.8rem;border-top:1px solid var(--hair)}
.neighbourhood h3{font:13px/1.3 var(--fell-sc);color:var(--muted);letter-spacing:.06em;font-weight:400;margin:0 0 .4rem}
.neighbourhood ol{list-style:none;margin:0;padding:0}
.neighbourhood li{display:flex;gap:8px;align-items:baseline;padding:3px 0;font:16px/1.35 var(--fell)}
.neighbourhood a.internal{background:none!important;padding:0}
.neighbourhood .nb-via{font:11px var(--mono);color:var(--muted)}
.neighbourhood .nb-via a{color:var(--muted)}
.neighbourhood div+div{margin-top:1rem}
.neighbourhood .nb-sim{margin-left:auto}
.neighbourhood .nb-bar{margin-left:auto;flex:none;height:3px;background:var(--ochre);opacity:.6}
@media (max-width:800px){.neighbourhood{padding-left:.75rem;padding-right:.75rem}}
`

export function Neighbourhood() {
  function Component({ fileData, allFiles, displayClass }) {
    const here = fileData.slug ?? ""
    const near = neighbourhood(allFiles, here)
    const shown = new Set(near.map((n) => n.slug))
    const similar = similarNotes(allFiles, fileData, 12)
      .filter((n) => !shown.has(n.slug))
      .slice(0, 5)
    if (near.length === 0 && similar.length === 0) return null
    const top = near[0]?.score ?? 1
    const link = (slug, title) =>
      h("a", { href: resolveRelative(here, slug), class: "internal", "data-slug": slug }, title)
    return h(
      "section",
      { class: [displayClass, "neighbourhood"].filter(Boolean).join(" ") },
      near.length
        ? h(
            "div",
            null,
            h("h3", null, "Nearby"),
            h(
              "ol",
              null,
              near.map((n) =>
                h(
                  "li",
                  { key: n.slug },
                  link(n.slug, n.title),
                  n.via
                    ? h("span", { class: "nb-via" }, "via ", link(n.via.slug, n.via.title))
                    : null,
                  h("span", {
                    class: "nb-bar",
                    style: `width:${Math.round((n.score / top) * 48)}px`,
                  }),
                ),
              ),
            ),
          )
        : null,
      similar.length
        ? h(
            "div",
            null,
            h("h3", null, "Similar, not linked"),
            h(
              "ol",
              null,
              similar.map((n) =>
                h(
                  "li",
                  { key: n.slug },
                  link(n.slug, n.title),
                  h("span", { class: "nb-via nb-sim" }, `${Math.round(n.similarity * 100)}%`),
                ),
              ),
            ),
          )
        : null,
    )
  }
  Component.displayName = "Neighbourhood"
  Component.css = CSS
  return Component
}
