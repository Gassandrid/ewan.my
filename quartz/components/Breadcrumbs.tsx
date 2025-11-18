import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import breadcrumbsStyle from "./styles/breadcrumbs.scss"
// @ts-ignore
import script from "./scripts/breadcrumbs.inline"
import { FullSlug, SimpleSlug, joinSegments, resolveRelative, simplifySlug } from "../util/path"
import { classNames } from "../util/lang"
import { trieFromAllFiles } from "../util/ctx"

type CrumbData = {
  displayName: string
  path: string
}

type BreadcrumbSegment =
  | {
      kind: "crumb"
      data: CrumbData
    }
  | {
      kind: "overflow"
      data: CrumbData[]
    }

interface BreadcrumbOptions {
  /**
   * Symbol between crumbs
   */
  spacerSymbol: string
  /**
   * Name of first crumb
   */
  rootName: string
  /**
   * Whether to look up frontmatter title for folders (could cause performance problems with big vaults)
   */
  resolveFrontmatterTitle: boolean
  /**
   * Whether to display the current page in the breadcrumbs.
   */
  showCurrentPage: boolean
  /**
   * Number of leading crumbs shown before overflow bucket
   */
  leadingWindow: number
  /**
   * Number of trailing crumbs shown after overflow bucket
   */
  trailingWindow: number
}

const defaultOptions: BreadcrumbOptions = {
  spacerSymbol: "❯",
  rootName: "Home",
  resolveFrontmatterTitle: true,
  showCurrentPage: true,
  leadingWindow: 2,
  trailingWindow: 2,
}

type BreadcrumbNodeDescriptor = {
  displayName: string
  slug: FullSlug
}

function formatCrumb(displayName: string, baseSlug: FullSlug, currentSlug: SimpleSlug): CrumbData {
  return {
    displayName: displayName.replaceAll("-", " "),
    path: resolveRelative(baseSlug, currentSlug),
  }
}

function nodeToDescriptor(node: { displayName: string; slug: FullSlug }): BreadcrumbNodeDescriptor {
  return {
    displayName: node.displayName,
    slug: node.slug,
  }
}

function buildFallbackDescriptors(
  trie: ReturnType<typeof trieFromAllFiles>,
  slugParts: string[],
  fileTitle?: string,
): BreadcrumbNodeDescriptor[] {
  const descriptors: BreadcrumbNodeDescriptor[] = [nodeToDescriptor(trie)]
  let current: ReturnType<typeof trieFromAllFiles> | undefined = trie
  const traversed: string[] = []

  slugParts.forEach((segment, idx) => {
    if (!segment) {
      return
    }

    traversed.push(segment)
    const child = current?.children.find((c) => c.slugSegment === segment)
    if (child) {
      descriptors.push(nodeToDescriptor(child))
      current = child
      return
    }

    const slug = joinSegments(...traversed) as FullSlug
    const isLast = idx === slugParts.length - 1
    descriptors.push({
      displayName: isLast ? (fileTitle ?? segment) : segment,
      slug,
    })
    current = undefined
  })

  return descriptors
}

export default ((opts?: Partial<BreadcrumbOptions>) => {
  const options: BreadcrumbOptions = { ...defaultOptions, ...opts }
  const Breadcrumbs: QuartzComponent = ({
    fileData,
    allFiles,
    displayClass,
    ctx,
  }: QuartzComponentProps) => {
    const trie = (ctx.trie ??= trieFromAllFiles(allFiles))
    const slugParts = fileData.slug!.split("/").filter((part) => part.length > 0)
    const pathNodes = trie.ancestryChain(slugParts)
    let nodeDescriptors: BreadcrumbNodeDescriptor[]
    if (pathNodes) {
      nodeDescriptors = pathNodes.map((node) => nodeToDescriptor(node))
    } else {
      nodeDescriptors = buildFallbackDescriptors(trie, slugParts, fileData.frontmatter?.title)
    }

    if (nodeDescriptors.length === 0) {
      return null
    }

    const crumbs: CrumbData[] = nodeDescriptors.map((node, idx) => {
      const crumb = formatCrumb(node.displayName, fileData.slug!, simplifySlug(node.slug))
      if (idx === 0) {
        crumb.displayName = options.rootName
      }

      // For last node (current page), set empty path
      if (idx === nodeDescriptors.length - 1) {
        crumb.path = ""
      }

      return crumb
    })

    if (!options.showCurrentPage) {
      crumbs.pop()
    }

    const leadingWindow = Math.max(0, options.leadingWindow)
    const trailingWindow = Math.max(0, options.trailingWindow)

    let segments: BreadcrumbSegment[]
    if (leadingWindow + trailingWindow > 0 && crumbs.length > leadingWindow + trailingWindow) {
      const leading = leadingWindow > 0 ? crumbs.slice(0, leadingWindow) : []
      const trailing = trailingWindow > 0 ? crumbs.slice(-trailingWindow) : []
      const overflow = crumbs.slice(leadingWindow, trailingWindow > 0 ? -trailingWindow : undefined)

      segments = []
      if (leading.length > 0) {
        segments.push(...leading.map((crumb) => ({ kind: "crumb" as const, data: crumb })))
      }
      if (overflow.length > 0) {
        segments.push({ kind: "overflow" as const, data: overflow })
      }
      if (trailing.length > 0) {
        segments.push(...trailing.map((crumb) => ({ kind: "crumb" as const, data: crumb })))
      }
    } else {
      segments = crumbs.map((crumb) => ({ kind: "crumb" as const, data: crumb }))
    }

    if (segments.length === 0) {
      segments = crumbs.map((crumb) => ({ kind: "crumb" as const, data: crumb }))
    }

    return (
      <nav class={classNames(displayClass, "breadcrumb-container")} aria-label="breadcrumbs">
        {segments.map((segment, segmentIndex) => {
          const showSpacer = segmentIndex !== segments.length - 1

          if (segment.kind === "crumb") {
            const crumb = segment.data
            const key = `${crumb.path}-${segmentIndex}`

            return (
              <div class="breadcrumb-element" key={key}>
                <a href={crumb.path} data-breadcrumbs>
                  {crumb.displayName}
                </a>
                {showSpacer && <p>{` ${options.spacerSymbol} `}</p>}
              </div>
            )
          }

          const overflowItems = segment.data

          if (overflowItems.length === 0) {
            return null
          }

          const overflowLabel = `Show ${overflowItems.length} more breadcrumbs`

          return (
            <div class="breadcrumb-element breadcrumb-overflow" key={`overflow-${segmentIndex}`}>
              <button
                type="button"
                class="breadcrumb-overflow-trigger"
                aria-label={overflowLabel}
                aria-expanded="false"
                aria-haspopup="true"
              >
                …
              </button>
              <div class="breadcrumb-overflow-menu" data-overflow-menu hidden>
                {overflowItems.map((crumb, overflowIndex) => (
                  <a
                    key={`${crumb.path}-${overflowIndex}`}
                    href={crumb.path}
                    data-breadcrumbs
                    role="menuitem"
                  >
                    {crumb.displayName}
                  </a>
                ))}
              </div>
              {showSpacer && <p>{` ${options.spacerSymbol} `}</p>}
            </div>
          )
        })}
      </nav>
    )
  }
  Breadcrumbs.css = breadcrumbsStyle
  Breadcrumbs.afterDOMLoaded = script

  return Breadcrumbs
}) satisfies QuartzComponentConstructor
