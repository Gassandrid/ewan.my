import { h } from "preact"
import { readFileSync } from "node:fs"

// Only the dispatcher is global. The library is fetched on the homepage alone.
export const LOADER = `(() => {
  let generation = 0, dispose, restore;
  const cleanup = () => { generation++; dispose?.(); dispose = undefined; restore?.(); restore = undefined; };
  document.addEventListener('prenav', cleanup);
  document.addEventListener('nav', async () => {
    cleanup();
    const board = document.querySelector('.center > .page-footer > [data-ewan-presence]');
    if (!board) return;
    const home = document.createComment('homepage presence');
    board.before(home);
    const wide = matchMedia('(min-width: 1200px)');
    const place = () => {
      const graph = document.querySelector('#quartz-body > .sidebar.left .graph');
      if (wide.matches && graph) graph.after(board);
      else home.after(board);
    };
    place();
    wide.addEventListener('change', place);
    restore = () => { wide.removeEventListener('change', place); home.after(board); home.remove(); };
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
        "svg",
        { class: "presence-garden", viewBox: "0 0 240 64", fill: "none", "aria-hidden": "true" },
        h("path", {
          d: "M12 55C62 57 104 47 131 17M75 53C80 32 70 16 58 12C57 30 64 39 79 42M101 40C121 41 141 31 146 24C123 21 111 28 101 40M116 31C108 14 113 5 120 3C128 15 124 23 116 31M127 21C148 17 160 9 159 4C143 3 132 10 127 21M170 53C184 51 201 52 229 48",
        }),
        h("circle", { cx: 183, cy: 24, r: 3 }),
        h("path", { class: "presence-spark", d: "M204 6V18M198 12H210M32 34V42M28 38H36" }),
      ),
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
