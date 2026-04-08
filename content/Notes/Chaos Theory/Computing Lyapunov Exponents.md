---
created_on: "[[04-07-2026]]"
class:
  - note
  - lecture
tags:
  - university
  - math/chaos/sensitivity
course: "[[Chaos, Fractals, and Dynamical Systems]]"
lecture-number: 20
source:
related:
author:
description:
aliases:
date: 2026-04-07T10:13:22-04:00
updated: 2026-04-07T11:15:15-04:00
---

$$
J_{n} = \mathcal{D} \vec{f}^{n} ( \vec{v}_{0})
$$

is typically difficult to write down for large $n$, so we are forced to calculate the ellipsoid $J_{n}U$ on $\mathbb{R}^{m}$ on the computer.

However, $J_{n}U$ has axes of length $r^{n}_{k}$ where $(r_{k}^{n})^2$ are the eigenvalues of $J_{n}J_{n}^{\intercal}$. These are difficult to calculate. 

Large $n\to ellipsoid$ is quite long in some directions, and quite thin on others. i.e., $r^{n}_{1}> > r^{n}_{m}$ and $J_{n}J_{n}^{\intercal}$ is ill-conditioned.

### Fixing This with Chain Rule

$$
J_{n}U = \mathcal{D} \vec{f}^{n} (\vec{v}_{0}) U = \mathcal{D}\vec{f}(\vec{v}_{n-1}) \cdot \mathcal{D}\vec{f}(\vec{v}_{n-2})\dots \mathcal{D}\vec{f}(\vec{v}_{0})
$$

Superscript now indexes iterate, subscripts index direction of decreasing expansion.

Take a unit ball in $\mathbb{R}^{m}$ defined by an [[Orthogonality|orthonormal]] basis:

$$
\{ \hat{w}_{1}^{0}, \hat{w}_{2}^{0}, \dots, \hat{w}_{m}^{0} \}
$$

around $\vec{v}_{0}$ and compute:

$$
\begin{align*}
\vec{z}_{1}^{0} &= \mathcal{D} \vec{f}(\vec{v}_{0}) \hat{w}_{1}^{0} \\
\vec{z}_{2}^{0} &= \mathcal{D}\vec{f}(\vec{v}_{0})\hat{w}_{2}^{0}  \\
& \vdots \\
\vec{z}_{m}^{0} &= \mathcal{D}\vec{f}(\vec{v}_{0}) \hat{w}_{m}^{0}
\end{align*}
$$

$\vec{z}_{i}$ lie on surface of the ellipsoid $\mathcal{D}\vec{f}(\vec{v}_{0})U$, not necessarily [[Orthogonality|Orthogonal]].

To make [[Orthogonality|Orthogonal]] vectors on an ellipsoid with the same volume as $\mathcal{D}\vec{f}(\vec{v}_{0})U$, we use [[Gram-Schmidt Process]].

$$
\begin{align}
\vec{y}_{1}^{1} &= \vec{z}_{1}^{0} \\
\vec{y}_{2}^{1} &= \vec{z}_{2}^0 - \vec{z}_{2}^0 \cdot \left(  \frac{\vec{y}_{1}^1}{||\vec{y}_{1}^1||} \right) \cdot \left(  \frac{\vec{y}_{1}^1}{||\vec{y}_{1}^1||} \right)
\end{align}
$$

This leaves us wtih $\vec{y}_{j}^1$ as the component of $\vec{z}_{j}^0$ perpendicular to $\vec{y}_{1}^1,\vec{y}_{2}^1, \dots \vec{y}_{j-1}^1$ and the resulting set of vectors

$$
\hat{w}_{1}^1 = \frac{\vec{y}_{1}^1}{||\vec{y}_{1}^1||} \quad \hat{w}_{2}^1 = \frac{\vec{y}_{2}^1}{||\vec{y}_{2}^1||} \quad \dots \quad \hat{w}_{m}^1 = \frac{\vec{y}_{m}^1}{||\vec{y}_{m}^1||}
$$

$\hat{w}$ are [[Orthogonality|orthonormal]] vectors in the expanding and contracting directions around $v_{0}$ and $||\vec{y}_{i}^1||$ measure the one step growth rate in direction $i$.

Next, we apply $\mathcal{D}\vec{f}(\vec{v}_{1})$ to the $\hat{w}_{i}^1$ basis:

$$
\begin{align}
\vec{z}_{1}^1 &= \mathcal{D}\vec{f}(\vec{v}_{1})\hat{w}_{1}^1 \\
\vec{z}_{2}^1 &= \mathcal{D}\vec{f}(\vec{v}_{1}) \hat{w}_{2}^1
\end{align}
$$

**Repeat:** in the limit of this process:

$$
r_{i}^{n} Z ||\hat{y}_{i}^n||\cdot ||\hat{y}_{i}^{n-1}|| \dots ||\vec{y}_{i}^1||
$$

and the $i^{th}$ largest [[Lyapunov Exponents|Lyapunov Exponent]] after $n$ steps is:

$$
\frac{1}{N} \sum_{j=1}^{N}  \ln ||\vec{y}_{i}^{j}||
$$
