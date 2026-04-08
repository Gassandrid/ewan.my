---
date: 2026-04-02T10:22:36-04:00
updated: 2026-04-02T11:18:16-04:00
created_on: "[[04-02-2026]]"
class:
  - note
  - lecture
tags:
  - university
  - math/chaos
course: "[[Chaos, Fractals, and Dynamical Systems]]"
lecture-number: 19
source:
related:
author:
description:
aliases:
---

## [[Lyapunov Exponents]]

Maps in $\mathbb{R}^{m}$ will have $m$ [[Lyapunov Exponents#Lyapunov Number|lyapunov numbers]] measuring hte rate of separation from the current orbit along $m$ [[Orthogonality|orthogonal]] directions.

**Direction 1**: largest rate of expansion ( least contracting if the map contracts in all directions ) 

**Direction 2**: largest *remaining* rate in all directions perpendicular to **direction 1**

Let $\vec{f}$ be a smooth map on $\mathbb{R}^{n}$ and let $J_{n}=D\vec{f}^{n}(\vec{v}_{0})$ be the [[Jacobian]] of the $n^{th}$ iterate of $\vec{f}$.

For $K=1,2,\dots,m$, let $r^{n}_{k}$ be the length of the $k^{th}$ longest [[Orthogonality|orthogonal]] axis of the ellipsoid $J_{n}U$ ( where $U$ is the unit disk ) for an orbit with initial point $\vec{v}_{0}$

Then $r^{n}_{k}$ measures the contraction/expansion near $\vec{v}_{0}$ during the first $n$ iterates. The $k^{th}$ [[Lyapunov Exponents#Lyapunov Number|Lyapunov Number]] of $\vec{v}_{0}$ is:

$$
L_{K}= \lim_{ n \to \infty } (r^{n}_{k})^{\frac{1}{n}}
$$

if it exists and the $k^{th}$ [[Lyapunov Exponents|Lyapunov Exponent]] of $\vec{v}_{0}$ is:

$$
h_{k} = \ln(L_{k})
$$

> [!Note]
>
> $$
> L_{1} \geq L_{2} \geq \dots \geq L_{m}
> $$
>
> and
>
> $$
> h_{1} \geq h_{2} \geq \dots \geq h_{m}
> $$

Let $\vec{f}$ be a map on $\mathbb{R}^{m}$, $m \geq 1$ and let $\{ \vec{v}_{0},\vec{v}_{1},\dots \}$ be a bounded [[Periodic Orbit Stability|orbit]] of $\vec{f}$. The orbit is [[Chaos|chaotic]] if:

1. it is not [[Asymptotically Periodic]]
2. no [[Lyapunov Exponents#Lyapunov Number|Lyapunov Number]] is 1
3. $L_{1}(\vec{v}_{0})>1$ , or $h_{1}>0$

>[!Abstract] Definition
>  Skinny [[Bakers Map]] (cutting out the middle third) on $\mathbb{R}^{3}$:

Let $S = [0,1] \times [0,1]$

For $0 \leq x_{2} \leq \frac{1}{2}$:

$$
B(x_{1},x_{2}) = \begin{pmatrix}
\frac{1}{3} & 0 \\
0 & 2
\end{pmatrix} \begin{pmatrix}
x_{1} \\
x_{2}
\end{pmatrix}
$$

For $\frac{1}{2} \leq x_{2} \leq 1$:

$$
B(x_{1},x_{2}) = \begin{pmatrix}
\frac{1}{3} & 0 \\
0 & 2
\end{pmatrix} \begin{pmatrix}
x_{1} \\
x_{2}
\end{pmatrix} + \begin{pmatrix}
\frac{2}{3} \\
-1
\end{pmatrix}
$$

The invariant set $A$ of the map $B$ consists of points that lie in $B^{n}(S) \forall n \in \mathbb{Z}$, a middle third [[Cantor Set]] of x-coords.

The [[Lyapunov Exponents]]: we need to find 

$$
J=\mathcal{D}B(\vec{v}) = \begin{pmatrix}
\frac{1}{3} & 0 \\
0 & 2
\end{pmatrix}
$$

which yields LE: $\ln(2), -\ln(3)$

$\implies$ every 
