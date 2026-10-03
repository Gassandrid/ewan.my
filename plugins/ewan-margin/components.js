import { h } from "preact"

// The reading margin: the works this note cites (the one in view marked) and
// the notes that cite it, each opening to the sentence where it does, ordered by
// PageRank. NoteRank places this note's own PageRank under the page metadata.
// Everything is computed at build time except tracking what is in view.

// --- Quartz path helpers (mirroring quartz/util/path) ---------------------

export function simplifySlug(slug) {
  const trimmed = slug === "index" ? "" : slug.endsWith("/index") ? slug.slice(0, -5) : slug
  const res = trimmed.replace(/^\/+/, "")
  return res.length === 0 ? "/" : res
}

function pathToRoot(slug) {
  const up = slug
    .split("/")
    .filter((x) => x !== "")
    .slice(0, -1)
    .map(() => "..")
    .join("/")
  return up.length === 0 ? "." : up
}

export function resolveRelative(current, target) {
  const parts = [pathToRoot(current), simplifySlug(target)]
    .filter((s) => s !== "" && s !== "/")
    .map((s) => s.replace(/^\/+|\/+$/g, ""))
  let joined = parts.join("/")
  if (target.endsWith("/") || simplifySlug(target).endsWith("/")) joined += "/"
  return joined
}

// --- PageRank over existing notes (as in emergent-links) ------------------

/** Damping 0.85, at most 50 iterations, L1 tolerance 1e-10; duplicate and self edges ignored. */
export function pageRank(nodes, edges, damping = 0.85, maxIterations = 50, tolerance = 1e-10) {
  const ordered = [...new Set(nodes)].sort()
  const n = ordered.length
  if (n === 0) return new Map()
  const outgoing = new Map(ordered.map((node) => [node, new Set()]))
  for (const [source, target] of edges) {
    if (source === target || !outgoing.has(source) || !outgoing.has(target)) continue
    outgoing.get(source).add(target)
  }
  let ranks = new Map(ordered.map((node) => [node, 1 / n]))
  for (let iteration = 0; iteration < maxIterations; iteration += 1) {
    let dangling = 0
    for (const node of ordered) if (outgoing.get(node).size === 0) dangling += ranks.get(node)
    const base = (1 - damping) / n + (damping * dangling) / n
    const next = new Map(ordered.map((node) => [node, base]))
    for (const source of ordered) {
      const targets = outgoing.get(source)
      if (targets.size === 0) continue
      const share = (damping * ranks.get(source)) / targets.size
      for (const target of targets) next.set(target, next.get(target) + share)
    }
    let difference = 0
    for (const node of ordered) difference += Math.abs(next.get(node) - ranks.get(node))
    ranks = next
    if (difference < tolerance) break
  }
  return ranks
}

/** Notes that count: listed, written pages. Listings (.base) and tag pages are left out. */
function isNote(file) {
  const slug = file.slug ?? ""
  return (
    file.unlisted !== true && slug !== "" && !slug.endsWith(".base") && !slug.startsWith("tags/")
  )
}

const metricsCache = new WeakMap()

