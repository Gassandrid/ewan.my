# Quartz v5 Migration Run

Date: 2026-06-03

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

## Open Gaps

- Browser screenshot/interaction verification was not run because no callable Browser tool was exposed in this session.
- `NotebookEmbedding` and `Sidenotes` are intentionally not blockers for this migration. Ewan decided on 2026-06-05 not to carry Jupyter notebook embedding or sidenotes forward for this cutover.
- Candidate `quartz-community` repos were checked on 2026-06-03. The default and Obsidian plugin repos exist, but the above v4 custom transformer names do not exist as direct community repos.

## Retrieval Terms

Quartz v5 migration, `v5-migration`, `quartz.config.yaml`, `bases-page`, `Nootropic Compounds.base`, `class.contains("medication")`, `ewan-marimo`, `ewan-charts`, `ewan-run-python`, `ewan-morris-lecar`, `ewan-tikz`, `node-tikzjax`, `TikzJax`, `MARIMO_PYTHON`, `content/References.bib`, `bibliographyFile`.
