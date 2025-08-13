---
id: Cantor Set
aliases: []
tags:
  - math/sets
date: 2025-08-13
fileClass:
  - note
updated: 2025-08-13
---

The **Cantor Set** is a classic example of a set that is uncountably infinite, yet has measure zero. It is constructed by repeatedly removing the middle third of intervals, leading to a fractal structure.

![[CantorSetExcalidraw.png]]

It is interesting in that it in of itself is a subset of the uncountably infinite set between $0$ and $1$, but it is uncountably infinite in itself. It is also a perfect set, meaning it is closed and contains no isolated points. And yet, the area of the Cantor set is zero, as it is constructed by removing intervals of positive length.

It is defined as follows:

$$
C = \bigcap_{n=0}^\infty C_n,
\quad \text{where } C_0 = [0,1] \text{ and } C_{n+1} = \tfrac{1}{3}C_n \cup \left(\tfrac{2}{3} + \tfrac{1}{3}C_n\right).
$$
