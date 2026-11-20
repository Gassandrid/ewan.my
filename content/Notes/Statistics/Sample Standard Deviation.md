---
id: Sample Standard Deviation
class:
  - note
tags:
  - math/probability/statistics
  - cs/python
  - university
source:
  - "[[Statistics Index]]"
related:
  - "[[Descriptive Statistics]]"
  - "[[1 Variable Stats On Calculator]]"
  - "[[Sampling Distribution]]"
author:
description: How spread out sample values are around their mean, dividing by n - 1 so the sample variance estimates the population variance without bias.
aliases:
  - Standard Deviation
  - Sample Variance
  - Variance
date: 2024-09-12
updated: 2026-11-19T21:50:00-05:00
---
- **standard deviation**: typical distance of the values from their mean, the square root of the **variance** ( the average squared deviation )
	- low: values hug the mean; high: spread over a wide range
- from a [[Sample|sample]] divide by $n - 1$, for a whole [[Population|population]] by $N$

$$
s = \sqrt{\frac{\sum_{i=1}^{n} (x_i - \bar{x})^2}{n - 1}} \qquad \sigma = \sqrt{\frac{\sum_{i=1}^{N} (x_i - \mu)^2}{N}}
$$

	- deviations from $\bar{x}$, which was fit to the same data, come out a bit small; $n - 1$ ( degrees of freedom ) undoes that and makes $s^2$ an unbiased estimate of $\sigma^2$
	- the TI-84 shows both, `Sx` is $s$ and `σx` is $\sigma$ ( [[1 Variable Stats On Calculator]] )
- example: 2, 4, 6, 8, 10
	- $\bar{x} = 30/5 = 6$, squared deviations 16, 4, 0, 4, 16, sum 40
	- as a sample: $s^2 = 40/4 = 10$, $s = \sqrt{10} \approx 3.16$
	- as the whole population: $\sigma^2 = 40/5 = 8$, $\sigma = \sqrt{8} \approx 2.83$
- shows up in every spread-based tool: [[Standard Error|standard errors]], [[Confidence Intervals]], $t$ tests in [[Hypothesis Testing]], feature scaling in [[Machine Learning|machine learning]]
- the TI-84's 1-Var Stats in python, with a boxplot and a histogram marking the mean and 20% trimmed mean

```python
import micropip
await micropip.install(["numpy", "matplotlib", "scipy"])

from scipy.stats import trim_mean
import numpy as np
import matplotlib.pyplot as plt

lst = [12, 15, 14, 10, 18, 20, 24, 13, 17, 22]

mean = np.mean(lst)
trimmed_mean = trim_mean(lst, 0.2)
q1, median, q3 = np.percentile(lst, [25, 50, 75])

print(f"Mean (x̄): {mean}")
print(f"Sum of x (Σx): {np.sum(lst)}")
print(f"Sum of x squared (Σx²): {np.sum(np.square(lst))}")
print(f"Sample Standard Deviation (Sx): {np.std(lst, ddof=1)}")
print(f"Population Standard Deviation (σx): {np.std(lst)}")
print(f"Number of data points (n): {len(lst)}")
print(f"minX {np.min(lst)}, Q1 {q1}, Med {median}, Q3 {q3}, maxX {np.max(lst)}")
print(f"20% Trimmed Mean: {trimmed_mean}")

plt.figure(figsize=(6, 4))

plt.subplot(1, 2, 1)
plt.boxplot(lst, vert=False)
plt.title('Boxplot of Data')
plt.xlabel('Value')

plt.subplot(1, 2, 2)
plt.hist(lst, bins=8, edgecolor='black', alpha=0.7)
plt.axvline(mean, color='r', linestyle='dashed', linewidth=2, label=f'Mean: {mean:.2f}')
plt.axvline(trimmed_mean, color='g', linestyle='dashed', linewidth=2, label=f'Trimmed Mean: {trimmed_mean:.2f}')
plt.title('Histogram of Data')
plt.xlabel('Value')
plt.ylabel('Frequency')
plt.legend()

plt.tight_layout()
plt.show()
```
