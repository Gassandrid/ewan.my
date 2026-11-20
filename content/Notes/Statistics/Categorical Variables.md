---
id: Categorical Variables
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
  - "[[Chi Squared Tests]]"
  - "[[Sample Standard Deviation]]"
author:
description: Data recorded as categories rather than measurements, summarized with counts, relative frequencies and bar charts.
aliases:
  - Categorical Variable
  - Categorical Data
  - Qualitative Data
date: 2024-09-12
updated: 2026-11-19T21:50:00-05:00
---
- **categorical variable**: each observation lands in a category instead of getting a number, nominal or ordinal ( [[Descriptive Statistics]] )
	- summarize with a table of counts: frequency $f$ and relative frequency $f/n$
	- picture with a bar chart, bar height = proportion; test with [[Chi Squared Tests|chi squared tests]]
- example: 1000 ball bearings, three categories that are mutually exclusive and exhaustive, classified not measured

| classification | frequency $f$ | relative frequency $f/n$ |
| -------------- | ------------- | ------------------------ |
| conforming     | 910           | .910                     |
| too thick      | 53            | .053                     |
| too thin       | 37            | .037                     |

```python
import micropip
await micropip.install("matplotlib")
import matplotlib.pyplot as plt

labels = ['Conforming', 'Too Thick', 'Too Thin']
values = [0.910, 0.053, 0.037]

plt.figure(figsize=(6, 4))
plt.bar(labels, values, color=['green', 'red', 'blue'])
plt.title('Ball Bearing Classification')
plt.ylabel('Proportion')
for i, value in enumerate(values):
    plt.text(i, value + 0.01, f'{value:.3f}', ha='center', va='bottom')
plt.show()
```

## contrast: chromium vs nickel

- chromium and nickel concentrations are measured, so quantitative: summarize with mean, median, [[Sample Standard Deviation|standard deviation]], quartiles ( the TI-84's [[1 Variable Stats On Calculator|1-Var Stats]] ) and a boxplot
	- chromium: 31, 1, 511, 2, 574, 496, 322, 424, 269, 140, 244, 252, 76, 108, 24, 38, 18, 43, 30, 191
	- nickel: 23, 22, 55, 39, 283, 34, 159, 37, 61, 34, 163, 140, 32, 23, 54, 837, 64, 354, 376, 471
	- both right skewed, mean well above median: chromium $\bar{x} = 189.7$, median 124, $s = 188.5$; nickel $\bar{x} = 163.05$, median 58, $s = 209.1$ ( the 837 drags it )

```python
import micropip
await micropip.install(["numpy", "matplotlib"])
import numpy as np
import matplotlib.pyplot as plt

data = {
    'Chromium': [31, 1, 511, 2, 574, 496, 322, 424, 269, 140, 244, 252, 76, 108, 24, 38, 18, 43, 30, 191],
    'Nickel': [23, 22, 55, 39, 283, 34, 159, 37, 61, 34, 163, 140, 32, 23, 54, 837, 64, 354, 376, 471],
}

for name, x in data.items():
    q1, med, q3 = np.percentile(x, [25, 50, 75])
    print(f"{name}: mean {np.mean(x):.2f}, median {med}, s {np.std(x, ddof=1):.2f}, "
          f"Q1 {q1}, Q3 {q3}, min {np.min(x)}, max {np.max(x)}")

plt.figure(figsize=(6, 4))
plt.boxplot(list(data.values()), labels=list(data.keys()))
plt.title('Boxplot of Chromium and Nickel')
plt.show()
```
