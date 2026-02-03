---
class:
  - note
tags:
source:
related:
author:
  - Ewan Pedersen
description:
aliases:
date: 2026-01-27T11:28:08-05:00
updated: 2026-01-29T19:18:20-05:00
abstract: "Graduate students (required) and those planning to go to graduate school in a mathematical science (encouraged) should turn in their solutions in LATEX; you will need to learn this language eventually. Submit your solution in a single PDF in Blackboard, including PDF of your code appended to solutions. Check Teams for sample code. Grading: All questions are worth 3 points unless marked otherwise (3 = perfect or nearly so, 2 = close but something missing, 1 = not close but a reasonable attempt, 0 = way off). Excellent solutions will be returned with the graded HW. Disclosure: Please show all your working clearly and list the names of other students with whom you collaborated."
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
title: Assignment 2
---

## Question 1

> [!Question]
> Show that a point $x$ for the map $f (x) = 3x (\mod 1)$ is eventually periodic if and only if it is a rational number.
> Hint: Let $x_0 = 0.a1a2 \dots aN b_1b_2 \dots b_p$ be a rational number written in $base_3$ (i.e. $x0 = a1 1 3 + a2 1 9 + \dots$ ). What happens to this IC under repeated iteration of the map? What if we could find no such $N$ , i.e. if $x_0$ were irrational?

### Answer

Our main breakthrough here is that we can assume the map $f(x) = 3x ( \mod 1)$ acts as the left shift for the base 3 representation.

If $x = 0.a_1a_2a_3\ldots$ in $base_3$, then $f(x) = 0.a_2a_3a_4\ldots$

This says that any rational will eventually settle to a repetitive pattern, whereas irrationals will never repeat.

Let $x_0$ be rational in $base_3$:

$$
x_0 = 0.\underbrace{a_1a_2\cdots a_N}_{\text{intial}}\underbrace{b_1b_2\cdots b_p}_{\text{repetition}}b_1b_2\cdots b_p\ldots
$$

When iterated $N$ times:

$$
F^N(x_{0}) = 0.\overline{b_{1}b_{2}\dots b_{p}}
$$

Which is a pure periodic pattern. Whereas when iterated $N+p$ times:

$$
f^{N+p}(x_{0}) = \overline{b_{1}b_{2}\dots b_{p}} = f^{N}(x_{0})
$$

This is just the same as before. The case for $N+P$ holds for any multiple of $p$ added to $N$.

Meaning the orbit must be periodic eventually with period dividing $p$.

In a unique case where the expansion terminates( something like $x_0 = 0.21$ in base-3), after finitely many iterations we reach $0$, which is a fixed point.

For the case where the orbit is eventually periodic, we can show that $x_0$ must be **rational**.

If the orbit is eventually periodic, then $f^{n+p}(x_0) = f^n(x_0)$ for some $n, p \geq 0$.

In base-3 representation, this means:

$$
0.d_{n+1}d_{n+2}d_{n+3}\ldots = 0.d_{n+p+1}d_{n+p+2}d_{n+p+3}\ldots
$$

This implies the digit sequence repeats with period $p$ starting at position $n+1$.

Therefore $x_0 = 0.a_1\cdots a_n\overline{d_{n+1}\cdots d_{n+p}}$ has an eventually repeating base-3 expansion, which is the definition of a rational number in base-3.

If **irrational**:

The $base_{3}$ expansion will never repeat, as no $N,P$ exist for that. If $f$ only shifts digits left, and no visible repeating pattern, orbit never returns to any given previous value.

---

## Question 2

> [!Question]
> Construct the periodic table for the map $f (x) = 3x (\mod 1)$, up to period 10, using the same set of columns as in HW1. Careful... does the map f have two fixed points or three? Note, $f^2(x) = 9x (\mod 1)$.

### Answer

First we determine quantity of fixed points for $f(x)$, meaning find $f(x)=x$, meaning $3x = x (\mod 1)$, simplified to:

$$
2x = 0 \pmod{1}
$$

This yields us an $x$ with possible fixed points $0$ and $\frac{1}{2}$. 2 on the interval $0,1$.

Someone could mistake it for having 3 if they assumed $x=1$ to be one. $f(1)=3\cdot 1 (\mod 1) = 0$, so it is not one.

For **general pattern** fixed points $f^k$:

