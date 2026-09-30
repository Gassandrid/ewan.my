/** Preserve a notebook's static output without attaching live custom elements.
 * Even a hidden preview can upgrade registered marimo elements and take over
 * the islands runtime's single notebook session as soon as it enters the DOM.
 */
export function preparePopoverDocument(html: Document) {
  for (const notebook of html.querySelectorAll(".marimo-notebook-page")) {
    notebook.classList.replace("marimo-notebook-page", "marimo-notebook-preview")
    notebook.querySelectorAll("script, .marimo-loading").forEach((el) => el.remove())
    for (const element of [...notebook.querySelectorAll("*")].reverse()) {
      if (!element.localName.startsWith("marimo-")) continue
      const preview = html.createElement("div")
      preview.className = element.className
      preview.append(...element.childNodes)
      element.replaceWith(preview)
    }
  }
}
