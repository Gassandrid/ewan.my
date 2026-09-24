import { h } from "preact"

const SLUG = "pages/morris-lecar"
const canvas = (id, label) =>
  `<canvas id="${id}" role="img" aria-label="${label}">${label}. Numerical values are available beside the plot.</canvas>`
const toggle = (id, text, checked = true) =>
  `<label class="ml-check"><input type="checkbox" id="${id}" ${checked ? "checked" : ""}>${text}</label>`
const range = (id, label, min, max, step, value, unit = "") =>
  `<label class="ml-control" for="${id}"><span>${label}</span><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"><output id="${id}-value" for="${id}">${value} ${unit}</output></label>`

function MorrisLecarBody() {
  function Component() {
    return h(
      "article",
      { class: "popover-hint morris-lecar-page" },
      h("div", {
        class: "markdown-preview-view markdown-rendered ml-wrap",
        id: "ml-app",
        dangerouslySetInnerHTML: {
          __html: `
        <div class="ml-toolbar">
          <label>Preset <select id="preset-select"><option value="hopf">Hopf · type II</option><option value="saddle">Saddle-node · type I</option><option value="custom" disabled>Custom parameters</option></select></label>
          <div class="ml-scenarios" role="group" aria-label="Experiments">
            <button data-scene="damped">Damped oscillation</button><button data-scene="hopf">Cross Hopf</button><button data-scene="saddle">Saddle &amp; threshold</button><button data-scene="fold">Cross saddle-node</button>
          </div>
          <button id="ml-range" title="Zoom current controls and branch plots around the nearest bifurcation">Near boundary</button>
          <button id="ml-reset" title="Restore the selected regime's parameters and view">Reset</button>
          <button id="ml-share" title="Copy a link with parameters and the selected equilibrium">Copy link</button>
        </div>
        <div class="ml-drive">
          <label class="ml-current" for="ml-current"><span>Applied current <i>I</i></span><input type="range" id="ml-current" min="0" max="220" step="0.01" value="90"><input type="number" id="ml-current-number" aria-label="Applied current in microamps per square centimeter" min="-20" max="250" step="0.01" value="90"><span>µA/cm²</span></label>
          ${range("ml-phi", "Recovery rate φ", 0.01, 0.15, 0.0001, 0.04, "ms⁻¹")}
        </div>
        <div id="ml-context" class="ml-context" aria-live="polite"></div>
        <div class="ml-main-grid">
          <section class="ml-phase">
            <div class="ml-section-head"><h2>Phase plane</h2><div><button id="ml-zoom">Zoom to equilibrium</button><button id="ml-clear">Clear paths</button></div></div>
            <div class="ml-legend">
              ${toggle("ml-nullclines", '<span class="ml-key slate"></span>V̇ = 0 <span class="ml-key clay"></span>ṅ = 0')}
              ${toggle("ml-field", "Flow")}${toggle("ml-manifolds", '<span class="ml-key pine"></span>Wˢ <span class="ml-key rust dashed"></span>Wᵘ')}
              ${toggle("ml-vectors", "Eigenvectors", false)}
            </div>
            ${canvas("phase-canvas", "Voltage versus potassium activation: nullclines, equilibria, trajectories and saddle manifolds")}
            <div class="ml-phase-actions"><span>Click to launch a trajectory. Select a numbered equilibrium below.</span><button id="ml-straddle" disabled>Straddle Wˢ</button></div>
            <div id="ml-equilibria" class="ml-equilibria" role="group" aria-label="Equilibria"></div>
            <p id="ml-manifold-note" class="ml-note"></p>
          </section>
          <section id="sidebar" class="ml-jacobian">
            <div class="ml-section-head"><h2>Jacobian at equilibrium <span id="ml-eq-number"></span></h2><span id="ml-type"></span></div>
            <div class="ml-matrix-line"><span class="ml-math">δẋ = Jδx</span><div id="ml-matrix" class="ml-matrix" role="group" aria-label="Jacobian entries; select an entry to inspect its meaning"></div></div>
            <p id="ml-entry-note" class="ml-note"></p>
            <div class="ml-eigen-formula"><math display="block"><mrow><msub><mi>λ</mi><mrow><mn>1</mn><mo>,</mo><mn>2</mn></mrow></msub><mo>=</mo><mfrac><mi>τ</mi><mn>2</mn></mfrac><mo>±</mo><mfrac><msqrt><mrow><msup><mi>τ</mi><mn>2</mn></msup><mo>−</mo><mn>4</mn><mi>D</mi></mrow></msqrt><mn>2</mn></mfrac></mrow></math><div id="ml-eigenvalues"></div></div>
            <div id="ml-invariants" class="ml-invariants"></div>
            ${canvas("ml-spectrum", "Eigenvalues in the complex plane; horizontal real part controls stability, vertical imaginary part controls oscillation")}
            <div id="ml-eigen-meaning" class="ml-note"></div>
          </section>
        </div>
        <section class="ml-experiment">
          <div class="ml-section-head"><h2>What does the linearization predict?</h2><div class="ml-legend"><span><i class="ml-key ochre"></i>Full model</span><span><i class="ml-key slate dashed"></i>Jδx</span></div></div>
          <div class="ml-experiment-controls">
            ${range("ml-amplitude", "Perturbation", 0.1, 12, 0.1, 1, "mV")}
            ${range("ml-angle", "Direction", -180, 180, 1, 0, "°")}
            <label>Duration <select id="ml-duration"><option value="150">150 ms</option><option value="400" selected>400 ms</option><option value="1000">1000 ms</option></select></label>
            <button id="ml-perturb">Apply perturbation</button>
          </div>
          <div class="ml-pair-grid">
            <div>${canvas("ml-local", "Local perturbation in scaled coordinates, comparing nonlinear and linear trajectories and eigenvector directions")}</div>
            <div>${canvas("ts-canvas", "Voltage over time, comparing the full nonlinear model to the Jacobian prediction")}</div>
          </div>
          <div class="ml-playback"><button id="ml-play" aria-label="Play trajectory">Play</button>${range("ml-time", "t", 0, 400, 0.5, 80, "ms")}<button id="ml-fit-local">Fit local view</button></div>
          <p id="ml-local-note" class="ml-note"></p>
        </section>
        <section class="ml-bifurcation">
          <div class="ml-section-head"><h2>Follow the equilibria as current changes</h2><div class="ml-legend"><span><i class="ml-key pine"></i>Stable</span><span><i class="ml-key rust dashed"></i>Unstable</span><span><i class="ml-key mauve dashed"></i>Saddle</span></div></div>
          <div class="ml-pair-grid">
            <div>${canvas("bifurc-canvas", "All equilibrium voltage branches against applied current, with Hopf crossings and saddle-node folds")}</div>
            <div>${canvas("ml-eigen-branch", "Real and imaginary eigenvalue components against applied current for the selected equilibrium branch")}</div>
          </div>
          <div class="ml-events" id="ml-events" role="group" aria-label="Jump to a stability boundary"></div>
          <p class="ml-note">Click the voltage branch to select a point; drag horizontally to vary current. Solid and dashed branches show equilibria, not limit-cycle amplitudes.</p>
          <details class="ml-determinant"><summary>Read the same geometry in the trace–determinant plane</summary>
            <div class="ml-pair-grid">${canvas("ml-trace-det", "Trace determinant plane with saddle, node, focus and Hopf boundaries")}<div class="ml-boundary-notes">
              <p><b>D &lt; 0 → saddle.</b> One eigenvalue is negative, the other positive. Wˢ approaches the saddle; Wᵘ leaves it.</p>
              <p><b>D = 0 → a zero eigenvalue.</b> At a generic saddle-node, two equilibria meet and disappear. The flow slows along the direction whose eigenvalue tends to zero.</p>
              <p><b>τ = 0, D &gt; 0 → imaginary eigenvalues.</b> At a generic Hopf crossing, a focus changes stability while ω stays nonzero. Nonlinear terms determine which periodic orbits exist and their stability.</p>
              <p><b>τ² = 4D → real ↔ complex.</b> Crossing this parabola changes a node into a focus. It is not itself a loss of stability.</p>
            </div></div>
          </details>
        </section>
        <details class="ml-model"><summary>Equations, parameters &amp; numerical method</summary>
          <div class="ml-pair-grid">
            <div class="ml-equations">
              <p>C V̇ = I − g<sub>Ca</sub>m<sub>∞</sub>(V)(V − E<sub>Ca</sub>) − g<sub>K</sub>n(V − E<sub>K</sub>) − g<sub>L</sub>(V − E<sub>L</sub>)</p>
              <p>ṅ = q(V)[n<sub>∞</sub>(V) − n], &nbsp; q(V) = φ cosh[(V − V₃)/(2V₄)]</p>
              <p>m<sub>∞</sub>(V) = ½[1 + tanh((V − V₁)/V₂)]<br>n<sub>∞</sub>(V) = ½[1 + tanh((V − V₃)/V₄)]</p>
              <p class="ml-note">At equilibrium n* = n<sub>∞</sub>(V*). Thus J₂₁ = q n′<sub>∞</sub>: the term q′(n<sub>∞</sub> − n) vanishes here. J₁₂ has units mV/ms and J₂₁ has units (mV·ms)⁻¹; both eigenvalues have units ms⁻¹.</p>
            </div>
            <div id="ml-parameters" class="ml-parameters"></div>
          </div>
          <p class="ml-note">Analytic Jacobian; equilibrium continuation parameterized by voltage, with turning-point brackets scanned every 0.25 mV and bisection at folds and trace crossings. Degenerate boundaries are not certified. Nonlinear paths use RK4, Δt = 0.05 ms. Linear paths use exp(Jt). Manifolds are finite orbit approximations seeded ±10⁻⁵ along the saddle eigenvectors in scaled coordinates; Wˢ is computed backward in time, with arrows showing forward time. Paths stop when they leave the integration bounds.</p>
          <p class="ml-note">A saddle-node is a local statement. A SNIC additionally requires a closed global return; the Jacobian alone cannot establish it. At a Hopf crossing, linearization cannot distinguish a nonlinear center, a weak focus, or the stability of an emerging cycle.</p>
          <p class="ml-note">Model and bifurcation reference: <a href="https://sites.pitt.edu/~phase/bard/bardware/tut/xpptut3.html">Bard Ermentrout’s XPP tutorial</a>. Hopf preset uses g<sub>Ca</sub> = 4.4; type I uses g<sub>Ca</sub> = 4, V₃ = 12, V₄ = 17.4, φ = 0.0667. Critical currents are recomputed for the displayed parameters.</p>
        </details>
        <p id="ml-status" class="ml-note" role="status"></p>
        <noscript>This explorer requires JavaScript.</noscript>
      `,
        },
      }),
    )
  }
  Component.displayName = "MorrisLecarBody"
  return Component
}

export default function MorrisLecarPage() {
  return {
    name: "MorrisLecarPage",
    priority: 20,
    match: () => false,
    generate() {
      const title = "Morris-Lecar Phase Plane"
      const description =
        "An experiment in using coding agents to support learning through interactive visualization of the Morris–Lecar model, its Jacobian, and its bifurcations."
      return [
        {
          slug: SLUG,
          title,
          data: {
            slug: SLUG,
            relativePath: "virtual/morris-lecar.md",
            filePath: "virtual/morris-lecar.md",
            frontmatter: {
              title,
              tags: ["comp-neuro/models", "math/chaos/dynamics"],
              description,
              cssclasses: ["morris-lecar-page"],
            },
            text: title + ". " + description,
            description,
            links: [],
          },
        },
      ]
    },
    layout: "morris-lecar",
    frame: "full-width",
    body: MorrisLecarBody,
  }
}
