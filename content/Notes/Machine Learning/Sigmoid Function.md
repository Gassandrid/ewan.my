---
date: 2026-01-28T08:39:38-05:00
updated: 2026-01-28T08:44:28-05:00
class:
  - note
tags:
  - cs/ai/architecture/layers
  - math/probability
source:
related:
author:
description:
aliases:
---
The _sigmoid function_ is a mathematical function that transforms any real-valued number into a value between 0 and 1. It is commonly used in [[Machine Learning|machine learning]], particularly in [[Logistic Regression|logistic regression]] and [[Neural Networks|neural networks]], to model probabilities.

Often used as an [[Activation Functions|activation function]] in a few specific neural net architectures, however not as popular as [[ReLU]] these days due to computational efficiency.

$$
S(x) = \frac{1}{1 + e^{-x}}
$$

[![sigFunction.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/974acfa2f3b8823fd772ca4f7f8be1296fc58ae5793072672b884235eec859d2/sigFunction.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/974acfa2f3b8823fd772ca4f7f8be1296fc58ae5793072672b884235eec859d2/sigFunction.png)

Also usefull for anything involving probabilities, since it maps any input to a value between 0 and 1. Not exactly like [[Softmax]], but similar idea.
