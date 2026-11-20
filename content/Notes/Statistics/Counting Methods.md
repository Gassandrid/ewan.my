---
id: Counting Methods
class:
  - note
tags:
  - math/probability/statistics
  - university
source:
related:
  - "[[Probability]]"
  - "[[Binomial Distribution]]"
author:
description: "Counting rules for sample spaces too big to list: the multiplication principle, permutations and combinations."
aliases:
  - Counting Method
  - Counting Rule
  - Permutations
  - Permutation
  - Combinations
  - Combination
  - nCr
  - nPr
date: 2024-09-12
updated: 2026-11-20T01:57:40-05:00
---
- once $S$ is too big to list, count it instead; with equally likely outcomes $P(A) = \frac{|A|}{|S|}$ ( [[Probability]] )
- **basic counting rule**: $m$ ways for the first choice and $n$ for the second gives $m \cdot n$ ways for both, and so on down the chain
	- forgotten locker code: first number 22 or 32, second 0 to 9, third 0 to 45, so at most $2 \cdot 10 \cdot 46 = 920$ tries
- **permutations**: order matters, $r$ things arranged from $n$

	$$
	P(n, r) = \frac{n!}{(n - r)!}


$$
	- arranging the letters of `math`: $P(4, 4) = 4! = 24$
- **combinations**: order doesn't matter, so divide out the $r!$ orderings
	$$
	C(n, r) = \binom{n}{r} = \frac{n!}{r!\,(n - r)!}
	
$$

	- 5 scholarship winners from 50 applicants: $\binom{50}{5} = 2{,}118{,}760$
	- $\binom{n}{r}$ is the coefficient in the [[Binomial Distribution]]
- worked example: 17 of 100 lightbulbs are broken, pick 3 without replacement
	- ways to pick the sample: $\binom{100}{3} = 161{,}700$
	- samples with no broken bulb: $\binom{83}{3} = 91{,}881$
	- $P(\text{no broken}) = \frac{91881}{161700} \approx 0.568$
