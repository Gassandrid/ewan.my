---
class:
  - note
tags:
  - cs/ai
  - math/probability/stochastic
source:
  - https://www.youtube.com/watch?v=_bqa_I5hNAo
related:
  - "[[Hopfield Networks]]"
  - "[[Ising Model]]"
author:
description: A stochastic, energy based network of binary units that learns a probability distribution over patterns.
aliases:
  - Boltzmann Machines
  - BM
  - Restricted Boltzmann Machine
  - RBM
date: 2024-09-12
updated: 2026-11-20T00:52:27-05:00
---

[![Pasted image 20240924102913.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/ea07162e06b782abfcc1b967b92dcd68b254c7c95a7821f450b7f7fe93e416b3/Pasted%20image%2020240924102913.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/ea07162e06b782abfcc1b967b92dcd68b254c7c95a7821f450b7f7fe93e416b3/Pasted%20image%2020240924102913.png)

- stochastic [[Hopfield Networks|Hopfield network]] with hidden units, one of the first generative [[Neural Networks|neural networks]]: same energy landscape, but units flip randomly and some are [[Latent Variables|latent]]
	- Hopfield networks store [[Notes/Computational Neuroscience/Theory/Memory|memories]] as energy minima ( [[Attractor Network|attractors]] ); a Boltzmann machine instead learns a whole [[Probability Distribution|probability distribution]] over binary patterns
	- basically an [[Ising Model]] whose couplings are learned from data ( Ackley, Hinton & Sejnowski 1985 )
		- Hinton will always remain my goat for this. founding director of UCL Gatsby btw
- energy of a state $s \in \{0,1\}^n$ with symmetric weights:

	$$
	E(s) = -\sum_{i<j} w_{ij} s_i s_j - \sum_i b_i s_i, \qquad P(s) = \frac{e^{-E(s)/T}}{Z}


$$
	- the Boltzmann distribution from statistical mechanics; low energy means more probable
	- $Z = \sum_s e^{-E(s)/T}$, the partition function, sums over every state, which is what makes it intractable
- each unit turns on with a [[Sigmoid Function|sigmoid]] of its input: $P(s_i = 1) = \sigma\left(\frac{\sum_j w_{ij} s_j + b_i}{T}\right)$
	- sampling by repeatedly updating units is Gibbs sampling; slowly lowering $T$ ( simulated annealing ) helps it settle into deep minima instead of getting stuck
- learning: make the data more probable than the model's own fantasies
	
$$

	\Delta w_{ij} \propto \langle s_i s_j \rangle_{\text{data}} - \langle s_i s_j \rangle_{\text{model}}
	

$$

	- positive phase clamps visible units to data, negative phase lets the network run free
	- local and [[Hebbian learning|Hebbian]] looking, which is why it was interesting for brains, but the negative phase needs long sampling
	- [[Mean Field Theory|mean field]] approximations replace the sampling with deterministic averages
- **Restricted Boltzmann Machine**: bipartite, visible to hidden only
	- hidden units are conditionally independent given visibles ( and vice versa ), so block Gibbs sampling is cheap
	- trained with contrastive divergence ( Hinton 2002 ): run the chain only a step or two from the data
	- stacked RBMs made Deep Belief Networks ( 2006 ), the pretraining trick that restarted deep learning
- Hopfield and Hinton got the 2024 physics Nobel partly for this line of work
- descendants: energy based models generally, and the same "push data energy down, push samples up" idea shows up in [[Diffusion in Machine Learning|diffusion]] and contrastive [[Self Supervised Learning|SSL]]
