import fs from "node:fs/promises"
import path from "node:path"
import { transform } from "esbuild"
import { MODULE_PATH, MODULE_SOURCE } from "./components.js"

// Writes the homepage's culture module; components.js loads it there alone.
export default function EigencellsAssets() {
  return {
    name: "EigencellsAssets",
    async *emit({ argv }) {
      const outfile = path.join(argv.output, MODULE_PATH)
      const { code } = await transform(MODULE_SOURCE, { minify: true, format: "esm" })
      await fs.mkdir(path.dirname(outfile), { recursive: true })
      await fs.writeFile(outfile, code)
      yield outfile
    },
  }
}
