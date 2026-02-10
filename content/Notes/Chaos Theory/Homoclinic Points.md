---
date: 2026-02-10T10:11:58-05:00
updated: 2026-02-10T11:09:42-05:00
class:
  - note
  - lecture
tags:
  - university
  - math/chaos
course: "[[Chaos, Fractals, and Dynamical Systems]]"
lecture-number: 9
source:
related:
author:
description:
aliases:
---

Consider the [[Linearization and the Jacobian|Non Linear Map]] of the equation:

$$
f(x,y) = \left( \frac{x}{2}, 2y-7x^2 \right)
$$

![[Screenshot 2026-02-10 at 10.13.29 AM.png]]

The [[Stable Manifold]] $S$ is a parabola tangent to the x-axis at 0; the [[Unstable Manifold]] $U$ is the y-axis.

[[Linearization and the Jacobian|Jacobian Matrix]] Matrix for this space:

$$
\mathcal{D}\vec{f} = \begin{pmatrix}
\frac{1}{2} & 0 \\
-14x & 2
\end{pmatrix}
$$

Eigenvalues for this are $\frac{1}{2}, 2$, with corresponding eigenvectors $\begin{bmatrix}1 \\ 0\end{bmatrix}, \begin{bmatrix}0 \\ 1\end{bmatrix}$, **tangent to $s$ and $u$**

In this example, $S$ and $U$ don't intersect (except at the origin). But what happens when they do?

---

Poincaré discovered during his study of the [[Three Body Problem]] that the [[Stable Manifold]] and [[Unstable Manifold]]s of a [[Saddle fixed point]] can intersect each other ( We note that $S$ and $U$ can **not** intersect themselves )

Assume $\vec{p}$ is [[Fixed Point Classification|Fixed]] or [[Periodic Orbit Stability|periodic]]  and is a [[Saddle fixed point|saddle]]. Also assume $\vec{h}_{0} \neq \vec{p}$ is a point of intersection of $S$ and $U$, in other words:

$$
\vec{h}_{0} \in S(\vec{p}) \quad and \quad \vec{h}_{0} \in U(\vec{p})
$$

We then say $\vec{h}_{0}$ is a homoclinic point, and if $\vec{h}_{0} \in S(\vec{p})$, then so is $\vec{h}_{1}$ ( where $\vec{h}_{1} = \vec{f}(\vec{h}_{0})$, same for $\vec{h}_{2}$ and so on ). Also $\vec{h}_{-1} = f^{-1}(\vec{h}_{0})$, and $\vec{h}_{-2}=f^{-2}(\vec{h}_{0})$ are in $S(\vec{p})\dots$ in fact the *entire* forward and backward orbit of $\vec{h}_{0}$ is in $S$. And by the same reasoning

To understand the geometry of how $S$ and $U$ can intersect, we need tools for analyzing how linear maps deform space:

---

Let $N$ be the unit disc in $\mathbb{R}^m$ and let $A$ be an $m\times m$ matrix. Let $s_{1}^{2} \geq s_{2}^{2} \geq \dots s_{m}^{2} \geq 0$ and $\hat{u}_{1},\hat{u}_{2}, \dots, \hat{u}_{m}$ be the eigenvalues and unit eigenvectors of the $m\times m$ matrix $AA^{T}$.

1. $\hat{u}_{i}$ are **mutually [[Orthogonality|orthogonal]]** unit vectors
2. the axes of the ellipse $AN$ are $s_{i}\hat{u}_{i}$ for $1\leq i \leq m$.

Somestimes we call $s_{i}$ the **singular values** of $A$, indexed in descending order ( think [[Singular Value Decomposition]] ).

>[!Example]
>
> $$
> A = \begin{bmatrix}
> \frac{1}{2} & \frac{1}{2} \\
> 0 & 2
> \end{bmatrix} \quad \lambda_{1}=\frac{1}{2}, \lambda_{2}=2
> $$

To see how $A$ maps the unit disc, we look at $AA^{T}$:

$$
\begin{bmatrix}
\frac{1}{2} & \frac{1}{2} \\
0 & 2
\end{bmatrix} \begin{bmatrix}
\frac{1}{2} & 0 \\
\frac{1}{2} & 2
\end{bmatrix} = \begin{bmatrix}
\frac{1}{2} & 1 \\
1 & 4
\end{bmatrix}
$$

which has eigenvalues $s_{1}^{2} \approx 4.3$ and $s_{2}^{2} \approx 0.23$, $s_{1} \approx 2.1$ and $s_{2} \approx 0.48$.

and corresponding eigenvectors:

$$
\hat{u}_{1} \approx \begin{bmatrix}
0.26 \\
0.97
\end{bmatrix} \quad and \quad \hat{u}_{2} \approx \underbrace{ \begin{bmatrix}
-0.97 \\
0.26
\end{bmatrix}  }_{ \text{or negation of this} }
$$

![[greatestFuckingIllustrationOAT.png]]
