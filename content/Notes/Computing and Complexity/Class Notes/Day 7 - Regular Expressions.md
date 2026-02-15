---
id: Day 7
created_on: "[[02-04-2025]]"
aliases: 
tags:
  - cs/theory
date: 2025-02-04
title: Day 7
updated: 2025-03-27
---
This day will discuss regular expressions, and their equivalence to NFAs/DFAs. We will also look at a new state elimination algorithm

---

## Regular Expressions

If you are involved with computer science in any way, you have probably heard of **Regex** and whatnot to recognize certain patterns within a string.

- every **Regex** _describes_ a **regular language**, where
  - language is a set of strings
  - matched strings in "language"
  - unmatched " are not!

A regex automata would look something like:

$$
L = \{ w \mid w \ contains \ certain \ substring \ 111\}
$$

**Every regex has an equivalent DFA/NFA**

Lets create a formal definition.

### Formal Definition of Regex

- $\cup$ - union - $(0 \cup 1)$ which means $(\{ 0 \} \cup \{ 1 \})$
- $*$ - kleene star - 0 or more occurrences of a "starred" expression $(01)^*$, $\{ \epsilon , 01, 0101, 010101, \dots\}$

**Definition: we say that R is a regex if:**

- R is a variable for some $a \in \sum$, ex. $\sum = \{ 0,1 \}$ where 0 is regex
- R is $\epsilon$
- r is $\phi$ empty language

These are all the **base cases**

---

**Let's look at some features of a regex:**

- $(R_{1} \cup R_{2})$ where $R_{1},R_{2}$ both regexs'
- $(R_{1} \circ R_{2})$ $\to$ " " " "" " "
- $R^*$ where $R$ is a regex
- $R^+$ where $R$ is a regex
  - what this means is that it is the same as $R^*$ but with $\epsilon$ removed

---

Something new... **GNFAs**

## Generalized Nondeterministic Finite Automaton

A GNFAs is a new type of automata that is used to convert a regex into an NFA. It is a generalization of NFAs and DFAs.

A typical NFA has a set of states, a set of transitions, and a set of accepting states. A GNFAs is similar, but it has a set of transitions that are labeled with regular expressions instead of single symbols.

Representation of a GNFAs:

$$
\text{GNFA} = (Q, \Sigma, \delta, q_{start}, q_{accept})\text{ where:}\ \ \ \\
\begin{align*}
&Q \text{ is a finite set of states}\\
&\Sigma \text{ is the alphabet}\\
&\delta: Q \times Q \to R \text{ (R is set of regex)}\\
&q_{start} \text{ is the start state}\\
&q_{accept} \text{ is the accept state}
\end{align*}
$$
