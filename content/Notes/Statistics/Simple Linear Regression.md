---
id: Simple Linear Regression
class:
  - note
tags:
  - math/probability/statistics
  - university
source:
  - "[[Statistics Index]]"
related:
  - "[[Linear and Nonlinear Regression]]"
  - "[[Hypothesis Testing]]"
  - "[[Confidence Intervals]]"
author:
description: Fitting a straight line between one predictor and a response by least squares and testing whether the slope is real.
aliases:
  - SLR
  - Simple Regression
  - Regression ANOVA
date: 2024-11-14
updated: 2026-11-19T21:50:00-05:00
---
- **simple linear regression**: model a response $Y$ as a straight line in one predictor $X$, the simplest case of [[Linear and Nonlinear Regression|linear regression]]

$$
Y = \beta_0 + \beta_1 X + \epsilon
$$

	- $\beta_0$ intercept: predicted $Y$ at $X = 0$
	- $\beta_1$ slope: expected change in $Y$ per one unit of $X$
		- example: predicting material strength from temperature, $\beta_1 = 2$ means each extra 1°C adds 2 units of strength on average
	- $\epsilon$ error: noise and everything the line leaves out
	- with $k$ predictors it's multiple regression, $Y = \beta_0 + \beta_1 X_1 + \dots + \beta_k X_k + \epsilon$, each slope read with the others held fixed
- fit by [[Least Squares|least squares]]: choose the line minimizing $\sum (y_i - \hat{y}_i)^2$

$$
\hat{\beta}_1 = \frac{\sum (x_i - \bar{x})(y_i - \bar{y})}{\sum (x_i - \bar{x})^2}, \qquad \hat{\beta}_0 = \bar{y} - \hat{\beta}_1 \bar{x}
$$

- [[ANOVA]] table: split the variation $SST = SSR + SSE$ and test the model as a whole

| source     | SS  | df          | MS                          | F                     |
| ---------- | --- | ----------- | --------------------------- | --------------------- |
| regression | SSR | $k$         | $MSR = \frac{SSR}{k}$       | $F = \frac{MSR}{MSE}$ |
| residual   | SSE | $n - (k+1)$ | $MSE = \frac{SSE}{n-(k+1)}$ |                       |
| total      | SST | $n - 1$     |                             |                       |

	- $H_0$: every slope is 0, $X$ says nothing about $Y$ ( [[Null Hypothesis]] ); $H_1$: at least one slope isn't ( [[Hypothesis Testing]] )
	- with one predictor ( $k = 1$ ) the $F$ test is the $t$ test on $\hat{\beta}_1$, $F = t^2$
- checking the fit
	- $R^2 = SSR/SST = 1 - SSE/SST$: share of the variation in $Y$ the line explains, near 1 is a tight fit
	- adjusted $R^2$ penalizes extra predictors, only matters in multiple regression
	- each coefficient gets its own p-value, below 0.05 is the usual "significant"
- assumptions: linear relationship, independent observations, plus constant variance and roughly normal errors for the tests to hold
