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

**Mean Squared Error (MSE)** is the standard loss function used to linear regression tasks, as it effectively measures the average of the squares of the errors—that is, the average squared difference between the predicted values and the actual values.

It is defined mathematically as:

$$
\text{MSE} = \frac{1}{n} \sum_{i=1}^{n} (y_i - \hat{y}_i)^2
$$

**Where**:

- $n$ is the number of data points
- $y_i$ is the actual value for the $i^{th}$ data point
- $yhat_i$ is the predicted value for the $i^{th}$ data point

![[MSError.png]]

---

## Higher Dimensions

Can be generalized as:

$$
\text{MSE} = \frac{1}{n} \sum_{i=1}^{n} (y_i - h_{\theta}(x_i))^2
$$

Where the hypothesis function $h_{\theta}(x_i)$ represents the predicted value based on the input features $x_i$ and model parameters $\theta$.

We can then

$$
  J(\theta_{0}, \theta_{1}, \dots, \theta_{m}) = \frac{1}{n} \sum_{i=1}^{n} (y_i - h_{\theta}(x_i))^2
$$
