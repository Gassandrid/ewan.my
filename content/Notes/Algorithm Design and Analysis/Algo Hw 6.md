---
date: 2025-10-17
updated: 2025-10-17
title: Homework 6 Written
author:
  - Ewan Pedersen
abstract: Show the steps of deriving your answers. Points will be deducted for answers without adequate steps discussed. Submit your homework via Blackboard as one PDF or Word document.
---

---

## Counting Inversion: Algorithm Tracing

> Consider the counting inversion algorithm. Sort-and-Count studied in class and shown below.
> 
> ![[Screenshot 2025-10-17 at 10.55.49 AM.png|Sort-and-Count inversion algorithm]]
> 
> Run this algorithm against the input file shown below, and: 
> 
> 1. Show the recursion tree during the divide phase and the conquer & combine phase, respectively, and 
> 2. Show each returned result as the pair of the inversion count and the sorted result (e.g., “(1, {4, 6})”) exactly in the order of execution. If the input array has an odd number of elements, the left half contains one fewer element than the right half. See the example recursion trees below.
> 
> Input file:
>
> $$

  \{ 7,3,11,12,9,6,2,10,8,4,5,1 \} 

 $$
>
> Example *Recursion tree* for an input file:
$$

 \{ 6,4,2,3 \}

$$
### 1. Divide and Conquer Phase Diagrams

*See Figure 2 and Figure 3(may be on a separate page due to LaTeX compilation bs*


![[Screenshot 2025-10-17 at 12.01.27 PM.png|Divide Phase Diagram]]

![[Screenshot 2025-10-17 at 12.02.50 PM.png|Conquer Phase Diagram]]

### 2. Returned Results in Execution Order


$$

\begin{align*}

\text{Step 1:} \quad & (0, \{7\}) \\

\text{Step 2:} \quad & (0, \{3\}) \\

\text{Step 3:} \quad & (0, \{11\}) \\

\text{Step 4:} \quad & (0, \{3, 11\}) \\

\text{Step 5:} \quad & (1, \{3, 7, 11\}) \\

\text{Step 6:} \quad & (0, \{12\}) \\

\text{Step 7:} \quad & (0, \{9\}) \\

\text{Step 8:} \quad & (0, \{6\}) \\

\text{Step 9:} \quad & (1, \{6, 9\}) \\

\text{Step 10:} \quad & (3, \{6, 9, 12\}) \\

\text{Step 11:} \quad & (7, \{3, 6, 7, 9, 11, 12\}) \\

\text{Step 12:} \quad & (0, \{2\}) \\

\text{Step 13:} \quad & (0, \{10\}) \\

\text{Step 14:} \quad & (0, \{8\}) \\

\text{Step 15:} \quad & (1, \{8, 10\}) \\

\text{Step 16:} \quad & (1, \{2, 8, 10\}) \\

\text{Step 17:} \quad & (0, \{4\}) \\

\text{Step 18:} \quad & (0, \{5\}) \\

\text{Step 19:} \quad & (0, \{1\}) \\

\text{Step 20:} \quad & (1, \{1, 5\}) \\

\text{Step 21:} \quad & (2, \{1, 4, 5\}) \\

\text{Step 22:} \quad & (10, \{1, 2, 4, 5, 8, 10\}) \\

\text{Step 23:} \quad & (44, \{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12\})

\end{align*}

$$

---

## Divide and Conquer: Majority Equivalence Class

> Do Textbook Exercise 3 in Chapter 5. Note that the problem of finding a set of more than half the bank cards that correspond to the same account can be reduced to finding a majority equivalence class, that is, an equivalence class that contains more than half the set elements (i.e., bank cards). Assume that the equivalence tester requires two cards to give a test result. Give your answers as specified below.
> 
> 1. [Property] Prove the property that if there exists a majority equivalence class in the set of size n then at least one of the two halves (each of size n/2) has a majority equivalence class. Suggested proof technique: proof by contradiction.
> 2. [Algorithm] Based on the proven property, write an executable pseudocode of the recursive algorithm designed using the divide-and-conquer approach. Name the algorithm “MajEC”. Hint: divide the set of bank cards into two halves and call the algorithm recursively on each half.
> 3. [Run-time] Write a recurrence relation expressing the run-time T(n) of the recursive algorithm, and solve it to derive the run-time in big-O; it suffices to derive the closed functional form of the run-time and do not prove the big-O formally. The recurrence relation should have both recursive cases and base cases. Either the recursion tree technique or the telescoping technique can be used to derive the closed functional form. If the recurrence relation is one we have already solved in class, it is sufficient to refer to it without solving it again.
