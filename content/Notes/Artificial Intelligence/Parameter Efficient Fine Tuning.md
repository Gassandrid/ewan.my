---
class:
  - note
tags:
  - cs/ai/llm
  - cs/ai/tuning
source:
related:
author:
description:
aliases:
  - PEFT
date: 2026-04-16T09:54:40-04:00
updated: 2026-04-16T10:01:14-04:00
---

Technique to adapt [[Large Language Model]]s that would otherwise be impossible to fine tune on a local machine that works by freezing most of the model weights and only training a small subset. 

This works well in many cases becuase it actually leverages the generalizability of pretrained foundation models, only needing to work with a small subset of [[Artificial Neuron|network neurons]] that are flagged as high value in scope. We usually care little to change how a model reasons through a task, in most cases this technique is used for **personality fine tunes** or **[[Abliteration]]**.

Most common technique I have ever used is [[Low Rank Adaptation]]. In this case, the small subset of parameters you train are saved in something called a [[Low Rank Adaptation|LoRa]] adapter, usually only a few hundred megabytes. At runtime you load your foundation model and inject the lora adapter on top.
