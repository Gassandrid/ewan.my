---
created_on: "[[01-13-2026]]"
class:
  - note
  - lecture
tags:
  - university
  - math/chaos/fixed-point
source:
related:
author:
description:
aliases:
date: 2026-01-13T10:28:17-05:00
updated: 2026-01-21T12:07:43-05:00
course: "[[Chaos, Fractals, and Dynamical Systems]]"
lesson:
  - lecture
lecture-number: 1
---
How do we go about predicting a linear system? Lets look at the example of a **billiards game**

![[billardspath.png]]

This is a good example of a linear chaotic system, as difference accumulates over time given any set amount of divergences from you estimation. In essence, a small difference in what you do vs what actually happens will lead to a large difference in the end result.

For the pool game, this linear system can be expressed mathematically as:

$$
x_{n+1} = Ax_n
$$

Where $A$ is a transformation matrix that describes how the balls move on the table. When the edge of the table is hit, the balls bounce off in a predictable manner, which can be described by the matrix $A$.

> [!Abstract] Edward Lorenz (1917 - 2008)
>
> ![[edwardlorenz.png|100]]
>
> **Chaos**: When the present determines the future, but the approximate present does not approximately determine the future:

---

## Forecasting

Forecasting in linear systems can be done by iteratively applying the transformation matrix $A$ to the initial state $x_0$. However, due to the chaotic nature of the system, small errors in the initial conditions can lead to large deviations in the forecasted state over time.

For a game like **plinko**, if we drop a ball from the top, we can predict its path by applying the transformation matrix at each level of the plinko board. However this gets so complicated that it is often easier to operate over the statistical distribution of outcomes rather than trying to predict the exact path of the ball.

![[plinko.png]]

### Solutions

(Data Assimilation vs Ensemble Forecasting)

We have two main approaches to dealing with the uncertainty in linear chaotic systems:

### Data Assimilation

**Data Assimilation** involves continuously updating our forecast based on new observations. As we receive new data about the state of the system, we can adjust our predictions to better align with the observed reality. This method helps to correct for errors that accumulate over time due to the chaotic nature of the system.

It reminds me of the [[Kalman Filter]] approach used in control systems and robotics, where predictions are updated based on sensor measurements to improve accuracy.

![[dataAssim.png]]

### Ensemble Forecasting

This involves running multiple simulations of the system with slightly varied initial conditions. By analyzing the spread of outcomes from these simulations, we can gain insights into the range of possible future states of the system. This method helps to capture the inherent uncertainty in chaotic systems.

![[ensembleForecasting.png]]

---

## Mathematical Formulation

Define $f^k(x)$ to be the result of applying the function $f$ to the initial state $x$ a total of $k$ times.

Given an initial condition (IC) $x$, we would like to characterize the system for large $k$. Think of the $\lim_{ k \to \infty }$.

> [!Example] The Logistic Growth Function
> Oftentimes takes the form:
>
> $$
> g_{a}(x) = ax(1-x)
> $$
>
> A is a parameter, so letting $a=2$, given an initial condition $x$, what is its long term outcome? Let $x_{0}=0.01 \ or \ \frac{1}{100}$. Its long term shape looks like the desmos graph below.

This is just the function for the porabola itself, but the interesting part is when we start iterating the function, meaning we take the output of the function and plug it back into itself repeatedly. This becomes:

$$
x_{n+1} = g_{2}(x_{n}) = 2x_{n}(1-x_{n})
$$

> [!Info] Desmos
>
> <iframe src="https://www.desmos.com/calculator/1vsj8uf3a4" width=600 height="400" ></iframe>

We can also solve this analytically, for example after we have assumed $x_{0}$ we can find $x_{1}$ by:

$$
x_{1} = 2\left( \frac{1}{100} \right) \left( 1-\frac{1}{100} \right) = \frac{2}{100} \cdot \frac{99}{100} = \frac{198}{10,000}
$$

This would take quite a while though, so oftentimes we use computers to solve this. This is called **iterating the map**.

### The Interesting Thing

You might notice for the graph above, the maximum extrema seems to lie on the coordinates $\left(  \frac{1}{2}, \frac{1}{2} \right)$. The **fundamental idea** behind a [[Logistic Map]] is that the maximum extrema is a fixed point, meaning that if we start at that point, we will always end up there. In other words:

$$
g_{2} \left( \frac{1}{2} \right) = \frac{1}{2}
$$

By taking discrete approximation steps, we notice this "staircase" pattern emerging, where we can see how the function iterates towards the fixed point. You will also notice that if we plot the line $y=x$, the points where the function intersects this line are the fixed points of the system.

![[logmap.png]]
