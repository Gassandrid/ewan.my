---
id: Chaos Hw 9
aliases: []
tags: []
abstract: "Instructions: Graduate students (required) and those planning to go to graduate school in a mathematical science (encouraged) should turn in their solutions in LATEX; you will need to learn this language eventually. Submit your solution in a single PDF in Blackboard, including PDF of your code appended to solutions. Check Teams for sample code. Grading: All questions are worth 3 points unless marked otherwise (3 = perfect or nearly so, 2 = close but something missing, 1 = not close but a reasonable attempt, 0 = way off)."
author:
  - Ewan Pedersen
title: Assignment 9
date: 2026-04-09T09:35:06-04:00
updated: 2026-04-09T22:57:41-04:00
class:
  - export
---

## Problem 1

> [!Question]
> Find a general formula for (area-contracting) skinny baker maps, where the strips have width $w$ instead of $1/3$. Find the area contraction factor (per iteration) and the Lyapunov exponents.

same setup as hw 8 p4 but replace $1/3$ with $w$! map takes the unit square, cuts in half horizontally, then squishes each half into vertical strip(width $w$, height $1$):

$$
f(x, y) = \begin{cases} (wx\ 2y) & 0 \leq y < 1/2 \\ (wx + 1 - w,\ 2y - 1) & 1/2 \leq y \leq 1 \end{cases}
$$

bottom half goes on left strip $[0, w] \times [0, 1]$, top half on right strip $[1-w, 1] \times [0, 1]$. contracts by $w$ horizontally, stretches by $2$ vertically.

Jacobian same for both:

$$
Df = \begin{pmatrix} w & 0 \\ 0 & 2 \end{pmatrix}
$$

area contraction factor - $|\det Df| = 2w$. for the map to be area-contracting we need $2w < 1$, i.e. $w < 1/2$. (the original skinny baker had $w = 1/3$, giving $2/3$.)

Lyapunov exponents - Jacobian is constant + diagonal, so $Df^n = \text{diag}(w^n, 2^n)$. the exponents read off directly:

$$
h_1 = \ln 2, \quad h_2 = \ln w
$$

$h_1 > 0$ (expanding, vertical), $h_2 < 0$ (contracting, horizontal since $w < 1/2$).

sanity check - $h_1 + h_2 = \ln 2 + \ln w = \ln(2w) = \ln|\det Df|$. product of Lyapunov numbers equals the Jacobian determinant, consistent with what we'll show in problem 2.

> [!Success] Answer
> $f(x,y) = (wx, 2y)$ on bottom half, $(wx + 1-w, 2y-1)$ on top half. area contracts by factorof $2w$ per iteration ($w < 1/2$ required). Lyapunov exponents: $h_1 = \ln 2$, $h_2 = \ln w$.

---

## Problem 2

> [!Question]
> Assume that the map $f$ on $\mathbb{R}^m$ has constant Jacobian determinant, say $|\det Df(x)| = D > 0$ for each $x$. Explain why the product of all $m$ Lyapunov numbers is $D$.

using chain rule, Jacobian of the $n$-th iterate is:

$$
Df^n(x_0) = Df(x_{n-1}) \cdot Df(x_{n-2}) \cdots Df(x_0)
$$

determinants:

$$
|\det Df^n(x_0)| = \prod_{k=0}^{n-1} |\det Df(x_k)| = D^n
$$

since $|\det Df| = D$ everywhere.

now, for any matrix $A$, the product of its singular values equals $|\det A|$. the Lyapunov exponents are defined from the singular values $\sigma_1^{(n)} \geq \cdots \geq \sigma_m^{(n)}$ of $Df^n$:

$$
h_i = \lim_{n \to \infty} \frac{1}{n} \ln \sigma_i^{(n)}
$$

summing all $m$ exponents:

