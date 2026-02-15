---
created_on: "[[12-05-2025]]"
class:
  - export
tags:
source:
related:
author:
  - Ewan Pedersen
description:
date: 2025-12-05
updated: 2025-12-05
abstract: Show the steps of deriving your answers. Points will be deducted for answers without adequate steps discussed. Submit your homework via Brightspace as one PDF or Word document.
---
---

## Self Reducibility

Show how the optimization version of vertex cover problem is polynomial time-reducible to its decision version. The optimization version, known as min vertex cover problem, is “given a graph $G$, find the minimum set of vertices that cover all the edges in $G$”. The decision version is “given a graph $G$ and a constant $k$, is there a vertex cover of at most $k$ vertices?” Here, we say a vertex “covers” an edge if and only if the vertex is an end- node of the edge.

### Reduction to Decision Version

We start with the two phases, finding the minimum size using inbary search, and constructing an actual minimum vertex using the vertex elimination.

Using the given graph $G=(V,E)$ with value of $n=|V|$ vertices, we use binary search with the following decision oracle:

$$
\begin{align} &\text{Initialize: } \ell = 0, ; r = n\\ &\text{While } \ell < r:\\ &\quad m = \lfloor (\ell + r) / 2 \rfloor\\ &\quad \text{if DEC-VC}(G, m) = \text{YES}:\\ &\quad\quad r = m\\ &\quad \text{else}:\\ &\quad\quad \ell = m + 1\\ &\text{Return } k^* = \ell \end{align}
$$

This yields a big $O$ complexity of $O(\log n)$ calls to $DEV-VC$, where each takes polynomial time.

Now that we know the value of $k^*$, we can construct an actual minimum vertex cover $C$:

$$
\begin{align} &C = \emptyset\\ &k = k^*\\ &V' = V \text{ (remaining vertices)}\\ &\text{For each vertex } v \in V:\\ &\quad G' = G[V' \setminus {v}] \text{ (induced subgraph without } v)\\ &\quad \text{if DEC-VC}(G', k-1) = \text{NO}:\\ &\quad\quad C = C \cup {v}\\ &\quad\quad k = k - 1\\ &\quad\quad V' = V' \setminus {v}\\ &\text{Return } C \end{align}
$$

