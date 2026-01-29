---
class:
  - note
  - lecture
tags:
  - university
  - cs/ai/linear
  - math/linear-algebra
  - math/probability
course: "[[Machine Learning Course]]"
lecture-number: 5
source:
related:
author:
description:
aliases:
date: 2026-01-28T08:31:19-05:00
updated: 2026-01-28T09:23:07-05:00
---

**Logistic Regression** is an exceptional tool for the task of _classification_. It is particularly well-suited for scenarios where the outcome variable is categorical, such as determining whether an email is spam or not spam, or predicting whether a patient has a certain disease based on their symptoms.

Takes a probabilistic approach to learning discriminative functions (i.e. a classifier) from data.

$h_{\theta}$ should give us $p(y=1 | x; \theta )$ where $y \in {0,1}$

In plan English:

$$
h_{\theta}(x) = Prob( \underbrace{ \overbrace{ class = 1 }^{ y=1 } }_{ \text{death} } | x, \vec{\theta} )
$$

$$
\hat{p} = h_{\theta}(x) = \rho\underbrace{ (\vec{\theta}^T \vec{x}) }_{ \text{linear reg} }
$$

Much like linear regression at the end, but instead we pass it through the [[Sigmoid Function]] so as to squash the output to be between 0 and 1, representing a probability.

---

## Decision Boundary

Predictions are made by applying a threshold to the output of the hypothesis function. A common threshold is 0.5:

Predict $y=1$ if $h_{\theta}(\vec{x}) \geq 0.5$

In plain english, if you can put a line between two classes, you can use logistic regression to classify them.

This line doesnt have to be flat or linear, could be a curve, or any shape really. As long as you can draw a line between the two classes.

---

## Gradient Descent

1. Initialize $\vec{\theta}$ to some value (often zeros)
2. Repeat $\theta_j := \theta_j - \alpha \frac{ \partial }{ \partial \theta_j } J(\theta)$ until convergence

Where $J(\theta)$ is the cost function:

$$
J(\theta) = - \frac{1}{m} \sum_{i=1}^{m} \left[ y^{(i)} \log( h_{\theta}( x^{(i)} ) ) + (1 - y^{(i)}) \log( 1 - h_{\theta}( x^{(i)} ) ) \right]
$$

Still quite similar to linear regression, but the cost function is different.