$$
\sum_{i=1}^m h_i = \lim_{n \to \infty} \frac{1}{n} \ln \prod_{i=1}^m \sigma_i^{(n)} = \lim_{n \to \infty} \frac{1}{n} \ln |\det Df^n| = \lim_{n \to \infty} \frac{1}{n} \ln D^n = \ln D
$$

the Lyapunov numbers are $L_i = e^{h_i}$, so:

$$
\prod_{i=1}^m L_i = e^{\sum h_i} = e^{\ln D} = D
$$

> [!Success] Answer
> $|\det Df^n| = D^n$ by cchain rule. product of singular values = determinant, thus summing Lyapunov exponents yieldxs $\ln D$. exponentiating: $\prod L_i = D$.

---

## Problem 3

> [!Question]
> Following the discussion on page 200 of the text, write the result of the Gram-Schmidt orthogonalization procedure as an $m \times m$ matrix equation $Z = YR$, where the columns of $Y$ are $\vec{y}_1, \vec{y}_2, \cdots, \vec{y}_m$, the columns of $Z$ are $\vec{z}_1, \vec{z}_2, \cdots, \vec{z}_m$, and $R$ is an upper triangular matrix. Show that $\det(R) = 1$, so that $\det(Y) = \det(Z)$. Explain why this implies that the ellipsoids $Y^N$ and $Z^N$ have equal $m$-dimensional volume. Depending on your matrix algebra skills, you may want to start with the case $m = 2$.

$\vec{z}_i$ are vectors after applying Jacobian/5.3, and the $\vec{y}_i$ are orthogonalized vectors produced by Gram Schmitd/ 5.4. $N$ is the unit sphere.

### $m = 2$ First

Gram Schmidt / 5.4 yiellds:

$$
\vec{y}_1 = \vec{z}_1, \quad \vec{y}_2 = \vec{z}_2 - \frac{\vec{z}_2 \cdot \vec{y}_1}{\|\vec{y}_1\|^2}\vec{y}_1
$$

rearranging to express $\vec{z}$'s in terms of $\vec{y}$'s:

$$
\vec{z}_1 = 1 \cdot \vec{y}_1, \quad \vec{z}_2 = \frac{\vec{z}_2 \cdot \vec{y}_1}{\|\vec{y}_1\|^2}\vec{y}_1 + 1 \cdot \vec{y}_2
$$

set $c = \frac{\vec{z}_2 \cdot \vec{y}_1}{\|\vec{y}_1\|^2}$. in matrix form:

$$
[\vec{z}_1 \mid \vec{z}_2] = [\vec{y}_1 \mid \vec{y}_2] \begin{pmatrix} 1 & c \\ 0 & 1 \end{pmatrix}
$$

so $Z = YR$ with $R = \begin{pmatrix} 1 & c \\ 0 & 1 \end{pmatrix}$, upper triangular, 1s on diagonal. $\det(R) = 1$.

### General $m$

from 5.4/  Gram Schmitd defines:

$$
\vec{y}_k = \vec{z}_k - \sum_{j=1}^{k-1} \frac{\vec{z}_k \cdot \vec{y}_j}{\|\vec{y}_j\|^2}\vec{y}_j
$$

rearranging each equation to isolate $\vec{z}_k$:

$$
\vec{z}_k = \frac{\vec{z}_k \cdot \vec{y}_1}{\|\vec{y}_1\|^2}\vec{y}_1 + \cdots + \frac{\vec{z}_k \cdot \vec{y}_{k-1}}{\|\vec{y}_{k-1}\|^2}\vec{y}_{k-1} + 1 \cdot \vec{y}_k
$$

this is a linear combination of $\vec{y}_1, \ldots, \vec{y}_k$ with coefficient 1 on $\vec{y}_k$. reading off columns: $Z = YR$ where

$$
R_{jk} = \begin{cases} \frac{\vec{z}_k \cdot \vec{y}_j}{\|\vec{y}_j\|^2} & j < k \\ 1 & j = k \\ 0 & j > k \end{cases}
$$

