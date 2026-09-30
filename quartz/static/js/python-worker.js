// Share the notebook's tested Pyodide distribution and browser download cache.
const PYODIDE_BASE = "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/"
let runtime
let busy = false

async function loadRuntime() {
  if (!runtime) {
    runtime = import(PYODIDE_BASE + "pyodide.mjs")
      .then(({ loadPyodide }) => loadPyodide({ indexURL: PYODIDE_BASE }))
      .then((py) => {
        py.runPython(`
import os
os.environ["MPLBACKEND"] = "agg"
`)
        return py
      })
      .catch((error) => {
        runtime = null
        throw error
      })
  }
  return runtime
}

// Run helpers outside the user's globals so names like `sys` or `io` in a
// lesson cannot overwrite the output capture. Bound output and release proxies.
const PREPARE = `
import sys, io
class BoundedOutput(io.StringIO):
    def write(self, text):
        room = max(0, 100000 - self.tell())
        if room:
            super().write(text[:room])
            if len(text) > room:
                super().write("\\n[Output truncated]\\n")
        return len(text)
sys.stdout = BoundedOutput()
sys.stderr = sys.stdout
sys.stdin = io.StringIO("")
if "matplotlib.pyplot" in sys.modules:
    sys.modules["matplotlib.pyplot"].close("all")
`
const CAPTURE = `
import sys, io, base64, json
plots = []
plt = sys.modules.get("matplotlib.pyplot")
if plt is not None:
    for number in plt.get_fignums()[:8]:
        buf = io.BytesIO()
        plt.figure(number).savefig(buf, format="png", bbox_inches="tight", dpi=110)
        plots.append(base64.b64encode(buf.getvalue()).decode("ascii"))
    plt.close("all")
json.dumps({"text": sys.stdout.getvalue(), "plots": plots})
`

self.onmessage = async ({ data: { id, code } }) => {
  if (busy) return
  busy = true
  const status = (text) => self.postMessage({ id, status: text })
  let helpers, result
  try {
    status(runtime ? "Loading packages…" : "Starting Python…")
    const py = await loadRuntime()
    helpers = py.toPy({})
    py.runPython(PREPARE, { globals: helpers })
    status("Loading packages…")
    let error
    try {
      await py.loadPackagesFromImports(code)
      status("Running…")
      result = await py.runPythonAsync(code)
    } catch (failure) {
      error = failure.message ?? String(failure)
    }
    const output = JSON.parse(py.runPython(CAPTURE, { globals: helpers }))
    if (result !== undefined && result !== null) {
      output.text +=
        (output.text && !output.text.endsWith("\n") ? "\n" : "") + String(result).slice(0, 100000)
    }
    self.postMessage({ id, ...output, error })
  } catch (error) {
    self.postMessage({ id, error: error.message ?? String(error), fatal: true })
  } finally {
    result?.destroy?.()
    helpers?.destroy()
    busy = false
  }
}
