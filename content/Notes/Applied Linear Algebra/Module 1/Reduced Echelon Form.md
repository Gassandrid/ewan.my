---
id: Reduced Echelon Form
aliases: []
tags:
  - math
  - linear-algebra
date: 2025-01-22
title: Reduced Echelon Form
updated: 2025-01-22
---

In this class, we will learn about the reduced echelon form of a matrix. The reduced echelon form is a matrix that has a variety of interesting properties.

---

## An Example

> [!Example]
> We are presented with the following set of linear equations:
>
> $$
> \begin{align*}
> -2x_{1} - 2x_{2} \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ &= 0 \\
> -x_{2} + x_{3} -3x_{4} \ \ \ \ \ \ \ \ \ &=1 \\
> 2x_{4} - x_{5} &= 1
> \end{align*}
> $$

> [!Success] Solution
>
> $$
> \left( 2-p+q, -2 +p -q, p, \frac{1}{3} - \frac{1}{3}q, q \right)
> $$

This leads us to:

$$
\begin{align*}
x_{1} &= -x_{2} \\
x_{2} &= -1 + x_{3} - 3x_{4} \\
x_{4} &= \frac{1}{3} + \frac{1}{3}x_{5}
\end{align*}
$$

This doesn't give us the full picture though, so we apply another set of transformations:

$$
\begin{align*}
x_{1} &= 2-x_{3} +x_{5} \\
x_{2} &= -2 + x_{3} - x_{5} \\
x_{3} &= \frac{1}{3} \ \ \ \ \ \ \ - \frac{1}{3}x_{5}
\end{align*}
$$

> [!Example]
> We are presented with the following set of linear equations:
>
> $$
> \begin{align*}
> x_{1} + x_{3} - x_{5} &= 2 \\
> x_{2} - x_{3} + x_{5} &= -2 \\
> x_{4} - \frac{1}{3}x_{5} &= \frac{1}{3}
> \end{align*}
> $$

---

## Matrix Notation

Given the system:

$$
\begin{align*}
2w - 3x - y +2z &= -2 \\
w   + \ \ \ \ \ \ \ 3y + \ \ z &= 6 \\
2w -3x - y + 3z &= -3 \\
x+y+2z &= 4
\end{align*}
$$

We can make a matrix by taking the **coefficients of the sets of variables**, ex coefficients of w, x, y, z.

$$
\begin{bmatrix}
2 & -3 & -1 & 2 \\
1 & 0 & 3 & 1  \\
2 & -3 & -1 & 3 \\
0 & 1 & 1 & 2
\end{bmatrix} \rightarrow \begin{bmatrix}
-2 \\
6 \\
-3 \\
4
\end{bmatrix}
$$

We can then input this into MATLAB to easily compute the result.

For almost all cases, we will be using MATLAB to solve these problems.