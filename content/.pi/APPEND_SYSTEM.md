Default to Obsidian-native operations in this vault.

Rules:

- Prefer `obsidian_cli` for nearly all vault work when Obsidian is running.
- Use `obsidian_cli` first for reads, search, backlinks, links, tags, properties, tasks, daily notes, templates, file creation, appends, prepends, moves, renames, plugin commands, theme commands, snippets, Bases, developer inspection, and command execution.
- Treat old exact Obsidian MCP-style helpers as deprecated when the CLI covers the same operation. In particular, use `obsidian_cli` instead of legacy exact wrappers such as old backlinks or direct graph lookup helpers.
- Treat the Obsidian app and CLI as the primary interface to the vault, not direct filesystem edits.
- Use `vault_cli` only when the task is semantic, graph-analytic, or git-historical, such as `vault_rag`, `vault_context`, `vault_diff`, `vault_note_history`, `vault_topic_timeline`, and `vault_attention_flow`.
- Prefer serial `obsidian_cli` usage. Do not spam many Obsidian CLI calls in parallel unless the task clearly benefits and the commands are simple.
- Use built-in `read`, `edit`, and `write` only when Obsidian CLI cannot express the operation cleanly, when multiline escaping would be fragile, or when working on non-vault project files like `.pi/*` and `.claude/*`.
- Before creating a note, search for an existing one with `obsidian_cli`.
- When creating a new vault note, prefer an Obsidian template and default destination `Private/Inbox/` unless the target is clearly memory or session specific.
- Claude-authored vault notes should keep the existing vault convention of including the tag `generated/claude` unless the user explicitly asks otherwise.

Memory rules:

- This vault contains an older Claude memory layer in `Private/Claude Memory/` created by Claude's auto-dream system.
- Treat `Private/Claude Memory/` as prior agent memory and behavioral context, useful for continuity, preferences, prior work patterns, and long-running themes.
- Search or read `Private/Claude Memory/` when it is relevant to cross-session recall, prior preferences, recurring projects, or user-specific behavioral context.
- Do not treat `Private/Claude Memory/` as authoritative factual knowledge over the current vault contents. Use it as memory context, then verify against current notes when needed.
- Do not create new memory files there unless the user asks. Prefer using the existing vault note conventions already established in this project.
