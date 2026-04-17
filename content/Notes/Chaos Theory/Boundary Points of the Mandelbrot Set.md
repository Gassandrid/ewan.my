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
  - box counting
date: 2026-03-24T10:24:50-04:00
updated: 2026-03-26T11:18:15-04:00
---

Every attracting orbit for a polynomial map $P$ attracts at least one critical point $(f'=0)$, [[Fatou's Lemma]]

Since $P_{C}(z)$has only one critical point, and $P_{-i}(0)$ is [[Eventually Periodic]] and a [[Periodic Orbit Stability|periodic]] [[Repelling fixed point|Source]], there can be no sink for $c=-i$.

The boundary between bounded and unbounded points is the [[Julia Set]]. The **filled [[Julia Set]]** is $J$ and points in its interior. For disconnected $J$, the filled [[Julia Set]] is simply J,

- $J$ is invariant. If $z_{0} \in J$, so is $f(z_{0})=z$,...
- orbits in $J$ are either periodic [[Repelling fixed point|Source]]s, [[Eventually Periodic]] to periodic sources, or chaotic.
- all [[Unstable Manifold|unstable]] [[Periodic Orbit Stability|periodic orbits]] of $P_{C}$ are in $J$
- $J$ is either totally connected or totally disconnected

---

## Fractal Dimension

![[boxCountingDimension.png]]

measuring the dimension of a line: the number of boxes of size $\epsilon$ needed to cover an interval scales as $\frac{1}{\epsilon}$, i.e. $\mathbb{N}(\epsilon) \leq \frac{c}{\epsilon}$ for some constant $c$ analogous to length.

more generally, a set $S \subseteq \mathbb{R}^{m}$ is d-dimensional if it can be covered by $\mathbb{N}(\epsilon) = \frac{c}{\epsilon^d}$ boxes of side length $\epsilon$ as $\epsilon \to 0$. $c$ can be as large as needed, $d$ need not be an integer.

solving for $d$:

$$
d = \frac{\ln(\mathbb{N}(\epsilon)) - \ln C}{\ln\left( \frac{1}{\epsilon} \right)}
$$

taking the limit $\epsilon \to 0$ washes out $C$, so the **box-counting dimension** of a bounded set $S \subseteq \mathbb{R}^n$ is:

$$
d = \lim_{ \epsilon \to 0 } \frac{\ln(N(\epsilon))}{\ln\left( \frac{1}{\epsilon} \right)}
$$

The *slope* of this plot is the box counting dimension.

![[Screenshot 2026-03-26 at 10.23.04 AM.png]]

> **Figure 4.16 Box-counting dimension of the H´enon attractor.**
> A graphical report of the results of the box counts in Figures 4.13 and 4.15. The box- counting dimension is the limit of $\frac{\log_{2} N(\epsilon)}{\log_{2}\left( \frac{1}{\epsilon} \right)}$. The dimension corresponds to the limiting slope of the line shown, as $\epsilon\to 0$, which is toward the right in this graph. The line shown has slope $\approx 1.27$.

---

To make the Box Counting Dimension easier to use, we will make these simplifications:

1. the limit $\epsilon \to 0$ need only be checked at discerete box sizes, provided sequences goes to $0$
2. boces need not sit on a grid, they can be moved around, rotated, take minimum number of boxes of size $\epsilon$ required to cover the set
3. sets other than boxes ( e.g., discs, triangles, etc), will be fine.

## Computing the Box counting Dimension

>[!Example] 
> $K_{\infty} \subseteq$ 

$$
BCD(K_{\infty}) = \lim_{ n \to \infty } \left( \frac{\ln 2^n}{\ln} \right)
$$

Note that the slope of the fit would be the same in any base

---

In $\mathbb{R}^n$ there are $\epsilon^{-n}$ boxes in the unit cube. So for example in 10 dimensions, using boxes of size $\epsilon=0.01$, there are $10^{20}$ boxes to check. So we need other methods too. 

**To come:**

- [[Correlation Dimension]]
- [[Lyapunov Dimension]]

>[!Abstract] Theorem
> Let $A$ be a bounded subset of $\mathbb{R}^{m}$ with $BCD(A)=d<m$. Then $A$ is a [[Dimensionality of Fractals#Measure|measure zero]] set

> [[Hénon Map]] has dimesion 1.27, thus is measure zero because it is less than its own coordinate dimension of 2.

**Proof:**

$$
d = \lim_{ \epsilon \to 0 } \frac{\ln N(\epsilon)}{\ln\left( \frac{1}{\epsilon} \right)} = \lim_{ \epsilon \to 0 }  - \frac{\ln N}{\ln \epsilon}
$$

where $m-d > 0$, so

$$
\lim_{ \epsilon \to 0 } \frac{m \ln \epsilon + \ln N}{\ln \epsilon}>0
$$

$$
\lim_{ \epsilon \to 0 } \frac{\ln(\epsilon^{m}N)}{\ln \epsilon}> 0
$$

where $\lim_{ \epsilon \to 0 } \ln \epsilon = -\infty$, means:

$$
\lim_{ \epsilon \to 0 } \ln (\epsilon^{m}N) = -\infty
$$

because anything else would imply $m-d >0$ as $\epsilon \to 0$.
