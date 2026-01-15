---
class:
  - note
tags:
  - math/chaos
  - math/linear-algebra
source:
related:
author:
description:
aliases:
date: 2026-01-13T10:35:54-05:00
updated: 2026-01-13T11:15:53-05:00
---

A **Logistic Map** is a polynomial mapping of degree 2, often cited as an archetypal example of how complex, chaotic behavior can arise from very simple non-linear dynamical equations. It is defined by the recurrence relation:

$$
x_{n+1} = r x_n (1 - x_n)
$$

and is used to model population growth in an environment with limited resources. Here, \(x_n\) represents the population at generation \(n\), scaled between 0 and 1, and \(r\) is a positive parameter representing the growth rate.

![https://upload.wikimedia.org/wikipedia/commons/e/ed/LogisticCobwebChaos.gif](https://upload.wikimedia.org/wikipedia/commons/e/ed/LogisticCobwebChaos.gif)

In the **Dynamical Systems** context, the logistic map exhibits a range of behaviors depending on the value of the parameter $r$ and the initial condition $x_0$:

$$
  f: x \mapsto r x (1 - x)
$$

It can be seen as a tool for studying bifurcations, chaos, and the transition from order to chaos in dynamical systems. As $r$ increases, the system undergoes a series of bifurcations leading to chaotic behavior.
