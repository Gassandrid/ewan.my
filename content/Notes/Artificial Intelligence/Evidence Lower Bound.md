---
id: Evidence Lower Bound
created_on: "[[11-05-2025]]"
aliases:
  - ELBO
  - Variational Lower Bound
tags:
  - math/information
  - math/probability/bayesian
  - math/information/entropy
  - cs/ai/variational
  - generated
class:
  - note
date: 2025-11-05
source:
  - "[[Evidence Lower Bound (ELBO) - CLEARLY EXPLAINED!]]"
related:
  - "[[Kullback-Leibler Divergence]]"
  - "[[Jensen's Inequality]]"
  - "[[Variational Inference]]"
  - "[[Variational Autoencoder]]"
updated: 2026-02-04T13:07:54-05:00
---
The **Evidence Lower Bound (ELBO)** is the core quantity in variational inference and the key optimization objective for training [[Variational Autoencoder|Variational Autoencoders]]. It provides a tractable lower bound on the log marginal likelihood (the "evidence") of observed data. 

---

## The Problem: Intractable Posteriors

In many probabilistic models, we want to compute the posterior distribution $p_{\theta}(z|x)$ of latent variables $z$ given observed data $x$. Using Bayes' rule:

$$
p_{\theta}(z|x) = \frac{p_{\theta}(x|z)p_{\theta}(z)}{p_{\theta}(x)}
$$

The denominator $p_{\theta}(x)$ is the **marginal likelihood** or **evidence**:

$$
p_{\theta}(x) = \int_{z} p_{\theta}(x|z)p_{\theta}(z) \, dz
$$

This integral is typically **intractable** for complex models because it requires integrating over all possible latent configurations. We need an alternative approach.

---

## Variational Inference Solution

Instead of computing $p_{\theta}(z|x)$ directly, **variational inference** introduces an approximate posterior $q_{\phi}(z|x)$ (often called the "recognition model" or "inference network") parameterized by $\phi$.

The goal is to make $q_{\phi}(z|x)$ as close as possible to the true posterior $p_{\theta}(z|x)$. We measure closeness using the [[Kullback-Leibler Divergence|KL divergence]]:

$$
D_{KL}(q_{\phi}(z|x) \| p_{\theta}(z|x)) = \mathbb{E}_{q_{\phi}(z|x)}\left[\log \frac{q_{\phi}(z|x)}{p_{\theta}(z|x)}\right]
$$

However, computing this directly still requires knowing $p_{\theta}(z|x)$, which brings us back to the original problem!

---

## Deriving the ELBO

Given the [[Kullback-Leibler Divergence]] in combination with Bayes' rule, an interesting relationship can be derived:

$$
\begin{align}
D_{KL}(q_{\phi}(z|x) \| p_{\theta}(z|x)) &= \mathbb{E}_{q_{\phi}(z|x)}\left[\log \frac{q_{\phi}(z|x)}{p_{\theta}(z|x)}\right] \\
&= \mathbb{E}_{q_{\phi}(z|x)}\left[\log q_{\phi}(z|x) - \log p_{\theta}(z|x)\right] \\
&= \mathbb{E}_{q_{\phi}(z|x)}\left[\log q_{\phi}(z|x) - \log \frac{p_{\theta}(x,z)}{p_{\theta}(x)}\right] \\
&= \mathbb{E}_{q_{\phi}(z|x)}\left[\log q_{\phi}(z|x) - \log p_{\theta}(x,z) + \log p_{\theta}(x)\right] \\
&= \mathbb{E}_{q_{\phi}(z|x)}\left[\log q_{\phi}(z|x) - \log p_{\theta}(x,z)\right] + \log p_{\theta}(x)
\end{align}
$$

Note that $\log p_{\theta}(x)$ doesn't depend on $z$, so it comes out of the expectation. Rearranging:

$$
\log p_{\theta}(x) = D_{KL}(q_{\phi}(z|x) \| p_{\theta}(z|x)) + \mathbb{E}_{q_{\phi}(z|x)}\left[\log p_{\theta}(x,z) - \log q_{\phi}(z|x)\right]
$$

