import { Explorer as QuartzExplorer } from "../../.quartz/plugins/explorer/dist/components/index.js"

// Keep the upstream explorer and its saved state. Like the graph and search
// adapters, fail at build time if an upstream update changes a patched seam.
export function patchExplorerRuntime(script) {
  // Upstream reveals the current note with element.scrollIntoView(), which
  // scrolls every scrollable ancestor: on a fresh visit the whole page jumped
  // down to wherever the note sits in the list. Scroll only the list itself.
  const reveal =
    /if\((\w+)\)(\w+)\.scrollTop=parseInt\(\1,10\);else\{let (\w+)=\2\.querySelector\("\.active"\);\3&&\3\.scrollIntoView\(\{behavior:"smooth"\}\)\}/
  if ([...script.matchAll(new RegExp(reveal.source, "g"))].length !== 1) {
    throw new Error("Quartz explorer runtime changed; update the scroll adapter")
  }
  script = script.replace(
    reveal,
    (_, saved, list, active) =>
      `if(${saved})${list}.scrollTop=parseInt(${saved},10);else{let ${active}=${list}.querySelector(".active");${active}&&${list}.scrollTo({top:${list}.scrollTop+${active}.getBoundingClientRect().top-${list}.getBoundingClientRect().top,behavior:"smooth"})}`,
  )
  // Upstream traces every navigation to the console. Silence its log calls
  // (only within this module's scope); warnings and errors still surface.
  return `const console = Object.assign(Object.create(globalThis.console), { log() {} });\n${script}`
}

export function Explorer(options) {
  const component = QuartzExplorer(options)
  component.afterDOMLoaded = patchExplorerRuntime(component.afterDOMLoaded)
  return component
}
