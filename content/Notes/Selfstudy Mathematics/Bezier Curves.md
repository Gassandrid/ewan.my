---
tags:
  - math/splines
  - cs/graphics
date: 2025-07-09
updated: 2025-07-22
class: note
---

The **Bézier curve** is a parametric curve often used for computer graphics. It is part of the family of **spline curves**, useful for defining paths using a set of control points.

The primary mechanism behind the Bézier curve is the [[Linear Interpolation]] function. [[Linear Interpolation]] takes in two points ( in the case of $\mathbb{R}^2$ ) and can _interpolate_ in between for a given parameter $t$ ( we are working with the parametric versions ):

$$
\begin{align*}
x(t) &= x_{1} + t(x_{2} - x_{1}) \\
y(t) &= y_{1} + t(y_{2} - y_{1}) \\
\end{align*}
$$

Think of this as a function of time that will take in a value between $0$ and $1$, and will return some point that resides on the line that those two points draw out:

![[Screenshot 2025-07-18 at 10.01.13 PM.png]]

_another possible definition for a $\mathbb{R}^1$ LERP function_

---

Interesting things occur when you have more than two points, and you then draw a new LERP line in between the outputted points of two previous LERPs.

This behavior, at least in the case of 3 points is what we call a _quadratic bezier curve_. This is because we have a degree of 2, and the outputted points are then used to create a new LERP line.

However the far more common case is the _cubic bezier curve_, which is defined by 4 points. The first and last points are the endpoints of the curve, while the two middle points are control points that define the curvature of the curve.

![[Screenshot 2025-07-18 at 10.04.12 PM.png]]

The cubic Bezier curve is the one most used in computer graphics, and is defined by the following equation:

$$
B(t) = (1 - t)^3 P_0 + 3(1 - t)^2 t P_1 + 3(1 - t) t^2 P_2 + t^3 P_3
$$

## Bernstein Polynomial Form

A more powerful way to express the cubic Bézier curve is using the **Bernstein polynomial** form:

$$
\begin{align}
&P(t)= \\
&P_0(-t^3 + 3t^2 - 3t + 1) &&+ \\
&P_1(3t^3 - 6t^2 + 3t) &&+ \\
&P_2(-3t^3 + 3t^2) &&+ \\
&P_3(t^3)
\end{align}
$$

A neat way to think of this is by visualizing each point as a vector from the origin to the point, and then scaling each vector by the polynomial coefficients. Adding these vectors together draws the same curve that running the LERP method would achieve.

![[Screenshot 2025-07-19 at 5.24.02 PM.png]]

Lining the vectors up shows this sort of "wave" effect that the curve has, which is a result of the polynomial coefficients. This is a **weighted sum**, as all the values add up to one as they shift their weights.