The second term is the **ELBO**:

$$
\mathcal{L}(\theta, \phi; x) = \mathbb{E}_{q_{\phi}(z|x)}\left[\log p_{\theta}(x,z) - \log q_{\phi}(z|x)\right]
$$

Since $D_{KL} \geq 0$, we get

$$
\log p_{\theta}(x) \geq \mathcal{L}(\theta, \phi; x)
$$

The ELBO is a **lower bound** on the log evidence!

---

## Other Forms

### Reconstruction and Regularization

The ELBO can be rewritten using the joint distribution $p_{\theta}(x,z) = p_{\theta}(x|z)p_{\theta}(z)$:

$$
\mathcal{L}(\theta, \phi; x) = \mathbb{E}_{q_{\phi}(z|x)}\left[\log p_{\theta}(x|z)\right] - D_{KL}(q_{\phi}(z|x) \| p_{\theta}(z))
$$

This form has a clear interpretation:

- **Reconstruction term**: $\mathbb{E}_{q_{\phi}(z|x)}\left[\log p_{\theta}(x|z)\right]$ - how well we can reconstruct $x$ from samples of $z$
- **Regularization term**: $-D_{KL}(q_{\phi}(z|x) \| p_{\theta}(z))$ - how close our approximate posterior is to the prior

### Negative Free Energy

The ELBO is also known as the **negative variational free energy** in statistical physics:

$$
\mathcal{L}(\theta, \phi; x) = -\mathcal{F}(q_{\phi}, \theta; x)
$$

---

## Jensen's Inequality Derivation

