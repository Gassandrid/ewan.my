---
id: Sparse Autoencoder
aliases: []
tags:
  - cs/ai/llm
  - cs/ai/interpretability
class:
  - note
date: 2025-09-25
updated: 2025-09-25
source:
related:
  - "[[Superposition in AI]]"
  - "[[Polysemanticity]]"
  - "[[Mechanistic Interpretability]]"
author:
---

**Sparse Autoencoders** are a technique for investigating [[Mechanistic Interpretability]] and the idea of [[Mechanistic Interpretability#Superposition and Polysemanticity|Superposition and Polysemanticity]].

![[SparseEncoder.png]]

The key idea is to use a separate learning algorithm to extract model features that often align with human-understandable concepts. Researchers can then amplify or suppress these features to observe their effect on the model's behavior.

The primary operation is to train a sparse autoencoder on the activations of a specific layer in a neural network. The autoencoder learns to reconstruct the original activations while enforcing sparsity, meaning that only a small number of neurons are active at any given time. This encourages the autoencoder to learn more interpretable features.

This can be done by taking a matrix $M$ of activations from a specific layer in the model, where each row corresponds to a different input example, and each column corresponds to a different neuron in that layer. The sparse autoencoder then learns a weight matrix $W$ such that:

$$
\hat{M} = M W^T W
$$

The loss function for training the sparse autoencoder typically includes a reconstruction loss term and a sparsity penalty term, such as:

$$
\text{Loss} = ||X - \hat{X}||^2 + \lambda \sum |h_i|
$$
