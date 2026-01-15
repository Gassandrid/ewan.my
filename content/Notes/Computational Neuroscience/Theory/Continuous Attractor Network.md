---
class:
  - note
tags:
  - comp-neuro/theory
  - todo/neuro
date: 2025-09-04
updated: 2026-01-14T10:11:29-05:00
source:
  - http://www.scholarpedia.org/article/Continuous_attractor_network
related:
author:
---

A **Continuous Attractor Network (CAN)** is a type of neural network model that can maintain a continuous range of activity states over time. Unlike discrete attractor networks, which stabilize at specific points, CANs can represent variables that change smoothly, such as spatial position or head direction.

They are particularly useful in [[Computational Neuroscience]] for modeling systems like the head direction system, grid cells in the [[Entorhinal Cortex]], and other neural representations that require continuous encoding.

![[Cann1.gif]]

---

## (Rough) Mathematical Formulation

We can describe a Continuous Attractor Network using a set of differential equations that govern the dynamics of the neural activity.

Consider a network of neurons with activity levels represented by a vector $\mathbf{r}(t)$, where each element $r_i(t)$ corresponds to the activity of neuron $i$ at time $t$. The dynamics of the network can be described by the following equation:

$$
\tau \frac{d\mathbf{r}(t)}{dt} = -\mathbf{r}(t) + \mathbf{W} \cdot \mathbf{f}(\mathbf{r}(t)) + \mathbf{I}(t)
$$

Where:

- $\tau$ is the time constant of the neurons.
- $\mathbf{W}$ is the synaptic weight matrix that defines the connectivity between neurons.
- $\mathbf{f}(\mathbf{r}(t))$ is a nonlinear activation function applied element-wise to the activity vector.
- $\mathbf{I}(t)$ is the external input to the network.

This process allows the network to maintain a continuous range of activity states, which can be interpreted as representing a continuous variable.

Where this become a neural network is when we define the weight matrix $\mathbf{W}$ to have a specific structure that supports continuous attractor dynamics. For example, in a one-dimensional CAN, the weights can be defined such that neurons with similar preferred stimuli (e.g., spatial positions) have strong excitatory connections, while those with dissimilar preferred stimuli have weaker or inhibitory connections.

We would typically define the weight matrix $\mathbf{W}$ using a Gaussian function:

$$
W_{ij} = A \exp\left(-\frac{(x_i - x_j)^2}{2\sigma^2}\right) - B
$$

This relates to work regarding [[Variational Inference]] and [[Predictive Coding]] in that CANs can be seen as implementing a form of probabilistic inference over continuous variables. The network dynamics can be interpreted as performing gradient descent on an energy landscape defined by the synaptic weights and external inputs, allowing the network to converge to stable states that represent the most likely values of the encoded variable given the input data.

Think modeling [[Entropy in Information]] and the [[Bayesian Brain]].
