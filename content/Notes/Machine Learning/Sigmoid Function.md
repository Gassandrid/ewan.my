---
date: 2026-01-28T08:39:38-05:00
created_on: "[[01-28-2026]]"
updated: 2026-01-28T08:44:28-05:00
class:
  - note
tags:
  - cs/ai/activation
  - math/probability
source:
related:
author:
description:
aliases:
---
The _sigmoid function_ is a mathematical function that transforms any real-valued number into a value between 0 and 1. It is commonly used in machine learning, particularly in logistic regression and neural networks, to model probabilities.

Often used as an activation function in a few specific neural net architectures, however not as popular as ReLU these days due to computational efficiency.

$$
S(x) = \frac{1}{1 + e^{-x}}
$$

![[sigFunction.png]]

Also usefull for anything involving probabilities, since it maps any input to a value between 0 and 1. Not exactly like [[Softmax]], but similar idea.
