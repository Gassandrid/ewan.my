---
class:
  - note
tags:
  - cs/ai/llm
  - cs/ai/tuning
source:
  - https://arxiv.org/abs/2106.09685
related:
author:
description:
aliases:
  - LoRa
  - Lora
  - lora
date: 2026-04-16T10:03:29-04:00
updated: 2026-04-20T10:01:51-04:00
---

Technique for [[Parameter Efficient Fine Tuning]]/[[Parameter Efficient Fine Tuning|PEFT]], specifically for [[Large Language Model]]/[[Diffusion in Machine Learning|Diffusion Model]]s such that they can be adapted to novel tasks.

Freezes base model weights, and then trains new, tiny, adapter matrices. This reduces memory requirements and training time significantly. 

You are also left with a very small LoRa adapter file, which for a given base model, can be switched out quite easily and quickly.
