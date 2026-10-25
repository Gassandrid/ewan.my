import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"
import { spawnSync } from "node:child_process"
import {
  buildObsidianContext,
  compileObsidianLinks,
  deferLargeOutputs,
  linkIndex,
  prerenderMath,
  stripStaticWidgets,
} from "./ewan-marimo/index.js"

test("Marimo indexes published paths, aliases, nested headings and folder notes", () => {
  const tree = {
    children: [
      { tagName: "h2", properties: { id: "parent" }, children: [{ value: "Parent" }] },
      { tagName: "h3", properties: { id: "details-1" }, children: [{ value: "Details" }] },
    ],
  }
  const ctx = {
    allFiles: [
      "People/Conradi.md",
      "Secret.md",
      "Thoughts/Demo.marimo.py",
      "Attachments/Image.png",
      "Folder/Folder.md",
    ],
  }
  const context = buildObsidianContext(ctx, [
    [
      tree,
      {
        data: {
          relativePath: "People/Conradi.md",
          slug: "people/conradi",
          frontmatter: { aliases: ["Simone"] },
        },
      },
    ],
    [{}, { data: { relativePath: "Folder/Folder.md", slug: "folder/index" } }],
  ])
  assert.equal(buildObsidianContext({ allFiles: ["Secret.md"] }, []).files.length, 0)
  assert.equal(context.files.length, 4)
  assert.equal(
    context.files.some((file) => file.path === "Secret.md"),
    false,
  )
  assert.deepEqual(context.files[0], {
    path: "People/Conradi.md",
    slug: "people/conradi",
    aliases: ["Simone"],
    headings: { Parent: "parent", Details: "details-1", "Parent#Details": "details-1" },
  })
  assert.equal(context.files[1].slug, "thoughts/demo")
  assert.equal(context.files[2].slug, "attachments/image.png")
  assert.equal(context.files[3].slug, "folder/index")
})

test("Marimo link index is shared, compact and versioned by content", () => {
  const context = {
    files: [
      { path: "A.md", slug: "a", aliases: [], headings: {} },
      { path: "B.md", slug: "b", aliases: ["Bee"], headings: { H: "h" } },
    ],
  }
  const index = linkIndex(context, "/sub/")
  assert.equal(index.path, "/sub/static/marimo-links.json")
  assert.match(index.version, /^[0-9a-f]{12}$/)
  assert.deepEqual(JSON.parse(index.json).files, [
    { path: "A.md", slug: "a" },
    { path: "B.md", slug: "b", aliases: ["Bee"], headings: { H: "h" } },
  ])
  assert.equal(linkIndex(context).version, index.version)
  context.files[0].headings = { New: "new" }
  assert.notEqual(linkIndex(context).version, index.version)
})

test("Notebook wikilinks written as name.marimo add graph edges", () => {
  const slugs = [
    "notes/models/continuous_models",
    "notes/models/lotka_volterra",
    "notes/models/stability",
  ]
  const { links } = compileObsidianLinks(
    "See [[continuous_models.marimo|Continuous]] and [[lotka_volterra.marimo.py]].",
    "notes/models/stability",
    slugs,
  )
  assert.deepEqual(links, ["notes/models/continuous_models", "notes/models/lotka_volterra"])
})

test("Build-time math is typeset before the islands runtime defines marimo-tex", () => {
  const inline = '<marimo-tex class="arithmatex">||(u_i&lt;p||)</marimo-tex>'
  const html = prerenderMath(`Draw ${inline} and <marimo-tex>||[x^2||]</marimo-tex>`)
  assert.match(html, /<span class="marimo-tex-static"><span class="katex">/)
  assert.match(html, /katex-display/)
  assert.match(html, /<annotation encoding="application\/x-tex">u_i&lt;p<\/annotation>/)
  assert.ok(html.includes(inline), "the live element is kept for the runtime")
  assert.equal(prerenderMath("<marimo-tex>plain</marimo-tex>"), "<marimo-tex>plain</marimo-tex>")
})

test("Large build-time outputs move to their own files; small ones stay inline", () => {
  const island = (output) =>
    `<marimo-island data-app-id="main" data-cell-id="a" data-reactive="true">\n  <marimo-cell-output>${output}</marimo-cell-output>\n  <marimo-cell-code hidden>x</marimo-cell-code></marimo-island>`
  const big = `<marimo-plotly data-figure='${"1".repeat(60 * 1024)}'></marimo-plotly>`
  const files = new Map()
  const html = deferLargeOutputs(island("<p>small</p>") + island(big), "/", files)
  assert.ok(html.includes("<p>small</p>"))
  assert.ok(!html.includes("marimo-plotly"))
  assert.equal(files.size, 1)
  const [name, content] = [...files][0]
  assert.equal(content, big)
  assert.match(html, new RegExp(`data-ewan-output="/static/marimo-outputs/${name}"`))
  assert.match(html, /<marimo-cell-output><\/marimo-cell-output>/)
})

test("Build-time anywidgets are dropped; other controls stay", () => {
  const widget =
    '<marimo-ui-element object-id="a-0"><marimo-anywidget data-initial-value=\'{"model_id":"x"}\'></marimo-anywidget></marimo-ui-element>'
  const slider =
    '<marimo-ui-element object-id="b-0"><marimo-slider></marimo-slider></marimo-ui-element>'
  assert.equal(stripStaticWidgets(`<p>a</p>${widget}${slider}`), `<p>a</p>${slider}`)
})

test("Obsidian syntax uses native marimo Markdown and preserves interpolation", () => {
  const python =
    process.env.MARIMO_PYTHON ??
    (fs.existsSync(".venv-marimo/bin/python") ? ".venv-marimo/bin/python" : "python3")
  const result = spawnSync(python, ["plugins/ewan-marimo/obsidian.test.py"], {
    encoding: "utf8",
    timeout: 30000,
  })
  assert.equal(result.status, 0, result.stdout + result.stderr)
})

test("Browser packages load before notebook cells without replacing Pyodide libraries", () => {
  const python =
    process.env.MARIMO_PYTHON ??
    (fs.existsSync(".venv-marimo/bin/python") ? ".venv-marimo/bin/python" : "python3")
  const result = spawnSync(python, ["plugins/ewan-marimo/dependencies.test.py"], {
    encoding: "utf8",
    timeout: 30000,
  })
  assert.equal(result.status, 0, result.stdout + result.stderr)
})
