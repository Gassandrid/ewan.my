import { existsSync, readFileSync } from "node:fs"
import { simplifySlug } from "../ewan-margin/components.js"
import { noteGraph } from "./graph.js"

// Notes close in meaning, from data/note-neighbours.json (written by
// quartz/cli/embed-notes.py). Absent file, absent section: the build never
// needs the model.

const DATA = new URL("../../data/note-neighbours.json", import.meta.url)
const DUPLICATE = 0.985 // a copy of the same note is not a neighbour

let table
function neighbours() {
  if (table === undefined) {
    table = existsSync(DATA) ? JSON.parse(readFileSync(DATA, "utf8")).notes : null
  }
  return table
}

const cache = new WeakMap()

/** Similar notes this one neither links to nor is linked from: [{ slug, title, similarity }]. */
export function similarNotes(allFiles, file, limit = 5) {
  const data = neighbours()
  if (!data || !file.relativePath) return []
  const list = data[file.relativePath]
  if (!list) return []
  let bySource = cache.get(allFiles)
  if (!bySource) {
    bySource = new Map(allFiles.filter((f) => f.relativePath).map((f) => [f.relativePath, f]))
    cache.set(allFiles, bySource)
  }
  const graph = noteGraph(allFiles)
  const here = graph.index.get(simplifySlug(file.slug ?? ""))
  const linked = new Set(here === undefined ? [] : graph.both[here].map((i) => graph.slugs[i]))
  const found = []
  for (const [source, similarity] of list) {
    const other = bySource.get(source)
    if (!other || similarity >= DUPLICATE) continue
    const slug = simplifySlug(other.slug)
    if (slug === simplifySlug(file.slug) || linked.has(slug) || !graph.index.has(slug)) continue
    found.push({ slug, title: other.frontmatter?.title ?? other.slug, similarity })
    if (found.length === limit) break
  }
  return found
}
