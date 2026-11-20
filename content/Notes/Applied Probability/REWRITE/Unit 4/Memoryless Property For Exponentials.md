---
class:
  - note
tags:
  - math/probability/random-variables
source:
related:
  - "[[Exponential Distribution]]"
  - "[[Conditional Probability]]"
author:
description: An exponential waiting time forgets how long it has already run, so the remaining wait has the same distribution as the original.
aliases:
  - Memoryless Property
  - Memorylessness
date: 2025-04-09
updated: 2026-11-19T21:50:00-05:00
---

- if $X \sim \text{Exp}(\lambda)$, having already waited $s$ tells you nothing about the remaining wait

$$
P(X > s + t \mid X > s) = P(X > t), \quad \forall s, t \ge 0
$$

	- the [[Exponential Distribution|exponential]] is the **only** continuous distribution like this ( the geometric is the discrete one )
- proof, using the tail $P(X > x) = 1 - F_X(x) = e^{-\lambda x}$

$$
P(X > s + t \mid X > s) = \frac{P(X > s + t)}{P(X > s)} = \frac{e^{-\lambda(s + t)}}{e^{-\lambda s}} = e^{-\lambda t} = P(X > t)
$$

	- the intersection drops out because $X > s + t$ already implies $X > s$
- fits the waiting times between events in Poisson problems: radioactive decays, customer arrivals, hardware failure
- example: from 6:00am birds land on a power line, exponential gaps averaging 7.5 minutes, so $\lambda = \frac{1}{7.5} \approx 0.133$
	- no bird in the last 5 minutes, chance of none in the next 10:

$$
P(X > 15 \mid X > 5) = P(X > 10) = e^{-10/7.5} = 0.2636
$$

	- birds expected in the next hour: $\frac{60}{7.5} = 8$, the count $N$ is Poisson with mean 8
		- exactly 8: $P(N = 8) = \frac{e^{-8} 8^8}{8!} \approx 0.1396$
		- at least 10: $P(N \ge 10) = 1 - \sum_{k=0}^{9} \frac{e^{-8} 8^k}{k!} \approx 0.2834$
