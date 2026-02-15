---
id: Homogeneous Systems
created_on: "[[01-29-2025]]"
aliases: 
tags:
  - "#math/linear-algebra"
date: 2025-01-29
title: Homogeneous Systems
updated: 2025-04-02
---
Homogeneous systems are systems of linear equations where the right-hand side of the equations are all zero. This note will cover the basics of homogeneous systems and how to solve them.

---

## Introduction

Let's look at an example of what we might call a "Homogeneous System":

$$
\begin{align*}
x_{1} + \ \ x_{3} -\ \ x_{5} &= 0 \\
x_{2} - 2x_{3} + 2x_{5} &= 0 \\
x_{4} - 3x_{5} &= 0
\end{align*}
$$

What do we notice about this system?

- **Homogeneous Reduced Echelon**
- 3 "lead" variables
- 2 "face" variables
- consistent - $\infty$ many solutions

### General Solution

Lets assemble a vector for this system:

$$
\begin{pmatrix}
z-w \\
-2z+2w \\
0z+w \\
3z+0w \\
z + 0w
\end{pmatrix}
$$

We add "0w"/"0z" instead of just nothing to show what you don't see - this makes the next step a little easier.

What we are going to to is split up this vector into **two separate vectors** for each variable:

$$
\begin{pmatrix}
z-w \\
-2z+2w \\
0z+w \\
3z+0w \\
z + 0w
\end{pmatrix} = z \begin{pmatrix}
1 \\
-2 \\
0 \\
3 \\
1
\end{pmatrix} + w \begin{pmatrix}
-1 \\
2 \\
1 \\
0 \\
0
\end{pmatrix}
$$

This is a [[Notes/Linear Algebra/Module 1/Vectors#LINEAR COMBINATION!!!|Linear Combination]] that we discussed last class! It is the combination of the different dimensions of this vector.

This gives us a [[Notes/Linear Algebra/Module 1/Vectors#Linear Span|Linear Span]] of:

$$
\begin{pmatrix}
1 \\
-2 \\
0 \\
3 \\
1
\end{pmatrix} , \begin{pmatrix}
-1 \\
2 \\
1 \\
0 \\
0
\end{pmatrix}
$$

These **two vectors** are the **BASIC SOLUTIONS** of the system. 

While not a full solution, this is an important thing to be able to find - MATLAB can do the rest.

---

## Superposition Principle

Given a homogeneous system of linear equations:

1. $\vec{0}$ is a solution ( trivial solution )
2. If $\vec{x}$ is a solution then so is $t\vec{x}$ for any scalar $t$
3. If $\vec{x},\vec{y}$ are solutions, then so is $\vec{x} + \vec{y}$
4. If $\vec{x},\vec{y}$ are solutions then so is $t\vec{x} + s\vec{y}$ for any scalar $t,s$

**Essentially:**

If $\vec{x}_{1}, \dots, \vec{x}_{n}$ are solutions, then so is $t_{1}\vec{x}_{1},\dots,t_{n}\vec{x}_{n}$ for any scalar $t_{n}$
