---
id: Chaos Hw 5
created_on: "[[02-17-2026]]"
aliases: []
tags: []
abstract: "Instructions: Graduate students (required) and those planning to go to graduate school in a mathematical science (encouraged) should turn in their solutions in LATEX; you will need to learn this language eventually. Submit your solution in a single PDF in Blackboard, including PDF of your code appended to solutions. Check Teams for sample code. Grading: All questions are worth 3 points unless marked otherwise (3 = perfect or nearly so, 2 = close but something missing, 1 = not close but a reasonable attempt, 0 = way off). Excellent solutions will be returned with the graded HW.Disclosure: Please show all your working clearly and list the names of other students with whom you collaborated."
author:
  - Ewan Pedersen
date: 2026-02-17T10:19:00
jupyter:
  jupytext:
    cell_metadata_filter: "-all"
    formats: ipynb,md
    text_representation:
      extension: .md
      format_name: markdown
      format_version: "1.3"
      jupytext_version: "1.18.1"
  kernelspec:
    display_name: Python 3
    language: python
    name: python3
title: Assignment 5
updated: 2026-02-17T17:42:16-05:00
---

## Problem 1

> [!Question]
> Let $f : \mathbb{R} \to \mathbb{R}$ be a continuous, differentiable map. Assume $0$ is a sink and $(-1, 1)$ is the largest interval that lies entirely inside the basin of $0$. The points $1$ and $-1$ are not in the basin of $0$.
>
> (a) What are the possible trajectories of the points $-1$ and $1$?
>
> (b) What are the possible Lyapunov numbers for each of $-1$, $0$, $1$?

### A

> [!Success] Answer

### B

> [!Success] Answer

---

## Problem 2

> [!Question]
> Show that if the Lyapunov number of the orbit of $x_0$ under $f$ is $L$, then the Lyapunov number of the orbit of $x_0$ under $f^k$ is $L^k$, whether or not $x_0$ is periodic. Note that if the orbit of $x_0$ under $f$ is $\{x_0, x_1, x_2, \ldots\}$ then the orbit under $f^k$ is $\{x_0, x_k, x_{2k}, x_{3k}, \ldots\}$.

> [!Success] Answer

---

## Problem 3

> [!Question]
> Begin by sketching $g(x) = 2.5x(1-x)$ and considering cobweb plots of typical orbits.
>
> (a) What are the possible bounded asymptotic behaviors for all $x \in \mathbb{R}$?
>
> (b) Find the Lyapunov exponent shared by most bounded orbits of $g(x)$.
>
> (c) Do all bounded orbits have the same Lyapunov exponent?

### A

> [!Success] Answer

### B

> [!Success] Answer

### C

> [!Success] Answer

---

## Problem 4

> [!Question]
> Begin by sketching $g(x) = 2 - x^2$ and considering cobweb plots of typical orbits.
>
> (a) Find a conjugacy $C$ between $G(x) = 4x(1-x)$ and $g$.
>
> (b) Use the conjugacy to find the fixed points and period-2 orbits of $g$ (if they exist) and determine their stability.
>
> (c) Show that $g$ has chaotic orbits.

### A

> [!Success] Answer

### B

> [!Success] Answer

### C

> [!Success] Answer

---

## Problem 5

> [!Question]
> (a) Write a program to draw the bifurcation diagram for the logistic map $g_a(x) = ax(1-x)$ for $a \in [2, 4]$ in increments of $0.001$. Iterate $1000$ times from a random $x_0 \in (0,1)$. Plot the bifurcation diagram.
>
> (b) Use iterates 101 to 1000 to approximate the Lyapunov exponent for each $a$. Graph $\lambda$ vs $a$ with a horizontal line at $0$.
>
> (c) What do you learn from comparing the two pictures?
>
> (d) Why does the Lyapunov exponent appear to bounce off zero several times before becoming positive?
>
> (e) Will a new random $x_0$ produce the same figure? Why or why not?

### C

### D

### E

### Code

### Figures
