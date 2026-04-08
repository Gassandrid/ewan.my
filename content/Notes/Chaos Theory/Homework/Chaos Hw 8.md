---
id: Chaos Hw 8
created_on: "[[04-02-2026]]"
aliases: []
tags: []
abstract: "Instructions: Graduate students (required) and those planning to go to graduate school in a mathematical science (encouraged) should turn in their solutions in LATEX; you will need to learn this language eventually. Submit your solution in a single PDF in Blackboard, including PDF of your code appended to solutions. Check Teams for sample code. Grading: All questions are worth 3 points unless marked otherwise (3 = perfect or nearly so, 2 = close but something missing, 1 = not close but a reasonable attempt, 0 = way off)."
author:
  - Ewan Pedersen
title: Assignment 8
date: 2026-04-02T12:14:24-04:00
updated: 2026-04-02T20:01:52-04:00
class:
  - export
---

## Problem 1

> [!Question]
> Let $A$ and $B$ be bounded subsets of $\mathbb{R}$. Let $A \times B$ be the set of points $(x, y)$ such that $x \in A$ and $y \in B$. Show that $\text{bcd}(A \times B) = \text{bcd}(A) + \text{bcd}(B)$.

box counting dim of set $S$:

$$
\text{bcd}(S) = \lim_{\epsilon \to 0} \frac{\ln N(\epsilon, S)}{\ln(1/\epsilon)}
$$

for $A, B \subset \mathbb{R}$, a grid box in $\mathbb{R}^2$ is $Q_{i,j} = [i\epsilon, (i+1)\epsilon] \times [j\epsilon, (j+1)\epsilon]$. a point $(x,y)$ lands in $Q_{i,j} \cap (A \times B)$ iff $x \in [i\epsilon, (i+1)\epsilon] \cap A$ and $y \in [j\epsilon, (j+1)\epsilon] \cap B$ independently.

so $Q_{i,j}$ intersects $A \times B$ iff the $x$-interval hits $A$ and the $y$-interval hits $B$. these are independent conditions, so:

$$
N(\epsilon, A \times B) = N(\epsilon, A) \cdot N(\epsilon, B)
$$

takign logs:

$$
\ln N(\epsilon, A \times B) = \ln N(\epsilon, A) + \ln N(\epsilon, B)
$$

divide by $\ln(1/\epsilon)$ and take $\epsilon \to 0$:

$$
\text{bdc}(A \times B) = \text{bcd}(A) + \text{bcd}(B)
$$

> [!Success] Answer
> $N(\epsilon, A \times B) = N(\epsilon, A) \cdot N(\epsilon, B)$ via independence of coord conditions. logs turn product into a sum, then passes through the limit.

---

## Problem 2

> [!Question]
> For the following questions, remember that an answer of true must be proven, while an answer of false must be supported by a counterexample.
>
> (a) True or false: The box-counting dimension of a finite union of sets is the maximum of the box-counting dimension of the sets. Justify your answer.
>
> (b) True or false: The box-counting dimension of a countable (but not finite) union of sets is the maximum of the box-counting dimension of the sets. Assume that the union is bounded.

### A

let $S = \bigcup_{i=1}^n S_i$. for any $\epsilon > 0$:

$$
\max_{1 \leq i \leq n} N(\epsilon, S_i) \leq N\left(\epsilon, \bigcup_{i=1}^n S_i\right) \leq \sum_{i=1}^n N(\epsilon, S_i) \leq n \cdot \max_i N(\epsilon, S_i)
$$

taking logs and sandwhiching:

$$
\ln\left(\max_i N(\epsilon, S_i)\right) \leq \ln N(\epsilon, S) \leq \ln n + \ln\left(\max_i N(\epsilon, S_i)\right)
$$

divide by $\ln(1/\epsilon)$ and send $\epsilon \to 0$. the $\ln n$ term vanishes since $n$ is constant, so both bounds collapse to $\max_i \text{bcd}(S_i)$.

> [!Success] Answer
> true. for finite unions, $N(\epsilon, S) \leq n \cdot \max_i N(\epsilon, S_i)$. the constant $n$ disappears in the limit, so $\text{bcd}(S) = \max_i \text{bcd}(S_i)$.

### B

false. take $S = \mathbb{Q} \cap [0,1]$, which is a countable union of singletons:

