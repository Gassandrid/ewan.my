---
class:
  - note
tags:
  - math/dynamical-systems/attractor
  - comp-neuro/theory
source:
  - "https://www.pnas.org/doi/10.1073/pnas.79.8.2554"
  - "https://arxiv.org/abs/2008.02217"
  - "https://www.youtube.com/watch?v=1WPJdAW-sFo&t=11s"
related:
  - "[[Attractor Network]]"
  - "[[Boltzmann Machine]]"
author:
  - "[[John Hopfield]]"
description: A recurrent network of binary units with symmetric weights whose energy-minimizing dynamics turn stored patterns into attractors, making it a content-addressable memory.
aliases:
  - Hopfield Network
  - Modern Hopfield Network
  - Modern Hopfield Networks
date: 2024-09-12
updated: 2026-11-19T19:40:11-05:00
---

- recurrent [[Neural Networks|neural network]] that works as **content-addressable memory**: give it a noisy or partial pattern and it falls into the closest stored one ( [[John Hopfield]], 1982 )
	- memories are [[Attractor Network|attractors]] of the dynamics, recall is just letting the state roll downhill on an energy landscape
	- example: store a few black and white letter images, flip 30% of the pixels of an "A", run the updates, it settles back to the clean "A"
	- same autoassociative [[Notes/Computational Neuroscience/Theory/Memory|memory]] / pattern completion story people tell about the CA3 recurrent collaterals in the [[Hippocampus]]
- setup
	- binary [[Artificial Neuron|neurons]] $s_i \in \{-1, +1\}$
	- symmetric weights $w_{ij} = w_{ji}$, no self loops $w_{ii} = 0$
	- asynchronous update, one unit at a time: $s_i \leftarrow \operatorname{sgn}\left(\sum_j w_{ij} s_j\right)$
- **energy**, basically an [[Ising Model]] spin system; each asynchronous update can only lower or keep $E$, so the network always ends at a fixed point ( a local minimum )

$$
E = -\frac{1}{2} \sum_{i \neq j} w_{ij} s_i s_j
$$

- learning is one shot [[Hebbian learning]] ( "fire together, wire together" ) over patterns $x^1, \dots, x^p$ on $N$ neurons

$$
w_{ij} = \frac{1}{N} \sum_{\mu=1}^{p} x_i^\mu x_j^\mu
$$

- limits
	- capacity is about $0.14N$ random patterns, past that recall collapses
	- **spurious states**: minima that aren't stored patterns ( mixtures of three stored ones, and every $-x^\mu$ is stable too )
- the [[Boltzmann Machine]] is the stochastic version: same energy, but units flip probabilistically at a temperature, and it can have hidden units
- the energy descent was also used for combinatorial optimization like the traveling salesman problem ( Hopfield & Tank, 1985 )
- **modern Hopfield networks** ( continuous states, exponential energy ) store exponentially many patterns, and one update step is exactly [[Self Attention]] with the stored patterns $X$ as keys and values and the state $\xi$ as the query

$$
\xi^{\text{new}} = X \operatorname{softmax}\left(\beta X^\top \xi\right)
$$

	- so a [[Softmax]] attention head is a retrieval step on an associative memory, a nice bridge from 80s physics to transformers
- fed into [[Recurrent Neural Network|recurrent neural networks]] and energy based models in general, and won Hopfield the 2024 physics Nobel ( shared with Hinton for the Boltzmann machine line )
- [[Continuous Attractor Network]]s are the cousin where memories form a continuum ( a ring or a sheet ) instead of isolated points
