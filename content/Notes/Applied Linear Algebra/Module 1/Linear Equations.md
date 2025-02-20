---
id: Linear Equations
aliases: []
tags:
  - math
  - linear-algebra
date: 2025-01-15
title: Linear Equations
updated: 2025-02-18
---

In essence, Linear Equations are equations that represent straight lines. They are the simplest form of equations and are used to represent relationships between variables. The general form of a linear equation is outlined as follows.

---

## What is a Linear Equation

$$
a_{1}x_{1}+a_{2}x_{2}+\dots+a_{n}x_{n} = b
$$

- the $a_{n}$ variables serve as **coefficients**
- the $x_{n}$ variables serve as **variable irrationals**
- $b$ is a **constant**

However, there isn't that much interesting about a single linear equation. Instead, what we will be focusing on are [[Linear Equations#Systems of Linear Equations|Systems of Linear Equations]].

---

## Systems of Linear Equations

$$
\begin{align*}
a_{11}x_{1} + a_{12}x_{2}+\dots+a_{1n}x_{n} = b_{1} \\
a_{21}x_{1} + a_{22}x_{2}+\dots+a_{2n}x_{n} = b_{2} \\
\vdots \ \ \ \ \ \ \ \ \ \vdots \ \ \ \ \ \ \ \vdots\\
a_{51}x_{1} + a_{52}x_{2}+\dots+a_{5n}x_{n} = b_{5} \\
\end{align*}
$$


>[!Abstract] Definition
> A system of linear equations is a list of linear equations that **all have the same variables**

---

## Example

>[!Example] Solving a System of Linear Equations
>
> $$
> \begin{align*}
> 3x - 2y + z &= 5  \\
> -x + 0y +2z &= -1 \\
> 0x + 3y - z &= -3
> \end{align*}
>$$

---

## Definition

A solution to a system of linear equations is a list of numbers that make all the equations true when substituted for the variables.

> [!Warning] Question
> What is a solution to the equation presented in the [[Linear Equations#Example|Example?]]

**Let's try a ballpark guess**

$$
\begin{align*}
y &=-1 \\
x &=1 \\
z &= 0
\end{align*}
$$

While we think this is an answer, all we have really done is just make **another** system of linear equations.

While some linear equations like the example can possibly be solved by "eyeballing it", we need a more refined way of finding an answer to these problems.

---

## Elementary Operations

There are 3 elementary operations we should be aware of:

1. **Swap**
	- We exchange one equation with another
	- $R_{i} \leftarrow\rightarrow R_{j}$
2. **Scale**
	- We multiply the constant and the coefficients by a nonzero number.
	- $sR_{j}$
3. **Combo**
	- We add a multiple of one equation to another
	- $tR_{i}+R_{j}$

---

## Another Example

>[!Example]
>
> $$
> \begin{align*}
> 2x + 2y -2z &= 2 \\
> x - 2y + z &= -1 \\
> 2x - 3y -3z &= 1
> \end{align*}
>$$

With the help of the [[Linear Equations#Elementary Operations|elementary operations]], we get:

*applying* $-2 R_{2} + R_{1}, \ \ -2R_{2} + R_{3}$

$$
\begin{align*}
7y-4z &= 4 \\
x-2y +z &= -1 \\
y-5z&=3
\end{align*}
$$

*applying* $-7R_{3} + R_{1}, \ \ \ 2R_{3}+R_{2}$

$$
\begin{align*}
31z &= -17 \\
x - 9z &= 5 \\
y - 5z &= 3
\end{align*}
$$

> [!Success] Solution
> We get an answer of:
>
> $$
> \frac{2}{31}, \frac{8}{31}, -\frac{17}{31}
>$$