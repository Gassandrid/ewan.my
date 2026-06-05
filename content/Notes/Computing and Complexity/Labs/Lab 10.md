---
id: Lab 10
aliases:
tags:
author: Ewan Pedersen, Sylvan Franklin
title: Lab 10
updated: 2025-04-17
date: 2025-04-17
---
## Exercise 01

> Let $A = \{ \langle M \rangle \mid \text{M is a DFA that doesn't accept any string containing an odd nmber of 1s} \}$
>
> Show that $A$ is decidable.

Construct $M_{1} st. \mathcal{L}(M_{1})$ is only strings with an odd number of ones. Construct $M_{2} st. \mathcal{L}(M_{2}) = \mathcal{L}(M_{1}) \cap \mathcal{L}(M)$. Now we can feed to $E_{dfa}$ 

---

## Exercise 02

> Given: We have a theorem (Sipser 5.13) that $ALL_{CFG}=\{ \langle G \rangle \mid \text{G is a CFG and } \mathcal{L}(G) = \Sigma^* \}$. (You don't need to prove this; Sipser has done it for us.)
>
> Use this theorem to prove the following:
>
> Let $EQ_{CFG} = \{ \langle A,B \rangle \mid A,B \text{ are CFGs and }\mathcal{L}(A) = \mathcal{L}(B) \}$. Show that $EQ$ is undecidable.
>
> Hint: use reduction and proof by contradiction

To prove that $EQ_{CFG}$ is undecidable, we will show that if it were decidable, then we could decide $ALL_{CFG}$, which we know is undecidable.

1. We assume that there exists a Turing machine $M_{EQ}$ that decides $EQ_{CFG}$.

2. We then construct a Turing machine $M_{ALL}$ that decides $ALL_{CFG}$ using $M_{EQ}$ as follows:

We are given a CFG $G$ and, we want to determine if $\mathcal{L}(G) = \Sigma^*$.

- we construct CFG $G'$ that generates $\Sigma^*$ (we make grammar that accepts all strings)
- we run $M_{EQ}$ on the pair $\langle G, G' \rangle G, G' \rangle$
- If $M_{EQ}$ accepts, then $\mathcal{L}(G) = \mathcal{L}(G') = \Sigma^*$, so $M_{ALL}$ accepts
- If $M_{EQ}$ rejects, then $\mathcal{L}(G) \neq \mathcal{L}(G') = \Sigma^*$, so $M_{ALL}$ rejects

3. this means that for $M_{ALL}$, it correctly decides $ALL_{CFG}$. The problem, however, is that this contradicts the theorem that $ALL_{CFG}$ is undecidable.

4. And thus, this means that our initial assumption that $M_{EQ}$ exists is false. Therefore, $EQ_{CFG}$ must be undecidable $\blacksquare$

---

## Exercise 03

> Show that if $A$ is Turing-recognizable and $A\leq_{m}\bar{A}$, then $A$ is decidable.
decidable.

We can show that $A$ is decidable by constructing a Turing machine $M$ that decides $A$.

1. We first must note that since $A$ is a Turing-recognizable language, there exists a Turing Machine $M_{A}$ that recognizes $A$.
2. Then, we can use the fact that $A \leq_{m} \bar{A}$ to construct a Turing machine $M$ that decides $A$ as follows:
   - Let $f$ be a computable mapping reduction such that $w \in A \iff f(w) \in \bar{A}$
   - On input $w$, our Turing-Machine $M$ completes the following:
     - Compute the $f(w)$
     - Run $M_{A}$ on the input $f(w)$
     - If $M_{A}$ accepts $f(w)$, then $f(w) \in A$, which means $w \notin A$, and thus $M$ rejects. 
     - If $M_{A}$ does not accept $f(w)$, then $f(w) \notin A$, which means $w \in A$, so $M$ accepts
   
3. The TM $M$ always halts because it either accepts or rejects for any input $w$.
   Therefore, $A$ is decidable. $\blacksquare$

---

## Exercise 04

> Recall what we've learned about _relations._
> 
> Let $R$ be a binary relation on a set $A$.
>
> $R$ is _reflexive_ if for all $x \in A, xRx$.
>
> $R$ is _symmetric_ if for all $x,y \in A,xRy \Rightarrow yRx$.
>
> $R$ is _transitive_ if for all $x,y,z \in A,(xRy \ and \ yRz) \Rightarrow xRz$
>
> $R$ is an _equivalence relation_ if $A$ is nonempty and $R$ is reflexive, symmetric and transitive.
>
> We say language $A$ is _mapping reducible_ to language $B$, and we write $A \leq_{m}B$, if there is some function $f$ such that $w \in A \Leftrightarrow f(w) \in B$
>
> Show that the relation $\leq_{m}$ is transitive.