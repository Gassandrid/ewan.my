import { h } from "preact"
import { pathToRoot } from "@quartz-community/utils"
import { DATA_PATH } from "./index.js"

// The toolbar's timeline: a button beside dark mode and search that drops the
// strip, turned upside down, from under the header rule. client.js builds it on
// first open.
export function TimelineToggle() {
  function Component({ fileData }) {
    return h(
      "div",
      { class: "nt-toolbar" },
      h(
        "button",
        {
          type: "button",
          class: "nt-toggle",
          "aria-label": "Timeline",
          "aria-expanded": "false",
          "aria-controls": "nt-drop",
        },
        h(
          "svg",
          { viewBox: "0 0 20 20", width: 20, height: 20, "aria-hidden": "true" },
          h("path", { d: "M3 4v7M7 4v12M11 4v5M15 4v9M19 4v3" }),
        ),
      ),
      h(
        "div",
        { class: "nt-drop", id: "nt-drop" },
        h(
          "div",
          { class: "nt-panel" },
          h("div", {
            class: "note-timeline",
            "data-src": `${pathToRoot(fileData.slug)}/${DATA_PATH}`,
            "data-dir": "down",
            "data-lazy": "",
          }),
        ),
      ),
    )
  }
  return Component
}
