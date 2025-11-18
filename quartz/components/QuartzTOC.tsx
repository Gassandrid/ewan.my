import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/quartztoc.scss"
import { classNames } from "../util/lang"
// @ts-ignore
import script from "./scripts/quartztoc.inline"
import { fromHtmlIsomorphic } from "hast-util-from-html-isomorphic"
import { htmlToJsx } from "../util/jsx"

export default (() => {
    const QuartzTOC: QuartzComponent = ({
        fileData,
        displayClass,
    }: QuartzComponentProps) => {
        if (!fileData.toc) return null

        const convertFromText = (text: string) => {
            const tocAst = fromHtmlIsomorphic(text, { fragment: true })
            return htmlToJsx(fileData.filePath!, tocAst)
        }

        return (
            <div class={classNames(displayClass, "quartztoc")} id="quartztoc">
                <nav id="quartztoc-vertical">
                    {fileData.toc.map((entry, idx) => (
                        <button
                            key={entry.slug}
                            class={`depth-${entry.depth} toc-item`}
                            data-depth={entry.depth}
                            data-href={`#${entry.slug}`}
                            data-for={entry.slug}
                            tabIndex={-1}
                            type="button"
                            aria-label={`${entry.text}`}
                            title={`${entry.text}`}
                        >
                            <div class="fill" />
                            <div class="indicator">{convertFromText(entry.text)}</div>
                        </button>
                    ))}
                </nav>
            </div>
        )
    }

    QuartzTOC.css = style
    QuartzTOC.afterDOMLoaded = script
    return QuartzTOC
}) satisfies QuartzComponentConstructor
