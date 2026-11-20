---
id: Probability
class:
  - note
tags:
  - math/probability/statistics
  - university
source:
related:
  - "[[Axiom]]"
  - "[[Notes/Statistics/Event|Event]]"
  - "[[Randomness]]"
author:
description: Probability assigns each event a number between 0 and 1 following the Kolmogorov axioms; with equally likely outcomes it is counting.
aliases:
  - Probability Fundamentals
  - Probability Theory
  - Probabilities
date: 2024-09-12
updated: 2026-11-19T21:50:00-05:00
---
- **experiment**: a process whose outcome can't be predicted in advance with certainty ( [[Randomness]] )
	- **[[Sample Space|sample space]]** $S$: all possible outcomes; a coin is $\{H, T\}$, a die is $\{1, \dots, 6\}$
	- **[[Notes/Statistics/Event|event]]**: a subset of $S$; rolling a 1 is $A = \{1\}$, an even roll is $E = \{2, 4, 6\}$
- **probability** $P(A)$: "the probability of event $A$ occurring", a number in $[0, 1]$
	- [[Frequentist Probability|frequentist]] reading, the long run fraction of trials where $A$ happens
	$$
	P(A) = \lim_{n \to \infty} \frac{n_A}{n}
	$$
	- equally likely outcomes make it counting, $P(A) = |A| / |S|$, so $P(\{1\}) = 1/6$ ( [[Counting Methods]] when $S$ is too big to list )
	- the other reading is degree of belief, updated with [[Bayes Rule]] ( [[Bayesian Inference]] )
- rules, all derived from the [[Axiom|axioms]]
	- $0 \le P(A) \le 1$ and $P(S) = 1$
	- [[Complement]]: $P(A^c) = 1 - P(A)$; $S$ and $\emptyset$ are complements, so $P(\emptyset) = 0$
	- disjoint $A_1, A_2, \dots$ just add: $P\left(\bigcup_j A_j\right) = \sum_j P(A_j)$
- overlapping events need **[[Inclusion-Exclusion Principle|inclusion-exclusion]]**: add the singles, subtract the pairs, add the triples, ...
	$$
	P(A \cup B) = P(A) + P(B) - P(A \cap B)
	$$
	[![Pasted image 20250115134249.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/00564c5e136764f2502dca50300dc2f4d109719a1f0865e7c6e49d11ba864cbf/Pasted%20image%2020250115134249.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/00564c5e136764f2502dca50300dc2f4d109719a1f0865e7c6e49d11ba864cbf/Pasted%20image%2020250115134249.png)
	- three events: $P(A \cup B \cup C) = P(A) + P(B) + P(C) - P(A \cap B) - P(A \cap C) - P(B \cap C) + P(A \cap B \cap C)$
	[![Pasted image 20250115134529.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/c217f8ca4884840dab0a332a34a4db8379538d7dc2aa0018685c50e4346084bb/Pasted%20image%2020250115134529.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/c217f8ca4884840dab0a332a34a4db8379538d7dc2aa0018685c50e4346084bb/Pasted%20image%2020250115134529.png)
	- four events, written out
	[![Pasted image 20250115134857.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/85b9c7ece0b838a7a3362f8a6b4251d0021acfdce5deb578ad435401b86e8a69/Pasted%20image%2020250115134857.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/85b9c7ece0b838a7a3362f8a6b4251d0021acfdce5deb578ad435401b86e8a69/Pasted%20image%2020250115134857.png)
	$$
	\begin{align*}
	P(A \cup B \cup C \cup D) &= P(A) + P(B) + P(C) + P(D) \\
	&- P(A \cap B) - P(A \cap C) - P(A \cap D) - P(B \cap C) - P(B \cap D) - P(C \cap D) \\
	&+ P(A \cap B \cap C) + P(A \cap B \cap D) + P(A \cap C \cap D) + P(B \cap C \cap D) \\
	&- P(A \cap B \cap C \cap D)
	\end{align*}
	$$
- mutually exclusive or not depends on the problem
	- one card, $A$ = red, $B$ = face card: the 6 red face cards mean $A \cap B \ne \emptyset$, so not exclusive and $P(A \cup B) = \frac{26 + 12 - 6}{52} = \frac{8}{13}$
	- a random song from 27,333; blues ( 330 ), jazz ( 537 ) and rock ( 8286 ) are disjoint genres, so $P(\text{blues, jazz or rock}) = \frac{9153}{27333} \approx 0.335$
	- 20 five-star and 200 four-star songs out of 2000: $P(5^*) = 0.01$, $P(4^*) = 0.10$, $P(5^* \cup 4^*) = 0.11$
- worked example: $P(A) = .20$, $P(B) = .10$, $P(C) = .40$, $P(A \cap B) = .05$, $P(A \cap C) = .10$, $P(B \cap C) = .03$, $P(A \cap B \cap C) = .01$; probability none happen?
	- none is $(A \cup B \cup C)^c$ by [[De Morgan's Law]], so take the complement of inclusion-exclusion
	$$
	1 - [.2 + .1 + .4 - .05 - .10 - .03 + .01] = 1 - .53 = .47
	$$
