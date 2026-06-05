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
updated: 2026-05-12T22:53:25-04:00
---

[[Probing Nurture with Content Consumption]] treats content diet as the action space for steering cognitive state. the timescale is slow: days to weeks for a measurable shift in what your cognitive graph looks like. tDCS introduces a second action channel that operates at a completely different timescale, within a single session, hours. 

empirical picture here from the literature is surprisingly clean for brain stimulation research. three papers I was recommended in the *NooTopics Discord* converge on the same finding: left anodal tDCS over P3 (the electrode position that sits over the intraparietal sulcus, the part of posterior parietal cortex most directly involved in numerical magnitude processing) reliably enhances arithmetic performance, specifically subtraction and number comparison. left hemisphere only, not right, not bilateral. [[@hauserEnhancingPerformanceNumerical2013]] is the original clean demonstration of this. [[@hartmannAnodalHighdefinitionTranscranial2025]] uses HD-tDCS which is more spatially focal than conventional, and it replicates the effect with better precision. twenty-six papers in a 2022 systematic review [[@lazzaroUnderstandingEffectsTranscranial2022]] come to the same conclusion with some nuance: tRNS (random noise stimulation) is also robust, and tACS might be better specifically for arithmetic *learning* as opposed to performance, which is a meaningful distinction.

what tDCS actually does at the neural level: anodal stimulation shifts resting membrane potential toward depolarization, roughly 0.1-1 mV under typical current densities (~1 mA, 25 min). that's subthreshold, it doesn't fire anything directly. but it lowers the threshold for firing in response to inputs, making the neural population under the electrode more reactive to whatever signals are already arriving. for the IPS, that means numerical representations become easier to activate.

in Friston's terms this is precision modulation. [[Active Inference]] treats cognition as the process of minimizing variational free energy, which in practice means the brain maintains a generative model and continuously updates it to reduce prediction error. the precision parameters weight how much to update vs how much to trust priors. raising the gain on IPS predictions effectively increases the precision of numerical representations, making them drive perception and action more strongly. you're not changing what the model knows, you're changing how confidently it knows it. the [[Free Energy Principle]] framing makes it natural to see tDCS as a lever on the precision of specific subsystems, separate from the slower process of updating the model itself.

---

the 40% non-responder problem is where this becomes an ML problem rather than just a hardware one. in [[@hartmannAnodalHighdefinitionTranscranial2025]], only 60% of participants showed RT facilitation under left tDCS. the sources of this heterogeneity are understood to be:

- skull geometry and tissue conductivity (determines actual current density reaching IPS from a given surface electrode placement)
- cortical folding pattern (P3 maps to different gyral anatomy across individuals, and current penetrates differently depending on whether the electrode is over a gyrus vs a sulcus)
- baseline neurochemical state, specifically GABAergic/glutamatergic balance in the target region
- cognitive state at time of stimulation: resting alpha power at P3/P4 is a known predictor of anodal tDCS response, higher alpha (cortical idling) correlates with larger effect

this is a distribution over parameters that determine a response function, and [[BrainAccess HALO|EEG]] gives you access to the most tractable of these predictors: the state-at-time-of-stimulation. pre-stimulation alpha power at P3 is measurable in a 5-minute eyes-closed baseline recording. that's a feature vector you can feed into a model that learns your individual response surface.

the formal setup: you want to learn `f(EEG_baseline, stim_params) -> behavioral_effect` over a session budget of maybe 20-30 total experiments. this is standard Bayesian optimization. each session is one expensive function evaluation, the parameter space is small and structured (current density, duration, online vs offline, electrode position within the P3 neighborhood), and the outcome is a behavioral RT on a standardized arithmetic task. Gaussian Process regression with GP-UCB acquisition handles the exploration-exploitation tradeoff without needing a lot of data. by session 10-15 you have enough to be making informed choices rather than searching randomly.

the output of this experiment is a personalized response surface for yourself, which doesn't exist in the published literature. published studies run open-loop population protocols and report average effects. an n=1 longitudinal study with EEG covariates and BO-guided parameter selection is a genuinely novel data artifact, and it's also exactly the kind of thing [[Isomorph]] is trying to accumulate: dense multi-modal recordings of your own cognitive system under controlled variation.

---

tACS deserves its own treatment because the mechanism is different and arguably more theoretically motivated. where tDCS shifts excitability via DC offset, tACS applies alternating current at a specific frequency and entrains endogenous oscillations toward that frequency. for arithmetic processing, the relevant band is theta (4-8 Hz): theta oscillations in parietal cortex coordinate working memory operations, specifically the binding and manipulation of numerical representations in a working memory buffer. the systematic review finding [[@lazzaroUnderstandingEffectsTranscranial2022]] that tACS outperforms tDCS for arithmetic *learning* (as opposed to performance) is consistent with this: learning involves synaptic plasticity driven by oscillatory coupling between hippocampus and parietal cortex, not just increased excitability.

