---
id: Cross Entropy
aliases: []
tags:
  - math/information/entropy
  - math/information
class:
  - note
date: 2025-09-16
source:
  - "[[The Key Equation Behind Probability]]"
updated: 2026-02-09T09:00:37-05:00
---

**Cross Entropy** builds on the concept of [[Entropy in Information]] by measuring the difference between two probability distributions. While entropy quantifies the uncertainty within a single distribution, cross entropy evaluates how one distribution diverges from another.

**Why have this?**

In an ideal world, we would have access to the underlying [[Probability Distribution]] used to create our sample, making entropy very easy to calculate. But in reality, we dont have this perfect [[Probability Distribution]], and thus we need an approximation. What cross entropy allows us to do is compare the true distribution (which we may not know) with an estimated distribution (which we do know).

---

### How Can We Quantify the Difference between Two Probability Distributions?

We extend apon the idea of **cross entropy** with something call **Kullback-Leibler Divergence** ([[Kullback-Leibler Divergence]]), which measures how one probability distribution diverges from a second, expected probability distribution.

#### Formal Definition

**Cross Entropy** between two discrete probability distributions $P$ and $Q$ over the same set of events is defined as:

$$
H(P, Q) = -\sum_{x} P(x) \log_b(Q(x))
$$

Where:

- $P(x)$ is the true distribution (the actual probabilities of events).
- $Q(x)$ is the estimated distribution (the predicted probabilities of events).
- $b$ is the base of the logarithm, commonly 2 (bits), e (nats), or 10 (hartleys).

#### Example Values

Let's say we have two distributions over the outcomes of a 3-sided die:

$$
P = \{p(1)=0.5, p(2)=0.3, p(3)=0.2\} \\
$$

$$
Q = \{q(1)=0.4, q(2)=0.4, q(3)=0.2\} \\
$$

We can calculate the cross entropy $H(P, Q)$ as follows:

$$
H(P, Q) = -\left(0.5 \log_2(0.4) + 0.3 \log_2(0.4) + 0.2 \log_2(0.2)\right) \approx 1.5219 \text{ bits}
$$

#### What Does This Mean?

The value of cross entropy indicates how well the predicted distribution $Q$ approximates the true distribution $P$. A lower cross entropy value suggests that $Q$ is a better approximation of $P$, while a higher value indicates greater divergence between the two distributions.

> [!Warning] Important t
> **Cross Entropy is NOT Symmetric**: means that $H(P, Q)$ is not necessarily equal to $H(Q, P)$. This asymmetry reflects the fact that the roles of the true and estimated distributions are different in the calculation.

---

## Properties of Cross Entropy

One imortant property is that the cross entropy $H(P, Q)$ is always greater than or equal to the entropy $H(P)$ of the true distribution $P$. This is because using an estimated distribution $Q$ can never reduce the uncertainty inherent in the true distribution $P$.

$$
H(P, Q) \geq H(P)
$$
