import { equipNetwork } from "./network.js"

// Builds the neural field from the vault itself: notes are neurons, wikilinks
// are synapses, tag families are cortical areas. The result is shaped like
// createNetwork's output so stepNetwork drives it unchanged. Inlined beside
// network.js; `create` supplies the seeded parameter defaults.
export function createVaultNetwork(
  create,
  index,
  { count = 112, seed = 271828, parameters, aspect = 1.6 } = {},
) {
  const size = Math.max(32, Math.min(160, Math.round(Number(count) || 112)))
  const template = create({ count: 32, seed, parameters })
  let randomState = (template.seed ^ 0x9e3779b9) >>> 0
  function random() {
    randomState = (Math.imul(1664525, randomState) + 1013904223) >>> 0
    return randomState / 4294967296
  }
  // Garden-maturity and housekeeping tags say nothing about subject matter.
  const generic =
    /^(university|seed|sapling|tree|generated|todo|junk|working|resource|curation|website|data)(\/|$)/
  const merge = {
    neuroscience: "comp-neuro",
    "brain-region": "comp-neuro",
    ocd: "psych",
    transhumanism: "pharmacology",
    health: "pharmacology",
    physics: "math",
    astronomy: "math",
    engineering: "cs",
    software: "cs",
    art: "hobbies",
    music: "hobbies",
  }
  const notes = Object.values(index || {}).filter(
    (note) =>
      note &&
      typeof note.slug === "string" &&
      note.slug !== "index" &&
      !note.slug.startsWith("tags/") &&
      !note.slug.endsWith("/index") &&
      !note.slug.endsWith(".base"),
  )
  const bySlug = new Map(notes.map((note) => [note.slug, note]))
  const byBase = new Map()
  for (const note of notes) {
    const base = note.slug.split("/").pop()
    byBase.set(base, byBase.has(base) ? null : note.slug)
  }
  // Wikilinks arrive as shortest paths; resolve them by unique basename.
  const resolve = (link) =>
    bySlug.has(link) ? link : byBase.get(String(link).split("/").pop().split("#")[0]) || null
  const adjacency = new Map(notes.map((note) => [note.slug, new Set()]))
  for (const note of notes)
    for (const link of note.links || []) {
      const target = resolve(link)
      if (!target || target === note.slug) continue
      adjacency.get(note.slug).add(target)
      adjacency.get(target).add(note.slug)
    }
  const empty = { fallback: true }
  if (notes.length < 32) return empty

  // Importance is degree; the strongest hubs are always present and the seed
  // samples the rest by weight, so every network still reads as this vault.
  const ranked = notes
    .filter((note) => adjacency.get(note.slug).size)
    .sort(
      (a, b) =>
        adjacency.get(b.slug).size - adjacency.get(a.slug).size || (a.slug < b.slug ? -1 : 1),
    )
  if (ranked.length < 32) return empty
  const chosen = new Set(ranked.slice(0, Math.round(size * 0.55)).map((note) => note.slug))
  const pool = ranked.slice(chosen.size).map((note) => ({
    slug: note.slug,
    key: Math.pow(random(), 1 / Math.sqrt(adjacency.get(note.slug).size)),
  }))
  pool.sort((a, b) => b.key - a.key)
  // Prefer candidates that already touch the selection so few neurons float.
  for (const pass of [true, false])
    for (const { slug } of pool) {
      if (chosen.size >= Math.min(size, ranked.length)) break
      if (chosen.has(slug)) continue
      if (pass && ![...adjacency.get(slug)].some((other) => chosen.has(other))) continue
      chosen.add(slug)
    }
  const slugs = [...chosen]
  const position = new Map(slugs.map((slug, i) => [slug, i]))
  const links = slugs.map((slug) =>
    [...adjacency.get(slug)]
      .filter((other) => position.has(other))
      .map((other) => position.get(other)),
  )

  // Areas: a note's tag family, preferring families common across the vault;
  // untagged notes take their folder's usual family, then their links' (label
  // propagation). A family too large for one margin splits by its subtags.
  const subject = (note) =>
    (note.tags || [])
      .filter((tag) => !generic.test(tag))
      .map((tag) => {
        const parts = tag.split("/")
        parts[0] = merge[parts[0]] || parts[0]
        return parts
      })
  const weight = {}
  for (const note of notes)
    for (const parts of subject(note)) weight[parts[0]] = (weight[parts[0]] || 0) + 1
  const primary = (note) =>
    subject(note).sort((a, b) => weight[b[0]] - weight[a[0]] || b.length - a.length)[0] || null
  const folder = (slug) =>
    slug
      .split("/")
      .slice(0, slug.startsWith("notes/") ? 2 : 1)
      .join("/")
  const folderVotes = {}
  for (const note of notes) {
    const parts = primary(note)
    if (!parts || !note.slug.includes("/")) continue
    const votes = (folderVotes[folder(note.slug)] ||= {})
    votes[parts[0]] = (votes[parts[0]] || 0) + 1
  }
  const paths = slugs.map((slug) => {
    const parts = primary(bySlug.get(slug))
    if (parts) return parts
    const votes = slug.includes("/") ? folderVotes[folder(slug)] : null
    const best =
      votes && Object.keys(votes).sort((a, b) => votes[b] - votes[a] || (a < b ? -1 : 1))[0]
    return best ? [best] : null
  })
  const rootSizes = {}
  paths.forEach((parts) => parts && (rootSizes[parts[0]] = (rootSizes[parts[0]] || 0) + 1))
  const family = paths.map((parts) =>
    !parts
      ? null
      : rootSizes[parts[0]] > slugs.length * 0.36 && parts[1]
        ? parts[0] + "/" + parts[1]
        : parts[0],
  )
  for (let round = 0; round < 6; round++)
    family.forEach((value, i) => {
      if (value) return
      const votes = {}
      for (const j of links[i]) if (family[j]) votes[family[j]] = (votes[family[j]] || 0) + 1
      const best = Object.keys(votes).sort((a, b) => votes[b] - votes[a] || (a < b ? -1 : 1))[0]
      if (best) family[i] = best
    })
  // Small areas fold into the area they link to most; at most nine remain.
  for (;;) {
    const sizes = {}
    family.forEach((value) => value && (sizes[value] = (sizes[value] || 0) + 1))
    const names = Object.keys(sizes).sort((a, b) => sizes[a] - sizes[b])
    const weakest = names[0]
    if (!weakest || (sizes[weakest] >= Math.max(4, size * 0.04) && names.length <= 9)) break
    const votes = {}
    family.forEach((value, i) => {
      if (value !== weakest) return
      for (const j of links[i])
        if (family[j] && family[j] !== weakest) votes[family[j]] = (votes[family[j]] || 0) + 1
    })
    const target =
      Object.keys(votes).sort((a, b) => votes[b] - votes[a])[0] || names[names.length - 1]
    if (target === weakest) break
    family.forEach((value, i) => value === weakest && (family[i] = target))
  }
  const largest = (() => {
    const sizes = {}
    family.forEach((value) => value && (sizes[value] = (sizes[value] || 0) + 1))
    return Object.keys(sizes).sort((a, b) => sizes[b] - sizes[a])[0] || "notes"
  })()
  family.forEach((value, i) => !value && (family[i] = largest))
  const areaNames = [...new Set(family)].sort()
  const area = family.map((name) => areaNames.indexOf(name))
  const A = areaNames.length
  const between = Array.from({ length: A }, () => new Float64Array(A))
  const areaSize = new Float64Array(A)
  area.forEach((a, i) => {
    areaSize[a]++
    for (const j of links[i]) between[a][area[j]]++
  })

  // Hemispheres: the exact bipartition of areas that cuts the fewest links
  // while balancing the margins. Cut links become callosal fibres under the text.
  let bestMask = 1,
    bestCost = Infinity
  for (let mask = 1; mask < (1 << A) - 1; mask++) {
    let cut = 0,
      left = 0
    for (let a = 0; a < A; a++) {
      if (mask & (1 << a)) left += areaSize[a]
      for (let b = a + 1; b < A; b++)
        if (((mask >> a) & 1) !== ((mask >> b) & 1)) cut += between[a][b]
    }
    const cost =
      cut + Math.pow((left - slugs.length / 2) / (slugs.length * 0.08), 2) * 6 + random() * 0.5
    if (cost < bestCost) [bestCost, bestMask] = [cost, mask]
  }
  if (A === 1) bestMask = 0
  const sideOf = (a) => (A === 1 || bestMask & (1 << a) ? 0 : 1)
  // Areas stack down each margin in the order with the shortest total wiring;
  // the right margin also lines up with its callosal partners on the left.
  const height = new Float64Array(A)
  function arrange(members, partner) {
    let best = members,
      bestCost = Infinity
    const permute = (prefix, rest) => {
      if (!rest.length) {
        let cost = 0,
          y = 0
        const mid = {}
        const total = prefix.reduce((sum, a) => sum + areaSize[a], 0)
        for (const a of prefix) {
          mid[a] = (y + areaSize[a] / 2) / total
          y += areaSize[a]
        }
        for (let i = 0; i < prefix.length; i++) {
          for (let j = i + 1; j < prefix.length; j++)
            cost += between[prefix[i]][prefix[j]] * Math.abs(mid[prefix[i]] - mid[prefix[j]])
          if (partner)
            for (let b = 0; b < A; b++)
              if (partner[b] >= 0)
                cost += between[prefix[i]][b] * Math.abs(mid[prefix[i]] - partner[b])
        }
        if (cost < bestCost) [bestCost, best] = [cost, prefix]
        return
      }
      rest.forEach((a, i) => permute([...prefix, a], [...rest.slice(0, i), ...rest.slice(i + 1)]))
    }
    permute([], members.slice(0, 7))
    best = [...best, ...members.slice(7)]
    const total = best.reduce((sum, a) => sum + areaSize[a], 0)
    let y = 0
    const band = {}
    for (const a of best) {
      band[a] = [y / total, (y + areaSize[a]) / total]
      height[a] = (y + areaSize[a] / 2) / total
      y += areaSize[a]
    }
    return band
  }
  const leftAreas = [],
    rightAreas = []
  for (let a = 0; a < A; a++) (sideOf(a) === 1 ? rightAreas : leftAreas).push(a)
  const bands = arrange(leftAreas)
  if (rightAreas.length) {
    const partner = Array.from({ length: A }, (_, a) => (sideOf(a) === 0 ? height[a] : -1))
    Object.assign(bands, arrange(rightAreas, partner))
  }

  // Notes with links into both hemispheres may drift under the text column,
  // a sparse commissure. Everyone else keeps to their margin.
  const side = area.map((a, i) => (A === 1 ? i % 2 : sideOf(a)))
  const bridge = slugs.map((_, i) => {
    let mine = 0,
      other = 0
    for (const j of links[i]) side[j] === side[i] ? mine++ : other++
    return other >= 2 && other / (mine + other) >= 0.34 ? other / (mine + other) : 0
  })
  const bridges = new Set(
    bridge
      .map((score, i) => [score, i])
      .filter(([score]) => score)
      .sort((a, b) => b[0] - a[0])
      .slice(0, Math.round(slugs.length * 0.06))
      .map(([, i]) => i),
  )

  // Constrained force layout in page units (x spans `aspect`, y spans 1).
  const W = Math.max(1, Math.min(2.6, aspect))
  const gutter = [0.018 * W, 0.3 * W]
  const xs = new Float64Array(slugs.length),
    ys = new Float64Array(slugs.length)
  const lane = (i) => {
    if (bridges.has(i)) return [0.36 * W, 0.64 * W]
    return side[i] === 1 ? [W - gutter[1], W - gutter[0]] : gutter
  }
  slugs.forEach((_, i) => {
    const [lo, hi] = lane(i)
    const [top, bottom] = bands[area[i]]
    xs[i] = lo + random() * (hi - lo)
    ys[i] = 0.03 + (top + random() * (bottom - top)) * 0.94
  })
  const spacing = Math.sqrt(((gutter[1] - gutter[0]) * 0.94 * 2) / slugs.length)
  for (let step = 0, steps = 240; step < steps; step++) {
    const heat = 1 - step / steps
    const fx = new Float64Array(slugs.length),
      fy = new Float64Array(slugs.length)
    for (let i = 0; i < slugs.length; i++)
      for (let j = i + 1; j < slugs.length; j++) {
        const dx = xs[i] - xs[j],
          dy = ys[i] - ys[j]
        const d2 = dx * dx + dy * dy + 1e-6
        if (d2 > spacing * spacing * 9) continue
        const push = (spacing * spacing) / d2 - 0.11
        if (push <= 0) continue
        const d = Math.sqrt(d2)
        fx[i] += (dx / d) * push * spacing * 0.08
        fy[i] += (dy / d) * push * spacing * 0.08
        fx[j] -= (dx / d) * push * spacing * 0.08
        fy[j] -= (dy / d) * push * spacing * 0.08
      }
    for (let i = 0; i < slugs.length; i++)
      for (const j of links[i]) {
        if (j < i || (side[i] !== side[j] && !bridges.has(i) && !bridges.has(j))) continue
        const dx = xs[j] - xs[i],
          dy = ys[j] - ys[i]
        const d = Math.hypot(dx, dy) + 1e-6
        const pull = Math.min(0.03, (d - spacing * 1.4) * 0.035)
        if (pull <= 0) continue
        fx[i] += (dx / d) * pull
        fy[i] += (dy / d) * pull
        fx[j] -= (dx / d) * pull
        fy[j] -= (dy / d) * pull
      }
    for (let i = 0; i < slugs.length; i++) {
      const [top, bottom] = bands[area[i]]
      const y0 = 0.03 + top * 0.94,
        y1 = 0.03 + bottom * 0.94
      if (ys[i] < y0) fy[i] += (y0 - ys[i]) * 0.12
      if (ys[i] > y1) fy[i] -= (ys[i] - y1) * 0.12
      // Soft walls: clamping alone would stack neurons along the text edge.
      const [lo, hi] = lane(i)
      const margin = spacing * 1.2
      if (xs[i] - lo < margin) fx[i] += (margin - (xs[i] - lo)) * 0.1
      if (hi - xs[i] < margin) fx[i] -= (margin - (hi - xs[i])) * 0.1
      if (ys[i] - 0.025 < margin) fy[i] += (margin - (ys[i] - 0.025)) * 0.1
      if (0.975 - ys[i] < margin) fy[i] -= (margin - (0.975 - ys[i])) * 0.1
      xs[i] += Math.max(-0.02, Math.min(0.02, fx[i])) * (0.4 + heat)
      ys[i] += Math.max(-0.02, Math.min(0.02, fy[i])) * (0.4 + heat)
      xs[i] = Math.max(lo, Math.min(hi, xs[i]))
      ys[i] = Math.max(0.025, Math.min(0.975, ys[i]))
    }
  }

  // Inhibitory interneurons are local in cortex, so the notes whose links stay
  // most inside their own area become inhibitory; projecting notes excite.
  const locality = slugs.map((_, i) => {
    const local = links[i].filter((j) => area[j] === area[i]).length
    return local / links[i].length + random() * 0.05
  })
  const inhibitory = new Set(
    locality
      .map((value, i) => [value, i])
      .filter(([, i]) => links[i].length >= 2 && !bridges.has(i))
      .sort((a, b) => b[0] - a[0])
      .slice(0, Math.round(slugs.length * 0.2))
      .map(([, i]) => i),
  )
  const modules = areaNames.map((name, a) => ({
    name,
    side: sideOf(a),
    layer: 0,
    parent: -1,
    // Neighbouring areas share nearby phases: rhythms travel down each margin.
    phase: height[a] * Math.PI * 1.4 + (sideOf(a) === 1 ? 0.6 : 0) + random() * 0.4,
    frequencyRatio: 0.8 + random() * 0.4,
    noise: 0,
    noiseTau: 0.65 + random() * 1.25,
  }))
  const maxDegree = Math.max(...links.map((list) => list.length))
  const nodes = slugs.map((slug, i) => {
    const note = bySlug.get(slug)
    const tags = (note.tags || []).filter((tag) => !generic.test(tag))
    const isInhibitory = inhibitory.has(i)
    return {
      x: xs[i] / W,
      y: ys[i],
      group: area[i],
      side: side[i],
      layer: 0,
      inhibitory: isInhibitory,
      slug,
      title: String(note.title || slug.split("/").pop()),
      tag: tags.sort((a, b) => b.split("/").length - a.split("/").length)[0] || areaNames[area[i]],
      degree: links[i].length,
      hub: Math.log(1 + links[i].length) / Math.log(1 + maxDegree),
      bridge: bridges.has(i),
      voltage: random() * 0.72,
      refractory: 0,
      refractoryPeriod: 0.26 + random() * 0.14,
      tau: (isInhibitory ? 0.63 : 0.72) + random() * 0.24,
      glow: 0,
      phase: random() * Math.PI * 2,
      // Well-linked notes sit a little closer to threshold.
      bias:
        0.58 + random() * 0.52 + (Math.log(1 + links[i].length) / Math.log(1 + maxDegree)) * 0.2,
      adaptation: 0,
      adaptationTau: 1.35 + random() * 2.15,
      adaptationGain: 0.36 + random() * 0.3,
      noise: 0,
      lastSpike: -100,
      outgoing: [],
    }
  })

  // Synapses: every wikilink inside the selection, strongest first by shared
  // area and proximity, capped in and out so hubs cannot saturate. Isolated
  // notes reach their nearest area-mates, as local dendritic contacts.
  const distance = (i, j) => Math.hypot((nodes[i].x - nodes[j].x) * W, nodes[i].y - nodes[j].y)
  const incoming = new Uint8Array(nodes.length)
  const edges = []
  const order = nodes.map((_, i) => i).sort((a, b) => links[a].length - links[b].length)
  for (const i of order) {
    const candidates = links[i]
      .map((j) => ({
        j,
        score: distance(i, j) * (area[i] === area[j] ? 1 : 1.6) * (0.85 + random() * 0.3),
      }))
      .sort((a, b) => a.score - b.score)
    if (candidates.length < 3) {
      const near = nodes
        .map((_, j) => ({ j, score: distance(i, j) * (area[i] === area[j] ? 1 : 3) }))
        .filter(({ j }) => j !== i && !links[i].includes(j))
        .sort((a, b) => a.score - b.score)
      candidates.push(...near.slice(0, 3 - candidates.length))
    }
    for (const { j } of candidates) {
      if (nodes[i].outgoing.length >= 7) break
      if (incoming[j] >= 9) continue
      incoming[j]++
      nodes[i].outgoing.push(edges.length)
      const d = distance(i, j)
      edges.push({
        from: i,
        to: j,
        weight: (nodes[i].inhibitory ? -0.66 : 0.31) * (0.72 + random() * 0.56),
        // Same capacity invariant as createNetwork: delay <= .7, refractory >= .26.
        delay: Math.min(0.7, 0.16 + d * 0.32 + random() * 0.08),
        bend: (random() - 0.5) * (side[i] === side[j] ? 0.4 : 0.18),
        callosal: side[i] !== side[j],
        packets: new Float32Array(4),
      })
    }
  }
  equipNetwork(nodes, edges, modules, random)
  return {
    seed: template.seed,
    layout: "vault",
    parameters: template.parameters,
    nodes,
    edges,
    modules,
    aspect: W,
    randomState: template.randomState,
    time: 0,
    phase: 0,
    spikes: 0,
    pending: 0,
    dropped: 0,
  }
}
