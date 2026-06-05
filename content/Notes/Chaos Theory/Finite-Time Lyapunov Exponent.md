---
date: 2026-03-05
updated: 2026-03-17T14:57:50-04:00
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
  - FTLE
  - finite-time Lyapunov
---

asymptotic [[Lyapunov Exponents|Lyapunov exponent]] $\lambda$ requires $t \to \infty$, useless its for a finite-horizon prediction or transient dynamics. the **finite time Lyapunov exponent** computes same quantity over window length $T$, yielding a *field* over phase space.

For a flow $\phi^t(x_0)$, the maximal FTLE is:

$$
\sigma^T(x_0) = \frac{1}{|T|} \ln \sqrt{\lambda_{\max}\!\left(\left[D\phi^T(x_0)\right]^\top D\phi^T(x_0)\right)}
$$

i.e. $\frac{1}{|T|}$ times log of largest singular value of the flow map Jacobian. this quantity represents maximum growth rate of any infinitesimal perturbation to $x_0$ over time $T$.

- $T \to \infty$: $\sigma^T \to \lambda_{\max}$ (global exponent)
- $T \to 0$: $\sigma^T \to \lambda_{\text{loc}}$ ([[Local Lyapunov Exponent]])
- Backward integration ($T < 0$) reveals attracting structure instead of repelling

---

## [[Lagrangian Coherent Structures]]

Primary use case is that **ridges** in the FTLE field identify something called [[Lagrangian Coherent Structures]] (LCS), think *material surfaces acting as transport barriers*.

- Ridges of forward-time FTLE ($T > 0$): repelling LCS, finite-time analogues of [[Unstable Manifold|unstable manifolds]]
- Ridges of backward-time FTLE ($T < 0$): attracting LCS, analogues of [[Stable Manifold|stable manifolds]]

Trajectories don't cross LCS on timescale $T$, which is why they matter for geophysical fluid dynamics — ocean eddies, atmospheric mixing barriers, etc. The Eulerian velocity field alone doesn't reveal them; you need to integrate trajectories and look at the FTLE field.
