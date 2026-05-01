---
class:
  - note
tags:
  - math/chaos/periods
  - university
course: "[[Chaos, Fractals, and Dynamical Systems]]"
source:
related:
author:
description:
aliases:
  - EP
  - Eventually Periodic Orbit
date: 2026-02-17T00:00:00-05:00
updated: 2026-03-05T10:02:14-05:00
---

orbit $\{ x_1, x_2, \dots \}$ is **eventually periodic** if lands *exactly* on a periodic orbit after finitely many steps and cycles from there. Formally, $\exists$ $\mathbb{Z}$ $N \geq 0$, $k \geq 1$ such that:

$$
f^{N+k}(x_1) = f^N(x_1)
$$

Every EP orbit is also [[Asymptotically Periodic]], landing on the cycle is a stronger condition than converging to it. Not every AP orbit is EP.

---

class classic example: under $f(x) = 3x \pmod{1}$, all rationals are EP. The map acts as a left-shift on base-3 digits, so any eventually-repeating base-3 expansion hits a cycle in finite steps (proven in HW2). e.g.

$$
\frac{1}{12} \mapsto \frac{1}{4} \mapsto \frac{3}{4} \mapsto \frac{1}{4} \mapsto \dots
$$

one transient step, then locked into the period-2 [[Repelling fixed point|source]] $\left\{ \frac{1}{4}, \frac{3}{4} \right\}$.

The [[Lyapunov Exponents|Lyapunov exponent]] of an EP orbit equals that of the target cycle — the transient washes out in the limit.
