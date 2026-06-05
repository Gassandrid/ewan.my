---
class:
  - note
  - lecture
tags:
  - university
source:
related:
author:
description:
aliases:
course: "[[Evolutionary Robotics]]"
lecture-number: 19
date: 2026-04-02T08:32:47-04:00
updated: 2026-04-02T09:37:59-04:00
---

We start with a **toroidal grid** much like we saw last lecture, however this time it is discretized. Unlike last time however, the robots the authors created were *gendered*. This was not just an experiment to create optimal robotics, but also to understand the evolution of sexual selection, and of course the **evolution of communication**.

---

Like any other evolutionary algorithm, we start with a random initialization of 800 males and females. The sexual differences are as follows

- **Females**
	- deaf and immobile
	- can signal
- **Males**
	- blind but can hear
	- cannot signal
	- are mobile

![[Screenshot 2026-04-02 at 8.38.46 AM.png]]

Each male and female starts with its own random neural network, encoding behavior as fixed weights.

**Female Network**:

- **Input**: position and orientation of closest male in her visual range
- **Output**: mating call (binary vector broadcast to nearby males)

**Male Network**:

- **Input**: mating call of closest female if within hearing range; otherwise, zero vector
- **Output**: movement direction (discrete: N/S/E/W or stay)

### If Male Finds Female...

aka occupy the same cell.

1. create one male and one female offspring via single-point crossover on parent weight vectors, then mutate
2. offspring overwrite two randomly chosen existing individuals of their respective sex
3. parents relocate to random unoccupied cells

no explicit fitness function. selection pressure is implicit: females that emit useful signals get found and reproduce; males that navigate toward those signals reproduce. over generations, a shared signaling convention emerges from scratch.

---

## Observed Changes

At the very begining, males seem to just wander randomly, and females seem to signal randomly:

![[tableCommunicationSong1.png]]

at the second evolutionary stage, we see the first obvious step in evolution: males who stood still went completely exctinct:

![[tableCommunicationSong2.png]]

makes sense, as staying still all but guarentees you dont find a mate.

at the third stage, the males started to evolve more to follow straight lines, and *completely* ignore the signals made by the females:

![[tableCommunicationSong3.png]]

at the fourth stage, we start to see actual evolution to follow female signals, in that they would evolve to turn when they are on the same row/column as a female. This was an evolution by the females, in that they have evolved to *signal* this information. the females that didnt use it went extinct.

![[tableCommunicationSong4.png]]

at fifth stage, females have learned to fully utilize and signal rotational cues. when a male is in the cross shaped region of the figure below, they are signal to keep rotation until the male is facing the female. When males enter the 5x5 receptive field, but are not in the cross region, they are just told to go straght, as eventually they will fall into the cross shaped region.

![[Screenshot 2026-04-02 at 9.10.43 AM.png]]
