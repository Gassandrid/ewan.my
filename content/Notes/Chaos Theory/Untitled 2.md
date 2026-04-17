---
created_on: "[[04-14-2026]]"
class:
  - note
  - lecture
tags:
  - university
course: "[[Chaos, Fractals, and Dynamical Systems]]"
lecture-number: 22
source:
related:
author:
description:
aliases:
date: 2026-04-14T10:08:18-04:00
updated: 2026-04-14T10:56:00-04:00
---

Lets return to the skinny [[Bakers Map|Baker Map]]:

![](https://upload.wikimedia.org/wikipedia/commons/8/8c/Baker%27s_map_mixing.gif)

we look to find the itineraries for points in the invariant set $A$ ( i.e., points whose forward and bckward iterates all lie in the unit square ).

The itinerarry at a point $\vec{v} =(x_{1},x_{2})$, is of the form $\dots,S_{-2}S_{-1}S_{0}. S_{1}S_{2}S_{3}\dots$ where $S_{i}$ is defined by:

$$
\begin{align}
&B^{i}(\vec{v}) = \in S_{i} \\
&B^{-1} \in S_{j} \iff \vec{v} \in B^{i}(S_{j})
\end{align}
$$

Symbols left of the dot represent where points coem from, we read them right ot left, history of inverse images. Symbols right of the dot represent where points go.

AN infinite sequence $K\to \infty$ represents intersection of a horizontal and vertical line.

[[Asymptotically Periodic|AP]] orbits must eventually repeat to the right. Any itinerary that doesnt repeat to the right is not [[Asymptotically Periodic|AP]]. 

$$
\Rightarrow \text{any itinerary that doesnt repeat is chaotic}
$$

---

## Horseshoe Map

[[Fixed Point Classification|Fixed Points]] $\bar{R}\bar{R}$ and $\bar{L}\bar{L}$ 

Points in the invariant set $H$ are bounded, have positive [[Lyapunov Exponents]] and some are not [[Asymptotically Periodic|AP]]

$$
\Rightarrow \text{chaotic orbits}
$$
