---
class:
  - note
tags:
  - cs/ai/training/optimization
  - math/information
source:
related:
  - "[[Gradient Descent]]"
  - "[[Cross Entropy]]"
  - "[[Mean Squared Error]]"
author:
description: The scalar measure of how wrong a model's predictions are, which training minimizes.
aliases:
  - Loss Function
  - Loss
  - Cost Function
  - Objective Function
date: 2024-09-12
updated: 2026-11-19T19:40:11-05:00
---

[![LossFunctionMSE.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/46a9dbdf84e1aa06d532786ba2a7f6b41b89b2c4bec261c8e5dff9c8d7f805c3/LossFunctionMSE.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/46a9dbdf84e1aa06d532786ba2a7f6b41b89b2c4bec261c8e5dff9c8d7f805c3/LossFunctionMSE.png)

- a **loss function** ( cost, objective ) is one scalar saying how wrong the model is, which [[Gradient Descent|gradient descent]] pushes down by moving every [[Parameter|parameter]] against $\partial L / \partial \theta$
	- the loss *is* the definition of the task for a [[Neural Networks|neural network]]; most standard ones are a negative log likelihood under some noise model
	- scale matters: if targets or features live on very different ranges, the big ones dominate the loss, so [[Normalization|normalize]] first
- **[[Mean Squared Error|MSE]]**, regression; the gaussian noise assumption

$$
\text{MSE} = \frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2
$$

	- squaring punishes big errors hard, so it's sensitive to outliers
	- mean absolute error $|y - \hat{y}|$ is the robust version, it predicts the median instead of the mean
- **[[Cross Entropy|cross-entropy]]**, classification; compares the true label [[Probability Distribution|distribution]] with the predicted one
	- binary, with a [[Sigmoid Function|sigmoid]] output: $L = -[y \log \hat{y} + (1 - y) \log (1 - \hat{y})]$
	- categorical, with a [[Softmax]] output and one hot $y$: $L = -\sum_i y_i \log \hat{y}_i$
	- equals the entropy of the labels plus the [[Kullback-Leibler Divergence|KL]] from truth to prediction, so minimizing it minimizes the KL
	- rewards calibrated probabilities and punishes confident wrong answers without bound ( $-\log$ of something near 0 )
- **hinge**, [[Support Vector Machines|SVMs]]; $y \in \{-1, 1\}$ and $\hat{y}$ a raw score: $L = \max(0, 1 - y \hat{y})$
	- zero once a point is on the right side with margin 1, so only points inside or past the margin matter
- **huber**, regression with outliers: quadratic for small errors, linear past $\delta$

$$
L_\delta = \begin{cases} \frac{1}{2}(y - \hat{y})^2 & |y - \hat{y}| \le \delta \\ \delta \left( |y - \hat{y}| - \frac{1}{2}\delta \right) & \text{otherwise} \end{cases}
$$

- real losses get composed: the [[Evidence Lower Bound|ELBO]] of a [[Variational Autoencoder]] is reconstruction plus KL, a [[Sparse Autoencoder]] is MSE plus an L1 sparsity penalty
