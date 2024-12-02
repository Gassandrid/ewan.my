---
title: Finding The Total Number of Printer Combinations
date: 2024-11-28
author: Ewan / Gassandrid
---

> **Abstract**

> We are presented with a problem of a "printer" which takes a combination of short and long "pulses", similar to that of Morse code, to output a desired sheet of material. We are given 10 "spaces" to enter our code, however the long pulse takes up 2 spaces on this theoretical space budget.

---

> **Problem Statement**  

> Consider a sequence formed by two types of symbols:  
> - A **short symbol** $S$, which takes 1 unit of space.  
> - A **long symbol** $L$, which takes 2 units of space.  
>   
> The total available space for the sequence is at most 10 units. Determine the total number of distinct sequences of $S$ and $L$ that can be formed, accounting for sequences of lengths ranging from 1 to 10 units under the following constraints:  
> 1. A sequence may include at most $k$ long symbols, where $2k \leq n$, and $n$ is the sequence's total length.  
> 2. The remaining space after placing $k$ long symbols is filled with short symbols.

---

## Solution

### Step 1: General Setup

For a sequence of total length $n$, where $1 \leq n \leq 10$:

- Each long symbol $L$ takes 2 units of space. If $k$ is the number of long symbols, they consume $2k$ units of space.
- The remaining space, $n - 2k$, is filled with short symbols $S$. Since each short symbol takes 1 unit of space, the number of short symbols is $n - 2k$.
- The total number of symbols in the sequence is $k + (n - 2k) = n - k$.

The number of ways to arrange $k$ long symbols $L$ and $n - 2k$ short symbols $S$ is given by the binomial coefficient:

$$
\binom{n-k}{k}.
$$

### Step 2: Constraints on $k$ for a Fixed $n$

For a fixed sequence length $n$, the number of long symbols $k$ must satisfy:

$$
2k \leq n \quad \text{or equivalently} \quad k \leq \lfloor n / 2 \rfloor.
$$

Thus, for each $n$, $k$ ranges from 0 to $\lfloor n / 2 \rfloor$.

The total number of sequences for a fixed $n$ is:

$$
\sum_{k=0}^{\lfloor n/2 \rfloor} \binom{n-k}{k}.
$$

### Step 3: Summing Over All Possible $n$

To account for all possible sequence lengths, we sum over all $n$ from 1 to 10:

$$
\text{Total combinations} = \sum_{n=1}^{10} \sum_{k=0}^{\lfloor n/2 \rfloor} \binom{n-k}{k}.
$$

---

## Step-by-Step Calculation

We compute the total number of sequences for each $n$ and $k$:

### For $n = 1$:

- $k = 0$: Only 1 short symbol.

  $$
  \binom{1}{0} = 1
  $$

**Total for $n = 1$: $1$**

---

### For $n = 2$:

- $k = 0$: 2 short symbols.

  $$
  \binom{2}{0} = 1
  $$

- $k = 1$: 1 long symbol.

  $$
  \binom{1}{1} = 1
  $$

**Total for $n = 2$: $1 + 1 = 2$**

---

### For $n = 3$:

- $k = 0$: 3 short symbols.

  $$
  \binom{3}{0} = 1
  $$

- $k = 1$: 1 long symbol and 1 short symbol.

  $$
  \binom{2}{1} = 2
  $$

**Total for $n = 3$: $1 + 2 = 3$**

---

### For $n = 4$:

- $k = 0$: 4 short symbols.

  $$
  \binom{4}{0} = 1
  $$

- $k = 1$: 1 long symbol and 2 short symbols.

  $$
  \binom{3}{1} = 3
  $$

- $k = 2$: 2 long symbols.

  $$
  \binom{2}{2} = 1
  $$

**Total for $n = 4$: $1 + 3 + 1 = 5$**

---

### For $n = 5$:

- $k = 0$: 5 short symbols.

  $$
  \binom{5}{0} = 1
  $$

- $k = 1$: 1 long symbol and 3 short symbols.

  $$
  \binom{4}{1} = 4
  $$

- $k = 2$: 2 long symbols and 1 short symbol.

  $$
  \binom{3}{2} = 3
  $$

**Total for $n = 5$: $1 + 4 + 3 = 8$**

---

### For $n = 6$:

- $k = 0$: 6 short symbols.

  $$
  \binom{6}{0} = 1
  $$

- $k = 1$: 1 long symbol and 4 short symbols.

  $$
  \binom{5}{1} = 5
  $$

- $k = 2$: 2 long symbols and 2 short symbols.

  $$
  \binom{4}{2} = 6
  $$

- $k = 3$: 3 long symbols.

  $$
  \binom{3}{3} = 1
  $$

**Total for $n = 6$: $1 + 5 + 6 + 1 = 13$**

---

### For $n = 7$:

- $k = 0$: 7 short symbols.

  $$
  \binom{7}{0} = 1
  $$

- $k = 1$: 1 long symbol and 5 short symbols.

  $$
  \binom{6}{1} = 6
  $$

- $k = 2$: 2 long symbols and 3 short symbols.

  $$
  \binom{5}{2} = 10
  $$

- $k = 3$: 3 long symbols and 1 short symbol.

  $$
  \binom{4}{3} = 4
  $$

**Total for $n = 7$: $1 + 6 + 10 + 4 = 21$**

---

### For $n = 8$:

- $k = 0$: 8 short symbols.

  $$
  \binom{8}{0} = 1
  $$

- $k = 1$: 1 long symbol and 6 short symbols.

  $$
  \binom{7}{1} = 7
  $$

- $k = 2$: 2 long symbols and 4 short symbols.

  $$
  \binom{6}{2} = 15
  $$

- $k = 3$: 3 long symbols and 2 short symbols.

  $$
  \binom{5}{3} = 10
  $$

- $k = 4$: 4 long symbols.

  $$
  \binom{4}{4} = 1
  $$

**Total for $n = 8$: $1 + 7 + 15 + 10 + 1 = 34$**

---

### For $n = 9$:

- $k = 0$: 9 short symbols.

  $$
  \binom{9}{0} = 1
  $$

- $k = 1$: 1 long symbol and 7 short symbols.

  $$
  \binom{8}{1} = 8
  $$

- $k = 2$: 2 long symbols and 5 short symbols.

  $$
  \binom{7}{2} = 21
  $$

- $k = 3$: 3 long symbols and 3 short symbols.

  $$
  \binom{6}{3} = 20
  $$

- $k = 4$: 4 long symbols and 1 short symbol.

  $$
  \binom{5}{4} = 5
  $$

**Total for $n = 9$: $1 + 8 + 21 + 20 + 5 = 55$**

---

### For $n = 10$:

- $k = 0$: 10 short symbols.

  $$
  \binom{10}{0} = 1
  $$

- $k = 1$: 1 long symbol and 8 short symbols.

  $$
  \binom{9}{1} = 9
  $$

- $k = 2$: 2 long symbols and 6 short symbols.

  $$
  \binom{8}{2} = 28
  $$

- $k = 3$: 3 long symbols and 4 short symbols.

  $$
  \binom{7}{3} = 35
  $$

- $k = 4$: 4 long symbols and 2 short symbols.

  $$
  \binom{6}{4} = 15
  $$

- $k = 5$: 5 long symbols.

  $$
  \binom{5}{5} = 1
  $$

**Total for $n = 10$: $1 + 9 + 28 + 35 + 15 + 1 = 89$**

---

## Final Total

Summing all sequences:

$$
1 + 2 + 3 + 5 + 8 + 13 + 21 + 34 + 55 + 89 = 231
$$

**Final Answer: 231 distinct sequences.**