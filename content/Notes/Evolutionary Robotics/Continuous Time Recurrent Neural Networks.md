---
id: Continuous Time Recurrent Neural Networks
created_on: "[[02-05-2026]]"
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
updated: 2026-02-10T09:36:00-05:00
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

![[modelCTRNN.png]]

---

## Difference Equation

For simulation, we update neuron states at each timestep:

$$
y_i(t+1) = y_i(t) + \frac{1}{\tau_i} \left( -y_i(t) + \sum_{j=1}^{N} w_{ij} \sigma(y_j(t) + \theta_j) + I_i(t) \right)
$$

**The $-y_i(t)$ term:** Decay that pulls the state back to zero. This mirrors the biological tendancy towards equilibrium.

**Parameter effects:**
- $\tau_i$ large → slow, integrative
- $\tau_i$ small → fast, reactive
- $w_{ij}$ large → strong recurrence
- $\theta_j$ positive → neuron more easily activated

---

## Comparison to BioPhysics Models

CTRNNs abstract away from detailed biophysical models like the [[Hodgkin Huxley Model]], which models ion channel conductances with four coupled ODEs. CTRNNs collapse this complexity into a single state variable with decay, capturing *rate dynamics* rather than spiking. 

I thought it would be of interesting note, because they are similar in quite a few ways. [[Mean Field Theory]] was introduced to solve the exact $w_{ij}$ calculation for [[Hodgkin Huxley Model|Hodgkin Huxley]] as that was a complicated operation.
