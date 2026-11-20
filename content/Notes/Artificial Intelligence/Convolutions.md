---
class:
  - note
tags:
  - cs/ai/architecture/layers
  - math/waves/signals
source:
related:
  - "[[Max Pooling]]"
  - "[[Receptive Field]]"
author:
description: Sliding a small shared filter across an input to build feature maps, the core operation of CNNs.
aliases:
  - Convolution
  - Convolutional Neural Network
  - Convolutional Neural Networks
  - CNN
  - CNNs
date: 2024-09-12
updated: 2026-11-19T19:40:11-05:00
---
- **convolution** in a CNN: slide a small filter ( kernel ) over the input, take the dot product at each position, get a **feature map**
	$$
	(I * K)(i,j) = \sum_{m}\sum_{n} I(i+m,\, j+n)\, K(m,n)
	$$
	- technically cross correlation, deep learning libraries don't flip the kernel; the signal processing convolution does, and by the convolution theorem it's a product in the [[Fourier Transform|Fourier]] domain
	- output size: $\frac{N - k + 2p}{s} + 1$ for input $N$, kernel $k$, padding $p$, stride $s$
- example: 5x5 image, 3x3 vertical edge filter, stride 1, no padding gives a 3x3 map

| 1 | 2 | 0 | 3 | 1 |
|---|---|---|---|---|
| 4 | 5 | 6 | 7 | 8 |
| 1 | 0 | 1 | 2 | 1 |
| 0 | 1 | 3 | 4 | 0 |
| 3 | 4 | 5 | 1 | 2 |

| 1 | 0 | -1 |
|---|---|---|
| 1 | 0 | -1 |
| 1 | 0 | -1 |

- top left output: left column $(1+4+1)$ minus right column $(0+6+1)$ $= -1$, so little horizontal change there
- why it works for images: the right inductive biases
	- **local connectivity**: each output only sees a small patch, its [[Receptive Field|receptive field]], which grows with depth
	- **weight sharing**: one filter everywhere, far fewer [[Parameter|parameters]] than a dense layer
	- **translation equivariance**: shift the image and the feature map shifts with it; pooling buys some invariance
- typical CNN: conv, [[ReLU]], [[Max Pooling|pooling]], repeated, then flatten into dense layers and [[Softmax]]
	- early layers learn edge and blob detectors, later layers parts and objects, loosely like simple/complex cells in V1 ( Hubel & Wiesel, the original inspiration )
- landmark nets: LeNet-5 ( digits, 1998 ), AlexNet ( ImageNet 2012 ), VGG ( stacked 3x3s ), [[Residual Network|ResNet]] ( skip connections let it train 100+ layers )
- vision transformers swap the locality prior for [[Self Attention]] over patches; with enough data they match or beat CNNs, which is a pretty bitter lesson for hand built priors
