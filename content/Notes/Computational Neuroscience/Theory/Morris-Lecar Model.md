---
date: 2026-02-12T13:39:20-05:00
updated: 2026-02-12T15:38:43-05:00
class:
  - note
tags:
  - comp-neuro/models
  - math/dynamical-systems
  - math/calculus/differential/ode
source:
  - "[[Elegant Geometry of Neural Computations]]"
  - https://en.wikipedia.org/wiki/Morris%E2%80%93Lecar_model
related:
author:
description:
aliases:
  - Morris Lecar
  - Morris Lecar Model
---

Simplified version of [[Hodgkin Huxley Model]], becuase it is 2 dimensional instead of 4 dimensional we can visualize it in a [[Dynamical Systems Theory|Phase Plane]].

$$
C \frac{dV}{dt} = \bar{g}_{K}n(E_{K}-V)+\bar{g}_{Na}m_{\infty} (E_{K} - V) + I_{leak}
$$

$$
\frac{dn}{dt} = \frac{n_{\infty}-n}{\tau_{n}}
$$

**Where:**

Variables

- _V_ : [[membrane potential]]
- _N_ : recovery variable: the probability that the K+ channel is conducting

Parameters/Constants

- $I$ : applied current
- $C$ : membrane capacitance
- _g_L, _g_Ca, _g_K : leak, Ca++, and K+ conductances through membranes channel
- _V_L, _V_Ca, _V_K : equilibrium potential of relevant [[ion channels]]
- $V_{1},V_{2},V_{3},V_{4}$: tuning parameters for steady state and time constant
- _$\phi$_: reference frequency

---

Great example is a sub critical [[Andronov Hopf Bifurcation]]

[![kirsanovHopfBifurcationSub.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/01baa3a834de59f662e2aac4be124c143b9e583a6200e166f60300aaac2a531a/kirsanovHopfBifurcationSub.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/01baa3a834de59f662e2aac4be124c143b9e583a6200e166f60300aaac2a531a/kirsanovHopfBifurcationSub.png)
