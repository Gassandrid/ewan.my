---
id: Joint CDF
class:
  - note
tags:
  - math/probability/random-variables
source:
related:
  - "[[Independence of Random Variables]]"
  - "[[Random Variables]]"
author:
description: The joint CDF gives the probability that two random variables are both at or below given values, and each marginal CDF is its limit as the other variable goes to infinity.
aliases:
  - Joint Cumulative Distribution Function
  - Joint Distribution Function
date: 2025-02-07
updated: 2026-11-19T21:50:00-05:00
---

- **joint CDF**: probability both variables are at or below a point, the two variable version of the [[Cumulative Distribution Function|CDF]]

$$
F_{X,Y}(x,y) = P(X \le x \cap Y \le y)
$$

- from a joint mass, add up every cell at or below $(x, y)$
	- using the joint pmf from the hiring example in [[Independence of Random Variables]]

|         | $y=0$          | $y=1$          |
| ------- | -------------- | -------------- |
| $x=0$   | $\frac{3}{10}$ | $\frac{3}{10}$ |
| $x=1$   | $\frac{2}{10}$ | $\frac{2}{10}$ |

	- $F(0,0) = P(X=0 \cap Y=0) = \frac{3}{10}$
	- $F(0,1) = P(X=0 \cap Y=0) + P(X=0 \cap Y=1) = \frac{6}{10}$
	- same for the rest, giving the joint CDF

|         | $y=0$          | $y=1$           |
| ------- | -------------- | --------------- |
| $x=0$   | $\frac{3}{10}$ | $\frac{6}{10}$  |
| $x=1$   | $\frac{5}{10}$ | $\frac{10}{10}$ |

- **marginal CDF**: send the other variable to infinity, i.e. stop constraining it

$$
F_{X}(x) = \lim_{y \to \infty} F_{X,Y}(x,y), \qquad F_{Y}(y) = \lim_{x \to \infty} F_{X,Y}(x,y)
$$

	- here $y=1$ is already the top, so $F_X(0) = F(0,1) = \frac{6}{10}$ and $F_X(1) = F(1,1) = 1$
	- and $F_Y(0) = F(1,0) = \frac{5}{10}$, $F_Y(1) = 1$
- independent variables factor in the CDF just like in the mass
	- $p_{X,Y}(x,y) = p_X(x) \, p_Y(y)$ and $F_{X,Y}(x,y) = F_X(x) \, F_Y(y)$
	- check: $F(0,0) = \frac{3}{10} = \frac{6}{10} \cdot \frac{5}{10}$
	- equivalently conditioning changes nothing: $p_{X \mid Y}(x \mid y) = p_X(x)$, $p_{Y \mid X}(y \mid x) = p_Y(y)$
