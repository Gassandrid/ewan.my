---
class:
  - note
tags:
  - math/sets
  - math/probability/statistics
  - university
source:
related:
  - "[[Complement]]"
  - "[[Notes/Statistics/Event|Event]]"
author:
description: "Taking a complement swaps union and intersection: not (A or B) is neither, not both is at least one missing."
aliases:
  - De Morgan's Laws
  - DeMorgan's Law
  - De Morgans Law
  - De Morgan's Law in Detail
date: 2024-09-12
updated: 2026-11-20T01:57:53-05:00
---
- **De Morgan's laws**: taking the [[Complement|complement]] swaps union and intersection

	$$
	(A \cup B)^c = A^c \cap B^c \qquad (A \cap B)^c = A^c \cup B^c


$$
	- "not ( $A$ or $B$ )" is "neither": to avoid both you have to miss each one
	- "not both" is "at least one fails": to avoid the pair you only have to miss one
	- holds for any finite or infinite collection of [[Notes/Statistics/Event|events]] $A_1, A_2, \dots$: $\left(\bigcup_j A_j\right)^c = \bigcap_j A_j^c$ and $\left(\bigcap_j A_j\right)^c = \bigcup_j A_j^c$
- in [[Probability|probability]] it turns "none of them" into one minus a union: $P(A^c \cap B^c) = 1 - P(A \cup B)$, then expand the union with inclusion-exclusion
	- example, one card: $A$ = heart ( 13 ), $B$ = face card ( 12 ), $A \cap B$ = J, Q, K of hearts ( 3 )
		- neither a heart nor a face card: $1 - \frac{13 + 12 - 3}{52} = \frac{30}{52}$
		- not the heart face cards: $P(A^c \cup B^c) = 1 - \frac{3}{52} = \frac{49}{52}$
- the other set laws it sits with
	- commutative: $A \cup B = B \cup A$, $A \cap B = B \cap A$
	- associative: $(A \cup B) \cup C = A \cup (B \cup C)$, same for $\cap$
	- distributive: $A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$ and $A \cup (B \cap C) = (A \cup B) \cap (A \cup C)$
- worked example: a power cell has two subcells, each giving 0 to 5 volts independently of the other; the cell works iff the voltages sum to at least 6; record both voltages $(x, y)$
	- [[Sample Space|sample space]] $S = \{(x, y) : 0 \le x \le 5,\ 0 \le y \le 5\}$, a square, so events are regions
	- functional: $A = \{(x, y) \in S : x + y \ge 6\}$
	- equal voltages: $B = \{(x, y) \in S : x = y\}$
	- first strictly higher: $C = \{(x, y) \in S : x > y\}$
	- not functional but less than one volt short: $D = \{(x, y) \in S : 5 < x + y < 6\}$
	- De Morgan: neither functional nor equal is $(A \cup B)^c = A^c \cap B^c = \{x + y < 6,\ x \ne y\}$
