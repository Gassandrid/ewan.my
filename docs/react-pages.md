# React pages

Author custom interactive bodies in `pages/**/*.page.tsx`. They compile into the
same Quartz content pipeline as Markdown: title, description, dates, tags, aliases,
search, graph links, backlinks, table of contents, feeds, sitemap and social cards.
The normal header, typography, theme toggle, navigation and article shell remain
owned by the site. There is no separate application router or backend.

## Start a page

From this repository, with its Node version active:

```sh
npm run page:new -- experiments/my-page "My Page"
npm run build -- --serve
```

The scaffold starts with `draft: true`; remove that flag to preview/publish it.
The second command watches page components, local imports, CSS, data loaders and
files read through `readText`. A component/data change reloads the preview.
Configuration, plugin or compiler changes require restarting the server.

```tsx
/** @jsxImportSource react */
import { useState } from "react"
import { definePage, PageLink, Section } from "../quartz/custom-pages/api"

export const page = definePage({
  slug: "experiments/my-page",
  title: "My Page",
  description: "The question this page explores.",
  date: "2026-09-28",
  tags: ["art/design"],
})

export default function MyPage() {
  const [value, setValue] = useState(0)
  return (
    <Section id="experiment" title="Experiment">
      <button onClick={() => setValue(value + 1)}>Count: {value}</button>
      <PageLink to="thoughts/chart-demo">Chart Demo</PageLink>
    </Section>
  )
}
```

Use real React imports. Quartz's outer shell uses Preact; the compiler keeps their
renderers separate. Authors do not call `createRoot` or mount the page themselves.

## Metadata and content

Required: `slug`, `title`, `description`, ISO `date`. Optional: `updated`, `tags`,
`aliases` (canonical site paths), `draft`, `unlisted`, `frame: "full-width"`,
`cssclasses`, `properties` (additional JSON frontmatter), `hydrate: false`.
The default frame is an ordinary article; request full width for a visualization
that needs it. Use `unlisted` for exclusion from discovery, not access control.

Use one exported function component as the default export. The site supplies the
H1 and description; start body sections at H2. Give H2–H6 headings stable unique
IDs, or use `Section`. Render meaningful text and links on the first render:
the build extracts those for search and backlinks. Canvas/WebGL-only content
needs a text/table/SVG representation describing what is actually shown.

`PageLink` accepts canonical paths and optional anchors. Ordinary links and
Markdown `[[My Page]]` links work through Quartz's usual route matching. Aliases
produce redirects. Duplicate routes, invalid metadata/data and missing heading
anchors fail the build. A migration can explicitly name Markdown files in
`replaces: ["Thoughts/Old Page.md"]`; they stay in the Vault but their published
body comes from TSX. Never silently overwrite a Markdown route.
Put the original canonical source first in `replaces` to preserve its case redirect.

Keep source under `pages/`, outside `content/`: Vault sync replaces `content/`.
Existing Markdown authors and embedded widgets do not need to migrate.

## Build-time data

A sibling `my-page.data.ts` may export an async default loader:

```ts
import type { PageDataContext } from "../quartz/custom-pages/api"
export default async function load({ readText }: PageDataContext) {
  return { samples: JSON.parse(await readText("quartz/static/data/samples.json")) }
}
```

Receive it with `PageProps<YourDataType>` in the component. Data must be plain,
finite, acyclic JSON. Dates should be strings. `readText` paths are relative to
the repository and are tracked by the preview watcher. Loaders can use Node APIs;
their code stays on the build side. **Returned data is public**, serialized into
the page when hydrated. Fetch only publication-ready inputs. Async components,
server actions and per-request server rendering are not part of this static site.

## Interaction and design

- The first render must be deterministic: no `window`, random values, current
  time or viewport-dependent branches during render. Put browser-only behavior
  in effects and return a cleanup for timers, observers and event listeners.
- React hydrates only the visited page. Quartz navigation unmounts it before
  replacing the DOM; rapid navigation discards stale loads. `hydrate: false`
  emits static content/CSS and supports existing imperative controllers.
- Import colocated CSS, scoped under a page/component class. Use `--light`,
  `--dark`, `--darkgray`, `--lightgray`, `--secondary`, `--rust`, `--ochre`, `--sage`,
  `--pine`, `--slate`, and existing font variables. Do not hard-code another theme.
- Follow the **ewan-visual-system** skill: useful controls, sparse framing,
  explicit units/provenance, keyboard access, narrow layouts and reduced motion.
  Experimental treatments belong on the Design Studio board before becoming
  reusable defaults. Keep general components in `pages/components/`.

## Working examples and verification

- `pages/chart-demo.page.tsx`: React state, reusable SVG charts, build data, scoped
  CSS, normal frame, aliases and an explicit Markdown migration.
- `pages/gaggimate.page.tsx`: static React composition around the existing calendar.
- `pages/morris-lecar.page.tsx`: full-width body preserving the existing solver/UI.
  The previous per-page plugins remain as reference; they are no longer enabled.

Run `npm run validate`. It type-checks both renderers, tests real compiler fixtures,
builds the site and probes the emitted shell/index/assets. Then inspect the page
in the browser: first load, controls, navigation away/back, search, light/dark and
a narrow viewport. For new scientific views, verify encodings and data separately.

Implementation: `quartz/custom-pages/` compiles/inspects bodies before Markdown
filters and emitters; `plugins/ewan-react-pages/` supplies the Quartz body and
navigation lifecycle. Keep this guide and the visual-system React-page guide
aligned when changing that contract.
