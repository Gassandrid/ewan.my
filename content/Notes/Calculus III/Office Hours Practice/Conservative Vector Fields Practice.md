---
date: 2024-11-18
updated: 2024-11-18
tags:
  - math/calculus/vector
  - university
---
$$
\vec{F} = \langle xye^z , 0 , yze^x \rangle
$$

$$
\begin{align}
div(\vec{F}) &= \nabla \cdot \vec{F} \\ \\
&= \frac{\partial}{\partial x} xye^z + \frac{\partial}{\partial y}0+ \frac{\partial}{\partial z}yze^x \\
&= ye^z ye^x
\end{align}
$$

$$
\begin{align}
curl(\vec{F}) &= \nabla \times \vec{F} = \begin{vmatrix}
i & j & k \\
\frac{\partial}{\partial x} & \frac{\partial}{\partial y} & \frac{\partial}{\partial z} \\
xye^z & 0 & yze^x  
\end{vmatrix}
\\
&= \langle ze^y, xye^x, -xe^z \rangle
\end{align}
$$



$$
\begin{align}
f_{x} &= yz\sin xy \to f=-z\cos xy+g(y,z) \\
f_{y} &= xz\sin xy \to f = -z\cos xy + h(x,z) \\
f_{z} &= -\cos(xy) \to f = -z \cos xy + k(x,y)
\end{align}
$$

---

## Problem 9

$$
SA: \ \ \ z = \sqrt{ x^3 + y^2 }, \ \ \ between \ \ y=5x \ \ \ and \ \ \ y=x^2
$$



$$
SA = \int \int_{\mathcal{D}} \sqrt{ 1+z_{x}^2 + zy^2 }
$$

