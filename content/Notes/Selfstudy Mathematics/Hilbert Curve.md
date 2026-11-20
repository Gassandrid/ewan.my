---
date: 2025-07-09
updated: 2025-07-11
tags:
  - math/topology
class: note
---
The **Hilbert Curve** is a space filling fractal pattern with the purpose of mapping all natural numbers onto the 2d plane.

[![Pasted image 20250709104553.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/a28147c3c92569d12330ca29fce5a8ceaa211567d98c64fa2fc934cbb6f916bb/Pasted%20image%2020250709104553.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/a28147c3c92569d12330ca29fce5a8ceaa211567d98c64fa2fc934cbb6f916bb/Pasted%20image%2020250709104553.png)

From a conventional standpoint, this feels nearly impossible as it feels as if there is no intuitive way to fill 2d space with a single dimensional line.

---

## Why is it Useful over a Simpler Curve?

One can imagine that if a "space filling" curve were to exist, then it would entail repeating a pattern with infinite precision, **approaching** a state of a perfect mapping from 1 to 2 dimensional.

But why does this not work for any curve, and why is the **Hilbert Curve** an exception?

It is because of how any given natural number input to the curve will "approach" a certain coordinate as the Hilbert Curve $n$ value approaches $\infty$:

[![Screenshot 2025-07-09 at 10.55.36 AM.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/0ccbe675210e5711a76ff251f69b0ce62886890007e067c04c3be1279eef7cd2/Screenshot%202025-07-09%20at%2010.55.36%20AM.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/0ccbe675210e5711a76ff251f69b0ce62886890007e067c04c3be1279eef7cd2/Screenshot%202025-07-09%20at%2010.55.36%20AM.png)

Think of the definition of a Hilbert Curve as something like the following:

$$
\underbrace{ HC(x) }_{ \text{hilbert curve} }=\lim_{ n \to \infty } \underbrace{ PHC_{n}(x) }_{ \text{points of hilbert as coordinates} }
$$

Other space filling curve options don't have this property, and natural number mappings will jump around and never find a stable value.

It is for this reason, that we can prove that as the Hilbert Curve approaches infinite precision, there exists a mapping of all natural numbers to the 2d coordinate plane, such that every point in the plane has a natural number associated with it.
