// from cat code me's quartz garden
//
declare global {
  interface Window {
    readingMode: boolean
    toggleReadingMode: (active: boolean) => void
    saveState: (state: boolean) => void
  }
}

let notesContainer: HTMLDivElement | null = null
let readingMode = false
let handleScroll: (() => void) | null = null
let observer: MutationObserver | null = null
let originalTocPosition: { parent: HTMLElement; element: HTMLElement } | null = null
let readingModeHint: HTMLDivElement | null = null

// 清理函数
const cleanup = () => {
  if (notesContainer) {
    notesContainer.remove()
    notesContainer = null
  }

  if (handleScroll) {
    window.removeEventListener("scroll", handleScroll)
    window.removeEventListener("resize", handleScroll)
    window.removeEventListener("hashchange", handleScroll)
    window.removeEventListener("popstate", handleScroll)
    window.removeEventListener("wheel", handleScroll)
  }

  if (observer) {
    observer.disconnect()
    observer = null
  }

  // 恢复 TOC 位置
  const toc = document.querySelector(".toc")
  if (toc && originalTocPosition) {
    if (originalTocPosition.element) {
      originalTocPosition.element.style.display = ""
    }
    originalTocPosition = null
    toc.classList.remove("visible")
  }
}

// 移除提示
const removeHint = () => {
  if (readingModeHint) {
    readingModeHint.remove()
    readingModeHint = null
  }
}

// 滚动到指定元素
const scrollToElement = (element: Element) => {
  const offset = 80
  const elementRect = element.getBoundingClientRect()
  const absoluteElementTop = elementRect.top + window.scrollY

  // 使用新的 ScrollToOptions 类型
  const scrollOptions: ScrollToOptions = {
    top: absoluteElementTop - offset,
    behavior: "smooth",
  }

  try {
    window.scrollTo(scrollOptions)
  } catch (e) {
    // 兼容不支持平滑滚动的浏览器
    window.scrollTo(0, absoluteElementTop - offset)
  }
}

// 修改锚点链接行为
const adjustAnchorClick = () => {
  const allAnchors = document.querySelectorAll('a[href^="#"]')
  allAnchors.forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      e.preventDefault()
      const href = anchor.getAttribute("href")
      if (!href) return

      const targetElement = document.querySelector(href)
      if (targetElement) {
        scrollToElement(targetElement)
        history.pushState(null, "", href)
      }
    })
  })
}

// 防抖函数
function debounce(func: Function, wait: number) {
  let timeout: number
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = window.setTimeout(later, wait)
  }
}

// 更新边注位置
const updateNotePositions = () => {
  if (!notesContainer) return

  const article = document.querySelector("article")
  if (!article) return

  const refs = Array.from(article.querySelectorAll("a[data-footnote-ref]")).filter(
    (ref) => !ref.closest(".popover"),
  )

  let lastBottom = -Infinity
  const minGap = 20

  const noteDivs = Array.from(notesContainer.children) as HTMLElement[]
  const noteHeights = noteDivs.map((div) => {
    const style = getComputedStyle(div)
    return (
      parseFloat(style.paddingTop) +
      parseFloat(style.paddingBottom) +
      parseFloat(style.minHeight || "0")
    )
  })

  refs.forEach((ref, index) => {
    const noteDiv = notesContainer?.children[index] as HTMLElement
    if (!noteDiv) return

    const refRect = ref.getBoundingClientRect()
    let newTop = refRect.top

    const totalGap = minGap + noteHeights[index]

    if (newTop < lastBottom + totalGap) {
      newTop = lastBottom + totalGap
    }

    noteDiv.style.transform = `translate3d(0, ${newTop}px, 0) translateY(-50%)`
    lastBottom = newTop + noteHeights[index]

    const isVisible = refRect.top >= -totalGap && refRect.top <= window.innerHeight + totalGap

    noteDiv.style.opacity = isVisible ? "1" : "0"
  })
}

