---
class:
  - note
tags:
  - cs/ai/latent-space
  - cs/ai/generative/variational
source:
related:
  - "[[Latent Space]]"
  - "[[Variational Autoencoder]]"
  - "[[Evidence Lower Bound]]"
author:
description: Unobserved variables inferred from observed data, the hidden causes a generative model samples from to produce it.
aliases:
  - Latent Variable
  - Hidden Variable
  - Hidden Variables
date: 2024-09-12
updated: 2026-11-19T20:38:18-05:00
---

- **latent variables** are hidden causes $z$ we never observe directly but infer from the observed data $x$, central to generative [[Machine Learning|machine learning]]
	- example: for handwritten digits, $z$ could be stroke width, slant and which digit it is; the pixels $x$ are what you actually see
	- they're the coordinates of a [[Latent Space]], and finding good ones is basically [[Representation]] learning
- generative story: sample $z$ from a prior $p(z)$, then $x$ from $p(x|z)$, so the data likelihood marginalizes the latent out

$$
p(x) = \int p(x|z) \, p(z) \, dz
$$

- inference difficult: posterior $p(z|x)$ usually intractable ( [[Bayesian Inference]] ), we approximate it
	- [[Variational Autoencoder]]s learn an encoder $q(z|x)$ and a decoder $p(x|z)$ together, training their [[Parameter|parameters]] on the [[Evidence Lower Bound]], which falls out of [[Jensen's Inequality]]

$$
\mathcal{L}_{\text{ELBO}} = \mathbb{E}_{q(z|x)}[\log p(x|z)] - \text{KL}(q(z|x) \parallel p(z))
$$

	- first term is reconstruction, second is a [[Kullback-Leibler Divergence|KL]] penalty keeping the encoder close to the prior $p(z)$
	- the gap between the ELBO and $\log p(x)$ is exactly $\text{KL}(q(z|x) \parallel p(z|x))$, how wrong the approximate posterior is
- [[Generative Adversarial Network|GANs]] keep only the generator direction: a noise vector $z$ ( a few hundred dims, still far smaller than the image ) is mapped to data, with no encoder and no likelihood
- classic latent variable models: probabilistic [[Principle Component Analysis|PCA]] ( the linear gaussian case ), mixture models, [[Hidden Markov Models|HMMs]] ( discrete latent states over time )
- for neural data this is the whole game: a few latent dynamical factors driving many recorded neurons, e.g. [[Latent Factor Analysis via Dynamical Systems|LFADS]]
- [[Diffusion in Machine Learning|diffusion models]] are latent variable models too, the progressively noised images are the latents
