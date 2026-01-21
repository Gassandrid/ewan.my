---
class:
  - note
  - lecture
tags:
  - university
  - math/chaos
course: "[[Chaos, Fractals, and Dynamical Systems]]"
lecture-number: 2
source:
related:
author:
description:
date: 2026-01-15T10:25:05-05:00
updated: 2026-01-20T10:12:34-05:00
title: Fixed Point Classification
---

Resuming work on [[Linear Systems]] regarding the [[Logistic Map]] using a [[Cobweb Plot]]:

A **fixed point** is a point $p$ such that $f(p) = p$. Usually a sink/source, but due to periodic points, can be a rotation set of points.

> The **epsilon-neighborhood** $N_{\epsilon}(p)$ of a point $p$ is the internal $\{ x \in \mathbb{R}: |x-p| < \epsilon \}$.

> If $\exists \epsilon > 0 : \forall x  \in N_{\epsilon}(p)$, $\lim_{ k \to \infty }f^{k}(x) = p$ then we call $p$ a **sink** or **[[Attracting fixed point]]**

In plain English, if there is some neighborhood around point $p$ such that all points in that neighborhood converge to $p$ under iteration of $f$, then $p$ is a sink.

> If $\exists \epsilon > 0 :$ all $x \in N_{\epsilon}(p)$ except $p$ eventually map outside of $N_{\epsilon}(p)$, then we call $p$ a **source** or a **[[Repelling fixed point]]**.

In plain English, if there is some neighborhood around point $p$ such that all points in that neighborhood (except for $p$ itself) eventually leave that neighborhood under iteration of $f$, then $p$ is a source.

_For cases in this class, $\epsilon$ represents a small positive real number parameter._

---

## Cubic Example

Looking at the function:

$$
f(x) = \frac{3x-x^3}{2}
$$

> [!Info] Desmos
>
> <iframe src="https://www.desmos.com/calculator/mqr1jsj7l9" width=600 height="400" ></iframe>

The **fixed point [[Attracting fixed point|sink]]s are**: $x = \pm 1$

The **fixed point [[Repelling fixed point|Source]]s are**: $x=0$

**Key observations:**

- Sinks at $x = \pm 1$ are **super-attracting**: $f'(\pm 1) = 0$ (critical points = fixed points)
- Source at $x = 0$ has $f'(0) = \frac{3}{2} > 1$ (linearly unstable)
- **Odd symmetry**: $f(-x) = -f(x)$ creates symmetric basins of attraction
- Topologically similar to [[Logistic Map]] at $r=3$ (pre-chaotic regime)

> [!Abstract] Theorem
>
> Let $f$ be a smooth map (derivatives continousous), and assume $p$ is fixed point of $f$.
>
> If $|f'(p)| <1 \Rightarrow p$ is a [[Attracting fixed point|sink]].
>
> If $|f'(p)| > 1 \Rightarrow p$ is a [[Repelling fixed point|Source]].
> 
> If $|f'(p)| =1$, we need more information.

Origin is a "neutral" fixed point, all other $x \in \mathbb{R}$ are period 2. In essence, some starting position will take a minute to read the period two orbit, whereas others like $p_{1}$ will already be on the period two orbit.

---

## Periodic Sinks and Source

> Let $f$ be a map and assume $p$ is a period $k$ point. The period k orbit of $p$ is a periodic sink (source) if $p$ is a sink( source ) for the map $f^{k}$

In plain English, if $p$ is a period $k$ point, then we can look at the $k$th iterate of $f$ and classify $p$ as a sink or source based on that.
