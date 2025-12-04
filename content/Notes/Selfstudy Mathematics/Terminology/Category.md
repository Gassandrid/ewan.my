---
class:
  - note
tags:
  - math/category
  - todo/math/category
source:
related:
author:
description:
date: 2025-11-22
updated: 2025-11-25
---

A **category** defines the abstraction of *composition*. We primarily understand a category as a collection of some objects which satisfy a set of formal rules concerning [[Composition]], [[Associativity]], and [[Identity]].

![[category.png]]

---

## Formal Definition

---

## Example

A common example of categories in action is when defining relations between [[Sets]]. Say we want establish a [[Bijection]] for the set of all shapes $S$ to a modified set of [[Primary Number Systems#The Natural Numbers|natural numbers]] $N$:

$$
S = \{ \text{triangle}, \text{square}, \text{pentagon}, \dots \}
$$

$$
N = \{ x | x \in \mathbb{N}, x > 2 \}
$$

We can define a *relation* $f$ that does just this

$$
f_{edges}:S\to N \quad 
$$

Where $f$ maps the number of edges of a given shape to its corresponding natural number.

Now say we have a set $B$ of the booleans:

$$
B = \{  true, false \}
$$

And we define a new *relation* $g$ that maps the *even* numbers to $true$, and the *odd* numbers to $false$:

$$
g_{even?}: N\to B
$$

By the formal definition of a category we now have a [[Composition]] $g \circ f$ that maps shapes directly to a boolean:

$$
g \circ f: 
$$
