---
class:
  - note
tags:
  - cs/ai
source:
related:
author:
description:
aliases:
  - SVM
date: 2026-02-02T09:11:55-05:00
updated: 2026-02-02T09:13:58-05:00
---

**SVMs** are good generalization classifiers both in theory and in practice. Particularly works well with few samples and high dimensional data.

The goal of the SVM algorithm is to find a hyperplane in an N-dimensional space (N — the number of features) that distinctly classifies the data points.

$$
\text{Given a training dataset } \{(x_i, y_i)\}_{i=1}^m, \text{ where } x_i \in \mathbb{R}^n \text{ and } y_i \in \{-1, 1\},
$$

In plain english, they seek to find a "road" in the feature space that separates the two classes of data points with the largest possible margin. Not just a infitesimally thin line, but a wide road that gives some buffer room. Then, new data points can be classified based on which side of the road they fall on. Also allows for a "noise margin" where some points can be on the wrong side of the road if necessary.

> $H_{1}$ does not separate the classes. $H_{2}$ does, but only with a small margin. $H_{3}$ separates them with the maximal margin.
>
> ![[SVM.png]]