$R$ is upper triangular with all diagonal entries equal to 1. determinant of a triangular matrix is the product of diagonal entries:

$$
\det(R) = \prod_{k=1}^m 1 = 1
$$

therefore $\det(Z) = \det(Y)\det(R) = \det(Y)$.

### Equal Volume $YN$ / $ZN$

image of the unit sphere $N$ under matrix $M$ is an ellipsoid $MN$ with $\mathbb{R}^m$ volume $|\det(M)| \cdot \omega_m$, where $\omega_m$ is the volume of the unit $m$-ball. ellipsoid $ZN$ is image after applying Jacobian, and $YN$ is ellipsoid spanned by orthogonalized vectors. since $\det(Z) = \det(Y)$:

$$
\text{vol}(ZN) = |\det(Z)| \cdot \omega_m = |\det(Y)| \cdot \omega_m = \text{vol}(YN)
$$

so Gram Schmidt reshapes the ellipsoid to align axes orthonganaly but preserves volume, why QR works. we can orthogonalize at each step without losing volume information, no floating point blowup issues.

> [!Success] Answer
> reusing 5.4 yielded $Z = YR$ with $R_{jk} = \frac{\vec{z}_k \cdot \vec{y}_j}{\|\vec{y}_j\|^2}$ above diagonal, 1s on diagonal, 0s below. $\det(R) = 1$, so $\det(Z) = \det(Y)$.  ellipsoids $ZN$ and $YN$ have equal volume.

---

## Problem 4

> [!Question]
> Plot the orbit of the two-dimensional Tinkerbell map
>
> $$
> f(x, y) = (x^2 - y^2 + c_1 x + c_2 y,\ 2xy + c_3 x + c_4 y)
> $$
>
> where $c_1 = -0.3$, $c_2 = -0.6$, $c_3 = 2$, $c_4 = 0.5$, with initial value $(x, y) = (0.1, 0.1)$. The orbit tends toward an oval-shaped quasiperiodic attractor. Find out what replaces the quasiperiodic attractor when the parameter $c_4$ is decreased or increased.

at default $c_4 = 0.5$, orbit settles onto smooth invariant circle, quasiperiodic/never exactly repeating:

![[tinkerbell_default.png]]

origin $(0, 0)$ is always fixed point. Jacobian:

$$
Df(0, 0) = \begin{pmatrix} c_1 & c_2 \\ c_3 & c_4 \end{pmatrix} = \begin{pmatrix} -0.3 & -0.6 \\ 2 & c_4 \end{pmatrix}
$$

characteristic equation: $\lambda^2 - (c_1 + c_4)\lambda + (c_1 c_4 - c_2 c_3) = 0$, thus complex conjugate eigenvalues: $|\lambda|^2 = c_1 c_4 - c_2 c_3 = -0.3 c_4 + 1.2$.

set $|\lambda|^2 = 1$: $c_4 = 2/3$. 

- $c_4 > 2/3$ origin is a stable spiral ($|\lambda| < 1$). orbit spirals into the fixed point. the invariant circle DNE
- $c_4 = 2/3$ eigenvalues cross the unit circle. invariant circle born.
- $c_4 < 2/3$ origin is unstable ($|\lambda| > 1$). orbit settles onto invariant circle surrounding, $c_4 = 0.5$ yields smooth oval.
- $c_4 \lesssim 0.3$ invariant circle loses smoothness + breaks up into a chaotic attractor, orbit fills 2d region instead of a traced curve

![[tinkerbell_regimes.png]]

> [!Success] Answer
> increasing $c_4$ - invariant circle shrinks and vanishes at $c_4 = 2/3$, stable origin fixed point replaces it
> 
> decreasing $c_4$ - invariant circle grows, lose smoothness, becomes chaotic attractor

### Code

