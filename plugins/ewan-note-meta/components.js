import { h } from "preact"
import {
  noteMetrics,
  rankHistogram,
  resolveRelative,
  simplifySlug,
} from "../ewan-margin/components.js"
import { neighbourhood } from "../ewan-rank/graph.js"
import { similarNotes } from "../ewan-rank/similar.js"

// The note's front matter as one ruled strip under the title, sized by what each
// cell holds: date, PageRank, tags, neighbourhood. Hover, focus or a tap opens a
// drawer under the whole strip with the longer reading of that cell.

const suffix = (n) =>
  n % 100 >= 11 && n % 100 <= 13 ? "th" : (["th", "st", "nd", "rd"][n % 10] ?? "th")
const fmt = (d) =>
  d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  })
const valid = (d) => d instanceof Date && !Number.isNaN(d.getTime())

const growthCache = new WeakMap()
/** When every note was written: the garden's growth, binned once per build. */
function growth(allFiles) {
  if (growthCache.has(allFiles)) return growthCache.get(allFiles)
  const times = allFiles
    .map((f) => f.dates?.created)
    .filter(valid)
    .map((d) => d.getTime())
  const lo = Math.min(...times)
  const hi = Date.now()
  const bins = 60
  const counts = new Array(bins).fill(0)
  for (const t of times)
    counts[Math.min(bins - 1, Math.floor(((t - lo) / (hi - lo || 1)) * bins))] += 1
  const peak = Math.log1p(Math.max(1, ...counts))
  const result = { lo, hi, bins, counts, tall: (c) => (Math.log1p(c) / peak) * 10 }
  growthCache.set(allFiles, result)
  return result
}

const chevron = () =>
  h(
    "svg",
    { class: "nm-chev", width: 9, height: 9, viewBox: "0 0 10 10", "aria-hidden": "true" },
    h("path", { d: "M1.5 3.5 5 7l3.5-3.5" }),
  )

function DateCell({ fileData, allFiles }) {
  const created = fileData.dates?.created
  if (!valid(created)) return null
  const modified = valid(fileData.dates?.modified) ? fileData.dates.modified : created
  const words = (fileData.text ?? "").split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  const g = growth(allFiles)
  const start = Math.min(g.lo, created.getTime())
  const end = Math.max(g.hi, modified.getTime())
  const at = (t) => (((t - start) / (end - start || 1)) * 100).toFixed(2) + "%"
  const edited = modified.getTime() - created.getTime() > 86400000
  return h(
    "div",
    { class: "nm-cell nm-date", tabindex: 0 },
    h("time", { datetime: created.toISOString() }, fmt(created)),
    h(
      "div",
      { class: "nm-drawer" },
      h(
        "dl",
        { class: "nm-fields" },
        h("dt", null, "Written"),
        h("dd", null, fmt(created)),
        edited ? [h("dt", null, "Revised"), h("dd", null, fmt(modified))] : null,
        h("dt", null, "Length"),
        h("dd", null, words.toLocaleString("en-GB") + " words, " + minutes + " min"),
      ),
      h(
        "div",
        { class: "nm-span", "aria-hidden": "true" },
        h(
          "svg",
          { class: "nm-span-rug", viewBox: "0 0 " + g.bins + " 10", preserveAspectRatio: "none" },
          g.counts.map((n, i) =>
            n > 0
              ? h("rect", {
                  key: i,
                  x: i + 0.2,
                  y: 10 - g.tall(n),
                  width: 0.6,
                  height: g.tall(n),
                  class: "nm-bin",
                })
              : null,
          ),
        ),
        h("i", {
          class: "nm-span-life",
          style: "left:" + at(created) + ";right:calc(100% - " + at(modified) + ")",
        }),
        h("b", { class: "nm-span-mark", style: "left:" + at(created) }),
        edited
          ? h("b", { class: "nm-span-mark nm-span-rev", style: "left:" + at(modified) })
          : null,
        h("span", { class: "nm-span-lo" }, fmt(new Date(start))),
        h("span", { class: "nm-span-hi" }, "today"),
      ),
    ),
  )
}

