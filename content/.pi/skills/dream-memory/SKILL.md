---
name: dream-memory
description: Consolidate Pi memory like Claude Code Auto Dream. Use for /dream-style memory reconsolidation, deduping project memory files under ~/.pi/agent/memory/<project-slug>/, pruning stale entries, updating MEMORY.md indexes/topic files, and deciding whether information belongs in memory, skills, or vault notes.
---

# Dream Memory

Use this skill when consolidating Pi's persistent memory.

## Goals

- Keep memory compact, factual, current, and useful at session start.
- Preserve stable user preferences, project conventions, environment facts, recurring workflows, and lessons learned from corrections.
- Remove duplicate, stale, vague, speculative, or one-off session details.
- Convert relative dates like “today” or “last week” to absolute dates when preserving them.
- Prefer concise bullets over narrative logs.

## Memory destinations

- `~/.pi/agent/memory/<project-slug>/MEMORY.md`: project-scoped memory index, always kept compact and one-line-per-topic.
- `~/.pi/agent/memory/<project-slug>/<type>_<topic>.md`: one memory topic per file with frontmatter (`type: user|feedback|project|reference`). This is the primary Pi memory destination for every project, including work outside this vault.
- `~/.pi/agent/memory/<project-slug>/dream-log.md`: operational reconsolidation history; do not treat it as recalled memory.
- `.pi/skills/<name>/SKILL.md`: reusable procedures. If something is “how to do X,” prefer a skill over memory.
- Obsidian vault notes: substantial knowledge artifacts, research notes, or human-facing documentation.
- Legacy `.pi/memory/*`: old vault-local seed memory. Read/migrate if relevant, but do not create new primary memory there unless explicitly asked.

## What to save

Save only information that is likely to improve future sessions:

- Explicit “remember this” requests.
- Corrections the agent should not repeat.
- Stable user preferences and communication style.
- Reusable project commands, tool workflows, or environment constraints.
- Lessons learned from debugging or completed work that are not obvious from existing files.

## What to skip

- Temporary paths, transient errors, one-off debugging states.
- Raw logs, large code blocks, secrets, credentials, API keys.
- Generic facts that can be rediscovered with search.
- Claims not supported by the current conversation or files.
- Content already captured clearly in always-loaded project instructions.

## Legacy Claude Memory

This vault has `Private/Claude Memory/` from an older Claude auto-dream system. Treat it as prior-agent memory and behavioral context. Do not treat it as authoritative factual knowledge over current vault contents. Verify facts against current notes or files when accuracy matters. Do not write there unless the user explicitly asks.

## Consolidation procedure

1. Resolve the current project memory directory with `/memory dir` (or the canonical git-root/cwd slug under `~/.pi/agent/memory/`).
2. Prefer `/memory dream` for the extension-managed Auto Dream pass. It reads `MEMORY.md` plus topic files, rewrites the compact index/topic files, deletes stale duplicates, and appends `dream-log.md`.
3. If consolidating manually, read the project `MEMORY.md`, topic files, and any relevant legacy `.pi/memory/*` seed files; classify each candidate as user profile, feedback, project memory, reference, skill candidate, vault note candidate, or discard.
4. Merge overlapping entries and rewrite stale entries in place. Keep `MEMORY.md` as an index only: one concise line per topic, no frontmatter.
5. Keep topic files semantically organized with current frontmatter (`name`, `description`, `type`). Feedback/project files should preserve **Why:** and **How to apply:** lines when known.
6. Add skill proposals for reusable procedures instead of bloating memory, and use vault notes for substantial human-facing knowledge artifacts.
7. Write a dated operational summary to `dream-log.md` only; do not add dream-log entries to `MEMORY.md`.
