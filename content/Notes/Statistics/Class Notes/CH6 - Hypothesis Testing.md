---
id: CH6 - Hypothesis Testing
aliases: []
tags:
  - statistics
date: "2024-10-29"
---

Hypothesis Testing is about **testing a claim** about a population parameter using sample data. The claim is called the **null hypothesis**, denoted by $H_0$. The alternative hypothesis is denoted by $H_1$.

Confidence Intervals and hypothesis tests will yield the same analysis by tying $c$ to the $\alpha$-level significance.

---

Hypothesis Testing takes a **sample statistic** and uses it to make a decision about a **population parameter**. The test is based on a **probability**.

### Definitions

- $H_0$: Null Hypothesis
- $H_1$: Alternative Hypothesis
- $\hat{p}$: Sample Statistic
- $p$: Population Parameter
- $P_{0}$, $\mu_{0}$: Null Hypothesis value
  - Also known as p-naught

We see if the sample statistic is different from the given value or not.

$$
(\hat{p}- p_{0}) \ OR \ (\bar{x} - \mu_{0})
$$

**How different are they?**

> [!Note] Answer
> **Not a very big difference**
> good kind of variability, natural sampling variability
> "could happen by chance alone"

> [!Note] Answer
> **A very big difference**
> the sample statistic is NOT behaving consistently with the null hypothesis and hypthesized mean.

Let's create a normal distruibtution graph to describe this.

### MatPlotLib Graph

```python-r
import matplotlib.pyplot as plt
import numpy as np

mu = 0.5  # Mean
sigma = 0.1  # Standard deviation
x = np.linspace(mu - 4*sigma, mu + 4*sigma, 1000)
y = (1 / (sigma * np.sqrt(2 * np.pi))) * np.exp(-0.5 * ((x - mu) / sigma) ** 2)

plt.figure(figsize=(10, 6))
plt.plot(x, y, label=r"$\hat{p}$")
plt.title(r"Sampling Distribution of $\hat{p}$'s")

plt.axvline(mu, color='black', linestyle='--', label=r"$P_0$")

plt.text(mu, max(y) * 0.8, "not a big difference", ha='center', color='blue')

plt.text(mu - 3*sigma, max(y) * 0.3, "big difference", ha='center', color='red')
plt.text(mu + 3*sigma, max(y) * 0.3, "big difference", ha='center', color='red')

plt.text(mu - 4*sigma, 0, r"$\mathbb{R}$", ha='center', va='bottom', color='purple', fontsize=12)
plt.text(mu + 4*sigma, 0, r"$\mathbb{R}$", ha='center', va='bottom', color='purple', fontsize=12)

# display
plt.legend()
plt.xlabel("Values of $\hat{p}$")
plt.ylabel("Probability Density")
plt.grid(True)
plt.show()
```

Use Standard Deviation to measure distance on a population model.
