---
created_on: "[[02-17-2026]]"
class:
  - note
tags:
  - math/chaos/periods
course: "[[Chaos, Fractals, and Dynamical Systems]]"
source:
related:
author:
description:
aliases:
  - AP
  - Asymptotically Periodic Orbit
date: 2026-02-17T00:00:00-05:00
updated: 2026-02-17T00:00:00-05:00
---

Let $f$ be a smooth map on $\mathbb{R}$. An orbit $\{ x_1, x_2, \dots \}$ is called *asymptotically periodic* if it converges to a periodic orbit as $n \to \infty$. In other words, there exists a periodic orbit $\{ y_1, y_2, \dots, y_k, y_1, \dots \}$ such that:

$$
\lim_{ n \to \infty } |x_n - y_n| = 0
$$

([[Eventually Periodic]] orbits are AP — they hit the cycle exactly in finite time, which is a special case. The converse doesn't hold.)

---

The typical AP orbit: $x_1$ in the basin of a period-$k$ [[Attracting fixed point|sink]] $\{ p_1, \dots, p_k \}$. The orbit spirals toward the cycle with [[Lyapunov Exponents|Lyapunov exponent]]:

$$
h(x_1) = \frac{1}{k}\left( \ln|f'(p_1)| + \dots + \ln|f'(p_k)| \right) < 0
$$

since the sink condition forces the product of derivatives to be less than 1.

[[Chaos|Chaotic orbits]] are defined in part by *not* being AP — bounded but never settling into any periodic behavior.
