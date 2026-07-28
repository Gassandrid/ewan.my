import { h } from "preact"

const CSS = `
.article-title-group { margin: 2rem 0 0 0; }
.article-title-group .article-title { margin: 0 0 0.5rem 0; }
.article-description { margin: 0; color: var(--gray); font-size: 1rem; line-height: 1.5; }
`

export function ArticleTitle(options = {}) {
  const { enableDescription = true } = options

  function Component({ fileData, displayClass }) {
    const title = fileData?.frontmatter?.title
    const description = fileData?.frontmatter?.description
    if (!title) return null

    return h(
      "hgroup",
      { class: [displayClass, "article-title-group"].filter(Boolean).join(" ") },
      h("h1", { class: "article-title" }, title),
      enableDescription && description
        ? h("p", { class: "article-description" }, description)
        : null,
    )
  }

  Component.displayName = "ArticleTitle"
  Component.css = CSS
  return Component
}
