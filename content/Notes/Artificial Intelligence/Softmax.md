---
id: Softmax
aliases: []
tags: [cs/ai, math]
date: 2025-08-12
updated: 2025-08-12
---

While quite a simple function, the softmax function is a crucial component in many machine learning models, particularly in classification tasks. It converts a vector of raw scores (logits) into probabilities that sum to one, making it suitable for multi-class classification problems.

It is defined as follows:

$$
Softmax(z_i) = \frac{e^{z_i}}{\sum_{j=1}^{K} e^{z_j}}
$$

For [[Large Language Models]], the softmax function is often used in the output layer to convert the logits into probabilities for each token in the vocabulary, allowing the model to predict the next token based on the highest probability:

![[Screenshot 2025-08-12 at 3.27.59 PM.png]]
