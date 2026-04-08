---
date: 2025-09-09
created_on: "[[09-09-2025]]"
updated: 2025-09-09
class:
  - note
tags:
  - math/probability/stochastic
source:
related:
author:
aliases:
  - brownian
  - Brownian
---
**Brownian Motion** (or **Wiener Process**) is a fundamental concept in probability theory and stochastic processes. It describes the random motion of particles suspended in a fluid, but it also has applications in various fields such as physics, finance, and biology.

![[Brownian_motion_large.gif]]

---

## Properties

The best way to describe Brownian motion is through its defining properties:

1. (Start at zero) $B_0 = 0$ almost surely.
2. Independent increments: For $0 \le t_0 < t_1 < \dots < t_n$, the increments
   $B_{t_1}-B_{t_0}, \dots, B_{t_n}-B_{t_{n-1}}$ are independent.
3. Stationary Gaussian increments: For $0 \le s < t$, $B_t - B_s \sim \mathcal{N}(0, t - s)$.
4. Continuous paths: With probability $1$, $t \mapsto B_t$ is continuous (nowhere
   differentiable a.s.).
5. Martingale: $(B_t)$ is a martingale; also $(B_t^2 - t)$ is a martingale.
6. Scaling (self-similarity): For any $c>0$, $(B_{ct}) \overset{d}{=} (\sqrt{c}\, B_t)$.
7. Quadratic variation: $[B]_t = t$; sums of $(\Delta B)^2$ over partitions converge to $t$.
8. Markov property: Conditional on $B_s$, the future increments depend only on $s$.
9. Time homogeneity: Distributions depend only on time differences $t - s$.

## Definition

Brownian motion can be formally defined as a stochastic process $(B_t)_{t \ge 0}$ that satisfies the properties listed above. It can be constructed in various ways, such as through the limit of random walks or using the Wiener measure.

**As a function:**

$$
B_t = \lim_{n \to \infty} \frac{1}{\sqrt{n}} \sum_{i=1}^{\lfloor nt \rfloor} X_i
$$
