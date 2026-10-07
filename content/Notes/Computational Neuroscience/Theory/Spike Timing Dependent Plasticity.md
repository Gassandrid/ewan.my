---
class:
  - note
tags:
  - comp-neuro/theory
  - cs/ai/learning
source:
  - https://artemkirsanov.substack.com/p/every-spike-rewires-the-rule
related:
author:
description:
aliases:
date: 2026-05-22T19:07:22-07:00
updated: 2026-09-15T15:30:14-04:00
---

A biological process that adjusts the [[Synapses|synaptic]] connection strength between neurons based on the exact timing of their firing. Foundational learning rule for how the brain refines [[Neural Circuit]]s, encoding [[Memory Formation|memory]], and processing input sensory information.

## Mechanism

- [Spike timing-dependent plasticity and memory](https://www.sciencedirect.com/science/article/abs/pii/S0959438823000326) paper
	- Operates on millisecond timescale, determining if connection gets stronger or weaker
- [[Long Term Potentiation]] - if [[Presynaptic Neurons|presynaptic neuron]] fires just **before** [[Postsynaptic Neurons|postsynaptic neuron]], [[Synapses|synapse]] is strenghthened

should read https://artemkirsanov.substack.com/p/every-spike-rewires-the-rule

---

## In Deep Learning ( [[09-12-2026]] )

This principle is also applied in the field of deep learning as a biologically plausible learning algorithm, specifically used to train [[Spiking Neural Network]]s by adjusting synaptic weights based on the exact relative timing of pre- and post-synaptic spikes.... basically same thing as above

In this case we have:

- causal firing ( [[Long Term Potentiation|LTP]] ); same as above, if presyn neuron fires just before post syn neuron, synapse strenghtened
- anti causal firing ( [[Long Term Depression]] ); if a [[Presynaptic Neurons]] fires just *after* a [[Postsynaptic Neurons]], the connection strength decreases
- locality; updates depend only on local spike timing rather than a global error signal, ideal for even driven systems like that of [[Spiking Neural Network]]s and [[Neuromorphic Computing]] in general.
