import { h } from "preact"
import { readFileSync } from "node:fs"

// Only the dispatcher is global. The library is fetched on the homepage alone.
export const LOADER = `(() => {
  let generation = 0, dispose;
  const cleanup = () => { generation++; dispose?.(); dispose = undefined; };
  document.addEventListener('prenav', cleanup);
  document.addEventListener('nav', async () => {
    cleanup();
    const board = document.querySelector('.center > .page-footer > [data-ewan-presence]');
    if (!board) return;
    const ticket = generation;
    try {
      const module = await import(new URL(board.dataset.module, document.baseURI).href);
      if (ticket === generation && board.isConnected) dispose = module.mount(board);
    } catch {
      if (ticket !== generation) return;
      board.dataset.state = 'offline';
      board.querySelector('[data-presence-status]').textContent = 'Shared space unavailable';
      board.querySelector('[data-arrivals]').textContent = 'The shared space could not load.';
      board.querySelector('[data-presence-toggle]').hidden = true;
    }
  });
})();`

export function Presence() {
  function Component({ fileData }) {
    if (fileData.slug !== "index") return null
    return h(
      "section",
      {
        class: "presence-board",
        "data-ewan-presence": "",
        "data-state": "connecting",
        "data-module": "./static/ewan-presence.js",
        "aria-label": "Shared homepage",
      },
      h(
        "header",
        { class: "presence-head" },
        h("span", { class: "presence-title" }, "Here in the garden"),
        h("span", { "data-presence-status": "", role: "status" }, "Connecting…"),
      ),
      h(
        "div",
        { class: "presence-columns" },
        h(
          "div",
          null,
          h("h2", null, "Arrivals"),
          h(
            "ul",
            { "data-arrivals": "" },
            h("li", { class: "presence-empty" }, "Waiting for the shared space…"),
          ),
        ),
        h(
          "div",
          null,
          h("h2", null, "Departures"),
          h(
            "ul",
            { "data-departures": "" },
            h("li", { class: "presence-empty" }, "None seen this visit."),
          ),
        ),
      ),
      h(
        "div",
        { class: "presence-foot" },
        h(
          "span",
          null,
          "Shared cursors · ",
          h(
            "a",
            { href: "https://playhtml.fun/", target: "_blank", rel: "noopener noreferrer" },
            "PlayHTML",
          ),
        ),
        h("button", { type: "button", "data-presence-toggle": "", disabled: true }, "Leave space"),
      ),
      h("noscript", null, "Enable JavaScript to join the shared space."),
    )
  }
  Component.css = readFileSync(new URL("./style.css", import.meta.url), "utf8")
  Component.afterDOMLoaded = LOADER
  return Component
}
