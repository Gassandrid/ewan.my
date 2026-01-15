import { ComponentChildren, h } from "preact"
import { htmlToJsx } from "../../util/jsx"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { visit } from "unist-util-visit"
import { Root, Element, Text } from "hast"
import { evaluateFilter, resolvePropertyValue } from "../../util/base/query"
import { QuartzPluginData } from "../../plugins/vfile"
import { BaseFile, SortDefinition } from "../../util/base/types"

// Simple sorting function for inline bases
function applySorting(
  files: QuartzPluginData[],
  sortDefs: SortDefinition[] | undefined,
  allFiles: QuartzPluginData[],
): QuartzPluginData[] {
  if (!sortDefs || sortDefs.length === 0) {
    return files
  }

  return [...files].sort((a, b) => {
    for (const sortDef of sortDefs) {
      const aVal = resolvePropertyValue(a, sortDef.property, allFiles)
      const bVal = resolvePropertyValue(b, sortDef.property, allFiles)

      const aNum = typeof aVal === "number" ? aVal : aVal instanceof Date ? aVal.getTime() : 0
      const bNum = typeof bVal === "number" ? bVal : bVal instanceof Date ? bVal.getTime() : 0

      const diff = sortDef.direction === "ASC" ? aNum - bNum : bNum - aNum
      if (diff !== 0) return diff
    }
    return 0
  })
}

function buildInlineBaseTable(
  config: BaseFile,
  allFiles: QuartzPluginData[],
): Element {
  const view = config.views[0] // Use first view for inline bases
  if (!view) {
    return {
      type: "element",
      tagName: "div",
      properties: { className: ["inline-base-error"] },
      children: [{ type: "text", value: "No views defined" }],
    }
  }

  const matchedFiles = config.filters ? evaluateFilter(config.filters, allFiles) : allFiles
  const sortedFiles = applySorting(matchedFiles, view.sort || [], allFiles)
  const limitedFiles = view.limit ? sortedFiles.slice(0, view.limit) : sortedFiles

  if (view.type === "table") {
    const headers = view.order || ["title"]
    const rows = limitedFiles.map((file) => {
      const cells = headers.map((prop) => {
        let value: any

        // Resolve property value
        if (prop === "title" || prop === "file.title") {
          value = file.frontmatter?.title || file.slug?.split("/").pop() || ""
        } else if (prop === "date" || prop === "file.ctime") {
          value = file.dates?.created
            ? new Date(file.dates.created).toLocaleDateString()
            : ""
        } else if (prop === "updated" || prop === "file.mtime") {
          value = file.dates?.modified
            ? new Date(file.dates.modified).toLocaleDateString()
            : ""
        } else if (prop.startsWith("file.")) {
          const key = prop.replace("file.", "")
          value = (file as any)[key] || ""
        } else {
          value = file.frontmatter?.[prop] || ""
        }

        // Convert arrays to comma-separated strings
        if (Array.isArray(value)) {
          value = value.join(", ")
        }

        return {
          type: "element" as const,
          tagName: "td",
          properties: {},
          children: [{ type: "text" as const, value: String(value) }],
        }
      })

      // Add link to file in first cell
      if (file.slug && cells[0]) {
        cells[0] = {
          type: "element",
          tagName: "td",
          properties: {},
          children: [
            {
              type: "element",
              tagName: "a",
              properties: { className: ["internal"], href: `/${file.slug}` },
              children: cells[0].children,
            },
          ],
        }
      }

      return {
        type: "element" as const,
        tagName: "tr",
        properties: {},
        children: cells,
      }
    })

    return {
      type: "element",
      tagName: "div",
      properties: { className: ["table-container"] },
      children: [
        {
          type: "element",
          tagName: "table",
          properties: { className: ["base-table", "inline-base-table"] },
          children: [
            {
              type: "element",
              tagName: "thead",
              properties: {},
              children: [
                {
                  type: "element",
                  tagName: "tr",
                  properties: {},
                  children: headers.map((header) => ({
                    type: "element" as const,
                    tagName: "th",
                    properties: {},
                    children: [{ type: "text" as const, value: header }],
                  })),
                },
              ],
            },
            {
              type: "element",
              tagName: "tbody",
              properties: {},
              children: rows,
            },
          ],
        },
      ],
    }
  } else if (view.type === "list") {
    const items = limitedFiles.map((file) => {
      const title = file.frontmatter?.title || file.slug?.split("/").pop() || ""
      return {
        type: "element" as const,
        tagName: "li",
        properties: {},
        children: [
          {
            type: "element" as const,
            tagName: "a",
            properties: { className: ["internal"], href: `/${file.slug}` },
            children: [{ type: "text" as const, value: title }],
          },
        ],
      }
    })

    return {
      type: "element",
      tagName: "ul",
      properties: { className: ["base-list"] },
      children: items,
    }
  }

  return {
    type: "element",
    tagName: "div",
    properties: { className: ["inline-base-error"] },
    children: [{ type: "text", value: `Unsupported view type: ${view.type}` }],
  }
}

const Content: QuartzComponent = ({ fileData, tree, allFiles }: QuartzComponentProps) => {
  // Process inline bases if present
  if (fileData.inlineBases && allFiles) {
    const inlineBasesMap = new Map(fileData.inlineBases.map((b) => [b.id, b.config]))

    visit(tree, "element", (node: Element) => {
      if (
        node.tagName === "div" &&
        Array.isArray(node.properties?.className) &&
        node.properties.className.includes("inline-base-placeholder")
      ) {
        const baseId = node.properties["dataBaseId"] as string
        const config = inlineBasesMap.get(baseId)

        if (config) {
          try {
            const renderedTable = buildInlineBaseTable(config, allFiles)
            // Replace the placeholder with the rendered table
            node.tagName = renderedTable.tagName
            node.properties = renderedTable.properties
            node.children = renderedTable.children
          } catch (error) {
            console.error(`Error rendering inline base ${baseId}:`, error)
            node.children = [{ type: "text", value: `Error rendering base: ${error}` }]
          }
        }
      }
    })
  }

  const content = htmlToJsx(fileData.filePath!, tree) as ComponentChildren
  const classes: string[] = fileData.frontmatter?.cssclasses ?? []
  const classString = ["popover-hint", ...classes].join(" ")
  return <article class={classString}>{content}</article>
}

export default (() => Content) satisfies QuartzComponentConstructor
