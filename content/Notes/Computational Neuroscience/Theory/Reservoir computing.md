---
date: 2026-05-08T09:58:13-04:00
updated: 2026-05-08T10:39:31-04:00
class:
  - note
tags:
  - math/chaos
  - cs/ai/recurrent
  - comp-neuro/models
source:
  - "[[The Most Counterintuitive Way to Build a Brain]]"
related:
author:
description:
aliases:
---

efficient [[Machine Learning]] framework based on [[Recurrent Neural Network]]s that process timeseries data by mapping input to high dimensional space, a "reservoir" of randomly connected neurons. 

- only training that happens here is the training of the "readout layer"
	- just has a weight off a neuron in the reservoir directly to the output layer. 
- excels at pattern recognition, [[Chaos|chaotic]] signal prediction, and speech recognition with lower computational costs
- turns out to be deeply connected to [[Fourier Transform|Fourier]]'s insight about building any signal from compositional building blocks. it all a matter of looking at the signals the right way.

![[reservoirNetwork.png]]
