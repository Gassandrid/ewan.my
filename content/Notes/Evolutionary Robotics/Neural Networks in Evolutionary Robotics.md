---
class:
  - note
  - lecture
tags:
  - university
  - cs/robotics
  - cs/ai/evolution
source:
  - https://docs.google.com/presentation/d/1i_oSSYrBOtCddVihGQ-OZHgF03XPNZQ_NCyXGu4JGDc/edit?slide=id.p16#slide=id.p16
related:
author:
description:
aliases:
course: "[[Evolutionary Robotics]]"
lecture-number: 4
date: 2026-01-22T08:34:57-05:00
updated: 2026-01-22T08:57:21-05:00
---

We return to [[A short history of AI]], were we had a brief look at **[[A short history of AI#Vehicles|Braitenberg]]** Vehicles. While we learned about how the inputs and outputs connected to form emergent behavior, we now need to generalize the concept of "neurons" and "connections" to build more complex systems.

---

## Neural Networks

Few terms to introduce:

- **Pre-synaptic neuron**: the neuron sending the signal
- **Post-synaptic neuron**: the neuron receiving the signal
- **Neuron activation**: the level of activity of a neuron, often represented as a number between 0 and 1
- **Synapse**: the connection between two neurons.

In more standard machine learning, we just refer to these as "neurons" and "connections".

![[BraitenbergNeurons.png]]

In the case of the **Braitenberg** vehicles, we had 4 neurons, two inputs and two outputs. There were no "deep" layers or connections, and all the connections did was "criss cross" the inputs and outputs with a particilar weight.

In more traditional neural networks, we usually see the previous layer neurons have a connection to every single neuron in the next layer. We then let training tune the **weights** of these connections to produce the desired output.

There are two "tunable" parameters for each connection:

1. **Weight**: Parameter for the _connection_ between the pre-synaptic and post-synaptic neuron. This determines how much influence the pre-synaptic neuron has on the post-synaptic neuron. It is a multiplicative factor.
2. **Bias**: This is an additive parameter that gets added to the sum of all the weighted inputs to the post-synaptic neuron. It allows us to shift the activation function left or right, which can be crucial for learning.

We then apply the activation function to the weighted sum of inputs plus bias to determine the final output of the post-synaptic neuron.

### Activation Functions

This is were things get a bit more novel. In the case of the **Braitenberg** vehicles, the activation function was simply **linear** - the more input you had, the more output you got. However, in more complex neural networks, we often use non-linear activation functions to introduce complexity and allow the network to learn more intricate patterns.

![[ActFunctionsRobotics.png]]



