---
id: Chaos Hw 12
aliases: []
tags: []
abstract: "Instructions: Graduate students (required) and those planning to go to graduate school in a mathematical science (encouraged) should turn in their solutions in LATEX; you will need to learn this language eventually. Submit your solution in a single PDF in Blackboard, including PDF of your code appended to solutions. Check Teams for sample code. Grading: All questions are worth 3 points unless marked otherwise (3 = perfect or nearly so, 2 = close but something missing, 1 = not close but a reasonable attempt, 0 = way off)."
author:
  - Ewan Pedersen
title: Assignment 12
class:
  - export
date: 2026-04-29T09:51:58-04:00
updated: 2026-04-30T20:26:23-04:00
---

## Problem 1

> [!Question]
> Show that if $x_0$ is in a forward limit set, say $\omega(y)$, then the entire orbit $\{f^n(x_0) : n \geq 0\}$ is in $\omega(y)$.

want forward-invariance of $\omega(y)$. recall the definition:

$$
\omega(y) = \{z : \exists\, n_k \to \infty \text{ with } f^{n_k}(y) \to z\}
$$

assume $f$ continuous (standard).

$x_0 \in \omega(y) \implies$ there existxs a subsequence $n_k \to \infty$ with $f^{n_k}(y) \to x_0$. fix $m \geq 0$ and apply $f^m$ to both sides. continuity of $f^m$ yeilds

$$
f^{n_k + m}(y) = f^m(f^{n_k}(y)) \longrightarrow f^m(x_0).
$$

let $m_k = n_k + m$. then $m_k \to \infty$ and $f^{m_k}(y) \to f^m(x_0)$, so $f^m(x_0) \in \omega(y)$ by definition.

$m$ arbitrary so $\{f^m(x_0) : m \geq 0\} \subset \omega(y)$.

basically just "shift the index by $m$" method: tail of a tail is still a tail, thus continuity passes the limit through $f^m$.

> [!Success] Answer
> $f^{n_k}(y) \to x_0$ along $n_k \to \infty$. continuity gives $f^{n_k + m}(y) \to f^m(x_0)$, and $n_k + m \to \infty$, so $f^m(x_0) \in \omega(y)$ for every $m \geq 0$. $\omega$-limit sets are forward-invariant.

---

## Problem 2

> [!Question]
> **(a)** Show that the logistic map $g_a(x) = ax(1-x)$, for $a > 4$, has a chaotic set which is not a chaotic attractor.
>
> **(b)** Show that the Horseshoe Map (described in Chapter 5) contains a chaotic set.

### A

peak $g_a(1/2) = a/4 > 1$, so a middle interval gets ejected from $[0,1]$ on the first iterate. solving $g_a(x) = 1$:

$$
A_0 = (p, q), \qquad p, q = \tfrac{1}{2}\!\left(1 \mp \sqrt{1 - 4/a}\right)
$$

once a point lands in $\mathbb{R} \setminus [0,1]$ it leaves for good. define

$$
A_n = \{x \in [0,1] : g_a^n(x) \notin [0,1]\}, \qquad \Lambda = [0,1] \setminus \bigcup_{n \geq 0} A_n.
$$

$\Lambda$ is the set of orbits that stay bounded. each $A_n$ is a finite union of open intervals, $\bigcup A_n$ is open dense, so $\Lambda$ is closed nowhere-dense. removing a middle gap and recursing yieldxs the standard Cantor construction, so $\Lambda$ is a [[Cantor Set]], $g_a$-invariant.

for $a > 2 + \sqrt 5$, $|g_a'| > 1$ uniformly on $\Lambda$, so $g_a|_\Lambda$ is conjugate to the full one-sided 2-shift $\sigma : \Sigma_2 \to \Sigma_2$. that gives:

