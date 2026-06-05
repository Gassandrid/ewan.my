---
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
  - Quasi-Periodic
  - Quasi Periodic Orbit
date: 2026-02-17T00:00:00-05:00
updated: 2026-02-17T10:51:24-05:00
---

A bounded orbit that is not [[Asymptotically Periodic]] and does not exhibit [[Sensitive Dependence on Initial Conditions|SDIC]]. Sits between periodic and [[Chaos|chaotic]] — never repeats, never settles, but nearby orbits don't diverge either. [[Lyapunov Exponents|Lyapunov exponent]] $h = 0$.

---

The prototypical example is irrational rotation:

$$
f(x) = (x + q) \pmod{1} \quad q \in \mathbb{R} \setminus \mathbb{Q}
$$

> [!Info] Desmos
> <iframe src="https://www.desmos.com/calculator/rkda9auwgz" width=600 height="400" ></iframe>

$f'(x) = 1$ everywhere, so $h = 0$, no stretching, no contraction. The orbit is dense in $[0,1]$ (visits every subinterval), never repeating, but neighbors travel with it at constant separation.

If $q$ were rational, orbits would be [[Eventually Periodic]]. The irrational case keeps the orbit structurally recurrent without ever closing.
