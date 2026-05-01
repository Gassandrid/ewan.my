---
class:
  - note
  - lectureNote
tags:
  - university
  - psych
  - math/probability/statistics
course: "[[Intro to Psychological Science]]"
lesson:
  - lecture
lecture-number: 4
source:
related:
author:
date: 2025-09-04
updated: 2025-09-04
---
_underlining the difference between correlation vs causaation, etc_

---

## Scatter Plots Visually Show Us a Correlation

A _scatter plot_ is a type of graph in which data from correlational studies can be presented to visualize the relationship between two variables. The x-axis represents values for one variable, and the y-axis represents values for the other variable.

Each individual in the study is represented by a dot placed between the axes according to their values for the two variables. For example, if we were looking at the relationship between hours studied and exam scores, a student who studied for 5 hours and scored 80% on the exam would be represented by a dot at the coordinates (5, 80).

```python-r
import matplotlib.pyplot as plt

# Example data: hours studied vs. exam scores

hours_studied = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
exam_scores = [55, 60, 63, 68, 72, 78, 82, 85, 88, 92]

plt.figure(figsize=(6, 4))
plt.scatter(hours_studied, exam_scores, color="teal", alpha=0.8, edgecolors="white", linewidths=0.5)

plt.title("Hours Studied vs. Exam Score")
plt.xlabel("Hours Studied")
plt.ylabel("Exam Score (%)")
plt.grid(True, linestyle="--", alpha=0.3)

plt.tight_layout()
plt.show()
```

How does the classification of scatterplot dot distribution (weak, moderate, strong) influence the accuracy of predictions in correlation analysis across different contexts such as academic performance and behavioral assessments?

---

## Strength of Correlations

Positive and negative correlations allow predictions of a person's score on one variable based on their score on the other variable.

- the stronger a correlation is, the more accurate predictions can be (ranges from $-1$ to $+1$)
- the strength of the relationship between variables is indicated by spread of the dots on the scatterplot and can be classified as **weak, moderate, or strong**

How does the classification of scatterplot dot distribution (weak, moderate, strong) influence the accuracy of predictions in correlation analysis across different contexts such as academic performance and behavioral assessments?

Weak correlations have a lot of scatter, and strong correlations have little scatter.

```python-r
# 3 simple scatter plots showing weak, moderate, and strong correlations
import numpy as np
import matplotlib.pyplot as plt

# Set a random seed for reproducibility
rng = np.random.default_rng(42)
n = 100

# Generate a common X variable
x = rng.uniform(0, 10, n)

# Helper to generate Y with controllable noise (affects correlation strength)
def make_y(x_vals, slope, noise_std, rng):
    noise = rng.normal(0, noise_std, size=x_vals.shape)
    return slope * x_vals + noise

# Create datasets with weak, moderate, and strong correlations
y_weak = make_y(x, slope=1.0, noise_std=5.0, rng=rng)
y_moderate = make_y(x, slope=1.0, noise_std=2.0, rng=rng)
y_strong = make_y(x, slope=1.0, noise_std=0.5, rng=rng)

# Compute Pearson r for annotation
def r_value(a, b):
    return float(np.corrcoef(a, b)[0, 1])

r_w = r_value(x, y_weak)
r_m = r_value(x, y_moderate)
r_s = r_value(x, y_strong)

# Plot
fig, axes = plt.subplots(1, 3, figsize=(12, 4), sharex=True, sharey=True)
scatter_kwargs = dict(color="teal", alpha=0.8, edgecolors="white", linewidths=0.5)

axes[0].scatter(x, y_weak, **scatter_kwargs)
axes[0].set_title(f"Weak (r={r_w:.2f})")
axes[0].set_ylabel("Y")
axes[0].grid(True, linestyle="--", alpha=0.3)

axes[1].scatter(x, y_moderate, **scatter_kwargs)
axes[1].set_title(f"Moderate (r={r_m:.2f})")
axes[1].grid(True, linestyle="--", alpha=0.3)

axes[2].scatter(x, y_strong, **scatter_kwargs)
axes[2].set_title(f"Strong (r={r_s:.2f})")
axes[2].grid(True, linestyle="--", alpha=0.3)

for ax in axes:
    ax.set_xlabel("X")

fig.suptitle("Scatterplots Showing Correlation Strengths", y=1.02)
plt.tight_layout()
plt.show()
```

### To Conclude Causation

We **cannot** deduce causation PURELY from the correlation, in order for that to happen, **3** things must be met:

1. two variables must be correlated
2. one variable must precede the other
3. no other variable can be causing the correlation

### We CANNOT Rule out Alternative Explanations in Correlational Studies

**Third-variable problem(or confounds):** a limitation of correlational studies which occurs when the observed correlation between two variables is explained by the influence of some third, unmeasured variable.

> [!Example]
> Say that there is an observed correlation between people **becoming psych majors** and people who **take pysch 1**. Does this mean that taking psych 1 causes people to become psych majors?

> [!Success]- Solution
> No! There could be a third variable, such as **interest in human behavior** that causes both of these things to happen.

This is why we cannot conclude causation from correlation alone. Third variables can always be at play.

---

## Research Designs

_For this to work, we need to use the right research design._

**Experimental research:** research conducted in way that supports causal statements by manipulating a variable hypothesized to be causal and assessing its effects on a measured variable.

### Experiments Reduce This Problem

**Random Assignment:** a procedure used in experimental research in which a random method is used to decide which participants will receive each level of the independent variable

- random assignment is an essential element of an experiment because it allows researchers to assume the people in the groups are similar, on average, at the beginning of the experiments
- this serves to isolate the manipulated variable

**Experimental Group:** a group or condition in which the hypothesized cause (i.e. the independent variable) is present. Also known as the "treatment group".

**Control Group:** a group or condition in which the hypothesized cause (i.e. the independent variable) is not present

- **Placebo condition:** a group or condition in which people expect to receive a treatment but are exposed to only an inert version, such as a _sugar pill_

#### Double Blind Procedures

This is where neither the participants nor the researchers know who is in which group until after the data is collected. This helps to eliminate bias.

---

*from this point forward in the lecture, just refer to [[CH1 - Sampling and Descriptive Statistics]] basics from [[Statistics Index|Statistics for Engineering]]*

---

## Research Ethics

Psychological researchers are expected to treat those they study with respect and fairness and to minimize harm inflicted.

**Autonomy**: each research participant has the right ot decide about participating without intimidation or coercion
- **Informed Consent:** an essential application of the ethical principle of autonomy in which a research participant is educated on the procedures, risks, and potential benefits of taking part in study before choosing to do so.
- special care must be taken to maintain autonomy in vulnerable populations


