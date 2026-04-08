---
date: 2026-03-16T14:04:51-04:00
updated: 2026-04-02T10:37:34-04:00
tags:
  - math/probability/statistics
class:
  - note
created_on: "[[03-16-2026]]"
source:
  - "[[HealthTRAC]]"
  - https://people.eecs.berkeley.edu/~jordan/courses/210B-spring07/lectures/stat210b_lecture_19.pdf
related:
author:
description:
aliases:
  - ARE
---

A measure of the performance of two statistical procedures, either tests or estimators, as sample size $\lim_{ n \to \infty }$. Defined as the limit of the ratio $\frac{n_{2}}{n_{1}}$ needed for achieving statistical power/reciprocal ratio of their asymptotic variances.

## Formally,

For two estimators $\hat{\theta_{1}}$ and $\hat{\theta_{2}}$  along with asymptotic variances $\sigma_{1}^{2}$ and $\sigma_{2}^{2}$, **ARE** is typically defined as $\frac{\sigma_{2}^{2}}{\sigma_{1}^{2}}$

![[asympRelaEfficiency.png]]
