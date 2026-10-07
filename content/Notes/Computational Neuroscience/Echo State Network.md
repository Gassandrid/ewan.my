---
class:
  - note
tags:
  - cs/ai/recurrent/reservoir
  - comp-neuro/models
source:
related:
author:
description:
aliases:
date: 2026-10-07T14:58:34-04:00
updated: 2026-10-07T15:06:07-04:00
---


- one of the most common implementations of the [[Reservoir computing]] paradigm
	- ESNs use large random fixed [[Recurrent Neural Network|RNN]]s for its core hidden reservoir layer
	- like any reservoir network, the trained parameters reside in the **readout** layer, only  weights trained are those connecting to final output, usually using something like [[Linear and Nonlinear Regression|linear]] or [[Normalization, Regularization, and Gradient Descent for Linear Regression|Ridge Regression]] 
- **echo state property**: reservoir must satisfy the ESP, meaning the internal dynamics must fade out past initial states and reliably echo the history of the input signal
- share conceptual roots with [[Liquid State Machines]], as while they are frequently adapted into [[Spiking Neural Network]]s to model the precise event-based [[Temporal Dynamics]] of biological [[Neuron]]s
- [[Brain Computer Interfaces]] use these a lot for decoders, as they are great for low latency real time processing as only the linear readout layer is trained
- [[FlyWire|Drosophila Connectome]] simulations that you see everywhere often use these.

![[echoStateNetwork.png]]
