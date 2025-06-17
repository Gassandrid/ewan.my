---
date: 2025-06-13
updated: 2025-06-17
tags:
  - math/analysis
  - todo/math
source: https://www.youtube.com/watch?v=FFPXm-tuOt8
---

> What is a Hilbert Space? **David Hilbert** and **John von Neumann** both played played key roles in the development of Hilbert Spaces, with Hilbert laying much of the groundwork and von Neumann finishing it off by giving the first complete definition of them. These spaces then quickly became useful in areas like Quantum Mechanics, the physics of heat transfer, and even modeling sound waves.

---

Let's start with a simple vector. Imagine an arrow in the two dimensional plane. By choosing a specific coordinate system, we can specify the location of this vector with just two numbers: # of steps in x direction, and # of steps in y direction:

![[Screenshot 2025-06-13 at 2.28.36 PM.png]]

While this is generally the standard coordinate system used by all, there is nothing preventing us from using an alternative one.

We could just as easily use any other two vectors to form our coordinate system( so long as they have a $90^\circ$ angle between them ):

![[Screenshot 2025-06-13 at 2.34.15 PM.png]]

Within the field of [[Essence of Linear Algebra|Linear Algebra]], we would say that these two vectors are [[Orthogonality|Orthogonal]] to each other.

And, since any other vector in the plane can be expressed as some combination of these two vectors:

![[Screenshot 2025-06-17 at 2.22.07 PM.png]]

Then they form an **orthogonal basis**

$$
\hat{r},\hat{s}\text{  form an orthogonal basis}
$$

But if that these basis vectors also have a length of $1$, they would also form an **orthonormal basis.**

