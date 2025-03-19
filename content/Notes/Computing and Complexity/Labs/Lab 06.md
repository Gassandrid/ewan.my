---
title: Lab 06
date: 2025-03-18
updated: 2025-03-18
author: Ewan Pedersen, Sylvan Franklin, Isaac Wedamen
---

## Exercise 01

Produce context-free grammars for the following languages. Replacement rules are all you need—it’s not necessary to write out complete 4-tuples. $\Sigma = \{ 0,1 \}$

1. **Problem A**

$$
A = \{ w \mid the \ length \ of \ w \ is \ even \}
$$

$$
\begin{align*}
A\to & \epsilon | \Sigma B \\ \\
B\to &  \Sigma|A
\end{align*}
$$

2. **Problem B**

$$
B = \{ w \mid the \ length \ of \ w \ is \ odd, \ and \ the \ middle \ symbol \ is \ 0\}
$$

$$
\begin{align*}
A\to 0A 1 | 1 A 0 | \epsilon
\end{align*}
$$

3. **Problem C**

$$
C = \{ w \mid w \ has \ the \ same \ number \ of \ 0s \ and \ 1s \ in \ any \ order
$$

$$
\begin{align*}
S & \to 0 S 1 | 1 S 0 | S S | \epsilon
\end{align*}
$$

---

## Exercise 02

Context-free languages are close under union. That is, if $A$ and $B$ are context-free, then the language $A \cup B$ is also context-free.

Produce CFGs for the following languages, using the definitions from exercise 01:

1. **Problem A**

$$
A \cup B
$$

$$
S \to \Sigma S \Sigma | \epsilon
$$

2. **Problem B**

$$
B \cup C
$$

---

## Exercise 03

Prove that the following languages are context-free by providing context-free grammars that generate them.

1. **Problem A**

$$
A = \{ a^{m}b^{n}c^{n} \mid m,n \geq 0 \}
$$

Defining this with start symbol $S$, nonterminals $A$ and $B$ to generate any number $a$'s or the balanced part $b^{n}c^{n}$

We get:

$$
\begin{align*}
S &\to A \ B \\
A &\to a \ A \mid \epsilon \\
B &\to b \ B \ c \mid \epsilon
\end{align*}
$$

2. **Problem B**

$$
B = \{ a^{n}b^{n}c^{m} \mid m,n \geq 0 \}
$$

Defining this with start symbol $S$, nonterminals $A$ and $C$ to generate the balanced part $a^{n}b^{n}$ or any number of $c$'s

$$
\begin{align*}
S &\to A \ C \\
A &\to a \ A \ b \mid \epsilon \\
C &\to c \ C \mid \epsilon
\end{align*}
$$

---

## Exercise 04

**Given the two languages, $A$ and $B$ from exercise 03, write the language $A \cap B$ using set builder notation.**

To complete problem we let a string be $a^{x}b^{y}c^{z}$, for the previously defined $A$ and $B$

For String to be in $A$:

- must be integers $m$ and $n$ so that $x=m$, $y=n$, and $z=n$

and thus the condition for $A$ is $z=y$

For String to be in $B$:

- must be integers $n'$ and $m'$ so that $x =n'$, $y=n'$, and $z = m'$

and thus the condition for $B$ is $x=y$

**Therefore:**

$$
A \cap B = \{ a^{n}b^{n}c^{n} \mid n \geq 0 \}
$$

---

## Exercise 05

Consider the language $\{ 0^{n}1^{n}0^{n} \mid n \geq 0 \}$, which is **not** context-free

1. **How is this language similar to the language $A \cap  B$ from exercises 03 and 04?**
2. **What does this suggest about certain closure properties of context-free languages**


