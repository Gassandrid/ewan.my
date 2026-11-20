---
class:
  - note
tags:
  - cs/ai/architecture/layers
source:
  - https://arxiv.org/abs/1502.03167
related:
  - "[[Normalization]]"
author:
description: A layer that standardizes activations with minibatch statistics, then rescales them with learned parameters.
aliases:
  - BatchNorm
  - Batch Norm
  - BN
date: 2024-09-12
updated: 2026-11-19T19:40:11-05:00
---
[![Screenshot 2024-09-17 at 10.22.04 AM.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/0531613dd8f8b675d7c1b01ebb0271a3b0a6e29782ad14f3563c73e16c319105/Screenshot%202024-09-17%20at%2010.22.04%20AM.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/0531613dd8f8b675d7c1b01ebb0271a3b0a6e29782ad14f3563c73e16c319105/Screenshot%202024-09-17%20at%2010.22.04%20AM.png)

- [[Normalization]] moved inside the [[Neural Networks|network]]: standardize each feature over the minibatch, then let the network undo it if it wants
	$$
	\hat{x}_i = \frac{x_i - \mu_B}{\sqrt{\sigma_B^2 + \epsilon}}, \qquad y_i = \gamma \hat{x}_i + \beta
	$$
	- $\mu_B, \sigma_B^2$: mean and variance of that feature over the batch; divide by the standard deviation, not the variance
	- $\gamma, \beta$ are learned [[Parameter|parameters]], so normalizing never removes what the layer can represent
	- $\epsilon$ for numerical stability
- why it helps
	- trains faster, tolerates higher learning rates and worse initialization
	- original paper ( Ioffe & Szegedy 2015 ) said it fixes **internal covariate shift**; later work ( Santurkar et al. 2018 ) argues the real effect is a smoother loss landscape
	- batch noise acts as a mild regularizer
- training vs inference
	- training uses the batch statistics; inference uses running averages collected during training ( `model.eval()` in [PyTorch](https://pytorch.org/) )
	- small or non iid batches give bad statistics, the main failure mode
- transformers use Layer Norm / RMSNorm instead, which normalize over features within one example, so no batch dependence
- usually goes between the linear layer and the [[Activation Functions|activation]]:
```python
self.fc1 = nn.Linear(784, 256)
self.bn1 = nn.BatchNorm1d(256)
x = torch.relu(self.bn1(self.fc1(x)))
```
