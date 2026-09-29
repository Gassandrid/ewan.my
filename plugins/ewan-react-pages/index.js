import { h } from "preact"

// Only this small dispatcher is shared. React and each page's code load on demand.
export const RUNTIME = `
(() => {
  let generation = 0, dispose;
  function cleanup() { generation++; dispose?.(); dispose = undefined; }
  async function mount() {
    cleanup();
    const ticket = generation;
    const root = document.querySelector('.center > article > .markdown-rendered > [data-page-module]');
    if (!root) return;
    // Quartz highlights search hits by replacing text nodes. Preserve React's DOM
    // ownership and scroll to its matching content without rewriting those nodes.
    const searchTerm = sessionStorage.getItem('search-term');
    if (searchTerm) sessionStorage.removeItem('search-term');
    try {
      const module = await import(root.dataset.pageModule);
      if (ticket !== generation || !root.isConnected) return;
      dispose = module.mount(root, JSON.parse(root.dataset.pageProps));
      if (searchTerm) {
        const match = [...root.querySelectorAll('h2,h3,h4,h5,h6,p,li,td,th')]
          .find(element => element.textContent.toLowerCase().includes(searchTerm.toLowerCase()));
        match?.scrollIntoView({ block: 'center' });
      }
    } catch (error) {
      if (ticket !== generation || !root.isConnected) return;
      console.error('[React page]', error);
      const notice = document.createElement('p');
      notice.setAttribute('role', 'alert');
      notice.textContent = 'Interactive controls could not load. The page content remains available; reload to retry.';
      root.after(notice);
    }
  }
  document.addEventListener('prenav', cleanup);
  document.addEventListener('nav', mount);
})();`

export default function ReactPages() {
  return {
    name: "ReactPages",
    priority: 100,
    match: ({ fileData }) => !!fileData.reactPage,
    layout: "content",
    body() {
      function Body({ fileData }) {
        const page = fileData.reactPage
        return h(
          "article",
          { class: ["popover-hint", ...(fileData.frontmatter?.cssclasses ?? [])].join(" ") },
          ...page.css.map((href) => h("link", { rel: "stylesheet", href })),
          h("div", {
            class: "markdown-preview-view markdown-rendered",
            dangerouslySetInnerHTML: { __html: page.html },
          }),
        )
      }
      Body.afterDOMLoaded = RUNTIME
      return Body
    },
  }
}
