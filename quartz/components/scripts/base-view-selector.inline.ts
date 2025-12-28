// single document-level click handler for all dropdowns
let documentClickHandler: ((e: MouseEvent) => void) | null = null

function setupBaseViewSelector() {
  const selectors = document.querySelectorAll("[data-base-view-selector]")

  // prevent duplicate initialization
  if (selectors.length === 0) return

  // set up document-level click handler once
  if (!documentClickHandler) {
    documentClickHandler = (e: MouseEvent) => {
      // close any open dropdowns that were clicked outside of
      document.querySelectorAll("[data-base-view-selector]").forEach((selector) => {
        if (!selector.contains(e.target as Node)) {
          const trigger = selector.querySelector(".text-icon-button") as HTMLElement
          if (trigger?.getAttribute("aria-expanded") === "true") {
            const closeEvent = new CustomEvent("close-dropdown")
            selector.dispatchEvent(closeEvent)
          }
        }
      })
    }
    document.addEventListener("click", documentClickHandler)
    window.addCleanup(() => {
      if (documentClickHandler) {
        document.removeEventListener("click", documentClickHandler)
        documentClickHandler = null
      }
    })
  }

  selectors.forEach((selector) => {
    // prevent duplicate initialization
    if (selector.hasAttribute("data-initialized")) return
    selector.setAttribute("data-initialized", "true")

    const trigger = selector.querySelector(".text-icon-button") as HTMLElement
    const dropdown = selector.querySelector("[data-dropdown]") as HTMLElement
    const searchInput = selector.querySelector("[data-search-input]") as HTMLInputElement
    const clearButton = selector.querySelector("[data-clear-search]") as HTMLElement
    const viewList = selector.querySelector("[data-view-list]") as HTMLElement

    if (!trigger || !dropdown || !searchInput || !viewList) return

    // toggle dropdown
    function toggleDropdown() {
      const isOpen = trigger.getAttribute("aria-expanded") === "true"
      if (isOpen) {
        closeDropdown()
      } else {
        openDropdown()
      }
    }

    function openDropdown() {
      trigger.setAttribute("aria-expanded", "true")
      trigger.classList.add("has-active-menu")
      // focus search input
      setTimeout(() => searchInput.focus(), 10)
    }

    function closeDropdown() {
      trigger.setAttribute("aria-expanded", "false")
      trigger.classList.remove("has-active-menu")
      searchInput.value = ""
      if (clearButton) clearButton.hidden = true
      // reset filter
      filterViews("")
    }

    // filter views based on search
    function filterViews(query: string) {
      const items = viewList.querySelectorAll<HTMLElement>(".bases-toolbar-menu-item")
      const lowerQuery = query.toLowerCase()

      items.forEach((item) => {
        const viewName = (item.getAttribute("data-view-name") || "").toLowerCase()
        const matches = viewName.includes(lowerQuery)
        item.style.display = matches ? "" : "none"
      })
    }

    // handle search input
    function handleSearchInput() {
      const query = searchInput.value
      filterViews(query)

      // show/hide clear button
      if (clearButton) {
        clearButton.hidden = query.length === 0
      }
    }

    // clear search
    function clearSearch() {
      searchInput.value = ""
      if (clearButton) clearButton.hidden = true
      filterViews("")
      searchInput.focus()
    }

    // event handlers
    const handleTriggerClick = (e: MouseEvent) => {
      e.stopPropagation()
      toggleDropdown()
    }

    const handleTriggerKeydown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        toggleDropdown()
      }
    }

    const handleSearchKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (searchInput.value) {
          clearSearch()
        } else {
          closeDropdown()
        }
      }
    }

    const handleClearClick = (e: MouseEvent) => {
      e.stopPropagation()
      clearSearch()
    }

    const handleCloseDropdown = () => {
      closeDropdown()
    }

    // add event listeners
    trigger.addEventListener("click", handleTriggerClick)
    trigger.addEventListener("keydown", handleTriggerKeydown)
    searchInput.addEventListener("input", handleSearchInput)
    searchInput.addEventListener("keydown", handleSearchKeydown)

    if (clearButton) {
      clearButton.addEventListener("click", handleClearClick)
    }

    // close dropdown when any view link is clicked
    const viewLinks = viewList.querySelectorAll(".bases-toolbar-menu-item")
    viewLinks.forEach((link) => {
      const handleLinkClick = () => {
        closeDropdown()
      }
      link.addEventListener("click", handleLinkClick)
      window.addCleanup(() => link.removeEventListener("click", handleLinkClick))
    })

    // listen for close event from document click handler
    selector.addEventListener("close-dropdown", handleCloseDropdown)

    // cleanup all event listeners
    window.addCleanup(() => {
      trigger.removeEventListener("click", handleTriggerClick)
      trigger.removeEventListener("keydown", handleTriggerKeydown)
      searchInput.removeEventListener("input", handleSearchInput)
      searchInput.removeEventListener("keydown", handleSearchKeydown)
      if (clearButton) {
        clearButton.removeEventListener("click", handleClearClick)
      }
      selector.removeEventListener("close-dropdown", handleCloseDropdown)
      selector.removeAttribute("data-initialized")
      closeDropdown()
    })
  })
}

document.addEventListener("nav", setupBaseViewSelector)
