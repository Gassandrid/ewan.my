---
title: Midterm Bonus Assignment
author: Ewan Pedersen
date: 2024-11-11
updated: 2024-12-03
---

## Abstract

> This serves as a proof to the *Basel Problem*, more commonly known as the sum of inverse squares. The purpose of this paper is to prove that this sum *converges* to $\frac{\pi^2}{6}$, using methods from single and multivariable calculus.

---

## Problem 1

Prove that the double integral and the infinite series shown below are equal:

$$
\int_{0}^1 \int_{0}^1 \frac{1}{1-xy} \ dx \ dy = \sum_{n=1}^\infty \frac{1}{n^2}
$$

**First, we expand the integral out to an infinite series:**

Since our sum will not deal with numbers $> 1$, we can express $\frac{1}{1-xy}$ as a sum of $(xy)^n$.

$$
\frac{1}{1-xy} = \sum_{n=0}^\infty (xy)^n
$$

Then, we can substitute this expanded series into our double integral.

$$
\int_{0}^1 \int_{0}^1 \frac{1}{1-xy} \ dx \ dy = \int_{0}^1 \int_{0}^1 \sum_{n=0}^\infty(xy)^n \ dx \ dy
$$

**Changing the order of summation/integration**

Assuming that the series converges uniformly for all $x,y \in [0,1]$, we can then exchange the order of summation/integration.

$$
\int_{0}^1 \int_{0}^1 \sum_{n=0}^\infty (xy)^n \ dx \ dy = \sum_{n=0}^\infty \int_{0}^1 \int_{0}^1 (xy)^n \ dx \ dy
$$

**Evaluating the Integral**

From our new double integral, we can identify the inner integral as:

$$
\int_{0}^1 \int_{0}^1 (xy)^n \ dx \ dy = \int_{0}^1 \left( \int_{0}^1 x^n \ dx \right) y^n dy
$$

Evaluating Inner Integral:

$$
\int_{0}^1 x^n \ dx = \left. \frac{x^{n+1}}{n+1} \right|_{0}^1 = \frac{1}{n+1} 
$$

Substituting:

$$
\int_{0}^1 \int_{0}^1 (xy)^n \ dx \ dy = \int_{0}^1 \frac{1}{n+1}y^n \ dy
$$

Evaluating $w \cdot r\cdot t$:

$$
\int_{0}^1 y^n \ dy = \left. \frac{y^{n+1}}{n+1} \right|_{0}^1 = \frac{1}{n+1}
$$

Putting this all together:

$$
\int_{0}^1 \int_{0}^1 (xy)^n \ dx \ dy = \frac{1}{n+1} \cdot \frac{1}{n+1} = \frac{1}{(n+1)^2}
$$

**Applying Sum to Evaluated Integral:**

Plugging back in:

$$
\int_{0}^1 \int_{0}^1 \frac{1}{1-xy} \ dx \ dy = \sum_{n=0}^\infty \frac{1}{(n+1)^2}
$$

Now we let $k = n + 1$, and plug in:

$$
\sum_{n=0}^\infty \frac{1}{(n+1)^2} = \sum_{k=1}^\infty \frac{1}{k^2}
$$

**And thus, we have proven that:**

$$
\int_{0}^1 \int_{0}^1 \frac{1}{1-xy} \ dx \ dy = \sum_{n=1}^\infty \frac{1}{n^2}
$$

---

## Problem 2

Show that the double integral in Problem 1 equals $\frac{\pi^2}{6}$ by making the change of variables:

$$
x = \frac{1}{\sqrt{ 2 }}(u-v), \ \ \ y=\frac{1}{\sqrt{ 2 }}(u+v)
$$

*I most definitely did this incorrect, but I hope some of it is right!*

**Sketch of the UV Plane:**

-
-
-
-
-
-
-
-
-
-
-
-
-

**Change of variables**

with the substitution:

$$
x=\frac{1}{\sqrt{ 2 }}(u-v), \ \ \ y = \frac{1}{\sqrt{ 2 }}(u+v)
$$

we seek to calculate the Jacobian determinant, $\frac{\partial(x,y)}{\partial(u,v)}$:

$$
\frac{\partial x}{\partial u} = \frac{1}{\sqrt{ 2 }}, \ \ \frac{\partial x}{\partial v} = -\frac{1}{\sqrt{ 2 }}, \ \ \frac{\partial y}{\partial u}=\frac{1}{\sqrt{ 2 }}, \ \ \frac{\partial y}{\partial v}= \frac{1}{\sqrt{ 2 }}
$$

this yields the matrix:

$$
Jacobian = \begin{bmatrix}
\frac{1}{\sqrt{ 2 }} & -\frac{1}{\sqrt{ 2 }} \\
\frac{1}{\sqrt{ 2 }} & \frac{1}{\sqrt{ 2 }}
\end{bmatrix} 
$$

leading us to the jacobian determinant:

$$
\det(Jacobian) = \left( \frac{1}{\sqrt{ 2 }} \right)\left( \frac{1}{\sqrt{ 2 }}  \right)-\left( -\frac{1}{\sqrt{ 2 }} \right)\left( \frac{1}{\sqrt{ 2 }} \right) = \frac{1}{2} + \frac{1}{2} = 1
$$

Since $\det(Jacobian) = 1$, the change of variables does not scale the integration area.

**New limits for integration**

we start by substituting the limits $0 \leq x,y \leq 1$ into the variables:

$$
\begin{align*}
For: \\
x&=0 \to u=v \\
y&=0 \to u=-v \\
x &=1 \ and \ y =1 \to square \ rotated \ by \ 45 degrees
\end{align*}
$$

we map the square $[0,1] \times [0,1]$ to a diamond in the uv-plane.

This yields the new bounds for $u$ and $v$:

$$
-\sqrt{ 2 } \leq u \leq \sqrt{ 2 }, \ \ |v| \leq u
$$

**Transforming the Integral**

we now get:

$$
\int_{0}^1 \int_{0}^1 \frac{1}{1-xy} \ dx \ dy = \int \int_{D} \frac{1}{1-f(u,v)} |J| \ du \ dv
$$

After this we would try to sub in $f(u,v) = \frac{1}{2} (u^2 - v^2)$, to compute the integral, but as much as I have tried am doing something wrong.


