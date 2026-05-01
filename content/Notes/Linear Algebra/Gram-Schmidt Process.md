---
class:
  - note
tags:
  - math/linear-algebra
  - math/chaos
  - generated/claude
source:
related:
  - "[[Orthogonality]]"
  - "[[Computing Lyapunov Exponents]]"
  - "[[Notes/Linear Algebra/Module 1/Vectors]]"
author:
description: Algorithm for constructing an orthonormal basis from an arbitrary set of linearly independent vectors. Equivalent to QR decomposition.
aliases:
  - QR decomposition
  - Gram-Schmidt
  - Gram Schmidt
date: 2026-04-07T10:41:43-04:00
updated: 2026-04-16T23:35:20-04:00
---

procedure for constructing an [[Orthogonality|orthonormal]] basis from a set of linearly independent vectors. At each step, subtract off component of new vector that lies along all previously accepted directions.

## Algorithm

Given linearly independent vectors $\vec{v}_1, \dots, \vec{v}_n \in \mathbb{R}^m$, produce an orthonormal set $\hat{e}_1, \dots, \hat{e}_n$:

$$
\begin{align}
\vec{u}_1 &= \vec{v}_1 \\
\vec{u}_k &= \vec{v}_k - \sum_{j=1}^{k-1} \left( \vec{v}_k \cdot \hat{e}_j \right) \hat{e}_j \qquad k = 2, \dots, n
\end{align}
$$

then normalize: $\hat{e}_k = \dfrac{\vec{u}_k}{\|\vec{u}_k\|}$.

The projection step $\left(\vec{v}_k \cdot \hat{e}_j\right)\hat{e}_j$ removes the component of $\vec{v}_k$ in the $\hat{e}_j$ direction, leaving only what's orthogonal to everything already in the basis.

![[gramShitFigure.png]]

## QR Decomposition

Think of the input vectors as columns of a matrix $A$. Gram-Schmidt produces exactly $A = QR$:

- $Q$ has the orthonormal vectors $\hat{e}_k$ as columns
- $R$ is upper triangular -- the $(j,k)$ entry is $\vec{v}_k \cdot \hat{e}_j$ (the projection coefficients from step $k$ onto direction $j < k$), and the diagonal is $\|\vec{u}_k\|$

So QR decomposition and Gram-Schmidt are the same computation, just described from different angles. Numerically, [[Modified Gram-Schmidt]] or [[Householder reflections]] are preferred for stability.

## Why It Preserves Volume

The key property used in Lyapunov exponent computation: orthogonalizing the $\vec{z}_i$ vectors into $\vec{y}_i$ **preserves the volume** of the parallelepiped they span. The lengths $\|\vec{u}_k\|$ before normalization are what get logged to accumulate the Lyapunov exponents -- no information is thrown away, it's just repackaged into an axis-aligned ellipsoid.

## In Lyapunov Exponent Computation

See [[Computing Lyapunov Exponents]]. At each iterate $n$, we have vectors $\vec{z}_i^{n-1} = \mathcal{D}\vec{f}(\vec{v}_{n-1})\hat{w}_i^{n-1}$ that are no longer orthogonal. Gram-Schmidt gives:

$$
\begin{align}
\vec{y}_1^n &= \vec{z}_1^{n-1} \\
\vec{y}_2^n &= \vec{z}_2^{n-1} - \left(\vec{z}_2^{n-1} \cdot \hat{y}_1^n\right)\hat{y}_1^n \\
&\vdots
\end{align}
$$

The new orthonormal basis $\hat{w}_i^n = \hat{y}_i^n$ is used as input for the next step, and $r_i^n = \|\vec{y}_i^n\|$ feeds into the running average for $\lambda_i$.

 iterative re-orthogonalization prevents the numerical collapse that would otherwise occur as the most-expanding direction dominates all vectors.
