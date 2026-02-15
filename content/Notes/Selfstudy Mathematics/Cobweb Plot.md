---
created_on: "[[01-15-2026]]"
class:
  - note
tags:
  - math/chaos
source:
related:
author:
description:
aliases:
  - Lémeray diagram
date: 2026-01-15T10:19:50-05:00
updated: 2026-01-15T10:32:01-05:00
---
Plotting mechanism for iterated one dimensional functions. A good example is the [[Logistic Map]].

Usually an interation function of the form:

$$
x_{n+1} = f(x_n)
$$

It visually maps the sequence of values by plotting:

$$
  y = f(x)
$$

and diagonally reflecting across the line:

$$
  y = x
$$

creating a "cobweb" of vertical and horizontal steps that converge toward fixed points, cycles, or chaos, revealing the long-term behavior of the system

![[cobPlot.png]]G

Important Terms:

- **Source**: the function being iterated, e.g. $f(x) = rx(1-x)$ for the Logistic Map.
- **Sink**: the line $y=x$ where the output of the function is equal to the input.
