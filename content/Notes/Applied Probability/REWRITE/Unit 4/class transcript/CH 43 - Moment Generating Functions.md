---
date: 2025-04-07
updated: 2025-04-07
---

>[!Abstract] Definition for a Generation Function
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

>[!Abstract] Definition for a Moment Generating Funciton
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

$$