---
class:
  - note
tags:
  - math/probability/statistics
  - university
source:
  - "[[Statistics Index]]"
related:
  - "[[Hypothesis Testing]]"
  - "[[Sampling Distribution]]"
  - "[[Normal Distribution Graph]]"
author:
description: An interval around a point estimate, built from its standard error, that captures the true population parameter at a stated rate.
aliases:
  - Confidence Interval
  - CI
  - Point Estimate
date: 2024-10-23
updated: 2026-11-19T21:50:00-05:00
---
- research question: from a [[Sample|sample]] statistic, what can we say about the [[Population|population]] [[Parameter|parameter]]? answer with a confidence interval or a [[Hypothesis Testing|hypothesis test]]
- **point estimate**: the single best guess, $\bar{x}$ for $\mu$, $\hat{p}$ for $p$
	- says nothing about how wrong it might be, which is what the interval adds
- **confidence interval**: estimate $\pm$ [[Margin of Error|margin of error]] $E$, like a poll's $45\% \pm 3\%$

$$
\hat{p} \pm z_{\alpha/2} \sqrt{\frac{\hat{p}(1-\hat{p})}{n}}
$$

	- for a random sample $\hat{p}$ is roughly normal, $\hat{p} \sim N\left(p, \sqrt{p(1-p)/n}\right)$ ( [[Sampling Distribution]] )
	- $p$ is unknown, so plug in $\hat{p}$: $SE(\hat{p}) = \sqrt{\hat{p}(1-\hat{p})/n}$ is the [[Standard Error|standard error]], and $E = z_{\alpha/2} \, SE(\hat{p})$
- critical values $z_{\alpha/2} = |\text{invNorm}(\alpha/2)|$ on the TI-84 ( [[Normal Distribution Graph]] )
	- $C = 95\%$: $\alpha/2 = 0.025 \to 1.96$
	- $C = 90\%$: $\alpha/2 = 0.05 \to 1.645$
	- $C = 80\%$: $\alpha/2 = 0.10 \to 1.282$
	- more confidence, wider interval: you buy confidence with precision
- 95% describes the *method*: intervals built this way capture the true $p$ in 95% of samples, any one interval either has it or doesn't
- example: $\hat{p} = 0.45$, $E = 0.03$ gives $[0.42, 0.48]$
	- at 95% that margin takes $n = 1.96^2 (0.45)(0.55) / 0.03^2 \approx 1057$ people
- a $C$ interval and a two sided test at $\alpha = 1 - C$ always agree ( [[Hypothesis Testing]] )
- the class only uses this traditional formula method, not bootstrapping
