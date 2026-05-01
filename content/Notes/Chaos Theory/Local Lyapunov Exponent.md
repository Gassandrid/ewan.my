---
date: 2026-03-05
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
  - LLE
  - local Lyapunov
---

The standard [[Lyapunov Exponents|Lyapunov exponent]] $\lambda$ is a global, asymptotic average over an infinite orbit. The **local Lyapunov exponent** strips away the averaging to give the instantaneous divergence rate at a single point in phase space.

For a 1D map $f$:

$$
\lambda_{\text{loc}}(x) = \ln|f'(x)|
$$

No limit, no average — just the log-derivative at $x$. The global $\lambda$ is then the time-average of this along an orbit:

$$
\lambda = \lim_{n \to \infty} \frac{1}{n} \sum_{k=0}^{n-1} \lambda_{\text{loc}}(x_k)
$$

For a flow $\dot x = F(x)$, the local exponent in perturbation direction $\hat\delta$ is the Rayleigh quotient of the Jacobian:

$$
\lambda_{\text{loc}}(x, \hat\delta) = \hat\delta^\top DF(x)\, \hat\delta
$$

showing that local divergence is direction-dependent — some directions stretch while others compress at the same point.

---

## Why it matters

The global $\lambda$ washes out spatial structure. The local LLE reveals *where* stretching and folding actually happen, which matters for:

- **Intermittency**: orbits alternating between high-LLE (stretching) and low-LLE (compressing) regions can have $\lambda \approx 0$ globally while being locally explosive
- **Finite-horizon predictability**: forecast validity depends on the local LLE along your specific trajectory, not the attractor average
- **[[Finite-Time Lyapunov Exponent|FTLE]]**: averaging $\lambda_{\text{loc}}$ over a finite window gives the FTLE, which interpolates between local structure ($T \to 0$) and the global exponent ($T \to \infty$)
