---
title: Homework 5 Written
author:
  - "[[Ewan Pedersen]]"
date: 2025-10-10
updated: 2025-10-10
abstract: Show the steps of deriving your answers. Points will be deducted for answers without adequate steps discussed. Submit your homework via Brightspace as one PDF or Word document.
class:
  - note
  - export
tags:
  - cs/theory/algorithms
---

---

## Prim’s MST Algorithm: Tracing

> Run the Prim’s algorithm implemented using a priority queue (see below) against the graph shown below. Give your answers as follows.
> 
> 1. Run the algorithm assuming the node a is picked as the start node s, and show the algorithm run trace (see the specification below).
> 2. Run the algorithm assuming the node g is picked as the start node s, and show the algorithm run trace (see the specification below).
> 3. Draw the resulting minimum spanning tree on the graph. Show the included edges in colored or thick lines.
>
> Specification of the algorithm run tracing: For each algorithm run tracing, show the content of the cut $S$, the content of the $MST \ T$, and the content of the priority queue $Q$ at the end of the While loop in each iteration. Specifically, show the content of $S$ as a set of nodes, the content of $T$ as a set of edges, and the content of $Q$ as a set of ordered pairs of a node number and a priority key. (For ease of grading, please show the end nodes of an edge in the alphabetical order (e.g., (a, d)), and list the priority queue elements in the alphabetic order of node number.) For example, when the start node is $a$, their contents before the 1st iteration is $S=\{  \}$, $T=\{  \}$, and $Q = \{ (a,0), (b, \infty), (c, \infty), (d,\infty), (e,\infty), (f, \infty), (g,\infty) \}$.
>
> ![[primAlgo.png|Given Prim Pseudocode]]
> 
> ![[Screenshot 2025-10-10 at 8.17.16 PM.png|Given Undirected Graph]]

### 1. Starting at Node $a$

Let $i$ indicate iteration number.

$$
\begin{align*}
Before \ i&=1: \\
& S = \{  \} \\
& T = \{  \} \\
& Q = \{ (a,0), (b, \infty), (c, \infty), (d,\infty), (e,\infty), (f, \infty), (g,\infty) \} \\
After \ i&=1: \\
& S = \{ a \} \\
& T = \{  \} \\
& Q = \{ (b,8), (c,5), (d,6), (e,\infty), (f,\infty), (g,\infty) \} \\
After \ i&=2: \\
& S = \{ a, c \} \\
& T = \{ (a,c) \} \\
& Q = \{ (b,8), (d,6), (e,2), (f,4), (g,\infty) \} \\
After \ i&=3: \\
& S = \{ a, c, e \} \\
& T = \{ (a,c), (c,e) \} \\
& Q = \{ (b,3), (d,6), (f,4), (g,\infty) \} \\
After \ i&=4: \\
& S = \{ a, b, c, e \} \\
& T = \{ (a,c), (b,e), (c,e) \} \\
& Q = \{ (d,6), (f,4), (g,\infty) \} \\
After \ i&=5: \\
& S = \{ a, b, c, e, f \} \\
& T = \{ (a,c), (b,e), (c,e), (c,f) \} \\
& Q = \{ (d,6), (g,1) \} \\
After \ i&=6: \\
& S = \{ a, b, c, e, f, g \} \\
& T = \{ (a,c), (b,e), (c,e), (c,f), (f,g) \} \\
& Q = \{ (d,6) \} \\
After \ i&=7: \\
& S = \{ a, b, c, d, e, f, g \} \\
& T = \{ (a,c), (a,d), (b,e), (c,e), (c,f), (f,g) \} \\
& Q = \{  \} \\
\end{align*}
$$

### 2. Starting at Node $g$

Let $i$ indicate iteration number.

$$
\begin{align*}
Before \ i&=1: \\
& S = \{  \} \\
& T = \{  \} \\
& Q = \{ (a,\infty), (b,\infty), (c,\infty), (d,\infty), (e,\infty), (f,\infty), (g,0) \} \\
After \ i&=1: \\
& S = \{ g \} \\
& T = \{  \} \\
& Q = \{ (a,\infty), (b,\infty), (c,\infty), (d,\infty), (e,\infty), (f,1) \} \\
After \ i&=2: \\
& S = \{ f, g \} \\
& T = \{ (f,g) \} \\
& Q = \{ (a,\infty), (b,\infty), (c,4), (d,\infty), (e,7) \} \\
After \ i&=3: \\
& S = \{ c, f, g \} \\
& T = \{ (c,f), (f,g) \} \\
& Q = \{ (a,5), (b,10), (d,9), (e,2) \} \\
After \ i&=4: \\
& S = \{ c, e, f, g \} \\
& T = \{ (c,e), (c,f), (f,g) \} \\
& Q = \{ (a,5), (b,3), (d,9) \} \\
After \ i&=5: \\
& S = \{ b, c, e, f, g \} \\
& T = \{ (b,e), (c,e), (c,f), (f,g) \} \\
& Q = \{ (a,5), (d,9) \} \\
After \ i&=6: \\
& S = \{ a, b, c, e, f, g \} \\
& T = \{ (a,c), (b,e), (c,e), (c,f), (f,g) \} \\
& Q = \{ (d,6) \} \\
After \ i&=7: \\
& S = \{ a, b, c, d, e, f, g \} \\
& T = \{ (a,c), (a,d), (b,e), (c,e), (c,f), (f,g) \} \\
& Q = \{  \} \\
\end{align*}
$$

