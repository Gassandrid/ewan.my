---
id: CH 43 - Moment Generating Functions
aliases: []
tags:
  - math/statistics/applied-probability
date: 2025-04-07
updated: 2025-10-15
---

> [!Abstract] Definition for a Generation Function
> If $a_{1},a_{2},\dots, a_{n}$ is an interesting sequence of numbers from which we want to build a generating function $g(t)$, we write:
>
> $$
> g(t) = \sum_{j=0}^\infty \frac{a_{j}}{j!} t^j = \frac{a_{0}}{0!}t^0 + \frac{a_{1}}{1!}t^1 + \frac{a_{2}}{2!}t^2 + \frac{a_{3}}{3!}t^3 +  \dots + \frac{a_{n}}{n!}t^n
> $$

We get something like:

$a_{j} = g^{(j)}(0)$

an example:

$$
a_{0} = g^{(0)}(0) = \left. a_{0} + a_{1}t + \frac{a_{2}}{2}t^2 + \dots \right|_{t=0}
$$

which is quite boring and just becomes:

$$
= a_{0}
$$

same would yield for $a_{1}$.

---

## Moment Generating Functions

> [!Abstract] Definition for a Moment Generating Funciton
> The moment generating function $M_{X}(t)$ of a random variable $X$ is equal to the expected value of $e^{tX}$:
>
> $$
> M_{X}(t) = \sum_{j=0}^\infty \frac{E(X^{j})}{j!}t^{j} = E\left(  \sum_{j=0}^\infty \frac{(tX)^{j}}{j!} \right) = E(e^{tX})
> $$

---

Here we define $a_{j} = E(X^{j})$ as the$j^{th}$ moment about the value of a Random variable $X$

$$
\text{mean} \ \mu x = E(x^1)
$$

you can also get $E(X^{2})$:

---

## New Exercise

> [!Example]
> Starting at `6:00AM`, birds perch on a power line with time between consecutive birds is exponential with an average of 7.5 minutes.

> [!Abstract] Hint
>
> From this we can note that we will use:
>
> $$
> X \approx Exp(.133) \quad\text{ for } \lambda
> $$
>
> And we can use the exponential equation:
>
> $$
> E(x) = 7.5 = \frac{1}{\lambda} \Rightarrow \lambda = 0.133 = \frac{1}{7.5}
> $$

1. Given that there has not been a bird perched in the previous 5 minutes, what is the probability that a bird will not perch in the next 10 minutes.

$$
P(X > 15 \mid X > 5) = \frac{P(X > 15 \cap X > 5)}{P(X > 5)}
$$

We will use the [[Memoryless Property For Exponentials]]

$$
\begin{align*}
P(X>10 + 5) \mid X > 5) &= P(X>10) \\
&= 1-F(10) \\
&= 1 - (1-e^{-0.133(10)}) \\
&= e^{-.133(10)}= \boxed{0.2636}
\end{align*}
$$

2. How many birds are expected to perch in the next hour?

We expect that 1 bird will perch every `7.5` minutes, and thus we will switch to **poisson**.

$$
E(X) = \frac{60 \text{ minutes}}{7.5\text{ minutes}} = \text{8 birds in an hour } = \lambda_{P}
$$

Now that we have the average number of birds per hour, we can use the Poisson distribution to find the probability of a certain number of birds perching in the next hour.

$$
\begin{align*}
P(X = k) &= \frac{e^{-\lambda} \lambda^k}{k!}\\
\end{align*}
$$

For example, the probability of exactly 8 birds perching in the next hour is:

$$
\begin{align*}
P(X = 8) &= \frac{e^{-8} 8^8}{8!}\\
&\approx 0.1396
\end{align*}
$$

And the probability of at least 10 birds perching in the next hour is:

$$
\begin{align*}
P(X \geq 10) &= 1 - P(X \leq 9)\\
&= 1 - \sum\_{k=0}^{9}\frac{e^{-8}8^k}{k!}\\
&\approx 0.2798
\end{align*}
$$
