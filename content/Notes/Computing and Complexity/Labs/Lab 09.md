---
class: note
date: 2025-04-10
updated: 2025-04-10
tags:
  - cs/theory
author: Ewan Pedersen, Mason Ritchie, Vikyat Mulpuri
title: Lab 09
---
## Problem 03

Consider the problem of determining whether a DFA and a regular expression are equivalent. Express this problem as a language and show that it is decidable.

---

we must define a formal language that captures this and then prove it is decidable

---

$EQ_{DFA},R_{E} = \{  \langle D, R \rangle \mid \text{ D is a DFA, R is a regular expression, } \mathcal{L}(D) = \mathcal{L}(R) \}$

This language contains all encoded pairs of DFA D and regular expresssion R so that the language of D is equal to language of R

1. Convert Reg Exp $R_{E}$ to DFA: from $R_{E} \to NFA \to DFA$











---

To show this language is decidable, we need to give a **decidable algorithm** (i.e., a Turing machine that halts on all inputs) to determine whether L(D)=L(R)L(D) = L(R).

1. **Convert RE to a DFA**:  
    
    - RE → NFA → DFA (via standard conversion algorithms)
        
2. **Compare DFAs for Equivalence**:  
    Now we have two DFAs: DD and DRD_R. Use the known **decidable procedure** for checking DFA equivalence:
    
    - Construct DFA DΔD_{\Delta} such that L(DΔ)=L(D)△L(DR)L(D_{\Delta}) = L(D) \triangle L(D_R), where △\triangle denotes symmetric difference.
        
    - Check if L(DΔ)=∅L(D_{\Delta}) = \emptyset. This can be done by checking if there exists any accepting state reachable from the start state.
        
    - If L(DΔ)=∅L(D_{\Delta}) = \emptyset, then L(D)=L(DR)L(D) = L(D_R), so ⟨D,R⟩∈EQDFA,RE\langle D, R \rangle \in \text{EQ}_{\text{DFA,RE}}.
        

#### Therefore:

This procedure always halts and correctly determines whether L(D)=L(R)L(D) = L(R). Hence, the language EQDFA,RE\text{EQ}_{\text{DFA,RE}} is **decidable**.

---

**Language**:

EQDFA,RE={⟨D,R⟩∣D is a DFA,R is a regular expression, and L(D)=L(R)}\text{EQ}_{\text{DFA,RE}} = \{ \langle D, R \rangle \mid D \text{ is a DFA}, R \text{ is a regular expression}, \text{ and } L(D) = L(R) \}

**Decidability**:  
This language is **decidable** because:

- A regular expression can be converted to an equivalent DFA.
    
- DFA equivalence is a decidable problem.
    
