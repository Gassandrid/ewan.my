---
id: CH5 - Confidence Intervals
aliases: []
tags:
  - statistics
date: "2024-10-23"
---

## Research Question

When working with confidence intervals, we start with a **Research Question:**  
Taking a sample and finding the sample statistic, what can we estimate about the population? To answer this, we calculate a confidence interval or conduct a [[Hypothesis Test]].

---

## 5.1 - Point Estimates and Confidence Intervals

Point estimates are single values calculated from sample data to estimate population parameters. They serve as our "best guess" of the true population value.

### Point Estimates

For example:

- Use the sample mean $\bar{x}$ to estimate the population mean $\mu$.
- Use the sample proportion $\hat{p}$ to estimate the population proportion $p$.

Point estimates give us a starting point, but they lack information about how much error may exist in the estimate. That’s where confidence intervals come in.

---

## 5.2 - Confidence Intervals for Proportions

> [!Warning] Traditional Method Only
> In this class, we focus solely on the **traditional method** for constructing confidence intervals, ignoring other approaches like bootstrapping.

### Confidence Interval Example - Presidential Approval Rating

Polls often present approval ratings in the format:

$$
45\% \pm 3\%
$$

This is equivalent to the formula:

$$
\hat{p} \pm E
$$

Where:

- $\hat{p}$ = sample proportion
- $E$ = margin of error

### Constructing a Confidence Interval

1. Start with a **Random Sample** from a [[Sampling Distribution]]. Assume the sample proportion $\hat{p}$ is approximately normal:

   $$
   \hat{p} ~ N(p, \sqrt{\frac{p(1-p)}{n}})
   $$

   Where:

   - $p$ = population proportion
   - $n$ = sample size

2. Calculate the standard error (SE):

   $$
   \sigma = \sqrt{\frac{\hat{p}(1-\hat{p})}{n}}
   $$

   For confidence intervals, $\sigma \approx SE(\hat{p})$.

3. Use the formula for a confidence interval:
   $$
   \hat{p} \pm z \sqrt{\frac{\hat{p}(1-\hat{p})}{n}}
   $$
   Where $z$ is the critical value for the desired confidence level.

### Confidence Levels and Critical Values

Common critical values for the $z$-score:

- **95% Confidence Level**:
  $$
  C = 95\% \rightarrow \frac{\alpha}{2} = 0.025 \rightarrow z_{.025} = | invNorm(0.025) | = 1.96
  $$
- **90% Confidence Level**:
  $$
  C = 90\% \rightarrow \frac{\alpha}{2} = 0.05 \rightarrow z_{.05} = | invNorm(0.05) | = 1.645
  $$
- **80% Confidence Level**:
  $$
  C = 80\% \rightarrow \frac{\alpha}{2} = 0.10 \rightarrow z_{.10} = | invNorm(0.10) | = 1.282
  $$

> [!Note] Observation
> As the confidence level increases, the margin of error also increases. This means we gain confidence but lose precision.

---

## Why Confidence Intervals?

Confidence intervals provide a range within which we expect the true population parameter to lie with a certain level of confidence. This is more informative than a single point estimate, as it accounts for sampling variability.

For example:

- If $\hat{p} = 0.45$ with $E = 0.03$, the 95% confidence interval is:
  $$
  0.45 \pm 0.03 = [0.42, 0.48]
  $$
  This means we are 95% confident the true population proportion lies within this range.
