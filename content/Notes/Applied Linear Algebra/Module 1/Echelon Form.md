---
id: Echelon Form
aliases: 
tags:
  - math
  - linear-algebra
date: 2025-01-17
title: Echelon Form
updated: 2025-02-03
---

Echelon form is a matrix form where the leading coefficient of each row is always to the right of the leading coefficient of the row above it. The leading coefficient of a row is the first non-zero element in that row.

---

Lets start with an example:

$$
\begin{align*}
x_{1} - 4x_{2} + 3x_{3} + x_{4} \ \ \ \ \ \ \ \ \ \ \ &= \ \ \ 6 \\
4x_{3} \ \ \ \ \ \ \ \ \ \ \ - x_{5} &= -3 \\
x_{4} \ \ + x_{5} &= -1
\end{align*}
$$

> [!Abstract] Definition
> The lead variable of a linear equation is the first variable with a nonzero coefficient. Equations of the form $0 = b$ have no lead variable.

> [!Abstract] Definition
> A system of linear equations is in **Echelon Form** if the lead variable of each equation is to the right of the lead variable of all previous equations and all equations $0=b$ are at the end of the last.

Applying it to this example, we note that the lead variable would be $x_{1}$

---

## Back Substitution

> [!Example]
>
> $$
> \begin{align*}
> -2x_{1} - 2x_{2}  \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ &= 0 \\
> -x_{2} + x_{3} - 3x_{4} \ \ \ \ \ \ \ \ \ &= 1 \\
> 3x_{4} - x_{5} &= 1
> \end{align*}
> $$

Let's start with $x_{5}$ :

- is it the lead variable of the last equation? **no** $\rightarrow$ therefore it's a "free" variable.
	- Instead of choosing a value for $x_{5}$, we are going to pick a [[Parameter]] $P$

Now let's do $x_{4}$:

- $x_{4}$ is the lead variable of its line, therefore:

$$
x_{4}: \ \ \frac{1}{2} + \frac{1}{3} P \ \ \ LEAD!!!
$$

Now $x_{3}$:

- $x_{3}$ is **NOT** the lead variable, therefore it is "free" and we assign another [[Parameter]] $q$

Now $x_{2}$ :

- $x_{2}$ IS a lead variable, therefore:

$$
x_{2} : \ \ \ -2 - p + q \ \ \ \ LEAD!!!!
$$

And now finally $x_{1}$:

- $x_{1}$ IS a lead variable, we need to solve for this variable using the information we have gathered thus far.

$$
x_{1}: \ \ \ 2 + p -q \ \ \ LEAD!!!!
$$

**We are left with a set of values for the x variants:**

$$
\begin{align*}
x_{5}&: &&P &&&FREE \\
x_{4}&: &&\frac{1}{2} + \frac{1}{3}p &&&LEAD \\
x_{3}&: &&Q  &&&FREE \\
x_{2}&: &&-2 -p +q  &&&LEAD \\
x_{1}&: &&2+p-q &&&LEAD
\end{align*}
$$

And thus, we get the following **general solution:**

> [!Success] Solution
>
> $$
> \left( 2+p-q, -2-p+q, q, \frac{1}{3} +  \frac{1}{3} p, p\right)
> $$

---

## More Examples

> [!Example]
>
> $$
> \begin{align*}
> x + \ \ y + \ \ z &= 0 \\
> x + 2y + 3z &= 8 \\
> 2x + 3y + 4z &= 13
> \end{align*}
> $$

$$
-R_{1} + R_{2} \ \ , \ \ -2R_{1} + R_{3}
$$

$$
\begin{align*}
x + y  + \ \ z &= 6 \\
y + 2z &= 2 \\
y + 2z &= 1
\end{align*}
$$

Solving:

$$
-R_{2} + R_{3}
$$

$$
\begin{align*}
x + y + \ \ z &= \ \ \ 6 \\
y + 2z &= \ \ \ 2 \\
0 &= -1
\end{align*}
$$

Now you might notice that this is an **impossible solution**, and therefore this system of equations **cannot be solved.**

---

## General Strategy

We want to be able to easily determine if a system of equations is impossible long before we go through all the effort of solving it just to realize we can't. How can we do this?

$$
SYSTEM \rightarrow Echelon \ System
$$

|      | SOME        | NONE               |
| ---- | ----------- | ------------------ |
| SOME | No solution | $\infty$ solutions |
| NONE | No solution | $1$ solution       |