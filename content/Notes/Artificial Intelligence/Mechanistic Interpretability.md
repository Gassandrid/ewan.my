---
id: Mechanistic Interpretability
aliases:
  - Interpretability
tags:
  - cs/ai/interpretability
  - cs/ai/llm
  - sapling
date: 2025-09-25
updated: 2026-10-29T12:00:00-04:00
class:
  - note
source:
  - "[[The Dark Matter of AI - Mechanistic Interpretability]]"
related:
  - "[[Sparse Autoencoder]]"
author:
---

[[10-13-2026]] update *of note: while I have this note specifically for mech interp, I use the note more generally for general interp methods, especially since a lot of my work goes beyond [[Large Language Model|LLM]]s and more with [[Self Supervised Learning]] and [[Representation]] models*

important a subfield of AI interpretability that focuses on understanding the internal workings of AI models, particularly large language models (LLMs). It aims to uncover how these models process information and make decisions, often through techniques like circuit analysis, feature visualization, and probing.

- [[10-15-2026]] cool new breakthrough from one of the authors of the OG [[Polysemanticity]] paper: [[Neural Networks Are Already Clean]]

---

## Common Techniques

[Anthropic](https://www.anthropic.com/research/mapping-mind-language-model) and many other organizations have been working on mechanistic interpretability using techniques that focus on a single neuron or a small group of neurons.

What this looks like in practice looking at the probability distribution for a sample query, say "The reliability of wikipedia is very...", finding something interesting like a probability for "questionable" being high, and then going through layer by layer unembedding the logits to see which neurons are contributing to that probability.

When you have found a neuron of interest, you could try a few things to investigate, something like modifying the neuron value to see how it affects the output, or plotting a heatmap over the token sequence to see what parts of the input are activating the neuron.

> [![anthropicGoldenGateNeuron.png](../../Attachments/anthropicGoldenGateNeuron.png)](../../Attachments/anthropicGoldenGateNeuron.png)
>
>  
> _Anthropic: A feature sensitive to mentions of the Golden Gate Bridge fires on a range of model inputs, from English mentions of the name of the bridge to discussions in Japanese, Chinese, Greek, Vietnamese, Russian, and an image. The orange color denotes the words or word-parts on which the feature is active._

Some classic methods for [[Large Language Model]] interp:

- **[[Sparse Autoencoder]]s**: A promising approach that uses a separate learning algorithm to extract model features that often align with human-understandable concepts. Researchers can then amplify or suppress these features to observe their effect on the model's behavior.
- **Direct Modification of Neuron Values**: A straightforward method to test a neuron's function by manually setting its output to a very high or low value. By observing the impact on the model's predictions, one can infer what the neuron has learned.
- **Searching for [[Maximizing Activation through Differentiable Content Consumption|Maximal Activation Examples]]**: To determine what a specific neuron or feature represents, one can search through a dataset for text examples that cause it to activate most strongly.
- **Modifying Model Architecture**: An experimental technique to combat _polysemanticity_ (where one neuron represents multiple unrelated concepts) by changing the model's architecture to encourage fewer neurons to fire for any given input. The goal is to isolate concepts to more specific neurons.
- **Sparse Cross-Autoencoders**: A developing approach that aims to overcome limitations of standard sparse autoencoders. It looks at multiple locations in the model simultaneously to better disentangle cross-layer superposition.

---

## [[Superposition in AI|Superposition]] And [[Polysemanticity]]

A theory that has emerged from mechanistic interpretability research is that of **superposition** and **polysemanticity**. This theory suggests that neural networks often encode multiple unrelated concepts within the same neuron or feature, leading to complex and entangled representations.

---

## Good Tools

- I quite enjoy [[Linear Probe]]s for their use in [[Representation]] models, but also very applicable for learning where a model forms a concept. tests what infromation is accessible within a representation
- **controlled counterfactual evaluation**, making transformations or ablations to the input to see how the resultant representation is effected.
- **activation patching and [[Ablation]]**: removing/patching parts of the model to test causal importance of layers, components, or subspaces
- **[[Centered Kernel Alignment]]**, [[Representational Similarity Analysis]]: havent done much of this myself, however it is supposedly very useful in niche circumstances.
- Spectral + geometric analysis, good for measurement of  collapse, redundancy(reminds me of [[Barlow Twins]] redundancy reduction), intrinsic dimensionality, anisotropy
- [J space](https://www.anthropic.com/research/global-workspace) although I dont really know anything about it
- **concept erasure and subspace interventions**: whether specific latent factors causally influence behavior
- **gradient and input attribution**: what features drive an output or internal activation
- **training dynamics and data attribution**: why particular features emerge and what examples shape them
- obviously the ever classic [[Sparse Autoencoder]]s and dictionaory learning. very useful and broadly applicable even outside of language model work. more interpretable features than individual neuron axes
	- however SAEs show weaknesses like feature splitting that newer methods like [[adVersarial Parameter Decomposition]] solve.
		- VPD is quite interesting: https://www.goodfire.com/research/interpreting-lm-parameters
- **circuit discovery**: how components cooperate to implement computations
- **disentanglement metrics**: separation of known generative factors

general approach: probes -> what's recoverable, RSA/CKA -> its organization, SAEs → candidate features, interventions → whether those features actually matter

---

## To Look Into

### Representation / Embedding Models

- [[SVCCA]] / [[PWCCA]]: canonical-correlation cousins of [[Centered Kernel Alignment|CKA]] for comparing layers, checkpoints, models
- [[Concept Activation Vector]]s / [[TCAV]]: direction for a user-defined concept + downstream sensitivity to it
- **nonlinear + [[Minimum Description Length|MDL]] probing**: how *easily* info is decodable, not just whether
- [[LEACE]] / [[INLP]]: linear concept erasure, e.g. erase speaker identity and check if semantic retrieval survives
- [[Distributed Alignment Search]] / interchange interventions: learned subspace swaps, via pyvene
- [[Integrated Gradients]]: attribution of an embedding property/similarity score back to inputs
- geometry diagnostics: effective rank, isotropy, [[Intrinsic Dimension]], hubness, neighborhood stability
	- for SigReg-style encoders: marginal distributional regularity vs local semantic organization
- [[Topological Data Analysis|persistent homology]] / manifold analysis: whether neighborhood/trajectory structure is preserved
- information-theoretic: [[Mutual Information]] estimators, [[V-Information]]. high-dim MI is unreliable, probe acc often more trustworthy
- [Interpretable Embeddings with Sparse Autoencoders](https://proceedings.mlr.press/v306/jiang26ar.html) (ICML 2026): SAEs on embeddings for corpus analysis + property-specific retrieval
- [[Model Stitching]]: are two representations functionally interchangeable

### Comp Neuro

- **[[Generalized Shape Metrics]]** ([Williams et al. 2021](https://arxiv.org/abs/2110.14739)): CKA/CCA variants that are proper metrics (Procrustes etc.), plus soft matching distance for neuron-level alignment
- **[[Dynamical Similarity Analysis]]** ([Ostrow et al. 2023](https://arxiv.org/abs/2306.10168)): compare systems by dynamics not geometry, relevant for RNNs + neural time series
- **encoding models / neural predictivity**: ridge regression from model features to recordings, [[Brain-Score]], noise ceilings
	- survey: [Brain Encoding and Decoding](https://arxiv.org/abs/2307.10246)
- [[Manifold Capacity]] (Chung, Cohen): how linearly separable object manifolds are, radius + dimension
- **abstraction geometry**: cross-condition generalization performance (CCGP), shattering dimensionality (Bernardi et al. 2020)
- [[Mixed Selectivity]]: neuro analog of [[Polysemanticity]]
- [[Sparse Coding]] (Olshausen & Field): the ancestor of [[Sparse Autoencoder]]s
- **fixed point analysis** (Sussillo & Barak): linearize trained RNNs around fixed/slow points
- population methods: [[dPCA]], [[jPCA]], [[LFADS]], [[CEBRA]]
- **in silico electrophysiology**: optimal stimulus synthesis, inception loops (Walker 2019), neural control (Bashivan 2019), XDream
- [[Model Metamers]] (Feather et al.): stimuli a model treats as identical, test against human perception
- **natural language neuron descriptions** for V1/V4 ([2026 preprint](https://arxiv.org/abs/2605.12485)): auto-interp applied to real neurons
- [[Platonic Representation Hypothesis]]: convergence of representations across models/modalities, ties to universality
- [NeuroAI Turing Test](https://arxiv.org/abs/2502.16238): framing for prediction vs explanation in brain-model evals

### General / LLM

- [[Logit Lens]] / [[Tuned Lens]]
- [[Steering Vector]]s / [[Representation Engineering]]
- [[Transcoder]]s, [[Crosscoder]]s, attribution graphs / circuit tracing (Anthropic 2025)
- [[Attribution Patching]], path patching
- [[Causal Abstraction]] / causal scrubbing
- automated interpretability (auto-interp): LLM-written feature labels + scoring
- [[Network Dissection]] (Bau 2017): neuron ↔ concept matching for vision models
- data attribution: [[Influence Function]]s, TRAK
- [[Developmental Interpretability]]: [[Singular Learning Theory]], local learning coefficient

## Libraries

- [Captum](https://captum.ai/) is a good general purpose interp library for [[Ablation]] studies, input/layer contribution
- [NNSight](https://nnsight.net/) is the best for inspecting internal activations, modifying them during forward passes, and running controlled interventions.
- [[TransformerLens]] is the classic for language models
- [pyvene](https://stanfordnlp.github.io/pyvene/) is specifically for causal representation interventions, in that it is good for activation swaps, subspace interventions, causal abstraction experiments, and learned interventions.
- [SAELens](https://github.com/decoderesearch/SAELens) for [[Sparse Autoencoder]]s 
	- [sae_vis](https://github.com/callummcdougall/sae_vis) for feature dashboards
- [rsatoolbox](https://github.com/rsagroup/rsatoolbox) for [[Representational Similarity Analysis|RSA]], comparing against neural/behavioral data
- [netrep](https://github.com/ahwillia/netrep) for shape metrics
- [DSA](https://github.com/mitchellostrow/DSA) for dynamical similarity analysis
- CKA/SVCCA are easy enough to just write in torch
