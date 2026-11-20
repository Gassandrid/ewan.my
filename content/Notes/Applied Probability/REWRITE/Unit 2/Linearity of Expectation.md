---
id: Linearity of Expectation
class:
  - note
tags:
  - math/probability/random-variables
source:
related:
  - "[[Expected Value of Discrete Random Variables]]"
  - "[[Variance of Sums]]"
author:
description: The expected value of a sum is the sum of the expected values, whether or not the variables are independent, which turns counting problems into sums of indicators.
aliases:
  - Linearity of Expected Value
  - Expectation of Sums
date: 2025-02-12
updated: 2026-11-19T21:50:00-05:00
---

- expectation is linear, **no independence needed**

$$
E(a_{1}X_{1} + \dots + a_{n}X_{n}) = a_{1}E(X_{1}) + \dots + a_{n}E(X_{n}), \qquad E(aX + b) = aE(X) + b
$$

	- if the $X_i$ are identically distributed, $E(X_1 + \dots + X_n) = nE(X_1)$
	- variance is not this nice, see [[Variance of Sums]]
- the trick: write a count as a sum of **indicators** $X_j \in \{0, 1\}$ for events $A_j$, then $E(X_j) = P(A_j)$
- example: four students order noodles independently, each picks Japanese pan noodles 40% of the time
	- $X_j$ indicates student $j$ orders them, $E(X_j) = 0.4$
	- $E(X) = E(X_1 + \dots + X_4) = 4(0.4) = 1.6$ students
- example: draw cards without replacement until the ace of hearts, expected number of draws
	- [[Expected Value of Discrete Random Variables|directly]] you'd sum over the whole distribution, indicators are faster
	- $A_j$ = at least $j$ draws are needed = no ace of hearts in the first $j-1$ cards, so $P(A_j) = 1 - \frac{j-1}{52}$
	- the number of draws $X = X_1 + \dots + X_{52}$, since $X \ge j$ exactly when $A_j$ happens

$$
E(X) = \sum_{j=1}^{52} \left( 1 - \frac{j-1}{52} \right) = 52 - \frac{1}{52} \cdot \frac{51 \cdot 52}{2} = 52 - \frac{51}{2} = 26.5
$$
