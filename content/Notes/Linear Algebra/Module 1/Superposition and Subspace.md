---
title: Superposition and Subspace
date: 2025-02-03
updated: 2025-04-02
tags:
  - "#math/linear-algebra"
---
 

Some terms we will be look at today:

- [[Superposition Principle]]
- [[Subspace]]

---

## Subspaces

Essentially, solutions of a homogeneous system of linear equations

***OR***

a span of a list of vectors

lets look at an example

---

## Example

We are presented with the following linear system:

$$
\begin{align*}
x - z &= 0 \\
y + z &= 0
\end{align*}
$$

Fairly simple, yields a general solution of $(p,-p, p)$.

Lets construct a **basic solution**.

$$
Basic \ Solution \to
\begin{pmatrix}
1 \\
-1 \\
1
\end{pmatrix}
$$

> [!Warning] Please Note
> Note that the **general solution** $(p,-p,p)$ is the *given*
> **AND**
> That the **basic solution** $\begin{pmatrix}1 \\ -1 \\ 1\end{pmatrix}$ is the *goal*

---

Given a subspace, what is the shortest list of vectors that span the space?

## Shrinking

Let's review some possible solutions:

$$
\begin{pmatrix} 1 \\ -1 \\ 0 \end{pmatrix}, 
\begin{pmatrix} 1 \\ 1 \\ 0 \end{pmatrix}, 
\begin{pmatrix} 1 \\ 0 \\ 0 \end{pmatrix}, 
\begin{pmatrix} 0 \\ 0 \\ 0 \end{pmatrix}
$$

where we find that the **first two** work for this problem

$$
\begin{align*}
a+b&=1 \\
-b+b&=0 \\
0 &= 0
\end{align*} \ \ \to 
$$

*becomes*

$$
\begin{align*}
a &= \frac{1}{2} \\
b &= \frac{1}{2} \\
0 &= 0
\end{align*}
$$

*and finally*

$$
\begin{align*}
\vec{i} &= \frac{1}{2}\vec{g} + \frac{1}{2} \vec{h} \\
\vec{j} &= 0 \vec{g} + 0\vec{h}
\end{align*}
$$