```python
import numpy as np
import matplotlib.pyplot as plt

def tinkerbell(x, y, c1, c2, c3, c4):
    return x**2 - y**2 + c1*x + c2*y, 2*x*y + c3*x + c4*y

def orbit(c1, c2, c3, c4, x0=0.1, y0=0.1, N=100000, transient=1000):
    xs = np.zeros(N)
    ys = np.zeros(N)
    xs[0], ys[0] = x0, y0
    for i in range(1, N):
        xs[i], ys[i] = tinkerbell(xs[i-1], ys[i-1], c1, c2, c3, c4)
        if xs[i]**2 + ys[i]**2 > 1e6:
            return xs[:i], ys[:i], transient
    return xs, ys, transient

c1, c2, c3 = -0.3, -0.6, 2.0

# three in one plot
fig, axes = plt.subplots(1, 3, figsize=(15, 5))
configs = [
    (0.1, 'chaotic attractor c4 = 0.1'),
    (0.5, 'quasiperiodic c4 = 0.5'),
    (0.7, 'fixed point c4 = 0.7'),
]
for ax, (c4, title) in zip(axes, configs):
    xs, ys, t = orbit(c1, c2, c3, c4)
    n = len(xs)
    ax.plot(xs[t:n], ys[t:n], 'k.', markersize=0.15)
    ax.set_title(title, fontsize=13)
    ax.set_aspect('equal')
    ax.set_xlabel('x'); ax.set_ylabel('y')
plt.tight_layout()
plt.show()
```

---

## Problem 5

> [!Question]
> Write a program to measure Lyapunov exponents. Check the program by comparing your approximation for the Henon and Ikeda maps with what is given in the text on pages 201-202. Calculate the Lyapunov exponents of the Tinkerbell map quasiperiodic orbit from the previous exercise (one should be zero). Finally, change the first parameter of Tinkerbell to $c_1 = 0.9$ and repeat. Plot the orbit to see the graceful-looking chaotic attractor which gives the map its name. Turn in your code along with the LE estimates.

QR - for each iterate, apply Jacobian to orthonormal basis, Gram Schmidt orthogonalize, record $\ln \|\vec{y}_i\|$ before normalizing. after $n$ steps, $i$-th Lyapunov exponent:

$$
h_i \approx \frac{1}{n}\sum_{j=1}^{n} \ln \|\vec{y}_i^j\|
$$

Henon ($a=1.4, b=0.3$): $h_1 = 0.4175$ (text: $0.42$), $h_2 = -1.6215$ (text: $-1.62$). Ikeda: $h_1 = 0.5079$ (text: $0.51$), $h_2 = -0.7187$ (text: $-0.72$). both match to two decimal places.

### Tinkerbell Quasiperiodic $c_1 = -0.3$, $c_4 = 0.5$

$$
h_1 \approx 0.0000, \quad h_2 \approx -0.0569
$$

$h_1 = 0$ as expected - on invariant circle, tangential dir shows no growth or shrinkage. $h_2 < 0$ reflects transverse contraction that keeps orbits on the circle.

making sure: $h_1 + h_2 = -0.057 \approx \ln|\det Df|$. Tinkerbell Jacobian determinant is $(2x + c_1)(2x + c_4) - (-2y + c_2)(2y + c_3)$, which varies along the orbit but averages to $e^{-0.057} \approx 0.945$, constitent.

### Tinkerbell Chaotic $c_1 = 0.9$, $c_4 = 0.5$

$$
h_1 \approx 0.1908, \quad h_2 \approx -0.5197
$$

$h_1 > 0$ confirms chaos. attractor has signature looping, quite elegant!

![[tinkerbell_chaotic.png]]

> [!Success] Answer
> Gram Schmidt matches text vals for Henon ($0.42, -1.62$), Ikeda ($0.51, -0.72$)., Tinkerbell quasiperiodic: $h_1 = 0.000, h_2 = -0.057$ ,expected 1 zero. Tinkerbell chaotic ($c_1 = 0.9$): $h_1 = 0.191, h_2 = -0.520$ chaos confirmed via positive exp.

### Code

