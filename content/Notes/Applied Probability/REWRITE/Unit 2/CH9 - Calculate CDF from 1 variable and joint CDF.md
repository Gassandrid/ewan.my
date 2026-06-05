---
id: CH9 - Calculate CDF from 1 variable and joint CDF
aliases: []
tags:
  - math/probability/statistics
date: 2025-02-07
title: CH9 - Calculate CDF from 1 variable and joint CDF
updated: 2025-06-21
---
This class will continue the lesson from [[CH9 - Independence and Conditioning]], where we will learn how to calculate the CDF of a single variable from the joint CDF of two variables.

---

## Example

We are given:

$$
joint CDF(F_{x,y}(x,y))
$$

|             | $y_{0}$        | $y_{1}$         |
| ----------- | -------------- | --------------- |
| $x_{0}$     | $\frac{3}{10}$ | $\frac{6}{10}$  |
| $x_{1}$<br> | $\frac{5}{10}$ | $\frac{10}{10}$ |

To find the $F_{x}(x) = \lim_{ y \to \infty } F_{x,y}(x,y)$: ^acb0cd

*note that x in this case can be either 0 or 1*

$$
For\ X=0: F_{x}(o) = \lim_{ y \to \infty } F_{x,y}(0,y) = \frac{6}{10}
$$

$$
For \ X = 1: F_{x}(1)= \lim_{ y \to \infty } F_{x,y}(1,y) = \frac{10}{10}
$$

**Same thing for Y**:

We modify the [[CH9 - Calculate CDF from 1 variable and joint CDF#^acb0cd|previous given equation]]

$$
F_{y}(y) = \lim_{ x \to \infty } F_{x,y}(x,y)
$$

$$
For \ Y = 0: \lim_{ x \to \infty } F_{x,y}(x,0) = \frac{5}{10}
$$

$$
For \ Y=1: \lim_{ x \to \infty } F_{x,y}(x,1) = \frac{10}{10}
$$

---

## Independent RV's

If you have some independent random variables, then the joint is the product of the masses.

$$
P_{x,y}(x,y)=P_{x}(x) \cdot P_{y}(y)
$$

But something new to be aware of:

$$
NEW \to F_{x,y}(x,y)=F_{x}(x) \cdot F_{y}(y)
$$

And something we will look at later is applying this rule to given rules:

$$
\begin{align*}
LATER \to P_{x \mid y}(x \mid y) &= P_{x}(x) \\
P_{y \mid x}(y \mid x) &= P_{y}(y)
\end{align*}
$$

