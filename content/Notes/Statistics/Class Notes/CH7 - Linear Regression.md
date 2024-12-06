---
id: CH7 - Linear Regression
aliases: []
tags:
  - statistics
date: "2024-11-14"
---

Linear Regression and similar models introduce us to the ability to predict outcomes based on the input data. This is a powerful tool in the data scientist's toolbox.

We will explore the basics of linear regression, how to interpret the results, and how to evaluate the model's performance.

## Linear Regression

We use the linear regression model to predict a continuous variable based on one or more independent variables. The model is represented as:

$$
R = \beta_{0} + \beta_{1}X_{1} + \beta_{2}X_{2} + \ldots + \beta_{n}X_{n} + \epsilon
$$

In our case, we will be learning to use the Pearson correlation coefficient to determine the strength of the relationship between two variables.

## ANOVA Table of Variance

We are doing an **analysis of variance**

| Source             | SS  | df                             | Mean Square                   | F-Ratio             | P-Value  |
| ------------------ | --- | ------------------------------ | ----------------------------- | ------------------- | -------- |
| Regression (model) | SSR | k 1 # of independent variables | $MSR = \frac{SSR}{R}$         | $F=\frac{MSR}{MSE}$ | p-value  |
| Even               | SSE | $n-(k+1)$ $n-2$                | $MSE = \frac{SSE}{n - (k+1)}$ | $\times$            | $\times$ |
| Total              | SSY | $n - 1$                        | $\times$                      | $\times$            | $\times$ |

$H_{0}:$ The model does not have predictive power

$H_{1}:$ The model does have predictive power
