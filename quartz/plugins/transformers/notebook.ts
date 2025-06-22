import { QuartzTransformerPlugin } from "../types"
import { Root } from "hast"
import { visit } from "unist-util-visit"
import { Element } from "hast"
import path from "path"
import fs from "fs/promises"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkBreaks from "remark-breaks"
import remarkFrontmatter from "remark-frontmatter"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import remarkRehype from "remark-rehype"
import remarkSmartypants from "remark-smartypants"
import rehypeStringify from "rehype-stringify"
import { fromHtml } from "hast-util-from-html"

interface Options {
  /** Cache directory for downloaded notebooks */
  cacheDir: string
  /** Whether to download notebooks from GitHub */
  downloadFromGitHub: boolean
  /** Timeout for notebook downloads in ms */
  downloadTimeout: number
}

const defaultOptions: Options = {
  cacheDir: "quartz/.quartz-cache/notebooks",
  downloadFromGitHub: true,
  downloadTimeout: 10000,
}

interface NotebookCell {
  cell_type: string
  source: string[]
  outputs?: any[]
  execution_count?: number | null
  metadata?: any
}

interface NotebookData {
  cells: NotebookCell[]
  metadata?: any
  nbformat?: number
  nbformat_minor?: number
}

export const NotebookEmbedding: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }

  // Ensure cache directory exists
  const ensureCacheDir = async () => {
    try {
      await fs.mkdir(opts.cacheDir, { recursive: true })
    } catch (error) {
      console.warn(`Failed to create cache directory: ${error}`)
    }
  }

  // Download notebook from GitHub raw URL
  const downloadNotebook = async (url: string): Promise<NotebookData | null> => {
    try {
      // Convert GitHub URL to raw URL if needed
      let rawUrl = url
      if (url.includes("github.com") && !url.includes("raw.githubusercontent.com")) {
        rawUrl = url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/")
      }

      const response = await fetch(rawUrl, {
        signal: AbortSignal.timeout(opts.downloadTimeout),
      })

      if (!response.ok) {
        console.warn(`Failed to download notebook from ${rawUrl}: ${response.status}`)
        return null
      }

      const text = await response.text()
      return JSON.parse(text) as NotebookData
    } catch (error) {
      console.warn(`Error downloading notebook from ${url}:`, error)
      return null
    }
  }

  // Cache notebook locally
  const cacheNotebook = async (url: string, data: NotebookData): Promise<void> => {
    try {
      const urlHash = Buffer.from(url).toString("base64").replace(/[/+=]/g, "_")
      const cachePath = path.join(opts.cacheDir, `${urlHash}.json`)
      await fs.writeFile(cachePath, JSON.stringify(data, null, 2))
    } catch (error) {
      console.warn(`Failed to cache notebook: ${error}`)
    }
  }

  // Load cached notebook
  const loadCachedNotebook = async (url: string): Promise<NotebookData | null> => {
    try {
      const urlHash = Buffer.from(url).toString("base64").replace(/[/+=]/g, "_")
      const cachePath = path.join(opts.cacheDir, `${urlHash}.json`)
      const data = await fs.readFile(cachePath, "utf-8")
      return JSON.parse(data) as NotebookData
    } catch (error) {
      return null
    }
  } // Convert notebook cell to HTML
  const cellToHtml = async (cell: NotebookCell, index: number): Promise<string> => {
    const cellId = `notebook-cell-${index}`
    let content = ""

    if (cell.cell_type === "markdown") {
      const source = Array.isArray(cell.source) ? cell.source.join("") : cell.source
      content = `<div class="notebook-markdown-cell">${await markdownToHtml(source)}</div>`
    } else if (cell.cell_type === "code") {
      const source = Array.isArray(cell.source) ? cell.source.join("") : cell.source
      const executionCount = cell.execution_count

      // Create execution count display
      const executionLabel =
        executionCount !== null && executionCount !== undefined
          ? `In [${executionCount}]:`
          : "In [ ]:"

      // Use normal code block styling with execution count
      const codeBlock = `
        <div class="notebook-code-input">
          <div class="notebook-execution-count">${executionLabel}</div>
          <div class="notebook-code-content">
            <pre><code class="language-python">${escapeHtml(source)}</code></pre>
          </div>
        </div>`

      let outputsHtml = ""
      if (cell.outputs && cell.outputs.length > 0) {
        // Add output execution count
        const outputLabel =
          executionCount !== null && executionCount !== undefined
            ? `Out[${executionCount}]:`
            : "Out[ ]:"

        outputsHtml = `<div class="notebook-outputs">
          <div class="notebook-output-label">${outputLabel}</div>
          <div class="notebook-output-content">`

        for (const output of cell.outputs) {
          outputsHtml += formatOutput(output)
        }
        outputsHtml += "</div></div>"
      }

      content = `${codeBlock}${outputsHtml}`
    }

    return `<div id="${cellId}" class="notebook-cell notebook-${cell.cell_type}-cell">${content}</div>`
  } // Simple markdown to HTML converter using remark
  const markdownToHtml = async (markdown: string): Promise<string> => {
    try {
      const processor = unified()
        .use(remarkParse)
        .use(remarkBreaks)
        .use(remarkFrontmatter)
        .use(remarkGfm)
        .use(remarkMath)
        .use(remarkSmartypants)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeStringify, { allowDangerousHtml: true })

      const result = await processor.process(markdown)
      return String(result.value)
    } catch (error) {
      console.warn("Error processing markdown with remark:", error)
      // Fallback to plain text wrapped in paragraph
      return `<p>${escapeHtml(markdown)}</p>`
    }
  }

  // Format notebook output
  const formatOutput = (output: any): string => {
    if (output.output_type === "stream") {
      const text = Array.isArray(output.text) ? output.text.join("") : output.text
      return `<div class="notebook-stream-output"><pre>${escapeHtml(text)}</pre></div>`
    } else if (output.output_type === "execute_result" || output.output_type === "display_data") {
      if (output.data) {
        let content = ""

        // Handle text/plain
        if (output.data["text/plain"]) {
          const text = Array.isArray(output.data["text/plain"])
            ? output.data["text/plain"].join("")
            : output.data["text/plain"]
          content += `<div class="notebook-text-output"><pre>${escapeHtml(text)}</pre></div>`
        }

        // Handle image/png
        if (output.data["image/png"]) {
          content += `<div class="notebook-image-output"><img src="data:image/png;base64,${output.data["image/png"]}" alt="Plot output" /></div>`
        }

        // Handle text/html
        if (output.data["text/html"]) {
          const html = Array.isArray(output.data["text/html"])
            ? output.data["text/html"].join("")
            : output.data["text/html"]
          content += `<div class="notebook-html-output">${html}</div>`
        }

        return content
      }
    } else if (output.output_type === "error") {
      const traceback = output.traceback ? output.traceback.join("\n") : ""
      return `<div class="notebook-error-output"><pre>${escapeHtml(traceback)}</pre></div>`
    }

    return ""
  }

  // Escape HTML
  const escapeHtml = (text: string): string => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
  } // Convert notebook to HTML
  const notebookToHtml = async (notebook: NotebookData, sourceUrl: string): Promise<string> => {
    const cellPromises = notebook.cells.map((cell, index) => cellToHtml(cell, index))
    const cells = (await Promise.all(cellPromises)).join("\n")

    // Extract notebook filename from URL
    const notebookName = sourceUrl.split("/").pop() || "notebook.ipynb"

    // Get favicon URL using our detection logic
    const faviconUrl = await getFaviconUrl(sourceUrl)
    const siteName = new URL(sourceUrl).hostname

    return `
      <div class="jupyter-notebook-embedded">
        <div class="notebook-header">
          <span class="notebook-title">Jupyter Notebook</span>
          <div class="notebook-source">
            <a href="${sourceUrl}" target="_blank" rel="noopener noreferrer" class="notebook-link">
              ${notebookName}
            </a>
            <img src="${faviconUrl}" alt="${siteName}" class="notebook-favicon" title="Source: ${siteName}">
          </div>
        </div>
        <div class="notebook-cells">
          ${cells}
        </div>
      </div>
      <style>
.jupyter-notebook-embedded {
  border: 2px solid var(--secondary);
  border-radius: 12px;
  margin: 1.5rem 0;
  background: var(--light);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  overflow: hidden;
}

.notebook-header {
  background: var(--secondary);
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--gray);
  font-weight: 700;
  color: var(--lightgray);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  max-height: 2.5rem;
}

.notebook-header::before {
  content: "📓";
  font-size: 1.2em;
}

.notebook-source {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 400;
  font-size: 0.9em;
}

.notebook-link {
  color: var(--lightgray);
  text-decoration: none;
  border-bottom: 1px dotted var(--lightgray);
  transition: all 0.2s ease;
}

.notebook-link:hover {
  border-bottom-style: solid;
  opacity: 0.8;
}

.notebook-favicon {
  width: 16px;
  height: 16px;
  opacity: 0.8;
}

.notebook-cells {
  padding: 0;
}

.notebook-cell {
  border-bottom: 1px solid var(--lightgray);
  padding: 0.75rem 1.5rem;
}

.notebook-cell:last-child {
  border-bottom: none;
}

.notebook-markdown-cell {
  background: var(--light);
  line-height: 1.6;
}

.notebook-markdown-cell h1,
.notebook-markdown-cell h2,
.notebook-markdown-cell h3,
.notebook-markdown-cell h4 {
  margin: 0.5rem 0;
  color: var(--dark);
}

.notebook-markdown-cell p {
  margin: 0.5rem 0;
}

.notebook-markdown-cell ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.notebook-code-input {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin: 0.25rem 0;
}

.notebook-execution-count {
  color: var(--secondary);
  font-family: monospace;
  font-size: 0.9em;
  font-weight: bold;
  min-width: 85px;
  padding-top: 0.75rem;
  user-select: none;
  flex-shrink: 0;
}

.notebook-code-content {
  flex: 1;
  min-width: 0;
}

.notebook-code-content pre {
  margin: 0;
  overflow-x: auto;
  overflow-y: hidden;
}

.notebook-outputs {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.notebook-output-label {
  color: var(--secondary);
  font-family: monospace;
  font-size: 0.9em;
  font-weight: bold;
  min-width: 85px;
  padding-top: 0.5rem;
  user-select: none;
  flex-shrink: 0;
}

.notebook-output-content {
  flex: 1;
  min-width: 0;
}

.notebook-text-output pre,
.notebook-stream-output pre {
  background: var(--lightgray);
  border: 1px solid var(--gray);
  border-radius: 6px;
  padding: 0.75rem;
  margin: 0;
  overflow-x: auto;
  overflow-y: hidden;
  font-size: 0.9em;
  color: var(--dark);
  white-space: pre-wrap;
  word-wrap: break-word;
}

.notebook-image-output {
  text-align: center;
  padding: 1rem;
  background: var(--lightgray);
  border: 1px solid var(--gray);
  border-radius: 6px;
  margin: 0.5rem 0;
}

.notebook-image-output img {
  max-width: 100%;
  height: auto;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.notebook-error-output pre {
  background: #fdf2f2;
  border: 1px solid #fca5a5;
  border-radius: 6px;
  padding: 1rem;
  margin: 0;
  color: #dc2626;
  font-size: 0.9em;
}

.notebook-link-unavailable {
  color: var(--gray) !important;
  text-decoration: line-through;
}

.notebook-link-unavailable::after {
  content: " (notebook unavailable)";
  font-size: 0.8em;
  color: var(--gray);
}

html[data-theme='dark'] .jupyter-notebook-embedded {
  background: var(--darkgray);
  border-color: var(--secondary);
}

html[data-theme='dark'] .notebook-header {
  background: var(--secondary);
  color: var(--light);
}

html[data-theme='dark'] .notebook-link {
  color: var(--light);
  border-bottom-color: var(--light);
}

html[data-theme='dark'] .notebook-execution-count,
html[data-theme='dark'] .notebook-output-label {
  color: var(--tertiary);
}

html[data-theme='dark'] .notebook-text-output pre,
html[data-theme='dark'] .notebook-stream-output pre {
  background: var(--darkgray);
  border-color: var(--gray);
  color: var(--light);
}

html[data-theme='dark'] .notebook-image-output {
  background: var(--darkgray);
  border-color: var(--gray);
}

html[data-theme='dark'] .notebook-markdown-cell {
  background: var(--darkgray);
  color: var(--light);
}

html[data-theme='dark'] .notebook-markdown-cell h1,
html[data-theme='dark'] .notebook-markdown-cell h2,
html[data-theme='dark'] .notebook-markdown-cell h3,
html[data-theme='dark'] .notebook-markdown-cell h4 {
  color: var(--light);
}

html[data-theme='dark'] .notebook-error-output pre {
  background: #2d1b1b;
  border-color: #991b1b;
  color: #fca5a5;
}
      </style>
    `
  }
  // Favicon detection and fetching
  const getFaviconUrl = async (sourceUrl: string): Promise<string> => {
    try {
      const url = new URL(sourceUrl)
      // Try to fetch the HTML and parse favicon links
      const response = await fetch(`${url.protocol}//${url.hostname}`, {
        signal: AbortSignal.timeout(5000),
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; Quartz-NotebookEmbedder/1.0)",
        },
      })

      if (response.ok) {
        const html = await response.text()
        const icons = parseFaviconLinks(html, url)

        if (icons.length > 0) {
          // Sort by size (largest first) and return the best one
          const bestIcon = getBestIcon(icons)
          return bestIcon
        }
      }
    } catch (error) {
      console.warn(`Failed to fetch favicon from HTML for ${sourceUrl}:`, error)
    }

    // Fallback to alternative sources
    const domain = new URL(sourceUrl).hostname
    const fallbackSources = [
      `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
      `https://icons.duckduckgo.com/ip3/${domain}.ico`,
      `${new URL(sourceUrl).protocol}//${domain}/favicon.ico`,
    ]

    for (const fallbackUrl of fallbackSources) {
      try {
        const response = await fetch(fallbackUrl, {
          signal: AbortSignal.timeout(3000),
          method: "HEAD", // Just check if it exists
        })
        if (response.ok) {
          return fallbackUrl
        }
      } catch (error) {
        // Continue to next fallback
      }
    }

    // Generate letter-based favicon as last resort
    return generateLetterFavicon(domain)
  }

  const parseFaviconLinks = (
    html: string,
    baseUrl: URL,
  ): Array<{ sizes: string; href: string }> => {
    const regex = /<link[^>]*rel=['"]?[^\s]*icon['"]?[^>]*?>/gi
    const matches = Array.from(html.matchAll(regex))
    const icons: Array<{ sizes: string; href: string }> = []

    matches.forEach((match) => {
      const linkTag = match[0]

      // Extract href value
      const hrefMatch = linkTag.match(/href=['"]?([^\s>'"]*)['"]?/i)
      const href = hrefMatch ? hrefMatch[1] : null

      // Extract sizes value
      const sizesMatch = linkTag.match(/sizes=['"]?([^\s>'"]*)['"]?/i)
      const sizes = sizesMatch ? sizesMatch[1] : "unknown"

      if (href) {
        // Convert relative URLs to absolute using helper
        const absoluteHref = toAbsoluteUrl(href, baseUrl)
        icons.push({ sizes, href: absoluteHref })
      }
    })

    return icons
  }

  // Helper to convert relative URLs to absolute
  const toAbsoluteUrl = (href: string, baseUrl: URL): string => {
    try {
      return new URL(href, baseUrl).toString()
    } catch {
      return href
    }
  }

  const getBestIcon = (icons: Array<{ sizes: string; href: string }>): string => {
    // Sort by priority: known sizes first, then unknown
    const sizeMap = new Map<string, number>()

    icons.forEach((icon) => {
      if (icon.sizes === "unknown") {
        sizeMap.set(icon.href, 16) // Default size
      } else {
        // Parse sizes like "32x32" or "16x16 32x32"
        const sizeStr = icon.sizes.split(" ")[0] // Take first size if multiple
        const size = parseInt(sizeStr.split("x")[0]) || 16
        sizeMap.set(icon.href, size)
      }
    })

    // Sort by size (descending) and return the largest
    const sortedIcons = icons.sort((a, b) => {
      const sizeA = sizeMap.get(a.href) || 16
      const sizeB = sizeMap.get(b.href) || 16
      return sizeB - sizeA
    })

    return sortedIcons[0].href
  }

  const generateLetterFavicon = (domain: string): string => {
    const firstLetter = domain.charAt(0).toUpperCase()
    const svgContent = `<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#6366f1" rx="4"/>
      <text x="50%" y="50%" font-size="18" font-family="system-ui,sans-serif" font-weight="600" text-anchor="middle" dominant-baseline="middle" fill="white">${firstLetter}</text>
    </svg>`
    return `data:image/svg+xml;base64,${Buffer.from(svgContent).toString("base64")}`
  }

  // Main transformer function
  return {
    name: "NotebookEmbedding",
    htmlPlugins() {
      return [
        () => {
          return async (tree: Root, _file) => {
            await ensureCacheDir()

            const promises: Promise<void>[] = []

            visit(tree, "element", (node: Element) => {
              if (node.tagName === "a" && node.properties?.href) {
                const href = node.properties.href as string

                // Check if this is a notebook link
                if (href.endsWith(".ipynb")) {
                  const promise = (async () => {
                    try {
                      // Try to load from cache first
                      let notebook = await loadCachedNotebook(href)

                      // If not cached and download is enabled, try to download
                      if (!notebook && opts.downloadFromGitHub) {
                        notebook = await downloadNotebook(href)
                        if (notebook) {
                          await cacheNotebook(href, notebook)
                        }
                      } // If we have notebook data, embed it
                      if (notebook) {
                        const notebookHtml = await notebookToHtml(notebook, href)

                        // Replace the link with embedded notebook
                        node.tagName = "div"
                        node.properties = {
                          className: ["notebook-wrapper-container"],
                          "data-notebook-url": href,
                        }

                        const notebookAst = fromHtml(notebookHtml, { fragment: true })
                        node.children = notebookAst.children as any
                      } else {
                        // Show the original link but mark it as unavailable
                        node.properties = {
                          ...node.properties,
                          className: ["notebook-link-unavailable"],
                        }
                        // Optionally, you can keep the original children or set a message:
                        // node.children = [{ type: "text", value: "Notebook unavailable" }] as any
                      }
                    } catch (error) {
                      console.warn(`Error processing notebook link ${href}:`, error)
                    }
                  })()

                  promises.push(promise)
                }
              }
            })

            // Wait for all notebook processing to complete
            await Promise.all(promises)
          }
        },
      ]
    },
  }
}
