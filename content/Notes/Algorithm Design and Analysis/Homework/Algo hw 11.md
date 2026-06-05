---
date: 2025-11-21
updated: 2025-11-21
title: Homework 11 Written
abstract: Show the steps of deriving your answers. Points will be deducted for answers without adequate steps discussed. Submit your homework via Brightspace as one PDF or Word document.
author:
  - Ewan Pedersen
---
---

## Maximum Bipartite Matching: Maxflow Solution

Given the bipartite graph(*Figure 1*) shown below that we used in class, solve the problem of finding a maximum matching by reducing the problem to a maximum flow finding problem. Specifically, show the resulting flow network and residual graph after finding the maximum flow (using the basic Ford-Fulkerson algorithm). The flow network should show on every edge the flow value assigned and the capacity (e.g., f/c) and the residual graph should show on every edge the residual capacity. Additionally, write the maximum flow value and the minimum cut (e.g., ($\{ s,a,b,c \}, \{ d,e,t \}$) resulting from the algorithm. Note the flow values on the individual edges of the flow network may vary a bit depending on the augmenting paths found randomly during the execution of the algorithm, but the maximum flow value is certainly the same and the minimum cut found is observably the same, too.

![[helpme.png|Given Bipartite Graph]]

### Initial Bipartite Graph Edges

$$
\begin{aligned}
E = \{(1, 1'), (1, 2'), (2, 2'), (3, 1'), (3, 2'), \\
(3, 3'), (4, 3'), (4, 4'), (5, 4'), (5, 5') \}
\end{aligned}
$$

### Construction of Flow Network

We add the source $s$ connected to all the leftside vertices $\{ 1,2,3,4,5 \}$ with a capacity of 1. Then add a sink $t$ connected from all the rightside vertices $\{ 1',2',3',4',5' \}$ with a capacity of 1. Thus all bipartite graph edges have a capacity of 1.

### Execution of Ford-Fulkerson for Augmenting Paths

$$
\begin{aligned}
 \text{Path 1:} \quad & s \to 1 \to 1' \to t \quad \text{(flow = 1)} \\
 \text{Path 2:} \quad & s \to 2 \to 2' \to t \quad \text{(flow = 1)} \\
 \text{Path 3:} \quad & s \to 3 \to 3' \to t \quad \text{(flow = 1)} \\
 \text{Path 4:} \quad & s \to 4 \to 4' \to t \quad \text{(flow = 1)} \\
 \text{Path 5:} \quad & s \to 5 \to 5' \to t \quad \text{(flow = 1)}
\end{aligned}
$$

Thus there exists no other augmenting pairs.

### Final Resulting Network Flow

Source edges:

$$
\begin{aligned} s \to 1 &: 1/1 \\ s \to 2 &: 1/1 \\ s \to 3 &: 1/1 \\ s \to 4 &: 1/1 \\ s \to 5 &: 1/1 \end{aligned}
$$

Bipartite Edges:

$$
\begin{aligned} 1 \to 1' &: 1/1 \quad \text{ (in matching)} \\
1 \to 2' &: 0/1  \\
2 \to 2' &: 1/1 \quad \text{ (in matching)} \\
3 \to 1' &: 0/1 \\
 3 \to 2' &: 0/1 \\
3 \to 3' &: 1/1 \quad \text{ (in matching)} \\
 4 \to 3' &: 0/1 \\
4 \to 4' &: 1/1 \quad \text{ (in matching)} \\
 5 \to 4' &: 0/1 \\
5 \to 5' &: 1/1 \quad \text{ (in matching)} \end{aligned}
$$

Sink edges:

$$
\begin{aligned} 1' \to t &: 1/1 \\
 2' \to t &: 1/1 \\
3' \to t &: 1/1 \\
 4' \to t &: 1/1 \\
5' \to t &: 1/1
\end{aligned}
$$

### Residual Graph with only Residual Capacities

Forward Residual Edges:

$$
\begin{aligned} s \to \{1, 2, 3, 4, 5\} &: 0 \text{ (all saturated)}  \\
1 \to 2' &: 1 \\
 3 \to 1' &: 1 \\
 3 \to 2' &: 1 \\
 4 \to 3' &: 1 \\
 5 \to 4' &: 1 \\
 \{1', 2', 3', 4', 5'\} \to t &: 0 \text{ (all saturated)} \end{aligned}
$$

Backward Residual Edges:

$$
\begin{aligned} \{1, 2, 3, 4, 5\} \to s &: 1 \text{ each} \\
 1' \to 1 &: 1 \\
 2' \to 2 &: 1 \\
 3' \to 3 &: 1 \\
 4' \to 4 &: 1 \\
 5' \to 5 &: 1 \\
 t \to \{1', 2', 3', 4', 5'\} &: 1 \text{ each} \end{aligned}
$$

**Results:**

Max flow: 5

Max matching for $M$: $\{ (1,1'), (2,2'), (3,3'), (4,4'), (5,5') \}$ (with a perfect match)

Min Cut: $(\{ s \}, \{ 1,2,3,4,5,1',2',3',4',5',t \})$

Thus, the cut with max capacity of 5 confirms the max flow flow/min cut theorem, where $Max\ Flow = Min\ Cut\ Capacity =5$

---

## Software Porting

>Do the textbook exercise 29 in Chapter 7. Show how to solve this problem by reformulating it to the problem of finding a minimum cut from a flow network built from the set $V$ of $n$ applications $v_{1},v_{2},\dots,$ and $v_{n}$ in a manner similar to the approach used in the image segmentation problem (see Section 7.10). State clearly how a flow network is constructed for a given instance of the software porting problem. 
> 
> Hint. One plausible way to construct a flow network from a software porting problem can be to let the source node s represent the new system and let the sink node $t$ represent the application 1 which cannot move to the new system. Then, there's a parallel between the software porting problem and the image segmentation problem:
> 
> 	- The porting benefit $b_{i}$ of an application $i$ in the software porting problem parallels the foreground likelihood $a_{i}$ of a pixel $i$ in the image segmentation problem.
> 	- The separation expense $x_{ij}$ between two applications $i$ and $j$ in the software porting problem (when only one of them is ported to the new system) parallels the separation penalty pij between two neighboring pixels $i$ and $j$ in the image segmentation problem (when one is in the foreground and the other is in the background).
>
> **Chapter 7 Exercise 29**:
> 
> Some of your friends have recently graduated and started a small com- pany, which they are currently running out of their parents’ garages in Santa Clara. They’re in the process of porting all their software from an old system to a new, revved-up system; and they’re facing the following problem.
>
>They have a collection of $n$ soft, rare applications, $\{ 1,2,\dots,n \}$, running on their old system; and they’d like to port some of these to the new system. If they move application $i$ to the new system, they expect a net (monetary) benefit of $b_{i}\geq 0$. The different software applications interact with one another; if applications $i$ and $j$ have extensive interaction, then the company, will incur an expense if they move one of $i$ or $j$ to the new system but not both; let’s denote this expense by $x_{ij}\geq 0$.
> 
> So, if the situation were really this simple, your friends would just port all $n$ applications, achieving a total benefit of $\sum_{i}b_{i}$. Unfortunately, there’s a problem ... 
> 
> Due to small but fundamental incompatibilities between the two systems, there’s no way to port application 1 to the new system; it will have to remain on the old system. Nevertheless, it might still pay off to port some of the other applications, accruing the associated benefit and Incurring the expense of the interaction between applications on different systems.
> 
> So this is the question they pose to you: Which of the remaining applications, ff any, should be moved? Give a polynomial-time algorithm to find a set $S \subseteq \{ 2,3,\dots,n \}$for which the sum of the benefits minus the expenses of moving the applications in $S$ to the new system is maximized.

### Min Cut Solution

We know that $n$ applications $\{ 1,2,\dots ,n \}$, that application 1 cannot be ported as must stay on the old system, the benefits $b_{i} \geq 0$ for any porting application $i$, and seperation expenses $x_{ij}\geq 0$ if $i$ and $j$ are on different systems. 

We first seek to find $S \subseteq \{ 2,3,\dots, n \}$ to maximize:

$$
\begin{aligned} \text{Profit}(S) = \sum_{i \in S} b_i - \sum_{\substack{i \in S, j \notin S \\ \text{or } j \in S, i \notin S}} x_{ij} \end{aligned}
$$

We then define a new flow network construction where:

- $s$: source  representing new system
- $t$ sink representing app 1 and old system
- $i \in \{ 2,3,\dots,n \}$: note for each application

The edges and capacities can then be defined as:

$$
\begin{aligned} \text{Type 1: } & s \to i \text{ for each } i \in \{2, 3, \dots, n\}, \quad \text{capacity } = b_i \\
 \text{Type 2: } & i \to t \text{ for each } i \in \{2, 3, \dots, n\}, \quad \text{capacity } = x_{i1} \\
 \text{Type 3: } & i \leftrightarrow j \text{ for each pair } i, j \in \{2, 3, \dots, n\}, \quad \text{capacity } = x_{ij} \end{aligned}
$$

For the type 3 edges, we have to use undirected edges with a capacity of $x_{ij}$, which can be implemented as two directed edges: $i\to j$ witha capacity of $x_{ij}$ and $j\to i$ with capacity $x_{ij}$.

We can then define a cut $(A,B)$ as a separation of $s$ from $t$, where:

- $A$: $\{ s \} \cup \{ \text{applications ported to new system} \}$
- $B$: $\{ t \} \cup \{ \text{applications staying on old system with an app 1} \}$

We then let $S=A \cap \{ 2,3,\dots,n \}$ be the product set of ported apps.

Calculating cut capacity with edges crossing $A$ to $B$:

$$
\begin{aligned} \text{Cut capacity} &= \sum_{j \in B \setminus \{t\}} c(s, j) + \sum_{i \in S} c(i, t) + \sum_{\substack{i \in S, j \in B \setminus \{t\}}} c(i, j) \\
 &= \sum_{j \notin S, j \geq 2} b_j + \sum_{i \in S} x_{i1} + \sum_{\substack{i \in S, j \notin S \\
 i,j \geq 2}} x_{ij} \end{aligned}
$$

We then connect the cut to objective by letting $B_{\text{total}}$ be the total benefit for all movable applications $\sum_{i=2}^n$, writing this as:

$$
\begin{aligned} \text{Profit}(S) &= \sum_{i \in S} b_i - \left[\sum_{i \in S} x_{i1} + \sum_{\substack{i \in S, j \notin S \\ i,j \geq 2}} x_{ij}\right] \\
 &= \left(B_{\text{total}} - \sum_{j \notin S, j \geq 2} b_j\right) - \sum_{i \in S} x_{i1} - \sum_{\substack{i \in S, j \notin S \\ i,j \geq 2}} x_{ij} \\
 &= B_{\text{total}} - \left[\sum_{j \notin S, j \geq 2} b_j + \sum_{i \in S} x_{i1} + \sum_{\substack{i \in S, j \notin S \\ i,j \geq 2}} x_{ij}\right] \\ &= B_{\text{total}} - \text{Cut capacity}(A, B) \end{aligned}
$$

Yielding a final alogorithm of:

$$
\begin{aligned} &\textbf{Algorithm: Software Porting via Min-Cut} \\ &\text{1. Construct flow network as described above} \\ &\text{2. Find minimum s-t cut using max-flow algorithm (e.g., Ford-Fulkerson)} \\ &\text{3. Let } S = \{i \in \{2, \dots, n\} : i \text{ is on s-side of min-cut}\} \\ &\text{4. Return } S \text{ as the set of applications to port} \end{aligned}
$$

With a time complexity of $O(mn^2)$ ( or $O(n^3)$ depending on maxflow algorithm), where m is num edges in the network.
