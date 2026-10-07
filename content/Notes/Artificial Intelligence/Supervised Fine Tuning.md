---
class:
  - note
tags:
  - cs/ai/llm
source:
  - https://x.com/aakaran31/status/2106037829059133903
  - https://aakaran.github.io/finetuning_with_sampling/
  - https://arxiv.org/abs/2610.02140
related:
author:
description:
aliases:
  - SFT
date: 2026-10-06T09:45:46-04:00
updated: 2026-10-06T15:08:17-04:00
---
- where [[Pretraining]] builds a [[Large Language Model]]s foundational knowledge of language through massive quantities of unlabeled data ( a sort of [[Self Supervised Learning]] approach ), [[Supervised Fine Tuning]] follows by adapting that [[Pretraining|pretrain]] to a response model through structured input-output pairs
- teaches the more desired response structure "You are a helpful assistant, your task is {tast}, and the users request is {request}" style training. 
- fundamentally is still the same technique as pretraining, but usually at a lower learning rate or using some kind of [[Parameter Efficient Fine Tuning]] method like [[Low Rank Adaptation]] for encoding behavior and response structure rather than language understanding.
	- main difference here is purely data, it is labeled and processed in a way to encourage mimicry

## Advancements ( [[10-06-2026]] )

- new paper [fine tuning with sampling](https://arxiv.org/abs/2610.02140) had some breakthrough advancements that makes SFT rival current prevailing postraining methods, where they generalize better and forget less than [[Reinforcement Learning]] and [[On Policy Self Distillation|OPSD]] 
	- main idea is that RL learning is **on policy**, which in the past has made it generalize better
	- in this case, SFT can be made "on policy" by using sampling!
  - 
