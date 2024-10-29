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

---

## Example Problems

### First Problem

> [!Example]
> Civil engineers collected data from one area of Wisconsin on the amount of salt(tons) used to keep highways drivable during a snowstorm. Historic use of salt in that area was 2000 tons per storm. The amount of salt for $n=45$ storms has $\bar{x}=1753.9$ tons and $s=819.35$ tons. Test the claim that the mean salt use per storm has decreased.

#### How Do We Test This Claim?

Lets start with labeling what we know.

$$Q_{1 = Populations \ or \ Means?}$$

> Means.

#### Notation

| 200       | 45  | 1753.9    | 819.35 |
| --------- | --- | --------- | ------ |
| $\mu_{0}$ | $n$ | $\bar{x}$ | $s$    |

#### Unit Hypotheses

**Null Hypothesis:**

The null hypothesis is that the mean salt use per storm has not decreased.

$$
H_{0}: \mu \geq 2000
$$

**Alternative Hypothesis:**

The alternative hypothesis is that the mean salt use per storm has decreased.

$$H_{1}: \mu < 2000$$

#### Model

The model is a normal distribution. Like the one we plotted above, we will use python to plot this.

We have $n=45$ and $s=819.35$.

We will label the area between $\mu_{0}$ and $\bar{x}$ as $\mathbb{R}$.

```python-r
import matplotlib.pyplot as plt
import numpy as np

mu = 2000  # Mean
sigma = 819.35 / np.sqrt(45)  # Standard deviation
x = np.linspace(mu - 4*sigma, mu + 4*sigma, 1000)
y = (1 / (sigma * np.sqrt(2 * np.pi))) * np.exp(-0.5 * ((x - mu) / sigma) ** 2)

plt.figure(figsize=(10, 6))
plt.plot(x, y, label=r"$\hat{p}$")
plt.title(r"Sampling Distribution of $\hat{p}$'s")

plt.axvline(mu, color='black', linestyle='--', label=r"$P_0$")
plt.axvline(1753.9, color='red', linestyle='--', label=r"$\bar{x}$")

plt.text(mu, max(y) * 0.8, "not a big difference", ha='center', color='blue')
plt.text(1753.9, max(y) * 0.8, "not a big difference", ha='center', color='blue')

plt.text(mu - 3*sigma, max(y) * 0.3, "big difference", ha='center', color='red')
plt.text(mu + 3*sigma, max(y) * 0.3, "big difference", ha='center', color='red')

plt.text(mu - 4*sigma, 0, r"$\mathbb{R}$", ha='center', va='bottom', color='purple', fontsize=12)
plt.text(mu + 4*sigma, 0, r"$\mathbb{R}$", ha='center', va='bottom', color='purple', fontsize=12)

# display
plt.legend()
plt.xlabel("Values of $\hat{p}$")
plt.ylabel("Probability Density")
plt.grid(True)
- [ ] plt.show()
```

**Calculations:**

$$
Test \ Statistic = t =
$$
