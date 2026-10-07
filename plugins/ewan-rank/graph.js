import { simplifySlug, noteMetrics } from "../ewan-margin/components.js"

// Graph measures over the same notes PageRank counts (listed, written pages,
// no listings or tags), computed once per build and shared by the /rank page
// and the per-note neighbourhood.

function isNote(file) {
  const slug = file.slug ?? ""
  return (
    file.unlisted !== true &&
    slug !== "" &&
    slug !== "rank" &&
    !slug.endsWith(".base") &&
    !slug.startsWith("tags/")
  )
}

const cache = new WeakMap()

/** Indexed graph: titles, directed out/in lists (no self or duplicate edges), undirected adjacency. */
export function noteGraph(allFiles) {
  const cached = cache.get(allFiles)
  if (cached) return cached
  const notes = allFiles.filter(isNote)
  const slugs = []
  const index = new Map()
  for (const f of notes) {
    const slug = simplifySlug(f.slug)
    if (index.has(slug)) continue
    index.set(slug, slugs.length)
    slugs.push(slug)
  }
  const titles = new Array(slugs.length).fill("")
  const out = slugs.map(() => new Set())
  for (const f of notes) {
    const from = index.get(simplifySlug(f.slug))
    titles[from] = f.frontmatter?.title ?? f.slug
    for (const target of f.links ?? []) {
      const to = index.get(target)
      if (to !== undefined && to !== from) out[from].add(to)
    }
  }
  const into = slugs.map(() => new Set())
  out.forEach((targets, from) => targets.forEach((to) => into[to].add(from)))
  const both = slugs.map((_, i) => new Set([...out[i], ...into[i]]))
  const graph = {
    slugs,
    titles,
    index,
    out: out.map((s) => [...s]),
    into: into.map((s) => [...s]),
    both: both.map((s) => [...s]),
  }
  cache.set(allFiles, graph)
  return graph
}

/**
 * Random walk with restart on the undirected graph: the stationary distribution
 * of a walker who, with probability `restart`, jumps back to `seed`. Mass sits
 * on notes that are many short routes away, not just the one link.
 */
export function walkFrom(graph, seed, restart = 0.2, iterations = 60) {
  const n = graph.slugs.length
  let p = new Float64Array(n)
  p[seed] = 1
  for (let it = 0; it < iterations; it += 1) {
    const next = new Float64Array(n)
    next[seed] += restart
    for (let i = 0; i < n; i += 1) {
      if (p[i] === 0) continue
      const around = graph.both[i]
      if (around.length === 0) next[seed] += (1 - restart) * p[i]
      else {
        const share = ((1 - restart) * p[i]) / around.length
        for (const j of around) next[j] += share
      }
    }
    p = next
  }
  return p
}

/** Nearby notes beyond the direct links: [{ slug, title, score, via }], best first. */
export function neighbourhood(allFiles, slug, limit = 6) {
  const graph = noteGraph(allFiles)
  const seed = graph.index.get(simplifySlug(slug))
  if (seed === undefined || graph.both[seed].length === 0) return []
  const p = walkFrom(graph, seed)
  const direct = new Set([seed, ...graph.both[seed]])
  const ranked = []
  for (let i = 0; i < p.length; i += 1) if (!direct.has(i) && p[i] > 1e-6) ranked.push(i)
  ranked.sort((a, b) => p[b] - p[a] || graph.slugs[a].localeCompare(graph.slugs[b]))
  return ranked.slice(0, limit).map((i) => {
    // The direct link that carries the most of this note's mass back to the seed.
    let via = -1
    let best = 0
    for (const j of graph.both[i]) {
      if (!direct.has(j) || j === seed) continue
      const carried = p[j] / graph.both[j].length
      if (carried > best) {
        best = carried
        via = j
      }
    }
    return {
      slug: graph.slugs[i],
      title: graph.titles[i],
      score: p[i],
      via: via >= 0 ? { slug: graph.slugs[via], title: graph.titles[via] } : null,
    }
  })
}

