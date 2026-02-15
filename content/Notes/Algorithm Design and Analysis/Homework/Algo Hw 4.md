---
date: 2025-10-03
created_on: "[[10-03-2025]]"
updated: 2025-10-03
class:
  - note
  - export
tags:
  - cs/theory/algorithms
source:
related:
author:
  - Ewan Pedersen
title: Homework 4 Written
abstract: Show the steps of deriving your answers. Points will be deducted for answers without adequate steps discussed. Submit your homework via Blackboard as one PDF or Word document.
---
---

## Minimum Max-lateness Job Scheduling

> Consider the four jobs ($Job i, i = 1, 2, 3, 4$) in the table below, where $t_{i}$ is the processing time and $d_{i}$ is the deadline of each Job $i$. Show a job schedule that is optimal but does not follow the earliest-deadline-first strategy and contains at least one adjacent inversion. Then, repeatedly remove inversions until we have an optimal schedule that can be generated using the earliest-deadline-first strategy. Show the job schedule after removing each inversion.
>  
> ![[Screenshot 2025-10-03 at 7.20.49 PM.png|Job Schedule]]

Getting the obvious out of the way, we know the earliest-deadline-first strategy would yield:

$$
Job \ 1 \to Job \ 2 \to Job \ 3 \to Job \ 4
$$

Let's start with an optimal scheule by use of inversions and then remove them one at a time:

$$
\underbrace{ Job \ 2 \to Job \ 3 \to Job \ 1 \to Job \ 4 }_{ \text{starting schedule} }
$$

To verify that this an an optimal scheduling we can verify the jobs are completed before their deadline(*assume list number represents job #*):

1. completes with a time of $3+3 = 6$, where deadline is $6$
2. completes at time $2$, where deadline is $8$
3. completes at time $2+1=3$, where deadline is $9$
4. completes at time $6+4 = 10$, where deadline is $11$

No lateness, so it is optimal.

We now check for adjacent inversions $Job_{2}\to Job_{3}, Job_{3} \to Job_{1}, Job_{1}\to Job_{4}$:

$Job_{2}$ with $Job_{3}$ has no inversion since $8<9$. $Job_{3}$ with $Job_{1}$ **does have inversion** as $9>6$. $Job_{1}$ with $Job_{4}$ does not have inversion as $6<11$

We remove inversion by swapping $Job_{3}$ and $Job_{1}$, yielding:

$$
Job_{2} \to Job_{1} \to Job_{3} \to Job_{3} 
$$

Verifying again:

1. completes with a time of $2+3=5$, where deadline is $6$
2. completes at time $2$, where deadline is $8$
3. completes at time $5+1=6$, where deadline is $9$
4. completes at time $6+4 = 10$, where deadline is $11$

Next inversions for $Job_{2}\to Job_{1}, Job_{1} \to Job_{3}, Job_{3}\to Job_{4}$:

$Job_{2}$ with $Job_{1}$ **does have inversion** as $8>6$. $Job_{1}$ with $Job_{3}$ does not have inversion as $6<9$. $Job_{3}$ with $Job_{4}$ does not have inversion as $9>11$.

We remove inversion by swapping $Job_{2}$ and $Job_{1}$, yielding:

$$
Job_{1} \to Job_{2} \to Job_{3} \to Job_{4} 
$$

We could verify, but we have now reached the earliest deadline first schedule and the deadlines are ordered.

---

## Dijkstra’ Algorithm Tracing

> Show the tracing of executing Dijkstra’s single-source shortest paths algorithm given below on the undirected graph given below. (We discussed this algorithm implementation in class.)
>
> ![[Screenshot 2025-10-03 at 7.40.16 PM.png|Dikstra's Algorithm Pseudocode (left) and undirected graph example (right)]]

*apologies if I did the drawing process incorrectly, I didnt understand the directions perfectly. I made one mistake merging two iterations together, but difficult to recover/fix unforunately.*

### Starting Point S

![[Screenshot 2025-10-03 at 8.03.58 PM.png|Iteration 1]]

![[Screenshot 2025-10-03 at 8.05.37 PM.png|Iteration 2]]

![[Screenshot 2025-10-03 at 8.07.27 PM.png|Iteration 3]]

![[Screenshot 2025-10-03 at 8.08.50 PM.png|Iteration 4]]

I skipped an iteration here by accident - cant fix easily, they were merged

![[Screenshot 2025-10-03 at 8.09.18 PM.png|Iteration 5]]

### Starting Point Z

![[Screenshot 2025-10-03 at 8.11.32 PM.png|Iteration 1]]

![[Screenshot 2025-10-03 at 8.14.17 PM.png|Iteration 2]]

![[Screenshot 2025-10-03 at 8.17.53 PM.png|Iteration 3]]

![[Screenshot 2025-10-03 at 8.20.16 PM.png|Iteration 4]]

![[Screenshot 2025-10-03 at 8.20.53 PM.png|Iteration 5]]

![[Screenshot 2025-10-03 at 8.21.11 PM.png|Iteration 6]]