// 初始化边注
const initializeSideNotes = () => {
  cleanup()

  const footnotes = document.querySelector("article .footnotes")
  if (!footnotes) return

  const article = document.querySelector("article")
  if (!article) return

  notesContainer = document.createElement("div")
  notesContainer.className = "side-notes-container"

  const articleReact = article.getBoundingClientRect()
  notesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: ${articleReact.right + 80}px;
        width: 300px;
        height: 100vh;
        pointer-events: none;
        z-index: 1000;
    `

  const refs = Array.from(article.querySelectorAll("a[data-footnote-ref]")).filter(
    (ref) => !ref.closest(".popover"),
  )
  const notes = Array.from(footnotes.querySelectorAll('li[id^="user-content-fn-"]')).filter(
    (note) => {
      return (
        !note.closest(".popover") &&
        refs.some((ref) => {
          const refId = ref.id.replace("user-content-fnref-", "")
          const noteId = note.id.replace("user-content-fn-", "")
          return refId === noteId
        })
      )
    },
  )

  if (refs.length === 0 || notes.length === 0) return

  refs.forEach((ref, index) => {
    const refId = ref.id.replace("user-content-fnref-", "")
    const note = notes.find((n) => n.id === `user-content-fn-${refId}`)
    if (!note) return

    const refNumber = (index + 1).toString()

    const noteDiv = document.createElement("div")
    noteDiv.className = "side-note"
    noteDiv.dataset.noteId = refId

    noteDiv.style.cssText = `
            position: absolute;
            top: 0;
            right: 0;
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.2s ease;
        `

    const content = note.cloneNode(true) as HTMLElement
    const backref = content.querySelector(".data-footnote-backref")
    const backrefHref = backref?.getAttribute("href") || `#user-content-fnref-${refId}`
    backref?.remove()

    noteDiv.innerHTML = `
            <div class="note-number" role="button" tabindex="0" data-href="${backrefHref}">${refNumber}</div>
            <div class="note-content">${content.innerHTML}</div>
        `

    const noteNumber = noteDiv.querySelector(".note-number")
    if (noteNumber) {
      noteNumber.addEventListener("click", () => {
        const href = noteNumber.getAttribute("data-href")
        if (!href) return

        const targetElement = document.querySelector(href)
        if (targetElement) {
          scrollToElement(targetElement)
          history.pushState(null, "", href)
        }
      })
    }

    notesContainer.appendChild(noteDiv)
  })

  document.body.appendChild(notesContainer)

  handleScroll = debounce(() => {
    requestAnimationFrame(updateNotePositions)
  }, 10)

  window.addEventListener("scroll", handleScroll)
  window.addEventListener("resize", handleScroll)
  window.addEventListener("hashchange", handleScroll)
  window.addEventListener("popstate", handleScroll)
  window.addEventListener("wheel", handleScroll)

  setTimeout(updateNotePositions, 100)

  observer = new MutationObserver(() => {
    if (handleScroll) handleScroll()
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  })

  adjustAnchorClick()
}

// 创建阅读模式提示
const createReadingModeHint = () => {
  const existingHint = document.querySelector(".reading-mode-hint")
  if (existingHint) existingHint.remove()

  const hint = document.createElement("div")
  hint.className = "reading-mode-hint"
  hint.textContent = "Press ESC to exit"
  hint.style.cursor = "pointer"
  document.body.appendChild(hint)

  // 处理点击事件
  const exitReadingMode = (e: Event) => {
    e.preventDefault()
    window.toggleReadingMode(false)
    readingMode = false
    window.saveState(false)
    // 移除按钮的焦点
    const button = document.querySelector(".reading-mode-toggle")
    if (button instanceof HTMLElement) {
      button.blur()
    }
  }

  // 处理 ESC 按键
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault()
      exitReadingMode(e)
    }
  }

  hint.addEventListener("click", exitReadingMode)
  document.addEventListener("keydown", handleEsc)

  // 保存引用以便后续清理
  readingModeHint = hint
}

// 创建欢迎提示
const createWelcomeMessage = () => {
  const welcome = document.createElement("div")
  welcome.className = "reading-mode-welcome"
  welcome.textContent = "Reading Mode Enabled"
  document.body.appendChild(welcome)

  setTimeout(() => {
    welcome.style.opacity = "0"
    setTimeout(() => welcome.remove(), 300)
  }, 2000)
}

