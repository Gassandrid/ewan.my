---
id: Lab 08
aliases: []
tags:
  - cs/theory
author: Ewan Pedersen, Mason Ritchie, Vikyat Mulpuri
date: 2025-04-01
fileClass: note
title: Lab 08
updated: 2025-04-01
---

## Exercise 01

> Examine the formal definition of a Turing Machine to answer the following questions, and explain your reasoning.

1.  **Can a Turing machine ever write the blank symbol on its tape?**

    - Yes, a Turing machine can write the blank symbol on its tape as part of its operation.

2.  **Can the tape alphabet $\Gamma$ be the same as the input alphabet $\Sigma$?**

    - No, the tape alphabet $\Gamma$ must include the blank symbol while $\Sigma$ doesn't.

3.  **Can a "plain vanilla" Turing machine's head ever be in the same location in two successive steps?**

    - No, because "plain vanilla" cannot stay in one place, it has to move left or right.

4.  **Can a Turing machine contain just a single state?**

    - No, a Turing machine needs at least two states (initial state and accept/reject).

---

## Exercise 02

> For the following Turing Machine, complete the questions below:

![[Screenshot 2025-04-01 at 9.17.47 AM.png|Turing Machine From Sipser]]

1.  **Work out the complete sequence of configurations which would result if the input were 000**

$$
\begin{align*}
&q_{1} 000 \\
&\sqcup q_{2}00 \\
&\sqcup xq_{3}0 \\
&\sqcup x 0 q_{4} \sqcup \\
&\sqcup x 0 \sqcup q_{R} \sqcup \\
\end{align*}
$$

2.  **Check: did you end in $q_{reject}$?**

- Yes, we did.

---

## Exercise 03

> Given some Turing machine, $M$, we observe that configuration $C_{1}=uabq_{i}cdv$ yields configuration $C_{2}=uabbq_{j}dv$. Give the piece of the transition function, $\delta$, which makes this possible.

$$
C_{1}=uabq_{i}cdv \to C_{2} = uabbq_{j}dv = \delta = (q_{i},C) \to (a_{j}, b, R)
$$

> How about the case where configuration $C_{2}=uabbq_{j}dv$ yields $C_{3}=uabq_{k}bdv$?

$$
C_{2}=uabbq_{j}dv \to C_{3}=uabq_{k}bdv = \delta = (q_{j},d) \to (q_{k},d,L)
$$

> How about the case where $C_{3}=uabq_{k}bdv$ yields $C_{4}=uaq_{l}b\#dv$?

$$
C_{3} = uabq_{k}bdv \to C_{4} = uaq_{l}b\#dv= \delta = (q_{l},\#,L)
$$

---

## Exercise 04

> Given the Turing machine shown in Sipser ITTTOC Example 3.9, write the complete sequence of configurations that formally describes the computation on the following inputs:

![[Screenshot 2025-04-01 at 9.39.34 AM.png|Turing Machine Sipser 3.9]]

1. 01#01

**Transisitons**
`q1 01#01` → `x q3 1#01` → `x1 q3 #01` → `x1# q5 01` →
`x1# q6 x1` → `x1 q7 #x1` → `x q7 1#x1` → `x q1 1#x1` →
`xx q3 #x1` → `xx# q5 x1` → `xx# q6 xx` → `xx q7 #xx` →
`x q7 x#xx` → `x q8 x#xx` → `xx# q_accept xx`

**Accept**

2. 00#10

**Transisitons**

`q1 00#10` → `x q3 0#10` → `x0 q3 #10` → `x0# q5 10` →

`x0# q6 x0` → `x0 q7 #x0` → `x q7 0#x0` → `x q1 0#x0` →

`xx q3 #x0` → `xx# q5 x0` → `xx# q6 xx` → `xx q7 #xx` →

`x q7 x#xx` → ` q7 xx#xx` → `q_reject xx#xx`

**Reject**

> Which of these halt in the accept state, and which halt in the reject state?

We can see that the first input halts in the accept state, while the second input halts in the reject state.
