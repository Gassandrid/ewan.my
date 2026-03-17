---
date: 2026-03-16T13:54:41-04:00
updated: 2026-03-16T14:01:12-04:00
class:
  - note
created_on: "[[03-16-2026]]"
tags:
  - math/probability/statistics
source:
  - "[[HealthTRAC]]"
related:
author:
description:
aliases:
---

Popular effect size measure that quantifies the difference between two means. Indicates the magnitude of effect regardless of the sample size.

$$
d=\frac{M_{1}-M_{2}}{SD_{pooled}}
$$

$$
SD_{pooled}=\sqrt{ \frac{(n_{1}-1)SD^{2}_{1}+(n_{2}-1)SD^{2}_{2}}{n_{1}+n_{2}-2} }
$$

**Where:**

- $M_{1},M_{2}$ are sample means
- $SD_{1},SD_{2}$ are sample standard deviations
- $n_{1},n_{2}$ are sample sizes

![[cohenD.png]]
