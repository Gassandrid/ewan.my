---
id: Descriptive Statistics
class:
  - note
tags:
  - math/probability/statistics
  - university
source:
  - "[[Statistics Index]]"
related:
  - "[[Population]]"
  - "[[Sample]]"
  - "[[Categorical Variables]]"
  - "[[Sample Standard Deviation]]"
author:
description: How data comes from sampling a population and the categorical and quantitative types it comes in.
aliases:
  - Sampling and Descriptive Statistics
  - Types of Data
  - Quantitative Data
date: 2024-09-12
updated: 2026-11-19T21:50:00-05:00
---
- getting data: measure a [[Sample|sample]] to say something about a [[Population|population]]
	- only works if the sample is representative, and the best tool for that is a [[Sample|simple random sample]]
	- every sample gives a slightly different answer, natural [[Sampling Distribution|sampling variability]]
- example: what proportion of [[University Of Vermont|UVM]] undergrads are in CEMS?
	- population: all UVM undergrads; sample: the 50 students in STAT2430A
	- sample $\hat{p} = \frac{46}{50} = 0.92$, actual $p = \frac{1372}{10925} = 0.126$
	- way off because STAT2430A is mostly CEMS students, a convenient sample, not a representative one
	- the same class gave $\hat{p} = \frac{7}{50} = 0.14$ for out of state, just as untrustworthy
- **categorical** ( qualitative ) data: sorted into categories, see [[Categorical Variables]]
	- nominal: no order ( colors, countries, cuisines )
	- ordinal: ordered, but the gaps between levels mean nothing ( ratings, rankings )
- **quantitative** ( numerical ) data: measured or counted
	- discrete: countable values ( students in a class, cars in a lot )
	- continuous: any value in a range ( height, race time )
- the type picks the analysis: counts, proportions and [[Chi Squared Tests|chi squared tests]] for categorical; mean, median, [[Sample Standard Deviation|standard deviation]] and quartiles for quantitative
