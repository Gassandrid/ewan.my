---
class:
  - note
  - lecture
tags:
  - university
  - math/chaos
course: "[[Chaos, Fractals, and Dynamical Systems]]"
lecture-number: 10
source:
related:
  - "[[Logistic Map]]"
author:
description:
aliases:
date: 2026-02-19T10:14:51-05:00
updated: 2026-02-20T10:05:43-05:00
---

If we want to show that $G(x)=4x(1-x)$ has chaotic orbits, we will do it by comparing with $T(x)$ ( our [[Tent Map]] ).

For each point in the [[Tent Map]] domain $\{ 0,1 \}$, there is a *companion point* $C(x)$ in the domain of $G$ that imitates its dynamics.

We say the maps $f$ and $g$ are **conjugate** if they are related by a continuous one to one change of coordinates.

![[Screenshot 2026-02-19 at 10.51.04 AM.png]]

```tikz
\usepackage{tikz-cd}
\begin{document}
\begin{tikzcd}[row sep=3em, column sep=4em]
  {[0,1]} \arrow[r, "T"] \arrow[d, "C"'] & {[0,1]} \arrow[d, "C"] \\
  {[0,1]} \arrow[r, "G"']                 & {[0,1]}
\end{tikzcd}
\end{document}
```

>[!Example]
>
>$$
>C \circ f = g \circ C
>$$
>
> or 
>
> $$
> \begin{align*}
> \underbrace{ C^{-1} \circ C }_{ \text{annialates} } \circ f &= C^{-1} \circ g \circ C \\
> f &= C^{-1} \circ g \circ C
> \end{align*}
> $$

The maps $G$ and $T$ are conjugate by:

$$
C(x) =\frac{(1-\cos(\pi x))}2 \quad \text{1 to 1, continuous}
$$

and:

$$
C(T(x)) = G(C(x))
$$

For $0 \leq x \leq \frac{1}{2}$:

$$
\begin{align*}
G(C(x)) &= 4C(x)(1-C(x)) \\
&= 4\left( \frac{1-\cos \pi x}{2} \right)\left( \frac{1+\cos \pi x}{2} \right) \\
&= (1-\cos^2 \pi x) \\
&= \sin ^{2} \pi x
\end{align*}
$$

$$
\underbrace{ \begin{align*}
C(T(x)) &= \frac{1-\cos(2\pi x)}{2}  \\
&= \sin ^{2}\pi x
\end{align*} }_{ \text{trig double } \angle \text{ identity!} }
$$

>[!Note] Idea
> Two ways of getting from domain of $G$ to range of $G$ after $n$ iterations:
>
> 1. Evaluate $G^{n}(x)$ directly — expensive, analytically intractable for large $n$
> 2. Use conjugacy: since $C \circ T = G \circ C$, induction gives $C \circ T^{n} = G^{n} \circ C$, so:
>
>    $$
>    G^{n}(x) = C\!\left(T^{n}\!\left(C^{-1}(x)\right)\right)
>    $$
>
>    Map $x$ into T's domain via $C^{-1}$, iterate the simpler tent map $n$ times, then map back. Orbit structure of $G$ is exactly that of $T$, just seen through the lens $C$.

Suppose $T(x)=x$ for a [[Fixed Point Classification|Fixed Point]] and $C'(x) \neq 0$ $\color{red}\left( x=\frac{2}{3} \right)$ then:

$$
\begin{align*}
C'(x) \cdot T'(x) &= G'(C(x)) C'(x)  \\
\Rightarrow T'(x) &= G'(C(x))
\end{align*}
$$

So stability of [[Fixed Point Classification|Fixed Point]] of $T$ and stability of [[Fixed Point Classification|Fixed Point]] $C(x)=\frac{3}{4}$, for $G$ are the same

---

## Transition Graphs

>[!Abstract]  Theorem (Covering implies fixed point)
> Let $f$ be a continuous map of $\mathbb{R}$ and let $I=\{ a,b \}$ be an interval such that:
>
> $$
>  f(I) \supseteq I
> $$
>
> ![[contMapIAandB.png]]
>
> Then $f$ has a [[Fixed Point Classification|Fixed Point]] in $I$.

The blue line in the figure is the counterexample — a function where $f(I) \not\supseteq I$, so IVT doesn't force a fixed point.

In [[topology]], the general version is [[Brouwers Fixed Point Theorem]].

---

### Setup

A **partition** of the interval is a collection of subintervals that are pairwise disjoint (except at endpoints) whose union is the whole interval.

For both $G$ and $T$, the natural partition is $\{L, R\}$:

$$
L = \left[0, \tfrac{1}{2}\right], \quad R = \left[\tfrac{1}{2}, 1\right]
$$

**Definition:** Draw an arrow $A \to B$ in the transition graph if and only if $f(A) \supseteq B$ — "$f$ of $A$ covers $B$".

The covering condition matters because: if $f(A) \supseteq B$, then by the [[Intermediate Value Theorem]] there exists a point in $A$ that maps into $B$. Covering arrows are existence guarantees for orbits.

---

### Computing the Graph for $T$

The [[Tent Map]] $T$ with $\mu = 2$:

- $T(L) = T\!\left(\left[0, \tfrac{1}{2}\right]\right) = [0, 1] \supseteq L$ and $\supseteq R \quad\Rightarrow\quad L \to L,\; L \to R$
- $T(R) = T\!\left(\left[\tfrac{1}{2}, 1\right]\right) = [0, 1] \supseteq L$ and $\supseteq R \quad\Rightarrow\quad R \to L,\; R \to R$

All four arrows exist. The Tent Map transition graph is **completely connected**.

```tikz
\usepackage{tikz}
\usetikzlibrary{positioning, arrows.meta}
\begin{document}
\begin{tikzpicture}[
  box/.style={draw, circle, minimum size=1.2cm, font=\large, thick},
  ->, >=Stealth, semithick, bend angle=25
]
  \node[box] (L) {$L$};
  \node[box, right=3cm of L] (R) {$R$};
  \draw (L) edge[loop above, looseness=6] (L);
  \draw (L) edge[bend left] (R);
  \draw (R) edge[bend left] (L);
  \draw (R) edge[loop above, looseness=6] (R);
\end{tikzpicture}
\end{document}
```

By conjugacy, $G = 4x(1-x)$ has the same graph — $G$ also maps both $L$ and $R$ surjectively onto $[0,1]$.

---

A **path of length $n$** in the graph is a sequence $A_0 \to A_1 \to \cdots \to A_n$ where each arrow is a valid transition. This corresponds to an **admissible itinerary**; there genuinely exists a point $x \in A_0$ whose orbit visits $A_1, A_2, \ldots, A_n$ in order.

**Consequence of complete connectivity:** Every infinite sequence over $\{L, R\}$ is admissible. That's an uncountable family of distinct symbolic trajectories, each encoding a genuinely different orbit.

**Periodic orbits from cycles:** A cycle of length $k$ in the graph (e.g. $L \to R \to L \to R \to \cdots$ returning to $L$) guarantees a period-$k$ orbit exists in that sequence of intervals. Since all arrows exist, cycles of every length exist → infinitely many periodic orbits.

---
