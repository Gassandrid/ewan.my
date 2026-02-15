---
id: CH10 - Expected Values of Discrete Random Variables
created_on: "[[02-07-2025]]"
aliases: []
tags:
  - math/probability/statistics
date: 2025-02-07
title: CH10 - Expected Values of Discrete Random Variables
updated: 2025-06-21
---
Just a practice worksheet for now, but remember:

## Expected Value of a Discrete RV

$$
E(X) = \sum_{j=1}^{n} x_{j}P_{x}(x_{j})
$$

### Properties of Expected Value

1. For any constant c:

   $$E(c) = c$$

2. For a constant c and random variable X:

   $$E(cX) = cE(X)$$

3. For random variables X and Y:

   $$E(X + Y) = E(X) + E(Y)$$

---

## Examples

#### Example 1: Fair Dice Roll

For a fair six-sided die, X = outcome of roll:

$$E(X) = 1(\frac{1}{6}) + 2(\frac{1}{6}) + 3(\frac{1}{6}) + 4(\frac{1}{6}) + 5(\frac{1}{6}) + 6(\frac{1}{6}) = 3.5$$

#### Example 2: Binomial Random Variable

For a binomial random variable with n trials and probability p:

$$E(X) = np$$

---

## Practice Problems

1. A game costs $5 to play. You win $10 with probability 0.4 and nothing with probability 0.6. Find the expected value of your winnings.

2. In a lottery, the probability of winning is 0.001. The prize is $1000 and the ticket costs $2. Calculate the expected value of playing.


---

## In Summary

- Expected value represents the long-term average of a random variable
- It does not necessarily equal a possible value of the random variable
- Useful for decision making and risk assessment
- Forms the basis for more advanced probability concepts
