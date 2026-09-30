const CODEMIRROR_BASE = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/"
let editorRuntime
const scripts = new Map()

function loadScript(src) {
  if (scripts.has(src)) return scripts.get(src)
  const promise = new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = src
    script.dataset.persist = "true"
    const timer = setTimeout(() => fail(), 15000)
    function fail() {
      clearTimeout(timer)
      script.remove()
      scripts.delete(src)
      reject(new Error("Editor download failed"))
    }
    script.onload = () => {
      clearTimeout(timer)
      resolve()
    }
    script.onerror = fail
    document.head.append(script)
  })
  scripts.set(src, promise)
  return promise
}

function loadEditorRuntime() {
  if (editorRuntime) return editorRuntime
  if (!document.querySelector("link[data-python-editor]")) {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = CODEMIRROR_BASE + "codemirror.min.css"
    link.dataset.pythonEditor = ""
    link.dataset.persist = "true"
    document.head.append(link)
  }
  editorRuntime = (async () => {
    if (!window.CodeMirror) await loadScript(CODEMIRROR_BASE + "codemirror.min.js")
    if (!window.CodeMirror.modes.python)
      await loadScript(CODEMIRROR_BASE + "mode/python/python.min.js")
  })().catch((error) => {
    editorRuntime = null
    throw error
  })
  return editorRuntime
}

export function mount(root) {
  const blocks = [...root.querySelectorAll("[data-python-run]")]
  const editors = new Map()
  const controller = new AbortController()
  const timers = new Set()
  let disposed = false,
    worker,
    active,
    sequence = 0
  const listen = (el, type, fn) => el.addEventListener(type, fn, { signal: controller.signal })
  const status = (block, text) => {
    block.querySelector("[data-python-status]").textContent = text
  }
  const code = (block) => editors.get(block)?.getValue() ?? block.querySelector("textarea").value

  function updateButtons() {
    for (const block of blocks) {
      const button = block.querySelector(".python-run-button")
      const running = active?.block === block
      button.disabled = !!active && !running
      button.classList.toggle("loading", running)
      button.querySelector("[data-run-label]").textContent = running ? "Stop" : "Run"
      button.querySelector(".play-icon").textContent = running ? "■" : "▶"
      button.setAttribute("aria-label", running ? "Stop Python and reset session" : "Run code")
      block.setAttribute("aria-busy", String(running))
    }
  }

  function terminate() {
    worker?.terminate()
    worker = undefined
  }

  function finish(message) {
    if (!active) return
    const { block, resolve, started, timer } = active
    clearTimeout(timer)
    active = undefined
    const text = block.querySelector(".python-text")
    const output = block.querySelector(".output-wrapper")
    const plots = block.querySelector(".python-plot")
    output.hidden = false
    output.classList.add("expanded")
    text.textContent = (message.text ?? "") + (message.error ? `\n${message.error}` : "")
    if (!text.textContent.trim() && !message.plots?.length) text.textContent = "Done."
    text.classList.toggle("error", !!message.error)
    plots.replaceChildren(
      ...(message.plots ?? []).map((data) => {
        const img = new Image()
        img.src = "data:image/png;base64," + data
        img.alt = "Python plot output"
        return img
      }),
    )
    status(
      block,
      message.error
        ? "Error"
        : message.stopped
          ? "Stopped"
          : `Done · ${((performance.now() - started) / 1000).toFixed(1)} s`,
    )
    if (message.fatal) terminate()
    updateButtons()
    resolve()
  }

  function stop() {
    terminate()
    finish({ text: "Stopped. Python variables have been reset.", stopped: true })
  }

  function runBlock(id) {
    const block = blocks.find((el) => el.dataset.pythonRun === id)
    if (!block || disposed) return Promise.resolve()
    if (active) {
      if (active.block === block) stop()
      return Promise.resolve()
    }
    return new Promise((resolve) => {
      const job = ++sequence
      active = {
        id: job,
        block,
        resolve,
        started: performance.now(),
        timer: setTimeout(() => {
          terminate()
          finish({ error: "Python timed out after 2 minutes. Run again to start a fresh session." })
        }, 120000),
      }
      status(block, worker ? "Running…" : "Starting Python…")
      updateButtons()
      try {
        if (!worker) {
          worker = new Worker(new URL("./python-worker.js", import.meta.url), { type: "module" })
          worker.onmessage = ({ data }) => {
            if (!active || data.id !== active.id || disposed) return
            if (data.status) status(active.block, data.status)
            else finish(data)
          }
          worker.onerror = (event) => {
            event.preventDefault()
            finish({
              error: "Python could not load. Check your connection and try Run again.",
              fatal: true,
            })
          }
        }
        worker.postMessage({ id: job, code: code(block) })
      } catch (error) {
        finish({ error: error.message, fatal: true })
      }
    })
  }

  for (const block of blocks) {
    const id = block.dataset.pythonRun
    const textarea = block.querySelector("textarea")
    const content = block.querySelector(".code-content")
    const expand = block.querySelector(`#${id}-expand`)
    expand.hidden = textarea.value.split("\n").length <= 10
    listen(block.querySelector(".python-run-button"), "click", () => runBlock(id))
    listen(block.querySelector(`#${id}-copy`), "click", async (event) => {
      const button = event.currentTarget
      try {
        await navigator.clipboard.writeText(code(block))
        if (disposed) return
        button.textContent = "Copied"
        const timer = setTimeout(() => {
          button.textContent = "Copy"
          timers.delete(timer)
        }, 1400)
        timers.add(timer)
      } catch {
        status(block, "Select code to copy")
      }
    })
    listen(expand, "click", () => {
      const expanded = content.classList.toggle("expanded")
      expand.textContent = expanded ? "Collapse" : "Expand"
      expand.setAttribute("aria-expanded", String(expanded))
      expand.setAttribute("aria-label", expanded ? "Collapse code" : "Expand code")
      editors.get(block)?.refresh()
    })
    listen(block.querySelector(".close-output-btn"), "click", () => {
      block.querySelector(".output-wrapper").hidden = true
    })
    listen(textarea, "keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault()
        runBlock(id)
      }
    })
  }
  updateButtons()
  // The textarea is usable immediately, including when the editor CDN fails.
  void loadEditorRuntime()
    .then(() => {
      if (disposed || !root.isConnected) return
      for (const block of blocks) {
        const editor = window.CodeMirror.fromTextArea(block.querySelector("textarea"), {
          mode: "python",
          theme: "ewan",
          lineNumbers: true,
          lineWrapping: true,
          viewportMargin: 12,
          tabSize: 4,
          indentUnit: 4,
          extraKeys: {
            "Ctrl-Enter": () => runBlock(block.dataset.pythonRun),
            "Cmd-Enter": () => runBlock(block.dataset.pythonRun),
            Tab: false,
            "Shift-Tab": false,
          },
        })
        editor.getInputField().setAttribute("aria-label", "Editable Python code")
        editors.set(block, editor)
      }
    })
    .catch(() => {
      /* The readable native editor remains available. */
    })

  const api = { runBlock, stop }
  window.EwanPythonRunner = api
  return () => {
    disposed = true
    controller.abort()
    terminate()
    if (active) {
      clearTimeout(active.timer)
      active.resolve()
      active = undefined
    }
    timers.forEach(clearTimeout)
    editors.forEach((editor) => editor.toTextArea())
    editors.clear()
    if (window.EwanPythonRunner === api) delete window.EwanPythonRunner
  }
}
