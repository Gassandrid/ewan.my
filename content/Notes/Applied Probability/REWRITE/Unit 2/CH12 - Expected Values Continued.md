---
id: CH12 - Expected Values Continued
created_on: "[[02-12-2025]]"
aliases: []
tags:
  - math/probability/statistics
date: 2025-02-12
title: CH12 - Expected Values Continued
updated: 2025-06-21
---
This lesson will continue the discussion of expected values, focusing on the expected value of sums and constants.

---

## Theorem To Remember

> [!Abstract] Theorem
> If $x_{1},x_{2},\dots,x_{n}$ are **identically distributed** discrete random variables, then:
>
> $$
> E(X_{1}+X_{2}+\dots+X_{n})=nE(X_{1})
> $$
>
> and
>
> $$
> E(a_{1}X_{1}+a_{2}X_{2} + \dots a_{n}X_{n}) = a_{1}E(X_{1}) +a_{2}E(X_{2}) + \dots + a_{n}E(X_{n})
> $$
>
> $$
> E(aX + b) = aE(X)+b
> $$

---

## Examples

> [!Example]
> 
> Four students order noodles at a certain local restaurant. Their orders are placed independently. Each student is kmown to prefer Japanese pan noodles $40\%$ of the time. How many of them do we expect to order Japanese Pan Noodles?
>
> Use X as an indicator variable and the [[CH12 - Expected Values Continued#Theorem To Remember|theorem we learned]] to solve this problem

For each student:

| $X_{i}$ | $P_{X_{i}}(X_{i})$, where $i = \{ 1,2,3,4 \}$ |
| ------- | --------------------------------------------- |
| 0       | .6                                            |
| 1       | .4                                            |

n=4 students, all are iid

Let $A_{j}$ be the event that the $j_{th}$ student orders **JPN**

Let $X_{j}$ be the indicator:

$$
\to E(X_{j})= P(A_{j})=.4
$$

**By the [[CH12 - Expected Values Continued#Theorem To Remember|theorem]]**

$$
\begin{align*}
E(X) &= E(X_{1}+X_{2}+X_{3}+X_{4}) \\
&= 4 E(X_{j}) \\
&= 4P(A_{j}) \\
&= 4(.4) \\
&= 4(.4) \\
&= 1.6
\end{align*}
$$

---

Let's revisit an older problem we love:

## Example: Drawing Cards without Replacement until We Get Ace of Hearts

We used a method in [[CH10 - Expected Values of Discrete Random Variables|chapter 10]] to find this by finding the sum of all the random variables. Let's try some other methods.

### Method 1

Let $A_{j}$ be the event that at least $j$ draws are required  to get the ace of hearts.

$$
\begin{bmatrix}
A_{5} \ means \ you \ still \ draw \ 5 \ or \ more \ cards \ to \ get \ Ace \ of \ Hearts \\
\to do \ not \ get \ ace \ of \ hearts \ on \ first \ 5 \ cards
\end{bmatrix}
$$

then:

$$
P(A_{j}) = 1 - P(A_{j}^c) = 1 - \frac{(j-1)}{52}
$$

*each draw is $\frac{1}{52}$ and there are $(j-1)$ of them.*

Let $X_{j}$ be the indicator of $A_{j}$ $X_{j} \in \{ 0,1 \} \leftarrow$  if $A_{j}$ occurs

Therefore:

$$
E(X_{j}) = P(A_{j}) = 1 - \frac{(j-1)}{52}
$$

*for each $j = \{ 1,2,3,\dots,52 \}$*

We have $X = X_{1} + \dots + X_{52}$:

$$
\begin{align*}
E(X) &= (X_{1} + \dots + X_{52}) \\
&= E(X_{1}) + \dots + E(X_{52}) \\
&= \sum_{j=1}^{52} \left( 1-\frac{j-1}{52} \right) \\
&= 52 - \frac{1}{52} \sum_{j=1}^{52} (j-1) \\
&= 52 - \frac{1}{52}\left( \frac{51(52)}{2} \right) \\
&= 51 - \frac{51}{2} \\
&= 26.5
\end{align*}
$$

$$

$$