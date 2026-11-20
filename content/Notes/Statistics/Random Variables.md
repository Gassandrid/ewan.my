---
id: Random Variables
class:
  - note
tags:
  - math/probability/random-variables
  - university
source:
related:
  - "[[Probability]]"
  - "[[Quiz Practice - Random Variables]]"
  - "[[Axiom]]"
author:
description: A random variable assigns a real number to each outcome of a random experiment, described by a mass function when discrete and a density when continuous.
aliases:
  - Random Variable
  - RV
  - RVs
  - Discrete Random Variables
  - Discrete Random Variable
  - Continuous Random Variable
  - Continuous Random Variables
date: 2024-09-12
updated: 2026-11-19T22:02:13-05:00
---

- **random variable** ( RV ): a function that assigns a real number to each outcome in the [[Sample|sample space]] of a random experiment
	- written as capitals $X, Y, Z$; the values it can take are its **support**
- **discrete**: countable, distinct values, like the number of heads in some coin flips
	- described by a [[Probability Mass Function|pmf]] $p(x) = P(X = x)$ and [[Cumulative Distribution Function|CDF]] $F(x) = P(X \le x)$
	- e.g. the [[Binomial Distribution]]
- **continuous**: any value in a range, infinitely divisible ( "infinite precision" ), like a person's height
	- described by a density $f(x)$, probabilities are areas under it, $P(X = x) = 0$ for any single value

[![Pasted image 20250203132622.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/7025105bbfc126ac7d08de87a080d43818158126b160f2263782bc0181dea57d/Pasted%20image%2020250203132622.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/7025105bbfc126ac7d08de87a080d43818158126b160f2263782bc0181dea57d/Pasted%20image%2020250203132622.png)

- the [[Expected Value of Discrete Random Variables|expected value]] is the balancing point ( fulcrum ) of the pmf, the variance the spread around it

$$
E(X) = \mu = \sum x \, p(x), \qquad Var(X) = \sum (x - \mu)^2 \, p(x) = E(X^2) - \mu^2
$$

- example: an osprey nest has 0 to 3 eggs with probabilities 0.2, 0.4, 0.3, 0.1; $X$ = number of eggs

| $x$ | $p(x)$ | $F(x)$ | $x \, p(x)$ |
| --- | ------ | ------ | ----------- |
| 0   | .2     | .2     | 0           |
| 1   | .4     | .6     | .4          |
| 2   | .3     | .9     | .6          |
| 3   | .1     | 1      | .3          |

- $E(X) = 0 + .4 + .6 + .3 = 1.3$ eggs
- $E(X^2) = .4 + 1.2 + .9 = 2.5$, $Var(X) = 2.5 - 1.3^2 = 0.81$
- example: machined cylinders meant to be 50mm come out anywhere in $[49.5, 50.5]$, a continuous RV with a parabola ( vertex form ) density

$$
f(x) = \begin{cases} 1.5 - 6(x - 50)^2, & 49.5 \le x \le 50.5 \\ 0, & \text{otherwise} \end{cases}
$$

	- CDF by integrating from the left edge: $F(x) = 1.5(x - 49.5) - 2(x - 50)^3 - 0.25$ on $[49.5, 50.5]$, $0$ below, $1$ above
- more: [[Expected Value of Continuous Random Variables]], [[Independence of Random Variables]], [[Joint CDF]], [[Moment Generating Function]], and practice in [[Quiz Practice - Random Variables]]
