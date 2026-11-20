---
class:
  - note
tags:
  - math/probability/statistics
  - university
source:
  - "[[Statistics Index]]"
related:
  - "[[Population]]"
  - "[[Descriptive Statistics]]"
  - "[[Sampling Distribution]]"
author:
description: A subset of a population that is actually measured or observed, used to infer things about the whole population.
aliases:
  - Samples
  - Simple Random Sample
  - SRS
  - Representative Sample
date: 2024-09-12
updated: 2026-11-19T21:50:00-05:00
---
- **sample**: subset of a [[Population|population]] that's actually measured, observed or asked, used to infer things about the whole
	- cheaper and faster than measuring everyone, the price is [[Sampling Error|sampling error]]
- **simple random sample** ( SRS ): every possible group of $n$ population items is equally likely to be the one chosen
	- stronger than "each member equally likely" ( picking every 10th name gives everyone the same chance, but most groups can never come up )
	- done with a random number generator or names from a hat, unbiased by construction, and with large $n$ it tends to be representative
	- needs a complete list of the population, which often doesn't exist, and small samples can still miss by chance
	- example: an SRS of 5 from 50 makes each of $\binom{50}{5} = 2{,}118{,}760$ possible samples equally likely ( [[Counting Methods]] )
- **representative sample**: mirrors the population on the characteristics that matter ( age, gender, income ... ), no subgroup over or under represented
	- that's what lets conclusions generalize, and the more representative the more accurate the inference
	- [[Stratified Sampling|stratified sampling]] guarantees it on chosen variables ( random within each subgroup ); quota sampling fills a quota per subgroup, but not randomly
- SRS is a *method*, representative is a *property*: an SRS usually gets you representative, but can miss small subgroups
- **sampling bias**: some members are more likely to be picked than others, like polling one engineering class about all UVM undergrads ( [[Descriptive Statistics]] )
- **sampling frame**: the list you actually draw from, gaps in it carry straight into the sample
