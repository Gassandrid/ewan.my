---
date: 2025-10-11
updated: 2025-10-11
class:
  - note
tags:
  - math/splines
source:
related:
author:
---
**Linear Interpolation** is a fairly simple concept. It is used to estimate values that fall between two known values. The idea is to draw a straight line between the two known points and use that line to find the value at a specific point in between.

Say you have a $\mathbb{R}^1$ dimensional space with two known points: $(x_0, y_0)$ and $(x_1, y_1)$. The formula for linear interpolation to find the value $y$ at a point $x$ between $x_0$ and $x_1$ is given by:

$$
y = y_0 + \frac{(y_1 - y_0)}{(x_1 - x_0)} \cdot (x - x_0)
$$

Parameterized for time, you can express it as:

$$
y(t) = (1 - t) \cdot y_0 + t \cdot y_1 \quad \text{for } t \in [0, 1]
$$

LERPs can be extended to higher dimensions as well. For example, in $\mathbb{R}^2$, if you have two points $(x_0, y_0)$ and $(x_1, y_1)$, you can interpolate both the x and y coordinates separately:

$$
x(t) = (1 - t) \cdot x_0 + t \cdot x_1
$$

$$
y(t) = (1 - t) \cdot y_0 + t \cdot y_1
$$

---

LERPs are widely used for the field of **Splines**, paticularly in [[Bezier Curves]] by "stacking" multiple LERPs together to create smooth curves.
