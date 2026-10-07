import { readFileSync } from "node:fs"
import { h } from "preact"
import { resolveRelative } from "../ewan-margin/components.js"
import { rankTable } from "./graph.js"

// /rank: every note ordered by PageRank under a distribution of the scores, with
// the other graph measures alongside. Rows are rendered at build time; the client
// script filters, sorts and recomputes PageRank for a different damping.

const SLUG = "rank"
const CLIENT = readFileSync(new URL("./client.js", import.meta.url), "utf8")

const CSS = `
.rank-page .rk-lede{font:italic 16px/1.5 var(--fell);color:var(--darkgray);max-width:46rem}
.rank-page figure{margin:1.4rem 0 .8rem}
.rank-page #rk-chart{width:100%;height:150px;display:block;overflow:visible}
.rank-page .rk-bin{fill:var(--muted);opacity:.45;cursor:pointer}
.rank-page .rk-bin:hover{opacity:.8}
.rank-page .rk-bin.on{fill:var(--ochre);opacity:1}
.rank-page .rk-axis{stroke:var(--muted);stroke-width:.7}
.rank-page .rk-tick{font:10px var(--mono);fill:var(--muted)}
.rank-page figcaption{font:11.5px/1.5 var(--mono);color:var(--muted)}
.rank-page .rk-controls{display:flex;flex-wrap:wrap;gap:10px 18px;align-items:center;margin:1rem 0;font:12px var(--mono);color:var(--muted)}
.rank-page .rk-controls input[type=search],.rank-page .rk-controls select{font:13px var(--mono);background:var(--light);color:var(--dark);border:1px solid var(--hair);padding:3px 6px;border-radius:0}
.rank-page .rk-controls label{display:flex;gap:6px;align-items:center}
.rank-page .rk-controls input[type=range]{accent-color:var(--ochre);width:110px}
.rank-page .rk-shown{margin-left:auto}
.rank-page table{width:100%;border-collapse:collapse;font:14.5px/1.35 var(--fell)}
.rank-page th{font:11px var(--mono);font-weight:400;text-align:right;color:var(--muted);padding:6px 8px;border-bottom:1px solid var(--dark);white-space:nowrap}
.rank-page th:nth-child(2){text-align:left}
.rank-page th[data-sort]{cursor:pointer}
.rank-page th[data-sort]:hover,.rank-page th.on{color:var(--rust)}
.rank-page td{padding:4px 8px;border-bottom:1px solid var(--hair);text-align:right;font-variant-numeric:tabular-nums}
.rank-page td:nth-child(2){text-align:left;font-size:15.5px}
.rank-page td.num{font:12px var(--mono);color:var(--darkgray)}
.rank-page td small{color:var(--muted);font:11px var(--mono);margin-left:6px}
.rank-page tr[hidden]{display:none}
.rank-page a.internal{background:none!important;padding:0}
.rank-page .rk-foot{font:italic 14px/1.5 var(--fell);color:var(--muted);margin-top:1.2rem}
@media (max-width:700px){.rank-page th:nth-child(n+5),.rank-page td:nth-child(n+5){display:none}}
`

const fmt = (x, digits = 2) => (x === 0 ? "0" : x < 0.01 ? x.toExponential(1) : x.toFixed(digits))

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
      h("th", { "data-sort": key, title, class: key === "score" ? "on" : "" }, label)
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
            { id: "rk-caption" },
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
          h("span", { class: "rk-shown", id: "rk-shown" }, `${count} of ${count}`),
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
              h("th", { "data-sort": "title" }, "Note"),
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
                h("td", { class: "num" }, fmt(r.between * 100, 1)),
                h("td", { class: "num" }, fmt(r.authority)),
                h("td", { class: "num" }, fmt(r.hub)),
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
