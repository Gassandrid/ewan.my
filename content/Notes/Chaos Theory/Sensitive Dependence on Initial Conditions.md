---
created_on: "[[01-22-2026]]"
class:
  - note
  - lecture
  - lectureNote
tags:
  - university
  - math/chaos/sensitivity
course: "[[Chaos, Fractals, and Dynamical Systems]]"
lecture-number: 4
source:
related:
author:
description:
date: 2026-01-22T10:16:18-05:00
updated: 2026-01-22T10:54:48-05:00
aliases:
  - SDIC
---
**Sensitive Dependence on Initial Conditions(SDIC)**: "Butterfly Effect", this is the idea that small changes in initial conditions can lead to vastly different outcomes. In chaotic systems, even a tiny perturbation can grow exponentially over time, making long-term prediction impossible.

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

> [!Info] Desmos
>
> <iframe src="https://www.desmos.com/calculator/0yimxtuafe" width=600 height="400" ></iframe>

All rational numbers will be eventually be **periodic** to a [[Repelling fixed point]].

---

## Formal Definition of SDIC

Let $f$ be a map on $\mathbb{R}$. A point $x_{0}$ has SDIC if $\exists d>0$ such that any neighborhood of $x_{0}$ contains a point $x$ such that:

$$
|f^{K}(x)-f^{K}(x_{0})| \geq d
$$

for some non negative integer $K$. I.e., a point $x$ will be sensitive if it has neighbors as close as desired that eventually move away.

> In plain English, this means that no matter how close you start to $x_{0}$, there are points arbitrarily close that will eventually diverge from $x_{0}$ by at least a distance $d$ after some number of iterations.


---

Itineraries, list of letters 