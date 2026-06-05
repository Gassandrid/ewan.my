---
class:
  - note
tags:
  - math/chaos/fixed-point
source:
  - "[[Fixed Point Iteration Examples, Analysis, and the Banach Fixed Point Theorem]]"
related:
author:
description:
aliases:
  - contraction mapping theorem
  - contractive mapping theorem
  - Banach–Caccioppoli theorem
date: 2026-01-20T14:06:24-05:00
updated: 2026-03-19T08:27:01-04:00
---

_not from in class_

The **Banach Fixed Point Theorem** is a famous result from metric space theory. It states that if you have a complete metric space and a contraction mapping on that space, then there exists a unique fixed point for that mapping.

## Formally

Let $(X, d)$ be a complete metric space. A map $T: X \to X$ is a **contraction** if there exists $0 \leq k < 1$ such that

$$
d(T(x), T(y)) \leq k \cdot d(x, y)
$$

for all $x, y \in X$.

Then $T$ has a unique fixed point $x^* \in X$ where $T(x^*) = x^*$.

To use the theorem, you can construct the fixed point iteratively:

Start with any $x_0 \in X$ and iterate: $x_{n+1} = T(x_n)$. The sequence contracts exponentially and converges to the unique fixed point.

## In Plain English

If you have a space where distances are well-defined (**metric space**) and it's complete (all **Cauchy sequences** converge), and have a function bringing points closer together (**contraction**), then there is exactly one point in that space that remains unchanged when you apply the function. Moreover, you can find this point by repeatedly applying the function starting from any initial point in the space.
