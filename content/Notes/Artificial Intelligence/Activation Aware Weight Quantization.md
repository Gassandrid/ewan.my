---
class:
  - note
tags:
  - cs/ai/llm/quantization
source:
  - https://arxiv.org/html/2502.13178v4
related:
author:
description:
aliases:
date: 2026-06-16T22:35:01-07:00
updated: 2026-06-16T22:37:48-07:00
---

observes that salient weights are always tied to high-magnitude activation channels. Rather than keeping these weights in higher, memory-heavy precision, AWQ uses a mathematically equivalent transformation to **scale up** the salient weight channels prior to quantization

- https://arxiv.org/html/2502.13178v4

![[activeAwareQuantization.png]]
