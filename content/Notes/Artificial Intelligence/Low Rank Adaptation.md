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
updated: 2026-06-11T15:55:50-07:00
---

Technique for [[Parameter Efficient Fine Tuning]]/[[Parameter Efficient Fine Tuning|PEFT]], specifically for [[Large Language Model]]/[[Diffusion in Machine Learning|Diffusion Model]]s such that they can be adapted to novel tasks.

Freezes base model weights, and then trains new, tiny, adapter matrices. This reduces memory requirements and training time significantly. 

You are also left with a very small LoRa adapter file, which for a given base model, can be switched out quite easily and quickly.

## LoRA Hyperparameters

**Rank `r`**  
This controls adapter capacity. Low rank, like 4–16, is good for style/personality/formatting. Medium rank, like 16–64, is common for task learning. Higher ranks, like 64–128+, may help domain adaptation but increase overfitting and VRAM. A recent QLoRA tool-use paper found LoRA rank created a quality-retention tradeoff: rank 32 maximized planning quality in their setup, while smaller ranks preserved more general ability. ([arXiv](https://arxiv.org/abs/2605.17774?utm_source=chatgpt.com "Internalizing Tool Knowledge in Small Language Models via QLoRA Fine-Tuning"))

**Alpha**   Usually `alpha = r` or `2r`. Higher alpha scales the adapter update more aggressively. Too high creates brittle style collapse.

**Dropout**  
LoRA dropout around 0–0.1. Use 0 for small clean datasets or deterministic style tuning. Use 0.05–0.1 for noisy/generalization-oriented data.

**Target modules**  
This is a major knob. Common choices:  
`q_proj`, `k_proj`, `v_proj`, `o_proj` for attention behavior.  
`gate_proj`, `up_proj`, `down_proj` for MLP knowledge/task behavior.  
“All linear” for maximal adaptation.  
For personality/style, attention-only can work. For domain/task competence, include MLPs.

**Bias training**  
Usually off. Bias tuning adds capacity but can destabilize/overfit.

**Quantization mode**  
4-bit QLoRA is the local default. NF4 + double quantization is common. 8-bit is safer but more memory. Full bf16 is cleaner if you have enough VRAM.

**rsLoRA / DoRA / LoRA+**  
These are LoRA variants. rsLoRA stabilizes higher ranks. DoRA decomposes magnitude/direction and can improve quality but costs more. LoRA+ uses different learning rates for LoRA matrices; it appears in recent optimization work as a speed/quality knob. ([arXiv](https://arxiv.org/abs/2601.02609?utm_source=chatgpt.com "Chronicals: A High-Performance Framework for LLM Fine-Tuning with 3.51x Speedup over Unsloth"))
