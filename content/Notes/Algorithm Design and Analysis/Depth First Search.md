---
date: 2025-09-02
created_on: "[[09-02-2025]]"
updated: 2025-09-04
class:
  - note
  - lectureNote
  - definition
tags:
  - university
  - cs/theory/algorithms
course: "[[Algorithm Design and Analysis]]"
lesson:
  - external
lecture-number: 3
source:
related:
author:
  - "[[Ewan Pedersen]]"
---
**Depth-First Search (DFS)** is an algorithm for traversing or searching tree or graph data structures. The algorithm starts at a designated start node (or an arbitrary node in a general graph) and explores as far as possible along each branch before backtracking.

## Properties

- DFS produces a DFS forest on $V$ via the predecessor relation; in an undirected graph, each tree corresponds to a connected component.
- Each vertex $v$ receives discovery time $d[v]$ and finish time $f[v]$; the intervals $[d[u], f[u]]$ satisfy the parenthesis property (either disjoint or one properly contains the other).
- Edge classification in directed graphs: tree, back, forward, cross; in undirected graphs, every non-tree edge is a back edge.
- In a DAG, ordering vertices by decreasing finish time yields a valid topological order.

### Pseudocode

![[Screenshot 2025-09-02 at 11.06.43 AM.png]]

## Formal Definition

Let $G=(V,E)$ be a finite directed or undirected graph and optionally a designated start vertex $s\in V$. Depth-First Search (DFS) explores edges out of the most recently discovered vertex that still has unexplored incident edges.

$$
\begin{aligned}
\textbf{State:}\quad
& c:V\to\{\text{white},\text{gray},\text{black}\},\ \pi:V\to V\cup\{\mathrm{NIL}\}, \\
& d:V\to\mathbb{N},\ f:V\to\mathbb{N},\ t\in\mathbb{N}.
\end{aligned}
$$

Initialization:

$$
\forall v\in V:\ c[v]\gets \text{white},\ \pi[v]\gets \mathrm{NIL};\quad t\gets 0.
$$

Procedure:

$$
\begin{aligned}
\textbf{DFS}(G, s):\quad
& \text{if } s \text{ is given then } \textbf{DFS\_Visit}(s). \\
& \text{for each } v\in V \text{ with } c[v]=\text{white}:\ \textbf{DFS\_Visit}(v).
\end{aligned}
$$

Recursive step:

$$
\begin{aligned}
\textbf{DFS\_Visit}(u):\quad
& c[u]\gets \text{gray};\ d[u]\gets t\gets t+1; \\
& \text{for each edge } (u,v)\in E \text{ in any fixed order:} \\
& \quad \text{if } c[v]=\text{white} \text{ then } \pi[v]\gets u;\ \textbf{DFS\_Visit}(v); \\
& c[u]\gets \text{black};\ f[u]\gets t\gets t+1.
\end{aligned}
$$

Outputs:

$$
\begin{aligned}
& \pi \text{ induces a DFS forest } \mathcal{F} \text{ over } V; \\
& d[v] \text{ and } f[v] \text{ are the discovery and finish times of } v.
\end{aligned}
$$

Edge classification (directed graphs):

$$
\begin{aligned}
&\text{Tree edge: } (u,v) \text{ where } c[v]=\text{white} \text{ when first explored}.\\
&\text{Back edge: } d[v] < d[u] < f[u] < f[v].\\
&\text{Forward edge: } d[u] < d[v] < f[v] < f[u].\\
&\text{Cross edge: } d[v] < f[v] < d[u] < f[u]\ \text{ or vice versa}.
\end{aligned}
$$

Parenthesis property:

$$
\forall u\neq v:\ [d[u],f[u]] \text{ and } [d[v],f[v]] \text{ are either disjoint or one properly contains the other.}
$$

Reachability (with start $s$):

$$
v \text{ is reachable from } s \iff v \text{ lies in the DFS tree rooted at } s \text{ in } \mathcal{F}.
$$

Time and space:

$$
T(G)=\Theta(|V|+|E|),\quad S(G)=\Theta(|V|).
$$
