---
class:
  - note
tags:
  - math/probability/random-variables
source:
related:
  - "[[Conditional Probability]]"
  - "[[Expected Value of Continuous Random Variables]]"
author:
description: Conditional expectation is the expected value of one random variable computed with its conditional distribution given another.
aliases:
  - Conditional Expected Value
  - Tower Law
  - Law of Iterated Expectations
date: 2025-04-23
updated: 2026-11-19T21:50:00-05:00
---

- same as an [[Expected Value of Discrete Random Variables|expected value]], but weighted by the conditional mass or density instead of the marginal

$$
E(X \mid Y=y) = \sum_{x} x \, p_{X \mid Y}(x \mid y), \qquad E(X \mid Y=y) = \int_{-\infty}^{\infty} x \, f_{X \mid Y}(x \mid y) \, dx
$$

	- $f_{X \mid Y}(x \mid y) = \frac{f_{X,Y}(x,y)}{f_Y(y)}$, the continuous version of [[Conditional Probability]]
- properties
	- linearity: $E(aX + bZ \mid Y) = aE(X \mid Y) + bE(Z \mid Y)$
	- **tower law**: $E\big(E(X \mid Y)\big) = E(X)$
	- taking out what's known: for $g$ a function of $Y$, $E(g(Y)X \mid Y) = g(Y)\,E(X \mid Y)$
	- if $X \ge 0$ then $E(X \mid Y) \ge 0$
- example: $(X, Y)$ uniform on the triangle with corners $(0,0)$, $(2,0)$, $(0,2)$, find $E(Y \mid X = \frac{1}{2})$
	- think of it as a wedge of cheese, a flat density of $\frac{1}{2}$ ( the triangle has area 2 )
	- $f_X(x) = \int_0^{2-x} \frac{1}{2} \, dy = \frac{2-x}{2}$, so $f_{Y \mid X}(y \mid x) = \frac{1}{2-x}$, uniform on $[0, 2-x]$

$$
E\left(Y \mid X = \tfrac{1}{2}\right) = \int_{0}^{3/2} y \cdot \frac{2}{3} \, dy = \left. \frac{2}{3} \frac{y^2}{2} \right|_{0}^{3/2} = \frac{3}{4}
$$

- example ( exercise 40.11 ): two independent appointments, each [[Exponential Distribution|exponential]] with mean 20 min ( $\lambda = 0.05$ ); they total 38 min, how long was the first?
	- $Y = X_1 + X_2$, joint density $f_{X_1, X_2} = \lambda^2 e^{-\lambda(x_1 + x_2)}$, sum density ( Erlang-2 ) $f_Y(y) = \lambda^2 y e^{-\lambda y}$
	- conditional $f_{X_1 \mid Y}(x_1 \mid y) = \frac{\lambda^2 e^{-\lambda y}}{\lambda^2 y e^{-\lambda y}} = \frac{1}{y}$, uniform on $0 < x_1 < y$
	- $E(X_1 \mid Y = y) = \frac{y}{2}$, so 19 min, which symmetry already says
