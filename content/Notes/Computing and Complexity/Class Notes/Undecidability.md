---
date: 2025-04-10
updated: 2025-04-10
tags:
  - cs/theory
---

  Let's start the day with a table of decidability construction:

| Language    | Setbuilder                                                                                                       | Proof Idea                                                                         |
| ----------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| $A_{DFA}$   | $\{ \langle M, w \rangle \mid \text{M is a DFA and w is a string and m accepts w} \}$                            | Simulated DFA on input w                                                           |
| $A_{NFA}$   | $\{ \langle N, w \rangle \mid \text{N is an NFA and N accepts w} \}$                                             | Convert $N$ to an equivalent DFA by subset construction, use decider for $A_{DFA}$ |
| $A_{REGEX}$ | $\{ \langle R, w \rangle \mid \text{R is a REGEX and R matches w} \}$                                            | convert $R$ to an equivalent NFA by prior Theorem, use  $A_{NFA}$                  |
| $E_{DFA}$   | $\{  \langle D \rangle \mid \text{D is a DFA and }\mathcal{L}(D) = \emptyset \}$                                 | graph search to find path between start and accept states                          |
| $EQ_{DFA}$  | $\{  \langle D_{1}, D_{2} \rangle \mid D_{1},D_{2} \text{ DFAs and } \mathcal{L}(D_{1}) = \mathcal{L}(D_{2}) \}$ | $D_{3 \mid \mathcal{L}}$                                                           |