---
id: Independence of Random Variables
class:
  - note
tags:
  - math/probability/random-variables
source:
related:
  - "[[Joint CDF]]"
  - "[[Conditional Probability]]"
author:
description: Two discrete random variables are independent when their joint mass factors into the product of the marginals at every point.
aliases:
  - Independent Random Variables
  - Joint Probability Mass Function
  - Joint PMF
  - Conditional PMF
date: 2025-02-05
updated: 2026-11-19T21:50:00-05:00
---

- two [[Notes/Statistics/Event|events]] are independent when $P(A \cap B) = P(A) \, P(B)$; two [[Random Variables|random variables]] are independent when that holds for every pair of values

$$
p_{X,Y}(x,y) = p_{X}(x) \, p_{Y}(y) \quad \text{for all } x, y
$$

- **joint pmf**: probability both happen at once, $p_{X,Y}(x,y) = P(X=x \cap Y=y)$
	- the cumulative version is the [[Joint CDF]]
- **marginal pmf**: sum the joint over the other variable, $p_X(x) = \sum_y p_{X,Y}(x,y)$
- **conditional pmf**: [[Conditional Probability]] applied to values

$$
p_{X \mid Y}(x \mid y) = \frac{P(X=x \cap Y=y)}{P(Y=y)} = \frac{p_{X,Y}(x,y)}{p_{Y}(y)}
$$

>[!Example] Random employee hiring
> Ten students apply, one is picked uniformly at random. $X=1$ if person 3, 5, 7 or 8 gets the job, else $X=0$. $Y=1$ if person 1, 2, 3, 4 or 5 gets it, else $Y=0$. Are $X$ and $Y$ independent?

- marginals
	- $X=0$ for $\{1,2,4,6,9,10\}$, so $p_X(0) = \frac{6}{10}$, $p_X(1) = \frac{4}{10}$
	- $Y=0$ for $\{6,7,8,9,10\}$, so $p_Y(0) = p_Y(1) = \frac{5}{10}$
- joint, via $P(X=x) \, P(Y=y \mid X=x)$ ( or just count people )
	- $p(0,0) = \frac{6}{10} \cdot \frac{3}{6} = \frac{3}{10}$ ( persons 6, 9, 10 )
	- $p(0,1) = \frac{6}{10} \cdot \frac{3}{6} = \frac{3}{10}$ ( 1, 2, 4 )
	- $p(1,0) = \frac{4}{10} \cdot \frac{2}{4} = \frac{2}{10}$ ( 7, 8 )
	- $p(1,1) = \frac{4}{10} \cdot \frac{2}{4} = \frac{2}{10}$ ( 3, 5 )

|         | $y=0$          | $y=1$          |
| ------- | -------------- | -------------- |
| $x=0$   | $\frac{3}{10}$ | $\frac{3}{10}$ |
| $x=1$   | $\frac{2}{10}$ | $\frac{2}{10}$ |

- check every cell against the product of marginals
	- $\frac{3}{10} = \frac{6}{10} \cdot \frac{5}{10}$ and $\frac{2}{10} = \frac{4}{10} \cdot \frac{5}{10}$, so yes, independent
	- summing a row gives the marginal back: $p_X(0) = \frac{3}{10} + \frac{3}{10} = \frac{6}{10}$
