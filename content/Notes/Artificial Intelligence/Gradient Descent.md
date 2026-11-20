---
class:
  - note
tags:
  - cs/ai/training/optimization
  - math/calculus/multivariable
source:
related:
  - "[[Loss Functions]]"
  - "[[Backpropagation]]"
  - "[[ADAM]]"
author:
description: Iteratively stepping model parameters against the gradient of the loss until it stops improving.
aliases:
  - GD
  - SGD
  - Stochastic Gradient Descent
  - Mini-batch Gradient Descent
  - Batch Gradient Descent
date: 2024-10-06
updated: 2026-11-19T19:40:11-05:00
---

[![gradDescent.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/d62d72080aab29e37bfa4ab9c7f7e428e75637f3163f5be888fd7a04d9b8c744/gradDescent.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/d62d72080aab29e37bfa4ab9c7f7e428e75637f3163f5be888fd7a04d9b8c744/gradDescent.png)

- **gradient descent** is the base optimizer under basically all of deep learning: nudge the [[Parameter|parameters]] $\theta$ a little downhill on the [[Loss Functions|loss]] $J(\theta)$, repeat
	- intuition: walking down hilly terrain in fog, you only feel the slope under your feet so you step the steepest way down
	- the gradient $\nabla_\theta J$ points uphill, so we subtract it
	- introduced in [[Evolutionary Robotics]]

$$
\theta \leftarrow \theta - \alpha \nabla_\theta J(\theta)
$$

- example: linear regression with a [[Mean Squared Error|MSE]] cost over $m$ examples, $h_\theta(x) = \theta^\top x$

$$
J(\theta) = \frac{1}{2m} \sum_{i=1}^{m} \left( h_\theta(x^{(i)}) - y^{(i)} \right)^2, \qquad \frac{\partial J}{\partial \theta_j} = \frac{1}{m}\sum_{i=1}^{m} \left( h_\theta(x^{(i)}) - y^{(i)} \right) x_j^{(i)}
$$

	- the $\frac{1}{2}$ is only there to cancel the 2 from differentiating the square
- **learning rate** $\alpha$ is the main knob
	- too small: converges painfully slowly
	- too large: overshoots the minimum, oscillates or diverges
	- [[Normalization|normalizing]] features makes the loss surface less of a long thin valley, so one $\alpha$ works in every direction
- convergence: stop when $|J(\theta_{\text{new}}) - J(\theta_{\text{old}})| < \epsilon$ ( e.g. $10^{-6}$ )
	- only guarantees a local minimum or saddle unless $J$ is convex
- how much data per step
	- **batch**: the whole dataset per gradient, exact but expensive
	- **stochastic (SGD)**: one example per step, noisy but cheap, and the noise can help escape saddles and sharp minima
	- **mini-batch**: small random subsets, what everyone actually means by SGD
- the gradient itself comes from [[Backpropagation|backpropagation]] ( [[Automatic Differentiation]] in practice )
- fancier optimizers are smarter step rules on top: momentum, RMSprop, [[ADAM]] ( per parameter adaptive step sizes )
- [[Double Descent]] is the weird overparameterized regime where test error comes back down
