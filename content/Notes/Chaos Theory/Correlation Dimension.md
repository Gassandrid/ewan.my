---
date: 2026-03-31T10:07:46-04:00
updated: 2026-03-31T10:59:57-04:00
class:
  - note
  - lecture
created_on: "[[03-31-2026]]"
tags:
  - university
  - math/chaos/attractor
source:
related:
author:
description:
aliases:
course: "[[Chaos, Fractals, and Dynamical Systems]]"
lecture-number: 18
---

defined for an orbit of a map, rather than a set. wont require boxes.

Let:

$$
S = \{  \vec{v}_{0}, \vec{v}_{1}, \dots \}
$$

be an orbit of the map $\vec{f}$ in $\mathbb{R}^{n}$ and $S_{\mathbb{N}}$ denote the first $\mathbb{N}$ points on the orbit. 

For each $r>0$, define the **correlation function** $C(r)$ to be the proportion of pairs of orbit points withhin $r$ units of one another.

$$
C(r) = \lim_{ n \to \infty } \frac{\# \{ pairs \ \{ \vec{w}_{1}, \vec{w}_{2} \}:\vec{w}_{1},\vec{w}_{2} \in S_N, |\vec{w}_{1}-\vec{w}_{2}|<r \}}{\# \{  pairs \{ \vec{w}_{1}, \vec{w}_{2} \}: \vec{w}_{1},\vec{w}_{2} \in S_{N} \}}
$$

---

The **correlation dimension** of the orbit $S$ is $d$ where $C(r)\approx r^{d}$ for small $r$. i.i. 

Qualitatively, in higher dimensions, there are more ways for points to be close to each toher. So the number of pairs close to each other will rise more rapidly in higher dimensions.

---

## [[Taylor Couette Flow]]

The [[Attractor Network|attractor]] is time-delay reconstructed by plotting vectors of the form:

$$
\underbrace{ \left(  y_{t}, y_{t+T}, y_{t+2T},\dots \right) }_{ in \ \mathbb{R}^{m} }
$$

$y_{t}$ is velocity at the time $t$.

Technique approximates the attractor because quantities not measured are likely to depend (somehow) on velocity(which we are measuring), but lagged at some charecteristic time scale which the delay $T$ is designed to sample.

The **embedding dimension**, the number of degrees of freedom sufficient to describe properties of the state space via time delay.

This method can also be used to calculate the (model free) [[Lyapunov Exponents]] of data by measuring the rate of divergence of nearest neighboors and looking for consistency across embedding dimensions.
