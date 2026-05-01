---
date: 2025-04-07
updated: 2025-06-21
tags:
  - math/probability
class: note
---
Given Formula

| Time until the first success occurs                          | $E(X) = \frac{1}{\lambda}= \int_{-\infty}^\infty xf_{X}(x)dx$ |
| ------------------------------------------------------------ | ------------------------------------------------------------- |
| X = time until the next even occurs, $X \geq 0$              | $Var(X) = \frac{1}{\lambda^2}$                                |
| $\lambda$ = the average rate                                 | $Var(X) = \frac{1}{\lambda^2}$                                |
| $f_{X}(x)= \lambda e^{-2x}, x>0$, and $f_{X}(x)=0$ otherwise |                                                               |
| $F_{X}(x)=1-e^{-2x}$, $x>0$, and $F_{X}(x) = 0$ otherwise    | $SD(X)= \$                                                    |

1. What is this exponential problem? (other than it says it has an exponential distribution).
because we are waiting until the $1^{st}$ success

2. What does X represent in this scenario?

X is the time waited until the next 

3. What is the expected time for receiving the next text message?

$E(X)= 5 \text{min}$

4. What is the value of $\lambda$?

$$
E(X) = \frac{1}{\lambda} \to 5 = \frac{1}{\lambda}
$$

5. What is the CDF for the wait time of the first text message? Write it in function form and graph it.

$$
F_{X}(x) = \int_{-\infty}^x f(t) dt = \int_{0}^x \frac{1}{5}e^{-\frac{1}{5}x}dx = 1-e^{- \frac{1}{5}x}
$$

 6. Find the probability that he will not receive a text in the next 10 minutes.

 $$
P(x>10) = \int_{10}^\infty \frac{1}{5}e^{- \frac{1}{5}x}
$$

which becomes:

$$
1 - \int_{0}^{10} \frac{1}{5} e ^{- \frac{1}{5}x}dx = 1 - f(x) = 1 - \left( 1-e^{- \frac{10}{5}} \right) = 0.1353
$$

7. Find the probability that the next text arrives between $9:07$ and $9:10$ PM

$$
P(7<x <10) = \int_{7}^{10} \frac{1}{5}e^{- \frac{1}{5}x} dx = F(10) - F(7) = 0.113
$$

8. Given that the first text has not arrived by $9:05$pm, what is the probability that the first text will arrive by $9:10$pm?

$$
P(X < 10 \mid x > 5)
$$

Given the important formula we memorized ( for a given b):

$$
P(A \mid B) = \frac{P(A \cap B)}{P(B)}
$$

we can plug this in:

$$
= \frac{P(X<10 \cap X > 5)}{P(X>5)} = \frac{P(5<X<10)}{P(X>5)}
$$

We can then solve this with either $f_{X}(x)$ or $F_{X}(x)$



For $F_{X}(x)$:

$$
F_{X}(x) = \frac{F(10)-F(5)}{1 - F(5)}
$$


For $f_{X}(x)$:

$$
f_{X}(x) = \frac{\int_{5}^{10} \frac{1}{5}e}{}
$$
$$

$$

