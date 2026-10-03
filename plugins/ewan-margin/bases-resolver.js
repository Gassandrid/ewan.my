import { readFileSync } from "node:fs"

// Use the exact resolver that renders Bases views, including formulas, `this`,
// sorting and limits. Upstream does not expose it from the package entry point.
// Find its compiled export without pinning a generated chunk filename, and fail
// at build time if an upstream update changes this integration seam.
const entry = new URL("../../.quartz/plugins/bases-page/dist/index.js", import.meta.url)
const source = readFileSync(entry, "utf8")
const chunk = source.match(
  /^import\s*\{[^}]*\bresolveBasesEntries\b[^}]*\}\s*from\s*["']([^"']+)["']/m,
)?.[1]
if (!chunk) throw new Error("Quartz Bases resolver changed; update the reading margin adapter")

export const { resolveBasesEntries } = await import(new URL(chunk, entry).href)
if (typeof resolveBasesEntries !== "function") {
  throw new Error("Quartz Bases resolver changed; update the reading margin adapter")
}
