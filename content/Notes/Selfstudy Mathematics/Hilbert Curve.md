---
date: 2025-07-09
updated: 2025-07-11
tags:
  - math/topology
class: note
---

The **Hilbert Curve** is a space filling fractal pattern with the purpose of mapping all natural numbers onto the 2d plane.

![[Pasted image 20250709104553.png]]

From a conventional standpoint, this feels nearly impossible as it feels as if there is no intuitive way to fill 2d space with a single dimensional line.

---

## Why is it Useful over a Simpler Curve?

One can imagine that if a "space filling" curve were to exist, then it would entail repeating a pattern with infinite precision, **approaching** a state of a perfect mapping from 1 to 2 dimensional.

But why does this not work for any curve, and why is the **Hilbert Curve** an exception?

It is because of how any given natural number input to the curve will "approach" a certain coordinate as the Hilbert Curve $n$ value approaches $\infty$:

![[Screenshot 2025-07-09 at 10.55.36 AM.png]]

Think of the definition of a Hilbert Curve as something like the following:

$$
\underbrace{ HC(x) }_{ \text{hilbert curve} }=\lim_{ n \to \infty } \underbrace{ PHC_{n}(x) }_{ \text{points of hilbert as coordinates} }
$$

Other space filling curve options don't have this property, and natural number mappings will jump around and never find a stable value.

It is for this reason, that we can prove that as the Hilbert Curve approaches infinite precision, there exists a mapping of all natural numbers to the 2d coordinate plane, such that every point in the plane has a natural number associated with it.
