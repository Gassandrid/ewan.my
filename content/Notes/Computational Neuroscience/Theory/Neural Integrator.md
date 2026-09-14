---
date: 2026-02-09T10:28:23-05:00
updated: 2026-09-11T10:38:00-04:00
class:
  - note
tags:
  - comp-neuro/circuits
  - comp-neuro/theory/dynamics
source:
related:
author:
description:
aliases:
  - Path Integration
---

a [[Neural Circuit]] in the brain that accumullates and and stores motor/sensory information over time, converts input velocity into persistent output position.

- neural integrators in the oculomotor system are involved in the control of horizontal eye position across a wide variety of species, including fish and humans

Neural intergrators are actually [[Attractor Network#Line, Ring, and Plane Attractors|line attractor]] networks. terms line attractor and neural intergrator are often used interchangeably, however they describe the difference between the network state space and the attractor space.

> These networks are called 'integrators' because the low-dimensional variable (e.g., horizontal eye position) x(t) describing the network's output reflects the integration of the input signal (e.g., eye movement velocity) v(t) to the system.

![[IntegratorNeuroOculomotor.png]]

---

## [[09-11-2026]] Update: Sharing This Note for [[Neural Integrator|Path Integration]]

- **Path Interation** is an internal brain process that tracks location and direction by updating the self motion signals like that of speed and head rotation over time ( see the neural integrator example above, which uses this to keep eye stability despite head rotation ). 
- feeds continuously into a [[Private/Inbox/Cognitive Map|Cognitive Map]], helping humans/animals navigate space, calculate shortcuts, and update their positions without needing visual landmarks ( quite reminiscient of stuff with [[Grid Cells]], [[Place Cells]], and even the [[Kalman Filter]] under the odd context of its applications everywhere, see [[Coffee, Kalman Filters, and Predictive Coding]] )

[[NeuroMechFly v2 simulating embodied sensorimotor control in adult Drosophila]] [@wang-chenNeuroMechFlyV2Simulating2024] constructs biologically inspired controllers that use ascending feedback to perform [[Neural Integrator|Path Integration]] and head stabilization.
