---
date: 2026-02-09T08:54:07-05:00
updated: 2026-02-09T09:02:18-05:00
---

Decision Trees are known for producing robust, *interpreable* cateogories/splits in which data is classified.

![[decTree.png]]

Here, the top box is the **root node**, containing all the data.

Any nodes at the very bottom are considered the **leaves**. Any in between are called *split nodes*.

## GINI Impurity

$$
G_{i} = 1 - \sum_{k=1}^{N}  p^{2}_{i,k}
$$

**Where**:
- $G_{i}$ is the impurity of the $i^{th}$ node
- $p_{i,k}$ is the ration of class $k$ instances among the training instances in the $i^{th}$ node

If there are two classes in the $i^{th}$ node and 100 instances, then:

$$
G_{i}=1- \left( \frac{x}{100} \right)^{2} - \left( \frac{100-x}{100} \right)^{2}
$$
