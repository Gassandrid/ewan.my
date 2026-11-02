import { readFileSync } from "node:fs"
import { h } from "preact"
import { resolveRelative } from "../ewan-margin/components.js"
import { rankTable } from "./graph.js"

// /rank: every note ordered by PageRank under a distribution of the scores, with
// the other graph measures alongside. Rows are rendered at build time; the client
// script filters, sorts and recomputes PageRank for a different damping.

const SLUG = "rank"
const CLIENT = readFileSync(new URL("./client.js", import.meta.url), "utf8")

// Set like the rest of the site: Fell for words, small capitals for labels,
// mono only for figures, hairline rules, ochre for what is selected.
const CSS = `
.rank-page .rk-lede{font:italic 16px/1.5 var(--fell);color:var(--darkgray);max-width:46rem;margin:0 0 .2rem}
.rank-page figure{margin:1.5rem 0 1rem}
.rank-page #rk-chart{width:100%;height:170px;display:block;overflow:visible}
.rank-page .rk-group{cursor:pointer}
.rank-page .rk-hit{fill:transparent}
.rank-page .rk-bin{fill:var(--muted);opacity:.34;transition:opacity .12s}
.rank-page .rk-group:hover .rk-bin{opacity:.7}
.rank-page .rk-bin.on,.rank-page .rk-group:hover .rk-bin.on{fill:var(--ochre);opacity:1}
.rank-page .rk-axis,.rank-page .rk-tickmark{stroke:var(--dark);stroke-width:1;shape-rendering:crispEdges}
.rank-page .rk-tick{font:10.5px var(--mono);fill:var(--muted)}
.rank-page .rk-mean{stroke:var(--rust);stroke-width:1;stroke-dasharray:2 3;shape-rendering:crispEdges}
.rank-page .rk-mean-label{font:italic 13px var(--fell);fill:var(--rust)}
.rank-page figcaption{margin-top:.55rem;font:italic 14px/1.45 var(--fell);color:var(--muted)}
.rank-page .rk-controls{display:flex;flex-wrap:wrap;gap:.6rem 1.3rem;align-items:center;margin:1.1rem 0 0;padding:.6rem 0;border-top:1px solid var(--hair);font:14px/1.3 var(--fell-sc);letter-spacing:.03em;color:var(--muted)}
.rank-page .rk-controls input[type=search],.rank-page .rk-controls select{font:15px/1.3 var(--fell);letter-spacing:0;color:var(--dark);background-color:transparent;border:0;border-bottom:1px solid var(--hair);border-radius:0;padding:2px 0;margin:0;outline:none}
.rank-page .rk-controls input[type=search]{flex:1 1 10rem;min-width:8rem}
.rank-page .rk-controls input[type=search]::placeholder{font-style:italic;color:var(--muted);opacity:1}
.rank-page .rk-controls select{appearance:none;-webkit-appearance:none;padding-right:16px;cursor:pointer;background:transparent url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='5 8 14 8' fill='none' stroke='%23888' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E") no-repeat right 2px center}
.rank-page .rk-controls select option{background:var(--light);color:var(--dark)}
.rank-page .rk-controls input[type=search]:focus,.rank-page .rk-controls select:focus-visible{border-bottom-color:var(--ochre)}
.rank-page .rk-controls label{display:inline-flex;gap:.45rem;align-items:center;cursor:pointer}
.rank-page .rk-controls input[type=checkbox]{accent-color:var(--ochre);margin:0;cursor:pointer}
.rank-page .rk-controls input[type=range]{accent-color:var(--ochre);width:6.5rem;margin:0;cursor:pointer}
.rank-page .rk-controls output{font:12px var(--mono);letter-spacing:0;color:var(--dark);min-width:2.4em}
.rank-page .rk-shown{margin-left:auto;font:12px var(--mono);letter-spacing:0;white-space:nowrap}
.rank-page table{width:100%;border-collapse:collapse;margin:0}
.rank-page thead th{position:sticky;top:0;z-index:1;background:var(--light);font:13px/1.2 var(--fell-sc);letter-spacing:.04em;font-weight:400;text-align:right;color:var(--muted);padding:.65rem .5rem .45rem;border-bottom:1px solid var(--dark);white-space:nowrap;user-select:none}
.rank-page thead th:nth-child(2){text-align:left}
.rank-page thead th[data-sort]{cursor:pointer}
.rank-page thead th[data-sort]:hover{color:var(--rust)}
.rank-page thead th.on{color:var(--dark)}
.rank-page thead th.on::after{content:"\\25BE";display:inline-block;width:.8em;margin-right:-.8em;text-align:right;font-size:10px;color:var(--ochre)}
.rank-page thead th.on[data-dir="1"]::after{content:"\\25B4"}
.rank-page td{padding:.3rem .5rem;border-bottom:1px solid var(--hair);text-align:right;font-variant-numeric:tabular-nums;vertical-align:baseline;white-space:nowrap}
.rank-page td:nth-child(2){text-align:left;white-space:normal;font:15.5px/1.3 var(--fell)}
.rank-page td.num{font:12px var(--mono);color:var(--darkgray)}
.rank-page td.num.faint{color:var(--muted);opacity:.55}
.rank-page td:first-child{color:var(--muted)}
.rank-page td small{color:var(--muted);font:10.5px var(--mono);margin-left:.45rem;white-space:nowrap}
.rank-page tbody tr:hover td{background:color-mix(in srgb,var(--ochre) 7%,transparent)}
.rank-page tbody a.internal{background:none!important;padding:0;color:var(--dark);font-weight:400}
.rank-page tbody a.internal:hover{color:var(--rust)}
.rank-page tr[hidden]{display:none}
.rank-page .rk-foot{font:italic 14px/1.5 var(--fell);color:var(--muted);margin-top:1.2rem}
@media (max-width:800px){.rank-page thead th{position:static}}
@media (max-width:700px){.rank-page th:nth-child(n+6),.rank-page td:nth-child(n+6){display:none}.rank-page td,.rank-page thead th{padding-left:.3rem;padding-right:.3rem}}
@media (prefers-reduced-motion:reduce){.rank-page .rk-bin{transition:none}}
`

