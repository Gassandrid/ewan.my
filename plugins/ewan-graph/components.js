import { Graph as QuartzGraph } from "../../.quartz/plugins/graph/dist/components/index.js"

const GRAPH_DATA_LOOPS = [
  {
    original: "for(var Ju in Ku)eu.set(Fu(Ju),Ku[Ju])",
    filtered:
      "for(var Ju in Ku){var Hu=Fu(Ju);if(/\\.base(?:\\/index)?$/.test(Hu))continue;eu.set(Hu,Ku[Ju])}",
  },
  {
    original: "for(var Ku in qu)uu.set(cu(Ku),qu[Ku])",
    filtered:
      "for(var Ku in qu){var Hu=cu(Ku);if(/\\.base(?:\\/index)?$/.test(Hu))continue;uu.set(Hu,qu[Ku])}",
  },
]

export function patchGraphRuntime(script) {
  for (const { original, filtered } of GRAPH_DATA_LOOPS) {
    if (script.includes(original)) {
      return script.replace(original, filtered)
    }
  }

  throw new Error("Quartz graph runtime changed; update the .base compatibility patch")
}

export function Graph(options) {
  const Component = QuartzGraph(options)
  Component.afterDOMLoaded = patchGraphRuntime(Component.afterDOMLoaded)
  return Component
}
