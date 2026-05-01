---
id: Lambert W Function
aliases: []
tags:
  - math/complex
date: 2025-06-11
updated: 2025-06-12
---
![[Pasted image 20250612154422.png]]

The lambert W function, denoted as $W(x)$, is a special function that is defined as the inverse of the function $f(x) = x e^x$. In other words, if $y = W(x)$, then it satisfies the equation:

$$
W(x)=\sum_{n=1}^\infty \frac{(-n)^{n-1}}{n!}x^n
$$

This is only one way to define the Lambert W function, and there are other equivalent definitions as well.

However, the problem is that the Lambert W function is not defined for all real numbers. It is only defined for certain values of $x$, specifically for $x \geq -\frac{1}{e}$, where $e$ is the base of the natural logarithm.

Because of this, it cannot technically be called a function in the strictest sense, as it does not have a unique output for every input. Instead, it is a multi-valued function, meaning that for some inputs, there are multiple outputs.

## Properties

A neat property of the Lambert W function is that it is the inverse of the function $f(x) = x e^x$. This means that if $y = W(x)$, then $x = y e^y$

> [!Example]
> Take a number $z$ and use it as the input to the function $W(z)$. This returns a constant $W(z)$(duh). If you take this number and multiply it by $e$ raised to the power of that number, you get back $z$:
>
> $$
> \begin{align*}
> z &\to W(z) \\
> W(z) &\times e^{W(z)}=z
> \end{align*}
> $$

This property is useful in many applications, such as solving equations involving exponentials and logarithms. Namely, it allows us to solve those equations of the form:

$$
t^t = z
$$
