---
class:
  - note
  - lectureNote
tags:
  - university
course: "[[Algorithm Design and Analysis]]"
lesson:
  - lecture
  - slide
lecture-number: 5
source:
related:
author:
date: 2025-09-09
updated: 2025-09-09
---

![[Bipartite.png]]

## Definition

A **bipartite graph** is an [[Graphs#Undirected Graphs|undirected graph]] $G=(V,E)$ $\iff$ "the set of nodes can be divided into two disjoint sets $L$ and $R$ such that no edge has both end-nodes in the same set."

### In Laymann's Terms

An undirected graph is bipartite if you can color the nodes using two colors such that no two adjacent nodes have the same color.

### Real World Applications

**Bipartite graphs** are often used to model relationships between two different classes of objects. For example, scheduling jobs for workers, where one set represents workers and the other set represents jobs. An edge between a worker and a job indicates that the worker is qualified to perform that job.

---

## Formal Definition

A graph $G=(V,E)$ is **bipartite** if there exists a partition of the vertex set $V$ into two disjoint subsets $L$ and $R$ such that every edge in $E$ connects a vertex in $L$ to a vertex in $R$. Formally, this means:

$$
G \text{ is bipartite } \iff V = L \cup R \text{ and } L \cap R = \emptyset \text{ and } \forall (u,v) \in E, u \in L \text{ and } v \in R
$$
