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
updated: 2026-01-15T13:14:58-05:00
jupyter:
  jupytext:
    cell_metadata_filter: -all
    formats: ipynb,md
    text_representation:
      extension: .md
      format_name: markdown
      format_version: '1.3'
      jupytext_version: 1.18.1
  kernelspec:
    display_name: Python 3
    language: python
    name: python3
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

---

## Plotting Bifurcations

Something interesting happens when we plot the long-term behavior of the logistic map as a function of the parameter \(r\). This is known as a bifurcation diagram.

```python
import numpy as np
import matplotlib.pyplot as plt

# Params
r_min, r_max = 2.5, 4.0
n_r = 10000
n_transient = 1000
n_last = 100

r = np.linspace(r_min, r_max, n_r)
x = 0.5 * np.ones(n_r)

for i in range(n_transient):
    x = r * x * (1 - x)

r_list = []
x_list = []

for i in range(n_last):
    x = r * x * (1 - x)
    r_list.append(r)
    x_list.append(x)

r_plot = np.array(r_list).flatten()
x_plot = np.array(x_list).flatten()

plt.figure(figsize=(12, 8))
plt.scatter(r_plot, x_plot, s=0.1, c='black', alpha=0.1)
plt.title('Bifurcation Diagram of the Logistic Map')
plt.xlabel('Growth Rate ($r$)')
plt.ylabel('Population ($x$)')
plt.xlim(r_min, r_max)
plt.ylim(0, 1)
plt.grid(False)

plt.show()
```

This interesting behavior illustrates how simple deterministic systems can exhibit complex and unpredictable dynamics, a hallmark of chaos theory.