the interesting personalization angle here is that individual peak theta frequency varies, and it drifts with cognitive state. standard tACS protocols apply 6 Hz to everyone. but if your resting theta peak is at 5.2 Hz today and 6.1 Hz on a higher-arousal day, a fixed 6 Hz might entrain you better some days than others. EEG gives you your current peak frequency before each session. closed-loop tACS that adjusts frequency to match your current state rather than applying a population average is mechanistically more principled, and it's the thing people are starting to do in research settings but nobody's doing for themselves as a personal system.

this connects back to the manifold picture from [[Mapping The Mind]]. oscillatory state isn't just a background condition for cognition, it's part of the geometry of the manifold. the theta frequency at which parietal working memory operates is a structural parameter of how quickly the system can cycle through representational states. if tACS can shift that parameter, it's deforming the manifold in a controlled way. and if [[Takens' Embedding Theorem|Takens' theorem]] lets you reconstruct attractor geometry from time-delayed measurements, then systematic tACS perturbations are a way to probe the local geometry by observing the system's response to a known forcing signal. system identification with your own brain as the dynamical system.

---

the picture that emerges when you stack all of this together: [[Probing Nurture with Content Consumption]] is the slow outer loop that reshapes what's in the cognitive manifold. tDCS/tACS is the fast inner loop that adjusts the accessibility and dynamics of what's already there. [[Isomorph]] is the measurement system that tracks the manifold's evolution across both timescales. the three projects aren't separate, they're the components of a single closed-loop system for cognitive self-modification.

the [[POMDP]] framing from Probing Nurture absorbs this cleanly. add tDCS as a second action dimension:

- hidden state: current latent cognitive state (capacity, mode, topic activation)
- observations: EEG, [[ActivityWatch|behavioral telemetry]], vault topology, task performance
- actions: (content selection, stimulation parameters)
- transition model: p(state_t+1 | state_t, content_t, stim_t)
- objective: reach target state

the transition dynamics under stimulation are faster and more direct than under content manipulation, which changes the structure of the optimal policy. if you need to be in a high-precision numerical reasoning mode in two hours, tDCS is the lever. if you need your generative model to have actually incorporated more mathematical structure, that's a weeks-scale content diet intervention. different timescales, different tools, same model.

---

the [[My Eternal Golden Braid|GEB]] connection is the one i keep coming back to. the self-configuration function as Hofstadter describes it is a function that uses the system's current state as input to set the parameters of the operations that will run on that state. if you close the tDCS loop with EEG, you have exactly that: the brain's own signals determine the stimulation parameters that act on the brain. the system is configuring its own configuration function. that's a physical strange loop with a fixed-point character, and the fixed point is whatever cognitive state the feedback law is designed to reinforce.

the reason open-loop protocols have such high non-responder rates is precisely that they're not running the self-configuration function. they apply a fixed program to a system that has its own dynamics, and for 40% of people the fixed program doesn't happen to match their current dynamical regime well enough to have an effect. the solution to the non-responder problem isn't finding better population parameters, it's closing the loop. personalization at the level of "measure your state, compute the matching stimulation, apply it" is the actual mechanism, and the open-loop population studies are just a proxy for it that works well enough to publish.

---

practically: this doesn't require building anything that doesn't exist. tDCS devices exist and are cheap ( i myself bought the [[NeuroMyst Pro Plus]] ), the electrode protocol is simple (P3 active, contralateral supraorbital reference, 1 mA, 25 min), and the behavioral task from [[@hauserEnhancingPerformanceNumerical2013]] (double-digit subtraction with RT measurement) is maybe 50 lines of PsychoPy. what i have already: [[BrainAccess HALO]] for EEG, [[Tobii ET5]] for attention, [[ActivityWatch]] for baseline context. the infrastructure for the measurement side is mostly there. what's missing is the stimulation hardware and a few weeks of sessions.

the n=1 experiment design: 5-min baseline EEG recording before each session, extract alpha power at P3/P4 and peak theta frequency, run one stimulation session (parameter set selected by the BO acquisition function), run the behavioral task, record the outcome. after 5-6 sessions the GP has enough to start making useful predictions. after 20 you have a personalized response surface that's more informative about your own cognition than any published paper is about you specifically. and because the sessions generate EEG data under controlled perturbation, they're also input to [[Isomorph]] as labeled perturbation experiments for manifold geometry probing.

the broader framing is that i've been measuring the cognitive system passively for years. vault commits, ActivityWatch logs, EEG baselines. tDCS adds controlled perturbations with known parameters. the combination of passive measurement and active perturbation is the standard toolkit for identifying dynamical systems. you can't characterize the system from observations alone if it's always running its natural trajectory. you need to kick it and watch it respond. tDCS is the kick.
