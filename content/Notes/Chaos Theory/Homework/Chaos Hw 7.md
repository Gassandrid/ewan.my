---
id: Chaos Hw 7
aliases: []
tags: []
abstract: "Instructions: Graduate students (required) and those planning to go to graduate school in a mathematical science (encouraged) should turn in their solutions in LATEX; you will need to learn this language eventually. Submit your solution in a single PDF in Blackboard, including PDF of your code appended to solutions. Check Teams for sample code. Grading: All questions are worth 3 points unless marked otherwise (3 = perfect or nearly so, 2 = close but something missing, 1 = not close but a reasonable attempt, 0 = way off)."
author:
  - Ewan Pedersen
title: Assignment 7
date: 2026-03-26T08:44:08-04:00
updated: 2026-03-26T21:32:48-04:00
class:
  - export
---

## Problem 1

> [!Question]
> (a) Show that union of two countable sets is countable.
>
> (b) Let $S_1, S_2, S_3, \ldots$ be a countable collection of countable sets. Show that the union of the $S_i$ are countable.

### A

must be bijection from A to $\mathbb{N}$ and B to $\mathbb{N}$, we can simply zipper them

let $A = \{a_1, a_2, a_3, \ldots\}$ and $B = \{b_1, b_2, b_3, \ldots\}$ be countable. define $k : \mathbb{N} \to A \cup B$ by:

$$
f(n) = \begin{cases} a_k & n = 2k - 1 \\ b_k & n = 2k \end{cases}
$$

this will yield some $a_1, b_1, a_2, b_2, \ldots$

every element $A \cup B$ is in $A$ or $B$, so it appears as some $a_k$ or $b_k$, meaning $f$ hits it. $f$ is surjective, so $A \cup B$ is countable.

> [!Success] Answer
> weave two enumerations odd/even switches. resulting map $f : \mathbb{N} \to A \cup B$ is surjective, so $A \cup B$ is countable.

### B

enumerate each $S_i = \{s_{i,1}, s_{i,2}, s_{i,3}, \ldots\}$. arrange all elements in a grid:

$$
\begin{matrix}
s_{1,1} & s_{1,2} & s_{1,3} & \cdots \\
s_{2,1} & s_{2,2} & s_{2,3} & \cdots \\
s_{3,1} & s_{3,2} & s_{3,3} & \cdots \\
\vdots & \vdots & \vdots & \ddots
\end{matrix}
$$

![[Screenshot 2026-03-26 at 9.52.20 AM.png]]

traverse by diagonals: first diagonal $i + j = 2$ gives $s_{1,1}$. second diagonal $i + j = 3$ yields $s_{1,2}, s_{2,1}$. $k$-th diagonal $i + j = k+1$ gives $s_{1,k}, s_{2,k-1}, \ldots, s_{k,1}$.

