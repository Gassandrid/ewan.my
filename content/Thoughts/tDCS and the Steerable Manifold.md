---
class:
  - note
tags:
  - transhumanism/self-configuration
  - quantified-self
  - comp-neuro/neuromodulation
  - generated/claude
related:
  - "[[Self Configuration]]"
  - "[[Probing Nurture with Content Consumption]]"
  - "[[Mapping The Mind]]"
  - "[[Isomorph]]"
  - "[[BrainAccess HALO]]"
  - "[[My Eternal Golden Braid]]"
  - "[[Active Inference]]"
  - "[[Free Energy Principle]]"
description: tDCS as a fast-timescale control input for cognitive self-configuration, integrated with the Probing Nurture POMDP and the Isomorph manifold reconstruction project
aliases:
  - tDCS
date: 2026-04-19T13:17:06-04:00
updated: 2026-11-02T16:08:30-05:00
---

[[Probing Nurture with Content Consumption]] treats content diet as the action space for steering cognitive state, but the timescale is slow: days to weeks. tDCS is a second action channel that works within a single session.

The literature here is surprisingly clean for brain stimulation. Left anodal tDCS over P3 (sitting over the intraparietal sulcus, which is central to numerical magnitude processing) reliably enhances arithmetic, specifically subtraction and number comparison. Left only, not right, not bilateral. [[@hauserEnhancingPerformanceNumerical2013]] is the original demonstration and [[@hartmannAnodalHighdefinitionTranscranial2025]] replicates it with more focal HD-tDCS. A systematic review [[@lazzaroUnderstandingEffectsTranscranial2022]] agrees, and adds that tRNS is also robust while tACS may be better for arithmetic _learning_ than performance.

Anodal stimulation depolarizes the resting membrane potential by roughly 0.1-1 mV (~1 mA, 25 min). That's subthreshold, so it doesn't fire anything directly, it just makes the population under the electrode more reactive to whatever is already arriving.

In Friston's terms this is precision modulation. [[Active Inference]] has the brain updating a generative model to minimize prediction error, with precision deciding how much to update versus trust priors. tDCS raises the gain on IPS predictions: I'm not changing what the model knows, I'm changing how confidently it knows it. The [[Free Energy Principle]] framing makes this a lever on one subsystem, separate from the slower process of updating the model itself.

The 40% non-responder problem is where this becomes an ML problem. In Hartmann only 60% of participants showed RT facilitation, and the heterogeneity comes from:

- skull geometry and tissue conductivity, which set the current density actually reaching IPS
- cortical folding, since P3 maps to different gyral anatomy across people
- baseline GABA/glutamate balance in the target region
- state at stimulation time: resting alpha power at P3/P4 predicts response, with higher alpha giving larger effects

[[BrainAccess HALO|EEG]] gives access to the most tractable of these. Pre-stimulation alpha at P3 comes from a 5-minute eyes-closed baseline, which is a feature vector for learning $f(\text{EEG\_baseline}, \text{stim\_params}) \to \text{behavioral effect}$ over 20-30 sessions.

That's just Bayesian optimization. Each session is one expensive evaluation over a small parameter space (current density, duration, online vs offline, electrode position near P3), scored by RT on a standardized arithmetic task. A GP with GP-UCB handles exploration-exploitation with little data, and by session 10-15 I'd be making informed choices instead of searching randomly. The result is a personalized response surface that doesn't exist in the literature, and exactly the kind of dense multi-modal recording under controlled variation [[Isomorph]] is trying to accumulate.

tACS is different: alternating current entrains endogenous oscillations instead of shifting excitability. The relevant band is theta (4-8 Hz), which coordinates working memory operations in parietal cortex. Its edge for arithmetic _learning_ fits, since learning runs on oscillatory coupling between hippocampus and parietal cortex, not just excitability.

Stacked together, [[Probing Nurture with Content Consumption]] is the slow outer loop reshaping what's in the cognitive manifold, tDCS/tACS is the fast inner loop adjusting the accessibility of what's already there, and [[Isomorph]] measures the manifold across both. The [[POMDP]] from Probing Nurture absorbs this by adding stimulation as an action dimension:

- hidden state: latent cognitive state (capacity, mode, topic activation)
- observations: EEG, [[ActivityWatch|behavioral telemetry]], vault topology, task performance
- actions: (content selection, stimulation parameters)
- transition: p(state_t+1 | state_t, content_t, stim_t)

If I need high-precision numerical reasoning in two hours, tDCS is the lever. If I want a generative model that has actually absorbed more math, that's weeks of content diet.

The [[My Eternal Golden Braid|GEB]] connection is the one I keep coming back to. Self configuration as Hofstadter describes it uses the system's current state to set the parameters of the operations that run on that state. Close the tDCS loop with EEG and the brain's own signals determine the stimulation that acts on the brain, a physical strange loop with a fixed point at whatever state the feedback law reinforces. Open-loop protocols have high non-responder rates because they apply a fixed program to a system with its own dynamics. The fix isn't better population parameters, it's closing the loop: measure state, compute matching stimulation, apply.

Practically, nothing needs building. tDCS devices are cheap (I bought the [[NeuroMyst Pro Plus]]), the protocol is simple (P3 active, contralateral supraorbital reference, 1 mA, 25 min), and the task from Hauser (double-digit subtraction with RT) is about 50 lines of PsychoPy. Measurement is covered by [[BrainAccess HALO]], [[Tobii Eye Tracker 5]] and [[ActivityWatch]].

Each session is a 5-minute baseline EEG, alpha at P3/P4 and peak theta frequency extracted, stimulation with parameters from the acquisition function, then the task. After 5-6 sessions the GP starts making useful predictions, and the EEG from every session feeds [[Isomorph]] as a labeled perturbation experiment.

I've been measuring this system passively for years through vault commits, ActivityWatch logs and EEG baselines. But you can't characterize a dynamical system from observation alone while it runs its natural trajectory. You have to kick it and watch it respond. tDCS is the kick.
