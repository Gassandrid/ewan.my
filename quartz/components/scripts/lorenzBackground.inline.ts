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

  // Lorenz flow calculation - returns direction and strength
  function lorenzFlow(x: number, y: number, t: number) {
    const scale = 0.8
    const px = x * scale + Math.sin(t * 0.8) * 5.0
    const py = y * scale + Math.cos(t * 0.7) * 5.0
    const pz = 25.0 + Math.sin(t * 0.5) * 10.0

    const dx = params.sigma * (py - px)
    const dy = px * (params.rho - pz) - py

    const angle = Math.atan2(dy, dx)
    const magnitude = Math.sqrt(dx * dx + dy * dy)
    // Normalize strength to 0-1 range (typical magnitude is 0-400)
    const strength = Math.min(magnitude / 300, 1.0)

    return { angle, strength }
  }

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

  function animate() {
    animationId = requestAnimationFrame(animate)

    const time = clock.getElapsedTime() * params.timeScale

    // Update each flow point
    for (const point of flowPoints) {
      const [x, y] = point.position

      const { angle, strength } = lorenzFlow(x, y, time)

      // Add subtle turbulence
      const turbulence =
        Math.sin(x * 0.5 + time * 2.0) * Math.cos(y * 0.5 + time * 1.7) * params.turbulenceAmount
      const finalAngle = angle + turbulence

      // Update line rotation and scale based on flow
      point.line.rotation.z = finalAngle
      // Scale line length by strength (0 to maxLineLength)
      const lineLength = strength * params.maxLineLength
      point.line.scale.set(lineLength, 1, 1)

      // Update opacities based on strength
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
