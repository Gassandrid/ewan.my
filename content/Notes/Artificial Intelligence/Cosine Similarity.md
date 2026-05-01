---
class:
  - note
tags:
  - cs/ai/latent-space
  - math/linear-algebra
source:
  - "[[But how do AI images and videos actually work?]]"
related:
author:
date: 2025-12-14
updated: 2025-12-14
---
**Cosine Similarity** serves as a useful tool for evaluating the similarity of two $n$ dimensional vectors. It is oftentimes used for finding "nearest neighbors" in a high dimensional [[Latent Space]]. In the [[Large Language Model]] world it is particularly useful in systems like [[Retrieval Augmented Generation]] for fetching similar embeddings to a given query, but also for general "similar semantic meaning" clustering.

It also has applications in model training and evaluation, such cases include [[CLIP]] for using Cosine Similarity to match the corresponding vectors for a image and its label.

$$
Cosine \ Similarity = \frac{\mathbf{I}\cdot \mathbf{T}}{||\mathbf{I}||_{2}||\mathbf{T}||_{2}}
$$

![[SimCosine.png]]
