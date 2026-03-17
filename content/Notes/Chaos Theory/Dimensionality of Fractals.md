---
date: 2026-03-17T10:12:37-04:00
updated: 2026-03-17T11:18:43-04:00
created_on: "[[03-17-2026]]"
class:
  - note
  - lecture
tags:
  - university
  - math/chaos/fractals
course: "[[Chaos, Fractals, and Dynamical Systems]]"
lecture-number: 14
source:
related:
  - "[[Hausdorff Dimension]]"
author:
description:
aliases:
---

> **Fractals**: coined by [[Benoit Mandelbrot]] in the 1960s to describe roughness. He was observing that things like fiber optic cables that observed data increased in noise with distance.

## Fractal Geometry of Nature

Oftentimes it is beneficial to model complex processes in nature as noise, and it works well. It works well, even though many times we know that the underlying system is not random. Mandelbrot had ideas regarding the fractal geometry of nature.

Classic example is the **coastline paradox**, where as your measurement unit decreases in size, measuing the coast of say England would yield a longer and longer value. The nature of the coastline has some self similar geometry, with each decrease in measurement length capturing more detail.

![](https://hangingthingstogether.com/img/CoastlineGif.gif)

Fractals will have:

- **complicated structure at a range of length scales**
	- stock prices, clouds,  coastlines
- self similarity
- non integer or fractional [[Hausdorff Dimension]]

---

## Middle Thirds [[Cantor Set]]

Start with unit interval from 0 to 1, take out the middle third:

$$
K_{0}= \{ 0,1 \}
$$

$$
K_{1} = \left\{  0, \frac{1}{3}  \right\} \cup \left\{  \frac{2}{3}, 1  \right\}
$$

$$
K_{2}= \left\{  0, \frac{1}{9}  \right\} \cup \left\{  \frac{2}{9} , \frac{1}{3}  \right\} \cup \left\{  \frac{2}{3}, \frac{7}{9}  \right\} \cup \left\{  \frac{8}{9}, 1  \right\}
$$

$$
\dots K_{\infty}
$$

![[CantorSetExcalidraw.png]]

1. What is "length" of $K_{\infty}$ ?

"removed interval" approaches 1, so $K_{\infty}$ must be $0$.

$$
\sum_{n=1}^\infty ( \frac{1}{3^n} \cdot 2^{n-1}) = 1
$$

2. Does $K_{\infty}$ contain any intervals?

intervals have length, so it cannot take any intervals.

3. Is $K_{\infty}$ simply the endpoints of intervals removed at each stage ( e.g., $\frac{1}{3}, \frac{2}{9}$)?

you might think so, given that $K_{\infty}$ is [[Uncountably Infinite]]. BUT the endpoints are [[Countably Infinite]]? but there ARE items that are part of $K_{\infty}$ that are not endpoints. the example is $\frac{1}{4}$. on first iteration it is on the right side of the interval ( from 0 to 1/3 ). second iteration it is on the LEFT side of the interval 2/9 to 1/3. It will continue to swithc from left to right, etc.

> A set is **countable** if it can be put into a 1 to 1 correspondance with $\mathbb{N}$.

> A set is **uncountable** if it is not countable.

![[Pasted image 20260317110459.png]]

---

A set $S$ is **measure zero** if it can be covered by a countable number of intevals whose total length is arbitrarily small.

Discrete sets like $\{ 1,2,3,4,5 \}$ and $\mathbb{N}$, rationals, $K_{\infty}$ are all measure 0.

Irrationals $\in [0,1]$ measure 1

$K_{\infty}$ is uncountable **AND** measure 0. Before this, it was always thought that uncountables would **take up space**.
