---
id: Countably Infinite
created_on: "[[08-13-2025]]"
aliases: []
tags:
  - math/sets
date: 2025-08-13
class:
  - note
updated: 2026-03-17T11:01:42-04:00
---

_Countably Infinite_ sets are a fundamental concept in set theory, representing sets that can be put into a one-to-one correspondence with the natural numbers. This means they can be "counted" in a sense, even if they are infinite.

---

## Formal Definition

A set $A$ is countably infinite if there exists a [[bijection]]

$$
 f:\mathbb N \to A.
$$

Equivalently, $A$ can be written as a sequence

$$
 A = \{a_1,a_2,a_3,\dots\}
$$

listing every element exactly once. In this case we write $|A| = \aleph_0$.

Notes on notation: $\mathbb N=\{0,1,2,\dots\}$ (or $\{1,2,3,\dots\}$ by convention), $\mathbb Z$ are the integers, $\mathbb Q$ the rationals, and $\mathbb R$ the reals.

### Equivalent Characterizations

- There is an injection $A \hookrightarrow \mathbb N$ and a surjection $\mathbb N \twoheadrightarrow A$ (by Schröder–Bernstein this implies a [[bijection]]).
- $A$ can be enumerated by an algorithm that outputs $a_1,a_2,\dots$ (not necessarily efficiently), with every element appearing at some finite stage.

### Some Core Examples

- $\mathbb N$ is countably infinite (identity map).
- $\mathbb Z$ is countably infinite via the [[bijection]]

$$
f(0)=0,\quad f(2k)=k,\quad f(2k-1)=-k\quad (k\ge 1),
$$

yielding the enumeration $0,1,-1,2,-2,3,-3,\dots$.

- $\mathbb N\times\mathbb N$ is countable by the Cantor pairing function

$$
  \pi(a,b)=\tfrac12(a+b)(a+b+1)+b,
$$

which is a [[bijection]] $\mathbb N\times\mathbb N\to\mathbb N$.

- $\mathbb Q$ is countable: enumerate reduced fractions with positive denominator by diagonals

$$
  \mathbb Q^+ = \left\{ \frac{p}{q} : p,q\in\mathbb N_{\ge 1},\ \gcd(p,q)=1 \right\}
$$

in increasing $p+q$, then interleave signs and insert $0$.

## Basic Theorems

1. Subset of a countable set is countable.

   Proof sketch: If $A\subseteq B$ and $B$ is finite or admits a surjection $\mathbb N\twoheadrightarrow B$, then compose with the inclusion to get a surjection $\mathbb N\twoheadrightarrow A$.

2. Countable union of countable sets is countable.

   Proof sketch: If $A_i=\{a_{i1},a_{i2},\dots\}$, enumerate $\bigcup_i A_i$ along the diagonals of the grid $(i,j)\in\mathbb N\times\mathbb N$ and skip repeats.

3. Finite product of countable sets is countable (e.g. $\mathbb N^k$ is countable).

   Proof sketch: $\mathbb N\times\mathbb N$ is countable; then use induction on $k$.

4. $\mathbb Q$ is countable.

   Proof sketch: Map $(p,q)\in\mathbb Z\times\mathbb N_{\ge 1}$ to $p/q$ (reduced), then use that $\mathbb Z\times\mathbb N$ is countable and remove duplicates.

## Prooving a Set is Countable

1. Construct an explicit [[bijection]] $f:\mathbb N\to A$; or equivalently, give an enumeration $a_1,a_2,\dots$.
2. Reduce to known countable sets by building injections/surjections to/from $\mathbb N$, $\mathbb Z$, $\mathbb N^k$, or $\mathbb Q$.
3. Use closure properties: subsets, finite products, and countable unions of countable sets are countable.

### Common Pitfalls

- Showing only that there is an injection $A\hookrightarrow\mathbb N$ proves “at most countable,” not necessarily infinite.
- An enumeration must list every element of $A$ at some finite step; skipping infinitely many elements invalidates the proof.
- Beware of duplicates when enumerating (especially for $\mathbb Q$); ensure each element appears exactly once.
