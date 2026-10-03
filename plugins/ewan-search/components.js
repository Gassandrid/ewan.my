import { Search as QuartzSearch } from "../../.quartz/plugins/search/dist/components/index.js"
import { prepareNotebookPreviews } from "../../quartz/components/scripts/notebook-preview.js"

// Keep the upstream search UI and index. Like the graph adapter, fail at build
// time if an upstream update changes any of these narrowly scoped seams.
export function patchSearchRuntime(script) {
  function replaceOnce(pattern, replacement, name) {
    if ([...script.matchAll(new RegExp(pattern.source, "g"))].length !== 1) {
      throw new Error(`Quartz search runtime changed; update the ${name} adapter`)
    }
    script = script.replace(pattern, replacement)
  }

  replaceOnce(
    /(\w+)=\w+\.parseFromString\(\w+\?\?"","text\/html"\);/,
    (match, doc) => `${match}prepareNotebookPreviews(${doc});`,
    "notebook preview",
  )
  // Click while the result is still connected so the router receives the same
  // event as a pointer click. The results click handler stores and closes search.
  replaceOnce(
    /(\w+)\.preventDefault\(\),\w+\(\),\w+\(\),(\w+)\.click\(\)/,
    (_, event, anchor) => `${event}.preventDefault(),${anchor}.click()`,
    "keyboard navigation",
  )
  // A completed fetch must not repopulate a closed or detached search menu.
  replaceOnce(
    /(if\(!(\w+)\|\|\(\w+\(\2\),!\w+\)\)return;let \w+=\w+\.id,\w+=\+\+\w+,\w+=await \w+\(\w+\);if\(\w+!==\w+)\)return;/,
    (_, start, preview) =>
      `${start}||!${preview}.isConnected||!${preview}.closest(".search-container.active"))return;`,
    "preview request",
  )
  replaceOnce(
    /\w+=null,(\w+)=0,(\w+)=null,\w+=\(\)=>\{\w+\.classList\.remove\("active"\)/,
    (match, token, timer) => match.replace("{", `{${token}++;clearTimeout(${timer});`),
    "preview cancellation",
  )
  // Search highlighting may wrap ordinary text, but must not mutate DOM owned
  // by React inside a live island while its cell is hydrating or rerunning.
  replaceOnce(
    /for\(let (\w+) of \w+\)\{let \w+=\(\1.textContent\?\?""\)\.toLowerCase\(\)\.indexOf/,
    (match, element) =>
      match.replace(
        "{",
        `{if(${element}.closest(".marimo-notebook-page, .marimo-notebook-preview"))continue;`,
      ),
    "notebook highlighting",
  )
  return `const prepareNotebookPreviews = ${prepareNotebookPreviews.toString()};\n${script}`
}

export function Search(options) {
  const component = QuartzSearch(options)
  component.afterDOMLoaded = patchSearchRuntime(component.afterDOMLoaded)
  return component
}
