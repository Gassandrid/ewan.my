# Technical Debt

This ledger records concrete deferred weaknesses for the maintained Quartz site.
Re-run `npm audit --omit=dev` before changing status; generated site output and
ordinary dependency-update noise do not belong here.

## TD-SEC-001 — Upgrade `sharp` past vulnerable bundled libvips

- Status: Open
- Evidence: `npm audit --omit=dev` on 2026-08-10 reports
  `GHSA-f88m-g3jw-g9cj`; `npm ls sharp` resolves the direct dependency to
  `sharp@0.34.5`.
- Paths: `package.json`, `package-lock.json`, OG-image and image-processing build
  paths.
- Consequence: processing a crafted image during a build can reach inherited
  libvips vulnerabilities. The published static files do not execute `sharp`.
- Bounded next action: test `sharp@0.35.3` in a dependency-only branch, rebuild
  all OG images, and compare representative image metadata and pixels.
- Exit condition: the production audit no longer reports the advisory and the
  full build plus static probe pass.
- Last reviewed: 2026-08-10

## TD-SEC-002 — Replace vulnerable transitive `svgo`

- Status: Open
- Evidence: `npm audit --omit=dev` on 2026-08-10 reports
  `GHSA-2p49-hgcm-8545`; `npm ls svgo` resolves `svgo@3.3.3` through
  `node-tikzjax@1.0.5`.
- Paths: `package-lock.json`, TikZ/SVG generation and sanitization paths.
- Consequence: the affected `removeScripts` transform can leave executable SVG
  scripts intact when processing untrusted SVG input.
- Bounded next action: evaluate a `node-tikzjax` update or a compatible lockfile
  override to `svgo>=3.3.4`, then run the TikZ corpus and inspect script-bearing
  SVG fixtures.
- Exit condition: the advisory is absent and `npm run build && npm run probe`
  retain the full TikZ count and safety assertions.
- Last reviewed: 2026-08-10

## TD-SEC-003 — Update vulnerable `brace-expansion` copies

- Status: Open
- Evidence: `npm audit --omit=dev` on 2026-08-10 reports
  `GHSA-mh99-v99m-4gvg` and `GHSA-rgw5-rvv9-x895`; `npm ls` resolves
  `brace-expansion@5.0.7` through `minimatch@10.2.5` and
  `brace-expansion@1.1.16` through `serve-handler@6.1.7`.
- Paths: `package-lock.json`, file matching and local serving dependency paths.
- Consequence: attacker-controlled expansion patterns can cause excessive memory
  allocation and process termination.
- Bounded next action: update the owning dependencies or apply narrowly tested
  lockfile overrides to fixed `brace-expansion` releases.
- Exit condition: both advisories are absent and type, unit, build, and browser
  probes pass.
- Last reviewed: 2026-08-10

## TD-SEC-004 — Upgrade `esbuild` beyond the Windows dev-server advisory

- Status: Open
- Evidence: `npm audit --omit=dev` on 2026-08-10 reports
  `GHSA-g7r4-m6w7-qqqr`; direct and transitive resolution is `esbuild@0.27.3`.
- Paths: `package.json`, `package-lock.json`, `esbuild-sass-plugin`, `tsx`.
- Consequence: the vulnerable development server can expose arbitrary files on
  Windows. The current macOS/Linux static build and deployment path is not the
  affected mode.
- Bounded next action: update to `esbuild>=0.28.1` after confirming Sass plugin
  and `tsx` compatibility under Node 22.
- Exit condition: the advisory is absent and the complete validation suite
  passes on Node 22.
- Last reviewed: 2026-08-10