> [!Success] Answer
> lists every $s_{i,j}$ exactly once, also "distributes evenly". I think this is a variation of [[Cantor's diagonal argument]], or whoever really came up with it.

---

## Problem 2

> [!Question]
> Characterize all members of the middle-thirds Cantor set $K_\infty$ in terms of ternary expansions. Include the 
> 1. left and 
> 2. right endpoints of intervals that have been removed, 
> 3. rationals that are not included already in (1) & (2), and 
> 4. irrationals. 
> 
>  *Hint: Describe the ternary expansion of these four ways to make it into $K_\infty$.*

$x \in K_\infty$ only if $x$ can be expanded in ternary s.t.: $0.d_1 d_2 d_3 \ldots$ where $d_i \in \{0, 2\}$ $\forall$ $i$.

construction: for stage n, be removign middle third for each interval, exactly set of points where nth ternary digit must be 1. thus every surviving n stage means that $d_{n} \neq 1$, example would be $d_{n}$ in $\{ 0,2 \}$. if one survives every n then every digit must avoid 1.

now the four types of elements, all characterized by having only 0s and 2s:

### Right Endpoints

are endpoints of form: 

$$
1/3, 1/9, 7/9, 1/27, 7/27, 19/27, \ldots
$$

In ternary, they have a finite expansion that ends in $1$. think $1/3 = 0.1_3$, $1/9 = 0.01_3$, $7/9 = 0.21_3$. replace trialling 1 with $0\overline{2}$ to write with only 0/2s 

$$
1/3 = 0.0\overline{2}_3, \quad 1/9 = 0.00\overline{2}_3, \quad 7/9 = 0.20\overline{2}_3
$$

ternary expansion eventually all 2s.

### Left Endpoints

are endpoints of form: 

 $$
2/3, 2/9, 8/9, 2/27, 8/27, 20/27, \ldots
$$

already in a form of finite ternary expansion, no need to replace 1: $2/3 = 0.2_3$, $2/9 = 0.02_3$, $8/9 = 0.22_3$. pad with zeros:

$$
2/3 = 0.2\overline{0}_3, \quad 2/9 = 0.02\overline{0}_3, \quad 8/9 = 0.22\overline{0}_3
$$

ternary expansion eventually all term 0s 

### Rationals not in 1/2

rational yields eventually periodic ternary expansion. having only 0/2s and not eventually constant means expansion is [[Eventually Periodic]] with some period $p \geq 1$ that cycles through a nontrivial pattern of 0s and 2s.

example: $1/4 = 0.\overline{02}_3$ (check: $\overline{02}_3 = 2/(9-1) = 2/8 = 1/4$ ✓). every digit is 0 or 2, period 2, not eventually constant.

### Irrationals

non-eventually-periodic ternary expansions using only 0 and 2. these form the uncountable bulk of $K_\infty$. example: $\sum_{n=1}^{\infty} 2 \cdot 3^{-n!}$, where 2s appear at factorial positions and 0s elsewhere, giving a non-repeating pattern.

> [!Success] Answer
> $x \in K_\infty$ if and only if $x$ has a ternary expansion with digits in $\{0, 2\}$ only.
>  four subcases: 
>  1. right endpoints of removed intervals have expansions eventually all 2s, 
>  2. left endpoints have terminating expansions (eventually all 0s), 
>  3. remaining rationals have eventually periodic (non-constant) expansions in $\{0,2\}$, 
>  4. irrationals have non-eventually-periodic expansions in $\{0, 2\}$.

---

## Problem 3

> [!Question]
> Show that the complement of the middle-thirds Cantor Set is the basin of infinity for the slope-3 tent map. Hint: look at what this map does to numbers written in ternary.

slope-3 [[Tent Map]]:

$$
T(x) = \begin{cases} 3x & 0 \leq x \leq 1/2 \\ 3(1-x) & 1/2 \leq x \leq 1 \end{cases}
$$

we note that $T$ maps $[0, 1/3]$ onto $[0, 1]$ (via $3x$), maps $[2/3, 1]$ onto $[0, 1]$ (via $3(1-x)$), and maps $(1/3, 2/3)$ to $(1, 3/2]$, this  is outside $[0, 1]$. so a point will escape $[0,1]$ on next iterate if and only if currently in middle third.

ternary: $x = 0.d_1 d_2 d_3 \ldots_3$. the middle third $(1/3, 2/3)$ is exactly the points with $d_1 = 1$. so $T(x) > 1$ if and only if $d_1 = 1$.

if $d_1 \in \{0, 2\}$, then $T(x) \in [0, 1]$, and we can apply $T$ again. the Cantor construction removes the middle third at each stage, which corresponds to eliminating the next ternary digit being 1. thus we  define:

$$
K_n = \{x \in [0,1] : T^j(x) \in [0,1] \text{ for } j = 0, 1, \ldots, n\}
$$

$K_1 = [0, 1/3] \cup [2/3, 1]$ (points with $d_1 \neq 1$).first stage for Cantor construction.

$K_2 = \{x \in K_1 : T(x) \in K_1\}$. applying $T$ shifts or flips the ternary expansion, so $T(x) \in K_1$ iff $d_2 \neq 1$. second

by induction: $K_n$ = points whose first $n$ ternary digits are all in $\{0, 2\}$ =  $n$ stage of Cantor construction.

intersectoin:

$$
K_\infty = \bigcap_{n=0}^{\infty} K_n = \{x : T^n(x) \in [0,1] \text{ for all } n \geq 0\}
$$

this is exactly the set of points whose orbit under $T$ never escapes $[0,1]$, i.e. the bounded orbits.

the complement $[0,1] \setminus K_\infty$ is then the set of points for which $T^n(x) > 1$ for some finite $n$, i.e. the orbit eventually escapes. once outside $[0,1]$, iterates diverge (the map has slope 3, so perturbations grow), giving the basin of infinity.

> [!Success] Answer
> $T$ sends middle third outside $[0,1]$ and maps both outer thirds back onto $[0,1]$. set of points surviving $n$ iterations is exactly $n$-th stage of the Cantor construction ($d_1, \ldots, d_n \in \{0, 2\}$). thus $K_\infty$ = bounded orbits, and its complement is the basin of infinity.

---

## Problem 4

> [!Question]
> Let $K_\infty$ be the middle-third Cantor set.
>
> (a) A point $x$ is a limit point of a set $S$ if every neighborhood of $x$ contains a point of $S$ aside from $x$. A set is closed if it contains all of its limit points. Show that $K_\infty$ is a closed set.
>
> (b) A set $S$ is perfect if it is closed and if each point of $S$ is a limit point of $S$. Show that $K_\infty$ is a perfect set. A perfect subset of $\mathbb{R}$ that contains no intervals of positive length is called a Cantor set.
>
> (c) Let $S$ be an arbitrary Cantor set in $\mathbb{R}$ that is both bounded and non-empty. Show that there is a one-to-one map (not necessarily onto) from $S$ to $K_\infty$. In fact, a correspondence can be chosen so that if $s, t \in S$ are associated with $s', t' \in K_\infty$, respectively, then $s < t$ implies $s' < t'$; that is, the correspondence preserves order.

### A

$K_\infty = \bigcap_{n=0}^{\infty} K_n$ where $K_n$ is stage $n$ of the construction (finite union of closed intervals). each $K_n$ is closed. arbitrary intersection of closed sets is closed.

> [!Success] Answer
> $K_\infty$ is an intersection of closed sets, 

### B

closed from part (a). need: every $x \in K_\infty$ is a limit point of $K_\infty$.

write $x = 0.d_1 d_2 d_3 \ldots_3$ with $d_i \in \{0, 2\}$. for each $n$, define $x_n$ by flipping the $n$-th digit: $d_n' = 2 - d_n$ (still in $\{0, 2\}$), all other digits unchanged. then:

- $x_n \in K_\infty$ (all digits still in $\{0, 2\}$)
- $x_n \neq x$ (differ at digit $n$)
- $|x_n - x| = 2/3^n \to 0$

so every $x \in K_\infty$ has a sequence in $K_\infty \setminus \{x\}$ converging to it.

> [!Success] Answer
> $K_\infty$ is perfect. flipping the $n$-th ternary digit gives a sequence in $K_\infty$ converging for any given pt

### C

$S$ is perfect, contains no intervals, bounded, nonempty. construct an order-preserving injection $\phi : S \to K_\infty$.

set up given that since $S$ contains no intervals, $S$ has empty interior, so the complement of $S$ within $[\min S, \max S]$ is open and dense. in particular, every open subinterval of the convex hull of $S$ contains a gap (a maximal open interval in $S^c$).

then perform recursive splitting, level 0: $S_\varnothing = S$.

at level $n+1$: for each piece $S_{d_1 \ldots d_n}$ with convex hull of length $L$, pick a gap from the middle third of its convex hull (exists since gaps are dense). this splits:

$$
S_{d_1 \ldots d_n 0} = S_{d_1 \ldots d_n} \cap (-\infty, g_L], \quad S_{d_1 \ldots d_n 2} = S_{d_1 \ldots d_n} \cap [g_R, \infty)
$$

where $g_L, g_R$ are the left and right endpoints of the chosen gap.

both sub-pieces are nonempty (gap is interior), closed (intersection of closed sets), perfect (every point is still a limit point from within the sub-piece since $S$ has no isolated points), and contain no intervals. both have diameter $\leq \frac{2}{3}L$.

so $\text{diam}(S_{d_1 \ldots d_n}) \leq (2/3)^n \to 0$.

then we define $\phi$ for $s \in S$, at each level $n$ there's a unique piece $S_{d_1 \ldots d_n}$ containing $s$. the address $(d_1, d_2, \ldots)$ with $d_i \in \{0, 2\}$ determines:

$$
\phi(s) = \sum_{n=1}^{\infty} \frac{d_n}{3^n} \in K_\infty
$$

for injective, if $s \neq t$, then for $n$ large enough that $(2/3)^n < |s - t|$, they must be in different pieces. different addresses give $\phi(s) \neq \phi(t)$.

for order-preserving, if $s < t$, at the first level $n$ where they separate, $s$ is in the left piece (digit 0) and $t$ in the right (digit 2). the first differing ternary digit of $\phi(s)$ is 0 while $\phi(t)$'s is 2, so $\phi(s) < \phi(t)$.

> [!Success] Answer
> we recursively split $S$ by choosing gaps from middle third of each piece convex hull.
> 
> resulting binary address tree assigns each $s \in S$ a sequence in $\{0, 2\}^\mathbb{N}$, maps to $K_\infty$ via ternary expansion. shrinking diameters force injectivity; left/right splitting forces order preservation.

---

## Problem 5

> [!Question]
> Use the matlab file `julia.m` from Teams to plot the Julia set for the four values of the parameter $c = -0.5 + 0.3i,\ i,\ -1,\ 1.1i$.
>
> (a) What do the black points represent? To answer this question, first try and figure out how the code goes about approximating the Julia set. It is a tricky thing to do because, as you recall, the Julia set consists of points which are repelling...
>
> (b) For which of these values of $c$ is the set connected, and how do you know?
>
> (c) For each value of $c$, what bounded orbits are attracting? Turn in a single picture with 4 figures, and answers to these questions.

### A

code approximates $J_c$ via inverse iteration. for $f(z) = z^2 + c$,  backward map is $f^{-1}(z) = \pm\sqrt{z - c}$. points on the Julia set are repelling under $f$, so they're attracting under $f^{-1}$. starting from an unstable fixed point (which lies on $J_c$), code iterates backward, randomly choosing either $+$ or $-$ branch of sqrt at each step. after discarding transients, the iterates densely fill out $J_c$.

black points are approximations of points on the Julia set $J_c$, generated by this backward orbit.

### B

$J_c$ is connected iff $c$ is in the [[Mandelbrot Set]], i.e. iff the critical orbit ($z_0 = 0$ under $z \mapsto z^2 + c$) is bounded.

- $c = -0.5 + 0.3i$: orbit converges to attracting fixed point $\approx -0.38 + 0.17i$. - connected
- $c = i$: $0 \to i \to -1+i \to -i \to -1+i \to \cdots$ eventually periodic, bounded. - connected
- $c = -1$: $0 \to -1 \to 0 \to -1 \to \cdots$ period-2, bounded - connected
- $c = 1.1i$: $0 \to 1.1i \to -1.21 + 1.1i \to 0.254 - 2.66i \to \cdots$, $|z_4| \approx 2.4 > 2$, escapes - disconnected

### C

- $c = -0.5 + 0.3i$: attracting fixed point at $z \approx -0.383 + 0.170i$, multiplier $2|z| \approx 0.84 < 1$.
- $c = i$: no attracting bounded orbit. critical point is preperiodic ($0 \to i \to -1+i \to -i \to -1+i \to \cdots$), landing on a repelling 2-cycle. Misiurewicz point; $J_c$ is a dendrite, no Fatou components.
- $c = -1$: superattracting period-2 cycle $\{0, -1\}$; critical point is on the cycle so multiplier is 0.
- $c = 1.1i$: no attracting bounded orbit, orbit of 0 escapes, only attractor is $\infty$.

### Code

I used gemini to convert `julia.m` into a python equivelant, as it is a more familiar language for me. After converted further modifcations were done by myself.

```python
import numpy as np
import matplotlib.pyplot as plt

def julia_inverse_iteration(a, b, k=20):
    niter = 2**k
    x = np.zeros(niter + 1)
    y = np.zeros(niter + 1)
    c = complex(a, b)
    z0 = 0.5 + np.sqrt(0.25 - c)
    x[0], y[0] = z0.real, z0.imag

    for n in range(niter):
        x1, y1 = x[n], y[n]
        u = np.sqrt((x1 - a)**2 + (y1 - b)**2) / 2
        v = (x1 - a) / 2
        u1 = np.sqrt(max(u + v, 0))
        v1 = np.sqrt(max(u - v, 0))
        x[n+1] = u1
        y[n+1] = v1
        if y[n] < b:
            y[n+1] = -y[n+1]
        if np.random.random() < 0.5:
            x[n+1] = -u1
            y[n+1] = -y[n+1]
    return x, y

c_values = [(-0.5, 0.3), (0, 1), (-1, 0), (0, 1.1)]
labels = [r'$c = -0.5 + 0.3i$', r'$c = i$', r'$c = -1$', r'$c = 1.1i$']

fig, axes = plt.subplots(2, 2, figsize=(12, 12))
for idx, ((a, b), label) in enumerate(zip(c_values, labels)):
    row, col = divmod(idx, 2)
    ax = axes[row][col]
    x, y = julia_inverse_iteration(a, b)
    ax.plot(x[1000:], y[1000:], 'k.', markersize=0.3)
    ax.set_xlim(-1.6, 1.6); ax.set_ylim(-1.6, 1.6)
    ax.set_aspect('equal')
    ax.set_xlabel('Re(z)', fontsize=14)
    ax.set_ylabel('Im(z)', fontsize=14)
    ax.set_title(label, fontsize=16)

plt.tight_layout()
plt.savefig('julia_sets.png', dpi=300)
plt.close()
```

### Figure

![[julia_sets.png]]
