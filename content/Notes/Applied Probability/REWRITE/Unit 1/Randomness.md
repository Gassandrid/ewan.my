---
id: Randomness
class:
  - note
tags:
  - math/probability/statistics
source:
related:
  - "[[Probability]]"
  - "[[Notes/Statistics/Event|Event]]"
author:
description: A random experiment has outcomes that cannot be predicted in advance; its sample space collects every outcome and events are subsets of it.
aliases:
  - Random Experiment
  - Outcomes, Events, and Sample Spaces
date: 2025-01-13
updated: 2026-11-19T21:50:00-05:00
---
- **randomness**: the outcome of a single trial can't be predicted in advance, but the pattern over many trials can ( [[Probability]] )
- the vocabulary of an experiment
	- **outcome**: one result
	- **[[Sample Space|sample space]]** $S$: the set of all possible outcomes; rolling a die gives $S = \{1, 2, 3, 4, 5, 6\}$
	- **[[Notes/Statistics/Event|event]]**: a subset of the sample space
		- roll a 1: $A = \{1\}$
		- roll an even number: $E = \{2, 4, 6\}$
		- roll a number divisible by 3: $D = \{3, 6\}$
	- $A \subseteq B$: every outcome in $A$ is also in $B$ ( in a Venn diagram, $A$ sits inside $B$ inside $S$ )
- relations between events are set operations: union, intersection, [[Complement|complement]], and [[De Morgan's Law|De Morgan's laws]] $(A \cup B)^c = A^c \cap B^c$
- example: roll a die twice, $X$ the first roll, $Y$ the second
	- $S = \{XY : X, Y \in \{1, \dots, 6\}\}$, a 6 by 6 grid, **36** outcomes
	- the sum alone has $S_{X+Y} = \{2, 3, \dots, 12\}$, a coarser sample space whose outcomes are not equally likely
	- sum is 4: $F = \{XY : X + Y = 4\} = \{31, 22, 13\}$
	- second roll is 3: $T = \{XY : Y = 3\} = \{13, 23, 33, 43, 53, 63\}$
	- first more than twice the second: $G = \{XY : X > 2Y\} = \{31, 41, 51, 61, 52, 62\}$
- sample spaces can be infinite: playing Angry Birds, each attempt is a win $W$ or a loss $L$, and a loss sends you back to the start
	- $S = \{W, LW, LLW, \dots\}$, [[Countably Infinite|countably infinite]] ( plus never winning )
	- winning in fewer than 1000 attempts is still a finite event, $\{W, LW, \dots, L^{998}W\}$
