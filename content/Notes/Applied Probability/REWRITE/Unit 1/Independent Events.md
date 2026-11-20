---
id: Independent Events
class:
  - note
tags:
  - math/probability/statistics
source:
related:
  - "[[Conditional Probability]]"
  - "[[Probability Rules]]"
  - "[[Independence of Random Variables]]"
author:
description: Two events are independent when one happening does not change the probability of the other, so their joint probability is the product.
aliases:
  - Independent Event
  - Independence
  - Dependent Events
date: 2025-01-17
updated: 2026-11-19T21:50:00-05:00
---
- $A, B$ are **independent** when one happening doesn't change the probability of the other: $P(B \mid A) = P(B)$
	- independent: rolling a die twice, flipping a coin repeatedly, spinning a roulette wheel twice, sampling with replacement
	- dependent: drawing cards without replacement
		- first ace: $\frac{4}{52} = \frac{1}{13}$
		- second ace given the first: only 3 left in 51, $\frac{3}{51} = \frac{1}{17}$
- joint probability of independent events is the product
	$$
	P(A \cap B) = P(A)\,P(B)
	$$
	- only for independent events; otherwise use the general multiplication rule $P(A)\,P(B \mid A)$ ( [[Probability Rules]] )
	- two aces with replacement $\left(\frac{4}{52}\right)^2 = \frac{1}{169}$, without $\frac{4}{52} \cdot \frac{3}{51} = \frac{1}{221}$
	- independent is not mutually exclusive: disjoint events are dependent ( [[Notes/Statistics/Event|Event]] )
- example: two cars, repairs independent across cars, $X$ = repairs one car needs in a year
	- $p(0) = .72$, $p(1) = .17$, $p(2) = .07$, $p(\ge 3) = .04$
	- neither needs repair: $0.72 \cdot 0.72 = 0.5184$
	- both need repair: $P(X \ge 1) = 0.28$, so $0.28 \cdot 0.28 = 0.0784$
	- at least one needs repair: [[Complement|complement]] of neither, $1 - 0.5184 = 0.4816$
- checking independence from data ( the handoff table ): [[Conditional Probability]]
- the random variable version: [[Independence of Random Variables]]
