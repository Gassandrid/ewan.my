---
date: 2025-04-09
updated: 2025-10-15
class:
  - note
tags:
  - math/statistics/applied-probability
source:
related:
author:
---

If $X \sim \text{Exponential}(\lambda)$, then:

$$
\begin{align*}
P(X>s+ | X>s)=P(X>t),\quad \forall s,t≥0 \\
P(X > s + t \mid X > s) = P(X > t), \quad \forall s, t \geq 0
\end{align*}
$$

The probability that the process continues for at least another $t$ units of time, given it has already lasted $s$, is the same as the original probability of lasting $t$.

**For PDF:**

$$
f_{X}(x)=\{ 0,x<0f_X(x) = \begin{cases} \lambda e^{-\lambda x}, & x \geq 0 \\ 0, & x < 0 \end{cases}
$$

**For CDF:**

$$
P(X>x)=1−FX(x)=e−λxP(X > x) = 1 - F_X(x) = e^{-\lambda x}
$$

**Proof:**

$$
\begin{align*}
P(X > s + t ∣ X >s)&=P(X>s+t)P(X>s) \\ &=e− \lambda (s+t)e− \lambda s=e− \lambda t=P(X>t) \\ \\


P(X > s + t \mid X > s)
&= \frac{P(X > s + t)}{P(X > s)} \\
&= \frac{e^{-\lambda(s + t)}}{e^{-\lambda s}} \\
&= e^{-\lambda t} = P(X > t)

\end{align*} 
$$

The exponential distribution is **memoryless** — it "forgets" how much time has passed. It’s the **only** continuous distribution with this property.

This property is ideal for **Poisson** Problems:

- Time between radioactive decays
- Time between customer arrivals
- Time until hardware failure
