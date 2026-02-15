---
id: CH9 - Independence and Conditioning
created_on: "[[02-05-2025]]"
aliases: []
tags:
  - math/probability/statistics
date: 2025-02-05
title: CH9 - Independence and Conditioning
updated: 2025-06-21
---
Let's say that we have 2 discrete random variables $A$ $B$.

Therefore, we say that:

$$
A,B \ events
$$

and:

$$
P(A \cap B) = P(A) \cdot P(B)
$$

---

## Joint Probability Functions

A joint probability function is a function that gives the probability of 2 events happening at the same time.

$$
P_{X,Y}(x,y) = P(X=x \cap Y=y)
$$

This is a probability mass function.

---

## Joint Cumulative Distribution Function

A joint cumulative distribution function is a function that gives the probability of 2 events happening at the same time, but in a cumulative way.

$$
F_{X,Y}(x,y) = P(X \leq x \cap Y \leq y)
$$

---

## Conditional Probability Mass Function

A conditional probability mass function is a function that gives the probability of an event happening given that another event has happened.

$$
P_{X \mid Y}(x \mid y) = P(X=x \mid Y=y) = \frac{P(X=x \cap Y=y)}{P(Y=y)}
$$

And thus:

$$
= \frac{P_{X,Y}(x,y)}{P_Y(y)}
$$

---

## Example

>[!Example]
> **Random Employee Hiring**. Ten students apply for a job opening, but only 1 of the students will be selected. The employer chooses randomly; all ten outcomes are equally likely. If person 3,5,7, or 8 gets the job, let $X=1$; otherwise $X=0$. If person 1,2,3,4, or 5 gets the job, let $Y=1$; otherwise $Y=0$. Are $X$ and $Y$ independent random variables?

1. Find the mass of $X$ and the mass of $Y$

| $x$                       | $P_{x}(X)$     | $y$                     | $P_{y}(Y)$     |
| ------------------------- | -------------- | ----------------------- | -------------- |
| $\{ 1,2,4,6,8,10 \}\to 0$ | $\frac{6}{10}$ | $\{ 6,7,8,9,10 \}\to 0$ | $\frac{5}{10}$ |
| $\{ 3,5,7,9 \}\to 1$      | $\frac{4}{10}$ | $\{ 1,2,3,4,5 \}\to 1$  | $\frac{5}{10}$ |

1. Find the join of $X$ and $Y$

$$
P_{X,Y}(x,y) = P(X=x \cap Y=y)
$$

$$
P_{x,y}(0,0) = P(X=0 \cap Y=0)
$$

*for $X_{0}Y_{0}$*

$$
\begin{align*}
P(X=0)\cdot P(Y=0 \mid X=0) \\
\frac{6}{10} \cdot \frac{3}{6} = \frac{3}{10}
\end{align*}
$$

*for $X_{0}Y_{1}$*

$$
\begin{align*}
P_{x,y}(0,1) &= P(Y=0) \cdot P(Y=1 \mid X=0) \\
\frac{5}{10} \cdot \frac{3}{5} &= \frac{3}{10}
\end{align*}
$$

*for $X_{1}Y_{0}$*

$$
\begin{align*}
P_{x,y}(1,0) &= P(X=1) \cdot P(Y=0 \mid X=1) \\
\frac{4}{10} \cdot \frac{2}{4} &= \frac{2}{10}
\end{align*}
$$

*for $X_{1}Y_{1}$*

$$
\begin{align*}
P_{x,y}(1,1) &= P(X=1) \cdot P(Y=1 \mid X=1) \\
\frac{4}{10} \cdot \frac{2}{4} &= \frac{2}{10}
\end{align*}
$$

**Therefore**

|         | $Y_{0}$        | $Y_{1}$        |
| ------- | -------------- | -------------- |
| $X_{0}$ | $\frac{3}{10}$ | $\frac{3}{10}$ |
| $X_{1}$ | $\frac{2}{10}$ | $\frac{2}{10}$ |

1. Use $P_{xy}(x,y)=P_{x}(x) \cdot P_{y}(y)$ to determine independence

*Are $X,Y$ independent RV's?*

Let's check $P(x,y)(x,y)=P_{x}(x) \cdot P_{y}(y)$

$$
\begin{align*}
x=0,y=0: \frac{3}{10} &=^? \frac{6}{10} \cdot \frac{5}{10} \to YES\\
and \ so \ on \ \dots
\end{align*}
$$

---

## Given Joint Probability Mass Function...

Calculate mass of 1 variable

$$
P_{x}(x) = \sum P_{x,y} (x,y)
$$

|         | $Y_{0}$        | $Y_{1}$        |
| ------- | -------------- | -------------- |
| $X_{0}$ | $\frac{3}{10}$ | $\frac{3}{10}$ |
| $X_{1}$ | $\frac{2}{10}$ | $\frac{2}{10}$ |

$$
\begin{align*}
P_{x}(0) &= \sum_{all \ Y's} P_{x,y}(0,y) \\
&= P_{x,y}(0,0) + P_{x,y}(0,1) \\
&= \frac{3}{10} + \frac{3}{10} = \frac{6}{10}
\end{align*}
$$

$$
\begin{align*}
P_{x}(1) &= \sum_{all \ Y's} P_{x,y}(1,y) \\
&= \frac{2}{10} + \frac{2}{10} = \frac{4}{10}
\end{align*}
$$

*and so on for the Y variables...*

---

## Given Joint Mass, Caculate CDF...

$$
F_{x,y} = P(X \leq x \cap Y \leq y)
$$

**Joint**(given)

|         | $Y_{0}$        | $Y_{1}$        |
| ------- | -------------- | -------------- |
| $X_{0}$ | $\frac{3}{10}$ | $\frac{3}{10}$ |
| $X_{1}$ | $\frac{2}{10}$ | $\frac{2}{10}$ |

**CDF**

$$
\begin{align*}
F_{x,y}(0,0) &= P(X \leq 0 \cap Y \leq 0) \\
&= \frac{3}{10}
\end{align*}
$$

$$
\begin{align*}
F_{x,y}(0,1) &= P(X\leq 0 \cap Y \leq 1) \\
&= P((X=0 \cap Y=0) \cup (X=0 \cap Y=1)) \\
&= \frac{3}{10} + \frac{3}{10} = \frac{6}{10}
\end{align*}
$$

*and so on for F(1,0), F(1,1)*

|         | $Y_{0}$        | $Y_{1}$         |
| ------- | -------------- | --------------- |
| $X_{0}$ | $\frac{3}{10}$ | $\frac{6}{10}$  |
| $X_{1}$ | $\frac{5}{10}$ | $\frac{10}{10}$ |
