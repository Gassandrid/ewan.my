---
id: Lambert W Function
aliases: []
tags:
  - todo/math
  - math/complex
date: 2025-06-11
updated: 2025-06-11
---

Todo: https://en.wikipedia.org/wiki/Lambert_W_function

$$
W(x)=\sum_{n=1}^\infty \frac{(-n)^{n-1}}{n!}x^n
$$

## Properties

A neat property of the Lambert W function is that it is the inverse of the function $f(x) = x e^x$. This means that if $y = W(x)$, then $x = y e^y$

>[!Example]
> Take a number $z$ and use it as the input to the function $W(z)$. This returns a constant $W(z)$(duh). If you take this number and multiply it by $e$ raised to the power of that number, you get back $z$:
>
> $$
> \begin{align*}
> z &\to W(z) \\
> W(z) &\times e^{W(z)}=z
> \end{align*}
> $$