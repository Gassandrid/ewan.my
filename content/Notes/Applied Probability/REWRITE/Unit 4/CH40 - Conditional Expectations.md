---
fileClass: note
date: 2025-04-23
updated: 2025-06-21
tags:
  - math/statistics/applied-probability
---

**Let's Recall the Following:**

- Expected Value Formula for Mass from [[CH11 - Expected Values]]

$$
E(X) = \sum x \cdot P_{X}(x)
$$

- Expected Value Formula for Density from [[CH28 - Expected Values of Continuous Random Variables]]

$$
E(x) = \int_{-\infty}^\infty x \cdot f_{X}(x) \ dx
$$

$$
E(x) = \int_{-\infty}^\infty x \cdot \frac{x\cdot f_{X}(x)}{x-1} dx
$$

$$
i\hbar\frac{\partial}{\partial t}\Psi (r,t)=- \frac{\hbar^2}{2m} \nabla^2 \Psi(r,t) + V (r,t) \Psi (r,t)
$$

---

For **Conditional Expectation** we are given a few new formulas:

- For Discrete Random Variables:

$$
E(X \mid Y) = \sum_{x}x p_{X\mid Y}(x \mid y)
$$

- For Continuous Random Variables:

$$
E(X \mid Y) = \int_{-\infty}^\infty x f_{X \mid Y}(x \mid y) \ dx
$$

We are also given some new **Key Properties:**

- **Linearity:**  

  $$
    E\bigl[aX + bZ \mid Y\bigr]
    =a\,E[X\mid Y]+b\,E[Z\mid Y].
  $$

- **Tower Law (Iterated Expectation):**  

$$
   E\bigl[E[X\mid Y]\bigr]
   =E[X].
$$

- **Taking Out What’s Known:**  
  If $g$ is a function of $Y$, then  

  $$
    E\bigl[g(Y)\,X \mid Y\bigr]
    =g(Y)\,E[X\mid Y].
  $$

- **Non‐negativity:**  
  If $X\ge0$ almost surely, then $E[X\mid Y]\ge0$ almost surely.

---

> [!Example]
> Let $x$ and $y$ have a joint uniform distribution on the triangle with corners $(0,2),(2,0)$ and the origin.

1. Find $E\left(  Y \mid X = \frac{1}{2} \right)$

We can think of this as a wedge of cheese in $\mathbb{R}^3$, and for this reason we know that this is a continuous problem.

Plugging in for the integral:

$$
\begin{align*}
&= \int_{0}^{2-x} y f_{Y\mid X}(y \mid x) \ dy \\
&= \int_{0}^{2-x}y\left( \frac{f_{X,Y}(x,y)}{F_{X}(x)} \right)dy \\
&= \int_{0}^{2-x}y\left( \frac{\frac{1}{2}}{\int_{0}^{2-x} \frac{1}{2}dy} \right) \\
&= \int_{0}^{2-x} y\left(  \frac{\frac{1}{2}}{\frac{1}{2}(2-x)} \right) \\
&= \int_{0}^{3/2} \frac{2}{3}y \ dy \\
&= \left. \frac{2}{3} \frac{y^2}{2} \right|_{0}^{3/2} = \frac{1}{3}\left( \frac{3}{2} \right)^2 = \frac{3}{4}
\end{align*}
$$

> [!Example] Exercise 40.11 - Doctor's appointments
> A doctor has two consecutive appointments with patients. The duration of each appointment is Exponential with expected value 20 minutes. the durations of the two appointments are assume to be independent. Given that the total duration of the two appointments turns out to be $38$ minutes altogether, how long do we expect the first appointment to be?

We know that **each appointment** is something like:

*Given that we know the $E(X_{i})=20=\frac{1}{\lambda} \to \lambda = 0.05$*

$$
X_{i} \approx EXP(0.05) \to f_{X_{i}}= 0.05e^{-0.05X_{i}} \quad i =1,2
$$

Now we want the **total duration:**

$$
Y = X_{1} + X_{2} \to Y
$$

---

> **Solution:**  
>-  Joint density:  
>
>   $\displaystyle f_{X_1,X_2}(x_1,x_2)=\lambda^2e^{-\lambda(x_1+x_2)}.$  
>
>- Sum density (Erlang–2):  
>
>   $\displaystyle f_Y(y)=\lambda^2\,y\,e^{-\lambda y}.$  
>
>- Conditional density:  
>
>   $\displaystyle f_{X_1\mid Y}(x_1\mid y)=\frac{\lambda^2e^{-\lambda y}}{\lambda^2y\,e^{-\lambda y}} >   =\frac1y,\;0<x_1<y.$
>
>- Hence  
>
> $$

      E[X_1\mid Y=y]
      =\int_{0}^{y}x_1\,\frac1y\,dx_1
      =\frac y2,

 $$
>
>   so $E[X_1\mid Y=38]=19$ min.


