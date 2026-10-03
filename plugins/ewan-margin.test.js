import assert from "node:assert/strict"
import test from "node:test"
import { readFileSync } from "node:fs"
import { parse } from "yaml"
import { render } from "preact-render-to-string"
import {
  listedInBases,
  mention,
  noteMetrics,
  pageRank,
  resolveRelative,
  simplifySlug,
  sourcesOf,
  ReadingMargin,
} from "./ewan-margin/components.js"

test("Listed in follows the actual curation and compounds views, not broad Base links", () => {
  const note = (slug, frontmatter = {}) => ({ slug, frontmatter })
  const other = note("thoughts/unrelated")
  const book = note("books/example", { class: ["book"], status: "reading-list" })
  const compound = note("compounds/example", { class: ["medication"], category: "cognitive" })
  const excluded = note("compounds/other", { class: ["medication"], category: "physical" })
  const notes = [other, book, compound, excluded]
  const base = (path, slug, title) => ({
    slug,
    frontmatter: { title },
    links: notes.map((note) => note.slug),
    basesData: parse(readFileSync(new URL(path, import.meta.url), "utf8")),
  })
  const curation = base("../content/A Limited Curation.base", "curation.base", "A Limited Curation")
  const compounds = base(
    "../content/Notes/Neuropharmacology/Nootropic Compounds.base",
    "compounds.base",
    "Nootropic Compounds",
  )
  const allFiles = [...notes, curation, compounds]
  const listings = listedInBases(allFiles)
  assert.deepEqual(listings.get(book.slug), [curation]) // one listing despite matching both views
  assert.deepEqual(listings.get(compound.slug), [compounds])
  assert.equal(listings.has(other.slug), false)
  assert.equal(listings.has(excluded.slug), false)

  const margin = (fileData) => render(ReadingMargin()({ fileData, allFiles }))
  assert.equal(margin(other), "")
  assert.equal(margin(excluded), "")
  assert.match(margin(book), /Listed in .*A Limited Curation/)
  assert.doesNotMatch(margin(book), /Nootropic Compounds/)
  assert.match(margin(compound), /Listed in .*Nootropic Compounds/)
  assert.doesNotMatch(margin(compound), /A Limited Curation/)
})

test("Base membership combines global and view filters, formulas, self context and limits", () => {
  const note = (slug, status, score, extra = {}) => ({
    slug,
    relativePath: `Library/${slug}.md`,
    frontmatter: { published: true, status, score },
    ...extra,
  })
  const base = {
    slug: "library.base",
    basesSelfContext: { file: { folder: "Library" } },
    basesData: {
      formulas: { inScope: "file.inFolder(this.file.folder)" },
      filters: { and: ["published == true", "formula.inScope"] },
      views: [
        {
          type: "table",
          filters: 'status == "read"',
          sort: [{ property: "score", direction: "DESC" }],
          limit: 1,
        },
        { type: "cards", filters: 'status == "reading"' },
      ],
    },
  }
  const files = [
    note("low", "read", 1),
    note("best", "read", 2),
    note("current", "reading", 0),
    note("outside", "read", 5, { relativePath: "Other/outside.md" }),
    note("hidden", "read", 6, { unlisted: true }),
    note("draft", "reading", 7, { frontmatter: { published: false, status: "reading" } }),
    base,
    { ...base, slug: "empty.base", basesData: { views: [] } },
    { ...base, slug: "hidden.base", unlisted: true },
  ]
  const listings = listedInBases(files)
  assert.deepEqual([...listings.keys()].sort(), ["best", "current"])
  assert.deepEqual(listings.get("best"), [base])
  assert.deepEqual(listings.get("current"), [base])
})

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
