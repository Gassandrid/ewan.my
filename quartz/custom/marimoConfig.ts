// Keep this in sync with the locally installed marimo Python package that
// generates the island HTML. The custom element protocol is version-sensitive.
export const MARIMO_ISLANDS_VERSION = "0.23.8"

export const MARIMO_CDN_ORIGIN = "https://cdn.jsdelivr.net"

export function marimoIslandsJsUrl(version = MARIMO_ISLANDS_VERSION): string {
  return `${MARIMO_CDN_ORIGIN}/npm/@marimo-team/islands@${version}/dist/main.js`
}

export function marimoIslandsCssUrl(version = MARIMO_ISLANDS_VERSION): string {
  return `${MARIMO_CDN_ORIGIN}/npm/@marimo-team/islands@${version}/dist/style.css`
}