We notice that when DEC-VC($G',k-1$) returns NO, then vertex $v$  MUST be in every vertex cover of the size $k$ for current graph.

Now we have the information necessary for a proof via contradiction:

We suppose that $v$ is not needed. If this is the case, then there exists a vertex cover of size $k$ not containing $v$, where this dover only uses vertices from $V' \setminus \{ v \}$. Therefore, $G'$ has a vertex cover of size $\leq k-1$, which is a **contradiction**.

This algorithm terminates with $|C|=k^*$ because we only add a vertex to $C$ when its essential, we decrement $k$ each time we add a vertex, and we started with exactly $k^*$ slots to fill.

This yields the final complexity:

$$
\begin{align} &\text{Phase 1: } O(\log n) \text{ oracle calls}\\ &\text{Phase 2: } O(n) \text{ oracle calls (one per vertex)}\\ &\text{Total: } O(n + \log n) = O(n) \text{ oracle calls} \end{align}
$$

Given that each phase call is completed in polynomial time, that means the full reduction also runs in polynomial time. $\blacksquare$

---

## Set Packing and Independent Set

Prove that $SET-PACKING \leq_{p} INDEPENDENT-SET$, that is, the $SET-PACKING$ decision problem is polynomial-time reducible to the $INDEPENDENT-SET$ decision problem. Feel free to use an illustration if it helps. The definitions of these two decision problems are summarized below.

- $SET-PACKING$: Given a set $U$ of elements, a set of subsets $S_{1}, S_{2}, ..., S_{m}$ of $U$, and an integer $k$, does there exist a set of at least $k$ subsets that are pairwise disjoint (i.e., intersection = $\emptyset$ between every pair)?
- $INDEPENDENT-SET$: Given a graph $G = (V, E)$ and an integer $k$, is there a subset of vertices $S \subseteq V$ such that $|S| \geq k$ and, for each edge in $E$, at most one -- but not both -- of its end nodes is in S?

(Note we’ve already proved in class that INDEPENDENT-SET $\leq_{p}$ SET-PACKING, so this proof leads to it that INDEPENDENT-SET $\equiv_{p}$ SET-PACKING, that is, these two problems are equally hard computationally.)

Make sure to give a complete proof based on the Karp reduction definition (which is for decision problems) by including the two parts---(1) the polynomial-time construction algorithm and (2) the equivalence of solutions to the two problems.

### Constructing the Reduction

Given a SET-PACKING instance $(U, \{ S_{1},S_{2},\dots,S_{m}, k \})$, construct an INDEPENDENT-SET instance $(G,k)$ as follows:

$$
\begin{align} &\text{Graph } G = (V, E) \text{ where:}\\ &\quad V = {v_1, v_2, ..., v_m} \quad \text{(one vertex per subset)}\\ &\quad E = {(v_i, v_j) : S_i \cap S_j \neq \emptyset, ; i \neq j} \quad \text{(edge iff subsets intersect)} \end{align}
$$

Keeping the same value of $k$. In essense, the two subsets are disjoint, their corresponding vertices are not connected by an edge.

A demo would look something like:

$$
\begin{align*}
U &= \{ 1,2,3,4,5 \} \\
S_{1} &= \{ 1,2 \} \\
S_{2} &= \{ 2,3 \} \\
S_{3} &= \{ 3,4 \} \\
S_{4} &= \{ 4,5 \} \\
S_{5} &= \{ 1,5 \} \\
k = 2
\end{align*}
$$

Their intersections would look like:

$$
\begin{align*}
S_{1} \cap S_{2} &= \{ 2 \} \neq \emptyset \to edge(v_{1},v_{2}) \\
S_{2} \cap S_{3} &= \{ 3 \} \neq \emptyset \to edge(v_{2},v_{3}) \\
S_{3} \cap S_{4} &= \{ 4 \} \neq \emptyset \to edge(v_{3},v_{4}) \\
S_{4} \cap S_{5} &= \{ 5 \} \neq \emptyset \to edge(v_{4},v_{5}) \\
S_{1} \cap S_{5} &= \{ 1 \} \neq \emptyset \to edge(v_{1},v_{5}) \\
\end{align*}
$$

All other pairs are disjoint. See *Figure 1* for a rough visualization of this graph.

![[Screenshot 2025-12-05 at 7.22.16 PM.png|Resultant Graph(rough)]]

To proove the correctness, we must now define our theorem that SET-PACKING has a solution of size $\geq k \iff G$ has an independent set of size $\geq k$.

For the forward direction, we suppoos that $\{ S_{i_{1}}, S_{i_{2}}, \dots, S_{i_{k}} \}$ is a set packing:

$$
\begin{align} &\text{For all } p \neq q: S_{i_p} \cap S_{i_q} = \emptyset\\ &\implies \text{No edge } (v_{i_p}, v_{i_q}) \in E\\ &\implies {v_{i_1}, v_{i_2}, ..., v_{i_k}} \text{ is an independent set in } G \end{align}
$$

For the backward directoin, we supposed that $\{ v_{j_{1}}, v_{j_{2}}, \dots, v_{j_{k}} \}$ is an indepenent set of $G$.

$$
\begin{align} &\text{For all } p \neq q: (v_{j_p}, v_{j_q}) \notin E\\ &\implies S_{j_p} \cap S_{j_q} = \emptyset \quad \text{(by construction)}\\ &\implies {S_{j_1}, S_{j_2}, ..., S_{j_k}} \text{ is a set packing} \end{align}
$$

Now to analyze its complexity:

$$
\begin{align} &\text{Create } m \text{ vertices: } O(m)\\ &\text{Check all pairs for intersection: } O(m^2 \cdot |U|)\\ &\text{Total: } O(m^2 \cdot |U|) = \text{polynomial in input size} \end{align}
$$

Given that this reduction is computable in polynomial time(and also preserves solutions), we know:

$$
SET-PACKING \leq_{p} INDEPENDENT-SET
$$

Combining with hte result from class of INDEPENDENT-SET $\leq_{p}$ SET-PACKING, we now know:

$$
SET-PACKING \equiv_{p} INDEPENDENT-SET
$$

And thus the problems are computationally equivalent $\blacksquare$.