We now have $f^k(x)=3^k x ( \mod 1)$, and to show fixed points we must now find:

$$
(3^k - 1)x \equiv 0 \pmod{1}
$$

For this to hold $x$ must be $\frac{n}{3^k-1}$ for $n$ from $0$ to $3^k-2$. And thus, $f^k$ will have exactly $3^k-1$ fixed points.

$$
\begin{align}
k=1: \quad 3^{1} - 1 = 2 \quad works \\
k=2: \quad 3^{2} - 1 = 8 \quad works \\
k=3: \quad 3^{3} - 1 = 26 \quad works
\end{align}
$$

Building period table:

| Period $k$ | Number of fixed points of $f^k$ | Proper divisors of $k$ | Number of fixed points due to periods $<k$ | Number of fixed points due to period $k$ only | Orbits of period $k$ |
| ---------- | ------------------------------- | ---------------------- | ------------------------------------------ | --------------------------------------------- | -------------------- |
| 1          | 2                               | —                      | 0                                          | 2                                             | 2                    |
| 2          | 8                               | 1                      | 2                                          | 6                                             | 3                    |
| 3          | 26                              | 1                      | 2                                          | 24                                            | 8                    |
| 4          | 80                              | 1, 2                   | 8                                          | 72                                            | 18                   |
| 5          | 242                             | 1                      | 2                                          | 240                                           | 48                   |
| 6          | 728                             | 1, 2, 3                | 32                                         | 696                                           | 116                  |
| 7          | 2186                            | 1                      | 2                                          | 2184                                          | 312                  |
| 8          | 6560                            | 1, 2, 4                | 80                                         | 6480                                          | 810                  |
| 9          | 19682                           | 1, 3                   | 26                                         | 19656                                         | 2184                 |
| 10         | 59048                           | 1, 2, 5                | 248                                        | 58800                                         | 5880                 |

---

## Question 3

> [!Question]
> Consider the $3x (mod 1)$ map of the unit interval $[0,1]$. Define the distance between a pair of points $x, y$ to be either $|x − y|$ or $1 − |x − y|$, whichever is smaller. Measure with respect to the 'circle metric', in the sense of Figure 1.11, corresponding to the distance between two points on the circle.
>
> - Show that the distance between any pair of points that lie within 1/6 of one another is tripled by the map.
> - Find a pair of points whose distance is not tripled by the map.
> - Prove sensitive dependence for x0 = 0 for this map, showing that d can be taken to be any positive number less than 1/2 in Definition 1.10, and k can be chosen to be the smallest integer greater than ln( d |x0−x| )/ ln(3).

### Answer

Our circle metrix sees this interval as a circle, where $0$ and $1$ are the same point. We can measure the distance with:

$$
d(x,y) = \min(|x-y|, 1-|x-y|)
$$

yielding shortest arc length for two points on circle.

#### Part A

We seek to show that given $d(x,y) \leq \frac{1}{6}$, then $d(f(x), f(y)) = 3 \cdot d(x,y)$.

To do this, we can leverage the fact that if there exists two points within a $\frac{1}{6}$ separation, then tripling will not go above $\frac{1}{2}$, meaning no wrapping occurs.

To **prove this**, we:

will assume $d(x,y) \leq \frac{1}{6}$. Meaning, shorter arc length between $x$ and $y$ can at the very most be $\frac{1}{6}$. After applying $f$:

$$
f(x) = 3x \pmod{1}, \quad f(y) = 3y \pmod{1}
$$

The map has now stretched circle by factor of 3, and wraps 3 times around. however, since $x$ and $y$ are within the $\frac{1}{6}$ range, they do not get separated by wrapping.

After the mapping we get following distance:

$$
|f(x) - f(y)| \pmod{1} = |3x - 3y| \pmod{1} = |3(x-y)| \pmod{1}
$$

But, since our distance $|x-y| \leq \frac{1}{6}$, we now have $|3(x-y)| \leq \frac{1}{2}$.

Meaning tripled distance still less than $\frac{1}{2}$.

$$
d(f(x), f(y)) = |3(x-y)| = 3|x-y| = 3 \cdot d(x,y)
$$

and is actually tripled exactly.

#### Part B

We seek to find points that interfere with wrapping, and thus where distance is not tripled. An ideal would be one that maps to $0$ after its wrapping. We will set this as our condition:

