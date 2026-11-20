---
id: Probability Rules
class:
  - note
tags:
  - math/probability/statistics
source:
related:
  - "[[Conditional Probability]]"
  - "[[Independent Events]]"
author:
aliases:
  - Multiplication Rule
  - General Multiplication Rule
  - Probability Rule
date: 2025-01-24
updated: 2026-11-19T22:01:28-05:00
---

- [[Complement]]: $P(A^c) = 1 - P(A)$
- addition ( [[Inclusion-Exclusion Principle|inclusion-exclusion]] ): $P(A \cup B) = P(A) + P(B) - P(A \cap B)$, see [[Probability]]
- **general multiplication rule**, holds for any events

	$$
	P(A \cap B) = P(A)\,P(B \mid A)


$$
	- extends down a chain: $P(A \cap B \cap C) = P(A)\,P(B \mid A)\,P(C \mid A \cap B)$
	- rearranged it is the [[Conditional Probability|conditional probability]] formula $P(B \mid A) = \frac{P(A \cap B)}{P(A)}$, flipped it is [[Bayes Rule]]
	- for [[Independent Events|independent]] events $P(B \mid A) = P(B)$ and it collapses to $P(A \cap B) = P(A)\,P(B)$ ( the special case, not the general rule )
	- example: two aces without replacement, $\frac{4}{52} \cdot \frac{3}{51} = \frac{1}{221} \approx 0.0045$
- showing two events are independent: check either one ( they're equivalent when $P(B) > 0$ )
	- $P(A \cap B) \overset{?}{=} P(A)\,P(B)$
	- $P(A \mid B) \overset{?}{=} P(A)$
