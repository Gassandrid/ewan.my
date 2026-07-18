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

const RUNNER_SCRIPT = `
(function() {
  if (window.EwanPythonRunner) return;

  var PYODIDE_BASE = "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/";
  var CODEMIRROR_BASE = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/";
  var pyodidePromise = null;
  var editorRuntimePromise = null;
  var editorInstances = {};

  function loadScript(src, marker) {
    var found = document.querySelector('script[data-ewan-runtime="' + marker + '"]');
    if (found && found.dataset.loaded === "true") return Promise.resolve();
    return new Promise(function(resolve, reject) {
      var script = found || document.createElement("script");
      if (!found) {
        script.src = src;
        script.defer = true;
        script.dataset.ewanRuntime = marker;
        document.head.appendChild(script);
      }
      script.addEventListener("load", function() { script.dataset.loaded = "true"; resolve(); }, { once: true });
      script.addEventListener("error", function() { reject(new Error("failed to load " + marker)); }, { once: true });
    });
  }

  function loadStyle(href, marker) {
    if (document.querySelector('link[data-ewan-runtime="' + marker + '"]')) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.dataset.ewanRuntime = marker;
    document.head.appendChild(link);
  }

  function loadEditorRuntime() {
    if (window.CodeMirror) return Promise.resolve();
    if (editorRuntimePromise) return editorRuntimePromise;
    loadStyle(CODEMIRROR_BASE + "codemirror.min.css", "codemirror-css");
    loadStyle(CODEMIRROR_BASE + "theme/gruvbox-dark.min.css", "codemirror-dark-css");
    loadStyle(CODEMIRROR_BASE + "theme/base16-light.min.css", "codemirror-light-css");
    editorRuntimePromise = loadScript(CODEMIRROR_BASE + "codemirror.min.js", "codemirror")
      .then(function() { return loadScript(CODEMIRROR_BASE + "mode/python/python.min.js", "codemirror-python"); });
    return editorRuntimePromise;
  }

  function byId(id) {
    return document.getElementById(id);
  }

  function setButtonLoading(button, loading) {
    if (!button) return;
    button.disabled = loading;
    button.classList.toggle("loading", loading);
    var play = button.querySelector(".play-icon");
    var spinner = button.querySelector(".spinner");
    if (play) play.style.display = loading ? "none" : "inline";
    if (spinner) spinner.style.display = loading ? "inline-block" : "none";
  }

  async function loadPyodideRuntime() {
    if (window.pyodideInstance) return window.pyodideInstance;
    if (pyodidePromise) return pyodidePromise;
    pyodidePromise = (async function() {
      await loadScript(PYODIDE_BASE + "pyodide.js", "pyodide");
      var pyodide = await window.loadPyodide({ indexURL: PYODIDE_BASE });
      pyodide.runPython([
        "import sys, io",
        "sys.stdout = io.StringIO()",
        "sys.stderr = io.StringIO()",
      ].join("\\n"));
      window.pyodideInstance = pyodide;
      return pyodide;
    })();
    return pyodidePromise;
  }

  function getCode(blockId) {
    var editor = editorInstances[blockId];
    if (editor) return editor.getValue();
    var textarea = byId("codeTextarea-" + blockId);
    return textarea ? textarea.value : "";
  }

  function resetOutput(pyodide) {
    pyodide.runPython([
      "import sys, io",
      "sys.stdout = io.StringIO()",
      "sys.stderr = io.StringIO()",
    ].join("\\n"));
  }

  function captureText(pyodide) {
    return pyodide.runPython("sys.stdout.getvalue() + sys.stderr.getvalue()");
  }

  function capturePlot(pyodide) {
    return pyodide.runPython(String.raw\`
import base64
import io

plot_data = ""
try:
    import matplotlib.pyplot as plt
    if plt.get_fignums():
        buf = io.BytesIO()
        plt.savefig(buf, format="png", bbox_inches="tight")
        buf.seek(0)
        plot_data = base64.b64encode(buf.read()).decode("utf-8")
        plt.close("all")
except Exception:
    plot_data = ""

plot_data
\`);
  }

  async function runBlock(blockId) {
    var button = byId(blockId + "-button");
    var textElement = byId(blockId + "-text");
    var plotElement = byId(blockId + "-plot");
    var outputWrapper = byId(blockId + "-outputWrapper");

    if (!textElement || !plotElement || !outputWrapper) return;
    setButtonLoading(button, true);
    textElement.textContent = "";
    textElement.classList.remove("success", "error");
    plotElement.innerHTML = "";
    plotElement.style.display = "none";

    try {
      var code = getCode(blockId);
      var pyodide = await loadPyodideRuntime();
      resetOutput(pyodide);
      await pyodide.loadPackagesFromImports(code);
      var result = await pyodide.runPythonAsync(code);
      var text = captureText(pyodide);
      if (result !== undefined && result !== null) {
        text += (text ? "\\n" : "") + String(result);
      }
      textElement.textContent = text || "Done.";
      textElement.classList.add("success");

      var plotData = capturePlot(pyodide);
      if (plotData) {
        var img = document.createElement("img");
        img.src = "data:image/png;base64," + plotData;
        img.alt = "Python plot output";
        plotElement.appendChild(img);
        plotElement.style.display = "block";
      }
    } catch (error) {
      textElement.textContent = "--- PYTHON ERROR ---\\n" + (error && error.message ? error.message : String(error));
      textElement.classList.add("error");
    } finally {
      outputWrapper.classList.add("expanded");
      setButtonLoading(button, false);
    }
  }

  function copyBlock(blockId) {
    var code = getCode(blockId);
    navigator.clipboard?.writeText(code);
    var button = byId(blockId + "-copy");
    if (button) {
      button.classList.add("copied");
      setTimeout(function() { button.classList.remove("copied"); }, 800);
    }
  }

  function toggleExpand(blockId) {
    var content = byId("codeContent-" + blockId);
    if (content) content.classList.toggle("expanded");
  }

  function closeOutput(blockId) {
    var outputWrapper = byId(blockId + "-outputWrapper");
    if (outputWrapper) outputWrapper.classList.remove("expanded");
  }

  function initEditor(block) {
    var blockId = block.getAttribute("data-python-run");
    if (!blockId || block.dataset.pythonReady === "true") return;
    block.dataset.pythonReady = "true";

    var textarea = byId("codeTextarea-" + blockId);
    if (textarea && window.CodeMirror) {
      editorInstances[blockId] = window.CodeMirror.fromTextArea(textarea, {
        mode: "python",
        theme: document.documentElement.getAttribute("saved-theme") === "dark" ? "gruvbox-dark" : "base16-light",
        lineNumbers: true,
        lineWrapping: true,
        readOnly: false,
      });
    } else if (textarea) textarea.style.display = "block";

    byId(blockId + "-button")?.addEventListener("click", function() { runBlock(blockId); });
    byId(blockId + "-copy")?.addEventListener("click", function() { copyBlock(blockId); });
    byId(blockId + "-expand")?.addEventListener("click", function() { toggleExpand(blockId); });
    byId(blockId + "-closeOutputBtn")?.addEventListener("click", function() { closeOutput(blockId); });
    byId(blockId + "-button")?.removeAttribute("disabled");
  }

  async function init() {
    var blocks = document.querySelectorAll("[data-python-run]");
    if (blocks.length === 0) return;
    try {
      await loadEditorRuntime();
    } catch (error) {
      console.warn("[run-python] editor runtime unavailable; using textareas", error);
    }
    blocks.forEach(initEditor);
  }

  window.EwanPythonRunner = { init: init, runBlock: runBlock, loadPyodideRuntime: loadPyodideRuntime };
  document.addEventListener("DOMContentLoaded", init);
  document.addEventListener("nav", function() { setTimeout(init, 50); });
  if (document.readyState !== "loading") init();
})();
`

