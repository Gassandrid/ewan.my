---
id: Bayesian Inference
aliases: []
tags:
  - math/probability/bayesian
class:
  - note
date: 2025-09-24
source:
  - "[[The better way to do statistics - Bayesian 1]]"
updated: 2025-09-24
---
**Bayesian Inference** is the extension of Bayes' Theorem to the realm of statistical inference, allowing us to update our beliefs about unknown parameters based on observed data. It provides a coherent framework for learning from data and making predictions.

Taking the well known Bayes' Theorem:

$$
P(A|B) = \frac{P(B|A) \cdot P(A)}{P(B)}
$$

We can interpret the components in the context of statistical inference:

$$
P(\theta|D) = \frac{P(D|\theta) \cdot P(\theta)}{P(D)}
$$

_^ we examine this in further detail below_

$$
\text{Posterior} = \frac{\text{Likelihood} \times \text{Prior}}{\text{Evidence}}
$$

In essence, Bayesian Inference allows us to update our prior beliefs about a parameter $\theta$ after observing data $D$, resulting in a posterior distribution that reflects our updated beliefs.

---

## Extending to Probability Distributions

The domain in which Bayesian Inference is mostly applied is in comparing a hypothetical probability distribution to observed data. In this context, the components of Bayes' Theorem can be interpreted as follows:

$$
P(\theta|D) = \frac{P(D|\theta) \cdot P(\theta)}{P(D)}
$$

What this actually means is that for a given set of data $D$, we want to find the probability distribution of a parameter $\theta$ (e.g., the mean of a normal distribution) given that data. $P(D)$ represents the marginal probability of observing the data under all possible values of $\theta$.
