---
date: 2026-02-12T10:20:31-05:00
updated: 2026-03-05
class:
  - note
tags:
  - math/chaos
  - math/dynamical-systems
source:
related:
author:
description:
aliases:
  - Lyapunov
  - Lyapunov Exponent
---

Lyapunov exponents $\lambda$ quantify the exponential rate at which nearby trajectories in phase space diverge or converge — the primary measure of [[Chaos|chaos]]. A positive maximal exponent $\lambda_{\max} > 0$ indicates [[Sensitive Dependence on Initial Conditions]], while $\lambda < 0$ means the system contracts toward a [[Stable Manifold|stable]] [[Fixed Point Classification|fixed point]] or [[Attractor Network|attractor]].

---

## Lyapunov Number

Let $f$ be a continuous map on $\mathbb{R}$. The **Lyapunov number** $L(x_1)$ of the orbit $\{x_1, x_2, \ldots\}$ is:

$$
L(x_1) = \lim_{n \to \infty} \left(|f'(x_1)| \cdot |f'(x_2)| \cdots |f'(x_n)|\right)^{1/n}
$$

The asymptotic geometric mean of derivatives — how much does a small perturbation grow per iterate, on average?

$$
L < 1 \Rightarrow \text{contracting} \qquad L > 1 \Rightarrow \text{stretching (chaotic)}
$$

## Lyapunov Exponent

$\lambda = \ln L$, i.e. the arithmetic mean of log-derivatives:

$$
\lambda(x_1) = \lim_{n \to \infty} \frac{1}{n} \sum_{k=0}^{n-1} \ln|f'(x_k)|
$$

This is the time-average of $\ln|f'|$ along the orbit. By the Birkhoff ergodic theorem, for an ergodic invariant measure $\mu$ this equals $\int \ln|f'|\, d\mu$ for typical orbits.

---

## Higher Dimensions

For maps or flows on $\mathbb{R}^n$ there is a full **Lyapunov spectrum** $\lambda_1 \geq \lambda_2 \geq \cdots \geq \lambda_n$, one per dimension. These come from the singular values of the $n$-step Jacobian $Df^n(x_0)$. Key facts:

- $\sum_i \lambda_i$ = asymptotic volume contraction rate
- Dissipative systems: $\sum \lambda_i < 0$
- Hamiltonian systems: $\sum \lambda_i = 0$ (Liouville), exponents come in $\pm$ pairs

---

## Logistic Map

For $f_r(x) = rx(1-x)$, $\lambda = \ln 2 \approx 0.693$ at $r = 4$ (fully chaotic, conjugate to the tent map). In periodic windows $\lambda < 0$, and $\lambda = 0$ exactly at bifurcation points.

![[p5_lyapunov.png]]

---

See also: [[Local Lyapunov Exponent]], [[Finite-Time Lyapunov Exponent]]