/** Bars of the PageRank distribution (log heights) with this note's pointer. */
function rug(hist, x, w, hgt, cls) {
  const step = w / hist.bins
  return h(
    "svg",
    {
      class: cls,
      viewBox: "0 0 " + w + " " + (hgt + 3),
      preserveAspectRatio: "none",
      "aria-hidden": "true",
    },
    hist.counts.map((c, i) =>
      c > 0
        ? h("rect", {
            key: i,
            x: (i * step).toFixed(2),
            y: (hgt - (hist.tall(c) / 10) * hgt).toFixed(2),
            width: Math.max(0.6, step * 0.62).toFixed(2),
            height: ((hist.tall(c) / 10) * hgt).toFixed(2),
            class: "nm-bin",
          })
        : null,
    ),
    h("rect", {
      x: Math.max(0, x * w - 0.9).toFixed(2),
      y: 0,
      width: 1.8,
      height: hgt + 3,
      class: "nm-pointer",
    }),
  )
}

function RankCell({ fileData, allFiles }) {
  const metrics = noteMetrics(allFiles)
  const here = simplifySlug(fileData.slug ?? "")
  const position = metrics.position.get(here)
  if (!position || metrics.count < 2) return null
  const score = metrics.score.get(here)
  const hist = rankHistogram(metrics)
  const x = (Math.log10(score * metrics.count) - hist.lo) / (hist.hi - hist.lo || 1)
  const label = "PageRank " + position + suffix(position) + " of " + metrics.count
  return h(
    "div",
    { class: "nm-cell nm-rank", tabindex: 0, "aria-label": label },
    rug(hist, x, 30, 11, "nm-rug"),
    h("span", { class: "nm-num" }, position),
    h(
      "div",
      { class: "nm-drawer" },
      h(
        "p",
        { class: "nm-read" },
        h(
          "a",
          { href: resolveRelative(here, "rank"), class: "internal", "data-slug": "rank" },
          label,
        ),
        h("span", null, ", " + (score * metrics.count).toFixed(1) + "× the mean score"),
      ),
      rug(hist, x, 360, 26, "nm-rug-wide"),
      h(
        "div",
        { class: "nm-axis" },
        h("span", null, "rarely reached"),
        h("span", null, "often reached"),
      ),
    ),
  )
}

function TagCell({ fileData }) {
  const tags = (fileData.frontmatter?.tags ?? []).filter(Boolean)
  if (tags.length === 0) return null
  const here = fileData.slug ?? ""
  return h(
    "ul",
    { class: "nm-cell nm-tags" },
    tags.map((tag) =>
      h(
        "li",
        { key: tag },
        h("a", { href: resolveRelative(here, "tags/" + tag), class: "internal tag-link" }, tag),
      ),
    ),
  )
}

function NearCell({ fileData, allFiles }) {
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
  const list = (title, items, tail) =>
    items.length
      ? h(
          "div",
          { class: "nm-list" },
          h("h4", null, title),
          h(
            "ol",
            null,
            items.map((n) =>
              h(
                "li",
                { key: n.slug, title: n.via ? "via " + n.via.title : undefined },
                link(n.slug, n.title),
                tail(n),
              ),
            ),
          ),
        )
      : null
  const count = near.length + similar.length
  return h(
    "div",
    {
      class: "nm-cell nm-near",
      tabindex: 0,
      "aria-label": count + " notes nearby or similar",
      "aria-haspopup": "true",
    },
    h(
      "svg",
      { class: "nm-glyph", width: 15, height: 13, viewBox: "0 0 15 13", "aria-hidden": "true" },
      h("path", { d: "M4 8.5 7.5 2.5M4 8.5h7.5M7.5 2.5 11.5 8.5" }),
      h("circle", { cx: 4, cy: 8.5, r: 2.2, class: "here" }),
      h("circle", { cx: 7.5, cy: 2.5, r: 1.6 }),
      h("circle", { cx: 11.5, cy: 8.5, r: 1.6 }),
    ),
    h("span", { class: "nm-num" }, count),
    chevron(),
    h(
      "div",
      { class: "nm-drawer nm-drawer-near" },
      list("Nearby", near, (n) =>
        h("span", {
          class: "nm-bar",
          style: "width:" + Math.max(3, Math.round((n.score / top) * 40)) + "px",
        }),
      ),
      list("Similar, not linked", similar, (n) =>
        h("span", { class: "nm-via nm-pct" }, Math.round(n.similarity * 100) + "%"),
      ),
    ),
  )
}

