# Quartz v5 Migration Run

Date: 2026-06-03; completed 2026-07-17

Worktree: `/private/tmp/ewan.my-v5-migration`
Branch: `v5-migration`
Base: `upstream/v5`

## What Changed

- Recreated the migration worktree after `/private/tmp` cleanup pruned the earlier checkout.
- Ported the current `content/`, `quartz/static/`, site styles, and scripts into Quartz 5.
- Added `quartz.config.yaml` for the v5 plugin model and kept non-serializable plugin overrides in `quartz.ts`.
- Installed current `quartz-community` default plugins from GitHub, including `bases-page`.
- Replaced the old v4 `ObsidianBases` transformer with `github:quartz-community/bases-page`.
- Added local v5 plugins:
  - `plugins/ewan-marimo`: generates pages from `*.marimo.py`.
  - `plugins/ewan-marimo-resources`: loads Marimo island JS/CSS resources.
  - `plugins/ewan-charts`: renders `chart` fences with the copied D3 runtime and chart styles.
  - `plugins/ewan-run-python`: renders `python` and `python-r` fences as runnable Pyodide blocks.
  - `plugins/ewan-morris-lecar`: loads and initializes the custom Morris-Lecar page runtime.
  - `plugins/ewan-tikz`: renders `tikz` fences to SVG at build time with `node-tikzjax`.
- Fixed Marimo Python selection to prefer `MARIMO_PYTHON`, then Miniconda base Python with `marimo 0.23.8`, then `python3`.
- Added root `node-tikzjax` dependency for the TikZ plugin; do not use `quartz.requiresInstall` here because it forces an npm registry hit on every build.
- Added `.github/workflows/deploy.yml` for GitHub Pages deployment from `v5` or `v5-migration`.
- Added ignores for local agent/tool state under `content/` so it is not committed or published.

## Bases Notes

The v5 `bases-page` plugin is a transformer, page type, and component, so it replaces the old custom `quartz/plugins/transformers/bases.ts`.

One content compatibility patch was needed:

- `content/Notes/Neuropharmacology/Nootropic Compounds.base`
  - changed `class == ["medication"]`
  - to `class.contains("medication")`

The old equality expression rendered an empty v5 base. The v5-compatible expression renders 22 entries.

## Verification

- `npm ci` passed.
- `npx quartz plugin install --from-config` passed and updated `quartz.lock.json`.
- `npm run quartz -- build --concurrency=1` passed.
  - Final build: 806 input files, 2272 emitted files.
- 2026-06-05 continuation: `MARIMO_PYTHON=/opt/homebrew/Caskroom/miniconda/base/bin/python npm run quartz -- build --concurrency=1` passed after the TikZ port.
  - Final build: 806 input files, 2275 emitted files.
- `npx tsc --noEmit` passed.
- 2026-06-05 continuation: `npx tsc --noEmit` passed.
- TikZ static readback found 9 `figure.tikz` outputs across 7 generated HTML pages:
  - `notes/chaos-theory/andronov-hopf-bifurcation.html`
  - `notes/chaos-theory/sinks,-sources,-and-saddles.html`
  - `notes/chaos-theory/stable-and-unstable-manifolds.html`
  - `notes/chaos-theory/homework/chaos-hw-6.html`
  - `notes/chaos-theory/conjugacy-and-the-logistic-map.html`
  - `notes/chaos-theory/homoclinic-points.html`
  - `notes/machine-learning/perceptron.html`
- 2026-06-05 continuation: temporary HTTP preview readbacks returned 200 with expected markers for `/`, `/notes/machine-learning/perceptron`, `/notes/chaos-theory/conjugacy-and-the-logistic-map`, `/notes/programming/marimo-widgets`, `/a-limited-curation.base`, and `/static/contentIndex.json`.
- Local preview required escalation because the sandbox blocked `listen 0.0.0.0:8195`.
- HTTP readbacks from `http://localhost:8195` returned 200:
  - `/`
  - `/a-limited-curation.base`
  - `/notes/neuropharmacology/nootropic-compounds.base`
  - `/notes/programming/marimo-test`
  - `/notes/programming/marimo-widgets`
  - `/static/contentIndex.json`
  - `/CNAME`
- Bases markers:
  - `A Limited Curation`: `Showing 10 of 10 entries`, `Showing 4 of 4 entries`, `Reading List`
  - `Nootropic Compounds`: `Showing 22 of 22 entries`
- Marimo markers:
  - `marimo-test`: `data-marimo-version="0.23.8"`, `data-marimo-islands="5"`
  - `marimo-widgets`: `data-marimo-version="0.23.8"`, `data-marimo-islands="7"`
- Hidden local agent/tool state was not emitted; only `public/tags/generated/claude.html` matched `claude`, from real note tags.

## 2026-07-17 Completion

- Rebased the migration checkpoint onto current `upstream/v5` at `9cf87ff1` and kept all work isolated on `v5-migration`; the dirty Quartz v4 checkout was not modified.
- Replaced the global Three.js Lorenz runtime with `plugins/ewan-lorenz`, a Canvas 2D component that selects off/low/medium/high quality from reduced-motion, Save-Data/network, viewport, memory, core count, battery, and measured frame budget. Auto/Always on/Off and the existing flow controls persist locally.
- Removed eager global runtimes:
  - D3 loads only for chart or GaggiMate containers.
  - CodeMirror loads only for RunPython blocks; Pyodide loads only after Run.
  - Morris-Lecar loads only on its custom page.
  - Marimo JS/CSS load only when islands are present.