// Figures for reading, not for precision: a measure too small to show at this
// precision reads as "<0.01", not as 1.6e-98.
export function fmt(x, digits = 2) {
  if (!Number.isFinite(x) || x === 0) return "0"
  const floor = 10 ** -digits
  return x < floor / 2 ? `<${floor.toFixed(digits)}` : x.toFixed(digits)
}

// A cell that shows nothing at this precision recedes, so the values that do
// register stand out down the column.
function measure(x, digits = 2) {
  const text = fmt(x, digits)
  return h(
    "td",
    { class: /^(0|<)/.test(text) && !/^0\.\d*[1-9]/.test(text) ? "num faint" : "num" },
    text,
  )
}

function RankBody() {
  function Component({ fileData, allFiles }) {
    const { graph, rows, count, components } = rankTable(allFiles)
    const folders = [...new Set(rows.map((r) => r.folder).filter(Boolean))].sort()
    const byIndex = new Array(rows.length)
    for (const r of rows) byIndex[r.i] = r
    const data = {
      n: graph.slugs.length,
      edges: graph.out.flatMap((targets, from) => targets.map((to) => [from, to])),
      score: byIndex.map((r) => r.score),
      between: byIndex.map((r) => r.between),
      authority: byIndex.map((r) => r.authority),
      hub: byIndex.map((r) => r.hub),
      in: byIndex.map((r) => r.in),
      out: byIndex.map((r) => r.out),
      title: byIndex.map((r) => r.title),
      folder: byIndex.map((r) => r.folder),
    }
    const head = (key, label, title) =>
      h(
        "th",
        {
          "data-sort": key,
          title,
          scope: "col",
          ...(key === "score" ? { class: "on", "data-dir": "-1", "aria-sort": "descending" } : {}),
        },
        label,
      )
    const orphans = rows.filter((r) => r.in + r.out === 0).length
    return h(
      "article",
      { class: ["popover-hint", ...(fileData.frontmatter?.cssclasses ?? [])].join(" ") },
      h(
        "div",
        { class: "markdown-preview-view markdown-rendered rank-page" },
        h(
          "p",
          { class: "rk-lede" },
          `${count} notes ordered by PageRank (damping 0.85), with the other ways of reading the link graph beside it. ${components[0]} are connected to each other${components.length > 1 ? `; ${orphans} stand alone` : ""}.`,
        ),
        h(
          "figure",
          null,
          h("svg", {
            id: "rk-chart",
            role: "img",
            "aria-label": "Distribution of PageRank scores",
          }),
          h(
            "figcaption",
            { id: "rk-caption", "aria-live": "polite" },
            "Notes by score relative to the mean, on a log axis. Click a bar to list only those notes.",
          ),
        ),
        h(
          "div",
          { class: "rk-controls" },
          h("input", {
            type: "search",
            id: "rk-q",
            placeholder: "Find a note",
            "aria-label": "Find a note",
          }),
          h(
            "select",
            { id: "rk-folder", "aria-label": "Folder" },
            h("option", { value: "" }, "All folders"),
            folders.map((f) => h("option", { value: f }, f)),
          ),
          h("label", null, h("input", { type: "checkbox", id: "rk-orphans" }), "Unlinked only"),
          h(
            "label",
            { title: "The chance the walker follows a link instead of jumping to a random note" },
            "Damping ",
            h("input", {
              type: "range",
              id: "rk-damp",
              min: "0.05",
              max: "0.99",
              step: "0.01",
              value: "0.85",
            }),
            h("output", { id: "rk-damp-out" }, "0.85"),
          ),
          h(
            "span",
            { class: "rk-shown", id: "rk-shown", "aria-live": "polite" },
            `${count} of ${count}`,
          ),
        ),
        h(
          "table",
          { id: "rk-table" },
          h(
            "thead",
            null,
            h(
              "tr",
              null,
              head("rank", "#", "Position by the chosen sort"),
              head("title", "Note", "Sort by title"),
              head("score", "PageRank ×mean", "PageRank relative to the mean note"),
              head("in", "In", "Notes linking here"),
              head("out", "Out", "Notes linked from here"),
              head(
                "between",
                "Bridge",
                "Betweenness: how often this note lies on the shortest path between two others",
              ),
              head("authority", "Authority", "HITS: linked to by good hubs"),
              head("hub", "Hub", "HITS: links to good authorities"),
            ),
          ),
          h(
            "tbody",
            null,
            rows.map((r, position) =>
              h(
                "tr",
                { "data-i": r.i },
                h("td", { class: "num" }, position + 1),
                h(
                  "td",
                  null,
                  h(
                    "a",
                    {
                      href: resolveRelative(SLUG, r.slug),
                      class: "internal",
                      "data-slug": r.slug,
                    },
                    r.title,
                  ),
                  r.folder ? h("small", null, r.folder) : null,
                ),
                h("td", { class: "num", "data-col": "score" }, (r.score * count).toFixed(2)),
                h("td", { class: "num" }, r.in),
                h("td", { class: "num" }, r.out),
                measure(r.between * 100, 1),
                measure(r.authority),
                measure(r.hub),
              ),
            ),
          ),
        ),
        h(
          "p",
          { class: "rk-foot" },
          "Bridge is betweenness as a percentage of the largest possible; authority and hub are Kleinberg's HITS scores scaled to unit length.",
        ),
        h("script", {
          type: "application/json",
          id: "rank-data",
          dangerouslySetInnerHTML: { __html: JSON.stringify(data).replace(/</g, "\\u003c") },
        }),
      ),
    )
  }
  Component.displayName = "RankBody"
  Component.css = CSS
  Component.afterDOMLoaded = CLIENT
  return Component
}

export default function RankPage() {
  return {
    name: "RankPage",
    priority: 20,
    match: () => false,
    generate() {
      const title = "Rank"
      const description =
        "Every note ordered by PageRank, with the other measures of the link graph."
      return [
        {
          slug: SLUG,
          title,
          data: {
            slug: SLUG,
            relativePath: "virtual/rank.md",
            filePath: "virtual/rank.md",
            frontmatter: { title, description, cssclasses: ["rank-page-article"] },
            text: `${title}. ${description}`,
            description,
            links: [],
          },
        },
      ]
    },
    layout: "content",
    body: RankBody,
  }
}
