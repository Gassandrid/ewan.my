---
class:
  - note
tags:
  - cs/ai
  - math/probability/statistics
source:
related:
  - "[[Batch Normalization]]"
  - "[[Normalization, Regularization, and Gradient Descent for Linear Regression]]"
author:
description: Rescaling numeric features to a common range so no feature dominates just because of its units.
aliases:
  - Feature Scaling
  - Standardization
  - Min-Max Normalization
  - Z-Score Normalization
date: 2024-09-12
updated: 2026-11-19T19:40:11-05:00
---

[![Screenshot 2024-09-17 at 10.22.28 AM.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/37f389da419511b81eab1e20842bc6374b0c34287b7a71ded8c0cddddf7ef953/Screenshot%202024-09-17%20at%2010.22.28%20AM.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/37f389da419511b81eab1e20842bc6374b0c34287b7a71ded8c0cddddf7ef953/Screenshot%202024-09-17%20at%2010.22.28%20AM.png)

- **normalization** ( feature scaling ) puts numeric features on a common scale so none wins just because its units are bigger, a standard [[Machine Learning|machine learning]] preprocessing step
	- example: house size in square feet ( ~1000s ) next to bedroom count ( 1 to 5 ); unscaled, every distance and gradient is about square feet
	- for [[Gradient Descent|gradient descent]], unequal scales stretch the [[Loss Functions|loss]] surface into a long thin valley and steps zigzag; scaled, it's rounder and converges faster
- **min-max**, to $[0, 1]$; simple, but one outlier squashes everything else

$$
x' = \frac{x - \min(x)}{\max(x) - \min(x)}
$$

- **z-score** ( standardization ), mean 0 and standard deviation 1; the usual default, but still pulled by outliers since $\mu$ and $\sigma$ are
	- robust scaling ( median and IQR ) when outliers are bad

$$
x' = \frac{x - \mu}{\sigma}
$$

- **max-abs**, to $[-1, 1]$; keeps sign and zeros ( good for sparse data ), outlier sensitive

$$
x' = \frac{x}{\max |x|}
$$

- when it matters
	- distance based: k-NN, K-Means, [[Support Vector Machines|SVM]]; and [[Principle Component Analysis|PCA]], which otherwise just finds the feature with the biggest units
	- gradient trained: [[Linear and Nonlinear Regression|linear regression]] and [[Neural Networks]], where large inputs saturate [[Sigmoid Function|sigmoid]]-like units and destabilize training
	- not for [[Decision Tree|decision trees]], splits don't care about monotone rescaling
- fit the scaler on the training set only and apply that same transform to validation and test, otherwise test statistics leak in ( [[Network Modeling Workflow]] )
	- keep the scaler to invert predictions back to the original units
- inside networks the same idea becomes a layer: [[Batch Normalization]] over the batch, [[Layer Normalization]] per token in transformers
- worked through for regression in [[Normalization, Regularization, and Gradient Descent for Linear Regression]]

```python
from sklearn.preprocessing import MinMaxScaler

x_train = [[-1, 2], [-0.5, 6], [0, 10], [1, 18]]

scaler = MinMaxScaler().fit(x_train)  # fit on train only
x_train_scaled = scaler.transform(x_train)  # reuse scaler.transform on test
```
