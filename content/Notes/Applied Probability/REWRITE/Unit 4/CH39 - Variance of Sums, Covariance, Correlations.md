---
id: CH39 - Variance of Sums, Covariance, Correlations
created_on: "[[04-23-2025]]"
aliases: []
tags:
  - math/probability/random-variables
date: 2025-04-23
updated: 2025-10-15
class:
  - note
source:
related:
author:
---
Essential reasoning for this chapter is that for expected value calculations:

$$
E(X_{1}+\dots+X_{n}) = E(X_{1})+\dots+E(X_{n})
$$

Meaning Random Variables **can be** independent or dependent.

**However**, for Variance calculations:

$$
VAR(X_{1}+\dots+X_{n}) = VAR(X_{1}) + \dots + VAR(X_{n})
$$

The Random Variables **HAVE** to be independent.

This chapter will explore what we can do if we have **dependent** random variables.

---

> [!Example] IF $x,y$ are dependent, then
>
> $$
> VAR(X+Y) = VAR(X) + VAR(Y) + 2Cov(X,Y)
> $$

Essentially, the [[covariance]] term is a measure of how much $X$ and $Y$ vary together.

> [!Abstract] Definition
> Covariance is a measure of the joint variability of two random variables. It is defined as:
>
> $$
> Cov(X,Y) = E \left[ (X-E(X)) (Y - E(Y)) \right] = E(XY) - E(X)E(Y)
> $$

**This definition can be used for the following formula:**

For any two random variables $X$ and $Y$, the covariance is given by:

$$
Cov(X,X) = VAR(X)
$$

For the variance of the sum of two random variables, we have:

$$
VAR(X_{1}+\dots+X_{n}) = \sum_{i=1}^n var(X_{i}) + \sum_{i=1}^n \sum_{j+i} Cov(X_{i},X_{j})
$$

The covariance of two random variables $X$ and $Y$ is a measure of how much they change together. It is defined as:

$$
Cov(X,Y) = Cov(Y,X)
$$

And if $X$ and $Y$ are independent, then:

$$
If: \quad X,Y \ independent,\ then: \quad Cov(X,Y)=0
$$

We can also measure the correlation, p, as the ratio of the covariance to the product of the standard deviations of $X$ and $Y$:

$$
P(X,Y)=\frac{Cov(X,Y)}{\sqrt{ VAR(X) \cdot VAR(Y) }}
$$

---

## Exercise 39.13

Roll two dice. Let $X$ denote the maximum value that appears and let $Y$ denote the minimum value that appears.

$\tau$

Find $Cov(X,Y)$:

$$
E(X) \quad \theta(Y) \quad E(XY) \quad E(x^2) \quad
$$

| $x$ | $P_{X}(x)$      | $y$ | $P_{Y}(y)$      | $xy$ | $P(XY)(x,y)$ |
| --- | --------------- | --- | --------------- | ---- | ------------ |
| 1   | $\frac{1}{36}$  | 1   | $\frac{11}{36}$ |      |              |
| 2   | $\frac{3}{36}$  | 2   | $\frac{9}{36}$  |      |              |
| 3   | $\frac{5}{36}$  | 3   | $\frac{7}{36}$  |      |              |
| 4   | $\frac{7}{36}$  | 4   | $\frac{5}{36}$  |      |              |
| 5   | $\frac{9}{36}$  | 5   | $\frac{3}{36}$  |      |              |
| 6   | $\frac{11}{36}$ | 6   | $\frac{1}{36}$  |      |              |
