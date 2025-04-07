---
id: CH3 - Probability Rules
aliases: []
tags:
  - statistics
date: 2025-01-24
title: CH3 - Probability Rules
updated: 2025-01-24
---

This lesson will cover rules like the **general multiplication rule**, **conditional probability**, and **independence**.

---

## General Multiplication Rule

For $A,B$ independent events, then:

$$
P(A \cap B) = P(A) \times P(B)
$$

This is known as the **general multiplication rule**, and it can be extended to more than two events.

This does not hold for dependent events, where the probability of the second event depends on the outcome of the first event.

For dependent events $A,B$, we can apply a rule from CH4:

$$
P(A \cap B) = P(A) \times P(B | A)
$$

Where $P(B|A)$ is the probability of event $B$ occurring **given** that event $A$ has already occurred.

> [!Warning] Important!
>
> Another way to think of $P(A\mid B)$ is with the following:
> 
> $$
> P(B \mid A) = \frac{P(A\cap B)}{P(A)}
> $$
> 
> This is called the **conditional probability Formula**

---

Something you might encounter on problems is being asked to show that 2 events are *independent*. To do this do the following:

**Check that:**

$$
P(A \cap B) =^? P(A) \times P(B)
$$

*If there are equal, then they are independent*

**Check that:**

$$
P(A \mid B) =^? P(B)
$$
	