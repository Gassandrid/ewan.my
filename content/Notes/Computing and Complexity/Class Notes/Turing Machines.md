---
id: Turing Machines
aliases: []
tags:
  - cs/theory
date: 2025-04-03
fileClass: note
updated: 2025-04-03
---

Turing Machines are the next step in the evolution of automata. They are a theoretical model of computation that can simulate any algorithm.

---

## Definitions

Before we get into the mathematical definition, let's explore what a Turing Machine would look like in the physical world.

![[Pasted image 20250403083945.png]]

The simple idea of a turing machine is just a tape with a read/write head. The tape is infinite in both directions, and the read/write head can move left or right. The tape is divided into cells, each of which can hold a symbol from a finite set of symbols.

![[Pasted image 20250403084236.png]]

We can define a Turing Machine as a 7-tuple:

$$
M = (Q, \Sigma, \Gamma, \delta, q_0, q_{accept}, q_{reject})
$$

Where:

- Q is a finite set of states
- $\Sigma$ is a finite set of input symbols (input alphabet)
- $\Gamma$ is a finite set of tape symbols (tape alphabet)
- $\delta$ is the transition function
- $q_0$ is the initial state
- $q_{accept}$ is the accept state
- q\_{reject} is the reject state

But we already know most of this from previous automata. The new part is the transition function, which is defined as:

$$
\delta: Q \times \Gamma \rightarrow Q \times \Gamma \times \{L, R\}
$$

There are also multiple [[Turing Machine Variants]], but that is for another time.

---

## Transition Function in Depth