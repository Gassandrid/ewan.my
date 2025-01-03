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
plt.show()
```

#### Calculations:

$$
Test \ Statistic = t = \frac{\bar{x} - \mu_{0}}{s/\sqrt{n}}
$$

$$
t = \frac{1753.9 - 2000}{819.35/\sqrt{45}} = -1.75
$$

#### Conclusions:

$H_{0}: \mu \geq 2000 \leftarrow$ assumes the mean salt use per storm has not decreased.

$H_{1}: \mu < 2000 \leftarrow$ assumes the mean salt use per storm has decreased.

> [!Note] Understanding the Distrubtion
> As the distribution gets further away from the null hypothesis, the probability of the null hypothesis being true decreases, as the amount of evidence increases.
>
> Let's label another graph

```python-r
import matplotlib.pyplot as plt
import numpy as np

mu = 0  # Mean at the center
sigma = 1  # Standard deviation

# x values and y values for the normal curve
x = np.linspace(mu - 4 * sigma, mu + 4 * sigma, 1000)
y = (1 / (sigma * np.sqrt(2 * np.pi))) * np.exp(-0.5 * ((x - mu) / sigma) ** 2)

# Plot the distribution curve
plt.figure(figsize=(10, 6))
plt.plot(x, y, label="Normal Distribution", color='black')
plt.title("Normal Distribution with Increasing Evidence to the Left")

# Shaded regions for increasing evidence to the left of the center
# Defining regions with decreasing widths as you move left
evidence_regions = [(-2, -1.5), (-2.5, -2), (-3, -2.5), (-3.5, -3)]
colors = ['lightblue', 'skyblue', 'deepskyblue', 'dodgerblue']

# Loop through the regions and plot shaded areas with decreasing widths
for i, (start, end) in enumerate(evidence_regions):
    plt.fill_between(x, y, where=(x >= start) & (x <= end), color=colors[i], alpha=0.7,
                     label=f"Evidence Level {i+1}")

# Center line and label for increasing evidence
plt.axvline(mu, color='black', linestyle='--', label="Center (Mean)")
plt.text(-3.7, max(y) * 0.6, "Increasing Evidence", rotation=90, color='dodgerblue', fontsize=12)

# Adding legend and labels
plt.legend(loc="upper right")
plt.xlabel("Values")
plt.ylabel("Probability Density")
plt.grid(True)

# Show the plot
plt.show()
```

#### More Definitions

- $T-Value$: The test statistic
- $P-Value$: The probability of observing a test statistic as extreme as the one computed, given that the null hypothesis is true.
- $Type \ I \ Error$: Rejecting the null hypothesis when it is true.
- $Type \ II \ Error$: Failing to reject the null hypothesis when it is false.

#### Finding Values on a TI-84 Plus CE

$$
p-value = P(T \leq -2.015) = tcdf(-1E99, -2.015, 44) = .025 \approx \frac{1}{40}
$$

---

## Hypothesis Test Decision-making

Hypothesis Testing decisions **need to be contextual**

> [!Example] Example
> **David** - Environmental Lobbyist
>
> - "any victory, no matter how small, is a victory for the environment"
>   David works for the nonprofit organization, "Save the Earth".
>
> **Alex** - Fiscally Minded, DPW Budget Analyst
>
> - "We can't afford to waste money on unnecessary environmental programs"
>   Alex works for the Department of Public Works on the budgeting team.

We have a **moderate** amount of evidence to support that the mean salt use per storm has decreased.

Let's talk about the **STATISTICAL SIGNIFICANCE** of the test.

Using a $\alpha$-level of significance of 0.05, we can say that the p-value is less than $\alpha$.

**People will make decisions based on the context of the situation, and since the evidence is only moderate, the decision will be based on the context of the situation.**

**David** might say that the evidence is enough to support the claim that the mean salt use per storm has decreased.

**Alex** might say that the evidence is not enough to support the claim that the mean salt use per storm has decreased.

### Using the P-Value

We generally say that if:

$$
P-value \leq \alpha \rightarrow Reject \ H_{0}
$$

$$
P-value > \alpha \rightarrow Fail \ to \ Reject \ H_{0}, test\ is\ inconclusive
$$

---

## Conclusion

Hypothesis testing provides a systematic method to evaluate claims about a population parameter using sample data. The process involves:

1. Formulating null and alternative hypotheses.
2. Calculating a test statistic based on the sample.
3. Comparing the p-value to a significance level to make a decision.
