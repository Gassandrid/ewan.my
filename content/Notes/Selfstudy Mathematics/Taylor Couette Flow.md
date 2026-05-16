---
class:
  - note
tags:
  - math/chaos
  - math/calculus/differential
  - physics
source:
related:
author:
description:
aliases:
date: 2026-04-30T12:29:23-04:00
updated: 2026-05-12T22:40:35-04:00
---

Fluid motion between two rotating concentric cylinders. Fundamental problem in fluid dynamics, setup usually has an **inner cylinder** of radius $R_{i}$ and **outer cylinder** of radius $R_{o}$. Then you have the gap in between, usually liquid or a gas.

- As inner cylinder spins, the fluid is dragged along by friction  (viscosity). The flow evolves through distinct stages as the rotation speed increases.
	-  Steady Laminar Couette Flow (Low Speed); at low speeds flow is smooth and stable, rotates as rigid rings with velocity increasing from zero at the ouer wall to to the cylinder speed at the inner wall
		- velocity profile  $v_\theta(r) \propto \frac{1}{r}$ (roughly, depending on geometry)
	-  Taylor Instability (Moderate Speed); as rotation increases, centrifugal forces on the fluid partidles become stronger, fluid tries to fly outward, but viscous forces try to hold it to the rotating wall.
		-  at critical speed, centrifugal force overcomes stabilizing effect of viscosity and becomes unstable
	-  Wavy Vortex Flow (Higher Speed); if gap is closed and the rotation increases more, taylor vortices become unstable to some wave like perturbayions. rolls deform and wave around
	- Turbulent Regime (High Speed); vortices break down compltety, flow becomes chaot ic and turbulent. heat transfer and mixing in this regime are significantly higher than in the laminar regimes

Onset of [[Chaos]] within this flow often characterized by [[Lorenz Attractor]] type equations.

![[taylCouetteFlow.png]]

**Reynolds Number ($Re$):** Measures the ratio of inertial forces to  viscous forces.

$$
Re = \frac{\Omega R_i D}{\nu} 
$$

*(Where $\Omega$ is rotation speed, $D$ is gap width, $\nu$ is kinematic viscosity.)*

**Taylor Number ($Ta$):** This is the specific stability parameter for Taylor-Couette flow. It measures the ratio of centrifugal forces to viscous forces in the gap.

$$
 Ta \propto Re^2 
$$

The flow remains laminar below a **critical Taylor Number ($Ta_c$)**. Once  $Ta > Ta_c$, the instability sets in.
