---
created_on: "[[11-06-2025]]"
class:
  - note
tags:
  - cs/ai/latent-space
  - math/topology
source:
  - "[[Latent Space Visualisation PCA, t-SNE, UMAP  Deep Learning Animated]]"
related:
author:
description:
date: 2025-11-06
updated: 2026-01-27T11:56:00-05:00
aliases:
  - UMAP
"related:":
  - "[[Uniform Manifold Approximation and Projection]]"
  - "[[Principle Component Analysis]]"
---
**Uniform Manifold Approximation and Projection(UMAP)**, much like [[T-distributed stochastic neighbor embedding|t-SNE]], has the goal of modeling the distances between points in high-dimensional space in a lower-dimensional space, while preserving local structure. However, UMAP is generally faster and scales better to large datasets compared to [[T-distributed stochastic neighbor embedding|t-SNE]], while also preserving more of the global structure of the data. It does this by attempting to build a graph model instead of a Gaussian like SNE.

Unlike both [[Principle Component Analysis]] and [[T-distributed stochastic neighbor embedding]], UMAP has an exceptional ability to preserve the structure of the data in a way where you can understand the higher dimensional shape. A great example is mapping a 3d point cloud of a familiar object (like a mammoth) to $\mathbb{R}^2$:

![[UmapMammoth.gif]]

---

## Formulation

UMAP is grounded in Riemannian geometry and algebraic topology, specifically the theory of **fuzzy simplicial sets**. While the full mathematical framework is complex, the algorithmic implementation can be understood in terms of graph construction and optimization.

### Graph Construction

UMAP first constructs a weighted k-nearest neighbor graph in the high-dimensional space. For each point $x_i$, we find its $k$ nearest neighbors and compute edge weights using an exponential kernel with adaptive bandwidth:

$$
w(x_i, x_j) = \exp\left(-\frac{\max(0, d(x_i, x_j) - \rho_i)}{\sigma_i}\right)
$$

**where:**

- $d(x_i, x_j)$ is the distance between points
- $\rho_i$ is the distance to the nearest neighbor of $x_i$ (ensures local [[Connectivity]])
- $\sigma_i$ is a [[normalization]] factor chosen so that $\sum_j w(x_i, x_j) = \log_2(k)$

The weights are then symmetrized using a fuzzy set union:

$$
w_{ij} = w(x_i, x_j) + w(x_j, x_i) - w(x_i, x_j) \cdot w(x_j, x_i)
$$

### Low-Dim Representation

For Lower Dimensions UMAP uses a probability distribution based on the distance between embedded points $y_i$ and $y_j$:

$$
q_{ij} = \left(1 + a \cdot ||y_i - y_j||^{2b}\right)^{-1}
$$

where $a$ and $b$ are hyperparameters controlling the shape of the embedding (typically $a \approx 1.93$ and $b \approx 0.79$ for 2D embeddings). These are determined by the `min_dist` [[parameter]], which controls how tightly points can be packed together.

### Optimization Objective

UMAP minimizes the [[Cross Entropy]] between the high and low-dimensional representations:

$$
C = \sum_{i,j} w_{ij} \log\left(\frac{w_{ij}}{q_{ij}}\right) + (1-w_{ij})\log\left(\frac{1-w_{ij}}{1-q_{ij}}\right)
$$

This is optimized using stochastic [[gradient descent]] with negative sampling for efficiency. The gradient with respect to the low-dimensional coordinates is:

$$
\frac{\partial C}{\partial y_i} = \sum_{j \in N(i)} \frac{-2ab||y_i-y_j||^{2b-2}}{1 + a||y_i-y_j||^{2b}}(y_i - y_j)w_{ij} - \sum_{j \notin N(i)} \frac{2b}{(0.001 + ||y_i-y_j||^2)(1 + a||y_i-y_j||^{2b})}(y_i - y_j)(1-w_{ij})
$$

where $N(i)$ denotes the neighbors of $i$.

### Main Hyperparameters

$n_{neighbors}$: Controls locality/size of neighborhood clusters. Small values focus on local substructure, high values mean more global structure captured.

$min-dist$: minimum value between points in low dim space.

---

## Use when

You want to get a sense of global/local structure like [[T-distributed stochastic neighbor embedding|t-SNE]], without the huge performance cost. However, it is still vulnerable to hyperparameter sensitivity, where outputs may differ greatly through tiny changes to inputs.

### Some Use Cases in [[Computational Neuroscience]]

UMAP has become increasingly popular in neuroscience for:

- **Neural population analysis**: Visualizing high-dimensional neural state spaces
- **Single-cell RNA-seq**: Clustering and trajectory inference in genomic data
- **Spike train embeddings**: Revealing structure in population firing patterns
- **Behavioral manifolds**: Mapping high-dimensional behavioral recordings to interpretable spaces
