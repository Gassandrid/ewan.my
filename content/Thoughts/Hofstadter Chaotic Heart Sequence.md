---
date: 2026-01-16T09:56:10-05:00
created_on: "[[01-16-2026]]"
updated: 2026-01-16T11:08:44-05:00
class:
  - note
tags:
  - books/geb
  - math/logic
  - cs/python
source:
related:
author:
description:
aliases:
jupyter:
  jupytext:
    cell_metadata_filter: -all
    formats: ipynb,md
    text_representation:
      extension: .md
      format_name: markdown
      format_version: '1.3'
      jupytext_version: 1.18.1
  kernelspec:
    display_name: Python 3
    language: python
    name: python3
---
Saw this sequence from **Simone Conradi** on twitter:

![](https://x.com/S_Conradi/status/1999588652255416630)

Havent heard of the sequence in [[Gödel, Escher, Bach]] yet, but it is interesting to see the recursive visuals [[Douglas Hofstadter]] seems to be known for.

I believe it comes up in the book as something to do with Hofstadter's [[Hofstadter Q sequence]], will have to do some more tinkering to find out.

Attempted to recreate:

```python
import numpy as np
import matplotlib.pyplot as plt
from functools import lru_cache


@lru_cache(maxsize=None)
def Q(n):
    if n == 1:
        return 2
    elif n == 2:
        return 2
    elif n == 3:
        return 1
    elif n > 3:
        return Q(n - Q(n - 1)) + Q(n - Q(n - 2))
    else:
        return 0


@lru_cache(maxsize=None)
def a(n):
    if n == 1:
        return 1
    elif n == 2:
        return 1
    elif n == 3:
        return 2
    elif n > 3:
        return a(a(n - 1)) + a(n - a(n - 1))
    else:
        return 0


n_max = 1000000
n_values = []
diff_values = []

batch_size = 50000
for i in range(1, n_max + 1):
    n_values.append(i)
    diff_values.append(a(i) - Q(i))

    if i % batch_size == 0:
        print(f"  Computed {i:,} / {n_max:,} values...")

fig, ax = plt.subplots(figsize=(12, 10))
ax.scatter(n_values, diff_values, c="#E91E63", s=0.1, alpha=0.3, rasterized=True)
ax.set_title(
    "The Hofstadter Chaotic Heart Sequence $a(n) - Q(n)$",
    fontsize=16,
    fontweight="bold",
    pad=20,
)
ax.set_xlabel("$n$", fontsize=14)
ax.set_ylabel("$a(n) - Q(n)$", fontsize=14)
ax.grid(True, alpha=0.2, linewidth=0.5)
ax.set_facecolor("#F5F5F0")
fig.patch.set_facecolor("white")
plt.show()
```
