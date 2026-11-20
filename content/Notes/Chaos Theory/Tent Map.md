---
class:
  - note
tags:
  - math/dynamical-systems/maps
source:
related:
author:
description:
aliases:
date: 2026-02-17T10:54:48-05:00
updated: 2026-02-19T10:12:31-05:00
---

![](https://upload.wikimedia.org/wikipedia/commons/9/9b/Tent_map.gif)

Tent shaped graph defined by:

$$
f(x) = \begin{cases}
\mu x & for \ 0 \leq x \leq \frac{1}{2} \\
\mu(1-x) & for \ \frac{1}{2} \leq x \leq 1
\end{cases}
$$

In the classic case of $\mu$ parameter of $2$:

> [!Info] Desmos
> <iframe src="https://www.desmos.com/calculator/qgnadqrtyp" width=600 height="400" ></iframe>

---

## Transition Graph

**Fully connected** transition graph, between $0\to1$, midline is $\frac{1}{2}$.

[![transitionGraphLR.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/3f1836177153f0e3a41082b84bb1b9787c16c08e007095a4d6e3b59fb0dd125d/transitionGraphLR.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/3f1836177153f0e3a41082b84bb1b9787c16c08e007095a4d6e3b59fb0dd125d/transitionGraphLR.png)

[![RorLTransitionTree.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/40b3ee3e4adceb2b2006575a2d64b5620f80388cce61979bfbd354fec115a753/RorLTransitionTree.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/40b3ee3e4adceb2b2006575a2d64b5620f80388cce61979bfbd354fec115a753/RorLTransitionTree.png)

---

>[!Abstract] Theorem
>  The tent map has infinitely many [[Chaos|chaotic]] [[Periodic Orbit Stability|orbits]]. 
>
> We know $h(x_{1})=\ln(2)$. for all $x$ except $\frac{1}{2}$.

So any bounded orbit which avoids $\frac{1}{2}$ and is not [[Asymptotically Periodic]] will be [[Chaos|chaotic]]. Derivative of $T^{K}$ at a period-k point will be $\pm 2^{K}\to$ all periodic orbits are sources. No [[Attracting fixed point|sink]]s. So any [[Asymptotically Periodic|AP]] orbit must [[Eventually Periodic|EP]]. e.g.) $x_{0}=0.\overline{1011}_{2}$ is period-4 orbit.
