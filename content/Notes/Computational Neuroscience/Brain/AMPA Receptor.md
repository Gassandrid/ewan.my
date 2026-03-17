---
date: 2026-02-08T15:48:06-05:00
created_on: "[[03-13-2026]]"
updated: 2026-03-16T10:05:37-04:00
tags:
  - comp-neuro/brain/receptor
class:
  - receptor
  - note
source:
  - https://www.sciencedirect.com/science/article/abs/pii/S0091305710004077
  - https://academic.oup.com/brain/article/129/3/564/390904
related:
  - "[[TAK-653]]"
author:
description: Ionotropic glutamate receptor mediating fast excitatory synaptic transmission; central driver of LTP and synaptic plasticity.
aliases:
  - AMPA
type: ionotropic glutamate receptor
upstream:
  - glutamate
downstream:
  - calcium influx
  - LTP
  - BDNF signaling
inhibitors:
  - NBQX
  - CNQX
  - perampanel
activators:
  - glutamate
  - AMPA (α-amino-3-hydroxy-5-methyl-4-isoxazolepropionic acid)
distribution:
  - cortex
  - hippocampus
  - cerebellum
  - striatum
subunits:
  - GluA1
  - GluA2
  - GluA3
  - GluA4
pams-used:
  - "[[TAK-653]]"
  - cyclothiazide
  - aniracetam
agonists-used:
  - glutamate
  - AMPA
antagonists-used:
  - NBQX
  - CNQX
  - perampanel
---

[[Glutamate]] is endogenous agonist. AMPA ($\alpha$-Amino-3-hydroxy-5-methyl-4-isoxazolepropionic acid) is a **synthetic** compound used for selective activation of the corresponding receptor, how it got the name name. no endogenous role.

- primary mediators of fast excitatory synaptic transmission in the [[Central Nervous System]]
- Glutamate binding opens channel, allows for Na⁺ in and K⁺ out, produces fast [[EPSP]]

>[!Warning] AMPA
> No point in making a whole note for AMPA individually, receptor is important but synthetic compounds entire life is that it is a selective agonist for this kind of receptor - also what defines the receptor itself.

## Synaptic Plasticity

AMPA receptors are the primary readout of [[LTP]] expression:

1. High-frequency stimulation activates [[NMDA Receptor]]s ($Mg^{2+}$ block removed by depolarization)
2. $Ca^{2+}$ influx activates [[CaMKII]]
3. CaMKII phosphorylates GluA1 (Ser831) and drives AMPAR insertion into the postsynaptic density
4. More synaptic AMPARs = larger EPSP = potentiated synapse

**Silent synapses** contain only NMDARs and no AMPARs. They're functionally silent at rest because the $Mg^{2+}$ block prevents NMDAR activation. LTP converts them by inserting AMPARs, making the synapse active.

- [[LTD]] reverses this: dephosphorylation drives AMPAR internalization and synapse weakening.
- Receptor traffickinig gated by TARPs (transmembrane AMPAR regulatory proteins), particularly stargazin, which handles synaptic targeting and anchoring to PSD-95.

---

## AMPA Positive Allosteric Modulators (sirsadalot)

An AMPA PAM works by increasing the likelihood of information processing neurons, or spiking neurons, to fire electrical signals. This is a cascade set off by glutamate binding, which is a pivotal transaction in times of learning. This enhanced calcium signaling will cause long term potentiation (LTP) which strengthens memory and improves learning.[^1] 

However, AMPA PAMs have an interesting characteristic: in non-human primates, the increased connectivity from spiking neurons in cortical association regions then activated the precuneus when it would normally be dormant. This is a significant finding, as it indicates entirely new abilities would be possible when otherwise limited by connectivity.[^2] Interestingly, the precuneus is crucial for episodic memory and human consciousness, and is normally active in a rested state. [^3]

AMPA PAMs are split into two groups: low impact and high impact. Low impact AMPA PAMs preferentially block extracellular domains that deactivate the receptor,[^4] while high impact AMPA PAMs may also enhance agonist binding to AMPA, as a traditional PAM would.

Classic AMPA PAMs include [[TAK-653]], Psilocybin, and Ketamine, however [[TAK-653]] is much more acute in its focus.

[^1]: https://sci-hub.hkvisa.net/https://www.sciencedirect.com/science/article/abs/pii/S0091305710004077?via%3Dihub
[^2]: https://sci-hub.hkvisa.net/https://www.sciencedirect.com/science/article/abs/pii/S0091305710004077?via%3Dihub
[^3]: https://academic.oup.com/brain/article/129/3/564/390904
[^4]: https://sci-hub.hkvisa.net/https://www.sciencedirect.com/science/article/abs/pii/S0091305710004077?via%3Dihub