$$
  x=0 \quad y=\frac{2}{3}
$$

$$
d(0, \tfrac{2}{3}) = \min(\tfrac{2}{3}, \tfrac{1}{3}) = \tfrac{1}{3}
$$

and after $f$:

$$
f(0) = 0, \quad f(\tfrac{2}{3}) = 3 \cdot \tfrac{2}{3} = 2 \pmod{1} = 0
$$

$$
d(f(0), f(\tfrac{2}{3})) = d(0, 0) = 0
$$

If the distances really were trippled, we would expect to see $3 \times \frac{1}{3} = 1$. But instead we got $0$, as both points wrapped around to same location.

Second pair: $x = \frac{1}{4}$ and $y = \frac{3}{4}$:

$$
d(\tfrac{1}{4}, \tfrac{3}{4}) = \min(\tfrac{1}{2}, \tfrac{1}{2}) = \tfrac{1}{2}
$$

After mapping:

$$
f(\tfrac{1}{4}) = \tfrac{3}{4}, \quad f(\tfrac{3}{4}) = \tfrac{9}{4} \pmod{1} = \tfrac{1}{4}
$$

$$
d(\tfrac{3}{4}, \tfrac{1}{4}) = \tfrac{1}{2}
$$

The distance stayed the same ($\frac{1}{2}$), not tripled to $\frac{3}{2}$ (which would wrap to $\frac{1}{2}$ on the circle anyway, but the point is the mechanism is different).

#### Part C

Proving sensitive dependence for ICs for fixed point $x_0 = 0$:

Given that $f(0) = 0$, we have $f^k(0) = 0$ $\forall$ $k \geq 0$.

we can take any nearby point $x \neq 0$ for $d(0, x) = |x| < \delta$ for an infitesimally small $\delta > 0$.

we can then iterate $f$ on $x$:

$$
f^k(x) = 3^k x \pmod{1}
$$

we notice that this distance form point $0$ is growing exponentially:

$$
d(0, f^k(x)) = d(0, 3^k x \pmod{1})
$$

Because this $3^k x$ does grow exponentially, we know that eventually, it will overpower any threshold $d < \frac{1}{2}$.

We now seek to find $k$ such that:

$$
d(0, 3^k x \pmod{1}) \geq d
$$

This happens when $3^k |x| \geq d$ (ignoring the modular wrapping for the lower bound, since wrapping only makes things potentially farther).

(rewriting above) although this only holds when $3^k |x| \geq d$, however not for the lower bound wrapping case(we dont consider since this process only enlarges more)

Solving for $k$:

$$
3^k |x| \geq d \implies k \geq \frac{\ln(d/|x|)}{\ln 3} = \frac{\ln d - \ln|x|}{\ln 3}
$$

And thus we have

$$
k = \left\lceil \frac{\ln(d/|x|)}{\ln 3} \right\rceil
$$

as the smallest integer greater than $\frac{\ln(d/|x|)}{\ln 3}$.

Thus, for any $d$ under the $\frac{1}{2}$ threshold and $\delta > 0$, there will be a opint $x$ with $d(0,x) < \delta $ S.T. $d(f^k(0), f^k(x)) > d$ for $k$ given.

---

## Question 4

> [!Question]
> Find the left and right endpoints of the subinterval LLR for the logistic map G(x) = 4x(1 − x).

### Answer

We can understand the symbolic dynamics for the logistic map by first partitioning the interval $[0,1]$ at the critical point $x = \frac{1}{2}$:

We now have a left section ($L = [0, \frac{1}{2}]$) and right section ($R = [\frac{1}{2}, 1]$). We will make combinations of these symbols to represent itineraries of points under iteration of $G$.

Such an itenerary like **LLR** would mean we seek all points $x$, where 1. $x \in L$ (left) 2. $G(x) \in L$ (still left) 3. $G^2(x) \in R$ (finally jumps right).

To find the region, we will work backwards from the last condition.

1. Find preimage of $R$ under $G$.

we seek $G(y) \geq \frac{1}{2}$

$$
4y(1-y) \geq \frac{1}{2} \implies 8y^2 - 8y + 1 \leq 0
$$

quadratic formula yields

$$
y = \frac{2 \pm \sqrt{2}}{4}
$$

and thus

$$
G^{-1}(R) = \left[\frac{2-\sqrt{2}}{4}, \frac{2+\sqrt{2}}{4}\right]
$$

