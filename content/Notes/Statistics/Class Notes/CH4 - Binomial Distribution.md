---
id: CH4 - Binomial Distribution
aliases: []
tags:
  - statistics
date: "2024-09-12"
---

# Binomial Distribution

> [!summary] **Summary**
> The binomial distribution models the probability of a specific number of successes in a fixed number of independent Bernoulli trials, each with the same probability of success.

---

## Definition

A **binomial distribution** describes the number of successes in a sequence of $n$ independent trials, where each trial has two possible outcomes: _success_ or _failure_. The probability of success in each trial is denoted by $p$.

The **binomial probability mass function (PMF)** is given by:

$$
P(X = k) = \binom{n}{k} p^k (1 - p)^{n - k}
$$

where:

- $n$ is the number of trials,
- $k$ is the number of successes,
- $p$ is the probability of success on a single trial,
- $\binom{n}{k}$ is the binomial coefficient, representing the number of ways to choose $k$ successes from $n$ trials.

---

## Properties

- **Mean**: The expected value (mean) of a binomial distribution is given by:

  $$
  \mu = np
  $$

- **Variance**: The variance of a binomial distribution is:

  $$
  \sigma^2 = np(1 - p)
  $$

- **Support**: The possible values of $X$ range from $0$ to $n$, where $X$ is the number of successes.

---

## Example

> [!example] **Example: Tossing a Coin**
> Suppose you flip a fair coin ($p = 0.5$) 10 times. What is the probability of getting exactly 6 heads?
>
> Using the binomial formula:
>
> $$
> P(X = 6) = \binom{10}{6} (0.5)^6 (0.5)^4 = \frac{10!}{6!(10-6)!} (0.5)^{10}
> $$
>
> This simplifies to:
>
> $$
> P(X = 6) = 210 \cdot (0.5)^{10} = 0.205
> $$

---

## Key Points

> [!tip] **Key Characteristics of Binomial Distribution**
>
> - Trials are independent.
> - Each trial has exactly two outcomes.
> - Probability of success remains constant across trials.

> [!info] **Common Use Cases**
>
> - Quality control: Checking defective products in a batch.
> - Clinical trials: Success rate of a treatment.
> - Survey analysis: Probability of a certain number of people agreeing with a statement.

---

## Cumulative Binomial Probability

In practice, it is often useful to compute the probability of $X$ being less than or equal to a certain value. The **cumulative distribution function (CDF)** for the binomial distribution is:

$$
P(X \leq k) = \sum_{i=0}^k \binom{n}{i} p^i (1 - p)^{n - i}
$$

This can be used, for example, to determine the likelihood of obtaining up to a certain number of successes in $n$ trials.

---

## Inverse Binomial Distribution

An **inverse binomial distribution** (or negative binomial distribution) models the number of failures needed before achieving $r$ successes, where $r$ is a fixed number of successes. Its probability mass function is:

$$
P(X = k) = \binom{k + r - 1}{k} p^r (1 - p)^k
$$

Here, $k$ represents the number of failures before the $r^{th}$ success.

> [!question] **Conceptual Question**
> How many trials are needed, on average, to achieve $r$ successes if the probability of success on each trial is $p$?

The expected value for the total number of trials is:

$$
\mathbb{E}[T] = \frac{r}{p}
$$

---

## Practical Considerations

- The binomial distribution assumes **independence** between trials. If the trials are dependent (e.g., without replacement), consider using a **hypergeometric distribution**.
- For large $n$ and small $p$, the **Poisson distribution** can approximate the binomial distribution when $\lambda = np$.
- The **normal distribution** can approximate the binomial distribution when $n$ is large, using the **Central Limit Theorem**:

  $$
  Z = \frac{X - np}{\sqrt{np(1 - p)}}
  $$

This approximation is particularly useful for computationally expensive problems.
