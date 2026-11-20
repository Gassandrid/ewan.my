---
class:
  - note
tags:
  - math/probability/random-variables
source:
related:
  - "[[Memoryless Property For Exponentials]]"
  - "[[Expected Value of Continuous Random Variables]]"
author:
description: The exponential distribution models the waiting time until the next event when events happen at a constant average rate.
aliases:
  - Exponential Random Variable
  - Exponential
date: 2025-04-07
updated: 2026-11-19T21:50:00-05:00
---

- **exponential distribution**: $X$ = time until the next event, $X \ge 0$, with $\lambda$ the average rate of events
	- continuous cousin of waiting for the first success, and the only continuous [[Memoryless Property For Exponentials|memoryless]] distribution

$$
f_X(x) = \lambda e^{-\lambda x}, \qquad F_X(x) = 1 - e^{-\lambda x}, \qquad x \ge 0
$$

	- $E(X) = \frac{1}{\lambda}$, $Var(X) = \frac{1}{\lambda^2}$, $SD(X) = \frac{1}{\lambda}$
	- tail: $P(X > x) = e^{-\lambda x}$
- example: starting at 9:00pm, the wait for the next text averages 5 minutes
	- $E(X) = 5 = \frac{1}{\lambda}$, so $\lambda = \frac{1}{5}$ and $F_X(x) = \int_0^x \frac{1}{5}e^{-t/5} \, dt = 1 - e^{-x/5}$
	- no text in the next 10 minutes: $P(X > 10) = 1 - F(10) = e^{-2} = 0.1353$
	- text between 9:07 and 9:10: $P(7 < X < 10) = F(10) - F(7) = e^{-1.4} - e^{-2} = 0.111$
	- no text by 9:05, chance it arrives by 9:10: [[Conditional Probability]] with $A = \{X < 10\}$, $B = \{X > 5\}$

$$
P(X < 10 \mid X > 5) = \frac{P(5 < X < 10)}{P(X > 5)} = \frac{F(10) - F(5)}{1 - F(5)} = \frac{e^{-1} - e^{-2}}{e^{-1}} = 1 - e^{-1} = 0.632
$$

	- which is just $P(X < 5)$: the 5 minutes already waited don't matter, that's [[Memoryless Property For Exponentials|memorylessness]]
