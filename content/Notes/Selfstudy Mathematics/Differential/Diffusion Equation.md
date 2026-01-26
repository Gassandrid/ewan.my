---
class:
  - note
tags:
  - math/calculus/differential/pde
  - working/math
  - math/probability/stochastic
source:
related:
author:
date: 2025-10-03
updated: 2025-10-03
---

The **diffusion equation** is a parabolic PDE, and a [[Stochastic Differential Equation]]. It describes the [[Brownian Motion]] of several particles, particularly useful in how they collide with each other and the emergent behavior thereof.

It is described usually as:

$$
\frac{ \partial \phi(\mathbf{r},t) }{ \partial t } = \nabla \cdot [D(\phi,\mathbf{r}) \nabla \phi(\mathbf{r},t)]
$$

**Where:**
- $\phi(\mathbf{r},t)$ - the density of the diffusing material at location $\mathbf{r}$ and time $t$
- $D(\phi,\mathbf{r})$ - the collective diffusion coefficient for density $\phi$ at location $\mathbf{r}$.
- $\nabla$ - the vector differential operator **del**
