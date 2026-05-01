---
name: skill-forge
description: Create or improve Agent Skills as procedural memory. Use when the user asks to save a workflow as a skill, when a completed task produced reusable steps, or when dream-memory identifies a procedure that should become a .pi/skills/<name>/SKILL.md skill instead of declarative memory.
---

# Skill Forge

Use this skill to turn reusable procedures into portable Agent Skills.

## When to create a skill

Create or propose a skill when:

- The user says “save this as a skill” or similar.
- A task produced a reusable multi-step workflow.
- The same correction/workflow appears repeatedly.
- The knowledge is procedural (“how to do X”), not just a fact.

Do not create a skill for one-off facts, secrets, raw logs, or broad background knowledge.

## Location

Project skills live in:

```text
.pi/skills/<skill-name>/SKILL.md
```

Use lowercase kebab-case names, max 64 chars, matching the parent directory.

## Required format

Every skill must follow the Agent Skills standard:

```markdown
---
name: skill-name
description: Specific description of what this skill does and when to use it.
---

# Skill Name

## When to use

- ...

## Procedure

1. ...
2. ...

## Notes

- ...
```

Optional supporting files may go in `references/`, `templates/`, `scripts/`, or `assets/`.

## Quality bar

A good skill is:

- specific enough to auto-load for the right tasks
- concise enough to scan quickly
- operational: commands, file paths, checks, edge cases
- portable: avoids hidden assumptions when possible
- safe: no embedded secrets or unsafe defaults

## Updating skills

When improving an existing skill:

1. Read its current `SKILL.md`.
2. Preserve useful existing instructions.
3. Add newly learned edge cases or better commands.
4. Remove outdated or contradictory steps.
5. Keep the description accurate so future auto-loading works.
