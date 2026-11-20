---
class:
  - note
tags:
  - cs/ai/architecture/layers
source:
  - "https://www.deeplearningbook.org/"
  - "https://machinelearningmastery.com/pooling-layers-for-convolutional-neural-networks/"
related:
  - "[[Convolutions]]"
author:
description: Downsampling a feature map by keeping only the largest value in each small window.
aliases:
  - Pooling
  - Max Pool
  - Average Pooling
  - Global Average Pooling
date: 2024-09-12
updated: 2026-11-19T19:40:11-05:00
---

- **max pooling** downsamples a feature map by keeping only the largest value in each small window, sitting between [[Convolutions|convolution]] layers in CNNs
	- keeps "did this feature fire somewhere around here", throws away exactly where
	- shrinks width and height, so later layers cost less and each unit sees a bigger [[Receptive Field|receptive field]]
	- has no [[Parameter|parameters]] of its own, any overfitting help comes from making the downstream layers smaller
- example: 2x2 window, stride 2, a 4x4 map becomes 2x2

| 1 | 3 | 2 | 4 |
|---|---|---|---|
| 5 | 6 | 7 | 8 |
| 9 | 8 | 4 | 3 |
| 2 | 1 | 5 | 7 |

| 6 | 8 |
|---|---|
| 9 | 7 |

$$
y_{i,j} = \max_{(p,q) \in R_{i,j}} x_{p,q}, \qquad W_{\text{out}} = \left\lfloor \frac{W_{\text{in}} - k}{s} \right\rfloor + 1
$$

- gives a bit of local translation invariance: shift the input a pixel and the max of a window often stays the same ( approximate, and only within the window )
- in [[Backpropagation|backprop]] the gradient goes only to the argmax of each window, everything else gets zero
- variants
	- average pooling: mean instead of max
	- global max / average pooling: one value per channel over the whole map, how ResNet style nets collapse to a vector before the classifier
- settings: 2x2 or 3x3 windows, stride 2 by default, padding to control the output size
- used in AlexNet and VGG ( LeNet used a trainable average subsampling ); newer nets often swap it for strided convolutions, and vision transformers drop it
- neuro side: the max is the "complex cell" operation in HMAX style ventral stream models, and pooled hierarchical CNNs are what [[Performance-optimized hierarchical models predict neural responses in higher visual cortex|predict responses in higher visual cortex]]
