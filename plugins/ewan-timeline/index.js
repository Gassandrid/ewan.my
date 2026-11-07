import fs from "node:fs/promises"
import { readFileSync } from "node:fs"
import path from "node:path"

// A day-by-day strip of the garden's activity on the homepage. Two kinds of
// event: a note's creation (frontmatter `date`), and an update, which is any
// link to a daily note (`[[MM-DD-YYYY]]`) inside a note: the convention in
// "Note updates as links to daily notes". Daily notes are private, so the links
// themselves lead nowhere on the site; here they become the record of activity.

export const DATA_PATH = "static/note-timeline.json"
const CLIENT = readFileSync(new URL("./client.js", import.meta.url), "utf8")
const CSS = readFileSync(new URL("./style.css", import.meta.url), "utf8")

const DAILY = /^(\d{2})-(\d{2})-(\d{4})$/
const HEADING = /^h[1-6]$/
const BLOCK = new Set(["p", "li", "td", "th", "dt", "dd", "figcaption"])
const SKIP = new Set(["ul", "ol", "svg", "sup", "script", "style"])
const LABEL_LIMIT = 90

function classes(node) {
  const c = node.properties?.className
  return Array.isArray(c) ? c.map(String) : typeof c === "string" ? c.split(/\s+/) : []
}

// The ISO day a daily-note link points at, or null.
export function dailyDate(node) {
  if (node?.type !== "element" || node.tagName !== "a") return null
  const target = String(node.properties?.dataSlug ?? node.properties?.href ?? "")
  const name = decodeURIComponent(target.split(/[?#]/)[0].split("/").pop() ?? "")
  const m = DAILY.exec(name)
  if (!m) return null
  const [, month, day, year] = m
  if (+month < 1 || +month > 12 || +day < 1 || +day > 31) return null
  return `${year}-${month}-${day}`
}

function text(node) {
  if (node.type === "text") return node.value
  if (node.type !== "element" && node.type !== "root") return ""
  if (node.type === "element") {
    if (SKIP.has(node.tagName) || node.properties?.role === "anchor" || dailyDate(node)) return ""
  }
  return (node.children ?? []).map(text).join("")
}

export function clean(value) {
  let s = value
    .replace(/\s+/g, " ")
    .replace(/\(\s*\)|\[\s*\]/g, "")
    .replace(/^[\s:;,.\-–—|]+|[\s:;,\-–—|]+$/g, "")
    .trim()
  if (s.length > LABEL_LIMIT) {
    const cut = s.slice(0, LABEL_LIMIT)
    s = `${cut.slice(0, cut.lastIndexOf(" ") > 40 ? cut.lastIndexOf(" ") : LABEL_LIMIT).trim()}…`
  }
  return s
}

// What the update says: its heading, callout title or block, without the date.
function labelFor(ancestors) {
  for (let i = ancestors.length - 1; i >= 0; i--) {
    const node = ancestors[i]
    if (node.type !== "element") continue
    if (classes(node).includes("callout-title")) {
      const own = clean(text(node))
      if (own) return own
      const callout = ancestors.slice(0, i).findLast((a) => classes(a).includes("callout"))
      const body = callout?.children?.find((c) => classes(c).includes("callout-content"))
      return body ? clean(text(body)) : ""
    }
    if (HEADING.test(node.tagName) || BLOCK.has(node.tagName)) return clean(text(node))
  }
  return ""
}

// One update per daily note a page links, anchored to the nearest heading.
export function extractUpdates(tree) {
  const found = new Map()
  let anchor = ""
  const walk = (node, ancestors) => {
    if (node.type === "element") {
      if (HEADING.test(node.tagName) && node.properties?.id) anchor = String(node.properties.id)
      const date = dailyDate(node)
      if (date) {
        if (!found.has(date)) found.set(date, { date, label: labelFor(ancestors), anchor })
        return
      }
    }
    if (!node.children) return
    ancestors.push(node)
    for (const child of node.children) walk(child, ancestors)
    ancestors.pop()
  }
  walk(tree, [])
  return [...found.values()]
}

export function isoDay(value) {
  if (value instanceof Date) return Number.isNaN(+value) ? null : value.toISOString().slice(0, 10)
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value ?? ""))
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null
}

const listed = (slug) =>
  slug && slug !== "index" && !slug.endsWith("/index") && !slug.startsWith("tags/")

// { notes: [[slug, title]], events: [[day, kind (0 new, 1 update), note, label?, anchor?]] }
export function timelineData(files) {
  const notes = []
  const events = []
  for (const data of files) {
    if (!listed(data?.slug)) continue
    const created = isoDay(data.frontmatter?.date ?? data.frontmatter?.created)
    const updates = (data.noteTimeline ?? []).filter((u) => !created || u.date > created)
    if (!created && updates.length === 0) continue
    const title = String(data.frontmatter?.title ?? data.slug.split("/").pop())
    const note = notes.push([data.slug, title]) - 1
    if (created) events.push([created, 0, note])
    for (const u of updates) events.push([u.date, 1, note, u.label, u.anchor])
  }
  events.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] - b[1]))
  return { notes, events }
}

// On the homepage the strip sits inline, before the closing rule.
export function insertMount(tree) {
  const mount = {
    type: "element",
    tagName: "div",
    properties: { className: ["note-timeline"], dataSrc: `./${DATA_PATH}` },
    children: [],
  }
  const children = tree.children ?? (tree.children = [])
  const rule = children.findLastIndex((c) => c.type === "element" && c.tagName === "hr")
  children.splice(rule === -1 ? children.length : rule, 0, mount)
}

export default function NoteTimeline() {
  return {
    name: "NoteTimeline",
    htmlPlugins() {
      return [
        () => (tree, file) => {
          file.data.noteTimeline = extractUpdates(tree)
          if (file.data.slug === "index") insertMount(tree)
        },
      ]
    },
    externalResources() {
      return {
        css: [{ content: CSS, inline: true }],
        js: [
          { script: CLIENT, loadTime: "afterDOMReady", contentType: "inline", spaPreserve: true },
        ],
      }
    },
    async *emit(ctx, content) {
      const outfile = path.join(ctx.argv.output, DATA_PATH)
      await fs.mkdir(path.dirname(outfile), { recursive: true })
      await fs.writeFile(outfile, JSON.stringify(timelineData(content.map(([, f]) => f.data))))
      yield outfile
    },
  }
}
