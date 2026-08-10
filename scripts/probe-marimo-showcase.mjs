import assert from "node:assert/strict"
import puppeteer from "puppeteer-core"

const url =
  process.env.MARIMO_SHOWCASE_URL ??
  "http://localhost:8080/notes/programming/marimo-wigglystuff-showcase.html"
const consoleErrors = []
const pageErrors = []
const BENIGN_SVG_ERROR = '<svg> attribute height: Expected length, "auto"'

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--no-sandbox"],
  protocolTimeout: 600_000,
  defaultViewport: { width: 1440, height: 1000, deviceScaleFactor: 1 },
})

try {
  const page = await browser.newPage()
  page.on("console", (message) => {
    const value = message.text()
    if (
      message.type() === "error" &&
      !value.includes(BENIGN_SVG_ERROR) &&
      !consoleErrors.includes(value) &&
      consoleErrors.length < 50
    ) {
      consoleErrors.push(value)
    }
  })
  page.on("pageerror", (error) => pageErrors.push(error.message))

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 })
  // A cold browser must fetch the islands runtime and initialize Pyodide before
  // this first rendered cell exists; keep the initial hydration gate realistic.
  await page.waitForSelector("[data-showcase-hero]", { timeout: 120_000 })
  await page.waitForFunction(
    () => document.querySelector("marimo-slider")?.shadowRoot?.innerHTML?.length > 200,
    { timeout: 300_000, polling: 1000 },
  )
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll("marimo-anywidget")].some(
        (element) =>
          (element.shadowRoot?.innerHTML?.length ?? 0) > 400 &&
          element.getBoundingClientRect().height > 40,
      ),
    { timeout: 300_000, polling: 1000 },
  )

  const state = await page.evaluate(() => {
    const notebook = document.querySelector(".marimo-notebook-page")
    const islands = [...document.querySelectorAll("marimo-island")]
    const anywidgets = [...document.querySelectorAll("marimo-anywidget")]
    const anywidgetDetails = anywidgets.map((element) => ({
      height: Math.round(element.getBoundingClientRect().height),
      initializing: /Initializing/.test(element.shadowRoot?.textContent ?? ""),
      visualNodes: element.shadowRoot?.querySelectorAll("canvas, svg").length ?? 0,
    }))
    const customElements = [...document.querySelectorAll("*")]
      .filter((element) => element.tagName.toLowerCase().startsWith("marimo-"))
      .map((element) => ({
        tag: element.tagName.toLowerCase(),
        width: Math.round(element.getBoundingClientRect().width),
        height: Math.round(element.getBoundingClientRect().height),
        shadowLength: element.shadowRoot?.innerHTML?.length ?? 0,
      }))
    return {
      title: document.querySelector("h1.article-title")?.textContent?.trim(),
      runtime: notebook?.dataset.marimoRuntime,
      compiler: notebook?.dataset.marimoVersion,
      expectedIslands: Number(notebook?.dataset.marimoIslands ?? 0),
      islands: islands.length,
      readyReactiveIslands: islands.filter(
        (island) => island.dataset.reactive === "true" && island.hasAttribute("data-status"),
      ).length,
      errorIslands: islands.filter((island) => island.dataset.status === "error").length,
      renderedCellErrors: islands.filter((island) =>
        /Ancestor raised|RuntimeError|KeyError|Traceback/.test(island.innerText),
      ).length,
      loadingVisible:
        getComputedStyle(document.querySelector(".marimo-loading")).display !== "none",
      trust: window.__MARIMO_EXPORT_CONTEXT__,
      nativeSliderVisible: customElements.some(
        (element) =>
          element.tag === "marimo-slider" &&
          element.width > 100 &&
          element.height > 10 &&
          element.shadowLength > 200,
      ),
      anywidgets: anywidgets.length,
      wigglyVisuals: anywidgetDetails.filter(
        (element) => !element.initializing && element.visualNodes > 0 && element.height > 40,
      ).length,
      visibleAnywidgets: anywidgets.filter(
        (element) =>
          element.getBoundingClientRect().width > 100 &&
          element.getBoundingClientRect().height > 40 &&
          (element.shadowRoot?.innerHTML?.length ?? 0) > 400,
      ).length,
      coverageText: document.querySelector("[data-component-coverage]")?.textContent ?? "",
      runtimeText: document.querySelector("[data-showcase-runtime]")?.textContent ?? "",
      signalChartVisible:
        (document.querySelector("[data-signal-chart]")?.getBoundingClientRect().height ?? 0) > 100,
      unexpectedCapabilities: [...document.querySelectorAll("[data-wiggly-failure]")].map(
        (element) => element.getAttribute("data-wiggly-failure"),
      ),
      bodyText: document.body.innerText,
      bodyHeight: document.body.scrollHeight,
      tags: [...new Set(customElements.map((element) => element.tag))].sort(),
    }
  })

  const fatalMessages = [...consoleErrors, ...pageErrors].filter((message) =>
    /Refusing to load anywidget module from untrusted URL|Traceback|Uncaught|fatal/i.test(message),
  )

  assert.equal(state.title, "The Reactive Garden — Marimo × WigglyStuff")
  assert.equal(state.runtime, "0.23.9")
  assert.equal(state.compiler, "0.23.9")
  assert.equal(state.islands, state.expectedIslands)
  assert.ok(state.islands >= 25, `expected at least 25 islands, found ${state.islands}`)
  assert.ok(state.readyReactiveIslands > 0, "no reactive island reached a status")
  assert.equal(state.errorIslands, 0, "one or more Marimo islands reported an error")
  assert.equal(state.renderedCellErrors, 0, "one or more Marimo cells rendered an exception")
  assert.equal(state.loadingVisible, false, "the notebook loading indicator is still visible")
  assert.equal(state.trust?.trusted, true, "Marimo export trust was not scoped onto the page")
  assert.equal(state.trust?.source, "ewan-quartz-marimo")
  assert.ok(state.nativeSliderVisible, "a native Marimo slider did not render visibly")
  assert.ok(state.anywidgets >= 2, "the page emitted too few AnyWidgets")
  assert.ok(state.visibleAnywidgets >= 1, "no WigglyStuff AnyWidget rendered visibly")
  assert.ok(state.wigglyVisuals >= 1, "no WigglyStuff canvas or SVG finished rendering")
  assert.deepEqual(state.unexpectedCapabilities, [])
  assert.match(state.coverageText, /37\s*Marimo UI constructors/)
  assert.match(state.coverageText, /58\s*WigglyStuff exports/)
  assert.match(state.runtimeText, /WigglyStuff 0\.5\.21/)
  assert.equal(state.signalChartVisible, true, "the reactive signal chart is not visible")
  assert.match(state.bodyText, /Intervention puck/)
  assert.deepEqual(fatalMessages, [])

  await page.screenshot({
    path: "/tmp/ewan-marimo-wigglystuff-showcase.png",
    fullPage: true,
  })
  console.log(
    JSON.stringify(
      {
        ...state,
        bodyText: undefined,
        consoleErrors,
        pageErrors,
        screenshot: "/tmp/ewan-marimo-wigglystuff-showcase.png",
      },
      null,
      2,
    ),
  )
} catch (error) {
  console.error(JSON.stringify({ consoleErrors, pageErrors }, null, 2))
  throw error
} finally {
  await browser.close()
}
