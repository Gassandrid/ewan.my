---
class:
  - note
tags:
  - math/probability/statistics
  - university
source:
  - "[[Statistics Index]]"
related:
  - "[[Sample]]"
  - "[[Confidence Intervals]]"
  - "[[Hypothesis Testing]]"
author:
description: The distribution a sample statistic such as the sample mean or proportion takes across all random samples of the same size.
aliases:
  - Sampling Distributions
  - Sampling Variability
date: 2024-10-15
updated: 2026-11-19T21:50:00-05:00
---
- **sampling distribution**: the [[Probability Distribution|probability distribution]] of a statistic ( $\bar{x}$, $\hat{p}$ ) over every [[Sample|random sample]] of size $n$ from a [[Population|population]]
	- it's the natural sampling variability made exact: how much the statistic moves from one sample to the next
	- the bridge from statistic to population [[Parameter|parameter]], so it sits under every [[Confidence Intervals|confidence interval]] and [[Hypothesis Testing|hypothesis test]]
- centered on the parameter, with a spread called the [[Standard Error|standard error]]

$$
\mu_{\bar{x}} = \mu, \quad \sigma_{\bar{x}} = \frac{\sigma}{\sqrt{n}} \qquad \mu_{\hat{p}} = p, \quad \sigma_{\hat{p}} = \sqrt{\frac{p(1-p)}{n}}
$$

	- bigger $n$, narrower distribution, but only as $\sqrt{n}$ ( 4x the data for half the spread )
- shape: as $n$ grows the sampling distribution of $\bar{x}$ goes [[Normal Distribution Graph|normal]] even when the population isn't, the [[Central Limit Theorem]]
- example: salt use over $n = 45$ storms with $s = 819.35$ tons gives $SE = 819.35 / \sqrt{45} \approx 122$ tons, so a sample mean a couple hundred tons off is still business as usual ( the full test is in [[Hypothesis Testing]] )
