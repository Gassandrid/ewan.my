import puppeteer from "puppeteer-core"
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--no-sandbox"],
  defaultViewport: { width: 1200, height: 900 },
})
const URL = "http://localhost:8080/Notes/Programming/marimo-widgets"

const p1 = await browser.newPage()
await p1.goto(URL, { waitUntil: "domcontentloaded" })
await new Promise((r) => setTimeout(r, 1500))
await p1.screenshot({ path: "/tmp/marimo-early.png", fullPage: false })
console.log("early shot")
await p1.close()

const p2 = await browser.newPage()
await p2.goto(URL, { waitUntil: "domcontentloaded" })
await p2.waitForFunction(
  () => document.querySelector("marimo-island[data-reactive='true'][data-status]"),
  { timeout: 180_000, polling: 1000 },
)
await new Promise((r) => setTimeout(r, 4000))
await p2.screenshot({ path: "/tmp/marimo-loaded.png", fullPage: true })
console.log("loaded shot")
await browser.close()
