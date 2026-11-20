---
class:
  - note
tags:
  - math/dynamical-systems/chaos
  - university
source:
related:
author:
description:
aliases:
  - Saddle
  - Hyperbolic fixed point
date: 2026-02-03T00:00:00-05:00
updated: 2026-02-03T14:04:39-05:00
---
A [[Fixed Point Classification|fixed point]] $p$ is a **saddle** if one eigenvalue satisfies $|\lambda_1| < 1$ (stable direction) and another satisfies $|\lambda_2| > 1$ (unstable direction).

In plain English, nearby points approach $p$ along one direction and are repelled along another.

The **[[Stable Manifold|stable manifold]]** is the set of points converging to $p$ under forward iteration. The **[[Unstable Manifold|unstable manifold]]** is the set of points that approached $p$ under backward iteration. Together they create the characteristic saddle topology—stretching in one direction, contracting in another.

Saddles are fundamental to [[Chaos|chaotic dynamics]]. They create [[Sensitive Dependence on Initial Conditions|sensitivity to initial conditions]] because small errors in the stable direction get amplified exponentially along the unstable direction.