const CSS = String.raw`
.note-meta{position:relative;z-index:3;display:flex;flex-wrap:wrap;align-items:stretch;margin:.4rem 0 1.6rem!important;border-top:1px solid var(--dark);border-bottom:1px solid var(--dark);background:color-mix(in srgb,var(--sunk) 55%,transparent);font:11.5px/1.4 var(--mono);color:var(--muted)}
.note-meta .nm-cell{position:static;display:flex;align-items:center;gap:7px;min-height:30px;padding:0 12px;margin:0;box-sizing:border-box;outline:none;transition:background-color .15s}
.note-meta .nm-cell+.nm-cell{border-left:1px solid var(--hair)}
.note-meta .nm-cell:first-child{padding-left:2px}
.note-meta .nm-cell:has(.nm-drawer){cursor:default}
.note-meta .nm-cell:has(.nm-drawer):hover,.note-meta .nm-cell:has(.nm-drawer):focus-visible,.note-meta .nm-cell.open{background:color-mix(in srgb,var(--sunk) 90%,var(--dark) 4%)}
.note-meta .nm-cell:focus-visible{box-shadow:inset 0 -2px var(--gold)}
.note-meta time{color:var(--darkgray)}
.note-meta .nm-num{color:var(--darkgray)}
.note-meta .nm-tags{position:relative;flex:1 1 0;min-width:0;flex-wrap:nowrap;gap:0;list-style:none;padding:3px 12px;overflow-x:auto;overflow-y:hidden;white-space:nowrap;scrollbar-width:none;overscroll-behavior-x:contain}
.note-meta .nm-tags::-webkit-scrollbar{display:none}
.note-meta .nm-tags.more-r{-webkit-mask-image:linear-gradient(to right,#000 calc(100% - 28px),transparent);mask-image:linear-gradient(to right,#000 calc(100% - 28px),transparent)}
.note-meta .nm-tags.more-l{-webkit-mask-image:linear-gradient(to right,transparent,#000 28px);mask-image:linear-gradient(to right,transparent,#000 28px)}
.note-meta .nm-tags.more-l.more-r{-webkit-mask-image:linear-gradient(to right,transparent,#000 28px,#000 calc(100% - 28px),transparent);mask-image:linear-gradient(to right,transparent,#000 28px,#000 calc(100% - 28px),transparent)}
.note-meta .nm-tags::after{content:"";position:absolute;left:0;bottom:0;height:2px;width:var(--head-w,0);transform:translateX(var(--head-x,0));background:var(--gold);opacity:0;transition:transform .22s cubic-bezier(.2,.7,.2,1),width .22s cubic-bezier(.2,.7,.2,1),opacity .15s}
.note-meta .nm-tags.reading::after{opacity:1}
.note-meta .nm-tags li{margin:0;padding:0;display:inline-block;flex:none}
.note-meta .nm-tags li+li::before{content:"·";margin:0 .5em;color:var(--muted)}
.note-meta .nm-tags a.internal{background:none!important;padding:0;border-radius:0;font:italic 15px/1.5 var(--fell);color:var(--darkgray);text-decoration:none;border-bottom:1px solid var(--hair)}
.note-meta .nm-tags a.internal::before{content:none!important}
.note-meta .nm-tags a.internal:hover,.note-meta .nm-tags a.internal:focus-visible{color:var(--dark);border-bottom-color:transparent;outline:none}
.note-meta .nm-near{margin-left:auto}
.note-meta .nm-tags+.nm-near{margin-left:0}
.note-meta .nm-glyph{display:block;overflow:visible}
.note-meta .nm-glyph path{fill:none;stroke:var(--muted);stroke-width:.9}
.note-meta .nm-glyph circle{fill:var(--light);stroke:var(--muted);stroke-width:1}
.note-meta .nm-glyph circle.here{fill:var(--gold);stroke:none}
.note-meta .nm-chev{display:block}
.note-meta .nm-chev path{fill:none;stroke:var(--muted);stroke-width:1.3;transition:transform .2s;transform-origin:5px 5px}
.note-meta .nm-near:hover .nm-chev path,.note-meta .nm-near:focus-within .nm-chev path,.note-meta .nm-near.open .nm-chev path{transform:rotate(180deg)}
.note-meta .nm-rug{display:block;width:30px;height:14px}
.note-meta .nm-bin{fill:var(--muted);opacity:.55}
.note-meta .nm-pointer{fill:var(--gold)}
.note-meta .nm-drawer{position:absolute;left:-1px;right:-1px;top:calc(100% + 1px);box-sizing:border-box;padding:12px 14px 14px;background:var(--raised);border:1px solid var(--hair);border-top:0;border-bottom:1px solid var(--dark);cursor:auto;visibility:hidden;opacity:0;transform:translateY(-4px);transition:opacity .16s,transform .16s,visibility 0s .16s;pointer-events:none}
.note-meta .nm-cell:hover>.nm-drawer,.note-meta .nm-cell:focus-within>.nm-drawer,.note-meta .nm-cell.open>.nm-drawer{visibility:visible;opacity:1;transform:none;transition:opacity .16s,transform .16s;pointer-events:auto}
.note-meta.touch .nm-cell:not(.open)>.nm-drawer{visibility:hidden;opacity:0;pointer-events:none}
.note-meta .nm-drawer::before{content:"";position:absolute;left:0;right:0;top:-12px;height:12px}
.note-meta .nm-fields{display:grid;grid-template-columns:auto 1fr;gap:3px 16px;margin:0;align-items:baseline}
.note-meta .nm-fields dt{font:13px/1.3 var(--fell-sc);letter-spacing:.06em;color:var(--muted)}
.note-meta .nm-fields dd{margin:0;color:var(--darkgray)}
.note-meta .nm-span{position:relative;height:30px;margin:14px 0 16px;border-bottom:1px solid var(--muted)}
.note-meta .nm-span-rug{position:absolute;left:0;bottom:0;width:100%;height:16px;overflow:visible}
.note-meta .nm-span-life{position:absolute;bottom:-1px;height:3px;background:var(--accent-link,var(--pine));transform-origin:left;transform:scaleX(0);transition:transform .5s cubic-bezier(.2,.7,.2,1) .08s}
.note-meta .nm-span-mark{position:absolute;bottom:-4px;width:1.5px;height:26px;background:var(--dark);transform:scaleY(0);transform-origin:bottom;transition:transform .25s .05s}
.note-meta .nm-span-rev{background:var(--gold);transition-delay:.45s}
.note-meta .nm-cell:hover .nm-span-life,.note-meta .nm-cell:focus-within .nm-span-life,.note-meta .nm-cell.open .nm-span-life,.note-meta .nm-cell:hover .nm-span-mark,.note-meta .nm-cell:focus-within .nm-span-mark,.note-meta .nm-cell.open .nm-span-mark{transform:none}
.note-meta .nm-span-lo,.note-meta .nm-span-hi{position:absolute;top:calc(100% + 3px);font:10px var(--mono);color:var(--muted)}
.note-meta .nm-span-lo{left:0}.note-meta .nm-span-hi{right:0}
.note-meta .nm-read{margin:0 0 8px;font:italic 15px/1.4 var(--fell);color:var(--darkgray)}
.note-meta .nm-read a.internal{background:none!important;padding:0;color:var(--dark);font-style:normal;font-family:var(--fell-sc);letter-spacing:.03em;text-decoration:none;border-bottom:1px solid var(--hair)}
.note-meta .nm-read a.internal:hover{color:var(--accent-hover,var(--rust))}
.note-meta .nm-rug-wide{display:block;width:100%;height:29px}
.note-meta .nm-axis{display:flex;justify-content:space-between;margin-top:3px;padding-top:3px;border-top:1px solid var(--muted);font:10px var(--mono)}
.note-meta .nm-drawer-near{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px 28px}
.note-meta .nm-list h4{margin:0 0 4px;padding-bottom:4px;border-bottom:1px solid var(--hair);font:13px/1.3 var(--fell-sc);letter-spacing:.06em;color:var(--muted);font-weight:400}
.note-meta .nm-list ol{list-style:none;margin:0;padding:0}
.note-meta .nm-list li{display:flex;gap:8px;align-items:baseline;padding:3px 0;font:15.5px/1.3 var(--fell)}
.note-meta .nm-list a.internal{background:none!important;padding:0;color:var(--dark);min-width:0}
.note-meta .nm-list a.internal:hover{color:var(--accent-hover,var(--rust))}
.note-meta .nm-via{font:11px var(--mono);color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}
.note-meta .nm-via a.internal{color:var(--muted);font:inherit}
.note-meta .nm-pct{margin-left:auto;flex:none;overflow:visible}
.note-meta .nm-bar{margin-left:auto;flex:none;height:3px;align-self:center;background:var(--gold);opacity:.7}
@media (max-width:800px){.note-meta{margin-left:-.75rem!important;margin-right:-.75rem!important;padding:0 .75rem}.note-meta .nm-tags{order:9;flex:1 1 100%;border-left:0!important;border-top:1px solid var(--hair);padding:5px 0 6px}.note-meta .nm-near,.note-meta .nm-tags+.nm-near{margin-left:auto}.note-meta .nm-drawer{left:0;right:0}}
@media (prefers-reduced-motion:reduce){.note-meta .nm-drawer,.note-meta .nm-span-life,.note-meta .nm-span-mark,.note-meta .nm-chev path{transition:none!important}}
`

