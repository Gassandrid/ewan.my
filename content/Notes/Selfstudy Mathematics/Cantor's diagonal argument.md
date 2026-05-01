---
date: 2026-03-19T10:41:09-04:00
updated: 2026-03-19T10:53:17-04:00
tags:
  - math/sets
class:
  - note
source:
related:
author:
description:
aliases:
---

one of my favorite proofs, also from my favorite chapter of [[Gödel, Escher, Bach]].

say you supposedly have a set of all irrational numbers, some thing like the following;

| $\mathbb{N}$ | $\mathbb{R}$  |
| :----------: | :------------ |
|      1       | 0.**5**823748 |
|      2       | 0.8**5**83252 |
|      3       | 0.37**4**9182 |
|      4       | 0.928**4**756 |
|      5       | 0.1472**9**38 |
|      6       | 0.63821**9**4 |
|      7       | 0.858325**2** |
|     ...      | ...           |
|    **n**     | 0.386276**7** |

we can construct **n**, a number that doesnt exist in the set of all irrationals by:

1. start first column of first row, and choose a number that is NOT that number
2. second column second for, choose a number that is NOT that number
3. repeat until the end of the list
4. you have a new item $n$ that is NOT in the list

if you add it to the list, you can now construct another $n$ that still isnt in the list	.
