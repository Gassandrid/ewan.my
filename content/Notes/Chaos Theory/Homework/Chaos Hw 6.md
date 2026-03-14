---
id: Chaos Hw 6
created_on: "[[02-26-2026]]"
aliases: []
tags: []
abstract: "Instructions: Graduate students (required) and those planning to go to graduate school in a mathematical science (encouraged) should turn in their solutions in LATEX; you will need to learn this language eventually. Submit your solution in a single PDF in Blackboard, including PDF of your code appended to solutions. Check Teams for sample code. Grading: All questions are worth 3 points unless marked otherwise (3 = perfect or nearly so, 2 = close but something missing, 1 = not close but a reasonable attempt, 0 = way off). Excellent solutions will be returned with the graded HW.Disclosure: Please show all your working clearly and list the names of other students with whom you collaborated."
author:
  - Ewan Pedersen
title: Assignment 6
jupyter:
  jupytext:
    cell_metadata_filter: -all
    formats: ipynb,md
    text_representation:
      extension: .md
      format_name: markdown
      format_version: "1.3"
      jupytext_version: 1.18.1
  kernelspec:
    display_name: Python 3
    language: python
    name: python3
date: 2026-02-26T09:13:08-05:00
updated: 2026-03-13T15:15:20-07:00
class:
  - export
---

## Problem 1

> [!Question]
> Let $G$ be the logistic map $G(x) = 4x(1-x)$ on $[0,1]$ and define the conjugacy to be the change of coordinates $C(x) = ax + b$. Find the map $g$ that is conjugate to $G$.

