import * as THREE from "three"

// Lorenz flow background animation
// Converted from React Three Fiber to vanilla Three.js for Quartz/Preact compatibility

interface LorenzParams {
  spacing: number
  dotSize: number
  maxLineLength: number
  lineWidth: number
  sigma: number
  rho: number
  beta: number
  timeScale: number
  turbulenceAmount: number
  minOpacity: number
  maxOpacity: number
}

const DEFAULT_PARAMS: LorenzParams = {
  spacing: 0.5,
  dotSize: 0.04,
  maxLineLength: 0.6,
  lineWidth: 0.02,
  sigma: 14.0,
  rho: 32.0,
  beta: 2.666667,
  timeScale: 0.5,
  turbulenceAmount: 0.5,
  minOpacity: 0.25,
  maxOpacity: 0.75,
}

// Check if we're on mobile
function isMobile(): boolean {
  return window.innerWidth <= 800
}

// Create the control panel UI
function createControlPanel(params: LorenzParams, onReset: () => void): HTMLElement | null {
  if (isMobile()) return null

  // Remove existing panel if present
  const existing = document.getElementById("lorenz-controls")
  if (existing) existing.remove()

  const container = document.createElement("div")
  container.id = "lorenz-controls"

  const tab = document.createElement("div")
  tab.className = "controls-tab"
  tab.textContent = "Flow Settings"
  tab.addEventListener("click", () => {
    container.classList.toggle("open")
  })

  const panel = document.createElement("div")
  panel.className = "controls-panel"

  const title = document.createElement("h4")
  title.textContent = "Lorenz Flow"
  panel.appendChild(title)

  // Define sliders with their ranges
  const sliders: {
    key: keyof LorenzParams
    label: string
    min: number
    max: number
    step: number
  }[] = [
    { key: "sigma", label: "Sigma (σ)", min: 1, max: 30, step: 0.5 },
    { key: "rho", label: "Rho (ρ)", min: 1, max: 50, step: 0.5 },
    { key: "beta", label: "Beta (β)", min: 0.1, max: 10, step: 0.1 },
    { key: "timeScale", label: "Speed", min: 0.1, max: 2, step: 0.1 },
    { key: "turbulenceAmount", label: "Turbulence", min: 0, max: 1.5, step: 0.05 },
    { key: "maxLineLength", label: "Vector Length", min: 0.1, max: 1.5, step: 0.05 },
    { key: "maxOpacity", label: "Intensity", min: 0.1, max: 1, step: 0.05 },
  ]

  for (const slider of sliders) {
    const group = document.createElement("div")
    group.className = "control-group"

    const label = document.createElement("label")
    label.textContent = slider.label
    group.appendChild(label)

    const input = document.createElement("input")
    input.type = "range"
    input.min = String(slider.min)
    input.max = String(slider.max)
    input.step = String(slider.step)
    input.value = String(params[slider.key])
    group.appendChild(input)

    const valueDisplay = document.createElement("div")
    valueDisplay.className = "control-value"
    valueDisplay.textContent = String(params[slider.key])
    group.appendChild(valueDisplay)

    input.addEventListener("input", () => {
      const value = parseFloat(input.value)
      ;(params as Record<string, number>)[slider.key] = value
      valueDisplay.textContent = value.toFixed(2)
    })

    panel.appendChild(group)
  }

  // Reset button
  const resetBtn = document.createElement("button")
  resetBtn.className = "control-reset"
  resetBtn.textContent = "Reset to Default"
  resetBtn.addEventListener("click", onReset)
  panel.appendChild(resetBtn)

  container.appendChild(tab)
  container.appendChild(panel)
  document.body.appendChild(container)

  return container
}

