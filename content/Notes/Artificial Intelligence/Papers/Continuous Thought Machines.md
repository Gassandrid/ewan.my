---
date: 2025-09-11
created_on: "[[09-11-2025]]"
updated: 2025-10-23
class:
  - note
tags:
  - cs/ai/temporal
  - math/linear-algebra
  - todo/comp-neuro
  - comp-neuro
source:
  - "[[Continuous Thought Machines Paper]]"
  - "[[When AI is designed like a Biological Brain]]"
  - "[[Continuous Thought Machine Deep Dive  Temporal Processing + Neural Synchronisation]]"
related:
---
**Continuous Thought Machines** are a new architecture where *Temporal Dynamics* are put at the forefront of the training process.

---

## Intuition

### Neuronal Synchronization

Given that we want the model's relationship with data to not only depend on a single *snapshot* of the network state, but to also build complex [[Temporal Dynamics]] through which time dependency can emerge as a variable in the latent space.

We do this by first collecting all the post activations $z^t$ into a "post activation history":

$$
Z^t = \begin{bmatrix}
z^1 & z^2 & \dots & z^t
\end{bmatrix} \in \mathbb{R}^{D\times t}
$$

It is important to note that the size of $Z^t$ is not fixed, and is instead dependent on the current tick $t$.

We now define neuronal synchronization as the matrix yielded by the inner dot product between post-activation histories:

$$
S^t = Z^t \cdot (Z^t)^\intercal \in \mathbb{R}^{D \times D}
$$

However, it is important to note that this operation **scales very poorly**( $O(D^2)$ ), so instead we will use *random sampling* to choose these pairs. We define these as $D_{out}$ and $D_{action}(i,j)$ as pairs from $S$, yielding two **synchronization representation** pairs:

$$
S_{out}^t \in \mathbb{R}^{D_{out}} \quad \text{and} \quad S_{action}^t \in \mathbb{R}^{D_{action}}
$$

We then project $S^t_{out}$ onto an output space as:

$$
y^t = W_{out} \cdot S^t_{out}
$$

We can then compute neuronal synchronization by first getting the $Q,K,V$ matrices from the $FeatureExtractor$

$$
o^t = Attention(Q=q^t,KV=FeatureExtractor(data))
$$

## Architecture

### Synapse Model

### Neuron Level Models

### Synchronisation