// Touch has no hover: a tap on a cell opens its drawer, a tap elsewhere or Escape
// closes it. Pointer devices keep hover and focus only.
const RUNTIME = String.raw`
(() => {
  const bind = () => {
    const bar = document.querySelector(".note-meta")
    if (!bar || bar.dataset.bound) return
    bar.dataset.bound = "1"
    const touch = matchMedia("(hover: none)").matches
    if (touch) bar.classList.add("touch")
    const close = (except) => bar.querySelectorAll(".nm-cell.open").forEach((c) => c !== except && c.classList.remove("open"))
    bar.addEventListener("click", (e) => {
      if (!touch || e.target.closest(".nm-drawer a, .nm-tags")) return
      const cell = e.target.closest(".nm-cell")
      if (!cell || !cell.querySelector(".nm-drawer")) return
      if (e.target.closest(".nm-drawer")) return
      close(cell)
      cell.classList.toggle("open")
    })
    const tape = bar.querySelector(".nm-tags")
    if (tape) {
      const fades = () => {
        const max = tape.scrollWidth - tape.clientWidth
        tape.classList.toggle("more-l", tape.scrollLeft > 1)
        tape.classList.toggle("more-r", tape.scrollLeft < max - 1)
      }
      tape.addEventListener("scroll", fades, { passive: true })
      tape.addEventListener("wheel", (e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
        const max = tape.scrollWidth - tape.clientWidth
        if (max <= 0) return
        const next = Math.max(0, Math.min(max, tape.scrollLeft + e.deltaY))
        if (next === tape.scrollLeft) return
        e.preventDefault()
        tape.scrollLeft = next
      }, { passive: false })
      const head = (a) => {
        if (!a) return tape.classList.remove("reading")
        tape.style.setProperty("--head-x", a.offsetLeft + "px")
        tape.style.setProperty("--head-w", a.offsetWidth + "px")
        tape.classList.add("reading")
      }
      tape.addEventListener("pointerover", (e) => head(e.target.closest("a")))
      tape.addEventListener("pointerleave", () => head(null))
      tape.addEventListener("focusin", (e) => { const a = e.target.closest("a"); head(a); a?.scrollIntoView({ block: "nearest", inline: "nearest" }) })
      tape.addEventListener("focusout", () => head(null))
      new ResizeObserver(fades).observe(tape)
      fades()
    }
    const outside = (e) => { if (!bar.contains(e.target)) close() }
    const key = (e) => { if (e.key === "Escape") { close(); if (bar.contains(document.activeElement)) document.activeElement.blur() } }
    document.addEventListener("click", outside)
    document.addEventListener("keydown", key)
    window.addCleanup?.(() => { document.removeEventListener("click", outside); document.removeEventListener("keydown", key) })
  }
  document.addEventListener("nav", bind)
  bind()
})()
`

export function NoteMeta() {
  function Component(props) {
    const cells = [DateCell(props), RankCell(props), TagCell(props), NearCell(props)].filter(
      Boolean,
    )
    if (cells.length === 0) return null
    return h("div", { class: [props.displayClass, "note-meta"].filter(Boolean).join(" ") }, cells)
  }
  Component.displayName = "NoteMeta"
  Component.css = CSS
  Component.afterDOMLoaded = RUNTIME
  return Component
}
