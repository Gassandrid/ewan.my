import assert from "node:assert/strict"
import { test } from "node:test"
import renderToString from "preact-render-to-string"
import { legacyCardsView, type LegacyCardsViewProps } from "./legacyBasesCards"

function props(overrides: Partial<LegacyCardsViewProps> = {}): LegacyCardsViewProps {
  return {
    entries: [
      {
        slug: "notes/books/a-thousand-plateaus",
        title: "A Thousand Plateaus",
        properties: {
          image: "[[thousandPlateus.png]]",
          author: ["[[Félix Guattari]]", "[[Gilles Deleuze]]"],
        },
        fileProperties: { name: "A Thousand Plateaus" },
        formulaValues: { YearCompleted: 2025 },
      },
    ],
    view: {
      image: "note.image",
      order: ["file.name", "author", "formula.YearCompleted"],
    },
    basesData: {},
    total: 1,
    locale: "en-US",
    slug: "a-limited-curation.base",
    allSlugs: [
      "notes/books/a-thousand-plateaus",
      "attachments/thousandplateus.png",
      "félix-guattari",
      "gilles-deleuze",
    ],
    linkResolution: "shortest",
    ...overrides,
  }
}

test("cards use valid sibling links instead of a linked card containing metadata links", () => {
  const html = renderToString(legacyCardsView(props()))

  assert.match(html, /<div class="base-card">/)
  assert.match(html, /class="base-card-image-link"/)
  assert.match(html, /class="base-card-title-link"/)
  assert.match(html, />Félix Guattari<\/a>/)
  assert.doesNotMatch(html, /<a[^>]+class="[^"]*bases-card[^"]*"/)
})

test("cards restore grouped sections in the requested direction", () => {
  const first = props().entries[0]!
  const html = renderToString(
    legacyCardsView(
      props({
        entries: [
          first,
          {
            ...first,
            slug: "notes/books/second",
            title: "Second",
            formulaValues: { YearCompleted: 2026 },
          },
        ],
        total: 2,
        view: {
          image: "note.image",
          order: ["file.name", "author"],
          groupBy: { property: "formula.YearCompleted", direction: "DESC" },
        },
      }),
    ),
  )

  assert.match(html, /base-card-group-header">2026<\/h3>/)
  assert.ok(html.indexOf(">2026</h3>") < html.indexOf(">2025</h3>"))
  assert.equal((html.match(/class="base-card"/g) ?? []).length, 2)
})
