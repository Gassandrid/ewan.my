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
updated: 2026-02-05T10:15:37-05:00
---

Continuing from [[Linearization and the Jacobian|last lecture:]]

What about stability of period $k$ points in $\mathbb{R}^{2}$?

For $a=0.43, \quad b=0.4$, there is a period-2 orbit given by:

$$
\{ (0.7, -0.1), (-0.1,0.7) \}
$$

To check stability, we could compute the [[Jacobian]] of $\vec{f}^2$  or multiply [[Jacobian]]s of $f$ at both points:

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
