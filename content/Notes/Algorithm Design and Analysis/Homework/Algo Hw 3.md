---
id: Algo Hw 3
aliases: []
tags:
  - cs/theory/algorithms
abstract: Show the steps of deriving your answers. Points will be deducted for answers without adequate steps discussed. Submit your homework via Brightspace as one PDF or Word document.
author:
  - Ewan Pedersen
date: 2025-09-26
title: Homework 3
updated: 2025-10-29
class:
  - note
  - export
---

---

## Circular Interval Scheduling

> Textbook Exercise 17 in Chapter 4. In your answer, write:
>
> 1. the pseudocode of an executable algorithm
> 2. the analysis of the running time complexity
> 3. proof of the optimality of the algorithm
>
> Your algorithm, CircIntvlSched, can call IntvlSched shown below if and as needed. Consider the implementation of IntvlSched that has the running time complexity O(n logn). The proof of optimality is trivial from the optimality of IntvlSched; consider the optimality of IntvlSched already proven.

![[Screenshot 2025-09-26 at 1.52.55 PM.png|Given IntvlShed algorithm]]

### Pseudocode

See _Figure 2_ below(may be on another page). Created using the _LaTeX_ packages **algorithm**, **algpseudocode**, and **amsmath**.

![[algohw3pseudocode.png|Pseudocode for CircIntvlSched (sorry for buggy pseudocode, issues with latex compiler)]]

### Time Complexity

Let's let $n$ be a number of jobs.

For each anchor $j$ we have (with $n$ choices), we test $j$ with job $k$, this is $O(n)$ as the overlap tests are only $O(1)$

Mapping the compatibility list is $O(n)$.

Calling `IntvlSched` on LinearList has worst case possibility of $O(n)$, and we know that `IntvlShed` is $O(n \log n)$.

Given that every anchor iteration is $O(n + n \log n)$, and since we repeat for n anchors this is $O(n^2 \log n)$.

Space complexity is $O(n)$ overall, for the linear list.

### Proof of Optimality

Lets say OP is the optimal set for mutually non-overlapping jobs on this circular schedule. If we assume $OP = \emptyset$ then algorithm returns $\emptyset$ and it is guaranteed correct.

For alternative case, we will consider when $anchor=a$. Using construction:

1. remove all other jobs that overlap on $a$ (only those that can be scheduled with $a$ remain)
2. make a cut on the circular schedule, $cut=e[a]$, then map remaining jobs into the linear 24 hour window. We cut at the end of $a$, so no remaining jobs are on the cut.
3. now, our optimal schedule $OP$(without a) has a mapping to a set of linear intervals with no overlap.

Given that `IntvlSched` is optimal for linear scheduling, we know that it returns a max size set for all sets of compatible jobs that do not overlap over $a$.

This means that the return set on this anchor is at least $|OP_{a} + 1| = |OP|$, meaning the algorithm will find a schedule with a size that is at least the size of $OP$. And given that $OP$ is optimal, so is the algorithm schedule.

---

## Interval Partitioning: Greedy Strategies

> Consider the IntvlPart greedy algorithm with the earliest start time first strategy we discussed in class (pseudocode shown below), and consider the following three alternative greedy strategies:
>
> 1. Earliest finish time first – consider lectures in ascending order of finish time f(j)
> 2. Shortest interval first – consider lectures in ascending order of interval length, f(j) – s(j)
> 3. Fewest conflicts first – for each lecture, count the number of conflicting lectures; then, consider lectures in ascending order of the number of conflicts.
>
> For each of these three greedy strategies, either prove or disprove if it is an optimal greedy strategy. If you want to prove it, use a proof technique of your choice (e.g., induction, contradiction, construction) and name the used proof technique at the beginning of the proof. If you want to disprove it, it suffices to provide a counterexample and state what the greedy strategy finds as a solution and what a true optimal solution is. For simplicity, your counterexample should contain as few lectures as you can find. Hint: remember we used a structural bound called “depth”, which denotes the largest number of intervals overlapping at any time.
>
>  ![[Screenshot 2025-09-26 at 4.53.42 PM.png]]

### Earliest Finish time First

Seek to **disprove** using **counterexample**:

First, we look at the given lectures $s(1)\dots s(n)$, in this case, $A\dots D$:

$$
\begin{align*}
A = \{ 0,1 \}\\
B = \{  0,2 \} \\
C = \{  1,4 \}\\
D = \{ 2,3 \}
\end{align*}
$$

The depth is 2 given max overlapping intervals, meaning that any optimal choice will use 2.

We then order by finish time, so $A(0,1), B(0,2), D(2,3), C(1,4)$

Then run greedy partitioning:

- $A(0,1) \to Room_{1} \to lastFin(Room_{1})=1$
- $B(0,2)\to 0 < 1: Room_{2} \to lastFin(Room_{2})=2$
- $D(2,3)\to 2\geq 2(\text{lastFin is Room1})\to D.start=2 \geq Room_{1}.lastFin=1\to lastfin(Room_{1})=3$
- $C(1,4)\to lastFin(Room_{2})(\text{meaning cant used as C.start=1}) \to create Room_{3}$

This finish time order uses 3 rooms and not 2, so this is not optimal.

### Shortest Interval First

Seek to **disprove** using **counterexample**:

Given two Lectures $X=\{ 0,2 \}$ and $Y=\{ 2,3 \}$, length 2 and 1 respectively, and their depth being 1 so optimal path needs `1` room.

Then we order by interval length,  so $Y$ then $X$.

Run greedy partitioning:

- $Y\{ 2,3 \}\to Room_{1} \to lastFin=3$
- $X\{ 0,2 \}\to X.start=0<lastFin(Room_{1})=3 \to can't \ use \ room_{1} \to Room_{2}$

This yields 2 rooms with greedy partitioning, when the optimal is 1, and is thus not optimal.

### Fewest Conflicts First

Seek to **disprove** using **counterexample**:

Given $A,B,C$:

$$
\begin{align*}
A = \{ 0,1 \}\\
B=\{ 0,2 \}\\
C = \{ 2,3 \}
\end{align*}
$$

And the conflicts that come with it:

- $A \to conflict \to B \to conflicts(A)=1$
- $B \to conflict \to A \to conflicts(B)=1$
- $C \to conflict \to \emptyset \to conflicts(C)=o$

Resulting in a depth of 2 as B/A overlap. Optimal is 2 rooms.

Run greedy partitioning:

- $C\{ 2,3 \}\to room_{1}\to lastFin=3$
- $A\{ 0,1 \}\to A.start=0<lastFin(Room_{1})=3\to can't \ room_{1}\to Room_{2} \ lastFin=1$
- $B\{ 0,2 \}\to lastFin(Room_{2})=1, B.start=0<1\to can't \ room_{2}\to  \ lastFin(Room_{1})=3>0\to cant room_{1}\to Room_{3}$

This yields 3 rooms when the optimal is 2, therefore fewest conflicts is not an optimal algorithm.
