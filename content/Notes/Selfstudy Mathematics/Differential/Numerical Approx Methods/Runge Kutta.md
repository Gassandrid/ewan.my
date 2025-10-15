---
id: Runge Kutta
aliases: []
tags:
  - math/calculus/differential/ode
class:
  - note
date: 2025-10-07
source:
  - "[[Why Runge-Kutta is SO Much Better Than Euler's Method somepi]]"
updated: 2025-10-07
---

**Runge Kutta** is a [[Ordinary Differential Equation]] approximation method known for its accuracy to efficiency ratio. It is a type of **single-step method**, meaning it only uses information from the current point to estimate the next point, rather than relying on multiple previous points.

It is a _much_ better approximation method than [[Eulers Method]], as it uses multiple evaluations of the derivative within each step to achieve higher accuracy.

![[RungeKutta.png]]

## Forms and Formula

The general Runge Kutta formula can be defined as:

$$
y_{n+1} = y_n + h \sum_{i=1}^{s} b_i k_i
$$

where the slopes are:

$$
k_i = f\left(t_n + c_i h, y_n + h \sum_{j=1}^{s} a_{ij} k_j\right)
$$

There are two popular forms of Runge Kutta, namely $RK_{4}$ and $RK_{2}$.

### RK4

$$
\begin{align*}
k_1 &= f(t_n, y_n) \\
k_2 &= f(t_n + \frac{h}{2}, y_n + \frac{h}{2}k_1) \\
k_3 &= f(t_n + \frac{h}{2}, y_n + \frac{h}{2}k_2) \\
k_4 &= f(t_n + h, y_n + hk_3) \\
y_{n+1} &= y_n + \frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)
\end{align*}
$$

### RK2

$$
\begin{align*}
k_1 &= f(t_n, y_n) \\
k_2 &= f(t_n + \frac{h}{2}, y_n + \frac{h}{2}k_1) \\
y_{n+1} &= y_n + hk_2
\end{align*}
$$
