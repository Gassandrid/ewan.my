import { QuartzTransformerPlugin } from "../types"
import { Root as MdastRoot } from "mdast"
import { Element as HastElement, Text as HastText, ElementContent, Root as HastRoot } from "hast"
import { visit } from "unist-util-visit"
import { h } from "hastscript"
import { BuildCtx } from "../../util/ctx"
import { FullSlug, transformLink } from "../../util/path"
import { VFile } from "vfile"
import path from "path"
import isAbsoluteUrl from "is-absolute-url"
import { parseWikilink, resolveWikilinkTarget, createWikilinkRegex } from "../../util/wikilinks"
// @ts-ignore
import script from "../../components/scripts/sidenotes.inline"
import content from "../../components/styles/sidenotes.inline.scss"
import type { Sidenote } from "../../extensions/micromark-extension-ofm-sidenotes"

export const Sidenotes: QuartzTransformerPlugin = () => {
  return {
    name: "Sidenotes",
    externalResources() {
      return {
        js: [{ script, contentType: "inline", loadTime: "afterDOMReady" }],
        css: [{ content, spaPreserve: true, inline: true }],
      }
    },
    markdownPlugins() {
      return [
        () => (tree: MdastRoot, file: VFile) => {
          let counter = 0

          visit(tree, "sidenote", (node: Sidenote, index, parent) => {
            if (index === undefined || !parent) return

            const parsed = node.data?.sidenoteParsed
            if (!parsed) return

            const sidenoteId = ++counter
            const baseId = buildSidenoteDomId(file, sidenoteId)

            // Extract property flags (HAST doesn't support nested objects)
            const props = parsed.properties || {}
            const forceInline = props.dropdown === "true" || props.inline === "true"
            const allowLeft = props.left !== "false"
            const allowRight = props.right !== "false"

            // Store metadata on node for HTML plugin to use
            if (!node.data) node.data = {}
            node.data.sidenoteId = sidenoteId
            node.data.baseId = baseId
            node.data.forceInline = forceInline
            node.data.allowLeft = allowLeft
            node.data.allowRight = allowRight
            node.data.label = parsed.label || ""
            node.data.internal = props.internal
          })
        },
      ]
    },
    htmlPlugins(ctx) {
      return [
        () => {
          return (tree: HastRoot, file: VFile) => {
            visit(tree, (node: any, index, parent) => {
              // Look for sidenote placeholder elements
              if (node.type === "element" && node.properties?.dataType === "sidenote") {
                if (index === undefined || !parent) return

                const sidenoteId = node.properties.sidenoteId
                const baseId = node.properties.baseId
                const forceInline = node.properties.forceInline === true
                const allowLeft = node.properties.allowLeft !== false
                const allowRight = node.properties.allowRight !== false
                const label = node.properties.label || ""
                const internalLinks = node.properties.internal as string[] | undefined

                const internal = renderInternalLinks(internalLinks, file, ctx)

                // Get children - they should already be HAST nodes from remarkRehype
                const children = Array.isArray(node.children) ? node.children : []
                const combinedContent = [...children, ...internal]

                const labelText = deriveLabel(label)

                const hastNodes = buildSidenoteHast(
                  labelText,
                  forceInline,
                  allowLeft,
                  allowRight,
                  combinedContent,
                  sidenoteId,
                  baseId,
                )

                // Replace the sidenote node with our HAST nodes
                parent.children.splice(index, 1, ...hastNodes)
                return index
              }
            })
          }
        },
      ]
    },
  }
}

