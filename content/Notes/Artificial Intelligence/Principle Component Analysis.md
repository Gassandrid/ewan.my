---
class:
  - note
tags:
  - cs/ai/latent-space
  - math/linear-algebra
source:
  - "[[Latent Space Visualisation PCA, t-SNE, UMAP  Deep Learning Animated]]"
related:
author:
date: 2025-10-09
updated: 2025-10-09
---

**Principle Component Analysis** is a [[Latent Space]] visualization technique for linear pattern extraction and dimensionality reduction. It transforms high-dimensional data into a lower-dimensional space while preserving as much variance as possible.

For a two dimensional example mapping onto a line, you can think of PCA as finding the best line to fold the data onto, such that the distance from the points to the line is minimized. That "line" is the largest **principle component** of the distribution:

![[PrinceCompANal.png]]

In the context of **linear algebra**, the **Principle Component** can be thought of as the eigenvector corresponding to the largest eigenvalue of the data's covariance matrix. This eigenvector points in the direction of maximum variance in the data.

---

## Computation

The first step in computing **Principle Component Analysis** is to find the _covariance matrix_.

This can be calculated by first centering your data, this means calculating the mean of every variable and then substracting that mean from each datapoint

$$
\begin{align*}
X &= \underbrace{ \begin{bmatrix}
x_{1} & y_{1} \\
x_{2} & y_{2} \\
\dots & \dots \\
x_{n} & y_{n}
\end{bmatrix} }_{ \text{intial dataset} } \\ \\
\bar{x} &= \frac{x_{1}+x_{2}+x_{3}+\dots}{n} \\
\bar{x} &= \frac{y_{1}+y_{2}+y_{3}+\dots}{n} \\ \\
X &= \underbrace{ \begin{bmatrix}
x_{1}-\bar{x} & y_{1}-\bar{y} \\
x_{2}-\bar{x} & y_{2}-\bar{y} \\
\dots & \dots \\
x_{n}-\bar{x} & y_{n}-\bar{y}
\end{bmatrix} }_{ \text{centered dataset} } \\
\end{align*}
$$

And then calculating the covariance matrix:

$$
\text{Cov}(X) = \frac{1}{n-1} X^T X
$$