// 切换阅读模式
const toggleReadingMode = (active: boolean) => {
  const button = document.querySelector(".reading-mode-toggle")
  if (!button) return

  button.classList.toggle("active", active)
  document.documentElement.classList.toggle("reading-mode", active)

  const sidebars = document.querySelectorAll(".sidebar") as NodeListOf<HTMLElement>
  const leftSidebar = document.querySelector(".left.sidebar") as HTMLElement
  const toc = document.querySelector(".toc") as HTMLElement | null

  // 清理已存在的克隆 TOC
  const existingTocClone = document.querySelector(".toc-clone")
  if (existingTocClone) {
    existingTocClone.remove()
  }

  if (active) {
    createWelcomeMessage()

    // 确保左侧边栏可见
    if (leftSidebar) {
      leftSidebar.classList.add("reading-mode-active")

      // 复制并移动 TOC
      if (toc) {
        const tocClone = toc.cloneNode(true) as HTMLElement
        originalTocPosition = {
          parent: toc.parentElement as HTMLElement,
          element: toc,
        }

        // 隐藏原始 TOC
        toc.style.display = "none"

        // 添加克隆的 TOC
        tocClone.classList.add("toc-clone")
        leftSidebar.appendChild(tocClone)

        // 为克隆的 TOC 重新绑定事件
        const links = tocClone.querySelectorAll("a")
        links.forEach((link) => {
          link.addEventListener("click", (e) => {
            e.preventDefault()
            const href = link.getAttribute("href")
            if (href) {
              const target = document.querySelector(href)
              if (target) {
                target.scrollIntoView({ behavior: "smooth" })
              }
            }
          })
        })

        // 延迟添加可见性类，确保过渡动画生效
        requestAnimationFrame(() => {
          tocClone.classList.add("visible")
        })
      }

      // 延迟显示 ESC 提示，避免与 TOC 重叠
      setTimeout(createReadingModeHint, 300)
    }

    // 隐藏其他元素
    requestAnimationFrame(() => {
      sidebars.forEach((sidebar) => {
        if (sidebar.classList.contains("left")) {
          Array.from(sidebar.children).forEach((child) => {
            if (!child.classList.contains("toc-clone") && child instanceof HTMLElement) {
              child.classList.add("hidden-in-reading-mode")
            }
          })
        } else {
          sidebar.classList.add("hidden-in-reading-mode")
        }
      })
    })

    setTimeout(initializeSideNotes, 100)
  } else {
    cleanup()

    // 恢复所有元素的可见性
    sidebars.forEach((sidebar) => {
      sidebar.classList.remove("hidden-in-reading-mode", "reading-mode-active")
      if (sidebar.classList.contains("left")) {
        Array.from(sidebar.children).forEach((child) => {
          if (child instanceof HTMLElement) {
            child.classList.remove("hidden-in-reading-mode")
          }
        })
      }
    })

    // 恢复 TOC
    if (originalTocPosition?.element) {
      originalTocPosition.element.style.display = ""
      originalTocPosition = null
    }

    // 移除提示
    const hint = document.querySelector(".reading-mode-hint")
    if (hint) hint.remove()
  }

  button.setAttribute("aria-pressed", active.toString())
}

// 保存状态
const saveState = (state: boolean) => {
  localStorage.setItem("readingMode", state.toString())
}

// 添加快捷键处理
const setupShortcuts = () => {
  const shortcutHandler = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "e") {
      e.preventDefault()
      const button = document.querySelector(".reading-mode-toggle")
      if (button) {
        readingMode = !readingMode
        toggleReadingMode(readingMode)
        saveState(readingMode)
      }
    }
  }

  // 添加全局事件监听
  document.addEventListener("keydown", shortcutHandler)
  // 确保清理
  window.addCleanup(() => document.removeEventListener("keydown", shortcutHandler))
}

// 修改setupReadingMode函数
const setupReadingMode = () => {
  const button = document.querySelector(".reading-mode-toggle")
  if (!button) return

  const savedState = localStorage.getItem("readingMode") === "true"
  if (savedState) {
    readingMode = true
    toggleReadingMode(true)
  }

  const handleClick = () => {
    readingMode = !readingMode
    toggleReadingMode(readingMode)
    saveState(readingMode)
  }
  button.addEventListener("click", handleClick)
  window.addCleanup(() => button.removeEventListener("click", handleClick))

  // 添加快捷键支持
  setupShortcuts()

  // 添加ESC退出支持
  document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape" && readingMode) {
      readingMode = false
      toggleReadingMode(false)
      saveState(false)
    }
  })

  window.readingMode = readingMode
  window.toggleReadingMode = toggleReadingMode
  window.saveState = saveState
}

document.addEventListener("nav", () => {
  setTimeout(setupReadingMode, 0)
})
