---
author:
  - Ewan Pedersen
date: 2025-09-09
updated: 2025-09-10
title: Homework 1 Written
class:
  - document
abstract: Show the steps of deriving your answers. Points will be deducted for answers without adequate steps discussed. Submit your homework via Blackboard as one PDF or Word document.
related:
  - "[[Adjacency List]]"
  - "[[Adjacency Matrix]]"
  - "[[Graphs#Alternative Representation]]"
---

---

## Adjacency Matrix and Adjacency List

Consider the directed graph shown below.

- Show both an adjacency matrix representation and an adjacency list representation of the graph. A node is not adjacent to itself unless there is a self-loop.

- For each of the adjacency matrix and adjacency list representation of the graph in the exercise a, write in pseudocode the algorithm of a function Find_all_edges that outputs all edges in the graph, and show its big-O run-time complexity – make sure to show the steps of deriving the run-time complexity; no point will be given to an answer without the steps.

![[Screenshot 2025-09-09 at 10.02.27 AM.png|Directed Graph Example]]

---

## Depth-first Search: Algorithm Tracing

Consider the recursive depth-first search algorithm, the graph, and its adjacency list representation shown below. Consider the nodes in a linked list of the adjacency list in the order from left to right exactly as shown. (Note that, at each recursive call, there can be only one possible node to be invoked upon, that is, the first node in the linked list.) Do algorithm tracing on the graph twice: once for the start node 2 and once for the start node 6, and show the tracing outputs for each. The tracing output should include the sequence of recursive calls and returns from those calls in the following format: “call DFS(a); call DFS(b); call DFS(c); return from DFS(c); call DFS(d); return from DFS(d); return from DFS(b); return from DFS(a)”. Additionally, show the depth-first search tree resulting from each run of the algorithm for the different start nodes; use the format shown in Figure 3.5(g) of the textbook (page 85). Note this is not a programming exercise but a written exercise.
