---
id: CH28 - Expected Values of Continuous Random Variables
created_on: "[[03-26-2025]]"
aliases: []
tags:
  - math/probability/statistics
date: 2025-03-26
updated: 2025-06-21
---
As the title suggests, this chapter is about the expected values of continuous random variables.

---

## Key Equations

> [!Abstract] For a single continuous RV
>
> $$
> E(X) = \int_{0}^{10} x\left( \frac{3}{1000}x^2 \right) dx = \int _{0}^{10} \frac{3}{1000} x^3 dx = \left. \frac{3}{1000} \left( \frac{x^4}{4} \right) \right|_{0}^{10}
> $$

> [!Abstract] For two continuous RV's
>
> $$
> \begin{align*}
> &= \int_{0}^{+\infty} 3xe^{-3x} dx \\
> \end{align*}
> $$

This is the expected value of a continuous random variable. The expected value is the mean of the distribution, and it is calculated by integrating the product of the variable and its probability density function (PDF) over the range of possible values.

---

## How to Calculate Expected Values

We can use the formula above to calculate the expected value of a continuous random variable. The steps are as follows:

1. Identify the probability density function (PDF) of the random variable.
2. Set up the integral for the expected value using the formula.
3. Evaluate the integral to find the expected value.

For two continuous random variables, the expected value is calculated using the joint probability density function (PDF) of the two variables. The steps are similar:

1. Identify the joint PDF of the two random variables.
2. Set up the double integral for the expected value using the formula.
3. Evaluate the double integral to find the expected value.
