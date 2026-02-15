---
id: Characteristic function
created_on: "[[09-22-2025]]"
aliases: []
tags:
  - math/probability/statistics
class:
  - note
date: 2025-09-22
updated: 2025-09-22
---
In Layman's terms, the characteristic function is just the Fourier transform of a probability distribution. It provides a way to uniquely describe the distribution of a random variable.

![[Pasted image 20250922132141.png]]

---

## What Does it Actually Do?

The characteristic function of a random variable \(X\) is defined as:

$$
\varphi_{X}(t) = E[e^{itX}] = \int_{\mathbb{R}} e^{itx} dF_{X}(x)
$$

and it has several important properties, namely:

- it uniquely determines the probability distribution of \(X\).
- it can be used to find moments of the distribution (if they exist) by differentiating the characteristic function.
- it is always defined for all real numbers \(t\), even when the moments of the distribution do not exist.

We generally use characteristic functions to analyze the distribution of sums of independent random variables, as the characteristic function of a sum is the product of the individual characteristic functions.

---

## Some Common Characteristic Functions

| Distribution                                                                               | Characteristic function φ(t)                                                                                              |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Degenerate $\delta_a$                                                                      | $e^{ita}$                                                                                                                 |
| Bernoulli Bern($p$)                                                                        | $1 - p + pe^{it}$                                                                                                         |
| Binomial B($n, p$)                                                                         | $(1 - p + pe^{it})^n$                                                                                                     |
| Negative binomial NB($r, p$)                                                               | $\left(\frac{p}{1 - e^{it} + pe^{it}}\right)^r$                                                                           |
| Poisson Pois($\lambda$)                                                                    | $e^{\lambda(e^{it} - 1)}$                                                                                                 |
| Uniform (continuous) U($a, b$)                                                             | $\frac{e^{itb} - e^{ita}}{it(b-a)}$                                                                                       |
| Uniform (discrete) DU($a, b$)                                                              | $\frac{e^{ita} - e^{it(b+1)}}{(1 - e^{it})(b-a+1)}$                                                                       |
| Laplace L($\mu, b$)                                                                        | $\frac{e^{it\mu}}{1 + b^2t^2}$                                                                                            |
| Logistic Logistic($\mu,s$)                                                                 | $e^{it\mu}\frac{\pi st}{\sinh(\pi st)}$                                                                                   |
| Normal N($\mu, \sigma^2$)                                                                  | $e^{it\mu - \frac{1}{2}\sigma^2t^2}$                                                                                      |
| Chi-squared $\chi_k^2$                                                                     | $(1 - 2it)^{-k/2}$                                                                                                        |
| Noncentral chi-squared $\chi_k^{'2}$                                                       | $e^{\frac{i\lambda t}{1 - 2it}}(1-2it)^{-k/2}$                                                                            |
| Generalized chi-squared $\tilde{\chi}(\mathbf{w}, \mathbf{k}, \boldsymbol{\lambda}, s, m)$ | $\exp\left[it\left(m + \sum_j \frac{w_j\lambda_j}{1-2iw_jt}\right) - \frac{s^2t^2}{2}\right] \prod_j (1-2iw_jt)^{-k_j/2}$ |
| Cauchy C($\mu, \theta$)                                                                    | $e^{it\mu - \theta t }$                                                                                                   |
| Gamma $\Gamma(k, \theta)$                                                                  | $(1 - it\theta)^{-k}$                                                                                                     |
| Exponential Exp($\lambda$)                                                                 | $(1 - it\lambda^{-1})^{-1}$                                                                                               |
| Geometric Gf($p$) (number of failures)                                                     | $\frac{p}{1 - e^{it}(1-p)}$                                                                                               |
| Geometric Gt($p$) (number of trials)                                                       | $\frac{p}{e^{-it} - (1-p)}$                                                                                               |
| Multivariate normal N($\boldsymbol{\mu}, \boldsymbol{\Sigma}$)                             | $e^{i\mathbf{t}^\top\boldsymbol{\mu} - \frac{1}{2}\mathbf{t}^\top\boldsymbol{\Sigma}\mathbf{t}}$                          |
| Multivariate Cauchy MultiCauchy($\boldsymbol{\mu}, \boldsymbol{\Sigma}$)                   | $e^{i\mathbf{t}^\top\boldsymbol{\mu} - \sqrt{\mathbf{t}^\top\boldsymbol{\Sigma}\mathbf{t}}}$                              |
