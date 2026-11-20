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
updated: 2026-10-14T12:52:34-04:00
---

Instead of local reward model, GRPO generates a group of $G$  responses for the same prompt, scores using a rule based verifier ( ideal for cases involving programmatic tasks or theorem prooving ), then calculates the advantage in comparrsion to groups average.

- highly memory efficient because you only need the policy model and the reference model in memory, not a massive secondary reward model.
- for reasoning model postraining
- optimization algorithm most used for [[Reinforcement Learning with Verifiable Rewards|RLVR]]

This is also the "hot stuff" right now (May 2026)

[![GRPO.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/6981ebf9ba089bea1ec59465cb0b15ec059a935319677dcf0698ade8d5d0c5da/GRPO.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/6981ebf9ba089bea1ec59465cb0b15ec059a935319677dcf0698ade8d5d0c5da/GRPO.png)

## Breakdown

[[TRL]] from huggingface has some great methods for their `GRPOTrainer`

[![grpoImplementation.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/b60f024f1ac8b4d6a847cda986e96a8fe7cb1a7765122327a19ec28f235e4543/grpoImplementation.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/b60f024f1ac8b4d6a847cda986e96a8fe7cb1a7765122327a19ec28f235e4543/grpoImplementation.png)
