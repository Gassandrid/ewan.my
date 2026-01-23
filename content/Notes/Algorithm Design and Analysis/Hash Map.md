---
class:
  - note
  - lectureNote
  - definition
tags:
  - university
  - cs/theory/structure
course: "[[Algorithm Design and Analysis]]"
lesson:
  - external
lecture-number: 3
source:
related:
date: 2025-09-02
updated: 2025-09-02
---

A **hash map** (also known as a hash table) is a data structure that implements an associative array, a structure that can map keys to values. It uses a hash function to compute an index (or hash code) into an array of buckets or slots, from which the desired value can be found.

The hash function is an efficient way to convert a given key into an integer index. The quality of the hash function is crucial for the performance of the hash map, as it affects how evenly the keys are distributed across the buckets.

![[Pasted image 20250902102836.png]]
