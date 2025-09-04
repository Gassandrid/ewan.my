---
class:
  - note
  - lectureNote
tags:
  - university
course: "[[Intro to Psychological Science]]"
lesson:
  - lecture/homework/video/presentation/etc
lecture-number: 4
source:
related:
author:
date: 2025-09-04
updated: 2025-09-04
---

_underlining the difference between correlation vs causaation, etc_

---

## Scatter plots Visually Show Us a Correlation

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

---

## Strength of Correlations

Positive and negative correlations allow predictions of a person's score on one variable based on their score on the other variable.

- the stronger a correlation is, the more accurate predictions can be (ranges from $-1$ to $+1$)
- the strength of the relationship between variables is indicated by spread of the dots on the scatterplot and can be classified as **weak, moderate, or strong**
