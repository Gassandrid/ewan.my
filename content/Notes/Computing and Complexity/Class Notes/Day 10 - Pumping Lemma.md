---
id: Day 10
aliases: []
tags:
  - cs/theory
date: 2025-02-20
title: Day 10
updated: 2025-03-27
---
This class will discuss the pumping lemma for regular expressions.

---

Let $A$ be a regular language. There exists some natural number $p$ (pumping length) such that for every string $w \in A^*$ the following holds:

$$
|w| \geq p
$$

divide $w$ into three parts:

$$
w = xyz
$$

such that:

$$
\begin{align*}
\mid xy \mid \leq p \\
\mid y \mid \geq 1 \\
\forall i \geq 0: xy^iz \in A
\end{align*}
$$

---

## Pumping Lemma for Regular Languages

For the pumping lemma for regular languages, we have a regular language $L$ and a pumping length $p$ such that for all strings $w \in L$ with $|w| \geq p$, we can divide $w$ into three parts $w = xyz$ such that:

*I had to leave class, and wasnt able to finish this note*
