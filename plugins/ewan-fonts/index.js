import { h } from "preact"

export const HEADING_STYLESHEET =
  "https://fonts.googleapis.com/css2?family=IM+Fell+DW+Pica:ital@0;1&family=IM+Fell+DW+Pica+SC&display=swap"

// The body face every page sets its prose in (custom.scss declares it).
export const BODY_FONT = "/static/ewanfont/book.woff2"

export default function EwanFonts() {
  return {
    name: "EwanFonts",
    markdownPlugins() {
      return []
    },
    externalResources() {
      return {
        css: [{ content: HEADING_STYLESHEET }],
        // Fell's files are only discovered once Google's stylesheet has
        // loaded, and the body face once the site's has: open the font host's
        // connection and fetch the body face alongside the HTML instead.
        additionalHead: [
          h("link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" }),
          h("link", {
            rel: "preload",
            href: BODY_FONT,
            as: "font",
            type: "font/woff2",
            crossorigin: "",
          }),
        ],
      }
    },
  }
}
