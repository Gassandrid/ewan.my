import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/search.scss"
// @ts-ignore
import script from "./scripts/base-search.inline"
import { classNames } from "../util/lang"

function BaseSearchBar({ displayClass, fileData }: QuartzComponentProps) {
  if (!fileData.bases) {
    return null
  }
  return (
    <div class={classNames(displayClass, "search", "bases-search")}>
      <div id="base-search-bar">
        <input
          type="text"
          id="base-search-input"
          placeholder="Search this base"
          aria-label="Search this base"
          autocomplete="off"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="search-icon"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <div class="search-shortcut">⌘K</div>
      </div>
    </div>
  )
}

BaseSearchBar.css = style
BaseSearchBar.afterDOMLoaded = script

export default (() => BaseSearchBar) satisfies QuartzComponentConstructor
