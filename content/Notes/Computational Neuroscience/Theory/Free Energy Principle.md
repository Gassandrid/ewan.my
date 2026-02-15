---
created_on: "[[09-05-2025]]"
class:
  - note
tags:
  - comp-neuro/theory
  - math/information
  - math/probability/bayesian
source:
  - "[[The free-energy principle a unified brain theory? - Nature Reviews Neuroscience]]"
related:
author:
  - "[[Karl Friston]]"
date: 2025-09-05
updated: 2026-01-20T09:45:12-05:00
---
The **Free Energy Principle** is a mathematical principle borrowed from _information theory_. It theorizes that the universal goal of living systems is to minimize a quantity of "free energy" in order to maintain their existence in a dynamic world. [@fristonFreeenergyPrincipleUnified2010]

The "free energy" quantity can be though of as an **Isomorphism** to the idea of "Entropy" as a quantity in Information Theory, in combination with approaches from [[Bayesian Inference]].

![[FreeEnergyDiagram.png]]

---

This is already _sort of_ the case for [[Backward Propagation]] based machine learning models, which are tasked with minimizing a [[Loss Functions|Loss Function]] as their quantity. However, their approach is more narrow in scope, as they are only trying to minimize loss for a specific task, rather than maintaining their overall existence.

Think of the example of identifying an image of a predator like a tiger. A machine learning model trained to identify tigers will minimize its loss function when it correctly identifies the tiger in an image. However, this does not necessarily contribute to the model's overall survival or adaptability in a changing environment.
