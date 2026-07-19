export const LORA_STYLESHEET =
  "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap"

export default function EwanFonts() {
  return {
    name: "EwanFonts",
    markdownPlugins() {
      return []
    },
    externalResources() {
      return {
        css: [{ content: LORA_STYLESHEET }],
      }
    },
  }
}
