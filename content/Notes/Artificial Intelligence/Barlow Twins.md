---
class:
  - note
tags:
  - cs/ai/ssl
source:
  - https://arxiv.org/abs/2103.03230
related:
author:
description:
aliases:
date: 2026-05-06T17:38:53-04:00
updated: 2026-08-02T21:07:17-07:00
---

[[Self Supervised Learning]] method where objective is redundancy reduction. 

- precursor to [[Joint Embedding Predictive Architecture]] in quite a few ways
- forces model to learn meaningful compressed [[Latent Space|latent space]]
- this approach was inspired by ideas from [[Computational Neuroscience]]! specifically the work of [[Horace Barlow]], a famous computational neuroscientist.
	- Barlow hypothesized that the goal of sensory processing is to **recode highly redundant sensory inputs into a factorial code** (a code with statistically independent components).

Goes something along the lines of:

1. twin inputs, where a batch of images is passed through a few random destructive augmentations ( remove a corner, shift colors ), creates two distorted views of the same data
2. processed by two identical networks, usually something like a ResNet 50 encoder along with a MLP projector, to produce [[Vectors|embedding vectors]].
3. cross correlation matrix computed between the two embeddings
4. [[Loss Functions|loss function]] consists of an invariance term, forcing the diagonal of the matrix to be 1 and ensuring network always invariant to image distortions, and also a redundancy reduction term to push the off-diagonal elements closer to 0, decorrelates different components of [[Representation|representation vector]].

[![architectureBarlowTwins.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/3392a2299c47f95a5b47b12dfb12aaf16508038ab36c9f85368ebcd59adf2f50/architectureBarlowTwins.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/3392a2299c47f95a5b47b12dfb12aaf16508038ab36c9f85368ebcd59adf2f50/architectureBarlowTwins.png)
