---
id: Hypothesis Testing
class:
  - note
tags:
  - math/probability/statistics
  - university
source:
  - "[[Statistics Index]]"
related:
  - "[[Confidence Intervals]]"
  - "[[Sampling Distribution]]"
  - "[[Chi Squared Tests]]"
author:
description: Using a sample statistic to decide whether the data are consistent with a claimed value of a population parameter.
aliases:
  - Hypothesis Test
  - Hypothesis Tests
  - Significance Test
date: 2024-10-29
updated: 2026-11-19T21:50:00-05:00
---
- **hypothesis testing**: use a [[Sample|sample]] statistic to test a claim about a [[Population|population]] [[Parameter|parameter]]
	- [[Null Hypothesis|null hypothesis]] $H_0$: the status quo, no effect, fixes the value $p_0$ or $\mu_0$ ( "p naught" )
	- alternative $H_1$: the change or effect you're looking for
	- the whole question is how far the statistic sits from the null value, $\hat{p} - p_0$ or $\bar{x} - \mu_0$
		- small difference: natural [[Sampling Distribution|sampling variability]], "could happen by chance alone"
		- big difference: the statistic isn't behaving the way $H_0$ says it should
- distance is counted in standard errors, that's the **test statistic** ( for a mean, $t$ with $n - 1$ degrees of freedom )

$$
t = \frac{\bar{x} - \mu_0}{s / \sqrt{n}}
$$

- **p-value** ( [[P-Value]] ): probability of a test statistic at least this extreme *if $H_0$ is true*
	- not the probability $H_0$ is true, it's how surprising the data would be if it were
	- p-value $\leq \alpha$: reject $H_0$; p-value $> \alpha$: fail to reject, the test is inconclusive ( not proof of $H_0$ )
	- **type I error**: rejecting a true $H_0$ ( happens at rate $\alpha$ ); **type II error**: failing to reject a false $H_0$
- a two sided test at level $\alpha$ agrees with a $C = 1 - \alpha$ [[Confidence Intervals|confidence interval]]: reject exactly when $\mu_0$ falls outside it

## example: salt per storm

>[!Example]
>Civil engineers collected data from one area of Wisconsin on the amount of salt (tons) used to keep highways drivable during a snowstorm. Historic use of salt in that area was 2000 tons per storm. The amount of salt for $n=45$ storms has $\bar{x}=1753.9$ tons and $s=819.35$ tons. Test the claim that the mean salt use per storm has decreased.

- means, not proportions, so a $t$ test: $\mu_0 = 2000$, $n = 45$, $\bar{x} = 1753.9$, $s = 819.35$
- $H_0: \mu \geq 2000$ ( no decrease ), $H_1: \mu < 2000$ ( decrease )
- $t = \frac{1753.9 - 2000}{819.35 / \sqrt{45}} = \frac{-246.1}{122.1} = -2.015$
- p-value on the TI-84: `tcdf(-1E99, -2.015, 44)` $\approx 0.025$, about 1 in 40
- $0.025 < \alpha = 0.05$, so reject $H_0$ at 5%, but it's only moderate evidence, and then the decision gets contextual
	- **David**, environmental lobbyist at "Save the Earth": "any victory, no matter how small, is a victory for the environment", takes it as enough
	- **Alex**, DPW budget analyst: "we can't afford to waste money on unnecessary environmental programs", wants more before acting

```python-r
import matplotlib.pyplot as plt
import numpy as np

mu0, xbar = 2000, 1753.9
se = 819.35 / np.sqrt(45)
x = np.linspace(mu0 - 4*se, mu0 + 4*se, 1000)
y = np.exp(-0.5 * ((x - mu0) / se) ** 2) / (se * np.sqrt(2 * np.pi))

plt.figure(figsize=(10, 6))
plt.plot(x, y, color='black')
plt.fill_between(x, y, where=x <= xbar, color='red', alpha=0.4, label='p-value (left tail)')
plt.axvline(mu0, color='black', linestyle='--', label=r'$\mu_0$')
plt.axvline(xbar, color='red', linestyle='--', label=r'$\bar{x}$')
plt.title(r'Sampling distribution of $\bar{x}$ under $H_0$')
plt.xlabel(r'$\bar{x}$ (tons)')
plt.ylabel('Probability Density')
plt.legend()
plt.grid(True)
plt.show()
```