2. Points mapping to $G^{-1}(R) \cap L$

we seek $G(x) \in \left[\frac{2-\sqrt{2}}{4}, \frac{1}{2}\right]$.

map $G(x) = 4x(1-x)$ yields two inverse branches:

$$
g_L(y) = \frac{1 - \sqrt{1-y}}{2}, \quad g_R(y) = \frac{1 + \sqrt{1-y}}{2}
$$

solving endpoints $y = \frac{2-\sqrt{2}}{4}$ and $y = \frac{1}{2}$:

$y = \frac{1}{2}$: yields $g_L(\frac{1}{2}) = \frac{2-\sqrt{2}}{4}$ and $g_R(\frac{1}{2}) = \frac{2+\sqrt{2}}{4}$.

$y = \frac{2-\sqrt{2}}{4}$: first $\sqrt{1-y} = \frac{\sqrt{2+\sqrt{2}}}{2}$, yields:

$$
g_L\left(\frac{2-\sqrt{2}}{4}\right) = \frac{2 - \sqrt{2+\sqrt{2}}}{4}, \quad g_R\left(\frac{2-\sqrt{2}}{4}\right) = \frac{2 + \sqrt{2+\sqrt{2}}}{4}
$$

our full pre image is now

$$
G^{-1}\left(\left[\frac{2-\sqrt{2}}{4}, \frac{1}{2}\right]\right) = \left[\frac{2 - \sqrt{2+\sqrt{2}}}{4}, \frac{2-\sqrt{2}}{4}\right] \cup \left[\frac{2+\sqrt{2}}{4}, \frac{2 + \sqrt{2+\sqrt{2}}}{4}\right]
$$

finall we compute intersect with $L$

given that $\frac{2-\sqrt{2}}{4} < \frac{1}{2} < \frac{2+\sqrt{2}}{4}$, means only left interval can lie in $L$

$$
\text{LLR} = \left[\frac{2 - \sqrt{2+\sqrt{2}}}{4}, \frac{2-\sqrt{2}}{4}\right]
$$

> [!Success] Answer
> Left endpoint: $\displaystyle \frac{2 - \sqrt{2+\sqrt{2}}}{4}$
>
> Right endpoint: $\displaystyle \frac{2-\sqrt{2}}{4}$

---

## Question 5

> [!Question]
> Modify the matlab script logistic-period.m found in the Teams channel General/Files/Code (or write one from scratch in a programming language of your choosing) to compute the longest periodic orbit you can find for the function $g_a(x) = ax(1 − x)$. In other words, we know from class that for particular values of the parameter $a$, this map has a period-$K$ orbit for $K = 2N$ , for any $N$ you choose. You should provide me with 3 items: your code, a, and N .

### Answer

#### Code

```python
import numpy as np
import time

itotal = 10**8
x = np.zeros(itotal)
x[0] = np.random.rand()

a = 1 + np.sqrt(6) - 0.1
start_time = time.time()

for i in range(itotal - 1):
    x[i+1] = a * x[i] * (1 - x[i])

print(f"completed in {time.time() - start_time:.2f} seconds.")

T = 35

for i in range(itotal - T, itotal):
    print(f'   {i+1:10d}  {x[i]:1.14f}')


S = 10
tol = 10**(-8)
inside = False

difference = np.zeros(S + 1)

for i in range(S + 1):
    period = 2**i
    diff = abs(x[-1] - x[-1 - period])
    difference[i] = diff

    if (diff < tol) and (not inside):
        print(f'orbit repeats every {period} iterates')
        inside = True
```

#### Results

Period doubling cascade occurs as parameter $a$ approaches the [[Feigenbaum Constant]] accumulation point at $a_\infty \approx 3.569945672...$. Each bifrcation creates orbits period $2^N$, with windows shrinking exponentially.

Used binary search from known bifurcation points ($a = 1 + \sqrt{6} \approx 3.449$ gives period 4) toward the accumulation point, increasing precision every time a higher period was found.

> [!Success] Final Answer
> **N = 15**
>
> **a = 3.56994567175575**
>
> **Period = $2^{15} = 32,768$ iterates**

*note: i did experiment with some fancier algorithms to get a nice and real high $n$, however unfortunately my collab pro got revoked for some reason :(( next time!*
