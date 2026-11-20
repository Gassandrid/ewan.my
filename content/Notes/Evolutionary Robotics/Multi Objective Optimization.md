---
class:
  - note
tags:
  - cs/ai/evolution
source:
related:
author:
description:
aliases:
  - Pareto Optimization
date: 2026-03-19T09:36:44-04:00
updated: 2026-03-24T08:36:33-04:00
---

For mathematical optimization problems where more than one objective function needs to be optimized simultaneously.

- applied when optimal decisions need to be taken in presence of **trade offs** between conflicting objectives
- not guaranteed that single solution simultaneously optimizes each objetive.
	- objective functions are said to be conflicting, solution called **nondominated**
		- if this is the case, with no subjective presence/information, may exist an infinite number of pareto optimal solutions

---

## Formulation

$$
\min_{x\in X}(f_{1}(x), f_{2}(x),\dots,f_{k}(x))
$$

where $k\in \mathbb{Z}$ is $\geq 2$ is num of objectives, set $X$ is  is **feasible set** of decision vectors $X\subseteq \mathbb{R}^{n}$, however depends on n dim application domain.

- objective function usually defined as

$$
\begin{align*}
f: X &\to \mathbb{R}^{k} \\
x &\mapsto \begin{pmatrix}
f_{1}(x) \\
\vdots \\
f_{k}(x)
\end{pmatrix}
\end{align*}
$$

[![paretoFrontier.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/a3c4c5c72f59777c1816c900e5f7d8f2a4e0015bfa8b05830bb7fcc2f3e622f9/paretoFrontier.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/a3c4c5c72f59777c1816c900e5f7d8f2a4e0015bfa8b05830bb7fcc2f3e622f9/paretoFrontier.png)