function renderInternalLinks(
  wikilinks: string[] | undefined,
  file: VFile,
  ctx: BuildCtx,
): ElementContent[] {
  if (!wikilinks || wikilinks.length === 0) return []

  const links: HastElement[] = []
  const regex = createWikilinkRegex()

  for (const wl of wikilinks) {
    let match: RegExpExecArray | null
    while ((match = regex.exec(wl)) !== null) {
      const parsed = parseWikilink(match[0])
      if (!parsed) continue

      const resolved = resolveWikilinkTarget(parsed, file.data.slug as FullSlug)
      const anchor = parsed.anchor ?? ""
      let destination = parsed.target + anchor
      let dataSlug: string | undefined

      if (resolved) {
        dataSlug = resolved.slug
        const destWithAnchor = `${resolved.slug}${anchor}`
        destination = transformLink(file.data.slug as FullSlug, destWithAnchor, {
          allSlugs: ctx.allSlugs,
          strategy: "absolute",
        })
      } else if (!isAbsoluteUrl(destination, { httpOnly: false })) {
        destination = transformLink(file.data.slug as FullSlug, destination, {
          allSlugs: ctx.allSlugs,
          strategy: "absolute",
        })
      }

      const display =
        parsed.alias ||
        path.basename(parsed.target, path.extname(parsed.target)) ||
        parsed.target ||
        "link"

      const link = h(
        "a",
        {
          href: destination,
          className: ["internal"],
          ...(dataSlug ? { "data-slug": dataSlug } : {}),
        },
        [h("span.indicator-hook"), display],
      )

      links.push(link)
    }
  }

  if (links.length === 0) return []

  const separator = h("span.sidenote-separator", {
    className: "sidenote-separator",
    role: "presentation",
  })

  const interleaved: ElementContent[] = []
  links.forEach((link, idx) => {
    if (idx > 0) {
      interleaved.push({ type: "text", value: ", " } as HastText)
    }
    interleaved.push(link)
  })

  const container = h("span.sidenote-linked-notes", ["linked notes: ", ...interleaved])

  return [separator, container]
}

function deriveLabel(rawLabel: string): string {
  let labelText = rawLabel.trim()
  if (!labelText) return ""

  const wikilinkMatch = /\[\[([^\]]+)\]\]/.exec(labelText)
  if (wikilinkMatch) {
    const parsed = parseWikilink(wikilinkMatch[0])
    if (parsed) {
      labelText =
        parsed.alias || path.basename(parsed.target, path.extname(parsed.target)) || parsed.target
    }
  }

  return labelText
}

function buildSidenoteHast(
  labelText: string,
  forceInline: boolean,
  allowLeft: boolean,
  allowRight: boolean,
  combinedContent: ElementContent[],
  sidenoteId: number,
  baseId: string,
): HastElement[] {
  const arrowDownSvg = h(
    "svg.sidenote-arrow.sidenote-arrow-down",
    {
      width: "8",
      height: "5",
      viewBox: "0 0 8 5",
      xmlns: "http://www.w3.org/2000/svg",
      "aria-hidden": "true",
    },
    [
      h("path", {
        d: "M0 0L8 0L4 5Z",
        fill: "currentColor",
      }),
    ],
  )

  const hasLabel = labelText.length > 0

  const labelProps: Record<string, string> = {
    id: `${baseId}-label`,
    "aria-controls": `${baseId}-content`,
  }

  const labelElement = h(
    "span.sidenote-label",
    hasLabel ? labelProps : { ...labelProps, "data-auto": "" },
    hasLabel
      ? [{ type: "text", value: labelText } as HastText, arrowDownSvg]
      : [{ type: "text", value: "▪" } as HastText, arrowDownSvg],
  )

  const dataAttrs: Record<string, string> = {
    id: baseId,
    "data-sidenote-id": String(sidenoteId),
  }

  if (forceInline) {
    dataAttrs["data-force-inline"] = "true"
  }
  if (!allowLeft) {
    dataAttrs["data-allow-left"] = "false"
  }
  if (!allowRight) {
    dataAttrs["data-allow-right"] = "false"
  }

  const sidenoteElement = h("span.sidenote", dataAttrs, [labelElement])

  const contentProps: Record<string, string> = {
    id: `${baseId}-content`,
    "data-sidenote-id": String(sidenoteId),
    "data-sidenote-for": baseId,
    "aria-hidden": "true",
  }

  const contentChildren =
    combinedContent.length > 0
      ? combinedContent
      : ([{ type: "text", value: "" }] as ElementContent[])

  const contentElement = h("span.sidenote-content", contentProps, contentChildren)

  return [sidenoteElement, contentElement]
}

function buildSidenoteDomId(file: VFile, sidenoteId: number): string {
  const rawSlug = (file.data.slug as string | undefined) ?? "note"
  const sanitized = rawSlug.replace(/[^A-Za-z0-9_-]/g, "-")
  return `sidenote-${sanitized}-${sidenoteId}`
}
