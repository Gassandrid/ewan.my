---
date: 2026-02-12T10:20:31-05:00
created_on: "[[02-12-2026]]"
updated: 2026-02-12T10:32:57-05:00
class:
  - note
tags:
  - math/chaos
source:
related:
author:
description:
aliases:
  - Lyapunov
  - Lyapunov Exponent
---
Lyapunov exponents $(\lambda)$ quantify the exponential rate of separation of infinitesimally close trajectories in a dynamical system's phase space, serving as a primary measure of chaos. A positive maximum Lyapunov exponent $(\lambda_{max}>0)$ indicates sensitive dependence on initial conditions, known as the "butterfly effect," while negative values signify convergence towards a stable fixed point or attractor.

---

 Let $f$ be a continuous map on $\mathbb{R}$. The **Lyapunov number** $L(x_{1})$ of the orbit $\{ x_{1},x_{2},\dots \}$ is defined as:

 $$
 L(x_{1}) = \lim_{ n \to \infty } (|f^{'}(x_{1})|\cdot |f^{'}(x_{2})|\dots |f^{'}(x_{N})|)^{\frac{1}{n}}
$$

$h(x_{1})$ is defined as:

$$
h(x_{1}) = \lim_{ n \to \infty } \frac{1}{n} \left( \ln |f^{'}(x_{1})| + \ln |f^{'}(x_{2})| + \dots + \ln |f^{'}(_{n})| \right)
$$