$$
S = \bigcup_{i=1}^\infty \{q_i\}
$$

each singleton has $\text{bcd}(\{q_i\}) = 0$, so the max dimension is $0$. but $\mathbb{Q}$ is dense in $[0,1]$, so every box of any size $\epsilon$ contains a rational. you need $N(\epsilon, S) \approx 1/\epsilon$ boxes to cover $S$, giving:

$$
\text{bcd}(S) = \lim_{\epsilon \to 0} \frac{\ln(1/\epsilon)}{\ln(1/\epsilon)} = 1
$$

> [!Success] Answer
> false. $\mathbb{Q} \cap [0,1]$ is a countable union of points (all dim 0) but has bcd $= 1$ by density. the infinite union can fill the space even if each piece is trivial.

---

## Problem 3

> [!Question]
> Consider the Cantor set $D$ formed by deleting the middle subinterval of length $4^{-k}$ from each remaining interval at step $k$.
>
> (a) Prove that the length of $D$ is $1/2$. Thus $D$ is a fat fractal.
>
> (b) What is the box-counting dimension of $D$?
>
> (c) Let $f$ be the function on $[0,1]$ which is equal to $1$ on $D$ and $0$ elsewhere. It is the limit of functions which are Riemann integrable. Note that $f$ is not Riemann integrable. What is the value of any lower Riemann sum for $f$? (The lower sum is the sum of box areas using the infimum of $f(x)$ in each subinterval $[x_{k-1}, x_k]$.)

### A

start with $[0,1]$. at step $k$, there are $2^{k-1}$ intervals, and we remove a middle piece of length $4^{-k}$ from each. total length removed:

$$
\sum_{k=1}^{\infty} 2^{k-1} \cdot 4^{-k} = \frac{1}{4} \sum_{k=1}^{\infty} \left(\frac{1}{2}\right)^{k-1} = \frac{1/4}{1 - 1/2} = \frac{1}{2}
$$

so the remaining measure is $1 - 1/2 = 1/2$.

> [!Success] Answer
> total removed $1/2$, so $|D| = 1/2$. positive measure but nowhere dense. fat fractal.

### B

let $l_k$ be the length of each surviving interval at step $k$, and $L_k = 2^k l_k$ be the total remaining length. since $L_k \to 1/2$:

$$
l_k \approx \frac{1/2}{2^k} = 2^{-(k+1)}
$$

set $\epsilon = l_k$. need $N(\epsilon, D) = 2^k$ intervals. so:

$$
\text{bcd}(D) = \lim_{k \to \infty} \frac{\ln 2^k}{\ln(1/l_k)} = \lim_{k \to \infty} \frac{k \ln 2}{(k+1) \ln 2} = \lim_{k \to \infty} \frac{k}{k+1} = 1
$$

> [!Success] Answer
> $\text{bcd}(D) = 1$. makes sense. any set with positive Lebesgue measure $\mathbb{R}$ has bcd $= 1$.

### C

$D$ nowhere dense, thus complement is dense in $[0,1]$. every subinterval of any partition contains points not in $D$, where $f = 0$. thus:

$$
m_i = \inf_{x \in [x_{i-1}, x_i]} f(x) = 0 \quad \forall i
$$

$$
L(f, P) = \sum_{i=1}^n 0 \cdot \Delta x_i = 0
$$

> [!Success] Answer
> every lower Riemann sum is $0$. nowhere density of $D$ forces a zero in every subinterval.

---

## Problem 4

> [!Question]
> (a) Find the box-counting dimension of the invariant set of the skinny baker map.
>
> (b) Describe 3-dimensional versions of the attractors in Figures 4.3, 4.4, and 4.5.
>
> (c) Compute the dimension of these versions from part (b).
>
> *Hints: In Figure 4.3 there are a couple of ways of extending the example that you might choose. For 4.4, use a tetrahedron (triangular base) rather than a square based pyramid. The second iterate results in 4 tetrahedrons with side length 1/2 of the original. Be sure to manipulate the logarithms until you have integers plus fractional dimensions.*

### A

figure 4.3: skinny baker map expands vertically by $2$ and contracts horizontally by $1/3$. top half maps to the right vertical strip, bottom to the left. in $x$, the surviving set is exactly a [[Cantor Set]] construction (keeping two thirds at each step). in $y$, the expansion and wrapping fills $[0,1]$.

