import { debounce } from "./util"

// viewport calculation constants
const SIDENOTE_WIDTH = 17 // rem
const SPACING = 1 // rem
const GAP = 1 // rem
const MIN_DESKTOP_WIDTH = 1400 // px - minimum width for side-by-side sidenotes

// convert rem to pixels
function remToPx(rem: number): number {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize)
}

// get actual content width from DOM
function getContentWidth(): number {
  const article = document.querySelector(".page-content > article")
  if (!article) return remToPx(35) // fallback
  return article.getBoundingClientRect().width
}

// calculate viewport thresholds
function getViewportThresholds() {
  const contentWidth = getContentWidth()
  const sidenoteWidth = remToPx(SIDENOTE_WIDTH)
  const spacing = remToPx(SPACING)

  return {
    ultraWide: contentWidth + 2 * (sidenoteWidth + 4 * spacing), // $sidenote-offset-right + $sidenote-offset-left
    medium: contentWidth + sidenoteWidth + 4 * spacing,
  }
}

type LayoutMode = "double-sided" | "single-sided" | "inline"

function getLayoutMode(): LayoutMode {
  const windowWidth = window.innerWidth

  // enforce minimum desktop width for any side-by-side layout
  if (windowWidth < MIN_DESKTOP_WIDTH) {
    return "inline"
  }

  const thresholds = getViewportThresholds()

  if (windowWidth > thresholds.ultraWide) {
    return "double-sided"
  } else if (windowWidth > thresholds.medium) {
    return "single-sided"
  } else {
    return "inline"
  }
}

interface SidenoteState {
  span: HTMLElement
  label: HTMLElement
  content: HTMLElement
  side?: "left" | "right"
  clickHandler?: (e: MouseEvent) => void
  keyHandler?: (e: KeyboardEvent) => void
}

class SidenoteManager {
  private sidenotes: SidenoteState[] = []
  private lastBottomLeft = 0
  private lastBottomRight = 0
  private layoutMode: LayoutMode = "inline"

  constructor() {
    this.initialize()
  }

  private cleanupHandlers(state: SidenoteState) {
    if (state.clickHandler) {
      state.label.removeEventListener("click", state.clickHandler, { capture: true } as any)
      state.clickHandler = undefined
    }
    if (state.keyHandler) {
      state.label.removeEventListener("keydown", state.keyHandler)
      state.keyHandler = undefined
    }
  }

  private setActiveState(state: SidenoteState, active: boolean) {
    state.span.classList.toggle("active", active)
    state.label.classList.toggle("active", active)
  }

  private setExpandedState(state: SidenoteState, expanded: boolean) {
    const { label, content } = state
    label.setAttribute("aria-expanded", expanded.toString())
    content.style.display = expanded ? "block" : "none"
    content.setAttribute("aria-hidden", (!expanded).toString())
    this.setActiveState(state, expanded)
  }

  private measureContentHeight(content: HTMLElement): number {
    // temporarily display offscreen to measure
    const originalDisplay = content.style.display
    const originalVisibility = content.style.visibility
    const originalPosition = content.style.position
    const originalLeft = content.style.left

    content.style.display = "block"
    content.style.visibility = "hidden"
    content.style.position = "absolute"
    content.style.left = "-9999px"

    const height = content.getBoundingClientRect().height

    // restore
    content.style.display = originalDisplay
    content.style.visibility = originalVisibility
    content.style.position = originalPosition
    content.style.left = originalLeft

    return height
  }

  private initialize() {
    const sidenoteSpans = document.querySelectorAll<HTMLSpanElement>(".sidenote")

    sidenoteSpans.forEach((span) => {
      const label = span.querySelector<HTMLSpanElement>(".sidenote-label")
      if (!label) return

      const content = span.nextElementSibling as HTMLElement | null
      if (!content || !content.classList.contains("sidenote-content")) return

      content.style.display = "none"
      content.setAttribute("aria-hidden", "true")

      if (!label.hasAttribute("aria-controls") && content.id) {
        label.setAttribute("aria-controls", content.id)
      }

      this.sidenotes.push({ span, label, content })
    })
  }

  private reset() {
    this.lastBottomLeft = 0
    this.lastBottomRight = 0

    this.sidenotes.forEach((state) => {
      const { label, content } = state

      this.cleanupHandlers(state)

      label.removeAttribute("role")
      label.removeAttribute("tabindex")
      label.removeAttribute("aria-expanded")
      label.removeAttribute("aria-haspopup")
      label.removeAttribute("data-inline")
      label.style.cursor = ""
      label.style.userSelect = ""

      this.setActiveState(state, false)

      content.style.display = "none"
      content.style.position = ""
      content.style.left = ""
      content.style.right = ""
      content.classList.remove("sidenote-left", "sidenote-right", "sidenote-inline")
      content.setAttribute("aria-hidden", "true")
    })
  }

