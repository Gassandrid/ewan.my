---
tags:
  - math
date: 2024-11-07
---

> [!note] Overview
> In Calculus 3, **line integrals** allow us to integrate functions along a curve in space. They are particularly useful in physics and engineering for calculating work done by a force along a path.

### Definition

A **line integral** of a scalar field $f(x, y, z)$ along a curve $C$ is defined as:

$$
\int_C f(x, y, z) \, ds
$$

where $ds$ represents an infinitesimal arc length along the curve $C$.

> [!example] Intuition
> Think of $ds$ as a small segment along the path $C$, and $f(x, y, z)$ as the value of a function (like temperature or density) at each point along this path. The line integral, then, is the total "accumulated" value of $f$ along $C$.

### Parametrization

To evaluate a line integral, we often need to **parametrize** the curve $C$. If $C$ is parametrized by a vector function $\vec{r}(t) = \langle x(t), y(t), z(t) \rangle$ over an interval $a \leq t \leq b$, then:

$$
ds = |\vec{r}'(t)| \, dt
$$

This transforms our line integral into:

$$
\int_C f(x, y, z) \, ds = \int_a^b f(x(t), y(t), z(t)) \cdot |\vec{r}'(t)| \, dt
$$

> [!info] Parametrization Example
> For a curve $C$ along the path $y = x^2$ in the $xy$-plane, we could let $x = t$ and $y = t^2$ for $t$ in some interval $[a, b]$.

### Line Integrals of Vector Fields

In many applications, we compute the **line integral of a vector field** $\vec{F}(x, y, z)$ along a curve $C$:

$$
\int_C \vec{F} \cdot d\vec{r}
$$

where $d\vec{r}$ is the differential vector along the curve. If $C$ is parametrized by $\vec{r}(t)$ as before, then $d\vec{r} = \vec{r}'(t) \, dt$ and we get:

$$
\int_C \vec{F} \cdot d\vec{r} = \int_a^b \vec{F}(\vec{r}(t)) \cdot \vec{r}'(t) \, dt
$$

> [!tip] Interpretation in Physics
> The line integral $\int_C \vec{F} \cdot d\vec{r}$ can represent the **work** done by a force field $\vec{F}$ along a path $C$, where $\vec{F}$ is a vector field representing force and $d\vec{r}$ is the differential displacement vector.

### Summary

- **Scalar line integrals** integrate a scalar function along a curve.
- **Vector line integrals** calculate the work done by a vector field along a curve.
- Parametrize the curve $C$ to transform the line integral into a form that can be evaluated.

