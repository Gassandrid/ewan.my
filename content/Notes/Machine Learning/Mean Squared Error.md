---
class:
  - note
tags:
  - cs/ai
  - university
source:
related:
author:
description:
aliases:
  - MSE
date: 2026-01-21T08:35:45-05:00
updated: 2026-01-21T08:36:05-05:00
---
**Mean Squared Error (MSE)** is the standard [[Loss Functions|loss function]] used to [[Linear and Nonlinear Regression|linear regression]] tasks, as it effectively measures the average of the squares of the errors—that is, the average squared difference between the predicted values and the actual values.

It is defined mathematically as:

$$
\text{MSE} = \frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2
$$

**Where**:

- $n$ is the number of data points
- $y_i$ is the actual value for the $i^{th}$ data point
- $yhat_i$ is the predicted value for the $i^{th}$ data point

[![MSError.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/89c3f9ade19dfeb924950018d8bade5ce16b79c0fc67a1c845a7df4f3e38242a/MSError.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/89c3f9ade19dfeb924950018d8bade5ce16b79c0fc67a1c845a7df4f3e38242a/MSError.png)

---

## Higher Dimensions

Can be generalized as:

$$
\text{MSE} = \frac{1}{n} \sum_{i=1}^{n} (y_i - h_{\theta}(x_i))^2
$$

Where the hypothesis function $h_{\theta}(x_i)$ represents the predicted value based on the input features $x_i$ and model [[Parameter|parameters]] $\theta$.

We can then

$$
  J(\theta_{0}, \theta_{1}, \dots, \theta_{m}) = \frac{1}{n} \sum_{i=1}^{n} (y_i - h_{\theta}(x_i))^2
$$
