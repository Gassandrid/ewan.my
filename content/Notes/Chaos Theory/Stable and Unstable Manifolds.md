---
id: Jacob continued
aliases: []
tags:
  - university
  - math/chaos
class:
  - note
  - lecture
course: "[[Chaos, Fractals, and Dynamical Systems]]"
date: 2026-02-05T10:09:33-05:00
lecture-number: 8
updated: 2026-02-08T10:29:45-05:00
---

Continuing from [[Linearization and the Jacobian|last lecture:]]

What about stability of period $k$ points in $\mathbb{R}^{2}$?

For $a=0.43, \quad b=0.4$, there is a period-2 orbit given by:

$$
\{ (0.7, -0.1), (-0.1,0.7) \}
$$

To check stability, we could compute the [[Jacobian]] of $\vec{f}^2$ or multiply [[Jacobian]]s of $f$ at both points:

$$
\begin{align*}
\mathcal{D}\vec{f}^{2}(\vec{x})&= \mathcal{D}\vec{f}(\vec{f}(\vec{x})) \cdot \mathcal{D}\vec{f}^{2}(\vec{x}) \\
\mathcal{D}\vec{f}^{2} ((0.7,-0.1))&= \mathcal{D}\vec{f}((-0.1,0.7)) \cdot  \mathcal{D}\vec{f}((0.7,-0.1)) \\
&= \underbrace{ \begin{bmatrix}
0.12 & 0.08 \\
-1.4 & 0.4
\end{bmatrix} }_{ \text{eigenvalues } \approx 0.26 \pm 0.3i }
\end{align*}
$$

This implies that the period-2 orbit is a [[Attracting fixed point|sink]].

---

## Stable and Unstable Manifolds

Lets consider the linear map $f(x,y)= (\frac{2x,y}{2})$:

$$
or \quad A = \begin{bmatrix}
2 & 0 \\
0 & \frac{1}{2}
\end{bmatrix}
$$

> ![[Screenshot 2026-02-05 at 10.21.11 AM.png]]
>
> Points on the y-axis see origin as a [[Attracting fixed point|sink]]. But we know it is a saddle. $\lambda_{1}=2, \lambda_{2}=\frac{1}{2}, \vec{v}_{1}=\begin{bmatrix}1 \\ 0\end{bmatrix},\vec{v}_{2}=\begin{bmatrix}0 \\ 1\end{bmatrix}$

The **y-axis** is a [[Stable Manifold]]

The **x-axis** is a [[Unstable Manifold]]

We say a map $\vec{f}$ on $\mathbb{R}^{m}$ is **one-to-one** if:

$$
\vec{f}(\vec{v}_{1}) = \vec{f}(\vec{v}_{2}) \Rightarrow \vec{v}_{1}= \vec{v}_{2}
$$

If a function is **one-to-one**, then its inverse map is _also a function_ $f^{-1}$, e.g.:

$$
f^{-1}(x,y) = (y, 2x)
$$

Let $\vec{f}$ be a smooth 1-1 map on $\mathbb{R}^{2}$ and let $\vec{p}$ be a [[Saddle fixed point]] (or periodic saddle point).

> [!Abstract] Definition
>
> The [[Stable Manifold]] of $\vec{p}$, call it $S(\vec{p})$, is the set of points $\vec{v}$ such that:
>
> $$
> |\vec{f}^{n}(\vec{v})-\vec{f}^{n}(\vec{p})|\to 0 \quad as \ n\to \infty
> $$
>
> The [[Unstable Manifold]] of $\vec{p}$, call it $U(\vec{p})$, is the set of points $\vec{v}$ such that
>
> $$
> |\vec{f}^{-n}(\vec{v})-\vec{f}^{-n} (\vec{p})|\to 0 \quad as \ n\to \infty
> $$
