---
class:
  - note
tags:
  - math/probability/statistics
  - university
source:
related:
  - "[[Probability]]"
author:
description: An axiom is an assumption accepted without proof; the three Kolmogorov axioms are the base all of probability is derived from.
aliases:
  - Axioms
  - Kolmogorov Axioms
  - Probability Axioms
date: 2024-09-12
updated: 2026-11-19T21:50:00-05:00
---
- an **axiom** is a starting assumption accepted without proof; [[Probability|probability]] rests on three, the **Kolmogorov axioms** ( 1933 )
	- non-negativity: $P(A) \ge 0$ for every [[Notes/Statistics/Event|event]] $A$
	- normalization: the [[Sample Space|sample space]] has $P(S) = 1$
	- countable additivity: for mutually exclusive $A_1, A_2, \dots$
	$$
	P\left(\bigcup_{j=1}^{\infty} A_j\right) = \sum_{j=1}^{\infty} P(A_j)
	$$
- everything else is derived, nothing extra assumed
	- [[Complement]]: $A$ and $A^c$ are disjoint and cover $S$, so $P(A) + P(A^c) = 1$
	- that gives $P(A) \le 1$ ( since $P(A^c) \ge 0$ ) and $P(\emptyset) = 0$
	- inclusion-exclusion and the rest in [[Probability Rules]]
