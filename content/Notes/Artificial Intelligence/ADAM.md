---
class:
  - note
tags:
  - cs/ai/optimizer
source:
  - https://arxiv.org/abs/1412.6980
related:
author:
description:
aliases:
  - ADAM Optimizer
  - adam optimizer
date: 2026-10-29T13:18:47-04:00
updated: 2026-10-29T13:37:43-04:00
---

- per parameter [[Gradient Descent]] optimization algorithm
	- takes the first and second **moments** for each parameter and tunes the learning rate as such.
		- First moment - momentum: trackss exponential moving average for gradients, then smoothing updates + maintaining direction.
		- Second moment squared - gradients: tracks exponential moving average for squared gradients, then scaling down updates for params with consistently large gradients.
- **hyperparameters**
	- learning rate $\eta$, `0.001` default, overall magninute for param updates
	- Beta 1 $\beta_{1}$ `0.9` momentum parameter control
	- Beta 2 $\beta_{2}$ `0.999` squared gradient control
	- Epsilon $\epsilon$ `10^-8` for preventing div by zero and numerical stability