An alternative way to derive the ELBO uses [[Jensen's Inequality]]. For any concave function $f$ (like $\log$):

$$
f(\mathbb{E}[X]) \geq \mathbb{E}[f(X)]
$$

Starting with the marginal likelihood:

$$
\begin{align}
\log p_{\theta}(x) &= \log \int_{z} p_{\theta}(x,z) \, dz \\
&= \log \int_{z} \frac{p_{\theta}(x,z)}{q_{\phi}(z|x)} q_{\phi}(z|x) \, dz \\
&= \log \mathbb{E}_{q_{\phi}(z|x)}\left[\frac{p_{\theta}(x,z)}{q_{\phi}(z|x)}\right] \\
&\geq \mathbb{E}_{q_{\phi}(z|x)}\left[\log \frac{p_{\theta}(x,z)}{q_{\phi}(z|x)}\right] \quad \text{(Jensen's inequality)}
\end{align}
$$

This directly gives us the ELBO! The inequality is tight when $q_{\phi}(z|x) = p_{\theta}(z|x)$, meaning the ELBO equals the log evidence when our approximate posterior is perfect.

---

## Geometric Intuition

The relationship between the evidence, ELBO, and KL divergence can be visualized:

$$
\underbrace{ \log p(x) }_{ \text{Evidence} } = \underbrace{ ELBO }_{ \text{What we maximize} } + \underbrace{ KL(q||p) }_{ \text{Gap we want to minimize} }
$$

- **Maximizing ELBO** has two effects:
  1. Increases the log evidence (better model of data)
  2. Decreases the KL divergence (better approximate posterior)

**Maximizing ELBO** has the effect of both increasing our *log evidence*(giving us a better model of data) **and** decreasing the [[Kullback-Leibler Divergence|KL Divergence]](yielding a better posterior approximation)
  
- The **gap** between ELBO and true evidence is exactly the KL divergence
- When we maximize ELBO w.r.t. $\phi$ only, we're doing **variational inference** (improving the approximate posterior)
- When we maximize ELBO w.r.t. $\theta$ only, we're doing **maximum likelihood learning** (improving the generative model)
- Maximizing w.r.t. both simultaneously (as in VAEs) combines both objectives

---

## The Reparameterization Trick

To optimize the ELBO via gradient descent, we need $\nabla_{\phi} \mathcal{L}(\theta, \phi; x)$. The challenge is that the expectation is over $q_{\phi}(z|x)$, which depends on $\phi$.

The **reparameterization trick** transforms the random variable $z \sim q_{\phi}(z|x)$ into a deterministic function of $\phi$ plus independent noise:

For a Gaussian approximate posterior $q_{\phi}(z|x) = \mathcal{N}(z; \mu_{\phi}(x), \sigma_{\phi}^2(x))$:

$$
z = \mu_{\phi}(x) + \sigma_{\phi}(x) \odot \epsilon, \quad \epsilon \sim \mathcal{N}(0, I)
$$

Where $\odot$ is element-wise multiplication. Now the expectation is over $\epsilon$, which doesn't depend on $\phi$:

$$
\mathcal{L}(\theta, \phi; x) = \mathbb{E}_{\epsilon \sim \mathcal{N}(0,I)}\left[\log p_{\theta}(x, \mu_{\phi}(x) + \sigma_{\phi}(x) \odot \epsilon) - \log q_{\phi}(\mu_{\phi}(x) + \sigma_{\phi}(x) \odot \epsilon|x)\right]
$$

We can now compute gradients:

$$
\nabla_{\phi} \mathcal{L}(\theta, \phi; x) \approx \nabla_{\phi} \left[\log p_{\theta}(x, z^{(l)}) - \log q_{\phi}(z^{(l)}|x)\right]
$$

where $z^{(l)} = \mu_{\phi}(x) + \sigma_{\phi}(x) \odot \epsilon^{(l)}$ with $\epsilon^{(l)} \sim \mathcal{N}(0, I)$.

This makes backpropagation through the sampling process possible!

---

## Practical Computation in VAEs

For a VAE with Gaussian approximate posterior $q_{\phi}(z|x) = \mathcal{N}(\mu_{\phi}(x), \text{diag}(\sigma_{\phi}^2(x)))$ and standard normal prior $p_{\theta}(z) = \mathcal{N}(0, I)$, the ELBO becomes:

$$
\mathcal{L}(\theta, \phi; x) = \mathbb{E}_{\epsilon \sim \mathcal{N}(0,I)}\left[\log p_{\theta}(x|z)\right] - D_{KL}(q_{\phi}(z|x) \| \mathcal{N}(0, I))
$$

The KL divergence has a **closed form** for Gaussians:

$$
D_{KL}(q_{\phi}(z|x) \| \mathcal{N}(0, I)) = \frac{1}{2}\sum_{j=1}^{J}\left(\mu_j^2 + \sigma_j^2 - \log \sigma_j^2 - 1\right)
$$

where $J$ is the dimensionality of $z$.

The reconstruction term is approximated via Monte Carlo sampling:

$$
\mathbb{E}_{\epsilon \sim \mathcal{N}(0,I)}\left[\log p_{\theta}(x|z)\right] \approx \frac{1}{L}\sum_{l=1}^{L}\log p_{\theta}(x|z^{(l)})
$$

In practice, $L=1$ (single sample) often works well during training.

---

## Why ELBO Works

The ELBO framework is powerful because:

1. **Tractability**: We can compute and optimize it without knowing the intractable posterior
2. **Flexibility**: Works with any choice of approximate posterior family $q_{\phi}$
3. **Principled**: Directly optimizes a bound on the quantity we care about (log evidence)
4. **Interpretable**: Decomposes into reconstruction and regularization terms
5. **Scalable**: Can be optimized via stochastic gradient descent

The key insight is that by maximizing a lower bound, we're still pushing the true quantity upward, even though we can't compute it directly.

---

## Connections

- **[[Variational Inference]]**: ELBO is the core objective function
- **[[Kullback-Leibler Divergence]]**: The gap between ELBO and evidence
- **[[Jensen's Inequality]]**: Alternative derivation of the bound
- **[[Information Theory]]**: ELBO relates to mutual information and entropy
- **[[Expectation-Maximization Algorithm]]**: ELBO generalizes the EM algorithm's objective
