---
id: CH2 Probability
aliases: []
tags:
  - math/probability/statistics
date: 2025-01-15
title: CH2 Probability
updated: 2025-06-21
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

> [!Example]
> A song is chosen at random from a perosn's mp3 player. The student makes a partition of the sample space, according to genre of music. The table below gives the number of outcomes in each part of the partition. There are 27,333 songs altogether.

| 1032 Alternative                                                               | 83 Electronic                                                                                                            | 56 Metal        |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | --------------- |
| 330 Blues                                                                      | 508 Folk                                                                                                                 | 2718 Other      |
| 275 Books and Spoken                                                           | 183 Gospel                                                                                                               | 1786 Pop        |
| 1468 Childrens Music                                                           | 82 Hop Hop                                                                                                               | 403 R and B     |
| 921 Classical                                                                  | 564 Holiday                                                                                                              | 8286 Rock       |
| 6169 Country                                                                   | 537 Jazz                                                                                                                 | 1432 Soundtrack |
| 178 Easy Listening                                                             | 106 Latin                                                                                                                | 216 World       |
| \*\*Let A be the event that a song is either blues, jazz or rock; i.e., A = {X | x is blues, jazz, or rock song} when one song is chosen at random. Assume that all songs are equally likely to play.\*\* |

Shuffling and star ratings, I have 20 five-star songs and 200 four star sngs on my iPod, which has 2000 songs total.

To prepare, lets make a table.

| $x$       | $f$  |
| --------- | ---- |
| $5^*$     | 20   |
| $4^*$     | 200  |
| $(1-3^*)$ | 1780 |
| n         | 2000 |

1. What is the probability of shuffling to a five-star song?

$$
P ( 5^*) = \frac{|5^*|}{|S|} = \frac{20}{2000} = .01
$$

2. What is the probability of shuffling to a four-star song?

$$
P(4^*) = \frac{|4^*|}{|S|} = \frac{200}{2000} = 0.1
$$

3. What is the probability of shuffling to either a five or four star song?

$$
P(5^* \cup 4^*)= 0.01 + .10 = 0.11 
$$

> [!Example]
> You just forgot your locker combination and are too embarrassed to ask for it. You know for sure that the first number is 22, or was it 32? It's one of those. You are certain that the middle number is a one digit number (0-9), and the last number could be anything between 0 and 45. If the lock is a 3 number lock with numbers 0 through 45, what is the maximum number of tries needed to open it, assuming you don't repeat any combinations?

We apply the counting rule: *if m choices for the first choice and n choices for the 2nd choice:*

$$
\frac{m}{1^{st}} \cdot \frac{n}{2^{nd}} \cdot ways
$$

$$
\frac{2}{1^{st}\#} \cdot \frac{10}{2^{nd} \#} \cdot \frac{46}{3^{rd} \#} = 920 \ possible \ combinations \ to \ try
$$

>[!Example]
> Mystery probability. Suppose there are 3 events such that:
>
> | Exp                  | Value |
> | -------------------- | ----- |
> | $P(A)$               | .20   |
> | $P(B)$               | .10   |
> | $P(C)$               | .40   |
> | $P(A \cap B)$        | .05   |
> | $P(A \cap C)$        | .10   |
> | $P(B \cap C)$        | .03   |
> | $P(A \cap B \cap C)$ | .01   |

What is the probability that none of the events happen?

$$
\begin{align*}
P(none) &= P((A \cup B \cup C)^C) = 1- P(A \cup B \cup C) \\
&= 1 - [P(A) + P(B)+P(C) - P(A \cap B) - \\ & P(A \cap C) - P(B \cap C) +P(A \cap B \cap C) ]
\end{align*}
$$

$$
= 1- \left[ .2 + .1 + .4 - .05 - .10 - .03 + 0.1 \right]
$$

$$
=1-.53 = .47
$$