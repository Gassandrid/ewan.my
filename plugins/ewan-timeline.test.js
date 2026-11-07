import assert from "node:assert/strict"
import test from "node:test"
import { render } from "preact-render-to-string"
import { TimelineToggle } from "./ewan-timeline/components.js"
import {
  dailyDate,
  extractUpdates,
  insertMount,
  isoDay,
  timelineData,
} from "./ewan-timeline/index.js"

const el = (tagName, properties = {}, children = []) => ({
  type: "element",
  tagName,
  properties,
  children,
})
const txt = (value) => ({ type: "text", value })
const daily = (date, label = date) =>
  el("a", { href: `../${date}`, dataSlug: date, className: ["internal"] }, [txt(label)])

test("only daily-note links carry a date", () => {
  assert.equal(dailyDate(daily("10-30-2026")), "2026-10-30")
  assert.equal(dailyDate(el("a", { href: "../private/daily/07-30-2026#x" })), "2026-07-30")
  assert.equal(dailyDate(el("a", { dataSlug: "13-01-2026" })), null)
  assert.equal(dailyDate(el("a", { dataSlug: "thoughts/braai" })), null)
})

test("updates take their label and anchor from the surrounding text", () => {
  const tree = {
    type: "root",
    children: [
      el("p", {}, [txt("Intro on "), daily("12-18-2025"), txt(" I had an epiphany.")]),
      el("h2", { id: "one-day-update--12-17-2025-" }, [
        txt("One Day Update ( "),
        daily("12-17-2025"),
        txt(" )"),
        el("a", { role: "anchor", href: "#one-day-update--12-17-2025-" }, [txt("#")]),
      ]),
      el("p", {}, [txt("Body mentions "), daily("12-17-2025"), txt(" again.")]),
      el("div", { className: ["callout"] }, [
        el("div", { className: ["callout-title"] }, [daily("02-27-2026")]),
        el("div", { className: ["callout-content"] }, [el("p", {}, [txt("A quiet aside.")])]),
      ]),
      el("ul", {}, [
        el("li", {}, [
          daily("08-04-2026"),
          txt(" 08:58 a point"),
          el("ul", {}, [el("li", {}, [txt("nested")])]),
        ]),
      ]),
    ],
  }
  assert.deepEqual(extractUpdates(tree), [
    { date: "2025-12-18", label: "Intro on I had an epiphany.", anchor: "" },
    { date: "2025-12-17", label: "One Day Update", anchor: "one-day-update--12-17-2025-" },
    { date: "2026-02-27", label: "A quiet aside.", anchor: "one-day-update--12-17-2025-" },
    { date: "2026-08-04", label: "08:58 a point", anchor: "one-day-update--12-17-2025-" },
  ])
})

test("creation and later updates become events; the homepage and tags are left out", () => {
  const data = timelineData([
    {
      slug: "thoughts/a",
      frontmatter: { title: "A", date: new Date("2025-12-16T00:00:00Z") },
      noteTimeline: [
        { date: "2025-12-16", label: "same day", anchor: "" },
        { date: "2025-12-10", label: "before it existed", anchor: "" },
        { date: "2026-01-09", label: "New Use", anchor: "new-use" },
      ],
    },
    { slug: "notes/b", frontmatter: { title: "B", date: "2024-09-12" } },
    { slug: "notes/undated", frontmatter: { title: "U" } },
    { slug: "index", frontmatter: { date: "2024-10-02" } },
    { slug: "tags/x", frontmatter: { date: "2024-10-02" } },
  ])
  assert.deepEqual(data.notes, [
    ["thoughts/a", "A"],
    ["notes/b", "B"],
  ])
  assert.deepEqual(data.events, [
    ["2024-09-12", 0, 1],
    ["2025-12-16", 0, 0],
    ["2026-01-09", 1, 0, "New Use", "new-use"],
  ])
  assert.equal(isoDay("2026-02-10T19:06:15-05:00"), "2026-02-10")
})

test("the homepage mount goes before the closing rule", () => {
  const tree = { type: "root", children: [el("p"), el("hr"), el("p"), el("hr"), el("p")] }
  insertMount(tree)
  assert.deepEqual(
    tree.children.map((c) => c.properties?.className?.[0] ?? c.tagName),
    ["p", "hr", "p", "note-timeline", "hr", "p"],
  )
})

test("the toolbar drop reads the data relative to the page", () => {
  const Toggle = TimelineToggle()
  const html = render(Toggle({ fileData: { slug: "thoughts/braai" } }))
  assert.match(html, /aria-controls="nt-drop"/)
  assert.match(html, /data-src="\.\.\/static\/note-timeline\.json"/)
  assert.match(html, /data-dir="down"/)
})
