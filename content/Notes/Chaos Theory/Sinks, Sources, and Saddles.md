---
class:
  - note
  - lecture
tags:
  - university
  - math/chaos
course: "[[Chaos, Fractals, and Dynamical Systems]]"
lecture-number: 6
source:
related:
author:
description: henon map in the context of sinks, sources, and saddles, where the fixed point is at the origin.
aliases:
date: 2026-01-29T10:26:19-05:00
updated: 2026-01-29T10:48:23-05:00
---

## Sink at Origin (Stable Fixed Point)

> ![[sinkAtOriginHenon.png]]
>
> _A neighborhood N (red circle) centered at the origin contracts under the map f to a smaller region f(N) (green irregular shape) strictly contained within N._

At a sink, both eigenvalues of the [[Jacobian]] have absolute value less than 1. Under iteration of the [[Hénon Map]] $x_{n+1} = 1 - ax_n^2 + y_n$, $y_{n+1} = bx_n$, trajectories starting in a neighborhood of the fixed point spiral inward. The contraction is visible as $f(N) \subset N$, indicating the basin of attraction. For the [[Hénon Map]], this occurs when the parameters $(a, b)$ satisfy conditions where $|\lambda_1|, |\lambda_2| < 1$.

## Source at Origin (Unstable Fixed Point - Repeller)

> ![[sourceAtOriginHenon.png]]
>
> _A neighborhood N (tan/beige inner circle) expands under the map to a larger region f(N) (green irregular shape) that extends beyond the original neighborhood._

At a source, both eigenvalues have absolute value greater than 1. Trajectories flow away from the fixed point in all directions. The expansion $f(N) \supset N$ shows that nearby points are pushed outward under iteration. In the Henon map, this behavior is time-reversed from a sink - if you ran the dynamics backward, a source would become a sink.

## Saddle at Origin (Hyperbolic Fixed Point)

> ![[saddleAtOriginHenon.png]]
>
> _A neighborhood N experiences both contraction and expansion. The red region shows the stable manifold (attracting direction), while the green lobes of f(N) show the unstable manifold (repelling direction). The image stretches along one axis while contracting along another._

At a saddle point, one eigenvalue has $|\lambda_1| < 1$ (stable direction) and the other has $|\lambda_2| > 1$ (unstable direction). This is the most common and important case for the Henon map in its chaotic regime. The stable manifold (red) represents the set of points that approach the fixed point under forward iteration, while the unstable manifold (green lobes) represents points that approached the fixed point under backward iteration. The characteristic saddle topology - stretching in one direction, contracting in another - is fundamental to the horseshoe dynamics and chaotic behavior of the Henon map.
