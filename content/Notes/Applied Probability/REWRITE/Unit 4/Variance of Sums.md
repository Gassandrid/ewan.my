---
id: Variance of Sums
class:
  - note
tags:
  - math/probability/random-variables
source:
related:
  - "[[Covariance]]"
  - "[[Linearity of Expectation]]"
author:
description: The variance of a sum is the sum of the variances plus twice every pairwise covariance, which vanishes when the variables are independent.
aliases:
  - Variance of a Sum
date: 2025-04-23
updated: 2026-11-19T21:50:00-05:00
---

- expectation of a sum always splits ( [[Linearity of Expectation]] ), variance only splits when the variables are independent ( uncorrelated is enough )
	- otherwise you pay a [[Covariance]] term for how much they move together

$$
Var(X + Y) = Var(X) + Var(Y) + 2\,Cov(X, Y)
$$

	- in general, with every pair counted once

$$
Var(X_1 + \dots + X_n) = \sum_{i=1}^{n} Var(X_i) + 2 \sum_{i<j} Cov(X_i, X_j)
$$

	- $Cov(X, X) = Var(X)$, so this is just $Cov\left(\sum X_i, \sum X_j\right)$ expanded
- example ( exercise 39.13 ): roll two dice, $X$ = max, $Y$ = min, find $Cov(X, Y) = E(XY) - E(X)E(Y)$

| $k$ | $P(X=k)$        | $P(Y=k)$        |
| --- | --------------- | --------------- |
| 1   | $\frac{1}{36}$  | $\frac{11}{36}$ |
| 2   | $\frac{3}{36}$  | $\frac{9}{36}$  |
| 3   | $\frac{5}{36}$  | $\frac{7}{36}$  |
| 4   | $\frac{7}{36}$  | $\frac{5}{36}$  |
| 5   | $\frac{9}{36}$  | $\frac{3}{36}$  |
| 6   | $\frac{11}{36}$ | $\frac{1}{36}$  |

	- $E(X) = \frac{161}{36} \approx 4.47$, $E(Y) = \frac{91}{36} \approx 2.53$
	- max times min is just the product of the two dice, which are independent, so $E(XY) = 3.5^2 = \frac{441}{36}$
	- $Cov(X, Y) = \frac{441}{36} - \frac{161 \cdot 91}{36^2} = \frac{1225}{1296} \approx 0.945$, positive since a high min forces a high max
