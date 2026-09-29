import path from "node:path"
import fs from "node:fs/promises"
import { createHash } from "node:crypto"
import { pathToFileURL } from "node:url"
import { build } from "esbuild"
import { globby } from "globby"
import { fromHtml } from "hast-util-from-html"
import type { Root, RootContent } from "hast"
import { VFile } from "vfile"
import type { ProcessedContent } from "../plugins/vfile"
import type { BuildCtx } from "../util/ctx"
import type { FilePath, FullSlug, SimpleSlug } from "../util/path"
import { type PageDefinition, type PageDataContext } from "./api"

export interface ReactPageData {
  html: string
  css: string[]
  frame: "default" | "full-width"
  source: string
}
declare module "vfile" {
  interface DataMap {
    reactPage?: ReactPageData
  }
}
export interface Compilation {
  content: ProcessedContent[]
  slugs: FullSlug[]
  replaces: Set<string>
  dependencies: string[]
}
const digest = (value: string) => createHash("sha256").update(value).digest("hex").slice(0, 12)
const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
const slugPattern = /^[a-z0-9][a-z0-9._-]*(?:\/[a-z0-9][a-z0-9._-]*)*$/
const reservedRoute = (slug: string) => /^(?:404|index|tags|static)(?:\/|$)/.test(slug)
export function validatePage(input: unknown, source: string): PageDefinition {
  const fail = (message: string): never => {
    throw new Error(`${source}: ${message}`)
  }
  if (!input || typeof input !== "object")
    return fail("export const page = definePage({...}) is required")
  const p = input as PageDefinition
  for (const key of ["slug", "title", "description", "date"] as const)
    if (typeof p[key] !== "string" || !p[key].trim()) fail(`${key} must be a nonempty string`)
  if (
    !slugPattern.test(p.slug) ||
    p.slug.split("/").some((s) => s === "." || s === "..") ||
    /\.(html|md|tsx)$/.test(p.slug)
  )
    fail("slug must be a canonical lowercase path without extension")
  if (reservedRoute(p.slug)) fail("slug is reserved by Quartz")
  for (const key of ["tags", "aliases", "cssclasses", "replaces"] as const)
    if (
      p[key] !== undefined &&
      (!Array.isArray(p[key]) || p[key]!.some((v) => typeof v !== "string" || !v.trim()))
    )
      fail(`${key} must be an array of strings`)
  for (const alias of p.aliases ?? [])
    if (
      !slugPattern.test(alias) ||
      /\.(html|md|tsx)$/.test(alias) ||
      alias === p.slug ||
      reservedRoute(alias)
    )
      fail(`invalid alias: ${alias}`)
  for (const key of ["date", "updated"] as const)
    if (
      p[key] &&
      (!/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(p[key]!) || !Number.isFinite(Date.parse(p[key]!)))
    )
      fail(`${key} must be an ISO date`)
  for (const key of ["draft", "unlisted", "hydrate"] as const)
    if (p[key] !== undefined && typeof p[key] !== "boolean") fail(`${key} must be boolean`)
  if (p.frame && !["default", "full-width"].includes(p.frame))
    fail("frame must be default or full-width")
  for (const replaced of p.replaces ?? [])
    if (
      path.isAbsolute(replaced) ||
      replaced.split("/").includes("..") ||
      !replaced.endsWith(".md")
    )
      fail(`invalid replacement path: ${replaced}`)
  if (p.properties && (typeof p.properties !== "object" || Array.isArray(p.properties)))
    fail("properties must be a JSON object")
  jsonData(p, source)
  return {
    ...p,
    tags: p.tags ?? [],
    aliases: p.aliases ?? [],
    cssclasses: p.cssclasses ?? [],
    frame: p.frame ?? "default",
    hydrate: p.hydrate ?? true,
  }
}
export function jsonData(value: unknown, source: string): unknown {
  const visit = (v: unknown, seen = new Set<object>()) => {
    if (
      v === null ||
      typeof v === "string" ||
      typeof v === "boolean" ||
      (typeof v === "number" && Number.isFinite(v))
    )
      return
    if (
      typeof v !== "object" ||
      v instanceof Date ||
      (!Array.isArray(v) && Object.getPrototypeOf(v) !== Object.prototype) ||
      seen.has(v)
    )
      throw new Error(`${source}: page data must be finite, acyclic JSON values`)
    seen.add(v)
    for (const child of Object.values(v)) visit(child, seen)
    seen.delete(v)
  }
  visit(value)
  return value
}
export function inspectBody(html: string, slug: string, baseUrl: string) {
  const tree = fromHtml(html, { fragment: true }) as Root
  const words: string[] = [],
    links = new Set<string>(),
    ids = new Set<string>()
  const headings: { depth: number; text: string; slug: string }[] = []
  const site = new URL(`https://${baseUrl}`)
  const text = (node: RootContent): string =>
    node.type === "text"
      ? node.value
      : "children" in node
        ? node.children.map((c) => text(c as RootContent)).join("")
        : ""
  function walk(node: Root | RootContent) {
    if (node.type === "element") {
      if (["script", "style", "template", "noscript"].includes(node.tagName)) return
      if (node.properties.id) {
        const id = String(node.properties.id)
        if (ids.has(id)) throw new Error(`${slug}: duplicate id ${id}`)
        ids.add(id)
      }
      if (/^h[2-6]$/.test(node.tagName)) {
        if (!node.properties.id)
          throw new Error(`${slug}: heading '${text(node)}' needs an id (or use Section)`)
        headings.push({
          depth: +node.tagName[1],
          text: text(node),
          slug: String(node.properties.id),
        })
      }
      if (
        node.tagName === "a" &&
        typeof node.properties.href === "string" &&
        !node.properties.href.startsWith("#")
      ) {
        const url = new URL(
          node.properties.href,
          new URL(slug, site.origin + site.pathname.replace(/\/?$/, "/")),
        )
        const prefix = site.pathname.replace(/\/?$/, "/")
        if (url.origin === site.origin && url.pathname.startsWith(prefix)) {
          const dest =
            decodeURIComponent(url.pathname.slice(prefix.length))
              .replace(/\.(html|md)$/, "")
              .replace(/\/index$/, "")
              .replace(/\/$/, "") || "index"
          if (!/\.[a-z0-9]+$/i.test(dest)) links.add(dest)
        }
      }
    }
    if (node.type === "text") words.push(node.value)
    if ("children" in node) node.children.forEach((child) => walk(child as RootContent))
  }
  walk(tree)
  const min = Math.min(...headings.map((h) => h.depth))
  return {
    tree,
    text: words.join(" ").replace(/\s+/g, " ").trim(),
    links: [...links],
    toc: headings.map((h) => ({ ...h, depth: h.depth - min })),
  }
}
export async function compileReactPages(ctx: BuildCtx): Promise<Compilation> {
  const empty = { content: [], slugs: [], replaces: new Set<string>(), dependencies: [] }
  const setting = ctx.cfg.configuration.reactPages
  if (!setting) return empty
  const directory = path.resolve(setting.directory),
    project = process.cwd()
  const sources = (await globby("**/*.page.tsx", { cwd: directory, absolute: true })).sort()
  if (!sources.length) return empty
  const cache = path.resolve(".quartz-cache/react-pages")
  await fs.mkdir(cache, { recursive: true })
  const deps = new Set<string>(),
    loaded = []
  const routes = new Map<string, string>(),
    replaces = new Set<string>()
  const trackInputs = (inputs: Record<string, unknown>) => {
    for (const name of Object.keys(inputs)) if (!name.startsWith("<")) deps.add(path.resolve(name))
  }
  const apiPath = path.resolve("quartz/custom-pages/api.tsx")
  const basePath = new URL(
    `https://${ctx.cfg.configuration.baseUrl ?? "example.com"}`,
  ).pathname.replace(/\/?$/, "/")
  for (const source of sources) {
    const serverEntry = `import Page, {page} from ${JSON.stringify(source)};
      import {createElement} from "react"; import {renderToString} from "react-dom/server";
      import {PageContext} from ${JSON.stringify(apiPath)};
      export {page}; export const componentType=typeof Page;
      export const render=(props,prefix)=>renderToString(createElement(PageContext.Provider,{value:{basePath:props.basePath}},createElement(Page,props)),{identifierPrefix:prefix});`
    const result = await build({
      stdin: { contents: serverEntry, resolveDir: project, loader: "tsx" },
      bundle: true,
      platform: "node",
      format: "esm",
      packages: "external",
      jsx: "automatic",
      jsxImportSource: "react",
      write: false,
      metafile: true,
      loader: { ".css": "empty" },
    })
    trackInputs(result.metafile!.inputs)
    const css = Object.keys(result.metafile!.inputs)
      .filter((p) => p.endsWith(".css"))
      .map((p) => path.resolve(p))
    const code = result.outputFiles![0].text
    const filename = path.join(cache, digest(code) + ".mjs")
    await fs.writeFile(filename, code)
    const mod = await import(pathToFileURL(filename).href)
    const page = validatePage(mod.page, path.relative(project, source))
    if (mod.componentType !== "function")
      throw new Error(`${source}: default export must be a React component`)
    for (const route of [page.slug, ...page.aliases!]) {
      if (routes.has(route))
        throw new Error(`React page route collision: ${route} (${source}, ${routes.get(route)})`)
      routes.set(route, source)
    }
    for (const replaced of page.replaces ?? []) {
      if (replaces.has(replaced)) throw new Error(`Multiple React pages replace ${replaced}`)
      replaces.add(replaced)
    }
    if (page.draft) continue
    let data: unknown = {}
    const dataSource = source.replace(/\.page\.tsx$/, ".data.ts")
    const hasData = await fs
      .access(dataSource)
      .then(() => true)
      .catch((e) => {
        if (e.code === "ENOENT") return false
        throw e
      })
    if (hasData) {
      const result = await build({
        entryPoints: [dataSource],
        bundle: true,
        platform: "node",
        format: "esm",
        packages: "external",
        write: false,
        metafile: true,
      })
      trackInputs(result.metafile!.inputs)
      const dataFile = path.join(cache, digest(result.outputFiles![0].text) + ".mjs")
      await fs.writeFile(dataFile, result.outputFiles![0].text)
      const dataModule = await import(pathToFileURL(dataFile).href)
      if (typeof dataModule.default !== "function")
        throw new Error(`${dataSource}: default export must load page data`)
      const context: PageDataContext = {
        readText: async (file) => {
          const absolute = path.resolve(file)
          deps.add(absolute)
          return fs.readFile(absolute, "utf8")
        },
      }
      data = jsonData(await dataModule.default(context), dataSource)
    }
    loaded.push({ source, page, data, css, render: mod.render })
  }
  const entries: Record<string, string> = {}
  for (const item of loaded) {
    const file = path.join(cache, "client-" + digest(item.source) + ".tsx")
    await fs.writeFile(
      file,
      item.page.hydrate
        ? `import Page from ${JSON.stringify(item.source)};\nimport { mountPage } from ${JSON.stringify(path.resolve("quartz/custom-pages/hydrate.tsx"))};\nexport const mount=(root,props)=>mountPage(root,Page,props);\n`
        : item.css.map((file) => `import ${JSON.stringify(file)};`).join("\n"),
    )
    entries[digest(item.source)] = file
  }
  const outdir = path.resolve(ctx.argv.output, "static/react-pages")
  const resources = new Map<string, { js: string; css: string[] }>()
  if (Object.keys(entries).length) {
    const result = await build({
      entryPoints: entries,
      outdir,
      bundle: true,
      splitting: true,
      format: "esm",
      platform: "browser",
      target: "es2022",
      jsx: "automatic",
      jsxImportSource: "react",
      minify: true,
      metafile: true,
      entryNames: "[name]-[hash]",
      chunkNames: "chunks/[name]-[hash]",
      assetNames: "assets/[name]-[hash]",
      define: { "process.env.NODE_ENV": JSON.stringify("production") },
    })
    trackInputs(result.metafile!.inputs)
    for (const [output, info] of Object.entries(result.metafile!.outputs)) {
      if (!info.entryPoint || !output.endsWith(".js")) continue
      const sourceId = Object.entries(entries).find(
        ([, file]) => path.resolve(info.entryPoint!) === file,
      )?.[0]
      if (sourceId)
        resources.set(sourceId, {
          js: basePath + path.relative(ctx.argv.output, output).replaceAll(path.sep, "/"),
          css: info.cssBundle
            ? [basePath + path.relative(ctx.argv.output, info.cssBundle).replaceAll(path.sep, "/")]
            : [],
        })
    }
  }
  const content: ProcessedContent[] = []
  for (const { source, page, data, render } of loaded) {
    const prefix = "rp-" + digest(page.slug) + "-",
      props = { page, data, basePath }
    const html = render(props, prefix)
    const parsed = inspectBody(html, page.slug, ctx.cfg.configuration.baseUrl ?? "example.com")
    const resource = resources.get(digest(source))
    const attrs = page.hydrate
      ? ` data-page-module="${escape(resource!.js)}" data-page-props="${escape(JSON.stringify(props))}" data-page-prefix="${prefix}"`
      : ""
    const body = `<div data-react-page="${escape(page.slug)}"${attrs}>${html}</div>`
    const tree = fromHtml(body, { fragment: true }) as Root
    const file = new VFile({ path: source, value: html })
    const date = new Date(page.date),
      updated = new Date(page.updated ?? page.date)
    file.data = {
      slug: page.slug as FullSlug,
      // Preserve the original path's case redirect when migrating a Markdown page.
      relativePath: (page.replaces?.[0] ?? page.slug + ".md") as FilePath,
      filePath: source as FilePath,
      frontmatter: { ...page.properties, ...page, tags: page.tags! },
      text: parsed.text,
      description: page.description,
      links: parsed.links as SimpleSlug[],
      aliases: page.aliases,
      dates: { created: date, modified: updated, published: date },
      toc: parsed.toc,
      htmlAst: tree,
      unlisted: page.unlisted,
      reactPage: {
        html: body,
        css: resource?.css ?? [],
        frame: page.frame!,
        source: path.relative(project, source),
      },
    }
    content.push([tree, file])
  }
  return {
    content,
    slugs: loaded.flatMap(({ page }) => [page.slug, ...page.aliases!]) as FullSlug[],
    replaces,
    dependencies: [...deps],
  }
}
export function mergeReactPages(
  markdown: ProcessedContent[],
  compiled: Compilation,
): ProcessedContent[] {
  const remaining = markdown.filter(([, f]) => !compiled.replaces.has(String(f.data.relativePath)))
  const occupied = new Set(
    remaining.flatMap(([, f]) => [
      f.data.slug,
      ...(Array.isArray(f.data.aliases) ? f.data.aliases : []),
    ]),
  )
  for (const slug of compiled.slugs)
    if (occupied.has(slug))
      throw new Error(
        `React page route ${slug} conflicts with Markdown. Use an explicit replaces path for a migration.`,
      )
  return [...remaining, ...compiled.content]
}
