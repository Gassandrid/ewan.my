---
created_on: "[[09-02-2025]]"
class:
  - note
  - lectureNote
tags:
  - university
  - cs/theory/structure
course: "[[Algorithm Design and Analysis]]"
lesson:
  - lecture
lecture-number: 3
source:
related:
date: 2025-09-02
updated: 2025-09-02
---
An adjacency list, like an [[Adjacency Matrix]], is a way of representing a graph. However, instead of using a 2D array, it uses a collection of lists or arrays to represent the connections between nodes. This representation is more space-efficient for sparse graphs, where the number of edges is much less than the maximum possible number of edges. One can picture this as looking somewhat like a [[Hash Map]].

Once again consider that one [[Graphs#^4ae3bd|undirected graph example]], we can represent this as a **[[Adjacency List]]** with the following:

![[Screenshot 2025-09-02 at 10.21.16 AM.png]]

Where it is defined as follows:

- Let $G = (V, E)$ be a graph.
- The adjacency list $Adj$ is a mapping $Adj: V \to sequence$ of neighbors such that:
	- Directed graphs: $v \in Adj[u]$ if and only if $(u, v) \in E$.
	- Undirected graphs: $v \in Adj[u]$ if and only if $\{u, v\} \in E$; equivalently, $u \in Adj[v]$ as well.
- Weighted graphs: each entry in Adj[u] is a pair (v, w(u, v)); for unweighted graphs, each entry is just v.
- Multigraphs/self-loops: duplicates and u = v entries may appear in Adj[u] as permitted by E.
- Space usage: Theta(|V| + |E|).
- Basic operations:
	- neighbors(u): iterate Adj[u] in O(deg(u)).
	- hasEdge(u, v): O(deg(u)) with plain lists; average O(1) if Adj[u] is backed by a hash/set.
	- addEdge(u, v[, w]): amortized O(1); for undirected graphs also insert v into Adj[u] and u into Adj[v].
	- removeEdge(u, v): O(deg(u)) with lists; average O(1) with indexed structures.
