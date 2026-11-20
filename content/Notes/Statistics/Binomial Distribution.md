---
id: Binomial Distribution
class:
  - note
tags:
  - math/probability/random-variables
  - university
source:
related:
  - "[[Random Variables]]"
  - "[[Expected Value of Discrete Random Variables]]"
author:
description: The binomial distribution counts the successes in a fixed number of independent trials that share one success probability.
aliases:
  - Binomial
  - Binomial Random Variable
  - Negative Binomial Distribution
date: 2024-09-12
updated: 2026-11-19T21:50:00-05:00
---

- **binomial distribution**: number of successes $k$ in $n$ independent trials, each succeeding with the same probability $p$
	- needs independent trials, exactly two outcomes each, constant $p$

$$
P(X = k) = \binom{n}{k} p^k (1 - p)^{n - k}, \qquad k = 0, 1, \dots, n
$$

	- $\binom{n}{k}$ counts the ways to place the $k$ successes among the $n$ trials
	- mean $\mu = np$ ( a sum of $n$ indicators, by [[Linearity of Expectation]] ), variance $\sigma^2 = np(1 - p)$
	- CDF: $P(X \le k) = \sum_{i=0}^{k} \binom{n}{i} p^i (1 - p)^{n - i}$
- example: flip a fair coin 10 times, chance of exactly 6 heads

$$
P(X = 6) = \binom{10}{6} (0.5)^{10} = \frac{210}{1024} \approx 0.205
$$

- **negative binomial**: flip it around and count the failures $k$ before the $r$-th success
	- $P(X = k) = \binom{k + r - 1}{k} p^r (1 - p)^k$
	- expected total trials to get $r$ successes: $E(T) = \frac{r}{p}$
- when it stops fitting or gets expensive
	- trials not independent ( sampling without replacement ): use the hypergeometric
	- large $n$, small $p$: Poisson with $\lambda = np$
	- large $n$: normal via the [[Central Limit Theorem]], $Z = \frac{X - np}{\sqrt{np(1 - p)}}$