/** PageRank, rank position and the score distribution, once per build. */
export function noteMetrics(allFiles) {
  const cached = metricsCache.get(allFiles)
  if (cached) return cached
  const notes = allFiles.filter(isNote)
  const nodes = notes.map((f) => simplifySlug(f.slug))
  const edges = notes.flatMap((f) =>
    [...new Set(f.links ?? [])].map((target) => [simplifySlug(f.slug), target]),
  )
  const score = pageRank(nodes, edges)
  const order = [...score.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  const position = new Map(order.map(([slug], i) => [slug, i + 1]))
  const metrics = { score, position, count: order.length, scores: order.map(([, s]) => s) }
  metricsCache.set(allFiles, metrics)
  return metrics
}

// --- Where a citing note mentions this one --------------------------------

function needles(title, slug) {
  const tail = slug.split("/").filter(Boolean).pop()?.replace(/-/g, " ") ?? ""
  return [title, title?.replace(/s$/, ""), tail].filter(
    (n, i, all) => n && n.length > 2 && all.indexOf(n) === i,
  )
}

/** The passage (¶, by line block) and a trimmed excerpt around the first mention. */
export function mention(text, words, reach = 70) {
  const blocks = String(text ?? "")
    .split(/\n+/)
    .map((b) => b.replace(/\s+/g, " ").trim())
    .filter(Boolean)
  for (const word of words) {
    const lower = word.toLowerCase()
    const n = blocks.findIndex((b) => b.toLowerCase().includes(lower))
    if (n < 0) continue
    const block = blocks[n]
    const at = block.toLowerCase().indexOf(lower)
    let from = Math.max(0, at - reach)
    let to = Math.min(block.length, at + word.length + reach)
    if (from > 0) from = block.indexOf(" ", from) + 1
    if (to < block.length) to = Math.max(at + word.length, block.lastIndexOf(" ", to))
    return {
      para: n + 1,
      before: (from > 0 ? "…" : "") + block.slice(from, at),
      hit: block.slice(at, at + word.length),
      after: block.slice(at + word.length, to) + (to < block.length ? "…" : ""),
    }
  }
  return null
}

// --- Sources, read from the rendered bibliography -------------------------

const classes = (node) => [node.properties?.className ?? []].flat()

function textOf(node) {
  if (node.type === "text") return node.value
  return (node.children ?? []).map(textOf).join("")
}

function walk(node, visit) {
  visit(node)
  for (const child of node.children ?? []) walk(child, visit)
}

/** Each bibliography entry with author, year, short title, and the ¶ where it is cited. */
export function sourcesOf(tree) {
  const entries = []
  walk(tree, (node) => {
    if (node.type === "element" && classes(node).includes("csl-entry") && node.properties?.id)
      entries.push(node)
  })
  if (entries.length === 0) return []
  const blocks = (tree.children ?? []).filter(
    (c) => c.type === "element" && ["p", "ul", "ol", "blockquote"].includes(c.tagName),
  )
  const citedIn = new Map()
  blocks.forEach((block, i) =>
    walk(block, (node) => {
      const href =
        node.type === "element" && node.tagName === "a" ? String(node.properties?.href ?? "") : ""
      if (!href.startsWith("#bib-")) return
      const id = href.slice(1)
      const list = citedIn.get(id) ?? []
      if (!list.includes(i + 1)) list.push(i + 1)
      citedIn.set(id, list)
    }),
  )
  return entries.map((entry) => {
    const text = textOf(entry).replace(/\s+/g, " ").trim()
    const id = String(entry.properties.id)
    const author =
      text.match(/^(.+?)\s\((?:\d{4}[a-z]?|n\.d\.)\)/)?.[1] ?? text.split("(")[0].trim()
    return {
      id,
      author: author.split(",")[0].trim(),
      year: text.match(/\((\d{4}[a-z]?|n\.d\.)\)/)?.[1] ?? "",
      title: text.split(/\)\.\s*/)[1]?.split(/[.?!]\s/)[0] ?? "",
      cited: citedIn.get(id) ?? [],
    }
  })
}

// --- Components -------------------------------------------------------------

const suffix = (n) =>
  n % 100 >= 11 && n % 100 <= 13 ? "th" : (["th", "st", "nd", "rd"][n % 10] ?? "th")
const ordinal = (position, count) => `PageRank ${position}${suffix(position)} of ${count}`