  private positionSideToSide(state: SidenoteState): boolean {
    const { span, label, content } = state
    const labelRect = label.getBoundingClientRect()
    const contentHeight = this.measureContentHeight(content)
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const topPosition = labelRect.top + scrollTop

    const footer = document.querySelector("footer")
    const footerTop = footer ? footer.getBoundingClientRect().top + scrollTop : Infinity
    if (topPosition + contentHeight > footerTop) return false

    const wouldOverlapSidepanel = !!document.querySelector(".sidepanel-container.active")

    const allowLeft = span.getAttribute("data-allow-left") !== "false"
    const gap = remToPx(GAP)
    const leftSpace = topPosition - this.lastBottomLeft
    const rightSpace = topPosition - this.lastBottomRight

    let side: "left" | "right"
    if (allowLeft && leftSpace >= contentHeight + gap) {
      side = "left"
    } else if (!wouldOverlapSidepanel && rightSpace >= contentHeight + gap) {
      side = "right"
    } else {
      return false
    }

    content.classList.add(`sidenote-${side}`)
    content.style.display = "block"
    content.setAttribute("aria-hidden", "false")

    // check if this sidenote is inside collapse-shell
    const isInCollapseShell = !!content.closest(".collapse-shell")

    if (!isInCollapseShell) {
      // position relative to article bounds with 1rem spacing
      const article = document.querySelector(".page-content > article") as HTMLElement
      if (article) {
        const spacing = remToPx(1) // 1rem spacing
        const sidenoteWidth = remToPx(SIDENOTE_WIDTH)

        // get article position
        const articleRect = article.getBoundingClientRect()
        const offsetParent = content.offsetParent as HTMLElement
        const parentRect = offsetParent
          ? offsetParent.getBoundingClientRect()
          : { left: 0, right: 0 }

        if (side === "left") {
          // position to the left of article's left edge with 1rem gap
          const leftPosition = articleRect.left - parentRect.left - sidenoteWidth - 1.5 * spacing
          content.style.left = `${leftPosition}px`
        } else {
          // position to the right of article's right edge with 1rem gap
          const rightPosition = parentRect.right - articleRect.right - sidenoteWidth - spacing
          content.style.right = `${rightPosition}px`
        }
      }
    }

    const bottomPosition = topPosition + contentHeight
    if (side === "left") this.lastBottomLeft = bottomPosition
    else this.lastBottomRight = bottomPosition

    state.side = side
    return true
  }

  private positionInline(state: SidenoteState) {
    const { label, content } = state

    this.cleanupHandlers(state)

    content.classList.add("sidenote-inline")
    content.style.display = "none"
    content.style.position = "static"

    label.style.cursor = "pointer"
    label.style.userSelect = "none"
    label.setAttribute("role", "button")
    label.setAttribute("tabindex", "0")
    label.setAttribute("aria-haspopup", "true")
    label.setAttribute("data-inline", "")

    const toggle = () => {
      const isExpanded = label.getAttribute("aria-expanded") === "true"
      this.setExpandedState(state, !isExpanded)
    }

    const onClick = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()
      toggle()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        e.stopPropagation()
        toggle()
      }
    }

    state.clickHandler = onClick
    state.keyHandler = onKeyDown

    label.addEventListener("click", onClick, { capture: true })
    label.addEventListener("keydown", onKeyDown)

    // always start collapsed
    this.setExpandedState(state, false)
  }

  public layout() {
    this.layoutMode = getLayoutMode()
    this.reset()

    this.sidenotes.forEach((state) => {
      const forceInline = state.span.getAttribute("data-force-inline") === "true"

      if (this.layoutMode === "inline" || forceInline) {
        this.positionInline(state)
      } else {
        const success = this.positionSideToSide(state)
        if (!success) {
          this.positionInline(state)
        }
      }
    })
  }
}

function setupSidenotes() {
  const manager = new SidenoteManager()
  manager.layout()

  const debouncedLayout = debounce(() => manager.layout(), 100)

  window.addEventListener("resize", debouncedLayout, { passive: true })

  // watch for sidepanel state changes
  const sidepanel = document.querySelector(".sidepanel-container")
  let observer: MutationObserver | null = null

  if (sidepanel) {
    observer = new MutationObserver(() => debouncedLayout())
    observer.observe(sidepanel, {
      attributes: true,
      attributeFilter: ["class"],
    })
  }

  window.addCleanup(() => {
    window.removeEventListener("resize", debouncedLayout)
    if (observer) {
      observer.disconnect()
    }
  })
}

document.addEventListener("nav", setupSidenotes)
document.addEventListener("content-decrypted", setupSidenotes)