function renderPythonBlock(id, code, language) {
  const label = language === "python-r" ? "Python" : "Python"
  const escaped = escapeHtml(code)

  return `
<div class="code-wrapper" data-python-run="${id}" id="wrapper-${id}">
  <div class="code-block">
    <div class="code-header">
      <div class="code-language">${label}</div>
      <div class="code-actions">
        <button id="${id}-copy" aria-label="Copy code" type="button">Copy</button>
        <button id="${id}-button" class="python-run-button" aria-label="Run code" type="button" disabled><span class="play-icon">Run</span><span class="spinner"></span></button>
        <button id="${id}-expand" aria-label="Expand code" type="button">Expand</button>
      </div>
    </div>
    <div id="codeContent-${id}" class="code-content">
      <textarea id="codeTextarea-${id}" style="display: none;">${escaped}</textarea>
      <div id="codeGradient-${id}" class="code-gradient"></div>
    </div>
  </div>
  <div id="${id}-outputWrapper" class="output-wrapper">
    <div class="output-header">
      <div class="output-title">Output</div>
      <button id="${id}-closeOutputBtn" class="close-output-btn" aria-label="Close output" type="button">Close</button>
    </div>
    <div class="output-content">
      <div class="python-text" id="${id}-text" style="white-space: pre-wrap;"></div>
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
