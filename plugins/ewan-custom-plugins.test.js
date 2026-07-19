import assert from "node:assert/strict"
import test from "node:test"
import EwanCharts from "./ewan-charts/index.js"
import EwanFonts, { LORA_STYLESHEET } from "./ewan-fonts/index.js"
import GaggiMatePage from "./ewan-gaggimate-page/index.js"
import { patchGraphRuntime } from "./ewan-graph/components.js"
import { LorenzBackground } from "./ewan-lorenz/components.js"
import MarimoResources from "./ewan-marimo-resources/index.js"
import MorrisLecarPage from "./ewan-morris-lecar-page/index.js"
import EwanMorrisLecar from "./ewan-morris-lecar/index.js"
import EwanRunPython from "./ewan-run-python/index.js"
import { Telemetry } from "./ewan-telemetry/components.js"
import { QuartzTOC } from "./ewan-quartz-toc/components.js"
import EwanSvgEmbeds, { buildSvgIndex, resolveSvgObjects } from "./ewan-svg-embeds/index.js"

function transformCode(plugin, node) {
  const tree = { type: "root", children: [node] }
  plugin.markdownPlugins()[0]()(tree)
  return tree.children[0]
}
test("RunPython emits escaped runnable blocks and lazy runtimes", () => {
  const p = EwanRunPython({ languages: ["python-r"] })
  const r = transformCode(p, { type: "code", lang: "python-r", value: 'print("<safe>")' })
  assert.match(r.value, /data-python-run=/)
  assert.match(r.value, /&lt;safe&gt;/)
  const s = p.externalResources().js[0].script
  assert.match(s, /loadPyodideRuntime/)
  assert.match(s, /loadEditorRuntime/)
  assert.equal(p.externalResources().js[0].src, undefined)
})
test("charts and CalPlot share demand-loaded D3", () => {
  const p = EwanCharts()
  const r = transformCode(p, { type: "code", lang: "chart", value: "source: /x.json\nx: t\ny: v" })
  assert.match(r.value, /data-chart-config=/)
  const s = p.externalResources().js[0].script
  assert.match(s, /\[data-calplot\]/)
  assert.match(s, /d3@7/)
  assert.match(s, /containers\.length === 0 && calendars\.length === 0/)
})
test("Marimo assets are pinned and conditional", () => {
  const s = MarimoResources().externalResources().js[0].script
  assert.match(s, /querySelectorAll\("marimo-island"\)/)
  assert.match(s, /nextSlug !== lastSlug/)
  assert.doesNotMatch(s, /navigated = true/)
  assert.match(s, /islands@0\.23\.9/)
  assert.doesNotMatch(s, /fonts\.googleapis/)
})
test("custom pages expose canonical slugs and frames", () => {
  const g = GaggiMatePage(),
    m = MorrisLecarPage()
  assert.equal(g.generate()[0].slug, "pages/gaggimate-extractions")
  assert.equal(g.layout, "content")
  assert.equal(m.generate()[0].slug, "pages/morris-lecar")
  assert.equal(m.frame, "full-width")
})
test("expensive runtimes are guarded", () => {
  assert.match(EwanMorrisLecar().externalResources().js[0].script, /phase-canvas/)
  const l = LorenzBackground()
  assert.match(l.afterDOMLoaded, /prefers-reduced-motion/)
  assert.match(l.afterDOMLoaded, /deviceMemory/)
  assert.match(l.afterDOMLoaded, /hardwareConcurrency/)
  assert.match(Telemetry().afterDOMLoaded, /data-ewan-telemetry/)
})

test("v4 typography and proportional TOC remain available", () => {
  assert.equal(EwanFonts().externalResources().css[0].content, LORA_STYLESHEET)
  assert.match(LORA_STYLESHEET, /Lora:ital,wght/)
  const toc = QuartzTOC()
  assert.match(toc.css, /quartztoc-rail-thumb/)
  assert.match(toc.afterDOMLoaded, /--toc-top/)
})

test("Obsidian SVG embeds resolve unique attachment basenames", () => {
  const index = buildSvgIndex([
    "attachments/florilegium-banner.svg",
    "attachments/other.svg",
    "duplicates/other.svg",
  ])
  assert.equal(index.get("florilegium-banner.svg"), "attachments/florilegium-banner.svg")
  assert.equal(index.has("other.svg"), false)
  assert.equal(
    resolveSvgObjects(
      '<object data="florilegium-banner.svg" type="image/svg+xml"></object>',
      "index",
      index,
    ),
    '<object data="./attachments/florilegium-banner.svg" type="image/svg+xml"></object>',
  )
  assert.equal(EwanSvgEmbeds().name, "EwanSvgEmbeds")
})

test("graph compatibility patch excludes .base nodes", () => {
  const original = "before for(var Ju in Ku)eu.set(Fu(Ju),Ku[Ju]) after"
  const patched = patchGraphRuntime(original)
  assert.match(patched, /\\\.base/)
  assert.match(patched, /continue/)
  assert.throws(() => patchGraphRuntime("changed upstream"), /runtime changed/)
})
