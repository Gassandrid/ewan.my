---
date: 2025-02-27
updated: 2025-03-18
title: Lab 05
author: Ewan Pedersen, Sylvan Franklin
---

## Exercise 01

The pumping lemma for regular languages (Sipser, Theorem 1.70) states: “If $A$ is a regular language, then there is a number $p$ where if $s$ is any string in $A$ of length at least $p$, then $s$ may be divided into three pieces $s=xyzs=xyz$, satisfying the following conditions:

$$
\begin{align*}
&1. \ \ for \ each \ i \geq 0, \ \ xy^i z \in A, \\
&2. \ \ \mid y \mid > 0 [that \ is, y \ne \epsilon], \ and \\
&3. \ \  \mid xy \mid \leq p''
\end{align*}
$$

Write a proof by contradiction which uses the pumping lemma to show that the language $$L=\{0^m 1^n 0^m | n, m \in N\}$$

 is not regular.

1. Supposing towards $\Rightarrow\Leftarrow$ this language $L$ is regular and consider the string $s = 0^{m-1}01^{n}0^{m}$ 
2. Matching all the conditions 
3. Now pumping this we can get strings that are unbalanced and not in the language

> $\cup$ set union [](https://www.uvm.edu/~cbcafier/cs-fundamentals/09_md_tex/markdown_bare.html#cb5-2)$\cap$ set intersection [](https://www.uvm.edu/~cbcafier/cs-fundamentals/09_md_tex/markdown_bare.html#cb5-3)$\in$ set membership [](https://www.uvm.edu/~cbcafier/cs-fundamentals/09_md_tex/markdown_bare.html#cb5-4)$\not\in$ not a member [](https://www.uvm.edu/~cbcafier/cs-fundamentals/09_md_tex/markdown_bare.html#cb5-5)$\geq$ greater than or equal to [](https://www.uvm.edu/~cbcafier/cs-fundamentals/09_md_tex/markdown_bare.html#cb5-6)$\leq$ less than or equal to

---

## Exercise 02

Consider the following context-free grammar, $G$:

$$
\begin{align*}
&A \to DAD \mid B \\
&B \to aCb \mid bCa \\
&C \to DCD \mid D \mid \epsilon \\
&D \to a \mid b
\end{align*}
$$

1. What are the variables of $G$?
	- $G = \{ A,B,C,D \}$
2. What are the terminals of $G$?
	- $\{ a,b \}$
3. What is the start variable of $G$?
	- $A$
4. Give three strings in $\mathcal{L}(G)$
	1. $A \to B \to aCb \to ab$, therefore $ab \in \mathcal{L}(G)$
	2. $A \to B \to aCb \to aDCDb \to aaCab \to aa\epsilon ab \to aaab$, therefore $aaab \in \mathcal{L}(G)$
	3. $A \to DAD \to aAa \to aBa \to abCa \to abaa$, therefore $abaa \in \mathcal{L}(G)$
5. Give three strings not in $\mathcal{L}(G)$.
	1. $aa:$ smallest valid string require at least one occurrence $a$ and $b$ together, so $aa \not\in \mathcal{L}(G)$
	2. $bb:$ for same reason as above, requires at least one $a$, therefore $bb \not\in \mathcal{L}(G)$
	3. $abb:$ if $A \to B$, the $B$ must produce a pattern of $aCb$ or $bCa$ for symmetry. $abb$ does not fit this pattern, therefore $abb \not\in \mathcal{L}(G)$

---

## Exercise 03

Consider the grammar given in Exercise 02, and answer true or false to the following:

1. $C \to aba$
	- $False$ 
2. $C \to ^{*} aba$
	- $True$
3. $C \to C$
	- $False$ 
4. $C \to ^{*} C$
	- $True$
5. $DDD \to ^{*} aba$
	- $True$ 
6. $D \to ^{*}aba$
	- $False$
7. $C \to ^{*} DD$
	- $True$
8. $B \to ^{*} \epsilon$
	- $False$

---

## Exercise 04

Consider this context-free grammar, $H$

$$
\begin{align*}
&E \to E + T \mid T \\
&T \to T \times F \mid F \\
&F \to (E) \mid a
\end{align*}
$$

Give a parse tree and leftmost derivations for the following strings:

1. $a+a$
2. $((a))$

---

## Exercise 05

Explain, in plain English, in a sentence or two, the meaning of

$$
\mathcal{L}(G) = \{ w \in \Sigma^{*} \mid S \to^{*} w \}
$$

with respect to context-free languages, _i.e._, where $G$ is some context-free grammar, and $S$ is the start variable.

This Grammar constructs languages that start with the symbol $S$ and have symbols in the language $$ 
