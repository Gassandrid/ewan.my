---
date: 2025-06-13
updated: 2025-09-09
tags:
  - math/analysis
  - todo/math
source: "[[What is a Hilbert Space?]]"
class:
  - transcript
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

We will also be making use of the **Dot Product** of two vectors, but this is fairly known. (multiplies two vectors resulting in a single scalar value, evaluates the difference in direction between the two vectors):

$$
Given: \quad v_{1}= \begin{bmatrix}
1 \\
3
\end{bmatrix}, \quad v_{2} = \begin{bmatrix}
5 \\
2
\end{bmatrix}
$$

$$
\underbrace{\vec{v}_{1} \cdot \vec{v}_{2}}_{\text{Dot Product}} = (1 \times 5) + ( 3 \times 2) = 11
$$

One can see how this might be taken into the third dimension quite easily, and computing the dot product is still just as trivial. This can be scaled to any **finite** number of dimensions.

---

What a **Hilbert Space** is then, is the extension of these concepts to an **infinite** number of dimensions. And instead of just ordinary vectors as we know them ( arrows in space ), vectors in a Hilbert Space also include some *abstract mathematical vectors*.

These live in the **Vector Space**, which is a well-defined collection of objects that satisfy certain rules. Namely, you can scale and add vectors without leaving the space.

![[Screenshot 2025-06-17 at 4.12.49 PM.png]]

A lot of things can fall under this classification. For example:

- The set of all **row vectors** form a vector space.

$$
\underbrace{[u_{1},u_{2},\dots,u_{n}]}_{\text{live in a n-dimensional vector space}}
$$

- So do the **column vectors**:

$$
\underbrace{
\begin{bmatrix}
u_{1} \\
u_{2} \\
\vdots \\
u_{n}
\end{bmatrix}
}_{\text{live in a n-dimensional vector space}}
$$

But also less conventional sets, like $n\times n$ matrices, and even functions also form a vector space.

>[!Warning]
> Things get a little more abstract from this point forward, so always try to keep the 2-dimensional case in the back of your mind, that is the intuitive picture.

---

## Essence of a Hilbert Space

Beyond the requirements of a **Vector Space**, a Hilbert space has two more requirements that must be satisfied, namely:

$$
1. \text{A hilbert space is complete}
2. \text{}
$$

To understand what the first rule means by "complete", lets consider the case of **polynomial functions**.

A *polynomial* is any function that can be presented in the form:

$$
p(x) = \underbrace{ a_{n}x^n + a_{n-1}x^{n-1} + \dots + a_{1}x+a_{0} }_{ \text{where } a_{n}, a_{n-1}, \dots, a_{1},a_{0} \text{ are real numbers} }
$$

*Polynomials* form a vectors space, $P(\mathbb{R})$, with basis:

$$
\{ x^0, x^1, x^2, x^3, x^4, x^5,\dots \}
$$