using the product formula from problem 1:

$$
\text{bcd}(S) = \text{bcd}(K) + \text{bcd}([0, 1]) = \frac{\ln 2}{\ln 3} + 1 \approx 1.631
$$

> [!Success] Answer
> dimension is $1 + \frac{\ln 2}{\ln 3}$.

### B

**fig 4.3 (3d skinny baker):** extend to a unit cube by expanding in $y$ and $z$ and contracting in $x$. invariant set is $K \times [0,1] \times [0,1]$. sort of a cantor set of sheets.

**fig 4.4 (seirpinski tetrahadron):** start with a solid tetrahedron. subdivide into 8 smaller tetrahedra of side $1/2$. keep only the 4 corner tetrahedra, remove the rest.

**fig 4.5 (menger sponge):** divide a cube into $27$ sub-cubes of side $1/3$. remove center cube and 6 face-adjacent cubes (cross thing). keep $20$ sub cubes. repeat.

### C

**3d skinny baker:** $K \times [0,1] \times [0,1]$, so by problem 1:

$$
\text{dim} = \frac{\ln 2}{\ln 3} + 2 = 2 + \frac{\ln 2}{\ln 3}
$$

**sierpinski:** $N = 4$ pieces, scaling $r = 1/2$:

$$
\text{dim} = \frac{\ln 4}{\ln 2} = 2
$$

**menger:** $N = 20$ pieces, scaling $r = 1/3$:

$$
\text{dim} = \frac{\ln 20}{\ln 3} = \frac{2\ln 3 + \ln(20/9)}{\ln 3} = 2 + \frac{\ln(20/9)}{\ln 3} \approx 2.727
$$

> [!Success] Answer
> 3D baker: $2 + \frac{\ln 2}{\ln 3}$. sierpinski tetrahedron: $2$. menger sponge: $2 + \frac{\ln(20/9)}{\ln 3}$.

---

## Problem 5

> [!Question]
> The Koch curve is constructed by taking a line segment and replacing it with four segments, each with length equal to $1/3$ of the original. The result is demonstrated for several iterates by the code `koch.m` (press return to iterate). Download from Teams. Do the same for `sierpinski.m` and `fern.m`. These m-files also require `boxcount.m` to display the approximate box counting dimension.
>
> (a) What is the box counting dimension of the Koch curve and Sierpinski's gasket if you compute it by hand? Why do these numbers disagree with what `boxcount.m` shows you?
>
> (b) What is the length of the Koch curve?
>
> (c) How is the Sierpinski gasket generated?
>
> Please turn in the three figures (koch, sierpinski, fern), both fractals and the dimension plot, with your answers to the above questions.

### A

- **koch curve:**, n = 4 r = 1/3

  $$

\text{bcd} = \frac{\ln 4}{\ln 3} \approx 1.2619

$$
- **sierpinski gasket:** n=3 r=1/2

  
$$

\text{bcd} = \frac{\ln 3}{\ln 2} \approx 1.5850

$$
python equivalent of `boxcount.m` yields $1.328$ for kooh and $1.594$ for sierpinski. code estimates the limit $\epsilon \to 0$ via least squares fit for finite box sizes, but fractals only generated to finite iteration. for small $\epsilon$, count levels off as you have exhausted resolution of set, which tilts slope of the log/log fit.

### B

at iteration $k$, total length is $(4/3)^k$. so:
$$

\lim_{k \to \infty} \left(\frac{4}{3}\right)^k = \infty

$$

> [!Success] Answer
> the koch curve has infinite length.

### C

`sierpinski.m` uses the chaos game (IFS with probabilities):
1. fix three vertices $A, B, C$ of an equilateral triangle
2. pick a random starting point
3. at each step, pick a random vertex with prob $1/3$ each
4. move halfway to that vertex
5. after enough iterations the points trace out the gasket

### Figures

![[koch.png]]
![[sierpinski.png]]
![[fern.png]]


### Code

running matlab is a pain as always, so I used gemini to translate into python and then modified from there.

