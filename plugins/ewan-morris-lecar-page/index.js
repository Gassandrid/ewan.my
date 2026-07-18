import { h } from "preact"

const SLUG = "pages/morris-lecar"
function button(id, label, style) {
  return h("button", { class: "tb-btn", id, style }, label)
}

function MorrisLecarBody() {
  function Component({ fileData }) {
    const classes = fileData.frontmatter?.cssclasses ?? []
    const helpRows = [
      ["Click", "Launch trajectory forward"],
      ["Shift+Click", "Forward & backward"],
      ["Alt+Click", "Noisy ensemble"],
      ["Scroll", "Zoom"],
      ["Drag", "Pan"],
      ["c", "Clear trajectories"],
      ["r", "Reset view"],
      ["p", "Toggle live sim"],
      ["Esc", "Close overlays"],
    ]
    return h(
      "article",
      { class: ["popover-hint", ...classes].join(" ") },
      h(
        "div",
        { class: "markdown-preview-view markdown-rendered ml-wrap", id: "app" },
        h(
          "div",
          { id: "toolbar" },
          h(
            "select",
            { id: "preset-select", "aria-label": "Model preset" },
            h("option", { value: "" }, "— Preset —"),
          ),
          button("btn-reset-view", "Reset View"),
          button("btn-clear-traj", "Clear"),
          button("btn-bifurc", "Bifurcation"),
          button("btn-live-sim", "Live Sim"),
          button("btn-live-play", "▶ Play", "display:none"),
          button("btn-live-reset", "Reset", "display:none"),
          h("span", { id: "live-speed-display", style: "display:none" }),
          button("btn-help", "Help"),
          h("div", { class: "tb-spacer" }),
          h("div", { id: "coord-display" }, "V: —, n: —"),
        ),
        h(
          "div",
          { id: "main-area" },
          h(
            "div",
            { id: "phase-container" },
            h("div", { id: "phase-canvas-wrap" }, h("canvas", { id: "phase-canvas" })),
            h(
              "div",
              { id: "timeseries-container" },
              h("button", { id: "ts-toggle" }, "▼ Time Series"),
              h("span", { id: "ts-label" }),
              h("canvas", { id: "ts-canvas" }),
            ),
          ),
          h("div", { id: "sidebar" }),
        ),
        h(
          "div",
          { id: "bifurc-modal" },
          h(
            "div",
            { id: "bifurc-content" },
            button("bifurc-close", "Close"),
            h("h2", null, "Bifurcation Diagram (V vs I", h("sub", null, "ext"), ")"),
            h("canvas", { id: "bifurc-canvas" }),
            h("div", { id: "bifurc-status" }, "Ready"),
          ),
        ),
        h(
          "div",
          { id: "help-overlay" },
          h(
            "div",
            { id: "help-content" },
            h("h2", null, "Keyboard & Mouse"),
            h(
              "table",
              null,
              helpRows.map(([key, description]) =>
                h("tr", null, h("td", null, key), h("td", null, description)),
              ),
            ),
          ),
        ),
      ),
    )
  }
  Component.displayName = "MorrisLecarBody"
  return Component
}

export default function MorrisLecarPage() {
  return {
    name: "MorrisLecarPage",
    priority: 20,
    match: () => false,
    generate() {
      const title = "Morris-Lecar Phase Plane"
      const description = "Phase-plane explorer with nullclines, trajectories, and bifurcations"
      return [
        {
          slug: SLUG,
          title,
          data: {
            slug: SLUG,
            relativePath: "virtual/morris-lecar.md",
            filePath: "virtual/morris-lecar.md",
            frontmatter: {
              title,
              tags: ["comp-neuro/models", "math/chaos/dynamics"],
              description,
              cssclasses: ["morris-lecar-page"],
            },
            text: title + ". " + description,
            description,
            links: [],
          },
        },
      ]
    },
    layout: "morris-lecar",
    frame: "full-width",
    body: MorrisLecarBody,
  }
}
