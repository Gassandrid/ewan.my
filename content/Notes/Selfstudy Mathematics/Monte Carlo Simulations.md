---
date: 2026-02-04T09:57:06-05:00
updated: 2026-09-11T19:37:29-04:00
class:
  - note
tags:
  - math/probability/monte-carlo
source:
related:
author:
description:
aliases:
---

Funny name, but quite a simple premise used everywhere.

- for calculations that prove computationally intractable, but can be sampled quite easily

The textbook example is estimating the area of a circle. this is not really computationally intractible, but demonstrates the core premise: **the heuristic simulation of repeated sampling wil approach the correct answer**.

Here we know there is a circle in the 1-1 square, so we just take random samples in the coordinate space $random(-1,1)$ for both x and y. If the point is in the circle, we add to our total for in circle, if not we dont but add to total points. Approaches something like:

$$
Area = \frac{red \ points}{all \ points} = 3.1415\dots
$$

[![monteCarloCircleArea.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/c9c86fc92c951fd39c0f21334e3ec82f43509a76f5d52337d43cd28f34074367/monteCarloCircleArea.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/c9c86fc92c951fd39c0f21334e3ec82f43509a76f5d52337d43cd28f34074367/monteCarloCircleArea.png)
