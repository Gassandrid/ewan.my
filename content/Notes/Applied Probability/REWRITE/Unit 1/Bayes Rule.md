---
id: Bayes Rule
class:
  - note
tags:
  - math/probability/bayesian
  - math/probability/statistics
source:
related:
  - "[[Conditional Probability]]"
  - "[[Bayesian Inference]]"
author:
description: Bayes rule inverts a conditional probability, getting P(A|B) from P(B|A), the prior P(A) and the law of total probability.
aliases:
  - Bayes Theorem
  - Bayes' Theorem
  - Bayes' Rule
  - Bayes Law
date: 2025-01-24
updated: 2026-11-19T21:50:00-05:00
---
- **Bayes rule** flips a [[Conditional Probability|conditional probability]]: get $P(A \mid B)$ from $P(B \mid A)$
	- this is the theorem as a tool for solving probability problems; for the school of statistics that treats it as the foundation of probability, see [[Bayesian Inference]]
- derivation: write the intersection both ways with the multiplication rule ( [[Probability Rules]] )
	$$
	P(A \cap B) = P(A)\,P(B \mid A) = P(B)\,P(A \mid B) \quad\Rightarrow\quad P(A \mid B) = \frac{P(B \mid A)\,P(A)}{P(B)}
	$$
	- then partition $P(B)$ over $A$ and $A^c$, the **law of total probability**: $P(B) = P(B \mid A)P(A) + P(B \mid A^c)P(A^c)$
	$$
	P(A \mid B) = \frac{P(B \mid A)\,P(A)}{P(B \mid A)\,P(A) + P(B \mid A^c)\,P(A^c)}
	$$
	- with more than two parts $A_1, \dots, A_n$ the denominator is $\sum_i P(B \mid A_i)P(A_i)$
- example: a disease has 1% prevalence, the test catches 99% of cases and false alarms 5% of the time; $P(D \mid +)$?
	- $P(D \mid +) = \frac{0.99 \cdot 0.01}{0.99 \cdot 0.01 + 0.05 \cdot 0.99} = \frac{0.0099}{0.0594} \approx 0.17$
	- only 1 in 6 positives is real: the false alarms on the 99% healthy swamp the true hits, the prior matters
