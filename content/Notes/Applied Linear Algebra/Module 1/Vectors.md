---
title: Vectors
date: 2025-01-27
updated: 2025-01-27
tags:
  - math
  - linear-algebra
---

Let us note that everything we have looked at about Vectors thus far dont apply as well to Linear Algebra. We will be examining the "new" way of thinking about these constructs.

---

## Vector Notation

We would normally use standard Algebraic notation, but when we are working vectors, we use something called **bold** notation. You might be familiar with this from Discrete Math, where we represented all real integers with the symbol $\mathbb{R}$. This "font" is what we consider **bold** in mathematics, and will be using that for such vector notation.

$$
\mathbb{R}^n
$$

In this case, this means the vector $\mathbb{R}$ with $n$ components.

You are probably used to writing vectors like such:

$$
(3,7,1), \ \ \ \langle 3,7,1 \rangle, \ \ \ or \ \ \ [3,7,1]
$$

While we are allowed to use this for sake of ease of use, just know that this is **WRONG!!!**

*Vectors* are columns, and thus we should represent them as such:

$$
\begin{bmatrix}
3 \\
7 \\
1 
\end{bmatrix}, \ \ \ \begin{pmatrix}
3 \\
7 \\
1
\end{pmatrix}, \ or \ \ \ \begin{vmatrix}
3 \\
7 \\
1
\end{vmatrix}
$$

This is the preferred notation.

>[!Warning] Important
> $\mathbb{R}^n$ space of $n$-tall vectors

---

## The Zero Vector

Let's introduce the zero vector:

$$
Zero \ Vector \ \vec{0} = \begin{bmatrix}
0 \\
0 \\
\vdots \\
0
\end{bmatrix}
$$

Essentially, just a vector of some number of 0's.

---

## Vector Operations

> [!Abstract] Definitions
> 
> Lets say we have two vectors $\vec{x}$ and $\vec{y}$:
>
> $$
> \vec{x} = \begin{bmatrix}
> x_{1} \\
> x_{2} \\
> \vdots \\
> x_{n}
> \end{bmatrix} \ \ \ \ \vec{y} = \begin{bmatrix}
> y_{1} \\
> y_{2} \\
> \vdots \\
> y_{n}
> \end{bmatrix}
> $$

We can **add** the vectors by performing the following:

$$
\vec{x} + \vec{y} = \begin{bmatrix}
x_{1}+y_{1} \\
x_{2}+y_{2} \\
\vdots \\
x_{n} + y_{n}
\end{bmatrix}
$$

We can perform **scalar multiplication** of vectors if $x_{n}$ is as defined above, and $S$ is a real number. Then:

$$
S\cdot \vec{x} = \begin{bmatrix}
Sx_{1} \\
Sx_{2} \\
\vdots  \\
Sx_{n}
\end{bmatrix}
$$

---

What about if we have something like....

$$
\vec{0} + (3,1,5)
$$

what do we do?

is it:

$$
= \begin{pmatrix}
3 \\
1 \\
5
\end{pmatrix}
$$

Yes, actually.

**Another Example**, which is actually just as simple.

$$
(3,2,1) + \begin{pmatrix}
1 \\
5 \\
2 
\end{pmatrix} = \begin{pmatrix}
4 \\
7 \\
3
\end{pmatrix}
$$

> [!Danger] Invalid Example
> These ones you **cannot** do:
>
> $$
> (5,3,1) + (7,4,1,8) = Invalid
> $$
>
> $$
> 7 + (5,3,1) = Invalid
> $$
>
>$$
>[3 \ 2 \ 1] + \begin{bmatrix}
>5 \\
>1 \\
>4
>\end{bmatrix} = Invalid
>$$

The last one is **invalid** because you are trying to add a $1\times 3$ matrix to a $3 \times 1$ matrix. 

This cannot be done, a quick way to tell the difference is if there are no commas on the "flat" one.

And now, for the star of the show....

---

## LINEAR COMBINATION!!!

The linear combination is a fairly simple concept. It is *any* kind of operation that you can do using **just** scalar and vector multiplication.

It follows something of the form:

$$
s_{1}\vec{x}_{1} + s_{2}\vec{x}_{2}+s_{3}\vec{x}_{3} + \dots + s_{n}\vec{x}_{n}
$$

> [!Example] What is this?
>
> $$
> 5x^2 - 3x + 5
> $$

This is a **Linear Combination** of $x_{2}, x, 1$

>[!Example] What about?
>
> $$
> 5\cos(x) - 3e^x + 5 \tan(x)
> $$

This is also a **linear combination** of $\cos (x), e^x, \tan(x)$.

Just for example let's take the derivative of this linear combination:

$$
\frac{d}{dx} \left[ 5\cos(x) - 3e^x + 5 \tan(x)  \right]
$$

You might find it interesting that this **ALSO** is a linear combination:

$$
=-5\sin(x)-3e^x+5\sec^2(x)
$$

---

## Linear Span

Given vectors $\vec{x}_{1},\vec{x}_{2}, \dots, \vec{x}_{n}$ , the linear span of these vectors is the collection of *all possible* linear combinations:

$$
s_{1} \vec{x}_{1} + s_{2}\vec{x}_{2} + \dots + s_{n}\vec{x}_{n}
$$