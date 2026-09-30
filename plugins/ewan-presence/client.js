import { playhtml, resetPlayHTML } from "playhtml"

const CHANNEL = "garden-arrival"
const ROOM = "front-page"
const COLORS = ["pine", "slate", "rust", "mauve", "ochre", "sage"]
const ADJECTIVES = [
  "quiet",
  "curious",
  "wandering",
  "gentle",
  "bright",
  "patient",
  "hidden",
  "little",
  "silver",
  "amber",
  "early",
  "drifting",
  "mossy",
  "sleepy",
  "nimble",
  "sunny",
]
const NOUNS = [
  "fern",
  "finch",
  "moth",
  "willow",
  "wren",
  "fox",
  "clover",
  "otter",
  "robin",
  "birch",
  "hare",
  "lark",
  "cedar",
  "heron",
  "badger",
  "maple",
]

function identity(key) {
  let hash = 2166136261
  for (const char of key) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0
  return {
    name: `${ADJECTIVES[hash % ADJECTIVES.length]} ${NOUNS[(hash >>> 8) % NOUNS.length]}`,
    color: `var(--${COLORS[(hash >>> 16) % COLORS.length]})`,
  }
}

function note(text) {
  const li = document.createElement("li")
  li.className = "presence-empty"
  li.textContent = text
  return li
}

function row(visitor, timestamp) {
  const li = document.createElement("li")
  const chip = document.createElement("i")
  chip.className = "presence-chip"
  chip.style.setProperty("--visitor-ink", visitor.color)
  chip.setAttribute("aria-hidden", "true")
  const name = document.createElement("span")
  name.className = "presence-name"
  name.textContent = visitor.isMe ? `${visitor.name} (you)` : visitor.name
  const time = document.createElement("time")
  time.dateTime = new Date(timestamp).toISOString()
  time.textContent = new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
  time.title = new Date(timestamp).toLocaleString()
  li.append(chip, name, time)
  return li
}

// This is the site's sole PlayHTML owner. Pin the package because its full
// teardown export is test-oriented; it closes all sockets, observers and cursors.
let disposePrevious
export function mount(board) {
  disposePrevious?.()
  let disposed = false
  let epoch = 0
  let unsubscribe
  let timeout
  let roster = new Map()
  let departures = []
  let firstSnapshot = true
  let joined = false
  const status = board.querySelector("[data-presence-status]")
  const arrivals = board.querySelector("[data-arrivals]")
  const departed = board.querySelector("[data-departures]")

  function setState(state, label) {
    board.dataset.state = state
    status.textContent = label
  }

  function render(presences) {
    if (!joined || disposed) return
    const next = new Map()
    const now = Date.now()
    for (const [id, view] of presences) {
      const at = view?.[CHANNEL]?.at
      // Peer data never becomes HTML or CSS. Reject malformed timestamps too.
      if (!Number.isFinite(at) || at < now - 7 * 86400000 || at > now + 60000) continue
      const key =
        typeof view.playerIdentity?.publicKey === "string"
          ? view.playerIdentity.publicKey.slice(0, 512)
          : String(id).slice(0, 512)
      next.set(id, { ...identity(key), at, isMe: !!view.isMe })
    }
    if (!firstSnapshot) {
      for (const [id, visitor] of roster) {
        if (!next.has(id) && !visitor.isMe) departures.unshift({ ...visitor, at: now })
      }
    }
    firstSnapshot = false
    roster = next
    departures = departures.slice(0, 3)
    const people = [...roster.values()].sort(
      (a, b) => Number(b.isMe) - Number(a.isMe) || b.at - a.at,
    )
    setState("live", `${people.length} ${people.length === 1 ? "person" : "people"} here`)
    const rows = people.slice(0, 5).map((person) => row(person, person.at))
    if (people.length > 5) rows.push(note(`+${people.length - 5} more`))
    arrivals.replaceChildren(...(rows.length ? rows : [note("Waiting for arrivals…")]))
    departed.replaceChildren(
      ...(departures.length
        ? departures.map((person) => row(person, person.at))
        : [note("None seen this visit.")]),
    )
    // Identity can arrive after the first cursor packet.
    for (const cursor of document.querySelectorAll(".ewan-shared-cursor")) {
      const person = roster.get(cursor.dataset.visitor)
      if (!person) continue
      cursor.style.setProperty("--visitor-ink", person.color)
      cursor.querySelector(".presence-cursor-label").textContent = person.name
    }
  }

  function renderCursor(id, element) {
    element.classList.add("ewan-shared-cursor")
    element.dataset.visitor = id
    element.setAttribute("aria-hidden", "true")
    const visitor = roster.get(id) ?? identity(String(id))
    element.style.setProperty("--visitor-ink", visitor.color)
    const pointer = document.createElement("i")
    pointer.className = "presence-pointer"
    const label = document.createElement("span")
    label.className = "presence-cursor-label"
    label.textContent = visitor.name
    element.append(pointer, label)
    return element
  }

  function disconnect() {
    epoch++
    clearTimeout(timeout)
    unsubscribe?.()
    unsubscribe = undefined
    if (joined) {
      try {
        playhtml.presence.setMyPresence(CHANNEL, null)
      } catch {
        /* socket already gone */
      }
    }
    joined = false
    roster.clear()
    firstSnapshot = true
    void resetPlayHTML()
    document.querySelectorAll(".ewan-shared-cursor").forEach((el) => el.remove())
  }

  function unavailable() {
    if (disposed) return
    disconnect()
    setState("offline", "Shared space unavailable")
    arrivals.replaceChildren(note("Connection lost. Reload to reconnect."))
  }

  async function connect() {
    if (disposed) return
    disconnect()
    const ticket = epoch
    setState("connecting", "Connecting…")
    timeout = setTimeout(unavailable, 12000)
    try {
      await playhtml.init({
        room: ROOM,
        onError: () => {
          if (ticket === epoch) unavailable()
        },
        cursors: {
          enabled: true,
          enableChat: false,
          room: () => ROOM,
          onCustomCursorRender: renderCursor,
          shouldRenderCursor: () => joined && !disposed,
        },
      })
      if (disposed || ticket !== epoch) return
      clearTimeout(timeout)
      joined = true
      unsubscribe = playhtml.presence.onPresenceChange(CHANNEL, render)
      playhtml.presence.setMyPresence(CHANNEL, { at: Date.now() })
      render(playhtml.presence.getPresences())
    } catch {
      if (ticket === epoch) unavailable()
    }
  }

  const offline = () => unavailable()
  const pagehide = () => disconnect()
  const pageshow = (event) => {
    if (event.persisted) void connect()
  }
  window.addEventListener("offline", offline)
  window.addEventListener("pagehide", pagehide)
  window.addEventListener("pageshow", pageshow)
  void connect()
  function dispose() {
    disposed = true
    disconnect()
    window.removeEventListener("offline", offline)
    window.removeEventListener("pagehide", pagehide)
    window.removeEventListener("pageshow", pageshow)
  }
  disposePrevious = dispose
  return dispose
}
