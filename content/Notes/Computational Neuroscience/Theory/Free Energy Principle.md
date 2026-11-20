---
class:
  - note
tags:
  - comp-neuro/theory
  - math/information
  - math/probability/bayesian
  - comp-neuro/models/active-inference
source:
  - "[[The free-energy principle a unified brain theory? - Nature Reviews Neuroscience]]"
related:
author:
  - "[[Karl Friston]]"
date: 2025-09-05
updated: 2026-09-16T19:09:56-04:00
---

$$
\begin{align}
\underbrace{ F(\mu, a;s) }_{ \text{free energy} } &= \underbrace{ \mathbb{E}_{q(\dot{\psi})} \left[ -\log p(\dot{\psi}, s, a, \mu \mid \psi) \right] }_{ \text{expected energy} }  - \underbrace{ \mathbb{H} \left[ q(\dot{\psi}\mid s,a,\mu,\psi) \right]  }_{ \text{entropy} }  \\
&= \underbrace{ -\log p(s) }_{ \text{suprise} } + \underbrace{ \mathbb{KL} \left[ q(\dot{\psi} \mid s,a, \mu, \psi) \mid \mid p_{Bayes} (\dot{\psi} \mid s,a,\mu,\psi) \right]  }_{ \text{divergence} } \\
&\geq \underbrace{ -\log p(s) }_{ \text{suprise} }
\end{align}
$$

The **Free Energy Principle** is a mathematical principle borrowed from _[[information theory]]_. It theorizes that the universal goal of living systems is to minimize a quantity of "free energy" in order to maintain their existence in a dynamic world. [@fristonFreeenergyPrincipleUnified2010]

The "free energy" quantity can be though of as an **[[Isomorphism]]** to the idea of "[[Entropy in Information|Entropy]]" as a quantity in Information Theory, in combination with approaches from [[Bayesian Inference]].

[![FreeEnergyDiagram.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/2edea48253f3947e105616397dbbcc3d867d6f224231d5ca253121a007845127/FreeEnergyDiagram.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/2edea48253f3947e105616397dbbcc3d867d6f224231d5ca253121a007845127/FreeEnergyDiagram.png)

---

This is already _sort of_ the case for [[Backpropagation]] based [[machine learning]] models, which are tasked with minimizing a [[Loss Functions|Loss Function]] as their quantity. However, their approach is more narrow in scope, as they are only trying to minimize loss for a specific task, rather than maintaining their overall existence.

Think of the example of identifying an image of a predator like a tiger. A machine learning model trained to identify tigers will minimize its loss function when it correctly identifies the tiger in an image. However, this does not necessarily contribute to the model's overall survival or adaptability in a changing environment.
