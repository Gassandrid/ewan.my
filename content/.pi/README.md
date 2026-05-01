# Pi vault setup

This project now carries a project-local Pi layer.

## What is wired up

- `.pi/settings.json` loads the existing Claude skill library from `./.claude/skills`
- `.pi/APPEND_SYSTEM.md` makes Obsidian-native operations the default and tells Pi about the legacy `Private/Claude Memory/` layer
- `.pi/extensions/obsidian-vault-tools/index.ts` adds:
  - `obsidian_cli` for native Obsidian CLI calls
  - `vault_cli` for `.claude/vault_cli.py` semantic and git-history analysis
  - `reload_runtime` plus `/reload-runtime` for self-reloading after edits

## Intended routing

- Exact note operations: `obsidian_cli`
- Semantic retrieval, context, timelines, attention flow, history: `vault_cli`
- Old exact Obsidian MCP-style helpers are deprecated where the CLI already covers the operation
- Prefer mostly serial `obsidian_cli` use rather than hammering many CLI calls in parallel
- Raw file edits or multiline content where CLI escaping is annoying: built-in `read`, `edit`, `write`

## Reload after edits

Inside Pi:

- run `/reload`
- or use the `reload_runtime` tool
- or run `/reload-runtime`
