---
class:
  - note
tags:
  - math/probability/random-variables
source:
related:
  - "[[Variance of Sums]]"
  - "[[Principle Component Analysis]]"
author:
description: Covariance measures how two random variables vary together, positive when they rise together and negative when one rises as the other falls.
aliases:
  - Cov
  - Correlation
  - Correlation Coefficient
date: 2025-10-15
updated: 2026-11-19T21:50:00-05:00
---

- **covariance**: the joint variability of two [[Random Variables|random variables]], its sign gives the direction of their linear relationship
	- positive: when one goes up the other tends to go up; negative: one goes up, the other goes down
	- can honestly just think of it as the proportion operator $\propto$ between two variables ( only the direction, the size depends on units )

$$
Cov(X, Y) = E\big[(X - E(X))(Y - E(Y))\big] = E(XY) - E(X)E(Y)
$$

[![pooledCovariance.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/2cede6e63cda7f160e36496e3be0e877aa6e5337c15e95f1d2a096d91d94875e/pooledCovariance.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/2cede6e63cda7f160e36496e3be0e877aa6e5337c15e95f1d2a096d91d94875e/pooledCovariance.png)

- properties
	- $Cov(X, X) = Var(X)$ and $Cov(X, Y) = Cov(Y, X)$
	- independent $\Rightarrow Cov(X, Y) = 0$, but not the other way around
	- it's the cross term in [[Variance of Sums]]: $Var(X + Y) = Var(X) + Var(Y) + 2\,Cov(X, Y)$
- **correlation** rescales it to $[-1, 1]$ so the units drop out

$$
\rho(X, Y) = \frac{Cov(X, Y)}{\sqrt{Var(X) \, Var(Y)}}
$$

- from data ( sample covariance ), over $N$ points with means $\bar{x}$, $\bar{y}$

$$
Cov_{x,y} = \frac{\sum_i (x_i - \bar{x})(y_i - \bar{y})}{N - 1}
$$

	- stack it for every pair of features and you get the covariance matrix that [[Principle Component Analysis]] diagonalizes
- worked example ( max and min of two dice ) in [[Variance of Sums]]
