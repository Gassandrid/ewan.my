import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/quartztoc.scss"
import { classNames } from "../util/lang"
// @ts-ignore
import script from "./scripts/quartztoc.inline"
import { fromHtmlIsomorphic } from "hast-util-from-html-isomorphic"
import { htmlToJsx } from "../util/jsx"

export default (() => {
  const QuartzTOC: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
    if (!fileData.toc || fileData.toc.length === 0) return null

    const convertFromText = (text: string) => {
      const tocAst = fromHtmlIsomorphic(text, { fragment: true })
      return htmlToJsx(fileData.filePath!, tocAst)
    }

    const title = fileData.frontmatter?.title

    return (
      <div class={classNames(displayClass, "quartztoc")} id="quartztoc">
        <div class="quartztoc-track">
          <div class="quartztoc-rail-thumb" aria-hidden="true" />
          {title ? (
            <div class="toc-row toc-row-title" data-for="__top__">
              <div class="toc-dot" aria-hidden="true" />
              <a class="toc-link" href="#" data-for="__top__">
                <span class="toc-text">{title}</span>
              </a>
            </div>
          ) : null}
          {fileData.toc.map((entry) => (
            <div
              key={entry.slug}
              class={`toc-row toc-level-${entry.depth + 1}`}
              data-for={entry.slug}
            >
              <div class="toc-dot" aria-hidden="true" />
              <a class="toc-link" href={`#${entry.slug}`} data-for={entry.slug}>
                <span class="toc-text">{convertFromText(entry.text)}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    )
  }

  QuartzTOC.css = style
  QuartzTOC.afterDOMLoaded = script
  return QuartzTOC
}) satisfies QuartzComponentConstructor