export function ReadingMargin() {
  function Component({ fileData, allFiles, tree, displayClass }) {
    const slug = fileData.slug
    const here = simplifySlug(slug)
    const metrics = noteMetrics(allFiles)
    const title = fileData.frontmatter?.title ?? here
    const words = needles(title, here)
    const citing = allFiles.filter(
      (f) => f.unlisted !== true && f.slug !== slug && (f.links ?? []).includes(here),
    )
    const notes = citing
      .filter((f) => !String(f.slug).endsWith(".base"))
      .map((f) => ({ file: f, slug: simplifySlug(f.slug), where: mention(f.text, words) }))
      .sort(
        (a, b) =>
          (metrics.position.get(a.slug) ?? Infinity) - (metrics.position.get(b.slug) ?? Infinity),
      )
    const lists = citing.filter((f) => String(f.slug).endsWith(".base"))
    const sources = tree ? sourcesOf(tree) : []
    if (sources.length === 0 && notes.length === 0 && lists.length === 0) return null

    const link = (f, children, extra = {}) =>
      h(
        "a",
        { class: "internal", "data-slug": f.slug, href: resolveRelative(slug, f.slug), ...extra },
        children,
      )

    return h(
      "aside",
      {
        class: [displayClass, "reading-margin"].filter(Boolean).join(" "),
        "aria-label": "Sources and citations",
      },
      sources.length > 0 &&
        h(
          "div",
          { class: "rm-sources" },
          h("h3", { class: "rm-h" }, "Sources"),
          h(
            "ol",
            null,
            sources.map((s) =>
              h(
                "li",
                { "data-bib": s.id, key: s.id },
                h(
                  "a",
                  { href: `#${s.id}`, "data-no-popover": "true" },
                  h("span", { class: "rm-a" }, s.author),
                  h("span", { class: "rm-y" }, s.year),
                  s.title && h("span", { class: "rm-t" }, s.title),
                ),
                s.cited.length > 0 &&
                  h("span", { class: "rm-ln" }, `cited ¶ ${s.cited.join(", ")}`),
              ),
            ),
          ),
        ),
      (notes.length > 0 || lists.length > 0) &&
        h(
          "div",
          { class: "rm-cited" },
          h("h3", { class: "rm-h" }, "Cited in"),
          notes.length > 0 &&
            h(
              "ul",
              null,
              notes.map(({ file, slug: s, where }) => {
                const pos = metrics.position.get(s)
                return h(
                  "li",
                  { key: s },
                  h(
                    "details",
                    null,
                    h(
                      "summary",
                      { title: pos ? ordinal(pos, metrics.count) : undefined },
                      h("span", null, file.frontmatter?.title ?? s),
                      where && h("i", { class: "rm-loc" }, `¶ ${where.para}`),
                    ),
                    h(
                      "p",
                      null,
                      where
                        ? ["“", where.before, h("b", null, where.hit), where.after, "”"]
                        : "Linked without a quotable sentence.",
                      link(file, `open ${file.frontmatter?.title ?? s} →`, {
                        class: "internal rm-open",
                      }),
                    ),
                  ),
                )
              }),
            ),
          lists.length > 0 &&
            h(
              "p",
              { class: "rm-see" },
              "Listed in ",
              lists.flatMap((f, i) => [i > 0 ? "; " : "", link(f, f.frontmatter?.title ?? f.slug)]),
              ".",
            ),
        ),
    )
  }
  Component.displayName = "ReadingMargin"
  Component.css = MARGIN_CSS
  Component.afterDOMLoaded = MARGIN_RUNTIME
  return Component
}

/** This note's PageRank: its place among all notes, on a strip of the distribution. */
export function NoteRank() {
  function Component({ fileData, allFiles, displayClass }) {
    const metrics = noteMetrics(allFiles)
    const here = simplifySlug(fileData.slug ?? "")
    const position = metrics.position.get(here)
    if (!position || metrics.count < 2) return null
    const score = metrics.score.get(here)
    const logs = metrics.scores.map((s) => Math.log10(s * metrics.count))
    const lo = Math.min(...logs)
    const hi = Math.max(...logs)
    const bins = 36
    const counts = new Array(bins).fill(0)
    for (const v of logs)
      counts[Math.min(bins - 1, Math.floor(((v - lo) / (hi - lo || 1)) * bins))] += 1
    // Log heights: most notes share the floor score, and the tail is the interest.
    const peak = Math.log1p(Math.max(...counts))
    const tall = (c) => Math.max(1.5, (Math.log1p(c) / peak) * 10)
    const w = 120
    const step = w / bins
    const x = ((Math.log10(score * metrics.count) - lo) / (hi - lo || 1)) * w
    return h(
      "p",
      {
        class: [displayClass, "note-rank"].filter(Boolean).join(" "),
        title: `PageRank ${score.toPrecision(3)}, ${(score * metrics.count).toFixed(1)}× the mean of ${metrics.count} notes`,
      },
      h("span", null, ordinal(position, metrics.count)),
      h(
        "svg",
        { width: w + 8, height: 14, viewBox: `-4 0 ${w + 8} 14`, "aria-hidden": "true" },
        counts.map((c, i) =>
          c > 0
            ? h("rect", {
                key: i,
                x: (i * step).toFixed(1),
                y: (12 - tall(c)).toFixed(1),
                width: Math.max(1, step - 1).toFixed(1),
                height: tall(c).toFixed(1),
                class: "nr-bin",
              })
            : null,
        ),
        h("line", { x1: 0, y1: 12.5, x2: w, y2: 12.5, class: "nr-axis" }),
        h("path", { d: `M${x.toFixed(1)},14 l-3.5,-5 h7 z`, class: "nr-pointer" }),
      ),
    )
  }
  Component.displayName = "NoteRank"
  Component.css = RANK_CSS
  return Component
}

