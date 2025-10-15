---
class:
  - note
tags:
  - math/statistics/random-variables
source:
related:
author:
date: 2025-10-15
updated: 2025-10-15
---

**Covariance**, in the field of Applied Probability, represents the joint variability of two random variables. It indicates the direction of the linear relationship between the variables. A positive covariance means that as one variable increases, the other tends to increase as well, while a negative covariance indicates that as one variable increases, the other tends to decrease.

We can honestly just think of this as the proportion operator $\propto$ associated with two variables.

![[pooledCovariance.png]]

---

## General Form

$$
Cov_{x,y} = \frac{\sum(x_{i}-\bar{x})(y_{i}-\bar{y})}{N-1}
$$

**Where**:

- $Cov_{x,y}$ is the covariance between variables $x$ and $y$
- $x_{i}$ and $y_{i}$ are the respective values $x$ and $y$ at data point $i$
- $\bar{x}$ and $\bar{y}$ are the respective means of $x$ and $y$
- $N$ is the number of data values we are iterating over
