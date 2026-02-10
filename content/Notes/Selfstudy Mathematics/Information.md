---
class:
  - note
tags:
  - math/probability
  - math/information/entropy
source:
related:
author:
description:
aliases:
date: 2026-02-06T10:04:19-05:00
updated: 2026-02-06T10:04:30-05:00
---

Very general meaning across fields of math.

In **Information Theory**, information quantifies the amount of uncertainty reduced when we learn the outcome of a random variable. It is often measured in bits, where one bit represents the information gained from learning the outcome of a binary random variable (e.g., a coin flip). The more uncertain or unpredictable the outcome, the more information it provides when revealed.

> [!Example] The Quarter vs the Die
> Something has complete information when there is no uncertainty about its outcome. For example, a quarter has two possible outcomes (heads or tails), so it provides 1 bit of information when flipped. In contrast, a six-sided die has six possible outcomes, so it provides more information (log2(6) ≈ 2.585 bits) when rolled, because it reduces more uncertainty about the outcome.

Formally this is defined as the [[Entropy in Information|entropy]]of a random variable, which is calculated using the formula:

$$
H(X) = -\sum_{i} P(x_i) \log_2 P(x_i)
$$

---

While still similar, there is also the measure of [[Fisher Information|Fisher information]], which quantifies the amount of information that an observable random variable carries about an unknown parameter upon which the probability depends. It is used in statistics to measure the precision of an estimator.
