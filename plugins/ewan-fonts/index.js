export const HEADING_STYLESHEET =
  "https://fonts.googleapis.com/css2?family=IM+Fell+DW+Pica:ital@0;1&family=IM+Fell+DW+Pica+SC&display=swap"

export default function EwanFonts() {
  return {
    name: "EwanFonts",
    markdownPlugins() {
      return []
    },
    externalResources() {
      return {
        css: [{ content: HEADING_STYLESHEET }],
      }
    },
  }
}
