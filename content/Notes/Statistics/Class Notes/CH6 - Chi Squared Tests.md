---
id: CH6 - Chi Squared Tests
aliases: []
tags: []
---

There are two kinds of Chi Squared Tests we should be familiar with

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
- $\sum$ = Summation
- $O$ and $E$ are calculated for each cell in the contingency table.

### Calculating Expected Frequencies

The expected frequency for each cell in the contingency table is calculated as follows:

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

1. Enter the observed frequencies into a matrix.
2. Enter the expected frequencies into a matrix.
3. Use the $\chi^2$ Test function to calculate the test statistic and p-value.
4. Interpret the results to determine whether the observed data fits the expected distribution or whether the two variables are independent.

Let's implement this on a table.

| Color  | Frequency | Observed Counts |
| ------ | --------- | --------------- |
| Brown  | .125      | 339             |
| Blue   | .25       | 583             |
| Yellow | .125      | 359             |
| Orange | .25       | 493             |
| Green  | .125      | 515             |
| Red    | .125      | 391             |

First, we find the expected counts for each color.

| Color  | Frequency | Observed Counts | Expected Counts |
| ------ | --------- | --------------- | --------------- |
| Brown  | .125      | 339             | 339.5           |
| Blue   | .25       | 583             | 582.5           |
| Yellow | .125      | 359             | 359.5           |
| Orange | .25       | 493             | 492.5           |
| Green  | .125      | 515             | 514.5           |
| Red    | .125      | 391             | 390.5           |
| Total  | 1         | 2680            | 2680            |
