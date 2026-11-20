---
class:
  - note
tags:
  - cs/ai/training/backpropagation
source:
  - "[[The F=ma of Artificial Intelligence Backpropagation]]"
related:
  - "[[Gradient Descent]]"
  - "[[Automatic Differentiation]]"
author:
description: Computing the gradient of the loss with respect to every weight by running the chain rule backward through the network.
aliases:
  - Backpropagation
  - backprop
  - Backward Pass
  - backward propagation
date: 2024-09-12
updated: 2026-11-19T19:40:11-05:00
---
- **backpropagation**: get $\partial L / \partial w$ for every weight in one backward sweep, then hand it to [[Gradient Descent]] ( or [[ADAM]] )
	- it's just the chain rule applied layer by layer, reusing each layer's result for the one before it
	- reverse mode [[Automatic Differentiation|autodiff]]: costs about as much as one forward pass, no matter how many parameters
- forward pass for layer $l$: $z^l = W^l a^{l-1} + b^l$, $a^l = f(z^l)$ ( see [[Artificial Neuron]] )
- backward pass: define the error $\delta^l = \partial L / \partial z^l$
	$$
	\delta^{L} = \nabla_{a^L} L \odot f'(z^L), \qquad \delta^{l} = \left( (W^{l+1})^\top \delta^{l+1} \right) \odot f'(z^{l})
	$$
	$$
	\frac{\partial L}{\partial W^l} = \delta^l (a^{l-1})^\top, \qquad \frac{\partial L}{\partial b^l} = \delta^l
	$$
	- the error flows back through the transposed weights; each layer multiplies in its [[Activation Functions|activation]] derivative
	- that product of derivatives is why [[Sigmoid Function|sigmoid]] nets vanish and why [[ReLU]] and [[Batch Normalization]] help
- example: one sigmoid neuron, [[Mean Squared Error|MSE]] $L = \tfrac{1}{2}(a-y)^2$, $a = \sigma(wx+b)$
	- $\partial L/\partial w = (a-y)\,\sigma'(z)\,x$: error, times local slope, times input
- for [[Recurrent Neural Network|recurrent]] nets you unroll in time: [[Backpropagation Through Time]]
- brains probably can't do this literally: it needs symmetric feedback weights ( weight transport ) and a separate backward phase
	- [[Predictive Coding|predictive coding]] networks approximate it with local [[Hebbian learning|Hebbian]] updates ( [[An Approximation of the Error Backpropagation Algorithm in a Predictive Coding Network with Local Hebbian Synaptic Plasticity|Whittington & Bogacz]] )
	- more in [[Learning Algorithm Of Biological Networks]] and [[ellenbergerBackpropagationSpaceTime2025b|Backpropagation through space, time and the brain]]
- [[Welch Labs]] has the best visual walkthrough: [[The F=ma of Artificial Intelligence Backpropagation]]
