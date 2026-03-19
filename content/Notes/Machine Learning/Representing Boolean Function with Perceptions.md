---
date: 2026-03-18T09:06:13-04:00
updated: 2026-03-18T09:10:37-04:00
class:
  - note
created_on: "[[03-18-2026]]"
tags:
  - cs/ai/perceptron
  - math/discrete/boolean
source:
related:
author:
description:
aliases:
---

The classic introduction to how [[Neural Networks]] can model behavior.

a [[Perceptron]] computes $\hat{y} = \mathbf{1}[w \cdot x \geq \theta]$ for inputs $x \in \{0,1\}^n$, weights $w$, threshold $\theta$. geometrically, this is a hyperplane cut through the boolean hypercube, so any boolean function whose true-inputs can be separated from false-inputs by a hyperplane is representable.

linearly separable gates (single perceptron):

| gate | weights | threshold |
| :---: | :---: | :---: |
| AND | $w_i = 1$ | $\theta = n$ |
| OR | $w_i = 1$ | $\theta = 1$ |
| NOT | $w_1 = -1$ | $\theta = 0$ |

only special case is XOR: the two positive inputs $(1,0), (0,1)$ can't be linearly separated from $(0,0),(1,1)$, so no single perceptron works. you need a hidden layer, e.g. $\text{XOR}(x_1,x_2) = \text{AND}(\text{NAND}(x_1,x_2),\, \text{OR}(x_1,x_2))$.

![[linearSeperableGates.png]]

in general, any boolean function on $n$ bits can be expressed as a depth-2 network (DNF): one hidden layer for each minterm, OR at the output. this gives a universal approximation result for the discrete case, though the number of neurons can be exponential in $n$.
