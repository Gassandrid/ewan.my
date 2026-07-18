import { h } from "preact"

const SLUG = "pages/gaggimate-extractions"

function GaggiMateBody() {
  function Component({ fileData }) {
    const classes = fileData.frontmatter?.cssclasses ?? []
    const config = JSON.stringify({
      source: "/static/data/gaggimate-calendar.json",
      year: 2025,
      month: 2,
    })
    return h(
      "article",
      { class: ["popover-hint", ...classes].join(" ") },
      h(
        "div",
        { class: "markdown-preview-view markdown-rendered custom-page" },
        h(
          "p",
          { style: "color: var(--gray); font-size: 0.85rem; margin-bottom: 1.5rem" },
          "Extraction data from a Gaggia Classic Pro with GaggiMate mod. Click a day to see shot profiles with pressure, flow, weight, and temperature overlaid.",
        ),
        h(
          "div",
          { class: "calplot-container", id: "gaggimate-cal", "data-calplot": config },
          h("div", { class: "calplot-loading" }, h("div", { class: "chart-loading-spinner" })),
          h(
            "div",
            { class: "calplot-month-nav" },
            h(
              "button",
              { class: "calplot-nav-btn calplot-prev", "aria-label": "Previous month" },
              "←",
            ),
            h("span", { class: "calplot-month-label" }),
            h("button", { class: "calplot-nav-btn calplot-next", "aria-label": "Next month" }, "→"),
          ),
          h("div", { class: "calplot-grid" }),
          h(
            "div",
            { class: "calplot-detail" },
            h("div", { class: "calplot-selected-label" }),
            h("div", { class: "calplot-day-stats data-grid", style: "--grid-cols: 4" }),
            h("div", { class: "calplot-shot-tabs" }),
            h("div", { class: "calplot-profile" }),
          ),
        ),
      ),
    )
  }
  Component.displayName = "GaggiMateBody"
  return Component
}

export default function GaggiMatePage() {
  return {
    name: "GaggiMatePage",
    priority: 20,
    match: () => false,
    generate() {
      const title = "GaggiMate Extractions"
      const description = "Espresso extraction tracking and analysis via GaggiMate"
      return [
        {
          slug: SLUG,
          title,
          data: {
            slug: SLUG,
            relativePath: "virtual/gaggimate-extractions.md",
            filePath: "virtual/gaggimate-extractions.md",
            frontmatter: {
              title,
              tags: ["coffee", "data", "quantified-self"],
              description,
              cssclasses: ["gaggimate-page"],
            },
            text: title + ". " + description,
            description,
            links: [],
          },
        },
      ]
    },
    layout: "content",
    body: GaggiMateBody,
  }
}
