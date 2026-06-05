---
class:
  - note
  - lecture
tags:
  - university
  - math/chaos/fractals
course: "[[Chaos, Fractals, and Dynamical Systems]]"
lecture-number: 15
source:
related:
author:
description:
aliases:
date: 2026-03-19T11:04:57-04:00
updated: 2026-03-19T11:21:34-04:00
---

![[setJulia.png]]

Consider the quadratic map $P_{c}(z)= z^2 +c$ where $z = x+yi$  and $c = a+bi$ are complex numbers $i=\sqrt{ -1 }$

>[!Example] Example Iterations
>
> $$
> \begin{align*}
> P_{c}(z) &= (x+yi)^2 + a + bi = \underbrace{ (x^2-y^2 + a) }_{ real } + \underbrace{ (2xyi) }_{ imaginary } \\[4pt]
> z_0 &= x_0 + y_0 i \\
> z_1 &= (x_0^2 - y_0^2 + a) + (2x_0 y_0 + b)i \\[4pt]
> x_{n+1} &= x_n^2 - y_n^2 + a \\
> y_{n+1} &= 2x_n y_n + b
> \end{align*}
> $$

If $c=0$, then the map is:

$$
P_{0}(z) = z^2
$$

has an [[Attracting fixed point]] at origin. The basin is $\{ z: |z|<1 \}$ *( interior of the unit disk )*

Points of the disc have their angle doubled but stay on the disc. Points outside the disc
