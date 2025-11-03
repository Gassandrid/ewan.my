---
date: 2025-10-29
updated: 2025-10-29
class:
  - note
tags:
  - math/statistics/bayesian
  - math/calculus/differential
  - todo/math/statistics
  - todo/math/differential
source:
  - "[[Visually Explained Kalman Filters]]"
  - https://en.wikipedia.org/wiki/Kalman_filter
related:
author:
---

A **Kalman Filter** is a tool for incorporating noisy measurements over time to estimate the true state of a dynamic system. It is widely used in control systems, robotics, and signal processing.

---

## An Underlying Dynamical System Model

A great way to understand the Kalman Filter is to think of it as a hidden Markov model where the hidden states evolve over time according to a linear dynamical system, and the observations are noisy measurements of these states.

![[exampleKalmanFilter.png]]

*Model underlying the Kalman filter. Squares represent matrices. Ellipses represent [multivariate normal distributions](https://en.wikipedia.org/wiki/Multivariate_normal_distribution "Multivariate normal distribution") (with the mean and covariance matrix enclosed). Unenclosed values are [vectors](https://en.wikipedia.org/wiki/Vector_space "Vector space"). For the simple case, the various matrices are constant with time, and thus the subscripts are not used, but Kalman filtering allows any of them to change each time step.*

**Where**:

- $\mathbf{F}_{k}$ is the _state transition model_
- $\mathbf{K}_{k}$ is the _observation model_
- $\mathbf{Q}_{k}$ is the [[Covariance]] of the process noise
- $\mathbf{R}_{k}$ is the [[Covariance]] of the observation noise
