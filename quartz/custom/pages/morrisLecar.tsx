import { CustomPageDef } from "../types"
import { FullSlug } from "../../util/path"

const MorrisLecarPage: CustomPageDef = {
  slug: "Pages/morris-lecar" as FullSlug,
  title: "Morris-Lecar Phase Plane",
  tags: ["comp-neuro/models", "math/chaos/dynamics"],
  fullWidth: true,
  description: "phase plane explorer, nullclines/trajectories/bifurcations etc",
  body: () => (
    <div class="ml-wrap" id="app">
      <div id="toolbar">
        <select id="preset-select">
          <option value="">— Preset —</option>
        </select>
        <button class="tb-btn" id="btn-reset-view">
          Reset View
        </button>
        <button class="tb-btn" id="btn-clear-traj">
          Clear
        </button>
        <button class="tb-btn" id="btn-bifurc">
          Bifurcation
        </button>
        <button class="tb-btn" id="btn-live-sim">
          Live Sim
        </button>
        <button class="tb-btn" id="btn-live-play" style="display:none">
          &#9654; Play
        </button>
        <button class="tb-btn" id="btn-live-reset" style="display:none">
          Reset
        </button>
        <span id="live-speed-display" style="display:none"></span>
        <button class="tb-btn" id="btn-help">
          Help
        </button>
        <div class="tb-spacer"></div>
        <div id="coord-display">V: —, n: —</div>
      </div>

      <div id="main-area">
        <div id="phase-container">
          <div id="phase-canvas-wrap">
            <canvas id="phase-canvas"></canvas>
          </div>
          <div id="timeseries-container">
            <button id="ts-toggle">&#9660; Time Series</button>
            <span id="ts-label"></span>
            <canvas id="ts-canvas"></canvas>
          </div>
        </div>
        <div id="sidebar"></div>
      </div>

      <div id="bifurc-modal">
        <div id="bifurc-content">
          <button class="tb-btn" id="bifurc-close">
            Close
          </button>
          <h2>
            Bifurcation Diagram (V vs I<sub>ext</sub>)
          </h2>
          <canvas id="bifurc-canvas"></canvas>
          <div id="bifurc-status">Ready</div>
        </div>
      </div>

      <div id="help-overlay">
        <div id="help-content">
          <h2>Keyboard &amp; Mouse</h2>
          <table>
            <tr>
              <td>Click</td>
              <td>Launch trajectory forward</td>
            </tr>
            <tr>
              <td>Shift+Click</td>
              <td>Forward &amp; backward</td>
            </tr>
            <tr>
              <td>Alt+Click</td>
              <td>Noisy ensemble</td>
            </tr>
            <tr>
              <td>Scroll</td>
              <td>Zoom</td>
            </tr>
            <tr>
              <td>Drag</td>
              <td>Pan</td>
            </tr>
            <tr>
              <td>c</td>
              <td>Clear trajectories</td>
            </tr>
            <tr>
              <td>r</td>
              <td>Reset view</td>
            </tr>
            <tr>
              <td>p</td>
              <td>Toggle live sim</td>
            </tr>
            <tr>
              <td>Esc</td>
              <td>Close overlays</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  ),
}

export default MorrisLecarPage
