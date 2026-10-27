import { h } from "preact"
import { readFileSync } from "node:fs"

// Only the dispatcher is global. The library is fetched on the homepage alone.
export const LOADER = `(() => {
  let generation = 0, dispose;
  const cleanup = () => { generation++; dispose?.(); dispose = undefined; };
  document.addEventListener('prenav', cleanup);
  document.addEventListener('nav', async () => {
    cleanup();
    const strip = document.querySelector('.sticky-header-bar [data-ewan-presence]');
    if (!strip) return;
    const ticket = generation;
    try {
      const module = await import(new URL(strip.dataset.module, document.baseURI).href);
      if (ticket === generation && strip.isConnected) dispose = module.mount(strip);
    } catch {
      if (ticket === generation) strip.dataset.state = 'offline';
    }
  });
})();`

export function Presence() {
  function Component({ fileData }) {
    if (fileData.slug !== "index") return null
    return h("ul", {
      class: "presence-strip",
      "data-ewan-presence": "",
      "data-state": "connecting",
      "data-module": "./static/ewan-presence.js",
      "aria-label": "Visitors here",
    })
  }
  Component.css = readFileSync(new URL("./style.css", import.meta.url), "utf8")
  Component.afterDOMLoaded = LOADER
  return Component
}
