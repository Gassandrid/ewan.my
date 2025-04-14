---
title: Homework 4 - Context Free Grammars and Regular Expressions
date: 2025-04-14
updated: 2025-04-14
author: Ewan Pedersen
---

**Abstract:**

> write this here

---

## Problem 01

> Let $ALL_{DFA}=\{ \langle A \rangle \mid \text{A is a DFA and } \mathcal{L}(A) = \Sigma^* \}$. Show that $ALL_{DFA}$ is decidable.


---

## Problem 02

> Let $A\epsilon_{CFG}=\{  \langle G \rangle \mid \text{G is a context-free grammar and G generates }\epsilon \}$. Show that $A\epsilon_{CFG}$ is decidable.

---

## Problem 03

> Consider the following context-free grammar:
> 
> $$
> \begin{align*}
> S &\to aA \mid Bb \mid C \\
> A &\to aa \mid B \mid C \\
> B &\to bb \mid A \mid C \\
> C &\to c \mid \epsilon
> \end{align*}
> $$
> 
> Recall that $A_{CFG}=\{ \langle G,w \rangle \mid \text{G is a CFG and G generates string w} \}$

1. Is $\langle w, G \rangle \in A_{CFG}$?
2. Is $\langle G \rangle \in A_{CFG}$?
3. Is $\langle G, abb \rangle \in A_{CFG}$?
4. Is $\langle G, \epsilon \rangle \in A_{CFG}$?
5. Is $\langle G, abc \rangle\in A_{CFG}$?
6. Is $\langle G, ac \rangle \in A_{CFG}$?


---

## Problem 04

> Let $A=\{ \langle R,S \rangle \mid \text{R and S are regular expressions and }\mathcal{L}(R) \subseteq \mathcal{L}(S) \}$. Show that $A$ is decidable.

