---
date: 2026-02-09T12:50:35-05:00
updated: 2026-04-20T10:06:23-04:00
source:
  - https://artemkirsanov.substack.com/p/the-hardware-lottery
  - https://en.wikipedia.org/wiki/Spiking_neural_network
class:
  - note
tags:
  - comp-neuro/models
  - cs/ai
related:
author:
description:
aliases:
---

- can be done in [[Brian2]], probably the easiest way to go about it at this point, seems to be the most stable neural computation library and has a CUDA version
- [[Artem Kirsanov]] seems to like them a lot, he highlighted the "hardware lottery", where Spiking neural nets didnt take off because it did not fit into our standard von neumann architecture, and not parellizable in the sense like GPUs allow for

https://en.wikipedia.org/wiki/Spiking_neural_network

- Bio inspired, energy efficient. Process information in sparse, discrete spikes in a continuous time environment. 
	- Would be ideal if the hardware permitted them to scale, however they do still excel in low power edge ai and temporal pattern recognition.

Much harder to train since spiking is non differentiable so [[Gradient Descent]] is not viable.

![[SNN.png]]
