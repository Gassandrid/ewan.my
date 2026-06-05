---
date: 2026-02-08T07:47:07-05:00
updated: 2026-03-13T15:19:24-07:00
tags:
  - comp-neuro/theory
  - physics
  - math/chaos/dynamics
aliases:
  - MFT
class:
  - note
source:
related:
author:
description:
---

Mean field theory comes from phsyics in explaining phenomena like the [[Ising Model]], but in neuroscience allows us to approximate the collective behavior of large, densely connected sub neural networks by replacing the individual synapse inputs with an average/mean field input.

Essential for reducing complexity and allows for high order extensions of individual [[Dynamical Systems Theory|dynamical system]] [[Neuron]]s like the [[Hodgkin Huxley Model]].

---

## Collapsing down [[Hodgkin Huxley Model]] to a Single Plane

Mean field theory allows us to bring down the $\sum J_{ij}G(x_{j})$ term into a singular field.

We dont track exactly which neuron pushes which, and instead assume that each neuron $i$ feels a collective average field influence from the rest of the population.

If global population firing rate is $\mathcal{V}(t)$, then input current to neuron $i$ becomes a [[Gaussian Distribution|Gaussian]] [[CH2 - Random Variables|random variable]] thanks to [[Central Limit Theorem]]. $\mu$ as proportional to network activity, and $\sigma^2$ as proportial to network fluctuations/noise.

$$
\tau \frac{dV}{dt} = -V + \mu(V,t) + \sigma(V,t) \xi(t)
$$

Thus reducing $N$ coupled equations to one singular consistent equation. This is usually a [[Fokker-Planck]] equation to describe the probability density of [[Membrane Potential]]s.

---

## Connections with [[Ising Model]]

Ising model acts as a sort of skeleton for attractor dynamics.

To form a mapping from Continuous Dynamical Systems to the Ising Model, we usually can perform a [[Course-Grained Modeling|Course-Grained]] model of time/state.

For **discretization**, we can ignore the sub threshold trajectory of $V_{m}$ to focus on output as either *spiking*$(+1)$ or *silent*$(-1 \ or \ 0)$.  As a **symmetry**, we then map the neuron state $S_{i}$ to an [[Ising Model|Ising]] spin $\sigma_{i}$ .

Probability of network being in a given configuration state $\{ S_{1},S_{2},\dots,S_{N} \}$ is given by [[Boltzmann Machine|Boltzmann]] distribution:

$$
P(\{ S \}) = \frac{1}{Z}e^{-\beta H(\{ S \})}
$$

and our [[Hamiltonian]] energy function is:

$$
H=-\frac{1}{2}\sum_{i\neq j}J_{ij}S_{i}S_{j} - \sum_{i}h_{i}S_{i}
$$