// --- Styles and runtime -------------------------------------------------------

const MARGIN_CSS = `
.reading-margin{display:grid;gap:22px;padding:10px 6px 12px;background:color-mix(in srgb,var(--light) 92%,transparent)}
.reading-margin .rm-h{font:13px/1.3 var(--fell-sc);color:var(--muted);letter-spacing:.06em;font-weight:400;margin:0;padding-bottom:6px;border-bottom:1px solid var(--dark)}
.rm-sources ol{list-style:none;margin:8px 0 0;padding:0}
.rm-sources li{position:relative;padding:4px 0 4px 18px}
.rm-sources li::before{content:"";position:absolute;left:2px;top:13px;border:4px solid transparent;border-left:6px solid var(--ochre);opacity:0;transition:opacity .2s}
.rm-sources li.in-view::before{opacity:1}
.rm-sources a{display:block;text-decoration:none;background:none!important}
.rm-sources .rm-a{font:15.5px/1.25 var(--fell-sc);color:var(--dark)}
.rm-sources .rm-y{font:11px var(--mono);color:var(--muted);margin-left:4px}
.rm-sources .rm-t{display:block;font:italic 14.5px/1.35 var(--fell);color:var(--darkgray)}
.rm-sources a:hover .rm-a,.rm-sources a:hover .rm-t{color:var(--rust)}
.rm-sources .rm-ln{font:10px var(--mono);color:var(--muted)}
article cite.is-lit a[data-bib]{background:color-mix(in srgb,var(--ochre) 18%,transparent)!important}
.rm-cited ul{list-style:none;padding:0;margin:8px 0 0;max-height:min(22rem,40vh);overflow-y:auto;scrollbar-width:thin}
.rm-cited li{margin:0}
.rm-cited summary{list-style:none;cursor:pointer;padding:4px 0;display:flex;gap:6px;align-items:baseline;justify-content:space-between}
.rm-cited summary::-webkit-details-marker{display:none}
.rm-cited summary span{font:15.5px/1.3 var(--fell);color:var(--dark)}
.rm-cited details[open]>summary span{font-style:italic}
.rm-cited summary:hover span{color:var(--rust)}
.rm-cited .rm-loc{font:11px var(--mono);font-style:normal;color:var(--muted);white-space:nowrap}
.rm-cited details>p{margin:2px 0 8px 12px;padding-left:10px;border-left:1px solid var(--hair);font:italic 14px/1.45 var(--fell);color:var(--darkgray)}
.rm-cited details>p b{font-weight:400;font-style:normal;color:var(--dark)}
.rm-cited .rm-open{display:block;margin-top:3px;font:11px var(--mono);font-style:normal;color:var(--muted)!important;background:none!important;padding:0!important}
.rm-cited .rm-open:hover{color:var(--rust)!important}
.rm-see{margin:10px 0 0;font:italic 14px/1.45 var(--fell);color:var(--muted)}
.rm-see a.internal{background:none!important;padding:0;color:var(--dark)!important;border-bottom:1px solid var(--hair);border-radius:0}
.reading-margin summary:focus-visible,.reading-margin a:focus-visible{outline:1.5px solid var(--ochre);outline-offset:2px}
@media (max-width:1199px){.reading-margin{padding:0 16px;background:none}}
`

