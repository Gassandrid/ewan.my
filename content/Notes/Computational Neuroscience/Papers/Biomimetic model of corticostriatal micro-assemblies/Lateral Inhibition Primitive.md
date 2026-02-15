---
created_on: "[[09-17-2025]]"
class:
  - note
tags:
  - comp-neuro/models
  - todo/comp-neuro
source:
  - "[[Biomimetic model of corticostriatal micro-assemblies discovers new neural code]]"
related:
  - "[[Biomimetic model of corticostriatal micro-assemblies]]"
author:
date: 2025-09-17
updated: 2025-11-13
---
The "Lateral Inhibition" primitive comes from the paper [[Biomimetic model of corticostriatal micro-assemblies]]

## Anatomical Configuration

The **Lateral Inhibition Primitive** is composed of an assembly of excitatory and inhibitory neurons in a simulated cortical layer. The configuration includes:

In plain english, this means that any excitatory neuron that gets activated will activate the inhibitory neuron, which then inhibits all other excitatory neurons. This creates a "winner-takes-all" effect where only the most active neuron can respond.

![[LateralInhibition.png]]

_(B) Lateral inhibition primitive closeup. This cortical assembly is composed of four excitatory cells and one inhibitory cell. As input signals arrive, voltage builds up in the cells based on the number of active inputs and synaptic connections. The most-activated excitatory cell reaches threshold first (1), then activates the local inhibitory cell (2), which inhibits all excitatory cells (3). This creates a "winner-takes-all" effect where only the most active cell can respond._

---

For the learning task described here, one important primitive is “lateral inhibition” which takes place within each small assembly of cortical neurons. The anatomical configuration of this computational primitive is an assembly of excitatory and inhibitory cortical neurons shown in Figure 1B. These local assemblies of excitatory and inhibitory neurons in simulated superficial cortical layers are connected such that 1) each glutamatergic input axon (from the simulated visual cortex or any cortico-cortical input) makes contact sparsely with a fixed number of excitatory target dendrites and 2) each excitatory dendrite receives contacts from a separately fixed number of incoming axons. Furthermore, 3) the excitatory cells densely contact local inhibitory cells (in a ratio of about 4:1), and 4) the inhibitory cells reciprocally make dense contacts with local excitatory cells (21–23). Within a local assembly, an activated excitatory neuron activates the inhibitory neuron, which then inhibits all other excitatory neurons (including the one that activated the inhibitation). Thus a very limited subset of target excitatory cells can successfully respond to an input; this “lateral inhibitation” primitive corresponds to the long-known neuronal activity pattern of a specific kind of “winner-takes-all” competitive circuitry. (24–31). Multiple such lateral-inhibition assemblies are present in the cortical structures (visual regions and anterior cortex) in the model, and they are sparsely interconnected with each other, as briefly illustrated in Figure 1C, and discussed in Methods. The evolution of neuronal activity in these assemblies starts with an in

