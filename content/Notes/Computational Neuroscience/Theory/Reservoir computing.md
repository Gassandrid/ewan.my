---
date: 2026-05-08T09:58:13-04:00
updated: 2026-10-07T15:03:28-04:00
class:
  - note
tags:
  - math/dynamical-systems/chaos
  - comp-neuro/models
  - cs/ai/architecture/recurrent
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

[![reservoirNetwork.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/03558824c99efaa53f11f2d19b51d1369c7655e5682d36a9c4690290a3330b0a/reservoirNetwork.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/03558824c99efaa53f11f2d19b51d1369c7655e5682d36a9c4690290a3330b0a/reservoirNetwork.png)