function createLorenzBackground() {
  // Skip on mobile
  if (isMobile()) return

  const canvas = document.getElementById("lorenz-canvas") as HTMLCanvasElement | null
  if (!canvas) return

  // Mutable params object
  const params: LorenzParams = { ...DEFAULT_PARAMS }

  // Setup renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0)

  // Setup scene
  const scene = new THREE.Scene()

  // Create group for flow points
  const group = new THREE.Group()
  group.rotation.x = -Math.PI / 2
  scene.add(group)

  // Store flow point data
  interface FlowPoint {
    dot: THREE.Mesh
    line: THREE.Mesh
    position: [number, number, number]
  }
  let flowPoints: FlowPoint[] = []
  let dotGeometry: THREE.CircleGeometry | null = null
  let lineGeometry: THREE.PlaneGeometry | null = null

  // Perturbation field — stored as flat Float32Arrays indexed [col * rows + row]
  // Double-buffered so diffusion reads from old while writing to new
  let gridCols = 0
  let gridRows = 0
  let perturbX: Float32Array = new Float32Array(0)
  let perturbY: Float32Array = new Float32Array(0)
  let tempX: Float32Array = new Float32Array(0)
  let tempY: Float32Array = new Float32Array(0)

  // Disturbance parameters
  const DISTURB_RADIUS = 3.5 // world-space radius of influence
  const DISTURB_STRENGTH = 5000 // force applied per second while holding
  const DECAY_RATE = 0.6 // slow decay so disturbance lingers
  const DIFFUSION_RATE = 18.0 // fast spread to neighbors

  // Track where the pointer is being held for continuous force application
  let pointerWorldPos: [number, number] | null = null
  // Fast-path: skip diffusion when no perturbation is active
  let perturbationActive = false
  const PERTURB_EPSILON = 0.5 // threshold below which we zero out

  // Camera reference
  let camera: THREE.OrthographicCamera

  // Calculate grid dimensions based on window size
  function calculateGridDimensions() {
    const width = window.innerWidth
    const height = window.innerHeight

    // Density factor controls needle count per pixel
    const densityFactor = 0.025

    // Add extra padding cells on each side to extend beyond visible area
    const paddingCells = 4

    const gridSizeX = Math.ceil(width * densityFactor) + paddingCells * 2
    const gridSizeY = Math.ceil(height * densityFactor) + paddingCells * 2

    // Calculate the world space dimensions
    const worldWidth = gridSizeX * params.spacing
    const worldHeight = gridSizeY * params.spacing

    return { gridSizeX, gridSizeY, worldWidth, worldHeight }
  }

  // Create or recreate the flow point grid
  function createFlowPointGrid() {
    // Clear existing points
    for (const point of flowPoints) {
      group.remove(point.dot)
      group.remove(point.line)
      if (point.dot.material instanceof THREE.Material) {
        point.dot.material.dispose()
      }
      if (point.line.material instanceof THREE.Material) {
        point.line.material.dispose()
      }
    }
    flowPoints = []

    if (dotGeometry) dotGeometry.dispose()
    if (lineGeometry) lineGeometry.dispose()

    // Small circle for the dot
    dotGeometry = new THREE.CircleGeometry(params.dotSize, 8)
    // Rectangle for the vector line (will be scaled based on velocity)
    lineGeometry = new THREE.PlaneGeometry(1, params.lineWidth)
    // Offset geometry so it extends from one end (the dot) rather than centered
    lineGeometry.translate(0.5, 0, 0)

    const { gridSizeX, gridSizeY } = calculateGridDimensions()
    gridCols = gridSizeX
    gridRows = gridSizeY

    // Allocate perturbation buffers
    const totalPoints = gridCols * gridRows
    perturbX = new Float32Array(totalPoints)
    perturbY = new Float32Array(totalPoints)
    tempX = new Float32Array(totalPoints)
    tempY = new Float32Array(totalPoints)

    // Create flow points to fill the screen
    for (let x = 0; x < gridSizeX; x++) {
      for (let y = 0; y < gridSizeY; y++) {
        const posX = (x - gridSizeX / 2) * params.spacing
        const posY = (y - gridSizeY / 2) * params.spacing

        // Create dot
        const dotMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: params.minOpacity,
        })
        const dot = new THREE.Mesh(dotGeometry, dotMaterial)
        dot.position.set(posX, posY, 0)
        group.add(dot)

        // Create line (initially invisible, will scale based on flow)
        const lineMaterial = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0,
        })
        const line = new THREE.Mesh(lineGeometry, lineMaterial)
        line.position.set(posX, posY, 0.001) // Slightly above dot
        line.scale.set(0, 1, 1) // Start with no length
        group.add(line)

        flowPoints.push({
          dot,
          line,
          position: [posX, posY, 0],
        })
      }
    }
  }

  // Setup camera based on current dimensions
  function setupCamera() {
    const { worldWidth, worldHeight } = calculateGridDimensions()

    // Frustum matches the world dimensions (grid already has padding built in)
    const frustumWidth = worldWidth
    const frustumHeight = worldHeight

    if (!camera) {
      camera = new THREE.OrthographicCamera(
        frustumWidth / -2,
        frustumWidth / 2,
        frustumHeight / 2,
        frustumHeight / -2,
        0.1,
        1000,
      )
      camera.position.set(0, 50, 0)
      camera.lookAt(0, 0, 0)
    } else {
      camera.left = frustumWidth / -2
      camera.right = frustumWidth / 2
      camera.top = frustumHeight / 2
      camera.bottom = frustumHeight / -2
    }

    camera.updateProjectionMatrix()
  }

  // Lorenz flow calculation - returns raw dx/dy and derived angle/strength
  function lorenzFlow(x: number, y: number, t: number) {
    const scale = 0.8
    const px = x * scale + Math.sin(t * 0.8) * 5.0
    const py = y * scale + Math.cos(t * 0.7) * 5.0
    const pz = 25.0 + Math.sin(t * 0.5) * 10.0

    const dx = params.sigma * (py - px)
    const dy = px * (params.rho - pz) - py

    return { dx, dy }
  }

  // Convert screen coordinates to group-local coordinates
  // Direct math: grid spans worldWidth x worldHeight centered at origin
  function screenToGroupLocal(screenX: number, screenY: number): [number, number] {
    const { worldWidth, worldHeight } = calculateGridDimensions()
    const gx = (screenX / window.innerWidth - 0.5) * worldWidth
    const gy = -(screenY / window.innerHeight - 0.5) * worldHeight
    return [gx, gy]
  }

  // Apply continuous radial disturbance — only touches grid cells within radius
  function applyDisturbance(cx: number, cy: number, dt: number) {
    const force = DISTURB_STRENGTH * dt
    // Convert world-space center to grid cell range
    const halfW = (gridCols * params.spacing) / 2
    const halfH = (gridRows * params.spacing) / 2
    const cellRadius = Math.ceil(DISTURB_RADIUS / params.spacing)
    const centerCol = Math.round((cx + halfW) / params.spacing)
    const centerRow = Math.round((cy + halfH) / params.spacing)
    const colMin = Math.max(0, centerCol - cellRadius)
    const colMax = Math.min(gridCols - 1, centerCol + cellRadius)
    const rowMin = Math.max(0, centerRow - cellRadius)
    const rowMax = Math.min(gridRows - 1, centerRow + cellRadius)

    for (let col = colMin; col <= colMax; col++) {
      for (let row = rowMin; row <= rowMax; row++) {
        const idx = col * gridRows + row
        const [px, py] = flowPoints[idx].position
        const dx = px - cx
        const dy = py - cy
        const distSq = dx * dx + dy * dy

        if (distSq < DISTURB_RADIUS * DISTURB_RADIUS && distSq > 0.0001) {
          const dist = Math.sqrt(distSq)
          const falloff = 1 - dist / DISTURB_RADIUS
          const strength = force * falloff * falloff
          perturbX[idx] += (dx / dist) * strength
          perturbY[idx] += (dy / dist) * strength
        }
      }
    }
    perturbationActive = true
  }

  // Check if an element is interactive
  function isInteractiveElement(el: Element | null): boolean {
    while (el) {
      const tag = el.tagName?.toLowerCase()
      if (
        tag === "a" || tag === "button" || tag === "input" ||
        tag === "textarea" || tag === "select" || tag === "label"
      ) return true
      if (el.id === "lorenz-controls") return true
      if ((el as HTMLElement).getAttribute?.("role") === "button") return true
      el = el.parentElement
    }
    return false
  }

  function onPointerDown(e: PointerEvent) {
    if (isInteractiveElement(e.target as Element)) return
    pointerWorldPos = screenToGroupLocal(e.clientX, e.clientY)
  }

  function onPointerMove(e: PointerEvent) {
    if (!pointerWorldPos) return
    pointerWorldPos = screenToGroupLocal(e.clientX, e.clientY)
  }

  function onPointerUp() {
    pointerWorldPos = null
  }

  document.addEventListener("pointerdown", onPointerDown)
  document.addEventListener("pointermove", onPointerMove)
  document.addEventListener("pointerup", onPointerUp)

  // Debounce helper
  let resizeTimeout: ReturnType<typeof setTimeout> | null = null

  // Handle resize with debouncing
  function handleResize() {
    // If resized to mobile, cleanup
    if (isMobile()) {
      cleanup?.()
      return
    }

    renderer.setSize(window.innerWidth, window.innerHeight)
    setupCamera()

    if (resizeTimeout) {
      clearTimeout(resizeTimeout)
    }
    resizeTimeout = setTimeout(() => {
      createFlowPointGrid()
      setupCamera()
    }, 250)
  }

  // Reset params to defaults
  function resetParams() {
    Object.assign(params, DEFAULT_PARAMS)
    // Update slider values in UI
    const controls = document.getElementById("lorenz-controls")
    if (controls) {
      const inputs = controls.querySelectorAll("input[type=range]")
      const values = controls.querySelectorAll(".control-value")
      const keys: (keyof LorenzParams)[] = [
        "sigma",
        "rho",
        "beta",
        "timeScale",
        "turbulenceAmount",
        "maxLineLength",
        "maxOpacity",
      ]
      inputs.forEach((input, i) => {
        ;(input as HTMLInputElement).value = String(params[keys[i]])
        values[i].textContent = String(params[keys[i]])
      })
    }
  }

  // Create control panel
  const controlPanel = createControlPanel(params, resetParams)

  // Initial setup
  createFlowPointGrid()
  setupCamera()
  renderer.setSize(window.innerWidth, window.innerHeight)

  window.addEventListener("resize", handleResize)

  // Animation loop
  const clock = new THREE.Clock()
  let animationId: number
  let lastFrameTime = 0

  function animate() {
    animationId = requestAnimationFrame(animate)

    const elapsed = clock.getElapsedTime()
    const rawDt = elapsed - lastFrameTime
    lastFrameTime = elapsed
    const dt = Math.min(rawDt, 0.05)

    const time = elapsed * params.timeScale

    // --- Apply continuous force while pointer is held ---
    if (pointerWorldPos) {
      applyDisturbance(pointerWorldPos[0], pointerWorldPos[1], dt)
    }

    // --- Diffusion + decay (only when perturbation is active) ---
    if (perturbationActive) {
      const D = DIFFUSION_RATE * dt
      const Dc = Math.min(D, 0.24)

      for (let col = 0; col < gridCols; col++) {
        for (let row = 0; row < gridRows; row++) {
          const idx = col * gridRows + row
          const cx = perturbX[idx]
          const cy = perturbY[idx]

          let sumX = 0, sumY = 0
          let neighbors = 0
          if (col > 0) { const n = (col - 1) * gridRows + row; sumX += perturbX[n]; sumY += perturbY[n]; neighbors++ }
          if (col < gridCols - 1) { const n = (col + 1) * gridRows + row; sumX += perturbX[n]; sumY += perturbY[n]; neighbors++ }
          if (row > 0) { const n = col * gridRows + (row - 1); sumX += perturbX[n]; sumY += perturbY[n]; neighbors++ }
          if (row < gridRows - 1) { const n = col * gridRows + (row + 1); sumX += perturbX[n]; sumY += perturbY[n]; neighbors++ }

          tempX[idx] = cx + Dc * (sumX - neighbors * cx)
          tempY[idx] = cy + Dc * (sumY - neighbors * cy)
        }
      }

      // Swap buffers, apply decay, and check if anything is still active
      const decay = Math.exp(-DECAY_RATE * dt)
      let anyActive = false
      for (let i = 0; i < perturbX.length; i++) {
        let vx = tempX[i] * decay
        let vy = tempY[i] * decay
        // Zero out tiny values so we can go idle sooner
        if (vx * vx + vy * vy < PERTURB_EPSILON * PERTURB_EPSILON) {
          vx = 0; vy = 0
        } else {
          anyActive = true
        }
        perturbX[i] = vx
        perturbY[i] = vy
      }
      perturbationActive = anyActive
    }

    // --- Update each flow point visual ---
    for (let i = 0; i < flowPoints.length; i++) {
      const point = flowPoints[i]
      const [x, y] = point.position

      const { dx: lorenzDx, dy: lorenzDy } = lorenzFlow(x, y, time)

      // Only add perturbation when active (avoids reading cold arrays)
      const totalDx = perturbationActive ? lorenzDx + perturbX[i] : lorenzDx
      const totalDy = perturbationActive ? lorenzDy + perturbY[i] : lorenzDy

      const turbulence =
        Math.sin(x * 0.5 + time * 2.0) * Math.cos(y * 0.5 + time * 1.7) * params.turbulenceAmount
      const finalAngle = Math.atan2(totalDy, totalDx) + turbulence

      const magnitude = Math.sqrt(totalDx * totalDx + totalDy * totalDy)
      const strength = Math.min(magnitude / 300, 1.0)

      point.line.rotation.z = finalAngle
      point.line.scale.set(strength * params.maxLineLength, 1, 1)

      const dotOpacity =
        params.minOpacity + strength * (params.maxOpacity - params.minOpacity) * 0.3
      const lineOpacity = strength * params.maxOpacity

      if (point.dot.material instanceof THREE.MeshBasicMaterial) {
        point.dot.material.opacity = dotOpacity
      }
      if (point.line.material instanceof THREE.MeshBasicMaterial) {
        point.line.material.opacity = lineOpacity
      }
    }

    renderer.render(scene, camera)
  }

  animate()

  // Cleanup function (for SPA navigation)
  const cleanup = () => {
    cancelAnimationFrame(animationId)
    window.removeEventListener("resize", handleResize)
    document.removeEventListener("pointerdown", onPointerDown)
    document.removeEventListener("pointermove", onPointerMove)
    document.removeEventListener("pointerup", onPointerUp)
    if (resizeTimeout) {
      clearTimeout(resizeTimeout)
    }
    renderer.dispose()
    if (dotGeometry) dotGeometry.dispose()
    if (lineGeometry) lineGeometry.dispose()
    for (const point of flowPoints) {
      if (point.dot.material instanceof THREE.Material) {
        point.dot.material.dispose()
      }
      if (point.line.material instanceof THREE.Material) {
        point.line.material.dispose()
      }
    }
    if (controlPanel) controlPanel.remove()
  }

  return cleanup
}

// Initialize on DOM load
let cleanup: (() => void) | undefined

document.addEventListener("nav", () => {
  // Cleanup previous instance if it exists
  if (cleanup) {
    cleanup()
    cleanup = undefined
  }

  // Skip on mobile
  if (isMobile()) return

  // Initialize new instance
  cleanup = createLorenzBackground()
})

// Also initialize on first load
if (document.readyState === "complete" || document.readyState === "interactive") {
  if (!isMobile()) {
    cleanup = createLorenzBackground()
  }
} else {
  document.addEventListener("DOMContentLoaded", () => {
    if (!isMobile()) {
      cleanup = createLorenzBackground()
    }
  })
}
