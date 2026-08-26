---
date: 2026-07-12T13:05:04-07:00
updated: 2026-07-28T18:41:12-07:00
class:
  - note
tags:
  - comp-neuro/theory
source:
  - https://en.wikipedia.org/wiki/BCM_theory
related:
author:
description:
aliases:
  - BCM
  - BCM Theory
  - Bienenstock Cooper Munro Theory
---

- fundamental and foundational rule for [[synaptic plasticity]] for describing how neurons develop *selectively*, things like visual orientation and ocular dominance.
- Traditional [[Hebbian learning|Hebbian Plasticity]] has runaway dynamics, where correlated/high activity strenghthens a synapse, raising future activity, strengthening it further.
	- *no mechanism for connections to get weaker, and no upper bound for how strong they can get*
- BCM formed as gradual modifications and additions to traditional hebb rules, normalizing it and allowing for decay of synapses, where no activity or unsynchronized activity between neurons results in a loss of connection strength
	- formalized mathematically in Bienenstock, Cooper, and Munro's 1982 paper

Formally,

$$
\frac{dm_{j}(t)}{dt} = \phi ( \mathbf{c}(t) )j_{j}(t) - \epsilon m_{j}(t)
$$

- $m_{j}$ is synaptic weight of jth synapse
- $d_{j}$ is the jth synapse input current
- $c(t)=\mathbf{w}(t)\mathbf{d}(t) = \sum_{j} w_{j}(t)d_{j}(t)$ is weighted sum of currents
- $\phi(c)$ non linear function that must change sign at some threshold $\theta_{M}$, $\phi(c)<0 \iff c<\theta_{M}$
- $\epsilon$ time constant for uniform synapse decay
