import { computePosition, flip, inline, shift } from "@floating-ui/dom"
import { normalizeRelativeURLs } from "../../util/path"
import { fetchCanonical } from "./util"
import { preparePopoverDocument } from "./popover-content"

const p = new DOMParser()
let activeAnchor: HTMLAnchorElement | null = null
// A pointer sweeping across a list (the explorer, /rank, a margin) would
// otherwise fetch and parse one whole page per link it crosses.
const HOVER_INTENT_MS = 70
let hoverTimer = 0
const inflight = new Map<string, Promise<HTMLElement | null>>()

async function buildPopover(targetUrl: URL, popoverId: string): Promise<HTMLElement | null> {
  const response = await fetchCanonical(targetUrl).catch((err) => {
    console.error(err)
  })

  if (!response) return null
  const rawContentType = response.headers.get("Content-Type")
  if (!rawContentType) return null
  const [contentType] = rawContentType.split(";")
  const [contentTypeCategory, typeInfo] = contentType.split("/")

  const popoverElement = document.createElement("div")
  popoverElement.id = popoverId
  popoverElement.classList.add("popover")
  const popoverInner = document.createElement("div")
  popoverInner.classList.add("popover-inner")
  popoverInner.dataset.contentType = contentType ?? undefined
  popoverElement.appendChild(popoverInner)

  switch (contentTypeCategory) {
    case "image":
      const img = document.createElement("img")
      img.src = targetUrl.toString()
      img.alt = targetUrl.pathname

      popoverInner.appendChild(img)
      break
    case "application":
      switch (typeInfo) {
        case "pdf":
          const pdf = document.createElement("iframe")
          pdf.src = targetUrl.toString()
          popoverInner.appendChild(pdf)
          break
        default:
          break
      }
      break
    default:
      const contents = await response.text()
      const html = p.parseFromString(contents, "text/html")
      preparePopoverDocument(html)
      normalizeRelativeURLs(html, targetUrl)
      // prepend all IDs inside popovers to prevent duplicates
      html.querySelectorAll("[id]").forEach((el) => {
        const targetID = `popover-internal-${el.id}`
        el.id = targetID
      })
      const elts = [...html.getElementsByClassName("popover-hint")]
      if (elts.length === 0) return null

      elts.forEach((elt) => popoverInner.appendChild(elt))
  }

  return popoverElement
}

function loadPopover(link: HTMLAnchorElement, targetUrl: URL, popoverId: string) {
  let request = inflight.get(popoverId)
  if (!request) {
    request = buildPopover(targetUrl, popoverId)
      .then((popoverElement) => {
        if (!popoverElement) return null
        const existing = document.getElementById(popoverId)
        if (existing) return existing
        if (!link.isConnected) return null
        document.body.appendChild(popoverElement)
        return popoverElement
      })
      .finally(() => inflight.delete(popoverId))
    inflight.set(popoverId, request)
  }
  return request
}

function mouseEnterHandler(
  this: HTMLAnchorElement,
  { clientX, clientY }: { clientX: number; clientY: number },
) {
  const link = (activeAnchor = this)
  window.clearTimeout(hoverTimer)
  if (link.dataset.noPopover === "true") {
    return
  }

  async function setPosition(popoverElement: HTMLElement) {
    const { x, y } = await computePosition(link, popoverElement, {
      strategy: "fixed",
      middleware: [inline({ x: clientX, y: clientY }), shift(), flip()],
    })
    Object.assign(popoverElement.style, {
      transform: `translate(${x.toFixed()}px, ${y.toFixed()}px)`,
    })
  }

  function showPopover(popoverElement: HTMLElement) {
    clearActivePopover()
    activeAnchor = link
    popoverElement.classList.add("active-popover")
    setPosition(popoverElement as HTMLElement)

    if (hash !== "") {
      const inner = popoverElement.querySelector(".popover-inner") as HTMLElement | null
      if (inner) {
        const targetAnchor = `#popover-internal-${CSS.escape(hash.slice(1))}`
        const heading = inner.querySelector(targetAnchor) as HTMLElement | null
        if (heading) {
          // leave ~12px of buffer when scrolling to a heading
          inner.scroll({ top: heading.offsetTop - 12, behavior: "instant" })
        }
      }
    }
  }

  const targetUrl = new URL(link.href)
  const hash = decodeURIComponent(targetUrl.hash)
  targetUrl.hash = ""
  targetUrl.search = ""
  const popoverId = `popover-${link.pathname}`
  const prevPopoverElement = document.getElementById(popoverId)

  // dont refetch if there's already a popover
  if (prevPopoverElement) {
    showPopover(prevPopoverElement)
    return
  }

  hoverTimer = window.setTimeout(async () => {
    if (activeAnchor !== link) return
    const popoverElement = await loadPopover(link, targetUrl, popoverId)
    if (popoverElement && activeAnchor === link && link.isConnected) showPopover(popoverElement)
  }, HOVER_INTENT_MS)
}

function clearActivePopover() {
  activeAnchor = null
  window.clearTimeout(hoverTimer)
  const allPopoverElements = document.querySelectorAll(".popover.active-popover")
  allPopoverElements.forEach((popoverElement) => popoverElement.classList.remove("active-popover"))
}

function setupPopovers() {
  const links = [...document.querySelectorAll("a.internal")] as HTMLAnchorElement[]
  for (const link of links) {
    link.addEventListener("mouseenter", mouseEnterHandler)
    link.addEventListener("mouseleave", clearActivePopover)
    window.addCleanup(() => {
      link.removeEventListener("mouseenter", mouseEnterHandler)
      link.removeEventListener("mouseleave", clearActivePopover)
    })
  }
}

document.addEventListener("nav", setupPopovers)
document.addEventListener("render", setupPopovers)
document.addEventListener("prenav", clearActivePopover)
