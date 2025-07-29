---
title: Formal Definitions for 2 DFAs
author:
  - Ewan Pedersen
date: 2025-01-26
updated: 2025-07-28
abstract: This document provides formal definitions for both the DFAs provided for HW1 assignment, and includes generated state diagrams.
---

---

## DFA Definition

We define a DFA as a 5 tuple:

$$
M =\left( Q,\sum, \delta, q_{0}, F \right)
$$

Where:

- $Q$ is a finite **set of states**
- $\sum$ is a finite **set of symbols**
- $\delta: Q \times \sum \to Q$ is the **transition function**
- $q_{0} \in Q$ is the **start state**
- $F \subseteq Q$ is the Set of **accepting states**

---

## DFA 1: Recognizing Bit Strings Starting and Ending with Different Symbols

**Purpose:** To recognize all binary strings that begin and end with different symbols

### Formal Definition

For this case we define the DFA variables as:

**Q:**

$$
Q = \{ A,B,C,D,E \}
$$

**$\sum$:**

$$
\sum = \{ 0,1 \}
$$

**$\delta$ (Transition Function) Stats:**

$$
\begin{align*}
\delta(A,0) &= B \ \ \ \ \ \ \ \ \ \delta(A,1) = C \\
\delta(B,0) &= B \ \ \ \ \ \ \ \ \ \delta(B,1) = E \\
\delta(C,0) &= D \ \ \ \ \ \ \ \ \ \delta(C,1) = C \\
\delta(D,0) &= D \ \ \ \ \ \ \ \ \ \delta(D,1) = C \\
\delta(E,0) &= B \ \ \ \ \ \ \ \ \ \delta(E,1) = E \\
\end{align*}
$$

**$q_{0}$:**

$$
q_{0} = A
$$

**$F$:**

$$
F = \{ D,E \}
$$

### State Definition

$A:$ Start State

$B:$ First bit is 0

$C:$ First bit is 1

$D:$ Accept State when starting with 1 and ending with 0

$E:$ Accept State when starting with 0 and ending with 1

### Diagram

*Made with mermaid*

![[Screenshot 2025-01-26 at 9.03.40 PM.png]]

---

## DFA 2: Recognize All Bit Strings Ending in 0 or Having a Length that is a Multiple of 3

**Purpose:** To accept all binary strings that either end with 0 or have a length that is divisible by 3

### Formal Definition

For this case we define the DFA variables as:

**Q:**

$$
Q = \{ A,B,C,D\}
$$

**$\sum$:**

$$
\sum = \{ 0,1 \}
$$

**$\delta$ (Transition Function) Stats:**

$$
\begin{align*}
\delta(A,0) &= D \ \ \ \ \ \ \ \ \ \delta(A,1) = B \\
\delta(B,0) &= D \ \ \ \ \ \ \ \ \ \delta(B,1) = C \\
\delta(C,0) &= D \ \ \ \ \ \ \ \ \ \delta(C,1) = A \\
\delta(D,0) &= D \ \ \ \ \ \ \ \ \ \delta(D,1) = B \\
\end{align*}
$$

**$q_{0}$:**

$$
q_{0} = A
$$

**$F$:**

$$
F = \{ A,D \}
$$

### State Definition

$A:$ Start State AND Accept State when string has length divisible by 3.

$B:$ When the string is of length $\%3=1$

$C:$ When the string is of length $\%3 = 2$

$D:$ Accept State when string ends in 0

### Diagram

*made with mermaid*

![[Screenshot 2025-01-26 at 9.05.45 PM.png]]
