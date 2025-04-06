---
date: 2025-04-05
updated: 2025-04-05
fileClass: note
tags:
  - math/calculus
  - neuroscience/theory
  - todo
---
  

The **Neural Response Function** is quite simply just the sum of all [[Dirac Delta Function]]'s for a number $n$ neuron spikes over a  certain time. 

We denote the times in which these spikes occur as a list of times $t$, where a time $i=1,2,\dots,n$ is $t_{i}$.

The trial when spikes are recorded is denoted to start at time $0$ and end at a time $T$, where the bounds are:

$$
0 \leq t_{i} \leq T \quad \forall i
$$

The Neural Response function is represented as the **sum** of infinitesimally narrow, idealized spikes in the form of these [[Dirac Delta Function]]s.[^1]

$$
\rho(t) = \sum_{i=1}^n \delta(t - t_{i})
$$

---

This neural response function can then be used to express sums over spikes as integrals over time.

An example, well behaved function could look like:

$$
\sum_{i=1}^n h (t-t_{i}) = \int_{-\infty}^\infty d
$$

[^1]: Dayan, Peter, and Laurence F. Abbott. _Theoretical Neuroscience: Computational and Mathematical Modeling of Neural Systems_. MIT Press, 2005.​[](https://mitpressbookstore.mit.edu/book/9780262541855?utm_source=chatgpt.com)