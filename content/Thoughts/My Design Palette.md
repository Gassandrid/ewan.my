---
date: 2025-12-09
updated: 2026-09-29T12:06:59-04:00
class:
  - note
tags:
  - art/design
source:
related:
author:
description:
aliases:
  - My Color Palette
---

This is my new color palette for all things web design and branding. This is the primary color palette behind my website, but also my new presentations and any other project I might make.

| Light                                | Dark                                 | **Name**       | **Light Hex** | **Dark Hex** |
| ------------------------------------ | ------------------------------------ | -------------- | ------------- | ------------ |
| <span style="color:#F5F1EB">⬤</span> | <span style="color:#25262A">⬤</span> | **Light**      | `#F5F1EB`     | `#25262A`    |
| <span style="color:#E3DFD9">⬤</span> | <span style="color:#353436">⬤</span> | **Light Gray** | `#E3DFD9`     | `#353436`    |
| <span style="color:#92908E">⬤</span> | <span style="color:#8E8983">⬤</span> | **Gray**       | `#92908E`     | `#8E8983`    |
| <span style="color:#4B5058">⬤</span> | <span style="color:#D4CEC7">⬤</span> | **Dark Gray**  | `#4B5058`     | `#D4CEC7`    |
| <span style="color:#303B49">⬤</span> | <span style="color:#EBE7E1">⬤</span> | **Dark**       | `#303B49`     | `#EBE7E1`    |
| <span style="color:#A38072">⬤</span> | <span style="color:#c59b8d">⬤</span> | **Secondary**  | `#A38072`     | `#c59b8d`    |
| <span style="color:#858384">⬤</span> | <span style="color:#a89a8d">⬤</span> | **Tertiary**   | `#858384`     | `#a89a8d`    |
| <span style="color:#AD6E60">⬤</span> | <span style="color:#db8e88">⬤</span> | **Rust**       | `#AD6E60`     | `#db8e88`    |
| <span style="color:#C18E77">⬤</span> | <span style="color:#deaea0">⬤</span> | **Clay**       | `#C18E77`     | `#deaea0`    |
| <span style="color:#E89A39">⬤</span> | <span style="color:#e0bc7e">⬤</span> | **Ochre**      | `#E89A39`     | `#e0bc7e`    |
| <span style="color:#899780">⬤</span> | <span style="color:#aebd9f">⬤</span> | **Sage**       | `#899780`     | `#aebd9f`    |
| <span style="color:#587571">⬤</span> | <span style="color:#8daeb3">⬤</span> | **Pine**       | `#587571`     | `#8daeb3`    |
| <span style="color:#748C9C">⬤</span> | <span style="color:#9bb0bd">⬤</span> | **Slate**      | `#748C9C`     | `#9bb0bd`    |
| <span style="color:#A08A98">⬤</span> | <span style="color:#c9b1b9">⬤</span> | **Mauve**      | `#A08A98`     | `#c9b1b9`    |

## Fonts

Headers: Fraunces

Body: PP Neue Montreal

Code: IBM Plex Mono

## Design Workspace