### 3. MST Drawing

![[Screenshot 2025-10-10 at 11.02.36 PM.png|MST of provided undirected graph]]

---

## Kruskal’s MST Algorithm Tracing

> Run the Kruskal’s MST algorithm shown below (left) on the graph shown below (right), using disjoint sets data structure represented as a forest. Provide your answer as instructed below.
>
> 1. List the edges after the sorting (format: “(v1, v2), (v3, v4),...”).
> 2. Draw the forest structure after MakeUnionFind.
> 3. In each iteration of the ‘for’ loop, write the trace of Find and Union operations (e.g., “Find(v) returns u.”, “Do Union(v1, v2).”, “Discard (v1, v2).”), and draw the resulting forest structure. Use the union-by-size heuristic for Union.
> 4. After the algorithm terminates, draw the final MST of the graph (by making the included edges thicker or red). (There is no need to show the MST in every iteration.)
> 
> Please follow this specification for the consistency and convenience of grading:
> 
> - Iterate the ‘for’ loop over all edges (without an early termination), as written in the algorithm.
> - When drawing a forest, show the trees in an increasing order of the root node number.
> - If the disjoint sets do not change in an iteration, you do not need to show the forest structure.
> - If two trees that are merged have the same size, make the second tree (on the right) a subtree of the first tree (on the left).
> 
> ![[Screenshot 2025-10-10 at 11.08.44 PM.png|Kruskal Pseudocode Algorithm]]
> 
> ![[Screenshot 2025-10-10 at 11.09.16 PM.png|Sample Undirected Graph]]

### 1. Sorting the Edgeso

Sorting the edges yields:

$$
(1,2), (3,4), (1,5), (2,5), (2,3), (2,4), (4,5)
$$

### 2. Resulting Forest Structure from $MakeUnionFind$

This just yields each node having its own tree with a size of $1$:

$$
1 \quad  2 \quad  3 \quad  4 \quad  5 \quad 
$$

### 3. Iterating over Traces

Once again letting $i$ indicate iteration.

$$
\begin{align*}
Iteration \ i&=1: \text{ Edge } (1,2) \text{ with weight } 5 \\
& \text{Find}(1) \text{ returns } 1. \\
& \text{Find}(2) \text{ returns } 2. \\
& \text{Do Union}(1, 2). \\
& T = \{ (1,2) \} \\
\\
Iteration \ i&=2: \text{ Edge } (3,4) \text{ with weight } 7 \\
& \text{Find}(3) \text{ returns } 3. \\
& \text{Find}(4) \text{ returns } 4. \\
& \text{Do Union}(3, 4). \\
& T = \{ (1,2), (3,4) \} \\
\\
Iteration \ i&=3: \text{ Edge } (1,5) \text{ with weight } 8 \\
& \text{Find}(1) \text{ returns } 1. \\
& \text{Find}(5) \text{ returns } 5. \\
& \text{Do Union}(1, 5). \\
& T = \{ (1,2), (3,4), (1,5) \} \\
\\
Iteration \ i&=4: \text{ Edge } (2,5) \text{ with weight } 10 \\
& \text{Find}(2) \text{ returns } 1. \\
& \text{Find}(5) \text{ returns } 1. \\
& \text{Discard } (2,5). \\
& T = \{ (1,2), (3,4), (1,5) \} \\
\\
Iteration \ i&=5: \text{ Edge } (2,3) \text{ with weight } 11 \\
& \text{Find}(2) \text{ returns } 1. \\
& \text{Find}(3) \text{ returns } 3. \\
& \text{Do Union}(1, 3). \\
& T = \{ (1,2), (3,4), (1,5), (2,3) \} \\
\\
Iteration \ i&=6: \text{ Edge } (2,4) \text{ with weight } 14 \\
& \text{Find}(2) \text{ returns } 1. \\
& \text{Find}(4) \text{ returns } 1. \\
& \text{Discard } (2,4). \\
& T = \{ (1,2), (3,4), (1,5), (2,3) \} \\
\\
Iteration \ i&=7: \text{ Edge } (4,5) \text{ with weight } 21 \\
& \text{Find}(4) \text{ returns } 1. \\
& \text{Find}(5) \text{ returns } 1. \\
& \text{Discard } (4,5). \\
& T = \{ (1,2), (3,4), (1,5), (2,3) \} \\
\end{align*}
$$

### 4. Final MST

![[Screenshot 2025-10-10 at 11.16.47 PM.png|Resulting MST for Second Undirected Graph Sample]]
