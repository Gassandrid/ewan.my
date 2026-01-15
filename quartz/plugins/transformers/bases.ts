import { QuartzTransformerPlugin } from "../types"
import { Root } from "mdast"
import { visit } from "unist-util-visit"
import {
  parseFilter,
  parseViews,
  parseFormulas,
  BaseFile,
  PropertyConfig,
} from "../../util/base/types"
import yaml from "js-yaml"

const normalizeProperties = (raw: unknown): Record<string, PropertyConfig> | undefined => {
  if (!raw || typeof raw !== "object") {
    return undefined
  }

  const normalized: Record<string, PropertyConfig> = {}

  for (const [key, value] of Object.entries(raw)) {
    if (!value || typeof value !== "object") {
      continue
    }

    const propConfig = value as PropertyConfig
    normalized[key] = propConfig

    const withoutPrefix = key.replace(/^(?:note|file)\./, "")
    if (withoutPrefix !== key && !(withoutPrefix in normalized)) {
      normalized[withoutPrefix] = propConfig
    }

    const segments = withoutPrefix.split(".")
    const lastSegment = segments[segments.length - 1]
    if (lastSegment && !(lastSegment in normalized)) {
      normalized[lastSegment] = propConfig
    }
  }

  return Object.keys(normalized).length > 0 ? normalized : undefined
}

const parseBaseConfig = (yamlContent: string): BaseFile => {
  const parsed = yaml.load(yamlContent) as any
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Invalid base YAML format")
  }

  const properties = normalizeProperties(parsed.properties)

  return {
    filters: parsed.filters ? parseFilter(parsed.filters) : undefined,
    views: parseViews(parsed.views),
    properties,
    summaries: parsed.summaries,
    formulas: parseFormulas(parsed.formulas),
  }
}

export const ObsidianBases: QuartzTransformerPlugin = () => {
  return {
    name: "ObsidianBases",
    markdownPlugins() {
      return [
        () => {
          return async (tree: Root, file) => {
            // Handle .base files
            const isBaseFile = file.path?.endsWith(".base")

            if (isBaseFile) {
              file.data.bases = true

              try {
                const config = parseBaseConfig(String(file.value))
                file.data.basesConfig = config

                // Create empty tree - emitter will build the actual table
                tree.children = []

                // Add bases tag to frontmatter
                if (!file.data.frontmatter) {
                  file.data.frontmatter = {
                    title: file.path?.replace(".base", "").split("/").pop() || "",
                    pageLayout: "default" as const,
                    description: `bases renderer of ${file.data.slug}`,
                  }
                }
                const existingTags = (file.data.frontmatter.tags as string[]) || []
                file.data.frontmatter.tags = [...existingTags, "bases"]
              } catch (error) {
                console.error(`Error processing .base file ${file.path}:`, error)
                tree.children = []
              }
              return
            }

            // Handle inline base code blocks
            const inlineBases: Map<string, BaseFile> = new Map()
            let baseCounter = 0

            visit(tree, "code", (node: any, index, parent) => {
              if (node.lang === "base" && parent?.children && index !== undefined) {
                try {
                  const config = parseBaseConfig(node.value)
                  const id = `inline-base-${baseCounter++}`

                  inlineBases.set(id, config)

                  // Replace code block with a special marker node
                  // This will be processed by a remark plugin that has access to allFiles
                  parent.children[index] = {
                    type: "paragraph",
                    data: {
                      hName: "div",
                      hProperties: {
                        className: ["inline-base-placeholder"],
                        "data-base-id": id,
                      },
                    },
                    children: [],
                  }
                } catch (error) {
                  console.error(`Error processing inline base in ${file.path}:`, error)
                  // Replace with error message
                  parent.children[index] = {
                    type: "paragraph",
                    children: [
                      {
                        type: "text",
                        value: `Error parsing base: ${error}`,
                      },
                    ],
                  }
                }
              }
            })

            // Store inline bases config for later processing
            if (inlineBases.size > 0) {
              file.data.inlineBases = Array.from(inlineBases.entries()).map(([id, config]) => ({
                id,
                config,
              }))
            }
          }
        },
      ]
    },
  }
}

declare module "vfile" {
  interface DataMap {
    bases?: boolean
    basesConfig?: BaseFile
    inlineBases?: Array<{ id: string; config: BaseFile }>
  }
}
