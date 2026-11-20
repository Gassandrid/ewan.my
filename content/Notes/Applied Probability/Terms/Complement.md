---
id: Complement
class:
  - note
tags:
  - math/probability/statistics
  - math/sets
source:
related:
  - "[[Notes/Statistics/Event|Event]]"
  - "[[De Morgan's Law]]"
author:
description: The complement of an event is every outcome in the sample space that is not in it.
aliases:
  - Complements
  - Complement of an Event
date: 2025-01-31
updated: 2026-11-19T21:50:00-05:00
---
- the **complement** $A^c$ ( also $A'$ ) of an [[Notes/Statistics/Event|event]] $A$ is every outcome in the [[Sample Space|sample space]] $S$ that is not in $A$
	- $A \cup A^c = S$ and $A \cap A^c = \emptyset$, so the two always split $S$ cleanly
	- example: roll a die, $A = \{1, 2\}$, $A^c = \{3, 4, 5, 6\}$
	$$
	P(A^c) = 1 - P(A)
	$$
	- follows from the [[Axiom|axioms]]: $A$ and $A^c$ are disjoint and together make $S$
	- $S^c = \emptyset$, so $P(\emptyset) = 1 - P(S) = 0$
- complements of quantified statements
	- "all 5 happen" flips to "0, 1, 2, 3 or 4 happen"
	- "at least one happens" ( 1 to 5 ) flips to "none happen"
	- so $P(\text{at least one}) = 1 - P(\text{none})$, almost always the easier route ( two cars example in [[Independent Events]] )
- complements of unions and intersections: [[De Morgan's Law]]
