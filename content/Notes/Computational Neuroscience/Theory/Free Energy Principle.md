---
class:
  - note
tags:
  - comp-neuro/theory
  - math/information
  - math/statistics/bayesian
source:
  - "[[The free-energy principle a unified brain theory? - Nature Reviews Neuroscience]]"
related:
author:
  - "[[Karl Friston]]"
date: 2025-09-05
updated: 2026-01-19T12:04:02-05:00
---

The **Free Energy Principle** is a mathematical principle borrowed from _information theory_. It theorizes that the universal goal of living systems is to minimize a quantity of "free energy" in order to maintain their existence in a dynamic world.[^1]

The "free energy" quantity can be though of as an **Isomorphism** to the idea of "Entropy" as a quantity in Information Theory, in combination with approaches from [[Bayesian Inference]].

![[FreeEnergyDiagram.png]]

---

This is already _sort of_ the case for [[Backward Propagation]] based machine learning models, which are tasked with minimizing a [[Loss Functions|Loss Function]] as their quantity. However, their approach is more narrow in scope, as they are only trying to minimize loss for a specific task, rather than maintaining their overall existence.

Think of the example of identifying an image of a predator like a tiger. A machine learning model trained to identify tigers will minimize its loss function when it correctly identifies the tiger in an image. However, this does not necessarily contribute to the model's overall survival or adaptability in a changing environment.

[^1]: Friston, K. (2010). The free-energy principle: A unified brain theory? _Nature Reviews Neuroscience_, _11_(2), 127–138. [https://doi.org/10.1038/nrn2787](https://doi.org/10.1038/nrn2787)
