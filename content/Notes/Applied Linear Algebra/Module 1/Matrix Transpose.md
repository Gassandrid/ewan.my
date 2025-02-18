---
id: Matrix Transpose
aliases: []
tags:
  - math
  - linear-algebra
date: 2025-02-12
title: Matrix Transpose
updated: 2025-02-12
---

This lesson will cover matrix transposition, which is a fundamental operation in linear algebra. The transpose of a matrix is obtained by flipping the matrix over its diagonal. This operation is denoted by the superscript "T" or by the prime

---

Given a matrix $m\times n$, find the transpose:

Transpose $A^T$ is the $n\times m$

- $1^{st}$ i

>[!Example]
> 
> $$
> \begin{bmatrix}
> 1 & 9 & 8 & 3 & 4 & 4 \\
> 2 & 1 & 0 & 4 & 0 & 1  \\
> 3 & 7 & 8 & 7 & 1 & 1 
> \end{bmatrix}^{T}
> $$

The **transpose** of this matrix is:

$$
= \begin{bmatrix}
1 & 2 & 3 \\
9 & 1 & 7 \\
8 & 0 & 8 \\
3 & 4 & 7 \\
4 & 0 & 1  \\
4 & 1 & 1 
\end{bmatrix}
$$

Remember, the transpose is not a **rotation**, it is a **reflection**.

---

>[!Abstract] Definition
> Given a  square $n\times n$ matrix $A$, the matrix inverse $A^{-1}$, when it exists, is the one and only matrix such that:
> 
> $$
> AA^{-1} = I_{n\times n} = A^{-1}A
> $$

$$
[ A \mid I ] \to ^{RREF} [I \mid A^{-1}]
$$


