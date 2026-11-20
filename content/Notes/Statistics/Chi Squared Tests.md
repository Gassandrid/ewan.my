---
class:
  - note
tags:
  - math/probability/statistics
  - university
source:
  - "[[Statistics Index]]"
related:
  - "[[Categorical Variables]]"
  - "[[Hypothesis Testing]]"
  - "[[Null Hypothesis]]"
author:
description: Tests that compare observed category counts with the counts a null hypothesis expects, either against a claimed distribution or for independence of two categorical variables.
aliases:
  - Chi Squared
  - Chi Squared Test
  - Chi-Square Test
  - Goodness of Fit Test
  - Test of Independence
date: 2024-12-13
updated: 2026-11-19T21:50:00-05:00
---
- two tests on [[Categorical Variables|categorical]] counts, same statistic

$$
\chi^2 = \sum \frac{(O - E)^2}{E}
$$

	- $O$ observed count, $E$ count expected under $H_0$, summed over every category or cell
	- big $\chi^2$ means observed is far from expected; compare against a $\chi^2$ distribution with the right df
- **goodness of fit** ( GOF ): one categorical variable, does the [[Sample|sample]] match a hypothesized distribution?
	- $E = (\text{hypothesized proportion}) \times (\text{grand total})$, $df = k - 1$ for $k$ categories
- **test of independence**: two categorical variables in a contingency table, are they associated?
	- $E = \frac{\text{row total} \times \text{column total}}{\text{grand total}}$, $df = (r - 1)(c - 1)$
- both want every expected count around 5 or more
- TI-84
	- GOF: observed in `L1`, expected in `L2`, `STAT` > `TESTS` > `χ²GOF-Test` with $df = k - 1$
	- independence: observed in matrix `[A]`, `STAT` > `TESTS` > `χ²-Test`, it writes the expected counts into `[B]`
	- [[P-Value|p-value]] $< \alpha$ ( say 0.05 ): reject the [[Null Hypothesis|null hypothesis]] ( [[Hypothesis Testing]] )

## example: goodness of fit

| color  | hypothesized proportion | observed | expected |
| ------ | ----------------------- | -------- | -------- |
| brown  | .125                    | 339      | 335      |
| blue   | .25                     | 583      | 670      |
| yellow | .125                    | 359      | 335      |
| orange | .25                     | 493      | 670      |
| green  | .125                    | 515      | 335      |
| red    | .125                    | 391      | 335      |
| total  | 1                       | 2680     | 2680     |

- contributions: brown $\frac{(339-335)^2}{335} = 0.048$, blue $\frac{(583-670)^2}{670} = 11.297$, yellow $1.719$, orange $46.760$, green $96.716$, red $9.361$

$$
\chi^2 = 0.048 + 11.297 + 1.719 + 46.760 + 96.716 + 9.361 = 165.90, \qquad df = 5
$$

- p-value $\approx 5 \times 10^{-34}$, reject $H_0$: the colors don't come in the claimed proportions, mostly too much green and too little orange