/** Brandes betweenness on the undirected graph, normalised to [0, 1]. */
export function betweenness(graph) {
  const n = graph.slugs.length
  const bc = new Float64Array(n)
  for (let s = 0; s < n; s += 1) {
    const stack = []
    const preds = Array.from({ length: n }, () => [])
    const sigma = new Float64Array(n)
    const dist = new Int32Array(n).fill(-1)
    sigma[s] = 1
    dist[s] = 0
    const queue = [s]
    for (let head = 0; head < queue.length; head += 1) {
      const v = queue[head]
      stack.push(v)
      for (const w of graph.both[v]) {
        if (dist[w] < 0) {
          dist[w] = dist[v] + 1
          queue.push(w)
        }
        if (dist[w] === dist[v] + 1) {
          sigma[w] += sigma[v]
          preds[w].push(v)
        }
      }
    }
    const delta = new Float64Array(n)
    while (stack.length) {
      const w = stack.pop()
      for (const v of preds[w]) delta[v] += (sigma[v] / sigma[w]) * (1 + delta[w])
      if (w !== s) bc[w] += delta[w]
    }
  }
  const scale = n > 2 ? 1 / ((n - 1) * (n - 2)) : 1 // each pair counted twice
  return Array.from(bc, (v) => v * scale)
}

/** Kleinberg's hubs (cite many authorities) and authorities (cited by good hubs). */
export function hits(graph, iterations = 50) {
  const n = graph.slugs.length
  let hub = new Float64Array(n).fill(1)
  let auth = new Float64Array(n).fill(1)
  const normalise = (v) => {
    const norm = Math.hypot(...v) || 1
    return v.map((x) => x / norm)
  }
  for (let it = 0; it < iterations; it += 1) {
    auth = normalise(
      Float64Array.from(graph.into, (sources) => sources.reduce((s, j) => s + hub[j], 0)),
    )
    hub = normalise(
      Float64Array.from(graph.out, (targets) => targets.reduce((s, j) => s + auth[j], 0)),
    )
  }
  return { hub: Array.from(hub), authority: Array.from(auth) }
}

/** Weakly connected components: id per node (0 = the largest) and the sizes. */
export function components(graph) {
  const n = graph.slugs.length
  const raw = new Int32Array(n).fill(-1)
  const sizes = []
  for (let s = 0; s < n; s += 1) {
    if (raw[s] >= 0) continue
    const id = sizes.length
    let size = 0
    const stack = [s]
    raw[s] = id
    while (stack.length) {
      const v = stack.pop()
      size += 1
      for (const w of graph.both[v]) {
        if (raw[w] < 0) {
          raw[w] = id
          stack.push(w)
        }
      }
    }
    sizes.push(size)
  }
  const order = sizes.map((_, i) => i).sort((a, b) => sizes[b] - sizes[a] || a - b)
  const rename = new Map(order.map((old, i) => [old, i]))
  return { id: Array.from(raw, (old) => rename.get(old)), sizes: order.map((old) => sizes[old]) }
}

/** Everything the /rank page shows for each note, in PageRank order. */
export function rankTable(allFiles) {
  const graph = noteGraph(allFiles)
  const metrics = noteMetrics(allFiles)
  const between = betweenness(graph)
  const { hub, authority } = hits(graph)
  const comp = components(graph)
  const rows = graph.slugs.map((slug, i) => ({
    i,
    slug,
    title: graph.titles[i],
    folder: slug.includes("/") ? slug.split("/")[0] : "",
    rank: metrics.position.get(slug) ?? 0,
    score: metrics.score.get(slug) ?? 0,
    in: graph.into[i].length,
    out: graph.out[i].length,
    between: between[i],
    hub: hub[i],
    authority: authority[i],
    component: comp.id[i],
  }))
  rows.sort((a, b) => a.rank - b.rank)
  return { graph, rows, count: metrics.count, components: comp.sizes }
}
