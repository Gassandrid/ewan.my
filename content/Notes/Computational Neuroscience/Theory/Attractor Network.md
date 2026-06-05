---
date: 2026-02-01T16:19:43-05:00
updated: 2026-04-16T12:26:49-04:00
class:
  - note
tags:
  - math/chaos/attractor
  - cs/ai/latent-space
source: http://www.scholarpedia.org/article/Attractor_network
related:
author:
description:
aliases:
---

Attractor networks are a very general term in the domain of neural networks and dynamical systems. They refer to systems that evolve over time towards a set of stable states known as attractors. These attractors can represent memories, patterns, or other stable configurations in the system.

Many kinds of networks converge to attractors, the most common example being [[Hopfield Networks]], which are recurrent neural networks that can store and retrieve binary patterns. In a Hopfield network, the attractors correspond to the stored patterns, and the network dynamics lead to convergence towards these patterns when presented with partial or noisy inputs.

---

## Types

### Point Attractors

![[pointAttractor.png]]

Simplest case, tends towards a [[Attracting fixed point|Fixed Point]]. A classic example of a single dimension fixed point attractor is the equation:

$$
\dot{x}(t)=kx(t) \quad for \quad \infty < k < 0
$$

> [!Abstract] Theorem
> Any $D$ dimensional damped linear system will have a fixed point attractor at the origin.

### Line, Ring, and Plane Attractors

A natural extension of point attractors. Rather than a set of fixed points being the attractors, a whole continuous set of points form the attractor. For example, in a line attractor, the system can settle anywhere along a line in the state space.

A simple example would be that of any networking with neurons $n_{i}$ with $i=1,\dots,N$ which has an attractor [[Manifold]] $A$ defined by:

$$
A(x)=\mathbf{b}+x\mathbf{c} \ for \ x \in \mathbb{R} \ and \ \mathbf{b},\mathbf{c} \in \mathbb{R}^N
$$

Is a line attractor network. In this case, attractor space itself is only one dimensional, even though the network state space is $N$ dimensional.

Simple dynamics definition of such a space(say 3 dimensions).

$$
\begin{align*}
\dot{x}_{1}&=0 \\
\dot{x}_{2} &= -(x_{2} - (mx_{1} + b))  \\
\dot{x}_{3} &= -x_{3}
\end{align*}
$$

this yields a line attractor looking like the following:

![[lineAttractor.png]]

First dimension means the system is stable on the line, second defines *shape* of the line, and third collapses higher dimensions proportionally to its own current value.

These kinds of attractors may not be straight lines. In fact, if the ends of line meet, it is now called a *ring attractor*.

### Cyclic Attractors

Previous attractors, even line attractors, still converge on a single point and stay there. Cyclic attractors focus more on a convergence of a certain "flow" of a dynamical system. This is the **limit cycle**. A simple example would be a harmonic oscillator defined on an attractor [[Manifold]]:

$$
\ddot{x} (t) = -Ax(t)
$$

$x$ is again defined over the attractor space, usually of a much lower dimension than the number of nodes in the network.

![[cyclicAttractor.png]]

[[Forced Damped Pendulum]] is a chaotic [[Dynamical Systems Theory|dynamical system]], however under certain conditions it can act as a cyclic attractor(in this case would be known as a *limit cycle*).

### Chaotic Attractors

Also working over a "flow" or repeated traversal, but instead of converging on an exact flow, instead seems more like "bounded chaos". It settle down to a obvious pattern, but the exact dynamics of said pattern are impossible to predict for long.

Classic example is the [[Lorenz Attractor]], will still pull outward points into its cyclic bounds, but once there will follow a bounded flow that never converges to an exact cycle.

$$
\begin{align*}
\dot{x}_{1} &= A(x_{2}-x_{1}) \\
\dot{x}_{2} &= x_{1}(B-x_{3}) - x_{2}  \\
\dot{x}_{3} &= x_{1}x_{2}-Cx_{3}
\end{align*}
$$

---

## Biological Interpretations

What makes Attractor Networks important in [[Computational Neuroscience]]. We know that neural networks can implement any nonlinear dynamical system, so by extension this includes all attractor networks. One of the biggest goals of [[Computational Neuroscience]] is determining which attractors are important in the pursuit of explaining biological systems.

[[Neural Integrator]]s are a kind of line attractor, used in oculamotyor system to maintain your gaze. Think about turning your head while looking at one thing.
