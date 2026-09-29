import { build } from "esbuild"
import { fileURLToPath } from "node:url"
import path from "node:path"

export default function PresenceAssets() {
  return {
    name: "PresenceAssets",
    async *emit({ argv }) {
      const outfile = path.join(argv.output, "static/ewan-presence.js")
      await build({
        entryPoints: [fileURLToPath(new URL("./client.js", import.meta.url))],
        outfile,
        bundle: true,
        format: "esm",
        platform: "browser",
        target: "es2022",
        minify: true,
        legalComments: "eof",
      })
      yield outfile
    },
  }
}
