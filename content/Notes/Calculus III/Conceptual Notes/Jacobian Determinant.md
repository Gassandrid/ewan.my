---
date: 2024-10-31
tags:
  - math
  - generated
---

> [!info] **Overview**
> The Jacobian determinant is a concept from vector calculus that helps in transforming between coordinate systems. It represents the scaling factor of the transformation at a given point and is especially useful when changing variables in multivariable integrals.

### Definition of the Jacobian Determinant

The Jacobian determinant is defined for a transformation $\mathbf{F} : \mathbb{R}^n \rightarrow \mathbb{R}^n$ where $\mathbf{F}$ maps coordinates $(x_1, x_2, \dots, x_n)$ to $(u_1, u_2, \dots, u_n)$. It’s represented by the determinant of the **Jacobian matrix** $J$, which is given by:

$$
J = \begin{vmatrix} \frac{\partial u_1}{\partial x_1} & \frac{\partial u_1}{\partial x_2} & \dots & \frac{\partial u_1}{\partial x_n} \\ \frac{\partial u_2}{\partial x_1} & \frac{\partial u_2}{\partial x_2} & \dots & \frac{\partial u_2}{\partial x_n} \\ \vdots & \vdots & \ddots & \vdots \\ \frac{\partial u_n}{\partial x_1} & \frac{\partial u_n}{\partial x_2} & \dots & \frac{\partial u_n}{\partial x_n} \end{vmatrix}
$$

### Key Points

> [!tip] **Interpretation**
> The Jacobian determinant measures the rate at which area, volume, or hypervolume changes under the transformation $\mathbf{F}$. If $|\det(J)| > 1$, the transformation stretches space; if $|\det(J)| < 1$, it compresses space. When $\det(J) = 0$, the transformation is singular at that point, meaning it compresses the space completely along some dimension.

### Applications

#### Change of Variables in Integrals

For a transformation from coordinates $(x, y)$ to $(u, v)$, the area element $dx\,dy$ is transformed to $| \det(J) | \, du \, dv$. Thus, when changing variables in a double integral, we use the Jacobian determinant as a correction factor:

$$
\iint_{R} f(x, y) \, dx \, dy = \iint_{S} f(u, v) \, \left| \det(J) \right| \, du \, dv
$$

> [!example] **Example**
> Consider the transformation $u = x^2 - y^2$ and $v = 2xy$. To compute the Jacobian determinant $J$ for this transformation, first find the partial derivatives:
>
> $$
> \frac{\partial u}{\partial x} = 2x, \quad \frac{\partial u}{\partial y} = -2y
> $$
> $$
> \frac{\partial v}{\partial x} = 2y, \quad \frac{\partial v}{\partial y} = 2x
> $$
>
> The Jacobian matrix is:
> $$
> J = \begin{pmatrix} 2x & -2y \\ 2y & 2x \end{pmatrix}
> $$
> 
> The determinant of $J$ is:
> $$
> \det(J) = (2x)(2x) - (-2y)(2y) = 4x^2 + 4y^2 = 4(x^2 + y^2)
> $$
> Thus, $\left| \det(J) \right| = 4(x^2 + y^2)$.

### Properties of the Jacobian Determinant

> [!check] **Key Properties**
> - **Positive or Negative Values**: The sign of the determinant indicates orientation.
> - **Zero Determinant**: If $\det(J) = 0$ at a point, the transformation is locally non-invertible there.
