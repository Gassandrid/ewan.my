function setupBaseSearch() {
  const searchInput = document.getElementById("base-search-input") as HTMLInputElement | null
  if (!searchInput) {
    return
  }

  const root = (document.querySelector("article.main-col") as HTMLElement | null) ?? document.body
  if (!root) {
    return
  }

  const items: HTMLElement[] = []

  const tableRows = root.querySelectorAll<HTMLTableRowElement>("table.base-table tbody tr")
  tableRows.forEach((row) => items.push(row as HTMLElement))

  const listItems = root.querySelectorAll<HTMLLIElement>(".base-list > li")
  listItems.forEach((li) => items.push(li as HTMLElement))

  const cardItems = root.querySelectorAll<HTMLDivElement>(".base-card")
  cardItems.forEach((card) => items.push(card as HTMLElement))

  const filterItems = () => {
    const query = searchInput.value.toLowerCase().trim()
    if (query.length === 0) {
      items.forEach((item) => {
        item.style.display = ""
      })
      return
    }

    items.forEach((item) => {
      const text = item.textContent?.toLowerCase() || ""
      item.style.display = text.includes(query) ? "" : "none"
    })
  }

  const handleInput = () => {
    filterItems()
  }

  const handleKeydown = (e: KeyboardEvent) => {
    const activeElement = document.activeElement as HTMLElement | null
    const isTypingInInput =
      activeElement instanceof HTMLInputElement ||
      activeElement instanceof HTMLTextAreaElement ||
      activeElement?.getAttribute("contenteditable") === "true"

    const searchContainers = document.querySelectorAll<HTMLElement>(".search-container")
    const globalSearchOpen = Array.from(searchContainers).some((el) =>
      el.classList.contains("active"),
    )

    if (e.key === "k" && (e.metaKey || e.ctrlKey) && !e.shiftKey) {
      if (globalSearchOpen || isTypingInInput) {
        return
      }
      e.preventDefault()
      searchInput.focus()
      searchInput.select()
    } else if (e.key === "Escape") {
      if (document.activeElement === searchInput) {
        searchInput.blur()
      }
    }
  }

  searchInput.addEventListener("input", handleInput)
  document.addEventListener("keydown", handleKeydown)

  if (window.addCleanup) {
    window.addCleanup(() => {
      searchInput.removeEventListener("input", handleInput)
      document.removeEventListener("keydown", handleKeydown)
    })
  }
}

document.addEventListener("nav", () => {
  setupBaseSearch()
})
