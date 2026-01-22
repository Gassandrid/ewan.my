---
class:
  - note
  - lecture
  - lectureNote
tags:
  - university
course: "[[Principles of Biology 1]]"
lecture-number: 1
source:
related:
author:
description:
date: 2026-01-22T10:16:18-05:00
updated: 2026-01-22T10:35:06-05:00
---

## Sensitive Dependence on Initial Conditions(SDIC)

"Butterfly Effect", this is the idea that small changes in initial conditions can lead to vastly different outcomes. In chaotic systems, even a tiny perturbation can grow exponentially over time, making long-term prediction impossible.

Consider the map $f(x) = 3x (mod \ 1)$ on unit interval, Fixed point at $x=\frac{1}{2}$ and $0$. $x=1$ is identical to $x=0$

![[3xmod1Chart.png]]

$$
\begin{align*}
f\left( \frac{1}{4} \right) &= \frac{3}{4} \\
f\left( \frac{3}{4} \right) &= \frac{9}{4} (mod\ 1 = \frac{1}{4} \\
&\left\{  \frac{1}{4}, \frac{3}{4}  \right\}
\end{align*}
$$

This is a period 2 [[Repelling fixed point|source]], because $f'=3$. $\frac{1}{3}$ is eventually periodic to source at 0.

$$
(f^{2})^{1}(p_{1} \ or \ p_{2})
$$

The core idea of sensitive dependence, when I make a perturbation, no matter how small of a size the perturbation is,

> [!Info] Desmos
> <iframe src="https://www.desmos.com/calculator/0yimxtuafe" width=600 height="400" ></iframe>

