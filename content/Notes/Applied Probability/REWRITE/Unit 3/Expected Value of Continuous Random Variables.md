---
id: Expected Value of Continuous Random Variables
class:
  - note
tags:
  - math/probability/random-variables
source:
related:
  - "[[Expected Value of Discrete Random Variables]]"
  - "[[Conditional Expectation]]"
author:
description: The expected value of a continuous random variable is the integral of the value times its density over the support.
aliases:
  - Expected Value of a Continuous Random Variable
date: 2025-03-26
updated: 2026-11-19T21:50:00-05:00
---

- same idea as [[Expected Value of Discrete Random Variables|the discrete case]], the sum over the mass becomes an integral over the density $f_X$

$$
E(X) = \int_{-\infty}^{\infty} x \, f_{X}(x) \, dx
$$

- recipe: find the pdf, integrate $x f_X(x)$ over the support ( where $f_X > 0$ )
	- any function works the same way: $E(g(X)) = \int g(x) f_X(x) \, dx$
	- two variables use the joint density and a double integral: $E(g(X,Y)) = \iint g(x,y) \, f_{X,Y}(x,y) \, dx \, dy$
- example: $f_X(x) = \frac{3}{1000}x^2$ on $0 \le x \le 10$

$$
E(X) = \int_{0}^{10} \frac{3}{1000} x^3 \, dx = \left. \frac{3}{1000} \frac{x^4}{4} \right|_{0}^{10} = 7.5
$$

- example: $f_X(x) = 3e^{-3x}$ for $x \ge 0$, an [[Exponential Distribution|exponential]] with $\lambda = 3$
	- $E(X) = \int_0^\infty 3x e^{-3x} \, dx = \frac{1}{3}$ ( by parts, or just $1/\lambda$ )
