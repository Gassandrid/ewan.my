---
date: 2025-01-23
updated: 2025-03-27
title: Lab 01
---

Given the following formal definition of a finite automaton, M2M2​, produce a complete state diagram.

M2= ({q1,q2,q3,q4,q5},{l,r},δ,q2,{q1})M2​=({q1​,q2​,q3​,q4​,q5​},{l,r},δ,q2​,{q1​}) where δδ is given by

|     | l   | r   |     |
| --- | --- | --- | --- |
| q1​ | q2  | q3  |     |
| q2  | q1  | q4  |     |
| q3  | q1  | q2  |     |
| q4  | q3  | q1  |     |
| q5  | q4  | q5  |     |
|     |     |     |     |

```mermaid
graph LR
    q2((q2)) --> |l| q1((q1))
    q2 --> |r| q4((q4))
    q1 --> |l| q2
    q1 --> |r| q3((q3))
    q3 --> |l| q1
    q3 --> |r| q2
    q4 --> |l| q3
    q4 --> |r| q1
    q5((q5)) --> |l| q4
    q5 --> |r| q5

    style q2 fill:#f9f,stroke:#333,stroke-width:2px
    style q1 fill:#bbf,stroke:#333,stroke-width:2px,double
```

---

## Problem 3

Give state diagrams for the following languages. IN all parts, the alphabet is $\{ 0,1 \}$

### A

$$
\{ w|w \ begins \ with \ a \ 1 \ and \ ends \ with \ a \ 0\}
$$

```mermaid
graph LR
    q0((q0)) --> |0| qd((qd))
    q0 --> |1| q1((q1))
    q1 --> |0| q2((q2))
    q1 --> |1| q1
    q2 --> |0| q2
    q2 --> |1| q1
    qd --> |0| qd
    qd --> |1| qd

    style q0 fill:#f9f,stroke:#333,stroke-width:2px
    style q2 fill:#bbf,stroke:#333,stroke-width:2px,double
```

### B

$$
\{ w|w \ contains \ at \ least \ three \ 1s \}
$$

```mermaid
graph LR
    q0((q0)) --> |0| q0
    q0 --> |1| q1((q1))
    q1 --> |0| q1
    q1 --> |1| q2((q2))
    q2 --> |0| q2
    q2 --> |1| q3((q3))
    q3 --> |0| q3
    q3 --> |1| q3

    style q0 fill:#f9f,stroke:#333,stroke-width:2px
    style q3 fill:#bbf,stroke:#333,stroke-width:2px,double
```
	

### C

$$
\{ w|w \ contains \ the \ substring \ 1010,  \ i.e. w = x1010y \ for \ some \ x \ and \ y .\}
$$

```mermaid
graph LR
    q0((q0)) --> |0| q0
    q0 --> |1| q1((q1))
    q1 --> |0| q2((q2))
    q1 --> |1| q1
    q2 --> |0| q0
    q2 --> |1| q3((q3))
    q3 --> |0| q4((q4))
    q3 --> |1| q1
    q4 --> |0| q4
    q4 --> |1| q4

    style q0 fill:#f9f,stroke:#333,stroke-width:2px
    style q4 fill:#bbf,stroke:#333,stroke-width:2px,double
```

### D

$$
\{ w|w \ is \ of \ length \ at \ least \ three, \ and \ its \ third \ symbol \ is \ 1 \}
$$

```mermaid
graph LR
    q0((q0)) --> |0| q1((q1))
    q0 --> |1| q1_((q1))
    q1 --> |0| q2((q2))
    q1 --> |1| q2_((q2))
    q1_ --> |0| q2
    q1_ --> |1| q2_
    q2 --> |1| q3((q3))
    q2 --> |0| qd((qd))
    q2_ --> |1| q3
    q2_ --> |0| qd
    q3 --> |0| q3
    q3 --> |1| q3
    qd --> |0| qd
    qd --> |1| qd

    style q0 fill:#f9f,stroke:#333,stroke-width:2px
    style q3 fill:#bbf,stroke:#333,stroke-width:2px,double
```



