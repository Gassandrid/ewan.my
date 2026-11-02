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
  // Upstream indexes every note's full text on every page load, before it
  // even wires up the search button: the largest main-thread cost on the site.
  // Build the index once, when search is first opened, and await it before
  // a query so the first search never reports "No results" early.
  const init = script.match(
    /async function (\w+)\(\)\{(\w+)\|\|\(\w+=await \w+\(\),await \w+\(\),\2=!0\)\}/,
  )
  if (!init) throw new Error("Quartz search runtime changed; update the lazy index adapter")
  const initIndex = init[1]
  replaceOnce(
    new RegExp(init[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    () =>
      `function ${initIndex}(){return ${initIndex}.p??=(async()=>${init[0].slice(init[0].indexOf("{"))})().catch(e=>{${initIndex}.p=null;throw e})}`,
    "lazy index",
  )
  replaceOnce(
    new RegExp(
      `(async function \\w+\\(\\)\\{\\w+\\(\\)),await ${initIndex}\\(\\)(,await \\w+\\(\\),\\w+\\(\\)\\})`,
    ),
    "$1$2",
    "index on navigation",
  )
  replaceOnce(
    /(\w+=(\w+)=>\{\w+=\2,\w+&&\(\w+\.style\.zIndex="9999"\),)/,
    (match) => `${match}${initIndex}().catch(()=>{}),`,
    "index when search opens",
  )
  replaceOnce(
    /=async (\w+)=>\{let \w+=\1\.target\.value;/,
    (match) => match.replace("{", `{await ${initIndex}();`),
    "index before a query",
  )
  return `const prepareNotebookPreviews = ${prepareNotebookPreviews.toString()};\n${script}`
}

export function Search(options) {
  const component = QuartzSearch(options)
  component.afterDOMLoaded = patchSearchRuntime(component.afterDOMLoaded)
  return component
}
