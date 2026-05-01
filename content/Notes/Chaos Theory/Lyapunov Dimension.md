---
class:
  - note
  - lecture
tags:
  - university
  - math/chaos
course: "[[Chaos, Fractals, and Dynamical Systems]]"
lecture-number: 21
source:
related:
author:
description:
aliases:
date: 2026-04-09T10:11:53-04:00
updated: 2026-04-09T10:58:28-04:00
---

*much* easier to calculate than [[Boundary Points of the Mandelbrot Set|box counting]], comes for free with [[Lyapunov Exponents|Lyapunov]] spectrum.

---

Let $\vec{f}$ be a map in $\mathbb{R}^{m}$ with $m\geq 2$. Consider an orbit with [[Lyapunov Exponents|Lyapunov Exponent]] $h_{1}\geq h_{2} \geq \dots \geq h_{m}$ and let $p$ be the largest integer such that:

$$
\sum_{i=1}^{p} h_{i}\geq 0
$$

The **Lyapunov Dimension** $D_{L}$ of the orbit is defined to be:

- $0$ if $p$ doesnt exist ( all directions contracting ). this would happen in the basin of a [[Attracting fixed point|sink]]
-  $p+ \frac{1}{|h_{p+1}|} \sum_{i=1}^{p}h_{i}$ if $<m$
- $m$ if $p=m$

For the skinny [[Bakers Map]], $h_{1}=\ln 2$, $h_{2} = - \ln 3$, so $h_{1} >0>h_{2}$ and $h_{1}+h_{2} <0 \Rightarrow p=1$ 

$$
D_{L} = 1 + \frac{h_{1}}{|h_{2}|} = 1 + \underbrace{ \frac{\ln 2}{\ln 3} }_{ \text{shrinking x} }
$$

---

The area after $K$ iterates is $d^2e^{K(h_{1}+h_{2})}$. Assuming $h_{1}>0>h_{2}$ and $h_{1}+h_{2} <0$, area goes to $0$ as $K\to \infty$. But the dimensions is at least $1$ becuase $h_{1} >0$.

Area:

$$
d^2e^{K(h_{1}+h_{2})}=\underbrace{ (de^{Kh_{2}})^2 }_{ \text{area of single box} } \underbrace{ \frac{de^{Kh_{1}}}{de^{Kh_{2}}} }_{ \begin{array}
f\text{number of boxes of} \\
\text{side length } de^{Kh_{2}} \\
\text{required to cover set}
\end{array} }
$$

BCD:

$$
\begin{align*}
\lim_{ G \to 0 } \frac{\ln(N)}{\ln\left( \frac{1}{\epsilon} \right)} &= \lim_{ \epsilon \to 0 } \frac{-\ln N}{\ln \epsilon} \\
&= \frac{-\ln ( N(d)e^{K(h_{1}-h_{2})})}{\ln (de^{Kh_{2}})} \\
&= \frac{-\ln(N(d)) - K(h_{1}-h_{2})}{\ln d + Kh_{2}} \quad \text{in lim as }\epsilon\to 0
\end{align*} \quad \quad \begin{array}
. N(d) = \text{number of boxes} \\
\text{of size d} \\
\text{I started with}
\end{array}
$$

expression reduced to:

$$
\frac{K(h_{2}-h_{1})}{Kh_{2}} \quad \text{because } N,d \text{  is negligible as } K\to \infty
$$

$$
\frac{h_{2}-h_{1}}{h_{2}} = 1 - \frac{h_{1}}{h_{2}}
$$

---

## Fixed Point Theorem 2

>[!Abstract] Theorem
> Let $\vec{f}$ be a continuous map on $\mathbb{R}^2$ and $S$ be a rectangular region such that as the boundary of $S$ is traversed, the net rotation of the vectors:
>
> $$
> \vec{v}(\vec{x}) = \vec{f}(\vec{x})-\vec{x}
> $$
>
> is nonzero. Then $\vec{f}$ has a [[Fixed Point Classification|Fixed Point]] in $S$



To do so, there must come a point $\vec{x}^*$ as we shrink $S$ such that $\vec{v}(\vec{x})$