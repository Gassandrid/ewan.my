---
class:
  - note
tags:
  - cs/ai/architecture/perceptron
source:
related:
  - "[[Perceptron]]"
  - "[[Neuron]]"
author:
description: "The basic unit of a neural network: a weighted sum of inputs plus a bias, passed through a nonlinearity."
aliases:
  - neuron
  - Artificial Neurons
date: 2024-09-12
updated: 2026-11-20T01:57:22-05:00
---

[![Pasted image 20240808134117.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/24e10589a6d8d3f12c4f1447bd77e43aad1da019590df24b937f37ac377f4a7d/Pasted%20image%2020240808134117.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/24e10589a6d8d3f12c4f1447bd77e43aad1da019590df24b937f37ac377f4a7d/Pasted%20image%2020240808134117.png)

- the unit of a [[Neural Networks|neural network]]: weight the inputs, add a bias, squash

	$$
	a = f(z), \quad z = \sum_i w_i x_i + b = w \cdot x + b


$$
	- **weights** $w_i$ are the learned [[Parameter|parameters]] saying how much each input matters
	- **bias** $b$ shifts the threshold, the intercept of the [[Linear Equations|linear equation]]
	- $f$ is the [[Activation Functions|activation function]]; drop it and stacked neurons are just [[Linear and Nonlinear Regression|linear regression]]
	- with $f$ the [[Heaviside Function|step function]] this is exactly the [[Perceptron]]
- example: inputs $x = (1, 2)$, weights $w = (0.5, -1)$, $b = 1$
	- $z = 0.5 - 2 + 1 = -0.5$, so [[ReLU]] gives $0$ and [[Sigmoid Function|sigmoid]] gives $\approx 0.38$
- a layer is many of these in parallel, $a = f(Wx + b)$, so the whole thing is matrix multiplies plus elementwise nonlinearities
- loosely modeled on the biological [[Neuron|neuron]]: [[Notes/Computational Neuroscience/Brain/Dendrites|dendrites]] in, soma sums, axon out
	- the analogy is thin; a real cortical neuron does nonlinear dendritic computation and needs a several layer deep net to imitate ( [[Dendrites Why Biological Neurons Are Deep Neural Networks|video]], [[Pyramidal Neurons]] )
	- and it communicates in spikes over time, which [[Spiking Neural Network|spiking networks]] keep
