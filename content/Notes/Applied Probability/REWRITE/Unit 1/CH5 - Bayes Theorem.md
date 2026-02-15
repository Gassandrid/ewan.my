---
id: CH5 - Bayes Theorem
created_on: "[[01-24-2025]]"
aliases: []
tags:
  - math/probability/bayesian
date: 2025-01-24
title: CH5 - Bayes Theorem
updated: 2025-10-15
class:
  - note
source:
related:
author:
---
This note discusses the **Bayes Theorem** and how it can be used to calculate conditional probabilities.

This should be noted as the theorem used in statistics as a tool to solve probability equations. For the field of statistics where Bayes' Theorem is treated as the underlying principle of probability, see [[Bayesian Inference]].

---

**Consider the following:**

$$
P(B \mid A) = \frac{P(A \cap B)}{P(A)} \to^{P(A)} P(A \cap B) = P(A) \times P(B \mid A)
$$

**Also consider:**

$$
P(A \mid B) = \frac{P(A \cap B)}{P(B)} \to^{P(A)} P(A \cap B) = P(B) \times P(A \mid B)
$$

Now we apply this to isolate for events:

$$
P(A \mid B) = \frac{P(A)\times P(B \mid A)}{P(B) \leftarrow can \ be \ partitioned \ over \ B/B^C}
$$

Same Can be done for other:

$$
P(B \mid A) = \frac{P(A) \times P(A \mid B)}{P(A)}
$$

## Bayes Theorem

Finally, this leads to Bayes Theorem:

$$
P(A \mid B) = \frac{P(A) \times P(B \mid A)}{P(A) \times {(B\mid A) + P(A^C) +P(B \mid A ^C)}}
$$

Where the bottom part of the fraction is called the **Law of Total Probability**