conjugacy $g = C \circ G \circ C^{-1}$. same setup as [[Chaos Hw 5#A 3|HW5 Problem 4]] but now general $a, b$.

$C^{-1}(x) = \frac{x - b}{a}$, so:

$$
g(x) = C\left(G\left(C^{-1}(x)\right)\right) = a \cdot 4 \cdot \frac{x-b}{a}\left(1 - \frac{x-b}{a}\right) + b
$$

$$
= 4(x - b) \cdot \frac{a - (x - b)}{a} + b = \frac{4(x-b)(a + b - x)}{a} + b
$$

expanding if you want a polynomial form:

$$
g(x) = -\frac{4}{a}x^2 + \frac{4(a + 2b)}{a}x - \frac{4b(a+b)}{a} + b
$$

sanity check: $C(x) = 4x - 2$ (i.e. $a = 4, b = -2$) should give $g(x) = 2 - x^2$ like hw5:

$$
g(x) = \frac{4}{4}(x+2)(2-x) - 2 = (x+2)(2-x) - 2 = -x^2 + 4 - 2 = 2 - x^2 \quad \checkmark
$$

note $C$ maps $[0,1] \to [b,\; a+b]$, so $g$ acts on $[b, a+b]$.

> [!Success] Answer
>
> $$
> g(x) = \frac{4(x-b)(a + b - x)}{a} + b
> $$

---

## Problem 2

> [!Question]
> Explain why each infinite itinerary of the tent map $T$ represents the orbit of exactly one point in $[0, 1]$.

[[Tent Map]]: 

$$
T(x) = \begin{cases}
\mu x & for \ 0 \leq x \leq \frac{1}{2} \\
\mu(1-x) & for \ \frac{1}{2} \leq x \leq 1
\end{cases}
$$

where $\mu=2$, piecewise linear, slope $\pm 2$.

itinerary of $x$: $S_0 S_1 S_2 \ldots$ where $S_i = L$ if $T^i(x) \in [0, 1/2]$, $S_i = R$ if $T^i(x) \in [1/2, 1]$.

given infinite itinerary $S_0 S_1 S_2 \ldots$ we define $I_{S_0 \ldots S_{n-1}}$ as set of all $x \in [0,1]$ whose first $n$ symbols match. claim: this is a closed interval of length $1/2^n$.

induction for int length -  base: $I_L = [0, 1/2]$, $I_R = [1/2, 1]$, both length $1/2$.

induction step: suppose $I_{S_0 \ldots S_{n-1}}$ has length $1/2^n$. next symbol $S_n$ requires $T^n(x) \in L$ or $R$. since $T$ has slope $\pm 2$ on each half, restrincting $T$ to $L$ or $R$ maps an interval of length $\ell$ onto one of length $2\ell$. equivalently, preimage of any interval under $T|_L$ or $T|_R$ has half length. so specifying $S_n$ halves $I_{S_0 \ldots S_{n-1}}$:

$$
|I_{S_0 \ldots S_n}| = \frac{1}{2}|I_{S_0 \ldots S_{n-1}}| = \frac{1}{2^{n+1}}
$$

existence. nested closed intervals: $I_{S_0} \supset I_{S_0 S_1} \supset I_{S_0 S_1 S_2} \supset \cdots$. each is nonempty and compact. by the nested interval theorem, $\bigcap_{n=1}^{\infty} I_{S_0 \ldots S_{n-1}} \neq \varnothing$.

uniqueness. diameter $|I_{S_0 \ldots S_{n-1}}| = 1/2^n \to 0$. so intersection contains exactly one point.

> [!Success] Answer
> each symbol in itinerary selects one of $T$'s two branches, halves candidate interval. after $n$ symbols, point confined to closed interval length $1/2^n$. nested interval theorem shows existence; diameter shirnking yeilds uniqueness. thus every infinite itinerary $S_0 S_1 S_2 \ldots$ finds exactly one $x \in [0, 1]$.

---

## Problem 3

> [!Question]
> (a) Find a scheme to provide for any positive integer $n$, a sequence $S_1 \ldots S_{n+1}$ of the symbols $L$ and $R$ such that $S_1 = S_{n+1}$, and such that the sequence $S_1 \ldots S_n$ is not the juxtaposition of identical subsequences of shorter length. For example, the sequence $LRLRL$ does NOT guarantee the existence of a period-4 orbit; the sequence $LRRLL$ does.
>
> (b) Prove that the logistic map $G$ has a periodic orbit for each integer period.

### A

need: for any $n \geq 1$, a sequence $S_1 \ldots S_{n+1}$ with $S_1 = S_{n+1}$ and $S_1 \ldots S_n$ not juxtaposition of identical short blocks.

scheme: $S_1 \ldots S_n = L R^{n-1}$, with $S_{n+1} = L = S_1$.

examples:

 $n = 1$: $LL$ (fixed point in $L$)

 $n = 2$: $LRL$

 $n = 3$: $LRRL$

 $n = 4$: $LRRRL$

proof nonrepeating: suppose $S_1 \ldots S_n = LR^{n-1}$ is a repetition of a block of length $d$, where $d | n$ and $d < n$. then $S_1 = S_{1+d}$. but $S_1 = L$ and $S_{1+d} = R$ (since $1 + d \geq 2$ and all positions $2$ through $n$ are $R$). contradiction.

> [!Success] Answer
> $S_1 \ldots S_n = LR^{n-1}$, $S_{n+1} = L$. single $L$ at position 1 breaks any possible repetition, since all other positions are $R$.

### B

re-proving [[Chaos Hw 4#Problem 1|HW4 Problem 1]], now via symbolic dynamics.

$G$ maps $L = [0, 1/2]$ and $R = [1/2, 1]$ each onto $[0, 1]$ (monotonically). so the transition graph is complete: $L \to L$, $L \to R$, $R \to L$, $R \to R$. every itinerary is realized.

for any itinerary $S_1 \ldots S_n$, define $I_{S_1 \ldots S_k}$ as the set of $x \in I_{S_1}$ with $G^{j-1}(x) \in I_{S_j}$ for $j = 1, \ldots, k$. since $G|_L$ and $G|_R$ are monotone bijections onto $[0,1]$, each $I_{S_1 \ldots S_k}$ is a closed interval.

**importantly to our goal,** $G^n$ maps $I_{S_1 \ldots S_n}$ onto $[0,1]$.

proof by induction. $G$ maps $I_{S_1}$ onto $[0,1]$. $G$ maps $I_{S_1 \ldots S_n}$ onto $I_{S_2 \ldots S_n}$ (shift the itinerary). so $G^n$ maps $I_{S_1 \ldots S_n}$ to $G^{n-1}(I_{S_2 \ldots S_n})$. by inductive hypothesis, $G^{n-1}$ maps $I_{S_2 \ldots S_n}$ onto $[0,1]$. done.

now take the itinerary $LR^{n-1}$ from part (a). $G^n$ maps the closed interval $I_{LR^{n-1}}$ continuously onto $[0, 1] \supset I_{LR^{n-1}}$. by IVT, $G^n$ has a fixed point $x^* \in I_{LR^{n-1}}$.

$x^*$ has period exactly $n$: its itinerary repeats $LR^{n-1}$ cyclically. if the true period were $d | n$ with $d < n$, the itinerary would repeat with period $d$, making $LR^{n-1}$ a juxtaposition of length-$d$ blocks. part (a) rules this out.

> [!Success] Answer
> for each $n$, the itinerary $LR^{n-1}$ from part (a) determines a closed interval $I_{LR^{n-1}}$ that $G^n$ maps onto $[0,1]$. IVT gives a fixed point of $G^n$. primitivity of the itinerary guarantees exact period $n$.

---

## Problem 4

> [!Question]
> Consider the period-three map of chapter 1, shown in figure 1.14.
>
> (a) Find itineraries that obey the transition graph of the period-three map for any period, which are not periodic for any lower period.
>
> (b) Prove that this period-three map has periodic orbits for each positive integer period.
>
> (c) Why does period-3 imply chaos?

### A

period-3 orbit $a < b < c$ with $f(a) = b$, $f(b) = c$, $f(c) = a$. intervals $I = [a, b]$, $J = [b, c]$.

[[Conjugacy and the Logistic Map#Transition Graphs|transition graph]]: $f(I) \supseteq [b,c] = J$ (by IVT, since $f(a) = b$, $f(b) = c$). $f(J) \supseteq [a,c] = I \cup J$ (since $f(b) = c$, $f(c) = a$). so:

*graph made with tikz*

```tikz
\usepackage{tikz}
\usetikzlibrary{positioning, arrows.meta}
\begin{document}
\begin{tikzpicture}[
  box/.style={draw, circle, minimum size=1.2cm, font=\large, thick},
  ->, >=Stealth, semithick, bend angle=25
]
  \node[box] (I) {$I$};
  \node[box, right=3cm of I] (J) {$J$};
  \draw (I) edge[bend left] (J);
  \draw (J) edge[bend left] (I);
  \draw (J) edge[loop above, looseness=6] (J);
\end{tikzpicture}
\end{document}
```

constraint: from $I$, must go to $J$. from $J$, can go to $I$ or $J$. no $I \to I$ arrow.

scheme: for $n = 1$: $J$ (fixed point, $J \to J$). for $n \geq 2$: $IJ^{n-1}$.

check transitions: $I \to J$ works, $J \to J$ (middle positions) work, wrap $J \to I$ works.

primitivity: if $IJ^{n-1}$ were a repetition of blocks of length $d | n$, $d < n$, then $S_1 = S_{1+d}$. but $S_1 = I$ and $S_{1+d} = J$ for $d \geq 1$. contradiction.

> [!Success] Answer
> $n = 1$: $J$. $n \geq 2$: $IJ^{n-1}$ 

### B

sim structure to [[Chaos Hw 6#B 2|Problem 3(b)]], adapted to this transition graph.

for itinerary $S_1 \ldots S_n$ obeying the graph, define $I_{S_1 \ldots S_k}$ as the set of points in $I_{S_1}$ whose orbit follows $S_1, \ldots, S_k$. since $f$ maps each interval continuously onto a superset of the next, taking preimages gives nested closed intervals.

$f$ shifts the itinerary: $f(I_{S_1 \ldots S_n}) = I_{S_2 \ldots S_n}$. inductively, $f^{n-1}$ maps $I_{S_1 \ldots S_n}$ onto $I_{S_n}$.

so $f^n$ maps $I_{S_1 \ldots S_n}$ onto $f(I_{S_n})$. for our scheme, $S_n = J$ (for $n = 1$ it's $J$; for $n \geq 2$, last symbol is $J$). since $f(J) \supseteq I \cup J \supseteq I_{S_1} \supseteq I_{S_1 \ldots S_n}$:

$$
f^n(I_{S_1 \ldots S_n}) \supseteq I_{S_1 \ldots S_n}
$$

IVT gives a fixed point $x^*$ of $f^n$ in $I_{S_1 \ldots S_n}$. primitivity of the itinerary forces exact period $n$.

> [!Success] Answer
> for each $n$, the itinerary from part (a) determines a closed interval mapped over itself by $f^n$. IVT gives a period-$n$ point.

### C

the transition graph $J \to J$, $J \to I$, $I \to J$ supports:

1. periodic orbits for every period -  this alone follows from [[Sharkovskii's Theorem]]: period 3 sits first in the Sharkovskii ordering $3 \triangleright 5 \triangleright 7 \triangleright \cdots$, so period-3 implies all other periods.
2. uncountably many aperiodic orbits - any non-eventually-periodic sequence over $\{I, J\}$ obeying the transitions gives a distinct orbit 
3. [[Sensitive Dependence on Initial Conditions]] - two points with different itineraries must eventually land in different intervals ($I$ vs $J$), separated by at least $|b - a|$. nearby points generically have diverging itineraries.

> [!Success] Answer
> period-3 implies chaos because the transition graph forces all three Devaney criteria: dense periodic orbits (all periods exist), sensitive dependence (divergent itineraries), and an uncountable scrambled set of aperiodic orbits

---

## Problem 5

> [!Question]
> Define the piecewise map
>
> $$
> f(x) = \begin{cases} f_1 = 1 - 3x & 0 \leq x \leq 1/3 \\ f_2 = -1/3 + x & 1/3 \leq x \leq 1 \end{cases}
> $$
>
> Note that $x = 0$ is a period-4 point. Let $I = [0, 1/3]$, $J = [1/3, 2/3]$, $K = [2/3, 1]$.
>
> (a) Draw the transition graph.
>
> (b) Fill in the table below 
>
> | $k$ | Periodic Itinerary | Orbit |
> |-----|-------------------|-------|
> | 1 | $I$ | $\{a_1\}$ |
> | 2 | $IJ$ | $\{a_1, a_2\}$ |
> | 3 | | |
> | 4 | | |
> | 5 | | |
>
> For each periodic orbit of period $p < 6$. List the itinerary (in alphabetical order) and label the points of the orbit according to their magnitude $a_1 < a_2 < \cdots < a_p$.
>
> (c) Show that there is no period-4 orbit with the itinerary $IJIJ$.

### A

$f_1(x) = 1 - 3x$ on $I = [0, 1/3]$: $f_1(0) = 1$, $f_1(1/3) = 0$. so $f(I) = [0, 1] \supseteq I \cup J \cup K$.

$f_2(x) = -1/3 + x$ on $J = [1/3, 2/3]$: $f_2(1/3) = 0$, $f_2(2/3) = 1/3$. so $f(J) = [0, 1/3] = I$.

$f_2(x) = -1/3 + x$ on $K = [2/3, 1]$: $f_2(2/3) = 1/3$, $f_2(1) = 2/3$. so $f(K) = [1/3, 2/3] = J$.

*graph made with tikz*

```tikz
\usepackage{tikz}
\usetikzlibrary{positioning, arrows.meta}
\begin{document}
\begin{tikzpicture}[
  box/.style={draw, circle, minimum size=1.2cm, font=\large, thick},
  ->, >=Stealth, semithick, bend angle=20
]
  \node[box] (I) {$I$};
  \node[box, right=2.5cm of I] (J) {$J$};
  \node[box, right=2.5cm of J] (K) {$K$};
  \draw (I) edge[loop above, looseness=6] (I);
  \draw (I) edge[bend left] (J);
  \draw (I) edge[bend left=30] (K);
  \draw (J) edge[bend left] (I);
  \draw (K) edge[bend left] (J);
\end{tikzpicture}
\end{document}
```

> [!Success] Answer
> $I \to I, J, K$ (full coverage). $J \to I$ only. $K \to J$ only.

### B

transition graph: $J$ and $K$ have forced successors. only choice is at $I$: go to $I, J,$ or $K$. forced chain $K \to J \to I$ means $K$ and $J$ always resolve back to $I$.

for enumerating period-$p$ orbits, we list all valid cyclic itineraries of length $p$ and solve linear system for each. Since $f_1$ has slope $-3$ and $f_2$ has slope $1$, all compositions are linear and each valid system has a unique solution.

| $k$ | Periodic Itinerary | Orbit |
|:---:|:-------------------|:------|
| 1 | $I$ | $\{1/4\}$ |
| 2 | $IJ$ | $\{1/6, 1/2\}$ |
| 3 | $IIJ$ | $\{1/8, 7/24, 5/8\}$ |
| 3 | $IKJ$ | $\{1/12, 5/12, 3/4\}$ |
| 4 | $IIIJ$ | $\{1/7, 5/21, 2/7, 4/7\}$ |
| 4 | $IIKJ$ | $\{0, 1/3, 2/3, 1\}$ |
| 5 | $IIIIJ$ | $\{11/80, 19/80, 61/240, 23/80, 47/80\}$ |
| 5 | $IIIKJ$ | $\{1/28, 19/84, 9/28, 47/84, 25/28\}$ |
| 5 | $IIJIJ$ | $\{11/84, 5/28, 23/84, 13/28, 17/28\}$ |
| 5 | $IJIKJ$ | $\{1/24, 5/24, 3/8, 13/24, 7/8\}$ |

### C

itinerary $IJIJ$ means $I \to J \to I \to J$ repeating. solve the system:

$$
\begin{align}
x_2 &= 1 - 3x_1 \in J \\
x_3 &= -1/3 + x_2 = 2/3 - 3x_1 \in I \\
x_4 &= 1 - 3x_3 = -1 + 9x_1 \in J \\
x_1 &= -1/3 + x_4 = -4/3 + 9x_1
\end{align}
$$

closing: $-8x_1 = -4/3$, so $x_1 = 1/6$. then $x_2 = 1/2$, $x_3 = 1/6$, $x_4 = 1/2$.

$x_3 = x_1$ and $x_4 = x_2$. the orbit collapses to $\{1/6, 1/2\}$, which is the period-2 orbit from $IJ$.

this is forced: $IJIJ = (IJ)^2$ is period 2 itinerary repeated twice. any fixed point for $f^4$ with this satisfies $f^2(x) = x$, thus has period dividing 2. since $f_1$ and $f_2$ are injective, system has unique solution, and that solution is necessarily the period 2 point.

> [!Success] Answer
> unique solution to $IJIJ$ system yields $x_1 = x_3 = 1/6$, $x_2 = x_4 = 1/2$. this is period, not period 4. repeated itinerary structure $(IJ)^2$ forces collapse.
