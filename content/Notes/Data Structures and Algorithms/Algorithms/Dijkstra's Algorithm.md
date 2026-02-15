---
date: 2024-10-25
created_on: "[[10-25-2024]]"
tags:
  - university
  - cs/theory/algorithms
updated: 2025-09-22
---
Dijkstra's algorithm is a popular **graph traversal algorithm** used to find the shortest path between nodes in a weighted graph. Developed by Edsger W. Dijkstra in 1956, it’s an efficient solution for finding the shortest path from a single source to all other nodes.

## Overview

Dijkstra’s algorithm uses the following:

- **Graph** $G = (V, E)$, where $V$ is the set of vertices and $E$ the set of edges.
- **Edge weight** $w(u, v) \geq 0$, representing the cost or distance between nodes.
- **Source vertex** $s$, from which shortest paths are calculated.

> [!info] Applications
> Dijkstra's algorithm is widely used in GPS navigation, networking, and robotics, where shortest-path calculations are essential.

## Algorithm Steps

1. Initialize distances to all vertices as infinity, except the source vertex $s$ which is set to 0.
2. Add all vertices to a **priority queue** (often a min-heap) where they are prioritized by distance.
3. While the queue is not empty:
    - Extract the vertex $u$ with the minimum distance.
    - For each neighbor $v$ of $u$:
        - If $d(u) + w(u, v) < d(v)$, update $d(v)$ and adjust $v$'s priority in the queue.
4. Repeat until all vertices are visited.

### Pseudocode

```pseudo
\begin{algorithm}
\caption{Dijkstra's Algorithm}
\begin{algorithmic}
  \Procedure{Dijkstra}{$G, s$}
    \For{each vertex $v$ in $V$}
      \State $d(v) \gets \infty$
    \EndFor
    \State $d(s) \gets 0$
    \State Initialize priority queue $Q$ with all vertices in $V$ prioritized by $d(v)$
    
    \While{$Q$ is not empty}
      \State $u \gets$ \Call{Extract-Min}{$Q$}
      \For{each neighbor $v$ of $u$}
        \If{$d(u) + w(u, v) < d(v)$}
          \State $d(v) \gets d(u) + w(u, v)$
          \State Update priority of $v$ in $Q$ to $d(v)$
        \EndIf
      \EndFor
    \EndWhile
  \EndProcedure
\end{algorithmic}
\end{algorithm}
```

## Mathematical Explanation

Let $d(u)$ denote the shortest distance from the source $s$ to any vertex $u$. The algorithm ensures that by the time a vertex $u$ is removed from the priority queue, $d(u)$ holds the minimum distance from $s$ to $u$.

### Distance Update Condition

For each edge $(u, v) \in E$ with weight $w(u, v)$:

$$
d(v) = \min(d(v), d(u) + w(u, v))
$$

This update ensures that the shortest path to each neighbor is recalculated as necessary.

## Example

Consider a graph represented by the following table:

| Vertex | Neighbors (Edge Weight) |
| ------ | ----------------------- |
| A      | B (1), C (4)            |
| B      | C (2), D (5)            |
| C      | D (1)                   |
| D      |                         |

Starting from $A$, Dijkstra’s algorithm finds the shortest paths to other nodes:

1. $d(A) = 0$
2. $d(B) = 1$
3. $d(C) = 3$
4. $d(D) = 4$

> [!tip] Priority Queue Optimization
> Using a min-heap for the priority queue ensures each extraction and update operation runs efficiently. In large graphs, this significantly reduces runtime.

## Complexity

- **Time Complexity**: $O((V + E) \log V)$ when implemented with a binary heap.
- **Space Complexity**: $O(V)$ , as we store distances and a priority queue for each vertex.
