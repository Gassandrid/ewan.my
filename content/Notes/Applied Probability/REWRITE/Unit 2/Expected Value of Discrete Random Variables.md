---
id: Expected Value of Discrete Random Variables
class:
  - note
tags:
  - math/probability/random-variables
source:
related:
  - "[[Expected Value of Continuous Random Variables]]"
  - "[[Linearity of Expectation]]"
author:
description: The expected value of a discrete random variable is its probability-weighted average, the balancing point of its mass function.
aliases:
  - Expected Value
  - Expectation
  - Expected Values
date: 2025-02-07
updated: 2026-11-19T21:50:00-05:00
---

- **expected value** of a discrete [[Random Variables|random variable]]: weight each value by its [[Probability Mass Function|mass]] and add up
	- the long run average, the balancing point ( fulcrum ) of the pmf
	- doesn't have to be a value $X$ can actually take ( a die never rolls 3.5 )

$$
E(X) = \sum_{j} x_{j} \, p_{X}(x_{j})
$$

- properties, all from the sum being linear ( more in [[Linearity of Expectation]] )
	- $E(c) = c$
	- $E(cX) = cE(X)$
	- $E(X + Y) = E(X) + E(Y)$, independent or not
- example: fair die, $E(X) = \frac{1}{6}(1+2+3+4+5+6) = 3.5$
	- a [[Binomial Distribution|binomial]] with $n$ trials and success probability $p$ has $E(X) = np$
- expected winnings are payout minus cost
	- a 5 dollar game that pays 10 with probability 0.4: $0.4(10) - 5 = -1$
	- a 2 dollar lottery ticket with a 1000 prize at probability 0.001: $0.001(1000) - 2 = -1$
- continuous version swaps the sum for an integral: [[Expected Value of Continuous Random Variables]]
