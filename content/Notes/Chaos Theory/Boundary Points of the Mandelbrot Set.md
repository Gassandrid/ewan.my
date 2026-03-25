---
class:
  - note
created_on: "[[03-24-2026]]"
tags:
source:
related:
author:
description:
aliases:
date: 2026-03-24T10:24:50-04:00
updated: 2026-03-24T14:53:15-04:00
---

Every attracting orbit for a polynomial map $P$ attracts at least one critical point $(f'=0)$, [[Fatou's Lemma]]

Since $P_{C}(z)$has only one critical point, and $P_{-i}(0)$ is [[Eventually Periodic]] and a [[Periodic Orbit Stability|periodic]] [[Repelling fixed point|Source]], there can be no sink for $c=-i$.

The boundary between bounded and unbounded points is the [[Julia Set]]. The **filled [[Julia Set]]** is $J$ and points in its interior. For disconnected $J$, the filled [[Julia Set]] is simply J,

- $J$ is invariant. If $z_{0} \in J$, so is $f(z_{0})=z$,...
- orbits in $J$ are either periodic [[Repelling fixed point|Source]]s, [[Eventually Periodic]] to periodic sources, or chaotic.
- all [[Unstable Manifold|unstable]] [[Periodic Orbit Stability|periodic orbits]] of $P_{C}$ are in $J$
- 	$J$ is either totally connected or totally disconnected

---

## Fractal Dimension

Measuring the dimension of a linUe

In general, the number of boxes of size $\epsilon$, call # $\mathbb{N}(\epsilon)$, required to cover an interval is less than or equal to $\frac{c}{\epsilon'}$, where $c$ is a constant analogous to length. In other words, $\mathbb{N}(\epsilon)$ scales as $\frac{1}{\epsilon}$

More generally, a set $S \subseteq \mathbb{R}^{m}$ is said to be d-dimensional, if it can be covered by $\mathbb{N}(\epsilon)= \frac{c}{\epsilon^{d}}$ boxes of side length $\epsilon$ in the limit as $\epsilon \to 0$..o

$C$ can be as large as needed, provided the $\epsilon^{-d}$ scaling holds as $\epsilon \to 0$. $d$ need not be an integer.

$$
d = \frac{\ln(\mathbb{N}(\epsilon))-\ln C}{\ln\left( \frac{1}{\epsilon} \right)}
$$

A bounded set $S$ in $\mathbb{R}^{n}$ has **box-counting dimension**:

$$
= \lim_{ \epsilon \to 0 } \frac{\ln(\mathbb{N}(\epsilon))}{\ln\left( \frac{1}{\epsilon} \right)}
$$
