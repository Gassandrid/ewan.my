---
id: Day 5
aliases: []
tags:
  - computing
  - cs
date: 2025-01-28
title: Day 5
updated: 2025-01-29
---

# Non-deterministic Finite Automata (NFA)

## Introduction to Non-determinism

Non-determinism is a fundamental concept in computation theory that allows a machine to have multiple possible next states for a given input. Unlike deterministic machines where each input leads to exactly one next state, non-deterministic machines can "guess" or "pursue multiple paths simultaneously."

### Key Differences from DFAs

1. Multiple transitions possible for the same input symbol
2. Ability to move without consuming input (ε-transitions)
3. Acceptance criteria differs - accepts if ANY path leads to acceptance

## Formal Definition of NFAs

An NFA is formally defined as a 5-tuple $(Q, \Sigma, \delta, q_0, F)$ where:

$$
\begin{align*}
&Q: \text{finite set of states} \\
&\Sigma: \text{finite alphabet} \\
&\delta: Q \times (\Sigma \cup \{\varepsilon\}) \rightarrow \mathcal{P}(Q) \text{ (transition function)} \\
&q_0: \text{initial state} \\
&F: \text{set of accepting states}
\end{align*}
$$

### Mathematical Representation

For a state $q \in Q$ and input symbol $a \in \Sigma$:

$$
\delta(q, a) = \{q_1, q_2, ..., q_n\} \text{ where } q_i \in Q
$$

## ε-transitions (Epsilon Transitions)

### Properties

- Allows movement between states without consuming input
- Can create "shortcuts" in computation
- Critical for certain constructions and proofs

### ε-closure

For a state $q$, its ε-closure is defined as:

$$
\varepsilon\text{-closure}(q) = \{p \in Q \mid q \xRightarrow{\varepsilon^*} p\}
$$

## Examples

### Basic NFA Example

```

```
