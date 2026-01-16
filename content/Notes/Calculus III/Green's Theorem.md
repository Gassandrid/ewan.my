---
id: 16.4 Green's Theorem
date: 2024-11-25
tags:
  - math/calculus/multivariable
  - university
updated: 2025-09-05
class:
  - note
---

Let $C$ be a simple closed curve and let $\mathcal{D}$ be the region bounded by $C$. We say $C$ has **positive orientation** if $C$ is traversed in the **counterclockwise** direction.

> [!Info] Positive Orientation
> $\mathcal{D}$ is always on your **left** as you traverse the curve
>
> ![[Screenshot 2024-12-11 at 10.24.17 PM.png|350]]

> [!danger] Negative Orientation
> $\mathcal{D}$ is always on your **right** as you traverse the curve
>
> ![[Screenshot 2024-12-11 at 10.27.26 PM.png|350]]

---

## Abstract

> [!Success] Green's Theorem (named for George Green):
> Let $\mathcal{D}$ be a simply connected region whose boundary curve $C$ is a simple, closed, **positively oriented** curve. If $P(x,y)$ and $Q(x,y)$ have continuous first-order partials on some open region containing $\mathcal{D}$, then:
>
> $$
> \int_{C} P(x,y) \ dx + Q(x,y) \ dy = \int_{\mathcal{D}} \int \left( \frac{\partial Q}{\partial x} - \frac{\partial P}{\partial y} \right) \ dA
> $$

This theorem says that under certain conditions, we can evaluate a line integral as a double integral.

---

> [!Abstract] Remarks
>
> 1. To use this theorem correctly, note that $C$ must have **positive orientation**. If $C$ has negative orientation, we have to multiply our answer by $-1$:
>
> $$
> \int_{C} \dots = - \int_{-C} \dots = - \int_{\mathcal{D}} \int (Q_{x}- P_{y}) \ dA
> $$
>
> 2. We can state the theorem more succinctly as:
>
> $$
> \oint_{\partial \mathcal{D}} \vec{F} \cdot d\vec{r} = \int_{\mathcal{D}} \int (Q_{x}-P_{y}) \ dA
> $$
>
> - The notation "$\partial \mathcal{D}$" means "boundary curve of $\mathcal{D}$". So, $\partial \mathcal{D} = C$.
> - $\partial \mathcal{D}$ is a closed curve, so we use the $\oint$ notation (recall this is called a circulation integral).
> - If $\vec{F} = \langle P(x,y), Q(x,y) \rangle$, the integrand says:
>
> $$
> \vec{F} \cdot d\vec{r} = \langle P,Q \rangle \cdot \ dx, dy \rangle = P \ dx + Q \ dy
> $$
>
> which is the form we used on the previous page.

---

## Proving Green's Theorem

We will prove this for the special case where $\mathcal{D}$ is a **simple region**, meaning a region which is simultaneously Type I and Type II. We wish to show:

$$
\oint_{\partial \mathcal{d}} \vec{F} \cdot d\vec{r} = \oint_{\partial \mathcal{D}} P \ dx + Q \ dy = \int_{\mathcal{D}} \int (Q_{x}-P_{y}) \ dA
$$

We will do this by showing:

$$
\oint_{\partial \mathcal{D}} P \ dx = - \int_{\mathcal{D}} P_{y} \ dA \ \ \ AND \oint_{\partial \mathcal{D}} Q \ dy = \int_{\mathcal{D}} Q_{x} \ dA \ \ \ \ (*)
$$

The result will follow by linearity of the integral.

Let $\mathcal{D}$ be a simple region with positively-oriented boundary curve $\partial \mathcal{D}$. Consider the case where we view $\mathcal{D}$ as a Type I region:

> [!Info] Sketch
> ![[Screenshot 2024-12-11 at 11.08.24 PM.png|350]]
>
> $\mathcal{D}$ as a Type I region

> [!Info] Sketch
> ![[Screenshot 2024-12-11 at 11.09.01 PM.png|350]]
>
> $\partial \mathcal{D}$ decomposed into $\partial \mathcal{D} - C_{1} \cup C_{2}$

We compute the first expression in `(*)` directly as:

$$
\oint_{\partial \mathcal{D}} P \ dx = \int_{C_{1}} P \ dx + \int_{C_{2}} P \ dx = \int_{C_{1}} P \ dx - \int_{-C_{2}} P \ dx \ \ \ \ (**)
$$

( The "negation" trick will help us soon. ) We can parameterize $C_{1}$ and $-C_{2}$ by:

$$
C_{1}: \ \ \ \langle t, y_{1}(t) \rangle \ \ \ t \in [a,b]
$$

$$
C_{2}: \ \ \ \langle t, y_{2}(t) \rangle \ \ \ t \in  [a,b]
$$

`(**)` is then:

$$
\begin{align*}
\oint_{\partial \mathcal{D}} P \ dx &= \int_{a}^b P (t,y_{1}(t)) \ dt - \int_{a}^b P(t, y_{2}(t)) \ dt \\
&= - \int_{a}^b P(t, y_{2}(t))-P(t,y_{1}(t)) \ dt \\
&= - \left. \int_{a}^b P(t,y) \right|_{y=y_{1}(t)}^{y=y_{2}(t)}dt \\
&= - \int_{a}^b \int_{y_{1}(t)}^{y_{2}(t)}P_{y}(t,y) \ dy \ dt \\
&= - \int_{a}^b \int_{y_{1}(x)}^{y_{2}(x)} P_{y}(x,y) \ dy \ dx \\
&= - \int_{\mathcal{D}} \int P_{y}(x,y) \ dA
\end{align*}
$$

This is exactly what we wanted in `(*)`. The other expression in `(*)` can be obtained by regarding $\mathcal{D}$ as a Type II region.

---

## Finding Area with Green's Theorem

Recall that the area of region $\mathcal{D}$ can be found by:

$$
Area(\mathcal{D}) = \int_{\mathcal{D}} \int 1 \ dA
$$

Green's Theorem says that:

$$
\oint_{C} P \ dx + Q \ dy = \int_{\mathcal{D}}\int Q_{x}-P_{y} \ dA
$$

So, if we can find functions $Q_{x}$ and $P_{y}$ satisfying $Q_{x}-P_{y}=1$, then we can "reverse" Green's Theorem and find area by computing a line integral.

There are several ways to "force" $Q_{x}-P_{y}=1$:

$$
Q=x, \ \ P = 0 \ \to \ A= \oint_{c} x \ dy
$$

$$
Q = 0, \ \ P=-y \ \to \ A=- \oint _{c} y \ dx
$$

$$
Q = \frac{1}{2}x, \ \ P = - \frac{1}{2}y \ \to \ A = \frac{1}{2} \oint_{c} x \ dy - y \ dx
$$
