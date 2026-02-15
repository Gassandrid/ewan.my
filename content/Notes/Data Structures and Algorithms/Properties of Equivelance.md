---
id: Properties of Equivelance
created_on: "[[12-10-2024]]"
aliases: []
tags:
  - university
  - cs/theory/algorithms
date: 2024-12-10
updated: 2025-09-22
---
In layman's terms:

- **Reflexive**: A is related to A.
- **Symmetric**: if A is related to B, then B is related to A.
- **Transitive**: if A is related to B and B is related to C then A is related to C.

In Discrete Math:

$$
Reflexivity: \ \ \ \forall x \in A, \ \ (x,x) \in R
$$

$$
Symmetry: \ \ \ \forall x,y \in A, \ \ (x,y) \in R \Rightarrow (y,x) \in R
$$

$$
Transitivity: \ \ \ \forall x,y,z \in A, \ \ (x,y) \in R \land (y,z) \in R \Rightarrow (x,z) \in R
$$

---

## Example

Determine if " is singing louder than" holds the properties of an equivalence relation, where the population ( set S ) is all the birds in the world that are singing in this moment in time.

1. Reflexivity: is a bird singing louder than itself? No, so it is not reflexive.
2. Symmetry: if bird A is singing louder than bird B, is bird B singing louder than bird A? No, so it is not symmetric.
3. Transitivity: if bird A is singing louder than bird B, and bird B is singing louder than bird C, is bird A singing louder than bird C? Yes, so it is transitive.

Is "is singing louder than" an equivalence relation? No, because it is not reflexive and symmetric.
