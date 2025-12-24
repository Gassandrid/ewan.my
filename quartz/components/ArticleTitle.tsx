import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

export interface Options {
  enableDescription: boolean
}

const defaultOptions: Options = {
  enableDescription: true,
}

export default ((userOpts?: Options) => {
  const opts = { ...defaultOptions, ...userOpts }

  const ArticleTitle: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    const title = fileData.frontmatter?.title
    const description = fileData.frontmatter?.description

    if (title) {
      return (
        <hgroup class={classNames(displayClass, "article-title-group")}>
          <h1 class="article-title">{title}</h1>
          {opts.enableDescription && description && (
            <p class="article-description">{description}</p>
          )}
        </hgroup>
      )
    } else {
      return null
    }
  }

  ArticleTitle.css = `
  .article-title-group {
    margin: 2rem 0 0 0;
  }

  .article-title {
    margin: 0 0 0.5rem 0;
  }

  .article-description {
    margin: 0;
    color: var(--gray);
    font-size: 1rem;
    line-height: 1.5;
  }
  `

  return ArticleTitle
}) satisfies QuartzComponentConstructor<Options>
