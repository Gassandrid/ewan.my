---
date: 2025-08-28
updated: 2025-08-28
class:
  - note
  - lectureNote
tags:
  - cs/theory
  - university
course: "[[Algorithm Design and Analysis]]"
lesson:
  - lecture
lecture-number: 2
source:
related:
---

I am sure we are all familiar with graphs, given that this whole note repo is graph-based! But in computer science, graphs are a fundamental data structure used to model relationships between entities. They consist of **vertices** (or nodes) and **edges** (connections between nodes).

This will deal with defining graphs formally, and some common algorithms that operate on them.

---

## Undirected Graphs

Undirected graphs are defined as:

$$
G = (V, E)
$$

**where**:

- $V$ is the set of vertices (or nodes).
- $E$ is the set of edges, which are unordered pairs of vertices. An edge
- Captures a bidirectional relationship between two vertices.
- Graph size parameters:
  - $|V| = n$ (number of vertices)
  - $|E| = m$ (number of edges)

### Example

Say we define a graph with the following parameters: ^4ae3bd

$$
\begin{align*}
V &= \{ 1,2,3,4,5,6,7,8 \} \\
E &= \{ (1,2), (1,3), (2,3), (2,4), (2,5), (3,5), (3,7), (3,8), (4,5), (5,6), (7,8)\} \\
n &= 8 \\
m &= 11 \\
\end{align*}
$$

This would yield a graph looking like:

![[Screenshot 2025-08-28 at 11.03.12 AM.png]]

> [!Question]
> What is the minimum and maximum numbers of edges in an undirected graph with $n$ vertices?

> [!Success]- Answer
> The minimum number of edges is $0$ (an empty graph), and the maximum number of edges is $\frac{n(n-1)}{2}$ (a complete graph where every pair of vertices is connected by an edge).

---

## Directed Graphs

Similarly, directed graphs are defined as:

$$
G = (V, E)
$$

**Where**:

- $V$ is the set of vertices (or nodes).
- $E$ is the set of edges between **ordered** pairs of vertices.
- Captures pairwise relationships between two vertices, but in a specific direction (from one vertex to another).
- Graph size parameters:
  - $|V| = n$ (number of vertices)
  - $|E| = m$ (number of edges)

### Returning to the Example

Going back to the same definition from before, lets see what happens when we construct a **directed graph** from the same parameters:

$$
\begin{align*}
V &= \{ 1,2,3,4,5,6,7,8 \} \\
E &= \{ (1,2), (1,3), (2,3), (2,4), (2,5), (3,5), (3,7), (3,8), (4,5), (5,6), (7,8)\} \\
n &= 8 \\
m &= 11 \\
\end{align*}
$$

We get:

![[Screenshot 2025-08-28 at 11.08.24 AM.png]]

Looks quite similar! But with one obvious change.

> [!Question]
> What is the minimum and maximum numbers of edges in a directed graph with $n$ vertices?

> [!Success]- Answer
> The minimum number of edges is $0$ (an empty graph), and the maximum number of edges is $n(n-1)$ (a complete directed graph where every pair of vertices is connected by a directed edge in both directions).

---

## Representing Graphs with Adjacency Matrices

Graphs can be represented in various ways, and one common method is using an **adjacency matrix**. An adjacency matrix is a 2D array where the rows and columns represent the vertices of the graph, and the entries indicate whether there is an edge between the vertices.

Going back to our [[Graphs#^4ae3bd|undirected graph example]], we can represent this as a matrix:

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
