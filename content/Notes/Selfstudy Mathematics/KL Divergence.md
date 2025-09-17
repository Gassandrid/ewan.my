---
class:
  - note
tags:
  - math/statistics/entropy
  - math/information
  - todo/math
source:
  - "[[The Key Equation Behind Probability]]"
related:
author:
date: 2025-09-16
updated: 2025-09-16
---

**KL Divergence** (Kullback-Leibler Divergence) is a measure of how one probability distribution diverges from a second, expected probability distribution. Extending on the idea of [[Cross Entropy]], KL Divergence provides a way to quantify the difference between two distributions by measuring the inefficiency of assuming that the distribution is $Q$ when the true distribution is $P$.

---

It can be thought of as the amount of information lost when $Q$ is used to approximate $P$. In other words, it tells us how much more "surprise" we would experience if we were to use the distribution $Q$ instead of the true distribution $P$.

$$
D_{KL}(P || Q) = \sum_{x} P(x) \log_b\left(\frac{P(x)}{Q(x)}\right)
$$

---

## What is KL Divergence Used For?