- dense periodic orbits in $\Lambda$ (periodic sequences are dense in $\Sigma_2$)
- a dense orbit in $\Lambda$ (concatenate all finite words)
- sensitive dependence ($\lambda \geq \ln(\inf |g_a'|) > 0$)

$\Lambda$ is a chaotic set.

**not an attractor**: every $x \in [0,1] \setminus \Lambda$ is in some $A_n$ and escapes to $-\infty$, so the basin has empty interior. chaotic repeller, not attractor.

### B

Smale horseshoe $H : S \to \mathbb{R}^2$ on the unit square: contract horizontally by $\lambda < 1/2$, stretch vertically by $\mu > 2$, fold so $H(S) \cap S$ is two disjoint horizontal strips $H_0, H_1$. backward image $H^{-1}(S) \cap S$ is two vertical strips $V_0, V_1$.

invariant set

$$
\Lambda = \bigcap_{n \in \mathbb{Z}} H^n(S).
$$

at each iterate forward we keep two strips out of one (cantor in vert direction); each iterate backward halves the horizontal direction. so $\Lambda \cong C \times C$, product of two Cantor sets.

itinerary map $\phi : \Lambda \to \Sigma_2^{\mathbb{Z}}$,

$$
\phi(x)_n = i \iff H^n(x) \in H_i
$$

(equivalently $\in V_i$ via the symmetric setup) is a homeomorphism conjugating $H|_\Lambda$ to the two-sided shift $\sigma$. semi known conjucgacy

shift $\sigma$ on $\Sigma_2$ has dense periodic orbits, a dense orbit, sensitive dependence. conjugacy carries all three accross to $\Lambda$. positive Lyapunov exponent comes for free from the vertical stretch: $\lambda = \ln \mu > 0$.

so $\Lambda$ is a chaotic invariant set inside the horseshoe.

> [!Success] Answer
> **(a)** $\Lambda = \bigcap_n g_a^{-n}([0,1])$ is a Cantor set, $g_a|_\Lambda$ conjugate to the 2-shift, hence chaotic. all $x \notin \Lambda$ escape to $-\infty$, so the basin has empty interior - not an attractor.
> **(b)** $\Lambda = \bigcap_{n \in \mathbb{Z}} H^n(S) \cong C \times C$, conjugated to the two-sided 2-shift via itineraries. shift dynamics is chaotic (dense periodics, dense orbit, sensitivity), conjugacy transfers it to $\Lambda$.

---

## Problem 3

> [!Question]
> For the piecewise linear maps shown in **(A)** Figure 6.10, **(B)** 6.13, and **(C)** 6.14, find all periods for which there are periodic points.

use the transition graphs. for these Markov piecewise-linear maps, a closed path of length $n$ gives a point with $f^n(x)=x$. if the path is not a repeated shorter word, the point has exact period $n$.

### A

graph has arrows

$$
A \to B, \qquad B \to A, \qquad B \to B.
$$

there is a loop at $B$, so period $1$ occurs. for any $n\geq 2$, take the closed path

$$
A \to B \to B \to \cdots \to B \to A
$$

with $n$ arrows. the corresponding word contains exactly one $A$, so it cant be a repetition of a shorter word.

so Figure 6.10 has periodic points of every period.

### B

the graph splits into two invariant components:

$$
\{A_1,A_2\}, \qquad \{A_3,A_4\}.
$$

inside each component both intervals map across both intervals; in particular there are self-loops and arrows both ways. the self-loops give fixed points. for $n\geq 2$, for example,

$$
A_1 \to A_2 \to A_2 \to \cdots \to A_2 \to A_1
$$

is a primitive closed path of length $n$. same story in the $A_3,A_4$ component.

so Figure 6.13 also has periodic points of every period.

### C

the graph has arrows

$$
A \to C, \qquad B \to C, \qquad C \to A, \qquad C \to B.
$$

so away from the boundary fixed point, every orbit alternates between $C$ and $A\cup B$. therefore every closed path in the transition graph has even length.

all even periods occur. for $2m$, use the primitive closed path

$$
C \to B \to C \to A \to C \to A \to \cdots \to C
$$

of length $2m$ (for $m=1$, just $C\to B\to C$).

there is also a fixed point: the decreasing branch crosses the diagonal at $x=d$, and $f(d)=d$.

so Figure 6.14 has period $1$ and all even periods, but no odd periods greater than $1$.

> [!Success] Answer
> **(A)** all periods $n\geq 1$.  
> **(B)** all periods $n\geq 1$.  
> **(C)** periods $1,2,4,6,8,\ldots$, i.e. $1$ and every even period, with no odd periods larger than $1$.

---

## Problem 4

> [!Question]
> Let
>
> $$
> f(x, y) = \left(\frac{4}{\pi}\arctan x,\ \frac{y}{2}\right)
> $$
>
> and find all forward limit sets, attractors, and basins for each attractor. What is the basin boundary, and where do these points go under iteration?

write the map as

$$
f(x,y) = (h(x), y/2), \qquad h(x) = \frac{4}{\pi}\arctan x.
$$

the coordinates decouple, and immediately

$$
y_n = \frac{y_0}{2^n} \to 0.
$$

so everything is decided by the 1D map $x_{n+1} = h(x_n)$.

fixed points solve

$$
x = \frac{4}{\pi}\arctan x.
$$

obvious solutions are $x=-1,0,1$. there are no others: for $q(x)=h(x)-x$,

$$
q'(x)=\frac{4}{\pi(1+x^2)}-1,
$$

so on $x>0$, $q$ increases once, then decreases forever; since $q(0)=q(1)=0$, the only positive zero is $1$. oddness gives the negative zero $-1$.

sign picture uields:

$$
\begin{array}{c|cccc}
x & (-\infty,-1) & (-1,0) & (0,1) & (1,\infty) \\
\hline
h(x)-x & + & - & + & -
\end{array}
$$

so if $x_0>0$, the $x$-orbit is monotone toward $1$. if $x_0<0$, toward $-1$. if $x_0=0$, it stays at $0$.

therefore the forward limit sets are exactly

$$
\omega(x_0,y_0)=
\begin{cases}
\{(1,0)\}, & x_0>0,\\[2mm]
\{(0,0)\}, & x_0=0,\\[2mm]
\{(-1,0)\}, & x_0<0.
\end{cases}
$$

now check stability:

$$
Df(x,y)=
\begin{pmatrix}
\dfrac{4}{\pi(1+x^2)} & 0\\
0 & \dfrac12
\end{pmatrix}.
$$

at $(\pm 1,0)$ the eigenvalues are $2/\pi$ and $1/2$, both less than $1$ in modulus. so $(1,0)$ and $(-1,0)$ are attracting fixed points (sinks), constitent with the sign picture above. their basins are

$$
B(1,0)=\{(x,y):x>0\}, \qquad B(-1,0)=\{(x,y):x<0\}.
$$

at $(0,0)$ the eigenvalues are $4/\pi>1$ and $1/2<1$, so the origin is a saddle, not an attractor. its stable set is only the $y$-axis.

the basin boundary is the common boundary of the two half-plane basins:

$$
\partial B(1,0)=\partial B(-1,0)=\{0\}\times \mathbb{R}.
$$

points on this boundary stay on it forever:

$$
f^n(0,y)=\left(0,\frac{y}{2^n}\right) \to (0,0).
$$

> [!Success] Answer
> forward limit sets: $\{(1,0)\}$ for $x_0>0$, $\{(-1,0)\}$ for $x_0<0$, and $\{(0,0)\}$ for $x_0=0$. the attractors are the two sinks $(1,0)$ and $(-1,0)$, with basins $x>0$ and $x<0$. their common basin boundary is the $y$-axis; boundary points satisfy $f^n(0,y)=(0,y/2^n)$ and converge to the saddle $(0,0)$.

---

## Problem 5

> [!Question]
> Let $g_a(x) = ax(1-x)$. Use matlab to answer the following two questions. Turn in your code with your answers.
>
> **(a)** Choose a subinterval of length $0.01$ in the parameter $a$ which appears to contain only chaotic attractors (for example, an interval just shy of $a = 4$ in Figure 6.3(a)). Magnify the region until a periodic window is located and find the smallest period among the orbits in the window.
>
> **(b)** Choose a point $p$ on the attractor of $g_a$ for $a = 3.9$. Find this point by taking the $10^4$th point of a trajectory in the basin. Choose another point $x$ in the basin and let $m_n$ be the minimum distance between $p$ and the first $n$ iterates of $x$. Plot $m_n$ vs $n$. Does $m_n \to 0$ as $n \to \infty$? Can you quantify the rate at which it goes to zero? In other words, what is the function $f$ such that $f(n) \approx m_n$? Suggest a potential mechanism for this relationship.
>
> **Suggestions:**
>
> - Only plot the point $(n, m_n)$ if $m_n$ and $m_{n-1}$ are distinct from each other, i.e. if the minimum distance has changed
> - Make your plot axes logarithmic and use dots rather than lines, e.g. `loglog(n,m,'k.')`
> - Do this for many different points $x$, e.g. $10^3$ of them, to get a statistical sample of the typical behavior
> - As you estimate $m_n$ for $n \to \infty$, do at least $N = 10^4$ iterates

used python instead of matlab.

### A

picked the length `0.01` interval

$$
a \in [3.99,4.00].
$$

at normal resolution it looks chaotic basically everywhere. zooming into

$$
a \in [3.99024,3.99034]
$$

reveals a small stable periodic window. at

$$
a = 3.99026704
$$

orbit repeats with period $5$ after burn-in. the detected cycle is approximately

$$
0.00968565 \to 0.03827401 \to 0.14687816 \to 0.50000028 \to 0.99756676 \to 0.00968565.
$$

so the smallest period in this window is $5$.

![[hw12_p5a_window.png]]

### B

for $a=3.9$, taking the $10^4$th point of the trajectory starting at $x_0=0.2$ gave

$$
p \approx 0.758063440191.
$$

$1000$ random starting points in $(0,1)$, iterated each for $N=10^5$, tracking

$$
m_n = \min_{0\leq k\leq n} |x_k-p|.
$$

fitting the median accross the $1000$ orbits for $n\geq 1000$ gave

$$
m_n \approx 0.594\, n^{-1.024} \approx \frac{C}{n}.
$$

![[hw12_p5b_min_distance.png]]

mechanism: after the transient, the chaotic orbit behaves roughly like samples from the invariant density on the attractor. if the density near $p$ is $\rho(p)$, then the chance that one iterate lands within distance $\epsilon$ of $p$ is about $2\rho(p)\epsilon$. after $n$ roughly independent tries, the nearest hit should satisfy

$$
2\rho(p)n\epsilon \approx 1,
$$

so $\epsilon \approx C/n$. matchexs the standard recurrence / nearest-neighbor extreme value statistics for a mixing chaotic map.

> [!Success] Answer
> **(a)** On the interval $[3.99,4.00]$, zooming near $a=3.99026704$ reveals a stable period-$5$ window. the smallest period in that window is $5$.  
> **(b)** For $a=3.9$, using $p\approx0.758063440191$ and $1000$ random initial points, the closest-return distance decreases like $m_n\approx0.594n^{-1.024}$, essentially $C/n$. happens because a chaotic orbit samples invariant measure, so nearest hit to a f.p. among $n$ samples is typically order $1/n$.

### Code

```python
import numpy as np
import matplotlib.pyplot as plt


def g(a, x):
    return a*x*(1-x)


def bifurcation(a_min, a_max, n_a=2600, burn=4000, keep=220):
    a = np.linspace(a_min, a_max, n_a)
    x = np.full(n_a, 0.2718281828)
    for _ in range(burn):
        x = g(a, x)
    aa, xx = [], []
    for _ in range(keep):
        x = g(a, x)
        aa.append(a.copy())
        xx.append(x.copy())
    return np.concatenate(aa), np.concatenate(xx)


def period_estimate(a, burn=100000, keep=2000, max_period=200, tol=1e-10):
    x = 0.123456789
    for _ in range(burn):
        x = g(a, x)
    xs = np.empty(keep)
    for i in range(keep):
        x = g(a, x)
        xs[i] = x
    tail = xs[keep//2:]
    for p in range(1, max_period+1):
        if np.max(np.abs(tail[p:] - tail[:-p])) < tol:
            return p, np.sort(xs[-p:])
    return None, xs


# part a
fig, axes = plt.subplots(1, 2, figsize=(12, 4), sharey=True)
for ax, interval, burn, keep in [
    (axes[0], (3.99, 4.00), 4000, 220),
    (axes[1], (3.99024, 3.99034), 8000, 260),
]:
    aa, xx = bifurcation(*interval, burn=burn, keep=keep)
    ax.plot(aa, xx, 'k,', markersize=0.4)
    ax.set_xlim(*interval)
    ax.set_ylim(0, 1)
    ax.set_xlabel('a')
axes[0].set_ylabel('x')
axes[0].set_title('a in [3.99, 4.00]')
axes[1].set_title('zoom: period-5 window')
axes[1].axvline(3.99026704, color='k', lw=1.0, linestyle='--')
period, cycle = period_estimate(3.99026704)
print(period, cycle)


# part b
p = 0.2
for _ in range(10000):
    p = g(3.9, p)

rng = np.random.default_rng(12)
M, N = 1000, 100000
x = rng.random(M)
mins = np.full(M, np.inf)
checkpoints = np.unique(np.logspace(1, np.log10(N), 260).astype(int))
checkpoint_set = set(checkpoints.tolist())
ns, med = [], []

for n in range(1, N+1):
    x = g(3.9, x)
    mins = np.minimum(mins, np.abs(x - p))
    if n in checkpoint_set:
        ns.append(n)
        med.append(np.median(mins))

ns = np.array(ns)
med = np.array(med)
mask = ns >= 1000
slope, intercept = np.polyfit(np.log(ns[mask]), np.log(med[mask]), 1)
C = np.exp(intercept)

plt.figure(figsize=(6, 5))
plt.loglog(ns, med, 'k.', markersize=3, label='median $m_n$')
plt.loglog(ns[mask], C*ns[mask]**slope, 'k--', lw=1.5,
           label=f'fit: {C:.3f} n^{{{slope:.3f}}}')
plt.xlabel('n')
plt.ylabel('$m_n$')
print(p, C, slope)
```
