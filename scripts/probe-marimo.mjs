import puppeteer from "puppeteer-core"

const URL =
  process.env.MARIMO_PROBE_URL ?? "http://localhost:8080/notes/programming/marimo-widgets.html"
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--no-sandbox"],
  defaultViewport: { width: 1200, height: 900 },
})
const page = await browser.newPage()
await page.goto(URL, { waitUntil: "domcontentloaded" })

// Wait for slider widget to populate
await page
  .waitForFunction(
    () => document.querySelector("marimo-slider")?.shadowRoot?.innerHTML?.length > 200,
    { timeout: 180_000, polling: 1000 },
  )
  .catch(() => console.error("slider wait timed out"))

await new Promise((r) => setTimeout(r, 4000))

const state = await page.evaluate(() => {
  const article = document.querySelector("article")
  const np = document.querySelector(".marimo-notebook-page")
  const loading = document.querySelector(".marimo-loading")
  const islands = [...document.querySelectorAll("marimo-island")]
  const widgets = [...document.querySelectorAll("[class], marimo-ui-element > *")]
    .filter((el) => {
      const tag = el.tagName.toLowerCase()
      return tag.startsWith("marimo-") && tag !== "marimo-island"
    })
    .map((el) => ({
      tag: el.tagName.toLowerCase(),
      shadowLength: el.shadowRoot?.innerHTML?.length ?? 0,
      rect: {
        w: Math.round(el.getBoundingClientRect().width),
        h: Math.round(el.getBoundingClientRect().height),
      },
    }))
  return {
    url: location.href,
    articleRect: article && {
      w: Math.round(article.getBoundingClientRect().width),
      h: Math.round(article.getBoundingClientRect().height),
    },
    npRect: np && {
      w: Math.round(np.getBoundingClientRect().width),
      h: Math.round(np.getBoundingClientRect().height),
    },
    loadingExists: !!loading,
    loadingDisplay: loading ? getComputedStyle(loading).display : null,
    marimoVersion: np?.getAttribute("data-marimo-version"),
    runtimeVersion: np?.getAttribute("data-marimo-runtime"),
    expectedIslands: np?.getAttribute("data-marimo-islands"),
    expectedReactiveIslands: np?.getAttribute("data-marimo-reactive-islands"),
    islandCount: islands.length,
    islandHeights: islands.map((i) => Math.round(i.getBoundingClientRect().height)),
    islandStatuses: islands.map((i) => i.getAttribute("data-status")),
    islandReactives: islands.map((i) => i.getAttribute("data-reactive")),
    widgets,
    bodyHeight: document.body.scrollHeight,
    // Has any data-status been set on a reactive cell?
    anyReactiveHasStatus: !!document.querySelector(
      "marimo-island[data-reactive='true'][data-status]",
    ),
  }
})
console.log(JSON.stringify(state, null, 2))

if (!state.anyReactiveHasStatus) throw new Error("no reactive marimo island reached data-status")
if (!state.widgets.some((w) => w.tag === "marimo-slider" && w.shadowLength > 200)) {
  throw new Error("marimo slider did not hydrate")
}
if (!state.widgets.some((w) => w.rect.w > 100 && w.rect.h > 10)) {
  throw new Error("no marimo widget has a visible box")
}

// Force a screenshot using actual full page height
await page.setViewport({ width: 1200, height: state.bodyHeight || 1500 })
await page.screenshot({ path: "/tmp/marimo-full.png", fullPage: false })
console.log("screenshot saved")
await browser.close()
