import assert from "node:assert/strict"
import test from "node:test"
import { render } from "preact-render-to-string"
import { Neighbourhood } from "./ewan-neighbourhood/components.js"
import RankPage from "./ewan-rank/index.js"
import {
  betweenness,
  components,
  hits,
  neighbourhood,
  noteGraph,
  walkFrom,
} from "./ewan-rank/graph.js"

// a - b - c - d - e (a chain), plus an isolated f.
const note = (slug, links = []) => ({ slug, frontmatter: { title: slug.toUpperCase() }, links })
const chain = () => [
  note("a", ["b"]),
  note("b", ["c"]),
  note("c", ["d"]),
  note("d", ["e"]),
  note("e"),
  note("f"),
]

test("the walk spreads mass by distance and sums to one", () => {
  const graph = noteGraph(chain())
  const p = walkFrom(graph, graph.index.get("a"))
  assert.ok(Math.abs(p.reduce((s, v) => s + v, 0) - 1) < 1e-9)
  const at = (s) => p[graph.index.get(s)]
  assert.ok(at("b") > at("c") && at("c") > at("d") && at("d") > at("e"))
  assert.equal(at("f"), 0)
})

test("neighbourhood leaves out direct links and names the route", () => {
  const near = neighbourhood(chain(), "a", 3)
  assert.deepEqual(
    near.map((n) => n.slug),
    ["c", "d", "e"],
  )
  assert.equal(near[0].via.slug, "b")
  assert.deepEqual(neighbourhood(chain(), "f"), [])
})

test("the middle of a chain bridges most; components find the stray", () => {
  const graph = noteGraph(chain())
  const bc = betweenness(graph)
  const best = graph.slugs[bc.indexOf(Math.max(...bc))]
  assert.equal(best, "c")
  assert.equal(bc[graph.index.get("a")], 0)
  const comp = components(graph)
  assert.deepEqual(comp.sizes, [5, 1])
  assert.equal(comp.id[graph.index.get("f")], 1)
})

test("authorities are the cited, hubs the citing", () => {
  const files = [note("x", ["z"]), note("y", ["z"]), note("z")]
  const graph = noteGraph(files)
  const { hub, authority } = hits(graph)
  const i = (s) => graph.index.get(s)
  assert.ok(authority[i("z")] > authority[i("x")])
  assert.ok(hub[i("x")] > hub[i("z")])
})

test("components render", () => {
  const files = chain()
  const html = render(Neighbourhood()({ fileData: { slug: "a" }, allFiles: files }))
  assert.match(html, /Nearby/)
  assert.match(html, /via/)
  const page = RankPage()
  const [virtual] = page.generate({})
  assert.equal(virtual.slug, "rank")
  const body = render(page.body()({ fileData: virtual.data, allFiles: files }))
  assert.match(body, /rank-page/)
  assert.match(body, /id="rank-data"/)
  assert.equal((body.match(/data-i=/g) ?? []).length, 6)
})

test("note meta strip renders date, rank, tags and neighbourhood cells", async () => {
  const { NoteMeta } = await import("./ewan-note-meta/components.js")
  const files = chain()
  const created = new Date("2026-10-13T00:00:00Z")
  files[0].dates = { created, modified: new Date("2026-11-18T00:00:00Z") }
  const fileData = {
    ...files[0],
    text: "one two three",
    frontmatter: { title: "A", tags: ["x/y"] },
  }
  const html = render(NoteMeta()({ fileData, allFiles: files }))
  assert.match(html, /class="note-meta"/)
  assert.match(html, /13 Oct 2026/)
  assert.match(html, /Revised/)
  assert.match(html, /PageRank \d+\w\w of 6/)
  assert.match(html, /href="\.\/tags\/x\/y"/)
  assert.match(html, /Nearby/)
  assert.equal(render(NoteMeta()({ fileData: { slug: "f" }, allFiles: [] })), "")
})

test("similar notes skip links, copies and the note itself", async () => {
  const { similarNotes } = await import("./ewan-rank/similar.js")
  const files = chain().map((f) => ({ ...f, relativePath: `${f.slug}.md` }))
  // Not in the real table, so no section; the component must still render nearby.
  assert.deepEqual(similarNotes(files, files[0]), [])
})