```python
import numpy as np
import matplotlib.pyplot as plt

def lyapunov_exponents(f, Df, x0, n_iter=100000, transient=1000):
    m = len(x0)
    x = np.array(x0, dtype=float)
    W = np.eye(m)
    log_sums = np.zeros(m)

    for k in range(n_iter + transient):
        J = Df(x)
        x = f(x)
        Z = J @ W

        # gram schmitd
        Y = np.zeros_like(Z)
        for i in range(m):
            Y[:, i] = Z[:, i]
            for j in range(i):
                Y[:, i] -= (Z[:, i] @ Y[:, j]) / (Y[:, j] @ Y[:, j]) * Y[:, j]

        norms = np.linalg.norm(Y, axis=0)
        if k >= transient:
            log_sums += np.log(norms)
        W = Y / norms

    return log_sums / n_iter

# henon
def henon_f(v, a=1.4, b=0.3):
    return np.array([1 - a*v[0]**2 + v[1], b*v[0]])
def henon_Df(v, a=1.4, b=0.3):
    return np.array([[-2*a*v[0], 1.0], [b, 0.0]])

# ikeda
def ikeda_f(v, R=1, C1=0.4, C2=0.9, C3=6):
    x, y = v
    tau = C1 - C3 / (1 + x**2 + y**2)
    ct, st = np.cos(tau), np.sin(tau)
    return np.array([R + C2*(x*ct - y*st), C2*(x*st + y*ct)])
def ikeda_Df(v, R=1, C1=0.4, C2=0.9, C3=6):
    x, y = v
    r2 = 1 + x**2 + y**2
    tau = C1 - C3 / r2
    ct, st = np.cos(tau), np.sin(tau)
    dtdx = 2*C3*x / r2**2
    dtdy = 2*C3*y / r2**2
    u = x*ct - y*st
    w = x*st + y*ct
    return np.array([
        [C2*(ct - w*dtdx), C2*(-st - w*dtdy)],
        [C2*(st + u*dtdx), C2*(ct + u*dtdy)]
    ])

# tinkerbell
def make_tinkerbell(c1, c2, c3, c4):
    def f(v):
        x, y = v
        return np.array([x**2 - y**2 + c1*x + c2*y, 2*x*y + c3*x + c4*y])
    def Df(v):
        x, y = v
        return np.array([[2*x + c1, -2*y + c2], [2*y + c3, 2*x + c4]])
    return f, Df

# iterates
h = lyapunov_exponents(henon_f, henon_Df, [0.1, 0.1])
print(f"henon:    h1={h[0]:.4f}, h2={h[1]:.4f}")

h = lyapunov_exponents(ikeda_f, ikeda_Df, [0.1, 0.1])
print(f"ikeda:    h1={h[0]:.4f}, h2={h[1]:.4f}")

f, Df = make_tinkerbell(-0.3, -0.6, 2.0, 0.5)
h = lyapunov_exponents(f, Df, [0.1, 0.1])
print(f"tinkerbell QP: h1={h[0]:.4f}, h2={h[1]:.4f}")

f, Df = make_tinkerbell(0.9, -0.6, 2.0, 0.5)
h = lyapunov_exponents(f, Df, [0.1, 0.1])
print(f"tinkerbell chaotic: h1={h[0]:.4f}, h2={h[1]:.4f}")

# plot
N = 200000; xs = np.zeros(N); ys = np.zeros(N)
xs[0], ys[0] = 0.1, 0.1
for i in range(1, N):
    v = f(np.array([xs[i-1], ys[i-1]]))
    xs[i], ys[i] = v
fig, ax = plt.subplots(figsize=(8, 8))
ax.plot(xs[1000:], ys[1000:], 'k.', markersize=0.1)
ax.set_title('tinkerbell map c1=0.9')
ax.set_aspect('equal'); ax.set_xlabel('x'); ax.set_ylabel('y')
plt.tight_layout()
plt.show()
```