- Restored the GaggiMate and Morris-Lecar virtual pages with canonical slugs, normal Quartz navigation where appropriate, and their copied data/runtime assets.
- Added the telemetry component and retained the existing telemetry script as a demand-loaded resource.
- Fixed the v5 virtual-page trie rebuild so Marimo and other generated pages receive normal breadcrumbs and page navigation.
- Completed the Marimo compiler/runtime contract at `0.23.9`:
  - build fails on compiler/runtime mismatch or zero emitted islands;
  - canonical lowercase Quartz slugs, dates, tags, descriptions, and normal page metadata are emitted;
  - the page uses the same article/body shell, width, heading typography, body typography, theme colors, navigation, and sidebars as standard Markdown;
  - widget shadow-DOM colors and fonts inherit the Quartz theme;
  - initial-load hydration no longer races the SPA fallback reload.
- Added `scripts/probe-build.mjs`, `scripts/probe-browser.mjs`, and custom plugin contract tests. Declared the previously missing `puppeteer-core` dependency used by the browser scripts.
- Made `npm run validate` the CI release gate and changed scripts to invoke the checked-in v5 CLI directly rather than an ambiguous `npx quartz` resolution.
- Applied npm's reviewed non-breaking security updates. Production audit is reduced from five high, two moderate, and one low finding to one low esbuild advisory scoped to its Windows development server.

Final verification on Node `22.16.0`:

- `npm run check`: passed TypeScript and scoped Prettier checks.
- `npm test`: 114 tests, 31 suites, 0 failures.
- Production build: 806 inputs, 2280 emitted files.
- Static release probe: 1228 HTML pages and 1076 TikZ pages, including RunPython, charts, Marimo, GaggiMate, Morris-Lecar, telemetry, and adaptive Lorenz markers.
- Live headless Chrome probe:
  - standard Markdown and Marimo article width: 724 px;
  - heading color/font/size and body color/font/size match exactly;
  - Marimo `0.23.9` hydrated seven islands and three visible widget groups;
  - both RunPython editors initialized while Pyodide remained unloaded before Run;
  - GaggiMate rendered 28 calendar cells, four stats, and the extraction profile;
  - Morris-Lecar initialized ten sidebar sections and a non-zero phase canvas;
  - the 390 px mobile page had no horizontal overflow and Lorenz auto mode was off.

Release boundary: no push and no Obsidian/Quartz Syncer content refresh were performed. Ewan will review this branch first, then run the separate content sync.

## 2026-07-18 Visual-Parity Audit

- Restored the deployed v4 Lora stylesheet while retaining the local `ewanfont` body faces.
- Ported the custom proportional `QuartzTOC` rail as `plugins/ewan-quartz-toc`; the community TOC transformer remains enabled to populate heading data, but its stock component is no longer laid out.
- Kept the Note Properties transformer enabled for frontmatter parsing while removing its visible component from the page layout.
- Hid article title, content metadata, and tags on the homepage while retaining them on normal Markdown pages, aligned on the same content axis.
- Added `plugins/ewan-svg-embeds` so Obsidian SVG wikilinks resolve unique attachment basenames to emitted asset paths. The homepage sailboat now loads from `attachments/florilegium-banner.svg`.
- Added `plugins/ewan-graph`, a version-guarded wrapper around the pinned community graph runtime that excludes `.base` nodes and their edges from local and maximized graph topology.
- Expanded the static release probe to cover the homepage banner, homepage metadata exclusions, custom TOC, Lora resource, and graph hygiene.

Audit verification:

- `npm run check`: passed.
- `npm test`: 117 tests, 31 suites, 0 failures.
- Serve build: 806 inputs, 2267 emitted files, completed in 50 seconds.
- Static release probe: 1228 HTML pages and 1076 TikZ pages.
- Headless Chrome probe: passed Markdown/Marimo typography parity, mobile adaptation, RunPython lazy initialization, GaggiMate, and Morris-Lecar.
- Direct homepage browser check: sailboat SVG loaded, Lora loaded, no title/meta/tags/Properties chrome, and zero console errors.
- Representative article browser check: custom 26-row title/heading rail, no stock TOC or Properties component, and `.base` filter present in the graph runtime.

Audit server: `http://localhost:8080` via `npx quartz build --serve` (using a temporary npm cache because `~/.npm` contains root-owned entries).

Push boundary: `github:quartz-community/og-image` remains deliberately disabled for the audit build. Re-enable it, run the production release gate, and only then push after Ewan's explicit approval.

## Open Gaps

- One low-severity esbuild advisory remains. Its fix requires moving from the current `0.27.x` range to `0.28.x`; the affected surface is the esbuild development server on Windows, not the generated static site or current macOS/Linux build/deploy path.
- `NotebookEmbedding` and `Sidenotes` are intentionally not blockers for this migration. Ewan decided on 2026-06-05 not to carry Jupyter notebook embedding or sidenotes forward for this cutover.
- Candidate `quartz-community` repos were checked on 2026-06-03. The default and Obsidian plugin repos exist, but the above v4 custom transformer names do not exist as direct community repos.

## Retrieval Terms

Quartz v5 migration, `v5-migration`, `quartz.config.yaml`, `bases-page`, `Nootropic Compounds.base`, `class.contains("medication")`, `ewan-marimo`, `ewan-marimo-resources`, `ewan-lorenz`, `ewan-charts`, `ewan-run-python`, `ewan-morris-lecar`, `ewan-gaggimate-page`, `ewan-telemetry`, `ewan-tikz`, `ewan-quartz-toc`, `ewan-svg-embeds`, `ewan-graph`, `ewan-fonts`, `florilegium-banner.svg`, `node-tikzjax`, `TikzJax`, `MARIMO_PYTHON`, `probe-browser`, `probe-build`, `content/References.bib`, `bibliographyFile`.
