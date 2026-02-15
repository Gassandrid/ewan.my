---
id: CH1 - Randomness
created_on: "[[01-13-2025]]"
aliases: []
tags:
  - math/probability/statistics
date: 2025-01-13
title: CH1 - Randomness
updated: 2025-06-21
---
Randomness refers to the inherent unpredictability of a sequence of events. In statistics, randomness is a key concept that underlies many statistical methods and procedures. Understanding randomness is essential for interpreting data and making informed decisions based on statistical analyses.

In this chapter, we will examine some concepts of randomsness: outcomes, events, and sample spaces.

---

## Outcomes, Events, and Sample Spaces

Look at the experiements/trials:

$$
Sample \ Space: \ \ \ S = \{set \ of \ all \ possible \ outcomes \}
$$

$$
Rolling \ Die: \ \ \to \{ 1,2,3,4,5,6 \}
$$

An **event** is a collection of some outcomes,

a **subject** of the **sample space**.

> [!Example]
> Let $D$ be the outcome of rolling the die and getting a 1:
>
> $$
> A = \{ 1 \}
> $$
>
> Let $E$ be the event of rolling an even number.
>
> $$
> E = \{ 2,4,6 \}
> $$
>
> Let $D$ be the event of rolling a number divisible by 3.
>
> $$
> D = \{ 3,6 \}
> $$

### Venn Diagram

Where every outcome $A$ is also an outcome of $B$ inside sample space $S$

```python-r
import matplotlib.pyplot as plt

fig, ax = plt.subplots()

sample_space = plt.Rectangle((-1.5, -1.5), 6, 6, fill=None, edgecolor='black', lw=2, label='S (Sample Space)')
ax.add_patch(sample_space)

circle_B = plt.Circle((2, 2), 2.5, color='blue', alpha=0.3, label='B')
ax.add_patch(circle_B)

circle_A = plt.Circle((2, 2), 1.5, color='red', alpha=0.5, label='A')
ax.add_patch(circle_A)

plt.text(2, 2.9, 'B', color='blue', fontsize=12, ha='center')
plt.text(2, 1.4, 'A', color='red', fontsize=12, ha='center')
plt.text(-1.4, 5.4, 'S (Sample Space)', fontsize=10)

ax.set_xlim(-2, 4)
ax.set_ylim(-2, 4)
ax.set_aspect('equal')

plt.title('Venn Diagram: A ⊆ B ⊆ S')
plt.legend(loc='upper right')

plt.show()
```

For brevity, won't include Venn diagram for each relation, but I will list a few of them:

### Relations of Events

And their included notation

#### De Morgan's Laws

Notation:

$$
A \cup B = A' \cap B' \\
$$

Abstract:

De Morgan's Laws are a pair of fundamental rules in set theory that describe how the union and intersection of sets are related. The first law states that the complement of the union of two sets is equal to the intersection of the complements of the sets. The second law states that the complement of the intersection of two sets is equal to the union of the complements of the sets.

---

## Applying What We Know So Far

> [!Example] > **Roll 1 die twice.**
>
> - Let $X$ be the $1^{st}$ roll
> - Let $Y$ be the $2^{nd}$ roll
>
> **Make a table**
>
> | 11  | 12  | 13  | 14  | 15  | 16  |
> | --- | --- | --- | --- | --- | --- |
> | 21  | 22  | 23  | 24  | 25  | 26  |
> | 31  | 32  | 33  | 34  | 35  | 36  |
> | 41  | 42  | 43  | 44  | 45  | 46  |
> | 51  | 52  | 53  | 54  | 55  | 56  |
> | 61  | 62  | 63  | 64  | 65  | 66  |
>
> This yields **36** possible outcomes.
>
> Let $X+Y$ be the sum of the 2 rolls:
>
> $$
> S = \{ 2,3,4,5,6,7,8,9,10,11,12 \}
> $$
>
> We let $F$ be the event that the sum of the 2 rolls equals 4.
>
> $$
> F = \{  31,22,13 \} = \{ XY | X+Y=4 \}
> $$
>
> Let $T$ be the event that $Y=3$
>
> $$
> T = \{ XY | Y = 3 \} = \{ 13,23,33,43,53,63 \}
> $$
>
> Let $G$ be the event that $X$ is greater than $2Y$.
>
> $$
> G = \{ XY | X > 2Y \} = \{  31,41,51,61, 52, 62 \}
> $$

---

## Playing Angry Birds

Say you are playing the famous and fun game **Angry birds**. Let's say that for this case:

- $W$ = win
- $L$ = lose

Every time you lose, you have to start over from the beggning.

Consider the event that you win in less than $1000$ times:

Here, we can see that the sample space is infinite, and the event that you win in less than $1000$ times is a finite event.
