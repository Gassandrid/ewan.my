import { Graph as QuartzGraph } from "../../.quartz/plugins/graph/dist/components/index.js"

const GRAPH_DATA_LOOP = "for(var Ju in Ku)eu.set(Fu(Ju),Ku[Ju])"
const FILTERED_GRAPH_DATA_LOOP =
  "for(var Ju in Ku){var Hu=Fu(Ju);if(/\\.base(?:\\/index)?$/.test(Hu))continue;eu.set(Hu,Ku[Ju])}"

export function patchGraphRuntime(script) {
  if (!script.includes(GRAPH_DATA_LOOP)) {
    throw new Error("Quartz graph runtime changed; update the .base compatibility patch")
  }
  return script.replace(GRAPH_DATA_LOOP, FILTERED_GRAPH_DATA_LOOP)
}

export function Graph(options) {
  const Component = QuartzGraph(options)
  Component.afterDOMLoaded = patchGraphRuntime(Component.afterDOMLoaded)
  return Component
}
