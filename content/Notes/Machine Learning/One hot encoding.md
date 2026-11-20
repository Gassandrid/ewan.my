---
date: 2026-03-18T09:14:18-04:00
updated: 2026-03-18T09:34:06-04:00
class:
  - note
tags:
  - cs/ai/architecture/perceptron
source:
related:
author:
description:
aliases:
---

For [[Neural Networks]], often times, we want to make sure that for calssification neural network tasks, it is trained with equal class weight ([[Orthogonality|orthogonal]] with distance one).

General rule of thumb is if you only have two classes then just use a single neuron with either 0 or 1 as output. If more, use one hot encoding with a neuron for each classification option.

[![hotEncodingNeuralNetwork.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/48163645988da36cbc4a3dc47eb19e54bf4ccc3e6e9aec5817c8972a5fc3b1a7/hotEncodingNeuralNetwork.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/48163645988da36cbc4a3dc47eb19e54bf4ccc3e6e9aec5817c8972a5fc3b1a7/hotEncodingNeuralNetwork.png)	