```python
import numpy as np
import matplotlib.pyplot as plt

def boxcount(coordmat, maxstep, ax=None):
    glob_llx = np.min(coordmat[:, 0])
    glob_lly = np.min(coordmat[:, 1])
    glob_urx = np.max(coordmat[:, 0])
    glob_ury = np.max(coordmat[:, 1])

    epsilon = 1e-8
    glob_llx -= epsilon
    glob_lly -= epsilon
    glob_urx += epsilon
    glob_ury += epsilon

    x_vals = []
    y_vals = []

    for step in range(maxstep + 1):
        n_sds = 2**step
        H, _, _ = np.histogram2d(coordmat[:, 0], coordmat[:, 1], bins=(n_sds, n_sds),
                                 range=[[glob_llx, glob_urx], [glob_lly, glob_ury]])
        n_boxes = np.sum(H > 0)
        x_vals.append(step * np.log(2))
        y_vals.append(np.log(n_boxes) if n_boxes > 0 else 0)

    x_vals = np.array(x_vals)
    y_vals = np.array(y_vals)

    A = np.vstack([x_vals, np.ones(len(x_vals))]).T
    param, _, _, _ = np.linalg.lstsq(A, y_vals, rcond=None)
    frac_dim = param[0]

    if ax is not None:
        ax.plot(x_vals, y_vals, 'o')
        ax.plot([x_vals[0], x_vals[-1]], [param[0]*x_vals[0] + param[1], param[0]*x_vals[-1] + param[1]], '-')
        ax.set_title(f'Estimated fractal dimension = {frac_dim:.6f}')
        ax.set_xlabel('n*ln(2)')
        ax.set_ylabel('ln(n_boxes)')

    return frac_dim

# Koch
k = 6
mmax = 4**k
x = np.zeros(mmax + 1)
y = np.zeros(mmax + 1)
h = 3**(-k)
angle = [0, np.pi/3, -np.pi/3, 0]

for a in range(1, mmax + 1):
    m = a - 1
    ang = 0
    for b in range(1, k + 1):
        segment = m % 4
        m = m // 4
        ang += angle[segment]
    x[a] = x[a-1] + h * np.cos(ang)
    y[a] = y[a-1] + h * np.sin(ang)

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
axes[0].plot(x, y, 'b')
axes[0].set_aspect('equal')
axes[0].set_title('Koch Curve')
coordmat = np.column_stack((x, y))
frac_dim = boxcount(coordmat, 9, ax=axes[1])
plt.savefig('koch.png', dpi=300)
plt.close()

# Sierpinski
Nmax = 50000
A = np.array([0, 0])
B = np.array([4, 0])
C = np.array([2, 2*np.sqrt(3)])
P = np.zeros((Nmax + 1, 2))
scale = 0.5

for n in range(Nmax):
    r = np.random.rand()
    if r < 1/3:
        P[n+1] = P[n] + (A - P[n]) * scale
    elif r < 2/3:
        P[n+1] = P[n] + (B - P[n]) * scale
    else:
        P[n+1] = P[n] + (C - P[n]) * scale

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
axes[0].plot(P[:, 0], P[:, 1], '.', markersize=1)
axes[0].set_xlim(0, 4)
axes[0].set_ylim(0, 2*np.sqrt(3))
axes[0].set_aspect('equal')
axes[0].set_title('Sierpinski Triangle')
frac_dim = boxcount(P, 9, ax=axes[1])
plt.savefig('sierpinski.png', dpi=300)
plt.close()

# Fern
N = 50000
P = np.zeros((N, 2))
P[0] = [0.5, 0.5]

def T(P, a, b, c, d, e, f):
    return np.array([a*P[0] + b*P[1] + c, d*P[0] + e*P[1] + f])

for k in range(N - 1):
    r = np.random.rand()
    if r < 0.05:
        P[k+1] = T(P[k], 0, 0, 0, 0, 0.2, 0)
    elif r < 0.86:
        P[k+1] = T(P[k], 0.85, 0.05, 0, -0.04, 0.85, 1.6)
    elif r < 0.93:
        P[k+1] = T(P[k], 0.2, -0.26, 0, 0.23, 0.22, 1.6)
    else:
        P[k+1] = T(P[k], -0.15, 0.28, 0, 0.26, 0.24, 0.44)

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
axes[0].plot(P[:, 0], P[:, 1], '.', markersize=1)
axes[0].set_xlim(-2.5, 3.5)
axes[0].set_ylim(0, 11)
axes[0].set_title('Barnsley Fern')
frac_dim = boxcount(P, 9, ax=axes[1])
plt.savefig('fern.png', dpi=300)
plt.close()
```
