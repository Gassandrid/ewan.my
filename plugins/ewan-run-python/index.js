import { visit } from "unist-util-visit"

let pythonBlockCounter = 0

function nextBlockId() {
  pythonBlockCounter += 1
  return `python-${pythonBlockCounter}`
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

// Keep the editor and Python off pages that do not contain runnable code.
export const RUNNER_SCRIPT = `(() => {
  let generation = 0, dispose;
  const cleanup = () => { generation++; dispose?.(); dispose = undefined; };
  document.addEventListener("prenav", cleanup);
  document.addEventListener("nav", async () => {
    cleanup();
    const root = document.querySelector(".center > article");
    if (!root?.querySelector("[data-python-run]")) return;
    const ticket = generation;
    try {
      const runner = await import("/static/js/python-runner.js");
      if (ticket === generation && root.isConnected) dispose = runner.mount(root);
    } catch {
      if (ticket !== generation) return;
      root.querySelectorAll("[data-python-status]").forEach(el => { el.textContent = "Editor unavailable. Reload to retry."; });
    }
  });
})();`

function renderPythonBlock(id, code, language) {
  const label = "Python"
  const escaped = escapeHtml(code)

  return `
<div class="code-wrapper" data-python-run="${id}" id="wrapper-${id}">
  <div class="code-block">
    <div class="code-header">
      <div class="code-language">${label}</div>
      <span class="python-status" data-python-status role="status" aria-live="polite"></span>
      <div class="code-actions">
        <button id="${id}-copy" aria-label="Copy code" type="button">Copy</button>
        <button id="${id}-button" class="python-run-button" aria-label="Run code" type="button" disabled><span class="play-icon" aria-hidden="true">▶</span><span data-run-label>Run</span></button>
        <button id="${id}-expand" aria-label="Expand code" aria-expanded="false" aria-controls="codeContent-${id}" type="button">Expand</button>
      </div>
    </div>
    <div id="codeContent-${id}" class="code-content">
      <textarea id="codeTextarea-${id}" aria-label="Editable Python code" spellcheck="false">${escaped}</textarea>
    </div>
  </div>
  <div id="${id}-outputWrapper" class="output-wrapper" hidden>
    <div class="output-header">
      <div class="output-title">Output</div>
      <button id="${id}-closeOutputBtn" class="close-output-btn" aria-label="Close output" type="button">Close</button>
    </div>
    <div class="output-content">
      <div class="python-text" id="${id}-text"></div>
      <div class="python-plot" id="${id}-plot"></div>
    </div>
  </div>
</div>`
}

export default function EwanRunPython(opts = {}) {
  const languages = new Set(opts.languages ?? ["python", "python-r"])

  return {
    name: "EwanRunPython",
    markdownPlugins() {
      return [
        () => (tree) => {
          pythonBlockCounter = 0
          visit(tree, "code", (node, index, parent) => {
            if (!languages.has(node.lang) || !parent?.children || index === undefined) return
            const id = nextBlockId()
            parent.children.splice(index, 1, {
              type: "html",
              value: renderPythonBlock(id, node.value, node.lang),
            })
          })
        },
      ]
    },
    externalResources() {
      return {
        js: [
          {
            script: RUNNER_SCRIPT,
            loadTime: "afterDOMReady",
            contentType: "inline",
            spaPreserve: true,
          },
        ],
      }
    },
  }
}
