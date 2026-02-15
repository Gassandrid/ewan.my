---
title: Homework 10 Written
created_on: "[[11-13-2025]]"
author:
  - Ewan Pedersen
date: 2025-11-13
updated: 2025-11-15
abstract: Show the steps of deriving your answers. Points will be deducted for answers without adequate steps discussed. Submit your homework via Blackboard as one PDF or Word document.
---
---

## Flow Network: Concept

> 1. Define and explain the capacity property and the conservation property of a flow network.
>
> 		- The definition may use a formula for a given flow network $(V,E,s,t,f,c)$, where $V$ is the set of nodes, $E$ is the set of edges, $s \in V$ is the source node, $t \in V$ is the sink node, $f(e)$ is a function that returns the flow assigned to an edge $e \in E$, and $c(e)$ is a function that returns the capacity of an edge $e \in E$.
> 		- The explanation should state the intuitive meaning of the constraint specified by the property.
> 
> 2. State the key idea that enables the Ford-Fulkerson algorithm to remedy a wrong choice of augmenting flow in the flow network toward eventually finding a maximum flow.
> 3. Given a cut (A, B) in a flow network, (i) write the definition of the cut’s capacity and write how the capacity is calculated, and (ii) write the conditions required of edges crossing the cut if the cut is a minimum cut. Give your answers as intuitive statements without using equations.

### Capacity / Conservation Properties

We know we can define the capacity property for all edges $e \in E$ as satisfying the flow:

$$
0 \leq f(e) \leq c(e)
$$

This means that the capacity constraint ensures that flow on any given edge will not exceed a maximum capacity of said edge, and cannot be negative. It represents the absolute maximum threshhold like a constrained fluid pipe, where it can only handle so much per unit time.

We can define the conservation property for all nodes $v \in V \setminus \{ s,t \}$:

$$
\sum_{e\to v} f(e) = \sum_{e \leftarrow v} f(e)
$$

we can define this more formally by replacing $e$ into/out of with their respective ordered pairs in set $E$:

$$
\sum_{(u,v)\in E} f(u,v) = \sum_{(v,w)\in E}f(v,w)
$$

By the conservation property we can state that at every intermediate node, the total flow of said node must equal the total flow leaving the node. Flow cannot be created nor destroyed at intermediate nodes and thus what comes in must go out.

### Backward Edges for Ford Fulkerson

The big idea is that we can use the function of residual graphs that have backward edges as a method to repair wrong choices made.

When our algorithm makes a suboptimal flow decision along an edge, it can later be undone or reduced by sending flow backward along that edge. This can be defined by:

If we send $f(e)$ units along edge $e = (u,v)$ , our residual graph now includes that backward edge $(v,u)$ with residual capacity $f(e)$. Over the next few iterations, the algorithm can then find path improvements that use this backward ege, reducing the flow on the first edge.

In essence, the backward edges give the algorithm the flexibility to adjust earlier decisions without having to start over from scratch, similar to the idea of redirecting flow from the previous suboptimal path.

### Cuts for Flow Networks

We define the cut capacity for a given cut $(A,B)$ where $s \in A, t \in B, A \cup B = V,\text{ and } A \cap B=\emptyset$:

This cut $(A,B)$ is the sum of the capacities of all edges that go from the source side $A$ to the sink side $B$. Edges going in the reverse direction (from $B\to A$) are not counted in the capacity. We can then do the calculation by summing up $c(e)$ for all edges $e=(u,v)$ where $u \in A$ and $v \in B$.

This cut capacity represents the max total flow that could be achieved from crossing source to sink for this given partition.

For the **minimum cut condition**, we assume a cut $(A,B)$ is a minimum cut if and only if **all forward edges are saturated**(meaning every edge goin from $A$ to $B$ has a flow equal to its full capacity, no unused capacity) and **all backward edges carry zero flow**(meaning each edge going from $B$ to $A$ carries no flow at all).

A minimum cut is represented as a bottleneck in this network being pushed to its maximum limits. All paths through the cut are completely utilized in the forward directions, and there is zero flow going backwards through the cut (indication inneficiency). This cut has the smallest capacity among all possible cuts, and by the max-flow min-cut theorem, the value of the maximum flow equals this minimum cut capacity.

---

## Network Flow Ford-Fulkerson Algorithm Tracing

