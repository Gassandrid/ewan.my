---
id: CH1 - DeMorgan's In Detail
aliases: []
tags:
  - math/probability/statistics
date: 2025-01-15
title: CH1 - DeMorgan's In Detail
updated: 2025-06-21
---

Just as a refresher:

$$
\begin{align*}
(A \cup B)^C = A^C \cap B^C \\
(A \cap B)^C = A^C \cup B^C
\end{align*}
$$

In general, for a finite/infinite collection of events $A_{1},A_{2}, \dots, A_{n}$ :

$$
(U_{j}A_{j})^C = N_{j}(A_{j}^C)
$$

---

## Commutativity, Associativity, and Distributive

**Commutativity:**

The law of commutativity states that the order of the sets in a union or intersection does not matter.

$$
A \cup B = B \cup A
$$

$$
A \cap B = B \cap A
$$

**Associativity:**

The law of associativity states that the grouping of sets in a union or intersection does not matter.

$$
(A \cup B) \cup C = A \cup (B \cup C)
$$

$$
(A \cap B) \cap C = A \cap (B \cap C)
$$

**Distributive:**

The law of distributive states that the union and intersection operations distribute over each other.

$$
A \cap (B \cup C) = (A \cap B) \cup (A \cap C)
$$

$$
A \cup (B \cap C) = (A \cup B) \cap (A \cup C)
$$

---

## Example

> [!Example]
> A power cell consists of two subcells, each of which can provide from 0 to 5 volts, regardless f what the other subcell provides, The power cell ins functional if and only if the sum of the two voltages of the subcells is at least 6 volts. An experiment consists of measuring and recording the voltages of the 2 subcells.

_Let X be the voltage of the first subcell

Let Y be the voltage of the second subcell._

**What is the sample space?**

We can find the sample space by listing all possible outcomes of the experiment. Since each subcell can provide from 0 to 5 volts, the sample space is:

$$
S = \{ (x,y) | 0 \leq x \leq 5 \ \ AND \ \ 0 \leq y \leq 5 \}
$$

**Let A be the event that the power cell is functional. Define A.**

We can find a by listing all the outcomes in which the power cell is functional. The power cell is functional if and only if the sum of the two voltages is at least 6 volts. Therefore, the event A is:

$$
A = \{  \left. (x,y) \in S \right| x+y \geq 6 \}
$$

**Let B be the event that two subcells have the same voltage. Define B.**

We can find B by listing all the outcomes in which the two subcells have the same voltage. Therefore, the event B is:

$$
B = \{  (x,y) \in S | x=y \}
$$

**Let C be the event that the first subcell has a strict higher voltage than the second. Define C**

We can find C by listing all the outcomes in which the first subcell has a higher voltage than the second. Therefore, the event C is:

$$
C = \{  (x,y) \in S: x > y\}
$$

**Let D be the event that the power cell is not functional but needs less than one additional volt to become functional.**

We can find D by listing all the outcomes in which the power cell is not functional but needs less than one additional volt to become functional. Therefore, the event D is:

$$
D = \{  (x,y) \in S : 5 < x+y < 6 \}
$$
