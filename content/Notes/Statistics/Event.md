---
class:
  - note
tags:
  - math/probability/statistics
  - university
source:
related:
  - "[[Probability]]"
  - "[[Complement]]"
author:
description: An event is a subset of the sample space, a set of outcomes of an experiment that gets assigned a probability.
aliases:
  - Events
  - Simple Event
  - Compound Event
  - Mutually Exclusive
  - Mutually Exclusive Events
  - Disjoint Events
date: 2024-09-12
updated: 2026-11-19T21:50:00-05:00
---
- an **event** is a subset of the [[Sample Space|sample space]] $S$: a set of outcomes of an experiment that gets a [[Probability|probability]]
	- **simple event**: exactly one outcome, rolling a 3 is $\{3\}$
	- **compound event**: several outcomes, rolling even is $\{2, 4, 6\}$
	- more dice examples in [[Randomness]]
- combining events is just set operations
	- **union** $A \cup B$: $A$ or $B$ or both; rolling a 2 or an even number is $\{2, 4, 6\}$
	- **intersection** $A \cap B$: both; even and greater than 2 is $\{4, 6\}$
	- **[[Complement|complement]]** $A^c$: not $A$; $\{1, 2\}^c = \{3, 4, 5, 6\}$
	- complements of unions and intersections flip via [[De Morgan's Law]]
- **mutually exclusive** ( disjoint ): $A \cap B = \emptyset$, so $P(A \cap B) = 0$; heads and tails on one flip
	- not the same as [[Independent Events|independent]]: disjoint events with nonzero probability are always dependent, knowing $A$ happened tells you $B$ didn't
- with equally likely outcomes, probability is counting ( [[Counting Methods]] when $S$ is too big to list )
	$$
	P(A) = \frac{|A|}{|S|}
	$$
	- die: $P(\{3\}) = 1/6$, $P(\text{even}) = 3/6 = 1/2$
