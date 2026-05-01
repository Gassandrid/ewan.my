---
date: 2025-12-24T00:03:00
updated: 2025-12-30T13:24:50+02:00
class:
  - note
tags:
  - hobbies/coffee
  - math/probability/bayesian
  - journal
source:
related:
  - "[[Kalman Filter]]"
author:
description:
---
Something I have recently become enamored with is the idea of modding [[Espresso]] machines with microcontrollers and digital measurements. Namely for the [[Gaggia Classic E24]], which is an established boiler-based machine, a distinct ecosystem from my thermoblock-based [[Bambino Plus]]. Currently, there are two competing modifications that have captured my interest: the [[Gaggiuino]] and the [[GaggiMate]].

Both projects utilize "fly-by-wire" control, using microcontrollers to close the loop on temperature, pressure, and flow. However, where this led into a parallel of my math side is the algorithms utilized for state estimation. Namely, the [[Gaggiuino]] implementation (and another experiment surrounding "predictive puck wetting") leans heavily on a [[Kalman Filter]].

The challenge they face is non-trivial, in that modeling the hydraulic resistance of a coffee puck is highly non-linear, especially when you account for the compression of gas bubbles in the boiler (acting as a capacitor in an RC circuit). Because of this, a standard linear filter often introduces phase lag. To solve this, we can apply an **Extended [[Kalman Filter]]**, utilizing a [[Jacobian|Jacobian]] matrix to linearize the system at each step. This allows the machine to use noisy pressure and heat values to predict flow rate *before* the sensor confirms it, effectively "hallucinating" the correct state to maintain consistency.

While I will most likely choose the [[GaggiMate]] for its integrations with [[Home Assistant]] and support for a proper scale like the [[BOOKOO Themis mini coffee scale]], the mathematical rabbit hole of the Gaggiuino sent me back into control theory.

Revisiting the subject, I found some really interesting things. For one, Kalman filters parallel [[Predictive Coding]] and [[Free Energy Principle]] implementations exceptionally well. We can think of them as a **Recursive Bayesian Estimator**. 

In terms of neuroscience, a Kalman filter is essentially a mechanistic implementation of the [[Bayesian Brain]] We have our **Internal Model(Prior)**, which is the brain projecting the state forward based on physics (also known as process model). It predicts where the ball *should* be, ignoring the noise of the moment. Next is **the Sensory Input (Likelihood)**, which is like a human eye; providing discrete, noisy measurements. Last is the **Update (Posterior)**, which integrates these two based on their relative uncertainty.

My big parallel came with understanding the Kalman Gain $K$. In the world of neuro, $K$ functions almost as the **Synaptic Precision** or sensory weighting. If sensory noise ($R$) is high, $K$ drops, and the brain relies on its Internal Model (top-down processing). If the Internal Model is uncertain (high Process Noise $Q$), $K$ increases, and the brain relies on the immediate sensory data (bottom-up processing).

The filter works by minimizing innovation (the difference between the measurement and the prediction: $z - H\hat{x}$). This is mathematically synonymous with minimizing **Surprise** or **Free Energy**. I hadn't considered the [[Kalman filter]] to be of particular importance to my [[Computational Neuroscience]] self-study, but it provides a rigid, mathematical framework for how biological agents might balance Process Noise against Measurement Noise.

For now though, I am curious to see if this recursive Bayesian estimation can help me pull a slightly better shot of [[Espresso]].
