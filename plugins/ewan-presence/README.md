# Homepage arrivals

Homepage-only PlayHTML presence, inspired by [Jacky Zhao's departure board](https://github.com/jackyzha0/jackyzha0.github.io/blob/v4/quartz/components/scripts/departureBoard.lazy.ts).
The component renders after the homepage article, before comments. Its small
Quartz dispatcher lazy-loads a local bundle only when that component is present.
No Vault note changes are needed.

- Anonymous garden names and cursor colors are derived locally from PlayHTML's
  identity key. All colors, fonts, and surfaces use the site's theme tokens.
- The `front-page` room ignores query strings and is prefixed by PlayHTML with
  the hostname. Local previews therefore stay separate from production.
- Arrivals are current presence. Departures are the last three departures this
  tab observed, held only in memory. There is no persistent visitor log.
- Leave space disconnects and remembers that choice for this browser session.
  Quartz navigation also disconnects; returning to the homepage joins again
  unless the visitor chose to leave. Chat is disabled.
- PlayHTML uses its public PartyKit service. Anonymous identity, arrival time,
  and cursor position are shared with that service and visitors in the room.

`playhtml` is pinned to 2.15.0. This plugin is its sole owner and uses the exported
`resetPlayHTML()` for full teardown, including sockets and navigation listeners.
That export is currently intended for test isolation upstream; recheck cleanup
when upgrading and do not add another PlayHTML owner without revisiting it.

`npm run validate` builds the local ESM bundle. Browser verification lives at
`private/tooling/scripts/probe-presence.mjs` (ignored local tooling). Test two
isolated browser contexts, actual WebSocket traffic, departure on SPA navigation,
return, leave/rejoin, offline fallback, mobile layout and both themes.
