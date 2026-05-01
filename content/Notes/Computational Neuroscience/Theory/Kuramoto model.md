---
date: 2026-03-13T16:22:08-07:00
updated: 2026-04-02T09:56:30-04:00
class:
  - note
tags:
  - comp-neuro/models
  - math/waves/oscillator
  - math/calculus/differential
source:
related:
author:
description:
aliases:
  - Kuramoto order parameter
---

Model incredibly useful for describing synchronization, in the case of a large set of couple oscillators. While motivated for chemical/biological oscilliations, has found use in neuroscience and more specifically [[Computational Neuroscience]] for plasible modeling. [[pathakBiomimeticModelCorticostriatal2024|Biomimetic model of corticostriatal micro-assemblies discovers new neural code]][@pathakBiomimeticModelCorticostriatal2024] used this for their [[Neural Circuit]] based approach.

<iframe width="480" height="360" frameborder="0" loading="lazy" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; web-share" allowfullscreen src="https://commons.wikimedia.org/wiki/File:KuramotoModelPhaseLocking.ogv?embedplayer=true" />

For a standard version of the model, we consider each oscillator to have its own "natural frequency" $\omega_{i}$, and each is also equally coupled to all the other oscillators. 

Despite this being a fully [[Nonlinear]] model, an exact solution can be found as the limit number of oscillators $N\to \infty$. OR one can obtain steady state solutions of the **order parameter**.

$$
\frac{d\theta_{i}}{dt}=\omega _{i} + \frac{1}{N} \sum_{j=1}^{N} K_{ij} \sin(\theta_{j}-\theta_{i}), \quad i = 1\dots N,
$$

This represents a system of $N$ limit-cycle oscillators, which have phases $\theta_{i}$ and a coupling constant of $K$.

## Order Parameter

we can define the order parameters $r$ and $\Psi$ as:

$$
re^{i\Psi} = \frac{1}{N} \sum_{j=1}^{N}  e^{i\theta_{j}}
$$
