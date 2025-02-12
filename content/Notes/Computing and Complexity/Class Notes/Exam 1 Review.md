---
date: 2025-02-11
updated: 2025-02-12
tags:
  - computing
  - cs/automata
title: Exam 1 Review
---

For the first exam, you should be prepared to

- answer questions about definitions, properties, and behaviors of DFAs, NFAs, and GNFAs,
- determine whether a string is in the language of some finite automaton,
- design a DFA or NFA given some language (which may or may not involve closure properties),
- determine the language of a given DFA or NFA,
- determine if a string matches a given regular expression,
- convert a given NFA to an equivalent DFA using subset construction algorithm, and
- recover a regular expression from a finite automaton using state elimination.

---

## Proofs

We will get proofs, oftentimes by oconstruction:

Let $L = \{ w \mid w \ is \ of \ odd \ length \ and \ contains \ 000 \ as \ substring \}$

We would be asked to **prove that L is regular**

- this would be proof by construction of a finite automaton

---

## NFAs/DFAs $\epsilon$ Transition

*An **epsilon transition** (ε-transition) in a finite automaton is a transition between states that occurs **without consuming any input symbol**. This means the automaton can move from one state to another "for free," without reading a character from the input string.*

Given a NFA:

```mermaid
stateDiagram-v2
	Direction LR
	[*] --> q0
	q0 --> q1:ε
	q0 --> q2:ε
	q2 --> q3:ε
```

Looks like the following DFA:

```mermaid
stateDiagram-v2
	[*] --> q0
	[*] --> q1
	[*] --> q2
	[*] --> q3
```

---

## Formal Definition

Given a state diagram machine $M$:

```mermaid
stateDiagram-v2
	Direction LR
	[*] --> A
	A --> B:0
	A --> C:1
	B --> B:0
	B --> C:1
	C --> A:0,1
	C --> [*]

	C:::accepting

    classDef accepting fill:#bbf,stroke:#333,stroke-width:2;
```

We have a 5 tuple:

$$
M = \left( Q, \sum, \delta, q_{0}, F \right)
$$

**Q:**

$$
Q = \{ B,C, A \}
$$

$\sum$:

$$
\sum = \{ 0,1 \}
$$

$\delta$:

For this we can make a table

| $\delta$ | 0   | 1   |
| -------- | --- | --- |
| A        | B   | C   |
| B        | B   | C   |
| C        | A   | A   |

or with equations:

$$
\begin{align*}
\delta(A, 0) = B \\
\delta(A, 1) = C \\
etc\dots
\end{align*}
$$

$q_{0}$:

just the start state

$$
q_{0} = A
$$

$F$(always a set, accepting states):

$$
F = \{ C \}
$$

---

## State Elimination

Say we have the following unpruned DFA:

```mermaid
stateDiagram-v2
	Direction LR
	[*] --> A
	A --> B:0
	B --> B:0
	B --> C:1
	C --> C:0
	C --> A:1
```

We want to recover an equivalent regex using state elimination

RIP  states in the order $C,B,A$

1. Construct GNFA

```mermaid
stateDiagram-v2
	Direction LR
	[*] --> S
	S --> A:ε
	A --> B:0
	B --> B:0
	B --> C:1
	B --> accept:ε
	C --> C:0
	C --> A:1
```

Let's start RIPPING:

**RIP C:**

$$
B \to C \to A: \ \ 11, 1 \Sigma^* 1
$$

**RIP B:**

$$
\begin{align*}
&A \to B \to X: 0 0^* \epsilon = 00^* = 0^+ \\
&A \to B \to A: 0 0^* \left( 1 \Sigma ^* 1 \right)
\end{align*}
$$

**RIP A:**

$$
S \to A \to X: \epsilon 0^+ = \left( \frac{00^*}{0^+}(1 \Sigma^* 1) \right)^* 0^+
$$