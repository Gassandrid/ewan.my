import fs from "node:fs/promises"
import path from "node:path"
import { parse } from "yaml"

const [slug, title] = process.argv.slice(2)
if (!slug || slug === "--help" || !title) {
  console.log('Usage: npm run page:new -- experiments/my-page "My Page"')
  process.exit(slug === "--help" ? 0 : 1)
}
if (
  !/^[a-z0-9][a-z0-9_-]*(?:\/[a-z0-9][a-z0-9_-]*)*$/.test(slug) ||
  /^(404|index|tags|static)(\/|$)/.test(slug)
) {
  throw new Error("Use a canonical lowercase slug, e.g. experiments/my-page")
}
const cfg = parse(await fs.readFile("quartz.config.yaml", "utf8"))
const directory = cfg.configuration.reactPages?.directory
if (!directory) throw new Error("Configure configuration.reactPages.directory first")
const target = path.resolve(directory, slug + ".page.tsx")
let api = path
  .relative(path.dirname(target), path.resolve("quartz/custom-pages/api"))
  .split(path.sep)
  .join("/")
if (!api.startsWith(".")) api = "./" + api
const meta = {
  slug,
  title,
  description: "Describe the page's question or purpose.",
  date: new Date().toISOString().slice(0, 10),
  tags: [],
  draft: true,
}
const source = `/** @jsxImportSource react */
import { useState } from "react"
import { definePage, Section } from ${JSON.stringify(api)}

export const page = definePage(${JSON.stringify(meta, null, 2)})

export default function Page() {
  const [value, setValue] = useState(0)
  return (
    <Section id="exploration" title="Exploration">
      <p>Replace this with the page's content and interactive components.</p>
      <button type="button" onClick={() => setValue(value + 1)}>Count: {value}</button>
    </Section>
  )
}
`
await fs.mkdir(path.dirname(target), { recursive: true })
await fs.writeFile(target, source, { flag: "wx" })
console.log(`Created ${path.relative(process.cwd(), target)} (draft).`)
