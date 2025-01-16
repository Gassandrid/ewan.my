---
id: CH2 Probability
aliases: []
tags:
  - statistics
date: 2025-01-15
title: CH2 Probability
updated: 2025-01-15
---

Moving on to chapter 2, we will discuss the concept of probability. Probability is a fundamental concept in statistics that quantifies the likelihood of an event occurring. Understanding probability is essential for making informed decisions based on data and statistical analyses.

---

## 2.1 Ratio

$$
Probability \ Statement \to P(A)
$$

_"probability of event A occurring"_

**[[Axiom|Axioms:]]**

We can find the axioms for probability in the following:

$$
0 \leq P(A) \leq 1
$$

$$
P(S) = 1
$$

$$
P(A^C) = 1 - P(A)
$$

$$
P(A^C) = P(S) - P(A)
$$

Using the last two, how can we find the **null set** $P(\emptyset) = 0$?

Well, $S$ and $\emptyset$ are complements of each other.

$$
P(S) = 1
$$

By complementation:

$$
P(\emptyset)
$$

---

## Union, Inclusive OR

Gradual Addition Rule:

Lets say that a set $A_{1},A_{2}, \dots, A_{n}$ is a collection of disjoint events.

Then:

$$
P(\cup _{j=1}^\infty A_{j}) = \sum_{j=1}^\infty P(A_{j})
$$

if all A,B disjoint, then:

$$
P(A \cup B) = P(A) +P(B)
$$

When you don't have disjoint events, we use the **inclusion-exclusion principle**:

![[Pasted image 20250115134249.png]]

$$
P(A \cup B) = P(A) + P(B) - P(A \cap B) \pm \dots
$$

This can be extrapolated to three circles:

![[Pasted image 20250115134529.png]]

$$
\begin{align*}
P(A \cup B \cup C) = P(A) + P(B) + P(C) \pm \dots
\end{align*}
$$

And for the sake of it, let's do 4 circles, and we will expand out the full probability this time:

![[Pasted image 20250115134857.png]]

$$
\begin{align*}
P(A \cup B \cup C \cup D) &= P(A) + P(B) +P(C) +P(D) \\
&-P(A \cap B) - P(A \cap C) - P(A \cap D) \\
&-P(B \cap C) - P(B \cap D) - P(C \cap D) \\
&+P(A \cap B \cap C) PP (A \cap B \cap D) P+P(A\cap C\cap D) \\
&+P(B \cap C \cap D) \\
&-P(A \cap B \cap C \cap D)
\end{align*}
$$

---

## A Very Big Example

>[!Example]
> A song is chosen at random from a perosn's mp3 player. The student makes a partition of the sample space, according to genre of music. The table below gives the number of outcomes in each part of the partition. There are 27,333 songs altogether.

| 1032 Alternative     | 83 Electronic | 56 Metal        |
| -------------------- | ------------- | --------------- |
| 330 Blues            | 508 Folk      | 2718 Other      |
| 275 Books and Spoken | 183 Gospel    | 1786 Pop        |
| 1468 Childrens Music | 82 Hop Hop    | 403 R and B     |
| 921 Classical        | 564 Holiday   | 8286 Rock       |
| 6169  Country        | 537 Jazz      | 1432 Soundtrack |
| 178 Easy Listening   | 106 Latin     | 216 World       |
**Let A be the event that a song is either blues, jazz or rock; i.e., A = {X | x is blues, jazz, or rock song} when one song is chosen at random. Assume that all songs are equally likely to play.**