---
date: 2026-02-12T13:55:21-05:00
updated: 2026-10-06T19:54:21-04:00
class:
  - note
tags:
source:
  - https://en.wikipedia.org/wiki/Neural_differential_equation
related:
author:
description:
aliases:
---

- about as obvious as it sounds, you parameterize the dynamics of a differential equation. thats about it lol

## For ODEs

$$
\frac{d\mathbf{h}(t)}{dt}= f_{\theta}(\mathbf{h}(t), t)
$$

where $\theta$ network parameters determine how state changes

## What is Being Learned?

just a [[Vector Fields|vector field]], at each state which direction and how quickly should the system move.

$$
\mathbf h(t_1)=\mathbf h(t_0)+\int_{t_0}^{t_1}f_\theta(\mathbf h(t),t)\,dt.
$$

[[Eulers Method]] gives  $\mathbf h_{k+1}=\mathbf h_k+\Delta t\,f_\theta(\mathbf h_k,t_k)$, which looks like a [[Residual Network]] update. In a neural ODE, solver controls integration steps instead of treating each step as a separately learned layer. See [Chen et al. (2018)](https://arxiv.org/abs/1806.07366).

## Latent State, Inputs, and Observations

For sparse neural or behavioral measurements, a useful formulation is

$$
\dot{\mathbf z}(t)=f_\theta(\mathbf z(t),\mathbf u(t),t),
\qquad
\mathbf y_i=g_\phi(\mathbf z(t_i))+\boldsymbol\epsilon_i.
$$

- $\mathbf y_i$: measured EEG or behavioral features at recorded times.
- $\mathbf z(t)$: inferred latent state; not directly measured.
- $\mathbf u(t)$: observed inputs, such as stimulus features.
- $g_\phi$: observation model, connecting the latent state to a particular sensor.
- $\boldsymbol\epsilon_i$: observation noise; uncertainty about dynamics is a separate issue.

some encoder can infer an initial-state distribution from observations. The ODE evolves that state; the decoder predicts measurements. This is the basic appeal of [Latent ODEs](https://arxiv.org/abs/1907.03907): inference over hidden continuous-time trajectories with observations at irregular times. It does **not** make the hidden state uniquely recoverable.

- [[Latent Factor Analysis via Dynamical Systems|LFADS]] is a close concept neighbor here. infer initial conditions, a recurrent generator, and optionally time-varying inputs from neural recordings. Its original generator is an RNN, not a neural ODE. The connection is the separation of latent evolution from the observation model. Results on population spiking do not directly establish suitability for sparse scalp EEG. [Pandarinath et al. (2018)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6380887/)
