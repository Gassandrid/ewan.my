---
class:
  - note
tags:
  - cs/ai/interpretability
  - cs/ai/ssl
source:
related:
author:
description:
aliases:
  - Linear Probing
  - Linear Probes
date: 2026-10-13T16:44:15-04:00
updated: 2026-10-13T16:50:55-04:00
---

Useful and common tool for [[Mechanistic Interpretability|Interpretability]] work, particularly with [[Self Supervised Learning]] methods like [[Barlow Twins]] and [[Joint Embedding Predictive Architecture|JEPA]].

- it is good for [[Representation]] probing because if it achieves high accuracy on a prediction task off of an embedding, that means that the feature is already well organized in the embeddings and seperate using a straight boundary in that space
- one can also train linear probes on a layer by layer basis for activations, such that people can track *where* a network constructs specific concepts
- very important for self supervised approaches in tasks like that of ImageNet, where self supervised models dont learn to classify the images of the dataset through their labels, only building a good representation of the features of an image that make them identifiable. Linear probes reveal that these SSL models can distinguish the images to their labels with distinct clusters and thresholds.

[![Pasted image 20261013165055.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/ab56b013460d40d969152340b8df2c0c8e5f0679b0c447e54cac1d9456ea6faf/Pasted%20image%2020261013165055.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/ab56b013460d40d969152340b8df2c0c8e5f0679b0c447e54cac1d9456ea6faf/Pasted%20image%2020261013165055.png)
