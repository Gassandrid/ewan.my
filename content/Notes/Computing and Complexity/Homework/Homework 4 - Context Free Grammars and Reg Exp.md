---
title: Homework 4 - Context Free Grammars and Regular Expressions
date: 2025-04-14
updated: 2025-04-18
author: Ewan Pedersen
---

**Abstract:**

> Homework 04 for Computing and Complexity, covering an extension of content on context free grammars and regular expressions, and the user of deciders for validation.

---

## Problem 01

> Let $ALL_{DFA}=\{ \langle A \rangle \mid \text{A is a DFA and } \mathcal{L}(A) = \Sigma^* \}$. Show that $ALL_{DFA}$ is decidable.

To solve this problem, we will recall the reductions we can make when we know that:

- A language $\mathcal{L}(A)=\Sigma^*$ when its complement is $\emptyset$
- That all DFAs are closed under the following complement:

$$
A = \{ Q, \Sigma, \delta, q_{0}, F \} \to A^{C}=\{ Q,\Sigma,\delta,q_{0}, Q / F\}
$$

- That a DFA's "emptiness" will be tested using a reachability check via graph, to test for $\mathcal{L}(A) = \emptyset$


**We can now use this decider to validate the input $A$ for $ALL_{DFA}$:**

- We must validate $\langle A \rangle$ encodes to a DFA as defined above ( $A = \{ Q,\Sigma,\delta, q_{0}, F \}$)
	- if we cant, then we **reject**
- We then construct the complement DFA as defined above ( $A^C = \{ Q, \Sigma, \delta, q_{0}, Q / F \}$)
- Using this construction, we then test for the emptiness of this complement $A^C$:
	- do a BFS/DFS search to find all reachable states from $q_{0}$
	- if any of these reachable stats is in the $Q / F$ such as an accepting state for the complement, then we know that $\mathcal{L}(A^C) \neq \emptyset$, and we **reject** given that this also shows that $\mathcal{L}(A)$ is not in $\Sigma^{*}$.
	- for any other case where no accept state is reachable for the complement, we can confirm that $\mathcal{L}(A^C) = \emptyset$, and thus $\mathcal{L}(A)$ is in $\Sigma^*$, and **accept** 

Therefore we have shown that the procdure above ensures that $ALL_{DFA}$ is decidable as required $\blacksquare$

---

## Problem 02

> Let $A\epsilon_{CFG}=\{  \langle G \rangle \mid \text{G is a context-free grammar and G generates }\epsilon \}$. Show that $A\epsilon_{CFG}$ is decidable.

Recall the definition of a context free grammar $G$:

$$
G = \{ V, \Sigma, R,S \}a
$$

**Where:**

- variables $V$
- terminals $\Sigma$
- start variable $S$
- productions $R$

We note that a given variable $A \in V$ is considered nullable if and only if $A \Rightarrow^* \epsilon$. Therefore:

$$
\text{G generates }\epsilon \Leftrightarrow \text{S nullable}
$$

We can then build a set $V$ of all nullable variables where $NULL \subseteq V$, where we iterate until there is no more change.

The algorithm looks something like the following(very rough pseudocode):

$$
\begin{align}
&\text{Initialize} \to NULL := \emptyset \\ \\
&\text{Repeat}( \text{until no new varibles} ) \to \{   \\
& \quad \text{For each prod}(A \to x_{1},x_{2},\dots,x_{n}) \to \{  \\
& \quad  \quad if \ n = 0 \ or \ n > 0 \ and \ x_{n} \text{ already in null} \to \text{add A to NULL} \\
& \quad \} \\
&\}
\end{align}
$$

With this we can now construct a decider for $A\epsilon_{CFG}$:

For input $\langle G \rangle$ we:

- ensure that the $G$ defintion above is a well behaved CFG, if not **reject**
- compute nullable set $NULL$ using pseudocode procedure
- ensure that if S is in NULL we **accept**, and if not we **reject**

Therefore thanks to this decider we know the procedure will always halt and correctly decide if $G$ generates $\epsilon$ as required $\blacksquare$

---

## Problem 03

> Consider the following context-free grammar:
>
> $$
 \begin{align*}
 S &\to aA \mid Bb \mid C \\
 A &\to aa \mid B \mid C \\
 B &\to bb \mid A \mid C \\
 C &\to c \mid \epsilon
 \end{align*}
 $$
> 
> Recall that $A_{CFG}=\{ \langle G,w \rangle \mid \text{G is a CFG and G generates string w} \}$

1. Is $\langle w, G \rangle \in A_{CFG}$?
	- **No**, because the inputs must be of a form like "$\langle G,w \rangle$". this input is inverted and produces incorrect terminals
2. Is $\langle G \rangle \in A_{CFG}$?
	- **No**, for the same reason as above, and the fact that there is no such string $w$ where it is with $G$
3. Is $\langle G, abb \rangle \in A_{CFG}$?
	- **Yes**, below construction proves:

$$
\begin{align*}
S &\to aA \\
&\to aB  \quad \ - \text{due to A->B} \\
&\to a \ bb \quad - \text{due to B->bb}
\end{align*}
$$
	
4. Is $\langle G, \epsilon \rangle \in A_{CFG}$?
	- **Yes**, below construction proves:

$$
\begin{align*}
S &\to aA \\
&\to \epsilon \quad - \text{due to C->}\epsilon
\end{align*}
$$
5. Is $\langle G, abc \rangle\in A_{CFG}$?
	- **No**, because this cannot be created from any derivation
6. Is $\langle G, ac \rangle \in A_{CFG}$?
	- **Yes**, below construction proves:

$$
\begin{align*}
S &\to aA \\
&\to aC \quad - \text{due to A->C} \\
&\to a \ c \quad -\text{due to C->c}
\end{align*}
$$


---

## Problem 04

> Let $A=\{ \langle R,S \rangle \mid \text{R and S are regular expressions and }\mathcal{L}(R) \subseteq \mathcal{L}(S) \}$. Show that $A$ is decidable.


To prove this we must construct a DFA to test for emptiness. We define emptiness with a reachability check. The following procedure proves $A$ is decidable:

1. First we validate that the given $R$ and $S$ are well behave regex over $\Sigma$
	- **reject** if not
2. We can then convert these regex into their DFA equivelants using state elimination or another method. For this purpose, we will just use $A_{R}$ and $A_{S}$ where they are both DFAs that recognize exactly $\mathcal{L}(R)$ and $\mathcal{L}(S)$
3. We then complement $A_{S}$ by swapping the accpeting and non-accepting states so that $A^C_{S}$ now recognizes $\Sigma / \mathcal{L}(S)$, adn so on.
4. Then we intersect $A_{R}$ wtih $A^C_{S}$ using the prod automation construction yielding a DFA that we will call $P$ that:

$$
\mathcal{L}(P) = \mathcal{L}(R) \cap (\Sigma^* / \mathcal{L}(S))
$$

5. we test for the emptiness of $P$ by doing a search, either BFS or DFS and finding all reachable states from the start state to see if any accepting state can be reached.
	- if there is no reachable accept state we **accept** as $\mathcal{L}(P)= \emptyset$
	- if there is a reachable accept state, then we **reject** as $w \in \mathcal{L}(R) / \mathcal{L}(S)$

