---
date: 2025-09-29
updated: 2025-12-18
class:
  - note
tags:
  - cs/ai/diffusion
  - cs/ai/variational
  - math/information
source:
  - "[[Denoising Diffusion Probabilistic Models]]"
related:
author:
---

**Diffusion** is a novel class of generatative modeling that, in most cases, work to denoise data by learning to reverse a gradual noising process. Diffusion models have recently gained significant attention in the field of machine learning, particularly for their ability to generate high-quality images, audio, and other types of data.

In the world of [[Variational Inference]], diffusion models can be understood as a type of latent variable model where the latent variables represent progressively noisier versions of the data. The model is trained to predict the original data from these noisy versions, effectively learning to reverse the diffusion process.

However, these models are NOT simply told to denoise data directly. Instead, they are trained to predict the noise added at each step of the diffusion process, and then follow it by adding ANOTHER noise to the denoised output. This iterative process continues until the model reaches a point where the data is sufficiently denoised.

While the reasons are a bit abstract, you can think of the reason for doing this as to prevent a "too fast convergence" to a poor local optimum. By gradually denoising the data, the model can explore a wider range of possible outputs and avoid getting stuck in suboptimal solutions.

---

## Rough Framework

From an older paper that popularized diffusion models, [[Denoising Diffusion Probabilistic Models]][@hoDenoisingDiffusionProbabilistic2020], we can see a rough framework for diffusion models.

In this paper, the authors describe diffusion models as a type of latent variable model that learns to generate data by reversing a diffusion process that gradually adds noise to the data.

They take the form:

$$
p_\theta(x_0) := \int p_\theta(x_{0:T}) \, dx_{1:T},
$$

Where $x_{1}, \ldots, x_{T}$ are latent variables of the same dimensionality as the data $x_0 \sim q(x_0)$.

The joint distribution $p_\theta(x_{0:T})$ is called the reverse process, and it is defined as a Markov chain with learned Gaussian transitions starting at $p(x_T) = \mathcal{N}(x_T; 0, I)$:

$$
p_\theta(x_{0:T}) := p(x_T) \prod_{t=1}^{T} p_\theta(x_{t-1}|x_t), \quad p_\theta(x_{t-1}|x_t) := \mathcal{N}(x_{t-1}; \mu_\theta(x_t, t), \Sigma_\theta(x_t, t)) \tag{1}
$$

The **Forward Process**, on the other hand, is fixed to a Markov chain that gradually adds Gaussian noise to the data according to a variance schedule $\beta_1, \ldots, \beta_T$:

$$
q(x_{1:T}|x_0) := \prod_{t=1}^{T} q(x_t|x_{t-1}), \quad q(x_t|x_{t-1}) := \mathcal{N}(x_t; \sqrt{1 - \beta_t} x_{t-1}, \beta_t I) \tag{2}
$$

And for our optimzation/training we take the [[Variational Inference]] approach of minimizing the [[Evidence Lower Bound]] ([[Evidence Lower Bound|ELBO]]):

$$
\mathbb{E}[-\log p_\theta(x_0)] \leq \mathbb{E}_q \left[ -\log \frac{p_\theta(x_{0:T})}{q(x_{1:T}|x_0)} \right] = \mathbb{E}_q \left[ -\log p(x_T) - \sum_{t \geq 1} \log \frac{p_\theta(x_{t-1}|x_t)}{q(x_t|x_{t-1})} \right] =: L \tag{3}
$$

This is all quite abstract though ( class academic speak ), but in layer terms, the forward process is just adding noise to the data, and the reverse process is learning to denoise it step by step.
