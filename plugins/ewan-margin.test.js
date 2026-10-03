import assert from "node:assert/strict"
import test from "node:test"
import {
  mention,
  noteMetrics,
  pageRank,
  resolveRelative,
  simplifySlug,
  sourcesOf,
} from "./ewan-margin/components.js"

test("PageRank sums to one, ignores self and duplicate edges, favours the cited", () => {
  const ranks = pageRank(
    ["a", "b", "c"],
    [
      ["a", "c"],
      ["a", "c"],
      ["b", "c"],
      ["c", "c"],
      ["c", "a"],
    ],
  )
  const total = [...ranks.values()].reduce((s, v) => s + v, 0)
  assert.ok(Math.abs(total - 1) < 1e-9)
  assert.ok(ranks.get("c") > ranks.get("a"))
  assert.ok(ranks.get("a") > ranks.get("b"))
  assert.equal(pageRank([], []).size, 0)
})

test("note metrics rank existing notes only, without listings or tags", () => {
  const files = [
    { slug: "notes/a", links: ["notes/b", "missing"] },
    { slug: "notes/b", links: ["notes/a"] },
    { slug: "notes/c", links: ["notes/b"] },
    { slug: "list.base", links: ["notes/c", "notes/c"] },
    { slug: "tags/x", links: ["notes/c"] },
  ]
  const m = noteMetrics(files)
  assert.equal(m.count, 3)
  assert.equal(m.position.get("notes/b"), 1)
  assert.equal(m.position.get("list.base"), undefined)
  assert.equal(m.position.get("missing"), undefined)
  assert.equal(noteMetrics(files), m)
})

test("mentions give the passage and a trimmed excerpt", () => {
  const text =
    "Intro line.\nIt stems from the Free Energy Principle and Bayesian Inference, proposing more."
  const hit = mention(text, ["Free Energy Principle"], 12)
  assert.equal(hit.para, 2)
  assert.equal(hit.hit, "Free Energy Principle")
  assert.match(hit.before, /^…/)
  assert.match(hit.after, /…$/)
  assert.equal(mention("nothing here", ["Kalman"]), null)
})

test("sources read the bibliography and where each is cited", () => {
  const el = (tagName, properties = {}, children = []) => ({
    type: "element",
    tagName,
    properties,
    children,
  })
  const t = (value) => ({ type: "text", value })
  const tree = {
    type: "root",
    children: [
      el("p", {}, [t("Intro.")]),
      el("p", {}, [el("cite", {}, [el("a", { href: "#bib-friston2010" }, [t("Friston, 2010")])])]),
      el("section", { className: ["bibliography"] }, [
        el("ul", {}, [
          el("li", { className: ["csl-entry"], id: "bib-friston2010" }, [
            t("Friston, K. (2010). The Free-Energy Principle: A Unified Brain Theory? "),
            el("i", {}, [t("Nature Reviews Neuroscience")]),
          ]),
        ]),
      ]),
    ],
  }
  assert.deepEqual(sourcesOf(tree), [
    {
      id: "bib-friston2010",
      author: "Friston",
      year: "2010",
      title: "The Free-Energy Principle: A Unified Brain Theory",
      cited: [2],
    },
  ])
  assert.deepEqual(sourcesOf({ type: "root", children: [] }), [])
})

test("links resolve relative to the page like Quartz", () => {
  assert.equal(simplifySlug("notes/x/index"), "notes/x/")
  assert.equal(simplifySlug("index"), "/")
  assert.equal(
    resolveRelative("notes/theory/fep", "notes/theory/active-inference"),
    "../../notes/theory/active-inference",
  )
  assert.equal(resolveRelative("personal-canon", "notes/a"), "./notes/a")
})
