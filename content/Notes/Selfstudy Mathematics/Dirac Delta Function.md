---
date: 2025-04-05
created_on: "[[04-05-2025]]"
updated: 2025-09-16
tags:
  - math/calculus
class:
  - note
---
The **Dirac Delta Function** is a distribution over a curve to represent a **unit impulse**. Essentially, it is a generalized function on the real numbers, which has a value of zero at all places except at zero itself.

In reality, it is just a "spike" or a near direct upward line on an otherwise flat curve. The reason this is interesting is this "impossible" to model as a curve with a function, and thus we have to use calculus limits to estimate as we approach $\infty$.

---

## Use

This impossible function is quite useful for modeling instantaneous impulses. It is called the delta function because it is a continuous analogue of the [Kronecker delta](https://en.wikipedia.org/wiki/Kronecker_delta "Kronecker delta") function, which is usually defined on a discrete domain and takes values 0 and 1.

For my case, the function is quite usefull for modeling neuronal spike trains and firing rates.

---

## Representation

We can represent it heuristically as:

$$
\delta(x) = \begin{cases}
0, & x \neq 0 \\
\infty, & x=0
\end{cases}
$$

As an integral:

$$
\int_{-\infty}^\infty \delta(x) dx = 1
$$

As a interactive desmos graph(*approximation*):

> [!Info] Desmos
> <iframe src="https://www.desmos.com/calculator/hp1mkjfpir" width=600 height="400" ></iframe>
