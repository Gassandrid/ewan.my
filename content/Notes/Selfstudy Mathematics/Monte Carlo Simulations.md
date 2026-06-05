---
date: 2026-02-04T09:57:06-05:00
updated: 2026-04-02T10:04:54-04:00
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

![[monteCarloCircleArea.png]]
