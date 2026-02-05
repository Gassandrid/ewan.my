---
id: Continuous Time Recurrent Neural Networks
aliases:
  - CTRNNs
  - CTRNN
tags:
  - cs/ai/temporal
  - cs/ai/evolution
  - cs/robotics
class:
  - note
date: 2026-02-05T08:31:13-05:00
updated: 2026-02-05T08:42:59-05:00
---

**CTRNNs** are a type of [[Recurrent Neural Network]] designed to model temporal dynamics in continuous time. They are particularly useful in fields like evolutionary robotics, where agents need to process sensory inputs and generate motor outputs in real-time.

The most basic definition is as follows:

$$
\tau_i \frac{dy_i(t)}{dt} = -y_i(t) + \sum_{j=1}^{N} w_{ij} \sigma(y_j(t) + \theta_j) + I_i(t)
$$

Where:

- $\tau_i$ is the time constant of neuron $i$, determining how quickly it responds to inputs.
- $\frac{dy_i(t)}{dt}$ is the rate of change of the neuron's state over time.
- $-y_i(t)$ represents the decay of the neuron's state.
- $\sum_{j=1}^{N} w_{ij} \sigma(y_j(t) + \theta_j)$ is the weighted sum of inputs from other neurons, where $w_{ij}$ is the weight from neuron $j$ to neuron $i$, $\sigma$ is an activation function (often a sigmoid), and $\theta_j$ is a bias term.
- $I_i(t)$ is the external input to neuron $i$ at time $t$.
