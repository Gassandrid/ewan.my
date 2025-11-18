
function setupQuartzTOC() {
    const toc = document.getElementById("quartztoc")
    if (!toc) return

    const nav = toc.querySelector("#quartztoc-vertical") as HTMLElement
    if (!nav) return

    const buttons = toc.querySelectorAll("button[data-for]") as NodeListOf<HTMLButtonElement>

    // Function to update the wave based on the active button
    const updateWave = (activeButton: HTMLButtonElement | null) => {
        if (!activeButton) {
            // Reset if nothing active
            buttons.forEach((btn) => {
                const fill = btn.querySelector(".fill") as HTMLElement
                if (fill) {
                    fill.style.transform = "scaleX(1)"
                    fill.style.opacity = "0.35"
                }
                const indicator = btn.querySelector(".indicator") as HTMLElement
                if (indicator) {
                    indicator.style.transform = "translateY(-50%) scale(0.65)"
                    indicator.style.opacity = "0.25"
                    indicator.style.fontWeight = "400"
                }
            })
            return
        }

        const navRect = nav.getBoundingClientRect()
        const activeRect = activeButton.getBoundingClientRect()
        const activeY = activeRect.top + activeRect.height / 2 - navRect.top

        buttons.forEach((button) => {
            const buttonRect = button.getBoundingClientRect()
            const buttonY = buttonRect.top + buttonRect.height / 2 - navRect.top

            const distance = Math.abs(activeY - buttonY)
            const sigma = 42 // Width of the gaussian curve
            const maxScale = 4.5 // Max scale factor (approx --indicator-position)
            const minScale = 1   // Min scale factor

            const isButton = button === activeButton

            const fill = button.querySelector(".fill") as HTMLElement
            if (fill) {
                fill.style.transition = "transform 0.2s ease, opacity 0.2s ease"
                fill.style.opacity = isButton ? "1" : "0.35"

                // Gaussian function
                const scale = minScale + (maxScale - minScale) * Math.exp(-Math.pow(distance, 2) / (2 * Math.pow(sigma, 2)))
                fill.style.transform = `scaleX(${scale})`
            }

            const indicator = button.querySelector(".indicator") as HTMLElement
            if (indicator) {
                indicator.style.transition = "transform 0.2s ease, opacity 0.2s ease"
                // Scale indicator based on distance too, but different range
                const indMinScale = 0.65 // Smaller min scale
                const indMaxScale = 1.1
                // Use a tighter sigma for text to reduce overlap
                const textSigma = 24
                const indScale = indMinScale + (indMaxScale - indMinScale) * Math.exp(-Math.pow(distance, 2) / (2 * Math.pow(textSigma, 2)))

                indicator.style.transform = `translateY(-50%) scale(${indScale})`
                indicator.style.opacity = isButton ? "1" : "0.25" // Dimmer inactive
                indicator.style.fontWeight = isButton ? "600" : "400"
            }
        })
    }

    // Click handler to scroll to section
    const onClick = (evt: MouseEvent) => {
        const target = evt.target as HTMLElement
        const button = target.closest("button") as HTMLButtonElement
        if (!button) return

        const href = button.dataset.href
        if (!href) return

        evt.preventDefault()
        const elementId = href.slice(1)
        const element = document.getElementById(elementId)
        if (element) {
            element.scrollIntoView({ behavior: "smooth" })
            history.pushState(null, "", href)
        }
    }

    buttons.forEach((btn) => {
        btn.addEventListener("click", onClick)
        window.addCleanup(() => btn.removeEventListener("click", onClick))
    })

    // Intersection Observer to track active section
    const observer = new IntersectionObserver((entries) => {
        // We want to find the currently active section.
        // Since multiple can be in view, we usually pick the top-most intersecting one.
        // However, the observer fires for *changes*.

        // Let's check all headers to find the current active one
        const headers = Array.from(document.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]"))

        let activeHeader: Element | null = null

        // Find the first header that is above the bottom of the viewport?
        // Or the one closest to the top of the viewport.

        // Simple heuristic: The last header that is above the 20% mark of the viewport
        const threshold = window.innerHeight * 0.2

        for (const header of headers) {
            const rect = header.getBoundingClientRect()
            if (rect.top < threshold) {
                activeHeader = header
            } else {
                break // Passed the threshold
            }
        }

        // If no header is above threshold (top of page), maybe the first one?
        if (!activeHeader && headers.length > 0) {
            // Check if the first header is visible
            const firstRect = headers[0].getBoundingClientRect()
            if (firstRect.top < window.innerHeight) {
                activeHeader = headers[0]
            }
        }

        if (activeHeader) {
            const slug = activeHeader.id
            const activeButton = toc.querySelector(`button[data-for="${slug}"]`) as HTMLButtonElement
            updateWave(activeButton)
        } else {
            updateWave(null)
        }

    }, {
        rootMargin: "-10% 0px -80% 0px", // Adjust to trigger nicely
        threshold: [0, 1]
    })

    const headers = document.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]")
    headers.forEach((header) => observer.observe(header))

    // Also update on scroll to be smoother if needed, but observer might be enough.
    // For "smooth wave as you scroll", we might need a scroll listener if the observer is too jumpy.
    // Let's add a scroll listener that throttles finding the active header.

    const onScroll = () => {
        // Re-run the active header logic
        const threshold = window.innerHeight * 0.3
        const headers = Array.from(document.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]"))
        let activeHeader: Element | null = null

        for (const header of headers) {
            const rect = header.getBoundingClientRect()
            if (rect.top < threshold) {
                activeHeader = header
            } else {
                break
            }
        }

        if (activeHeader) {
            const slug = activeHeader.id
            const activeButton = toc.querySelector(`button[data-for="${slug}"]`) as HTMLButtonElement
            updateWave(activeButton)
        }
    }

    document.addEventListener("scroll", onScroll, { passive: true })
    window.addCleanup(() => {
        document.removeEventListener("scroll", onScroll)
        observer.disconnect()
    })

    // Initial update
    onScroll()
}

window.addEventListener("resize", setupQuartzTOC)
document.addEventListener("nav", setupQuartzTOC)
