---
created_on: "[[10-29-2025]]"
class:
  - note
  - export
tags:
  - cs/theory/algorithms
source:
related:
author:
  - Ewan Pedersen
title: Homework 8 Written
date: 2025-10-29
updated: 2025-10-31
abstract: Show the steps of deriving your answers. Points will be deducted for answers without adequate steps discussed. Submit your homework via Blackboard as one PDF or Word document.
---
---

## Word Segmentation

> Do the textbook Exercise 5 in Chapter 6. Consider the optimal function and the quality function specified below:
>
> - Optimal function: $OPT(j)=$ the maximum quality achieved by segmenting a string $y_{1}y_{2}\dots y_{j}$
> - Quality function: $quality(i,j)=$ the quality of the string $y_{i}y_{i+1}\dots y_{n}$
>
> Give your answers as specified further below. Hint: optimal substructure of this problem is similar to that of the Segmented Least Squares problem.
>
> 1. Write the optimal substructure with an explanation. Make sure to include both the recursive case and the base case.
> 2. Write the memoized bottom-up dynamic programming code implementing the optimal substructure in executable pseudocode.
> 3. Write the run-time complexity of the implemented dynamic programming code in big-$O$ with a clear explanation of how the big-$O$ is formulated. Do a precise analysis of the run-time using the formula shown in the lecture slide"Segmented Lease Squares: Algorithm Running Time."

### 1. Optimal Substructure

For the **Recursive Case** $j\geq 1$:

$$
OPT(j)={max}_{1\leq i\leq j} \{ OPT(i-1)+quality(i,j) \}
$$

To find this optimal segmentation of string $y_{1}y_{2}\dots y_{j}$ we must look at all possible initial possitions that $i$ can take as the last word in the segmentation.

For each given choice of $i$, we note that the last word is $y_{i}y_{i+1}\dots y_{j}$, which holds quality of $quality(i,j)$. The rest of the prefix $y_{1}\dots y_{i-1}$ must be optimally segmented with quality $OPT(i-1)$, meaning the total quality is $OPT(i-1)+quality(i,j)$. Optimal segmentation is thus yielded when you take max over all valid choice of $i$.

For the **Base Case**, we know that $OPT(0)=0$, as an empty string has a quality of 0, meaning there is no words.

### Memorized Bottom Up Pseudocode

See _figure 1_ for the latex pseudocode algorithm, it may be on another page due to compilation quirks.

![[Screenshot 2025-10-31 at 6.01.13 PM.png|Pseudocode using dynamic programming]]

### Runtime Complexity Analysis

We know that the **Big-O Complexity** is $O(n^2)$:

We know that we compute $M[j]$ for all $j\in n$, and thus there are $n$ subproblems. For each subproblem, we iterate over all possible starting states $i\in \{ 1,2,..,j \}$, meaning for $M[j]$ we perform $j$ iterations where each iteration is $O(1)$. This yields the total big O complexity of $O(n^2)$.

---

## Knapsack: Algorithm Tracing with Bookkeeping

> Consider a knapsack problem with 3 items of weights 2,3, and 4 and values 1, 2, and 5, respectively, and the capacity of total weight 6.
>
> 1. Based on the optimal substructure shown below, trace the algorithm by filling in the memoization table (i.e., two-dimensional array $M[0..3, 0..6]$ below) according to the following specification.
>    - In each array entry $M[i,w]$, write the value of $OPT(i,w)$ in the order as shown in Figure 6.11 of the textbook
>    - In each array entry $M[i,w] (for \ i>0)$, also write whether the item $i$ is included in the solution or not. Write $y$ if included and $n$ if not. (This does not apply to the base case (i.i., i = 0) of the optimal substructure)
>    - The format of an entry is $\frac{o}{c}$, where $o$ is the optimal value and $c$ is either $y$ or $n$
> 2. Find the items selected as a solution by performig backtracking of the memoization table (filled in the step 1. above) starting from the last entry (i.e., $M[3,6]$). Specifically, in your answer:
>    1. write the sequence of array entries tracked (i.i., probed) backward until the base case is reached
>    2. write the resulting set of items selected
>       An example format of the answer is "Backtrack $M[3,6]$, $M[i_{1},w_{1}]$, $\dots$The resulting set of items selected is $\{ i_{3},i_{2} \}$"
>
> $$
 OPT(i,w)=\begin{cases}
 0 & if \quad i=0 \\
 OPT(i-1,w) & if \quad w_{i}>w \\
 max\{ OPT(i-1,w), v_{i}+OPT(i-1,w-w_{i}) \} & otherwise
 \end{cases}
 $$
>
> ![[Screenshot 2025-10-29 at 12.42.42 PM.png|Provided Values]]
> 
> ![[Screenshot 2025-10-29 at 12.43.14 PM.png|Memoization Table]]

### Memoization Table

| i/w   | 0   | 1   | 2   | 3   | 4   | 5   | 6   |
| ----- | --- | --- | --- | --- | --- | --- | --- |
| **0** | 0   | 0   | 0   | 0   | 0   | 0   | 0   |
| **1** | 0/n | 0/n | 1/y | 1/y | 1/y | 1/y | 1/y |
| **2** | 0/n | 0/n | 1/n | 2/y | 2/y | 3/y | 3/y |
| **3** | 0/n | 0/n | 1/n | 2/n | 5/y | 5/y | 6/y |

### Backtracking

Starting at point M[3,6], we check if item 3 is included (it is), then move to M[2,2]. At M[2,2], item 2 is not included, so we move to M[1,2]. At M[1,2], item 1 is included, leading us to M[0,0], the base case. Thus, the selected items are {1, 3}.