const RANK_CSS = `
.note-rank{display:flex;align-items:center;gap:10px;margin:-0.35rem 0 0.2rem;padding:0;font:11.5px/1.4 var(--mono);color:var(--muted)}
.note-rank svg{display:block;overflow:visible}
.note-rank .nr-bin{fill:var(--muted);opacity:.5}
@media (max-width:800px){.note-rank{padding:0 .75rem}}
.note-rank .nr-axis{stroke:var(--muted);stroke-width:.6}
.note-rank .nr-pointer{fill:var(--ochre)}
`

// Runs after every navigation: stamp ink, bibliography back-references, the
// graph's heading, and marking the sources whose citations are on screen.
const MARGIN_RUNTIME = `
(() => {
  let watcher
  function ink() {
    if (document.getElementById("ewan-ink")) return
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("width", "0"); svg.setAttribute("height", "0"); svg.setAttribute("aria-hidden", "true")
    svg.style.position = "absolute"
    svg.innerHTML = '<filter id="ewan-ink"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="5"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.1 1.55"/><feComposite in="SourceGraphic" operator="in"/></filter>'
    document.body.prepend(svg)
  }
  function paragraphOf(el, root) {
    const blocks = [...root.children].filter((c) => c.matches("p, ul, ol, blockquote"))
    const block = blocks.find((b) => b.contains(el))
    return block ? blocks.indexOf(block) + 1 : null
  }
  function bibliography() {
    const root = document.querySelector(".center article .markdown-rendered") ?? document.querySelector(".center article")
    if (!root) return
    for (const li of document.querySelectorAll("article section.bibliography li.csl-entry")) {
      if (li.dataset.enhanced) continue
      li.dataset.enhanced = "1"
      const first = li.firstChild
      if (first && first.nodeType === Node.TEXT_NODE) {
        const m = first.textContent.match(/^(.+?)(\\s\\(\\d{4}[a-z]?\\)|\\s\\(n\\.d\\.\\))/)
        if (m) {
          const a = document.createElement("span")
          a.className = "bib-a"
          a.textContent = m[1]
          first.textContent = first.textContent.slice(m[1].length)
          li.prepend(a)
        }
      }
      const back = [...document.querySelectorAll('article cite a[href="#' + CSS.escape(li.id) + '"]')]
        .map((a) => [a.closest("cite"), paragraphOf(a, root)])
        .filter(([c]) => c && c.id)
        .map(([c, n]) => '<a class="bib-back" href="#' + c.id + '" data-no-popover="true" title="Back to the citation">↩ ¶' + (n ?? "") + "</a>")
      if (back.length) li.insertAdjacentHTML("beforeend", " " + back.join(" "))
    }
  }
  function follow() {
    watcher?.disconnect()
    const items = new Map([...document.querySelectorAll(".rm-sources li[data-bib]")].map((li) => [li.dataset.bib, li]))
    if (!items.size) return
    const visible = new Set()
    watcher = new IntersectionObserver((seen) => {
      seen.forEach((s) => (s.isIntersecting ? visible.add(s.target) : visible.delete(s.target)))
      const lit = new Set([...visible].map((c) => c.querySelector("a[data-bib]")?.getAttribute("href")?.slice(1)))
      items.forEach((li, id) => li.classList.toggle("in-view", lit.has(id)))
    }, { rootMargin: "-10% 0px -30% 0px" })
    document.querySelectorAll("article cite").forEach((c) => watcher.observe(c))
    items.forEach((li, id) => {
      const cites = () => document.querySelectorAll('article cite:has(a[href="#' + CSS.escape(id) + '"])')
      li.addEventListener("mouseenter", () => cites().forEach((c) => c.classList.add("is-lit")))
      li.addEventListener("mouseleave", () => cites().forEach((c) => c.classList.remove("is-lit")))
    })
  }
  function run() {
    ink()
    bibliography()
    const heading = document.querySelector(".graph > h3")
    if (heading) heading.textContent = "Neighbourhood"
    follow()
  }
  document.addEventListener("nav", run)
  if (document.readyState !== "loading") run()
})()
`
