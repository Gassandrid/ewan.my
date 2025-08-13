---
id: Uncountably Infinite
aliases: []
tags: []
date: 2025-08-13
updated: 2025-08-13
---

_Uncountably Infinite_ sets are infinite sets that cannot be put into a one-to-one correspondence with the natural numbers. Equivalently, they cannot be listed in a sequence $a_1,a_2,\dots$ that contains every element exactly once.

---

## Formal Definition

A set $A$ is uncountable if it is infinite and there is no bijection

$$
 f: \mathbb N \to A.
$$

Equivalently, $A$ is uncountable if it is not countable (i.e., not finite and not countably infinite). In cardinal notation, this means $|A| > \aleph_0$.

Useful equivalent formulations:

- There is no surjection $\mathbb N \twoheadrightarrow A$.
- Every sequence $(a_n)_{n\in\mathbb N}$ in $A$ misses at least one element of $A$.

## Canonical Examples

1. The real numbers $\mathbb R$ are uncountable (Cantor’s diagonal argument).
2. Any non-degenerate interval $(a,b)\subseteq\mathbb R$ is uncountable and in fact has the same cardinality as $\mathbb R$:

$$
|(a,b)| = |\mathbb R| = |(0,1)| =: \mathfrak c.
$$

3. The power set $\mathcal P(\mathbb N)$ is uncountable; moreover,

$$
|\mathcal P(\mathbb N)| = |\{0,1\}^{\mathbb N}| = |(0,1)| = |\mathbb R| = 2^{\aleph_0}.
$$

4. The [[Cantor Set]] is uncountable, as it contains all binary sequences of infinite length, which can be put in bijection with $\{0,1\}^{\mathbb N}$.

5. For any $n\in\mathbb N_{\ge 1}$, $\mathbb R^n$ is uncountable and $|\mathbb R^n|=|\mathbb R|$.

## Cantor’s Diagonal Argument (Uncountability of $(0,1)$)

Suppose, for contradiction, that $(0,1)$ is countable. Then there is a sequence listing all its elements in decimal expansions:

$$
(0,1) = \{x*1,x_2,x_3,\dots\},\qquad x_n = 0.d*{n1}d*{n2}d*{n3}\dots
$$

(Choose decimal representations that do not end with an infinite tail of $9$s.) Construct a new number $y\in(0,1)$ by diagonalization:

$$
y = 0.c_1c_2c_3\dots,\qquad c_n = \begin{cases}

5 & \text{if } d\_{nn} \neq 5,\\

6 & \text{if } d\_{nn} = 5.

\end{cases}
$$

Then $y$ differs from $x_n$ in the $n$th digit for every $n$, so $y$ is not in the list. This contradicts the assumption that the list is complete. Hence $(0,1)$ and therefore $\mathbb R$ are uncountable.

## Cantor’s Theorem (Power Set is Strictly Larger)

For every set $X$ there is no surjection $f:X\twoheadrightarrow \mathcal P(X)$. In particular $|\mathcal P(X)| > |X|$.

Proof (diagonal set): Suppose $f:X\to\mathcal P(X)$. Consider the set

$$
D = \{\, x\in X : x\notin f(x) \,\}.
$$

If $D=f(a)$ for some $a\in X$, then $a\in D$ iff $a\notin f(a)=D$, a contradiction. Thus $D$ is not in the image of $f$, so $f$ cannot be surjective.

Taking $X=\mathbb N$ gives $|\mathcal P(\mathbb N)|> |\mathbb N|$, hence $\mathcal P(\mathbb N)$ is uncountable.

## Equinumerosities and Cardinal Identities

- All non-empty open intervals have the same cardinality as $\mathbb R$:

$$
|(a,b)| = |\mathbb R|,\quad a<b.
$$

  One explicit bijection from $(0,1)$ to $\mathbb R$ is

$$
\phi:(0,1)\to\mathbb R,\quad \phi(t)=\tan\!\big(\pi(t-\tfrac12)\big).
$$

- Products and finite powers preserve cardinality $\mathfrak c$:

$$
|\mathbb R^n| = \mathfrak c\quad (n\in\mathbb N\_{\ge 1}),\qquad |(0,1)^\mathbb N| = \mathfrak c.
$$

- Spaces of sequences and functions can be uncountable. For instance, the set of all sequences of bits $\{0,1\}^{\mathbb N}$ has cardinality $2^{\aleph_0}$.

## Proving Uncountability

1. **Diagonalization**: Show any attempted enumeration misses an element via a diagonal construction.
2. **Power-set argument**: Inject $\mathcal P(\mathbb N)$ into your set and use $|\mathcal P(\mathbb N)|=2^{\aleph_0}$.
3. **Bijections** with known uncountable sets: Exhibit a bijection with $(0,1)$ or $\mathbb R$.
4. **Cardinal arithmetic**: Show $|A|\ge|\{0,1\}^{\mathbb N}|$ or $|A|\ge|\mathcal P(\mathbb N)|$.
