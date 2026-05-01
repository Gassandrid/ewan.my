---
id: Stable Manifold
aliases:
  - Stable Manifolds
  - Stable Direction
tags:
  - university
  - math/chaos
class:
  - note
course: "[[Chaos, Fractals, and Dynamical Systems]]"
date: 2026-02-05T10:32:15-05:00
description: concept in dynamical systems describing points that converge to a saddle fixed point under forward iteration
related:
  - "[[Linearization and the Jacobian]]"
  - "[[Unstable Manifold]]"
  - "[[Sinks, Sources, and Saddles]]"
  - "[[Saddle fixed point]]"
updated: 2026-02-05T10:35:07-05:00
---
The **stable manifold** of a [[Saddle fixed point|saddle]] fixed point is the set of points that converge to the fixed point under forward iteration. It's the direction of contraction.

For a linear map with a [[Saddle fixed point|saddle]] at the origin, the stable manifold is the subspace spanned by eigenvectors with $|\lambda| < 1$.

---

## Linear Example

Consider the diagonal linear map:

$$
A = \begin{bmatrix}
2 & 0 \\
0 & \frac{1}{2}
\end{bmatrix}
$$

Eigenvalues: $\lambda_1 = 2$, $\lambda_2 = \frac{1}{2}$

Eigenvectors: $\vec{v}_1 = \begin{bmatrix} 1 \\ 0 \end{bmatrix}$, $\vec{v}_2 = \begin{bmatrix} 0 \\ 1 \end{bmatrix}$

The **y-axis** is the stable manifold. Points on the y-axis satisfy:

$$
\vec{x}_n = A^n \vec{x}_0 = \begin{bmatrix}
0 \\
y_0 \cdot \left(\frac{1}{2}\right)^n
\end{bmatrix} \to \begin{bmatrix} 0 \\ 0 \end{bmatrix}
$$

As $n \to \infty$, every point on the y-axis converges to the origin because $\left(\frac{1}{2}\right)^n \to 0$.

---

## Geometric

The stable manifold is the set of initial conditions that "end up" at the fixed point. If you start on the stable manifold and iterate forward, you approach the fixed point.

Near a saddle, the stable manifold looks like the eigenvector direction associated with the contracting eigenvalue.

For [[Saddle fixed point|saddles]] in $\mathbb{R}^2$:

- The stable manifold is typically a curve (1-dimensional)
- Points off the manifold diverge from the fixed point
- The stable manifold acts as a "separatrix" between basins of attraction

---

## Nonlinear

For nonlinear maps, the stable manifold is generally **curved** (not a straight line). But near the fixed point, it's tangent to the stable eigenvector direction.

The [[Stable Manifold Theorem]] guarantees that smooth stable manifolds exist for hyperbolic fixed points, and they're tangent to the stable eigenspace at the fixed point.

---

- **Stable manifold**: converges to the fixed point under **forward** iteration ($n \to \infty$)
- **[[Unstable Manifold]]**: converges to the fixed point under **backward** iteration ($n \to -\infty$)
