---
tags:
  - cs/theory/algorithms
  - university
date: 2025-09-02
updated: 2025-09-02
class:
  - note
  - lectureNote
  - definition
course: "[[Algorithm Design and Analysis]]"
lesson:
  - lecture
lecture-number: 3
source:
related:
author:
  - "[[Ewan Pedersen]]"
---

**Breadth-First Search (BFS)** is an algorithm for traversing or searching tree or graph data structures. It starts at a selected node (often referred to as the 'root' in trees) and explores all of its neighboring nodes at the present depth prior to moving on to nodes at the next depth level.

![[BFSearch.png]]

## Formal Definition

**BFS** can be formally defined as follows:

Let the graph be G = (V, E) and the start vertex be s ∈ V.

$$
L_0 = \{s\}, \qquad
L_{k+1} = \left\{\, v \in V \setminus \bigcup_{i=0}^{k} L_i \;\middle|\; \exists\, u \in L_k \text{ with } (u,v) \in E \,\right\}
$$

Define the distance (in number of edges) from s:

$$
d(v) =
\begin{cases}
k, & \text{if } v \in L_k \\
\infty, & \text{if } v \notin \bigcup_{i\ge 0} L_i
\end{cases}
$$

Define a predecessor function that induces a BFS tree:

$$
\pi(s) = \bot, \qquad
\pi(v) \in L_{d(v)-1} \ \text{ with } \ (\pi(v), v) \in E \ \text{ for } d(v) \ge 1
$$

The BFS tree is:

$$
T = (V_T, E_T), \quad
V_T = \{ v \in V \mid d(v) < \infty \}, \quad
E_T = \{ (\pi(v), v) \mid v \in V_T \setminus \{s\} \}
$$

Correctness (shortest-path property):

$$
\forall v \in V:\quad d(v) = \delta(s,v) := \min\{\, \text{length}(P) \mid P \text{ is a path } s \leadsto v \,\}
$$

Complexity (with adjacency lists):

$$
\text{time} = \Theta(|V| + |E|), \qquad \text{space} = \Theta(|V|)
$$
