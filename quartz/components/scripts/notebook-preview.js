/** Strip runtime elements while the fetched document is still inert. Once
 * inserted into the page, registered custom elements upgrade synchronously.
 * Search and hover previews must never join the active notebook's Python app.
 */
export function prepareNotebookPreviews(html) {
  for (const notebook of html.querySelectorAll(".marimo-notebook-page")) {
    notebook.classList.replace("marimo-notebook-page", "marimo-notebook-preview")
    notebook
      .querySelectorAll("script, .marimo-loading, marimo-cell-code, marimo-code-editor")
      .forEach((el) => el.remove())
    // The generator's first non-reactive island is its startup indicator.
    const initializer = notebook.querySelector("marimo-island")
    if (initializer?.dataset.reactive === "false") initializer.remove()
    for (const element of [...notebook.querySelectorAll("*")].reverse()) {
      if (!element.localName.startsWith("marimo-")) continue
      const preview = html.createElement("div")
      preview.className = element.className
      preview.append(...element.childNodes)
      element.replaceWith(preview)
    }
  }
}
