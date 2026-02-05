---
id: Linearization and the Jacobian
aliases:
  - Jacobian Matrix
  - Local Linearization
  - Eigenvalue Analysis
  - Linearization
  - Hénon Map Jacobian
tags:
  - university
class:
  - note
  - lecture
course: "[[Chaos, Fractals, and Dynamical Systems]]"
date: 2026-02-03T10:12:30-05:00
description: how linear maps describe local behavior of nonlinear systems via the Jacobian matrix
lecture-number: 7
updated: 2026-02-03T14:23:20-05:00
---

Linear maps describe **local behavior** of nonlinear systems. Near a fixed point, any smooth map looks linear. The [[Jacobian]] matrix(the derivative of a nonlinear map) is exactly this linear approximation. So understanding how linear maps behave (sinks, sources, saddles) directly tells us how a nonlinear system behaves near its fixed points.

This is the bridge between linear and nonlinear dynamics.

---

## Linear Map Behavior

We are continuing from [[Sinks, Sources, and Saddles|the previous lecture]] on [[Sinks, Sources, and Saddles#Linear Maps|Linear Maps]]. The key insight: eigenvalues determine everything. They tell us whether a region shrinks, expands, or does both (saddle):

> ![[stableUnstableManifolds.png]]
>
> _Starting from $\vec{x}_0 = (2, 0)$, successive iterations climb along the $\lambda_1$ eigenvector direction (unstable manifold). Since $\lambda_1 = \frac{3}{2} > 1$, points expand along this direction. The $\lambda_2$ eigenvector basis forms the stable manifold - points on this line contract toward the origin since $\lambda_2 = \frac{1}{2} < 1$._

The Hénon Map has two [[Fixed Point Classification|fixed points]] where we can compute these eigendirections:

$$
(0,0) \quad \text{and} \quad (-0.6, -0.6)
$$

---

## Classification of Linear Maps

Linear maps on $\mathbb{R}^2$ come in three flavors (up to a change of coordinates to eigenvector basis). The eigenvalues determine which type, and we'll see that each type produces fundamentally different dynamics:

### Type 1: Distinct Real Eigenvalues

$$
A= \begin{bmatrix}a & 0 \\ 0 & b\end{bmatrix}
$$

The matrix is diagonal in eigenvector coordinates. Different eigenvalues mean different expansion rates in different directions, this is how saddles are born.

Maps the unit disc to an ellipse with semi-major axes of length $|a|$ (x-axis) and $|b|$ (y-axis). Behavior depends on the magnitudes:

- If $|a|,|b| < 1$: ellipse shrinks → **sink**
- If $|a|,|b| > 1$: ellipse expands → **source**
- If $|a| > 1 > |b|$ or vice versa: ellipse stretches in one direction, contracts in another → **saddle**

### Type 2: Repeated Real Eigenvalues

$$
A=\begin{bmatrix}a & 1 \\ 0 & a\end{bmatrix}
$$

Both eigenvalues are identical, so there's no direction to expand while another contracts. **No saddles here**, as saddles require competing eigenvalues with different magnitudes.

### Type 3: Complex Eigenvalues

$$
A=\begin{bmatrix}a & -b \\  b & a\end{bmatrix}
$$

Complex eigenvalues come in conjugate pairs $a \pm bi$ with equal magnitude $r = \sqrt{a^2 + b^2}$. We can factor this as:

$$
A = r \begin{bmatrix}
\cos \theta & -\sin \theta \\
\sin \theta & \cos \theta
\end{bmatrix}
$$

where $\tan \theta = b/a$. This means $A$ **rotates** points by angle $\theta$ and **scales** them by factor $r$.

**no saddle**, rotation + uniform scaling together means no stretching in one direction while contracting in another.

---

> [!Abstract] Theorem
> Let $A$ be a linear map on $\mathbb{R}^m$ represented by a matrix. Then:
>
> 1. The origin is a [[Attracting fixed point|sink]] if all eigenvalues satisfy $|\lambda| < 1$
> 2. The origin is a [[Repelling fixed point|source]] if all eigenvalues satisfy $|\lambda| > 1$
> 3. The origin is a [[Saddle fixed point|saddle]] if $A$ is **hyperbolic** (no eigenvalues with $|\lambda| = 1$) with mixed magnitudes: at least one $|\lambda| > 1$ and at least one $|\lambda| < 1$

---

## Linearizing Nonlinear Maps: The Jacobian

But most dynamical systems are **nonlinear**. The Hénon Map is nonlinear: $f(x,y) = (1 - x^2 + by, x)$. How do we use our eigenvalue theory here?

Near a fixed point $\vec{p}$, a nonlinear map behaves like a linear map. The matrix that captures this linear behavior is the **Jacobian matrix**, matrix of partial derivatives.

---

## Computing the Jacobian

Let $\vec{f} = (f_{1},f_{2},\dots,f_{m})$ be a map on $\mathbb{R}^m$ and let $\vec{p} \in \mathbb{R}^m$. The [[Jacobian]] matrix of $\vec{f}$ at $\vec{p}$, denoted $\mathcal{D}\vec{f}(\vec{p})$ is given by the matrix of [[Partial Derivatives]] of $\vec{f}$ evaluated at $\vec{p}$.

$$
\mathcal{D}\vec{f}(\vec{p})=\begin{bmatrix}
\frac{ \partial f_{1} }{ \partial x_{1} }(\vec{p})  & \frac{ \partial f_{1} }{ \partial x_{2} } (\vec{p}) & \dots & \frac{ \partial f_{1} }{ \partial x_{n} } (\vec{p}) \\
\frac{ \partial f_{2} }{ \partial x_{1} } (\vec{p}) & \frac{ \partial f_{2} }{ \partial x_{2} }  (\vec{p})& \dots & \frac{ \partial f_{2} }{ \partial x_{n} } (\vec{p}) \\
\vdots  &  \vdots  &  \vdots  &  \vdots  &
\end{bmatrix}
$$

> [!Example]
>
> Henon Map $f(x,y)= (a-x^2 + by, x)$
>
> $$
> \mathcal{D}\vec{f}(x,y) = \begin{bmatrix}
> -2x & b \\
> 1 & 0
> \end{bmatrix}
> $$

### Why Does This Work?

We will look at uses of the Taylor Series next class, heres a snippet

$$
(in \ \mathbb{R}^1): \quad f(x + h) = f(x) + f'(x)h + f''(x) \frac{h^{2}}{2!} + \dots
$$

$$
\vec{f}(\vec{p}+\vec{h}) = f(\vec{p}) + \mathcal{D}\vec{f}(\vec{p})
$$
