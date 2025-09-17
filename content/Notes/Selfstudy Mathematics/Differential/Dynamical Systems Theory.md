---
class:
  - note
tags:
  - math/calculus/differential
source:
  - "[[Chaos Theory the language of (in)stability]]"
related:
author:
date: 2025-09-12
updated: 2025-09-14
aliases:
  - Chaos Theory
---

**Dynamical Systems Theory** is the study of systems that evolve over time according to a set of rules. It is a branch of mathematics that deals with the behavior of complex systems and how they change over time.

![[LorenzAtt.png]]

---

While Differential equations are at the heart of **Dynamical Systems Theory**, the field encompasses a broader range of concepts and tools.

One example would be the interest in high dimensional _manifolds_ and their properties, which can be studied using techniques from topology and geometry.

For [[Computational Neuroscience]], Dynamical Systems Theory is particularly relevant because it provides a framework for understanding how neural systems evolve over time and how they respond to external stimuli. And, at least for [[Grid Cells]], they can be mapped to manifolds like a Torus.

![[Pasted image 20250912133313.png]]

These kind of manfiold embeddings only emerge because we have paired many different state variables as dimensions in a high dimensional space. This is a common technique in Dynamical Systems Theory, where we often study the behavior of systems in high-dimensional spaces. Then, we can get a visual understanding of the system's behavior by projecting it onto a lower-dimensional space using techniques like [[UMAP]].

---

## Semantic Shorthands

Because Differential Equations for **Dynamical Systems** are almost always stepping with respect to time, we use newtonian shorthand of $\dot{x}$, assuming that we are taking the derivative of $x$ with respect to $t$:

$$
\underbrace{ \begin{align*}
\frac{dx}{dt} &= -y - 0.1x \\
\frac{dy}{dt} &= x - 0.4y
\end{align*} }_{ \text{Leibniz Notation} }
$$

**Becomes**:

$$
\underbrace{ \begin{align*}
\dot{x} &= -y - 0.1 x \\
\dot{y} &= x - 0.4y\\
\end{align*} }_{ \text{Newton Notation} }
$$

These are called **Autonomous Differential Equations**

$$
\begin{align}
\frac{dx}{dt}=-y-0.1x \\
\frac{dy}{dt}=x-0.4y
\end{align}
$$

---

## Attractors