> Consider the flow network shown below (reformatted from Textbook Figure 7.26 in page 415). Run the Ford-Fulkerson algorithm to find the maximum flow and a minimum cut. Show the results of running the algorithm as specified below.
> 
> 1. Write the list of pairs of an augmenting path found (e.g., $s\to x\to y\to t$ ) and the flow amount augmented during the algorithm execution. For this exercise, choose augmenting paths in a non-increasing order of the bottleneck flow amount, that is, a path with the largest bottleneck first. 
> 2. Write the final (i.e., maximum) flow value on every edge in the flow network and also write the calculated max flow value and the min cut capacity. Additionally, draw a line showing the minimum cut across the flow network (see the lecture slide for an example). 
> 3. Draw the final residual graph with all the final residual capacities – both forward and backward – shown on the edges. Additionally, draw a line surrounding the nodes reached from the source node s at the end of the algorithm execution (see the demo slide for an example).
> 
> ![[Screenshot 2025-11-14 at 10.41.49 PM.png|Provided directed graph G]]

### Augmenting Paths

Running Ford-Fulkerson with paths selected by largest bottleneck flow:

$$
 \begin{align*} \text{Iteration 1: } &s \to b \to c \to t, \quad \text{flow} = 8 \\ &\text{Bottleneck: } \min(8, 10, 8) = 8 \\ \text{Iteration 2: } &s \to a \to t, \quad \text{flow} = 5 \\ &\text{Bottleneck: } \min(10, 5) = 5 \\ \text{Iteration 3: } &s \to d \to t, \quad \text{flow} = 5 \\ &\text{Bottleneck: } \min(5, 10) = 5 \\ \text{Iteration 4: } &s \to a \to c \to b \to d \to t, \quad \text{flow} = 3 \\ &\text{Bottleneck: } \min(5, 3, 8, 3, 5) = 3 \\ &\text{Note: Uses backward edge } c \to b \end{align*} 
$$

Yielding that no more augmenting paths exist.

### Maximum Flow and Minimum Cut

Final flow values:

$$
 \begin{align*} f(s \to a) &= 8 \\ f(s \to b) &= 8 \\ f(s \to d) &= 5 \\ f(b \to a) &= 0 \\ f(a \to c) &= 3 \\ f(b \to c) &= 5 \\ f(b \to d) &= 3 \\ f(a \to t) &= 5 \\ f(d \to c) &= 0 \\ f(d \to t) &= 8 \\ f(c \to t) &= 8 \end{align*} 
$$

Max flow value: **21**

We define the minimum cut with the following parameters: $Set \ A(source):s,a\quad Set\ B(sink):b,c,d,t$

Edges crossing the cut ($A \to B$): $s \to b$: capacity 8, $s \to d$: capacity 5, $a \to c$: capacity 3, $a \to t$: capacity 5

Minimum Cut Capacity: $8 + 5 + 3 + 5 = 21$

Flow Network with Minimum Cut: *see figure 2*

![[Screenshot 2025-11-14 at 11.14.56 PM.png|cut line for flow network]]

The cut separates nodes ${s, a}$ from ${b, c, d, t}$.

### Final Residual Graph

The residual graph shows remaining forward capacities and backward capacities: *see figure 3*, sorry for poor quality sketch as I was having difficulties wtih my conventional approach.

![[Screenshot 2025-11-14 at 11.19.11 PM.png|Final Residual Graph]]

**Residual Capacities (Forward/Backward):**

- Forward residuals: $s \to a$: 2, $b \to a$: 3, $b \to c$: 5, $d \to c$: 3, $d \to t$: 2
- Backward residuals (can reduce flow): $a \to s$: 8, $b \to s$: 8, $d \to s$: 5, $c \to a$: 3, $c \to b$: 5, $d \to b$: 3, $t \to a$: 5, $t \to d$: 8, $t \to c$: 8

**Nodes Reachable from S:**

In the final residual graph, starting from $s$ we can reach: $s$ (starting node), $a$ (via $s \to a$ with residual capacity 2)

No other notdes can be reached from $a$, ass all outgoing edges are thus saturated. Meaning our set of reachable nodes is:

$$
\{ s,a \}
$$

This confirms our minimum cut: the cut separates reachable nodes ${s, a}$ from unreachable nodes ${b, c, d, t}$.
