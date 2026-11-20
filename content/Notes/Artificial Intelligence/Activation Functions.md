---
class:
  - note
tags:
  - cs/ai/architecture/layers
source:
related:
  - "[[Artificial Neuron]]"
author:
description: The nonlinearity applied after a neuron's weighted sum, and why the choice matters for gradients.
aliases:
  - Activation Function
  - activation function
  - activation functions
  - Nonlinearity
date: 2024-09-12
updated: 2026-11-19T19:40:11-05:00
---
- the nonlinearity $f$ an [[Artificial Neuron|neuron]] applies after its weighted sum, $a = f(w \cdot x + b)$
	- without it a deep [[Neural Networks|network]] collapses to one linear map: $W_2(W_1 x) = (W_2 W_1)x$, no matter the depth
	- the name is from whether a biological [[Neuron|neuron]] fires, but here it's a smooth function, not an on/off decision
	- i think of it as what puts a *fold* in the input space; stacking folds is how networks carve nonlinear boundaries ( see [[ReLU]] )
- **[[Sigmoid Function|Sigmoid]]** $\sigma(x) = \frac{1}{1+e^{-x}}$, range $(0,1)$
	- derivative $\sigma'(x) = \sigma(x)(1-\sigma(x)) \le 0.25$, so gradients shrink every layer: the **vanishing gradient** problem
	- still the right output for binary classification ( a probability )
	- smooth version of the [[Heaviside Function|step function]] the original [[Perceptron]] used
- **tanh** $\tanh(x) = \frac{e^{x}-e^{-x}}{e^{x}+e^{-x}} = 2\sigma(2x)-1$, range $(-1,1)$
	- zero centered, so nicer than sigmoid in hidden layers, but saturates the same way
- **[[ReLU]]** $\max(0,x)$, the default for hidden layers
	- cheap, gradient is exactly 1 for $x>0$ so it doesn't vanish
	- **dying ReLU**: a neuron pushed to always negative input outputs 0 forever and gets no gradient
	- **Leaky ReLU** $\max(\alpha x, x)$ with small $\alpha$ ( ~0.01 ) keeps a trickle of gradient
- smooth ReLUs: GELU $x\,\Phi(x)$ and SiLU/Swish $x\,\sigma(x)$, what modern transformers use ( SwiGLU in most [[Large Language Model|LLM]]s )
- **[[Softmax]]** $\text{softmax}(z)_i = \frac{e^{z_i}}{\sum_j e^{z_j}}$
	- not elementwise like the others: turns a whole vector of logits into a distribution that sums to 1
	- output layer for multiclass, paired with [[Cross Entropy|cross entropy]] loss; also the core of [[Self Attention]]
	[![Pasted image 20240830111119.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/11f7aef0bcc536151db8e154adfe5c7345c1799412f26beaae36ed6d30603517/Pasted%20image%2020240830111119.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/11f7aef0bcc536151db8e154adfe5c7345c1799412f26beaae36ed6d30603517/Pasted%20image%2020240830111119.png)
- in my old [[Representing Boolean Function with Perceptions|XOR gate]] model i used ReLU for the hidden layer and sigmoid for the output
- exploding gradients are less about the activation and more about depth/initialization; clipping and [[Normalization|normalization]] ( [[Batch Normalization]] ) handle those
