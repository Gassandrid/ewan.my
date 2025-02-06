---
id: Shrinking and Linear Independence
aliases: []
tags:
  - math
  - linear-algebra
date: 2025-02-05
title: Shrinking and Linear Independence
updated: 2025-02-05
---

This class will finish our discussion on [[Superposition and Subspace#Shrinking|Shrinking]] from last class, and then will begin the discussion on Linear Independence.

---

## Shrinking Continued

Let's begin with a list of vectors:

$$
\begin{pmatrix} 1 \\ 1 \\ -1 \\ -1 \end{pmatrix}
\begin{pmatrix} 2 \\ 0 \\ -1 \\ -1 \end{pmatrix}
\begin{pmatrix} -3 \\ -1 \\ 2 \\ 2 \end{pmatrix}
\begin{pmatrix} 1 \\ -1 \\ 1 \\ -1 \end{pmatrix}
\begin{pmatrix} 2 \\ 0 \\ -2 \\ 0 \end{pmatrix}
$$

The **shrinking** process involves **taking the matrix of this list of vectors:**

And then we find the RREF, nothing the values of $1$. (_we will also note the values of -1 in the 3rd column_)

$$
\begin{pmatrix}
1 & 2 & -3 & 1 & 2 \\
1 & 0 & -1 & -1 & 0 \\
-1 & -1 & 2 & 1 & -2 \\
-1 & -1 & 2 & -2 & 1
\end{pmatrix} \to^{RREF} \begin{pmatrix}
*1* & 0 & -1  & 0 & -1 \\
0 & *1* & -1  & 0 & 2 \\
0 & 0 & 0  & *1* & -1 \\
0 & 0 & 0  & 0 & 0
\end{pmatrix}
$$

We are dumping this matrix into MATLAB with **zero intent** of actually solving the linear system.

Taking the 3rd vector out of the matrix:

$$
\begin{pmatrix} -3 \\ -1 \\ 2 \\ 2 \end{pmatrix} =
- \begin{pmatrix} 1 \\ 1 \\ -1 \\ -1 \end{pmatrix}
- \begin{pmatrix} 2 \\ 0 \\ -1 \\ -1 \end{pmatrix}
$$

**Since the 5th vector also has negatives, we take that one out as well:**

$$
\begin{pmatrix} 2 \\ 0 \\ -2 \\ 0 \end{pmatrix} =
- \begin{pmatrix} 1 \\ 1 \\ -1 \\ -1 \end{pmatrix}
+2 \begin{pmatrix} 2 \\ 0 \\ -1 \\ -1 \end{pmatrix}
- \begin{pmatrix} 1 \\ -1 \\ 1 \\ -1 \end{pmatrix}
$$

---

We are left with the **surviving 3 vectors:**

$$
\begin{pmatrix} 1 \\ 1 \\ -1 \\ -1 \end{pmatrix}
\begin{pmatrix} 2 \\ 0 \\ -1 \\ -1 \end{pmatrix}
\begin{pmatrix} 1 \\ -1 \\ 1 \\ -1 \end{pmatrix}
$$

Finding the RREF of the matrix of these 3 vectors:

$$
\begin{pmatrix} 1 & 2 & 1 \\ 1 & 0 & -1 \\ -1 & -1 & 1 \\ -1 & -1 & -1 \end{pmatrix}

\to^{RREF}

\begin{pmatrix} 1 & 0 & 0 & \mid & 0 \\ 0 & 1 & 0 & \mid & 0 \\ 0 & 0 & 1 & \mid & 0 \\ 0 & 0 & 0 & \mid & 0 \end{pmatrix}
$$

> [!Danger] This List is now UNSHRINKABLE

---

## Theorem

Given a list of vectors $\vec{v}_{1},\vec{v}_{2}, \dots, \vec{v}_{n}$ in $\mathbb{R}^n$:

1. $\vec{v}_{1},\vec{v}_{2}, \dots, \vec{v}_{n}$ is **unshrinkable**: no vector in a linear combination of previous vectors in the list
2. $\vec{v}_{1},\vec{v}_{2}, \dots, \vec{v}_{n}$ is **irredundant**: no vector in the list in a linear combination of the others
3. The homogeneous system $x_{1}\vec{v}_{1} + x_{2}\vec{v}_{2} + \dots + x_{n}\vec{v}_{n} = \vec{0}$ only has the trivial solution $x_{1}=x_{2}=\dots=x_{n}=0$,
   - **linear independence**

---

> [!Abstract] Definition
> A basis for a subsapce $W$ of $\mathbb{R}^n$ in a linear independent list of vectors that spans $W$

For example, the list of vectors:

$$
\begin{pmatrix} 1 \\ 0 \\ 0 \end{pmatrix}, \begin{pmatrix} 0 \\ 1 \\ 0 \end{pmatrix}, \begin{pmatrix} 0 \\ 0 \\ 1 \end{pmatrix}
$$

is a basis for $\mathbb{R}^3$

This rule is true for any list of vectors that spans $\mathbb{R}^n$.

---

>[!Example]
> Consider $W$ the subsapce of solutions to the homogeneous system:
>
> $$
> x-y+2z =0
> $$

Let's start by defining the variables

$$
\begin{align*}
z &= a \\
y &= b \\
x &= b - 2a
\end{align*}
$$

**Basic Solutions**:

$$
\begin{matrix}
a=1 \\
\begin{pmatrix}
-2 \\
0 \\
1
\end{pmatrix}
\end{matrix}, \begin{matrix}
b=1 \\
\begin{pmatrix}
1 \\
1 \\
0
\end{pmatrix}
\end{matrix} \ \ \ span \ W
$$

Check for independence:

$$
a \begin{pmatrix} -2 \\ 0 \\ 1 \end{pmatrix}
+B \begin{pmatrix} 1 \\ 1 \\ 0 \end{pmatrix}
= \begin{pmatrix} 0 \\ 0 \\ 0 \end{pmatrix} 
$$

Solving for these vectors:

$$
\begin{align*}
-2a + b &= 0 \\
b &= 0 \\
\end{align*}
$$