The shared specification lives with the global `ewan-visual-system` skill, and the interactive workspace is now [Design Studio on Lab](https://lab.ewan.my/design-studio/) (also available from Lab’s Design module). It combines the former general visual guidance and Matplotlib figure guidance into one entry point, with separate guides retrieved only for the artifact being made. The rendering tools remain in their own projects.

The original **01 · Blue ink / warm paper** palette and typeface roles above are established. Ink `#303B49`, paper `#F5F1EB`, and ochre `#E89A39` anchor the fourteen-color system. The board keeps **adopted** decisions, **exploratory** candidates, and **parked** references in its optional notes/source view. New button, callout, document, equation and figure treatments are examples to compare, not approved defaults. Native PDFs and plots are rendered samples; slide, poster, report and spreadsheet HTML views are explicitly composition studies.

The token authority remains the dotfiles-owned `theme.json`, located through `homelab ledger get EWAN_THEME_DIR`. This note supplies human context and navigation. The site-specific dark adapter uses near-neutral charcoal `#25262A`, warm dividers `#353436`, muted gray `#8E8983`, body `#D4CEC7` and foreground `#EBE7E1`, retaining the existing lighter accents. The full-page blue `#303B49` was too saturated: dark mode should keep the previous gray-brown atmosphere with only a subtle blue cast. Light mode and Design Studio remain on original 01. A universal dark adapter across every medium remains open.

### Finding and Comparing References

Use [Component Gallery](https://component.gallery/components/) for component vocabulary, [Fonts In Use](https://fontsinuse.com/) for typography in context, [Are.na](https://www.are.na/) for broader references, [Rougier](https://github.com/rougier/scientific-visualization-book) and [Wilke](https://clauswilke.com/dataviz/) for scientific figures, [Castel](https://castel.dev/notes/) and [TeXample](https://texample.net/) for mathematical pages and diagrams, and [Distill](https://distill.pub/) for explanatory artifacts. The gallery has the wider resource list.

Compare structurally different treatments using the same content. Record what is worth borrowing—alignment, enclosure, density, annotation, or interaction—and promote a candidate only after an explicit decision. TikZ guidance covers the meaning of nodes/arrows, mathematical consistency, quiet strokes, and readability at final size.

### Procedural Identity — Exploratory Studies

I want to explore procedural HTML artifacts that express identity through a variable family of forms. Current references are [Eigenfish](https://github.com/profConradi/eigenfish) and [Jacky Zhao’s dappled-light experiments](https://jzhao.xyz/posts/dappled-light): low-color, close to this palette, possibly points or pixels. Interactive studies are now authorized: a browser port of the actual Eigenfish matrix-sampling method and an independent dappled-light shader study. Neither is an adopted identity mark. Controls cover seeded variation, palette, sampling or branching, pixel/point treatment, and saved parameter/PNG exports.

Possible directions suggested for later exploration are sparse recurrent-matrix spectra, dendritic growth, dynamical trajectories/recurrence textures, and local particle interactions. These connect to the representation, dynamics and sparse-observation themes in [[PhD/Ewan - Research and Career Constitution]], which remains a working draft. They are suggestions, not adopted identity claims or measured neural imagery. [Detailed reference notes](file:///Users/gassandrid/.codex/skills/ewan-visual-system/references/procedural-identity.md).

### Hex Core — Exploratory Surface Study

[Design Studio → Procedural](https://lab.ewan.my/design-studio/) now includes seeded Hex Core renders inspired by the Arcane references I supplied: a hollow, perforated spherical membrane with organic openings, pointed extensions, fractures and diffuse colored points. The artwork uses dark violet with cyan, mint, rose and warm highlights; this is a separate art palette. The surface is constructed procedurally and projected to Canvas 2D, with the rear shell visible through holes. Conradi informs the point-cloud treatment; the geometry does not use eigenvalue sampling.

Vesicle, Crown and Fractured relic are starting forms. New core changes the seed; controls expose geometry, point texture, view, light and colors. Save studies or export PNG and complete parameter JSON to reproduce a result. This remains an exploratory identity direction. [Sample render](file:///Users/gassandrid/.codex/skills/ewan-visual-system/assets/generated/hexcore-1701.png) · [Method and design contract](file:///Users/gassandrid/.codex/skills/ewan-visual-system/references/procedural-identity.md).

### Palette Exploration

The board is a visual scratchpad: one vertical stack of headings followed by specimens, without descriptive subheads or status badges. **Board tools** reveals notes, sources, filtering and optional palette previews. The default board uses the adopted palette; saved experiments are preserved. Its **Procedural** section holds the generative references. **Color palettes** shows three color cards: `#303B49` with existing `#F5F1EB` paper, cooler `#2C3950` with `#F1F1EC`, and warmer `#343B45` with `#F4EFE7`. Each candidate uses `#E89A39` ochre and adjusts the supporting neutral and accent colors. **01 · Blue ink / warm paper was adopted on 2026-09-28** as the standard for the shared theme, Design Studio and ewan.my. 02 and 03 remain exploratory.

**01 is the adopted standard and initial parent; 03 is an exploratory alternate.** The React studio adds seeded OKLCH mutation, relational changes, crossover, locks, branching history, pins, manual edits and coding-agent proposals. Export a brief with parents and creative feedback; import the agent’s returned palettes into the same comparison workflow.

Notes, references, generations and saved studies stay in browser local storage; there is no application backend. Export the full workspace JSON to preserve or move it. Compiled figure/PDF samples retain their build palette. Durable decisions should be written into the design source and this note when chosen.

### Project and Skill Ownership

[Design Studio source](file:///Users/gassandrid/Lab/infra/homelab/apps/design-studio/) is a separate React/TypeScript/Vite app in the homelab repository, maintained canonically on Andrael and served under Lab. The [studio guide](file:///Users/gassandrid/.codex/skills/ewan-visual-system/references/studio.md) routes agents to its workflow and interchange contracts. Work on the studio should always maintain the affected universal skill guidance alongside the code. The skill still owns templates, medium-specific instructions, the portable HTML reference and native specimens; the shared theme remains the adopted token authority.

### Interactive Website Pages

Custom interactive documents now use the website’s `.page.tsx` authoring path: React bodies inside the same article shell, with normal metadata, search, headings, tags, links and backlinks. Sources stay in the Lab website project’s `pages/` folder, outside Vault-synchronized content. [Chart Demo](https://ewan.my/thoughts/chart-demo) is the React example; GaggiMate and Morris–Lecar share the document contract while retaining their existing controllers.

- [Authoring guide](file:///Users/gassandrid/Lab/projects/ewan.my/docs/react-pages.md) and [page sources](file:///Users/gassandrid/Lab/projects/ewan.my/pages/).
- [Design skill guide](file:///Users/gassandrid/.codex/skills/ewan-visual-system/references/react-pages.md) and [starter template](file:///Users/gassandrid/.codex/skills/ewan-visual-system/assets/templates/react-page.tsx).

Explore component treatments in Design Studio, then reuse them in website pages. The site supplies typography and theme; each custom body owns its content and useful controls. New component treatments remain exploratory until selected.

### Desktop and Editor Themes

The shared theme now includes the charcoal dark adapter, with ochre focus accents. SketchyBar uses PP Neue Montreal labels; Kitty and code use IBM Plex Mono. OmniWM borders and overview, Starship, and the Obsidian Minimal snippet share the same tokens.

- [Desktop adapter guide](file:///Users/gassandrid/.config/ewan-theme/codex/skills/ewan-visual-system/references/desktop.md)
- [Theme authority](file:///Users/gassandrid/.config/ewan-theme/theme.json)
- [Adapter generator](file:///Users/gassandrid/.config/ewan-theme/scripts/sync-desktop.py)

Run the generator with `--check` to find drift, or `--apply --obsidian-vault ~/VAULT` to update the installed adapters; it retains backups.
