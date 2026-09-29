import assert from "node:assert/strict"
import { test } from "node:test"
import fs from "node:fs/promises"
import path from "node:path"
import { compileReactPages, inspectBody, jsonData, mergeReactPages, validatePage } from "./compiler"
import { defaultProcessedContent } from "../plugins/vfile"
import type { BuildCtx } from "../util/ctx"
import type { FilePath, FullSlug } from "../util/path"

const metadata = {
  slug: "examples/probe",
  title: "Probe",
  description: "A useful specimen",
  date: "2026-09-28",
}

test("React metadata and data fail early instead of creating ambiguous routes or hydration", () => {
  for (const value of [
    "../escape",
    "Uppercase",
    "page.html",
    "static/file",
    "tags",
    "index",
    "404",
  ])
    assert.throws(() => validatePage({ ...metadata, slug: value }, "probe"))
  assert.throws(() => validatePage({ ...metadata, aliases: ["static"] }, "probe"))
  assert.throws(() => validatePage({ ...metadata, date: "yesterday" }, "probe"))
  assert.throws(() => validatePage({ ...metadata, replaces: ["../a.md"] }, "probe"))
  assert.throws(() => validatePage({ ...metadata, properties: [] }, "probe"))
  const circular: Record<string, unknown> = {}
  circular.self = circular
  for (const value of [undefined, NaN, new Date(), { f: () => 1 }, circular])
    assert.throws(() => jsonData(value, "probe"), /JSON/)
  assert.deepEqual(jsonData({ a: [null, 1, true, "text"] }, "probe"), {
    a: [null, 1, true, "text"],
  })
})

test("SSR extraction preserves headings and canonical local links without indexing code", () => {
  const body = inspectBody(
    '<h2 id="result">Observed <em>result</em></h2><p>Searchable evidence</p><h3 id="detail">Detail</h3><a href="/garden/notes/target#x">Target</a><a href="https://elsewhere.example/no">External</a><a href="/garden/static/plot.svg">Plot</a><script>secret code</script>',
    "examples/probe",
    "ewan.my/garden",
  )
  assert.deepEqual(body.toc, [
    { depth: 0, text: "Observed result", slug: "result" },
    { depth: 1, text: "Detail", slug: "detail" },
  ])
  assert.deepEqual(body.links, ["notes/target"])
  assert.match(body.text, /Searchable evidence/)
  assert.doesNotMatch(body.text, /secret code/)
  assert.throws(() => inspectBody("<h2>Missing anchor</h2>", "probe", "ewan.my"), /needs an id/)
  assert.throws(
    () => inspectBody('<h2 id="x">A</h2><p id="x">B</p>', "probe", "ewan.my"),
    /duplicate id/,
  )
})

test("real compilation: React SSR, data, CSS, static/draft modes, migrations and collisions", async () => {
  await fs.mkdir(".quartz-cache", { recursive: true })
  const directory = await fs.mkdtemp(path.resolve(".quartz-cache/page-test-"))
  const output = path.join(directory, "output")
  const api = JSON.stringify(path.resolve("quartz/custom-pages/api.tsx"))
  const fixture = (meta: object, body: string) => `/** @jsxImportSource react */
    import {useState,useId} from "react"; import {PageLink,Section} from ${api}; import './probe.css';
    export const page=${JSON.stringify(meta)};
    export default function Probe({data}) { const [count]=useState(2); const id=useId(); return <Section id="result" title="Result"><p id={id}>{data.text ?? 'Static content'} {count}</p><PageLink to="notes/target#method">Target</PageLink>${body}</Section>; }`
  const ctx = {
    cfg: { configuration: { baseUrl: "ewan.my/garden", reactPages: { directory } } },
    argv: { output },
  } as BuildCtx
  try {
    await fs.writeFile(path.join(directory, "probe.css"), ".probe {color:var(--dark)}")
    await fs.writeFile(path.join(directory, "values.txt"), 'Evidence <tag> "quotes" & symbols')
    await fs.writeFile(
      path.join(directory, "probe.page.tsx"),
      fixture(
        {
          ...metadata,
          aliases: ["old-probe"],
          replaces: ["Old Probe.md"],
          properties: { project: "Research" },
        },
        "<button>{count}</button>",
      ),
    )
    await fs.writeFile(
      path.join(directory, "probe.data.ts"),
      `export default async ({readText})=>({text:await readText(${JSON.stringify(path.join(directory, "values.txt"))})})`,
    )
    await fs.writeFile(
      path.join(directory, "static.page.tsx"),
      fixture({ ...metadata, slug: "examples/static", hydrate: false }, ""),
    )
    await fs.writeFile(
      path.join(directory, "draft.page.tsx"),
      fixture({ ...metadata, slug: "examples/draft", draft: true, replaces: ["Draft.md"] }, ""),
    )
    await fs.writeFile(
      path.join(directory, "draft.data.ts"),
      "throw new Error('Draft data must not execute')",
    )
    const result = await compileReactPages(ctx)
    assert.equal(result.content.length, 2)
    assert.deepEqual(result.slugs, ["examples/probe", "old-probe", "examples/static"])
    assert.ok(result.replaces.has("Draft.md"))
    assert.ok(result.dependencies.includes(path.join(directory, "values.txt")))
    const page = result.content.find(([, f]) => f.data.slug === "examples/probe")![1].data
    assert.match(page.text!, /Evidence <tag> "quotes" & symbols/)
    assert.equal(page.frontmatter!.project, "Research")
    assert.equal(page.relativePath, "Old Probe.md")
    assert.equal(page.dates!.created.toISOString(), "2026-09-28T00:00:00.000Z")
    assert.deepEqual(page.links, ["notes/target"])
    assert.match(page.reactPage!.html, /href="\/garden\/notes\/target#method"/)
    assert.match(page.reactPage!.html, /data-page-props="[^\"]*&quot;/)
    const resource = page.reactPage!.html.match(/data-page-module="([^"]+)"/)![1]
    assert.match(
      await fs.readFile(path.join(output, resource.slice("/garden/".length)), "utf8"),
      /mount/,
    )
    assert.match(
      await fs.readFile(path.join(output, page.reactPage!.css[0].slice("/garden/".length)), "utf8"),
      /var\(--dark\)/,
    )
    const staticPage = result.content.find(([, f]) => f.data.slug === "examples/static")![1].data
    assert.doesNotMatch(staticPage.reactPage!.html, /data-page-(module|props)/)
    assert.equal(staticPage.reactPage!.css.length, 1)
    const md = defaultProcessedContent({
      slug: "examples/probe" as FullSlug,
      relativePath: "Old Probe.md" as FilePath,
    })
    assert.equal(mergeReactPages([md], result).length, 2)
    md[1].data.relativePath = "Unrelated.md" as FilePath
    assert.throws(() => mergeReactPages([md], result), /conflicts with Markdown/)
    md[1].data.slug = "ordinary" as FullSlug
    md[1].data.aliases = ["old-probe"] as FullSlug[]
    assert.throws(() => mergeReactPages([md], result), /conflicts with Markdown/)
    // A real data edit must be visible even when the loader module is cached.
    await fs.writeFile(path.join(directory, "values.txt"), "Updated evidence")
    assert.match((await compileReactPages(ctx)).content[0][1].data.text!, /Updated evidence/)
    await fs.writeFile(
      path.join(directory, "collision.page.tsx"),
      fixture({ ...metadata, slug: "old-probe" }, ""),
    )
    await assert.rejects(compileReactPages(ctx), /route collision/)
  } finally {
    await fs.rm(directory, { recursive: true, force: true })
  }
})
