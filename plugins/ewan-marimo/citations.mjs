// Formats a notebook's `[@citekey]` groups with the site's own rehype-citation,
// so notebooks and notes share one bibliography. It is async and the page
// type's generate() is not, so the emitter runs this as a child process.
import fs from "node:fs"
import path from "node:path"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"

const { groups, options, locale } = JSON.parse(fs.readFileSync(0, "utf8"))
const { Citations } = await import(
  path.join(process.cwd(), ".quartz", "plugins", "citations", "dist", "index.js")
)
const [[rehypeCitation]] = Citations().htmlPlugins({ cfg: { configuration: { locale } } })
const processor = unified().use(remarkParse).use(remarkRehype).use(rehypeCitation, options)
const tree = await processor.run(processor.parse(groups.join("\n\n")))
process.stdout.write(JSON.stringify(tree, (key, value) => (key === "position" ? undefined : value)))
