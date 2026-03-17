---
aliases:
  - Glu
  - L-glutamate
created_on: "[[02-25-2026]]"
class: neurotransmitter
type: amino-acid
upstream:
  - "[[Glutamine]]"
  - "[[Alpha-ketoglutarate]]"
downstream:
  - "[[AMPA Receptor]]"
  - "[[NMDA receptor]]"
  - "[[Kainate receptor]]"
  - "[[mGluR1]]"
  - "[[mGluR2]]"
  - "[[mGluR3]]"
  - "[[mGluR5]]"
inhibitors:
  - "[[mGluR2]]"
  - "[[mGluR3]]"
  - "[[Fasoracetam]]"
activators:
  - depolarization
  - calcium-dependent exocytosis
distribution:
  - "[[Neocortex]]"
  - "[[Hippocampus]]"
  - "[[Cerebellum]]"
  - "[[Thalamus]]"
  - "[[Basal Ganglia]]"
reuptake-transporter:
  - EAAT1 (GLAST)
  - EAAT2 (GLT-1)
  - EAAT3 (EAAC1)
degrading-enzyme:
  - glutamine synthetase
tags:
  - comp-neuro/brain/neurotransmitter
  - pharmacology/neuro
date: 2026-02-25T14:10:35-05:00
updated: 2026-03-17T14:56:42-04:00
---

Primary excitatory neurotransmitter in the vertebrate [[Central Nervous System]]. If [[GABA]] is "brakes", glutamate is "accelerator", virtually every fast excitatory synapse runs on it. Synthesized primarily from [[Glutamine]] via [[Glutaminase]] in the presynaptic terminal, and secondarily from the TCA cycle intermediate $\alpha$-ketoglutarate via transamination.

## Receptors

Two primary classes acted through; **ionotropic**(fast/ligand) and  **metabotropic**(slow/GPCR)

### Ionotropic

**[[AMPA Receptor]]**:  mediates bulk of fast EPSPs. Primarily $Na^{+}$/$K^{+}$ permeable; GluR2 subunit determines $Ca^{2+}$ impermeability. Rapid kinetics, millisecond timescale. main vehicle for information throughput.

**[[NMDA receptor]]**: coincidence detector. Requires two conditions simultaneously: ligand binding (glutamate + glycine co-agonist) *and* membrane depolarization to expel $Mg^{2+}$ . Once open, it's highly $Ca^{2+}$ permeable, making it the entry point for plasticity signals. This is the biophysical substrate of [[Hebbian learning]]; synapse strengthens when pre- and postsynaptic activity coincide. *fire together wire together!*

**[[Kainate receptor]]**;  not as well studied. mostly presynaptic modulation / interneuron circuits. Contributes to high frequency bursting, [[seizure]] susceptibility.

### Metabotropic

Three functional groups based on coupling and location:

| Group | Receptors                      | Location                 | Effect                           |
| ----- | ------------------------------ | ------------------------ | -------------------------------- |
| I     | mGluR1, mGluR5                 | postsynaptic             | excitatory (Gq/IP3/$Ca^{2+}$)    |
| II    | mGluR2, mGluR3                 | presynaptic autoreceptor | inhibitory (Gi, reduces release) |
| III   | mGluR4, mGluR6, mGluR7, mGluR8 | presynaptic              | inhibitory (Gi)                  |

Group II autoreceptors are the endogenous feedback mechanism: excess synaptic glutamate activates mGluR2/3, which suppresses further vesicle release. [[Fasoracetam]] exploits this to reduce glutamate tone systemically.

## Synthesis and Recycling

doesn't freely diffuse in and out, majority is recycled through **glutamate-glutamine cycle**. 

astrocytes surrounding synapse take up released Glu via EAATs (primarily EAAT2/GLT-1, which accounts for ~90% of CNS glutamate clearance), convert it to glutamine via [[glutamine synthetase]], shuttle it back to the presynaptic neuron where glutaminase reconverts it. 

keeps extracellular glutamate at nanomolar levels; necessary, because tonic receptor activation at higher concentrations is excitotoxic.

## Role in Plasticity

[[LTP]] and [[LTD]] are cellular substrates of learning / memory, both gated by [[NMDA receptor]] activation. 

sequence: high-frequency stimulation -> [[AMPA Receptor]] mediated depolarization -> $Mg^{2+}$ unblock -> $Ca^{2+}$ influx through [[NMDA]] -> CaMKII activation -> [[AMPA Receptor]] phosphorylation and trafficking -> strengthened synapse. 

LTD is  reverse: low-frequency, mild Ca²⁺ elevation activates phosphatases instead.

[[TAK-653]] and [[ACD-856]] act downstream of this by potentiating AMPA receptor kinetics, amplifying the depolarization step and the downstream BDNF/mTOR cascade.

## E/I Balance

Glutamate and [[GABA]] are intrinsically coupled: pyramidal cells (glutamatergic) drive [[GABAergic interneurons]], which in turn inhibit pyramidal cells. ratio of excitatory to inhibitory tone determines whether circuit oscillates, fires tonically, or silent. Disrupted E/I balance partially behind schizophrenia (NMDA hypofunction -> disinhibition), epilepsy (excess excitation),  implicated in autism spectrum disorder.

## Excitotoxicity

main mechanism behind strokes, along with neurodegenerative disease progression/TBI

Pathological glutamate release; from ischemia, trauma, or EAAT failure, causes sustained NMDA activation, massive $Ca^{2+}$ influx, and mitochondrial dysfunction.
