---
date: 2025-09-02
updated: 2025-09-02
class:
  - note
  - lectureNote
  - definition
tags:
  - university
  - cs/theory/structure
course: "[[Algorithm Design and Analysis]]"
lesson:
  - lecture
lecture-number: 3
source:
related:
---

Adjacency Matrix is a way of representing a graph using a 2D array. It is particularly useful for dense graphs where the number of edges is close to the maximum number of edges.

Going back to a previous [[Graphs#^4ae3bd|undirected graph example]], we can represent this as a matrix:

$$
A_{directed} = \begin{bmatrix}
0 & 1 & 1 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 1 & 1 & 1 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 1 & 0 & 1 & 1 \\
0 & 0 & 0 & 0 & 1 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 1 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 1 \\
0 & 0 & 0 & 0 & 0 & 0 & 0 & 0 \\
\end{bmatrix}
$$

An adjacency matrix is a square matrix used to represent a finite graph. The elements of the matrix indicate whether pairs of vertices are adjacent or not in the graph.

They are defined as follows:

Let G = (V, E) with |V| = n and vertices indexed v_1, …, v_n. The adjacency matrix A ∈ ℝ^{n×n} is defined by:

- Directed, unweighted graphs:

  $$
  A_{ij} =
  \begin{cases}
  1 & \text{if } (v_i, v_j) \in E, \\
  0 & \text{otherwise.}
  \end{cases}
  $$

- Undirected, unweighted graphs:

  $$
  A_{ij} =
  \begin{cases}
  1 & \text{if } \{v_i, v_j\} \in E, \\
  0 & \text{otherwise,}
  \end{cases}
  \quad \text{so } A_{ij} = A_{ji}.
  $$

  For simple graphs (no self-loops), A\_{ii} = 0.

- Weighted graphs:
  $$
  A_{ij} =
  \begin{cases}
  w(v_i, v_j) & \text{if an edge exists between } v_i \text{ and } v_j, \\
  0 \text{ (or } +\infty \text{/} \perp \text{ by convention)} & \text{otherwise.}
  \end{cases}
  $$
  For undirected weighted graphs, A is symmetric. In multigraphs, A\_{ij} may store the number of parallel edges (or the sum of their weights).
