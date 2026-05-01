---
date: 2026-04-28T10:56:37-04:00
updated: 2026-04-28T11:17:33-04:00
class:
  - note
  - lecture
tags:
  - university
  - math/chaos
course: "[[Chaos, Fractals, and Dynamical Systems]]"
lecture-number: 1
source:
related:
  - "[[Kuramoto model]]"
author:
description:
aliases:
---

![[Screenshot 2026-04-28 at 11.04.30 AM.png]]

$$
\begin{align}
\frac{md^2x_{1}}{dt^2} &= -m w_{0}^2 x_{1} - K(x_{1}-x_{2}) \\
\frac{md^2x_{2}}{dt^2} &= -m w_{0}^2 x_{2} - K(x_{2}-x_{1})
\end{align}
$$

Since the solutions are likely to be oscillating, we substitute trial functions ( some [[Phasor]]s ):

$$
x_{1}(t) = A_{1} e^{i\omega t} \quad x_{2}(t) = A_{2}e^{i\omega t}
$$

with frequency $\omega$ into equations.

$$
\begin{align*}
A_{1} \left(  \omega^2 - \omega_{0}^2 - \frac{K}{m} \right) &= -\frac{K}{m} A_{2} \\
A_{2} \left(  \omega^2 - \omega_{0}^2 - \frac{K}{m} \right) &= -\frac{K}{m} A_{1} \\
\end{align*}
$$

multiplying together:

$$
\begin{align*}
\left( \omega ^2 - \omega_{0}^2 - \frac{K}{m} \right)^2 A_{1}A_{2} &= \left(  \frac{K}{m} \right) ^2 A_{1} A_{2} \\
\left( \omega ^2 - \omega_{0}^2 - \frac{K}{m} \right)^2 &= \left(  \frac{K}{m} \right) ^2 \\
\end{align*}
$$

leaving a quadratic equation in frequency $\omega$ with two solutions.

$$
\omega_{1} = w_{0}
$$

$$
\omega_{2} = \omega_{0} \sqrt{ 1 + \frac{2K}{m\omega_{0}^2} }
$$
