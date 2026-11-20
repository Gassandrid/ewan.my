---
id: Orthogonality
aliases:
  - Orthogonal
  - orthogonal
tags:
  - math/linear-algebra
date: 2025-06-17
updated: 2026-04-02T10:33:10-04:00
class:
  - note
---

**Orthogonality** refers to the concept of perpendicularity in vector spaces. Two vectors are orthogonal if their dot product is zero, indicating that they are at right angles to each other. This concept is fundamental in linear algebra, particularly in the context of inner product spaces.

[![Screenshot 2025-06-17 at 11.13.16 AM.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/a7d351e0576317b88d728fbef1654358414bcba76370b355d9fe3434e4f00e9a/Screenshot%202025-06-17%20at%2011.13.16%20AM.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/a7d351e0576317b88d728fbef1654358414bcba76370b355d9fe3434e4f00e9a/Screenshot%202025-06-17%20at%2011.13.16%20AM.png)

---

## Usage

**Orthogonality** is computed by finding the Dot Product of two given vectors.

This can be done in python by using numpy:

```python
import numpy as np

A = np.array([1, 2, 3])
B = np.array([4, -2, 1])

Orthogonal = np.dot(A, B) == 0
# Output: False
```

You can do the same in MATLAB:

```matlab
A = [1; 2; 3];
B = [4; -2; 1];

Orthogonal = dot(A, B) == 0;
# Output: 0
```
