---
id: Moment Generating Function
class:
  - note
tags:
  - math/probability/random-variables
source:
related:
  - "[[Characteristic function]]"
  - "[[Exponential Distribution]]"
author:
description: for random var- E(e^{tX}), whose derivatives at zero give every moment.
aliases:
  - MGF
  - Moment Generating Functions
  - Generating Function
date: 2025-04-07
updated: 2026-11-19T21:59:42-05:00
---

- a **generating function** packs a sequence $a_0, a_1, \dots$ into the coefficients of a power series

$$
g(t) = \sum_{j=0}^{\infty} \frac{a_j}{j!} t^j = a_0 + a_1 t + \frac{a_2}{2} t^2 + \dots
$$

	- differentiate $j$ times and set $t = 0$ to read one back: $a_j = g^{(j)}(0)$
	- e.g. $g(0) = a_0$, every other term dies
- the **moment generating function** uses the moments $a_j = E(X^j)$, and the series collapses into one expectation

$$
M_X(t) = \sum_{j=0}^{\infty} \frac{E(X^j)}{j!} t^j = E\left( \sum_{j=0}^{\infty} \frac{(tX)^j}{j!} \right) = E\left(e^{tX}\right)
$$

	- so $E(X^j) = M_X^{(j)}(0)$: the mean is $M_X'(0)$, $E(X^2) = M_X''(0)$, and $Var(X) = M_X''(0) - M_X'(0)^2$
	- doesn't always exist; the [[Characteristic function]] $E(e^{itX})$ always does
- example: [[Exponential Distribution|exponential]] with rate $\lambda$, for $t < \lambda$
	- $M_X(t) = \int_0^\infty e^{tx} \lambda e^{-\lambda x} \, dx = \frac{\lambda}{\lambda - t}$
	- $M_X'(0) = \frac{1}{\lambda}$, $M_X''(0) = \frac{2}{\lambda^2}$, so $Var(X) = \frac{1}{\lambda^2}$
- the bird perching exercise from this lecture is really about memorylessness, it lives in [[Memoryless Property For Exponentials]]
