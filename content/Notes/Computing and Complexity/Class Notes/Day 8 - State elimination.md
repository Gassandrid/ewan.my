---
id: Day 8
created_on: "[[02-06-2025]]"
aliases: 
tags:
  - cs/theory
date: 2025-02-06
title: Day 8
updated: 2025-03-27
---
This class will discuss state elimination, more on REGEX, and how they relate to DFAs and NFAs.

---

## REGEX Continued

For your information:

$$
Regex \leftarrow\rightarrow Finite \ Automota
$$

Regex machines are equivalent to finite automata, in that they can recognize the same languages.

But also keep in mind that:

$$
Regular \ Expression \to NFA \to DFA
$$

This is the process of converting a regular expression to a DFA.

And:

$$
Finite \ Automota \to Regular \ Expression
$$

```mermaid
stateDiagram
        [*] --> q1
        q1 --> q3:b
		q3 --> [*]
		q1 --> q2: a
		q2 --> q2: b
		q2 --> q3: a
		q3 --> q3: a,b
```
