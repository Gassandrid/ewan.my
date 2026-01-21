---
class:
  - note
tags:
  - university
  - cs/ai/linear
source:
related:
author:
description:
aliases:
date: 2026-01-21T08:30:09-05:00
updated: 2026-01-21T09:02:59-05:00
---

We seek to build a simple linear regression model. We will have some **training data**, and we want to build a model for this data.

## Definition

$$
\hat{y} = h_{\theta}(x)=\theta_{0} + \theta_{1}x
$$

**Where**:

- $\hat{y}$ is the predicted $y$ values
- $h$ is the hypothesis function
- $\theta$ are the model parameters (weights). $\theta_{j}$ is the $j^{th}$ model [[Parameter]] (including the bias term $\theta_{0}$ and the feature weights $\theta_{1}$).
- $x_{i}$ is the feature value (High temp in this case).

We also have to choose a [[Loss Functions|Cost/Loss Function]], in this case we usually use something called [[Mean Squared Error]]. Our objective when fitting a model is to _minimize_ the cost function.

We then seek to **make a prediction** using a learned model:

$$
\hat{y}=h_{\hat{\theta}} (x)
$$

And then _test error_ using squared loss. **Why squared loss?** it is often not explained well, but we want to heavily penalize large errors, and squaring the error achieves this. There is a good video by [[Artem Kirsanov]] called [[What Textbooks Don't Tell You About Curve Fitting]]

$$
(h_{\hat{\theta}}(x)-y)^{2} = (\hat{y}-y)^2
$$

In terms of our linear function equation, we are seeking to find $\theta_{0}$ and $\theta_{1}$ by minimizing [[Mean Squared Error|MSE]].

---

## Linear Regression with Multiple Variables

We can extend this to generalize for any number of features:

$$
\hat{y} = h_{\theta}(x) = \theta_{0}\overbrace{ x_{0} }^{ \text{always 1 } } + \theta_{1}x_{1} + \theta_{2}x_{2} + \dots + \theta_{n}x_{n}
$$

Where $x_{j}$ is the $j^{th}$ feature. Our objective is to minimize the cost function, which is defined as:

$$
J(\theta_{0},\theta_{1},\theta_{2},\dots,\theta_{n}) = J(\theta) = MSE(x,h_{\theta}(x)) = \frac{1}{m} \sum_{i=1}^{m}(h_{\theta}(x^i)-y^i)^2
$$

Simplifying our definition:

$$
  \underbrace{ J(\theta) = \frac{1}{m}(X\theta-Y)^{T}(X\theta-Y) }_{ \text{parallelized over all samples} }
$$

We usually use [[Gradient Descent]] for higher order learning, but there is a closed form math solution for two variables:

Write $\theta$s, $x$s and $y$s in **vector form**.

$$
\vec{\theta}=\begin{bmatrix}
\theta_{0} \\
\theta_{1} \\
\theta_{2} \\
\vdots \\
\theta_{n}
\end{bmatrix} \quad \vec{x}=\begin{bmatrix}
1 \\
x_{1} \\
x_{2} \\
\vdots \\
x_{n}
\end{bmatrix} \quad \vec{y} = \begin{bmatrix}
y^{(1)} \\
y^{(2)} \\
y^{(3)} \\
\vdots \\
y^{(n)}
\end{bmatrix}
$$

Then $\vec{\theta}^T \vec{x}$ becomes:

$$
\begin{bmatrix}
\theta_{0} & \theta_{1} & \theta_{2}
\end{bmatrix} \begin{bmatrix}
1 \\
x_{1} \\
x_{2}
\end{bmatrix}
$$

And we achieve $\hat{y}$:

$$
\hat{y} = \vec{\theta}^T \vec{x} = \theta_{0} + \theta_{1}x_{1} + \theta_{2}x_{2}
$$

And our loss can finally be defined as $J( \vec{\theta})$:

$$
J(\vec{\theta}) = \frac{1}{m} \sum_{i=1}^{m} (\vec{\theta}^T \vec{x}^{(i)} - y^{(i)})^2
$$

And our closed form solution for $\hat{\theta}$:

$$
\hat{\theta} = (X^{T}X)^{-1}X^{T}Y
$$
