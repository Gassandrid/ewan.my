---
created_on: "[[10-02-2025]]"
class:
  - note
tags:
  - math/calculus/differential/pde
source:
related:
author:
date: 2025-10-02
updated: 2025-11-23
---
The **Crank–Nicolson method** is a numerical technique used to solve partial differential equations (PDEs), particularly the heat equation. It is an implicit finite difference method that is unconditionally stable and second-order accurate in both time and space.

It is most often applied in fields of quantitative finance for option pricing with the [[Black-Scholes equation]], but also commonly introduced in physics problems like the [[Diffusion equation]].

---

## Formulation

It is based on the **trapezoidal rule** for numerical integration, which averages the spatial derivatives at the current time step and the next time step.

It varies in formulation by dimension, but for the one-dimensional diffusion equation, it can be expressed as follows:

$$
\frac{u_i^{n+1} - u_i^n}{\Delta t} = \frac{1}{2} \left( \frac{u_{i+1}^{n+1} - 2u_i^{n+1} + u_{i-1}^{n+1}}{(\Delta x)^2} + \frac{u_{i+1}^n - 2u_i^n + u_{i-1}^n}{(\Delta x)^2} \right)
$$
