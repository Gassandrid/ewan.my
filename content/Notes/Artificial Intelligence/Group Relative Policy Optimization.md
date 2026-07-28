---
class:
  - note
tags:
  - cs/ai/llm/reinforcement
source:
related:
  - "[[Multi Objective Optimization]]"
author:
description:
aliases:
  - GRPO
date: 2026-05-23T11:20:31-07:00
updated: 2026-06-14T20:57:52-07:00
---

Instead of local reward model, GRPO generates a group of $G$  responses for the same prompt, scores using a rule based verifier ( ideal for cases involving programmatic tasks or theorem prooving ), then calculates the advantage in comparrsion to groups average.

- highly memory efficient because you only need the policy model and the reference model in memory, not a massive secondary reward model.
- for reasoning model postraining

This is also the "hot stuff" right now (May 2026)

![[GRPO.png]]
