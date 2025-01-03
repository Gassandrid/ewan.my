---
id: CH6 - Chi Squared Tests
aliases: []
tags: []
---

There are two kinds of Chi Squared Tests we should be familiar with:

---

## Goodness of Fit Test (GOF)

Goodness of Fit Test is used to determine whether the distribution of a sample is consistent with a hypothesized distribution.

Think of it as a comparison between the observed distribution and the expected distribution.

We use a GOF Test when we have a single categorical variable, and we want to compare the distribution of the observed data to an expected distribution.

---

## Test of Independence

Test of Independence is used to determine whether there is a significant association between two categorical variables.

Think of it as a comparison between the observed frequencies and the expected frequencies.

We use a Test of Independence when we have two categorical variables, and we want to determine whether they are independent of each other.

---

## Math Behind the Tests

Both the GOF Test and the Test of Independence use the Chi Squared Test statistic, which is calculated as follows:

$$
\chi^2 = \sum \frac{(O - E)^2}{E}
$$

Where:

- $\chi^2$ = Chi Squared Test Statistic
- $O$ = Observed Frequency
- $E$ = Expected Frequency
- $\sum$ = Summation over all categories or cells

### Calculating Expected Frequencies

#### For Goodness of Fit:

The expected frequency for each category is calculated as:

$$
E = (\text{Proportion of Expected Frequency}) \times (\text{Grand Total})
$$

#### For Test of Independence:

The expected frequency for each cell in the contingency table is calculated as:

$$
E = \frac{(\text{Row Total} \times \text{Column Total})}{\text{Grand Total}}
$$

Where:

- $E$ = Expected Frequency
- $\text{Row Total}$ = Total count for the row
- $\text{Column Total}$ = Total count for the column
- $\text{Grand Total}$ = Total count of all observations

---

## Performing $\chi^2$ Test on a TI-84 Calculator

To perform these tests on a TI-84 calculator, follow these steps:

1. Enter the observed frequencies into a matrix (e.g., `[A]`).
2. Enter the expected frequencies into a matrix (e.g., `[B]`).
3. Use the $\chi^2$ Test function to calculate the test statistic and p-value:
   - Press `STAT` > `TESTS` > `χ²-Test`.
   - Assign the observed and expected matrices.
4. Interpret the results:
   - Compare the p-value to the significance level ($\alpha$) to make a decision.
   - A low p-value (typically $< \alpha = 0.05$) indicates that the observed and expected distributions differ significantly.

---

## Example: Goodness of Fit Test

Let's perform a Goodness of Fit test on the following data:

| Color  | Frequency | Observed Counts | Expected Counts |
| ------ | --------- | --------------- | --------------- |
| Brown  | .125      | 339             | 335.0           |
| Blue   | .25       | 583             | 670.0           |
| Yellow | .125      | 359             | 335.0           |
| Orange | .25       | 493             | 670.0           |
| Green  | .125      | 515             | 335.0           |
| Red    | .125      | 391             | 335.0           |
| Total  | 1         | 2680            | 2680.0          |

### Step 1: Calculate $\chi^2$

Using the formula:

$$
\chi^2 = \sum \frac{(O - E)^2}{E}
$$

We calculate for each color:

1. Brown: $\frac{(339 - 335)^2}{335} = 0.048$
2. Blue: $\frac{(583 - 670)^2}{670} = 10.716$
3. Yellow: $\frac{(359 - 335)^2}{335} = 1.792$
4. Orange: $\frac{(493 - 670)^2}{670} = 48.668$
5. Green: $\frac{(515 - 335)^2}{335} = 94.373$
6. Red: $\frac{(391 - 335)^2}{335} = 8.008$

Summing these gives:

$$
\chi^2 = 0.048 + 10.716 + 1.792 + 48.668 + 94.373 + 8.008 = 163.605
$$

### Step 2: Interpret Results

Compare $\chi^2$ to the critical value from the Chi Squared table (or use the p-value from your calculator).

If $\chi^2$ is greater than the critical value, or if the p-value is less than $\alpha$, reject the null hypothesis that the distributions are the same.
