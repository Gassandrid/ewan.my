# Vault Defaults

This project is an Obsidian vault. Use vault-native operations by default.

- Prefer `obsidian_cli` for exact vault work: read, search, create, append, prepend, move, rename, tags, properties, backlinks, links, daily notes, templates, tasks, Bases, plugin/theme/dev commands.
- Prefer `scripts/qmd-vault` for content retrieval: `search` for exact/BM25 lookup, `vsearch` for semantic lookup, and `query` for the best local hybrid + reranked results. QMD is read-only with respect to notes and uses no API tokens.
- After meaningful note changes, run `scripts/qmd-vault update`; run `scripts/qmd-vault embed` only when `scripts/qmd-vault status` reports pending vectors. Both operations are incremental and local, so do not add a background summarization loop.
- Prefer `vault_cli` for graph, historical, or attention analysis: `vault_context`, `vault_diff`, `vault_note_history`, `vault_topic_timeline`, `vault_attention_flow`. Use the older `vault_rag` only as a fallback when QMD is unavailable.
- Use filesystem tools only when Obsidian CLI is awkward, multiline escaping would be fragile, or the file is not really a vault note.
- Before creating a note, search for an existing one.
- New assistant-authored vault notes default to `Private/Inbox/` and should include `generated/claude` unless the user says otherwise.
- Prefer existing vault templates and conventions over inventing new structure.
- Do not invent tags. Tags are hierarchical; consult `Private/Agent Map/agent_tag_index.md` first, then use existing tags/prefixes at the most specific applicable level. Prefer established trees like `#math/calculus/vector`, `#cs/ai/llm`, `#comp-neuro/brain/region`, etc. If no close existing tag fits, leave tagging sparse rather than minting a new taxonomy branch.
- Do not invent YAML/frontmatter schema. Use templates from `Private/templates/` and read `Private/templates/FIELD_GUIDE.md` before creating or editing typed notes. Property meanings are conditioned by `class`: e.g. `status` means inventory/use-state for medications/products, but consumption/progress-state for books/papers/videos.
- For structured property recall, prefer `scripts/vault-ctx property <property> [value] --contains` before ad-hoc grep/eval. Example: `scripts/vault-ctx --format json property class medication --contains` lists medication-class notes with compact frontmatter fields.
- Treat `Private/Claude Memory/` as prior agent memory and behavioral context, not authoritative factual knowledge. Verify against current notes when facts matter.
- Do not create new files under `Private/Claude Memory/` unless asked; use the current memory tools/conventions instead.

## Session artifacts

- `Private/Agent Sessions/` contains compact generated retrieval indexes, not canonical knowledge. The human-authored Vault outranks them whenever they disagree.
- At the end of a meaningful Codex or Pi session, create at most one artifact using `Private/templates/Agent Session Artifact Template.md`.
- Keep the body to one information-dense paragraph, normally 80-160 words: what the session did, where it did it, the verified outcome, and any remaining gate. Point `source` to the transcript/session when available.
- Do not copy transcripts, command output, inventories, detailed reasoning, or full handoffs into the artifact. Reuse information already in the active context; do not start another inference pass merely to summarize it.
- Search `vault` when asking what Ewan thinks or wrote. Search `sessions` only for prior agent work, or query both deliberately when operational history is relevant.
