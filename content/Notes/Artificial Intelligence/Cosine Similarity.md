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
updated: 2026-11-03T15:40:10-05:00
---

**Cosine Similarity** serves as a useful tool for evaluating the similarity of two $n$ dimensional vectors. It is oftentimes used for finding "nearest neighbors" in a high dimensional [[Latent Space]]. In the [[Large Language Model]] world it is particularly useful in systems like [[Retrieval Augmented Generation]] for fetching similar embeddings to a given query, but also for general "similar semantic meaning" clustering.

It also has applications in model training and evaluation, such cases include [[CLIP]] for using Cosine Similarity to match the corresponding vectors for a image and its label.

$$
Cosine \ Similarity = \frac{\mathbf{I}\cdot \mathbf{T}}{||\mathbf{I}||_{2}||\mathbf{T}||_{2}}
$$

[![SimCosine.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/5872bcb49014ce092a3c3a9a5f019d7bc53991fc50cca1114b5d5947582b0a9e/SimCosine.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/5872bcb49014ce092a3c3a9a5f019d7bc53991fc50cca1114b5d5947582b0a9e/SimCosine.png)
