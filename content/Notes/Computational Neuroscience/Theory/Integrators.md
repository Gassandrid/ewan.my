---
class:
  - note
tags:
  - comp-neuro/theory/dynamics
source:
related:
author:
description:
aliases:
  - Integrator
date: 2026-08-03T20:07:01-07:00
updated: 2026-08-05T14:06:54-07:00
---
 

In [[Eugene M. Izhikevich]]'s [[Neural Dynamics]] work, Integrators represent [[Neuron]]s or computational models that accumulate incoming activity and fires an [[Action Potentials|Action Potential]] when a threshold is reached. Essentially a signal summation mechanism.

While models of integrators go far back to the breakout work of hte [[Hodgkin Huxley Model|Hodgkin Huxley]] and [[Morris-Lecar Model|Morris Lecar]] models, they are most often represented as the classic [[Leaky Integrate And Fire]] model. These are the standard for neuromorphic computing platforms like intel's loihi chip.

Usually in the context of a single neuron model like that of [[Morris-Lecar Model|Morris Lecar]]/[[Hodgkin Huxley Model|Hodgkin Huxley]] models, we see manifest as a [[Saddle-Node on Invariant Circle|Saddle Node on Invariant Circle]] bifurcation, meaning the [[Attracting fixed point|attracting]] and [[Repelling fixed point|repelling]] fixed points collide and annihilate.

![[SNICBifurcationScene.mp4]]
