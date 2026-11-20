---
date: 2026-03-30T09:58:45-04:00
updated: 2026-11-20T01:51:52-05:00
class:
  - note
tags:
  - cs/data-science
  - quantified-self
  - neuro/methods
  - comp-neuro/models
  - research
source:
related:
  - "[[On Capturing Personal Data]]"
  - "[[Tracking EVERYTHING I do on my computer]]"
  - "[[Exploring Personal EEG Solutions]]"
  - "[[Zuna]]"
  - "[[TRIBE v2]]"
  - "[[Isomorph]]"
  - "[[Probing Nurture with Content Consumption]]"
author:
description: reconstructing the latent state of a mind from sparse, noisy views of the same system, (and steering it?)
aliases:
---

- [[11-19-2026]] had this private for a while despite being on my front page.... mainly because I feel looking back on this writing as a little megalomaniacal. regardless Im making it public anyway because it reveals the foundations of my obsession with such matters in pursuing research.
	- it also reads quite odd in connecting ideas, partly because I had a desire for everything to lie on some manifold of purpose, and just wrote a paragraph for every note of importance that had culminated in this "epiphamy"
	- more recently I would say the epiphamy focus has moved to methods of recovering information in these efforts, rather than just data hoarding for its own ends. I still value quantified self and practice it every day, but now with the lens that the most *informative information about a system is when it is under duress*.

The hardest part of trying to introspect on your own mind ( [[Metacognition]] and other vices ) is that you are never able to step outside of the loop to see as an external observer. Every measurement you take is contaminated by the measuring instrument. Instead what we are left with are *projections* of our internal cognitive state seen through the actions we take, a lossy compression of something happening within the substrate that is only [[Partially Observable Markov Decision Process|partially observable.]]

A great example of a cognitive substrate/projection is my vault right here. Every note I write is a trace of my own internal cognitive state at that point in time: to some extent what I write is tracking what I am thinking. The links of the vault even encode associative structure, taking discrete samples of how concepts connect for me ( a bit like an empirical distribution converging on the true one the more you sample, with the catch that I only sample what I bother to write down ), which should get closer to my own association network as I take more and more samples, enriched with [[Vault Link Timeseries Analysis|git timeseries data]]. [[ActivityWatch]] is also one: not exactly what I was thinking, but rather what I was doing or [[Consuming and Choosing Content Effectively|consuming]] at that point in time. The video I am watching at a given time point, assuming concentration, is also a pretty good approximation of what dominates my higher order cognition.

Many of my [[On Capturing Personal Data|Quantified Self]] endeavors capture substrates like this. [[Using an Eye Tracker for more computer data|Eye tracking]] gives me a spatial attention approximation, where gaze lands, the dwell times that distinguish engagement from passive scanning, and even a read on whether [[Utilizing Cognition Enhancement Effectively|cognition enhancement]] did anything via [[Saccadic Peak Eye Velocity]] ( an arousal and fatigue marker drug studies already use ). So is [[On Doing EEG Work|EEG]], giving us the summed electrical field of [[Synchronization in Chaos|synchronized]] cortical populations ( mostly dendritic currents, not spikes ), quite noisy ( I have a 4 channel [[BrainAccess HALO]] ) but regardless still carrying signal about cognitive mode/ arousal/ [[Attention]] state.

none of these is the mind on its own, but each is a sparse, noisy view of the same latent trajectory, and reconstructing that trajectory is the project.

---

an idea from [[Dynamical Systems Theory]] captures this intuition for me quite well, [[Takens' Embedding Theorem]]. If some deterministic dynamical system produces a scalar time series, you can reconstruct its attractor ( up to a smooth change of coordinates ) from time-delayed copies of that one signal alone. a mind is not that system though, it's high dimensional, noisy, and constantly driven by its inputs, so Takens is an [[Intuition Pump]] here rather than a guarantee. what I'm actually doing is closer to multi view latent inference: each sensor is a different noisy view of the same latent state, and a good reconstruction is one that can predict a held out view from the others ( the same move [[Barlow Twins]] and [[Joint Embedding Predictive Architecture|JEPA]] make, and [[CEBRA]] makes for neural data ). [[Latent Factor Analysis via Dynamical Systems|LFADS]] is the closest neuro version, inferring latent dynamics from spiking with a learned dynamical system.

my attempt at codifying this has been through my project [[Isomorph]], which started more as a productivity tool to make language models know you better. but it has evolved now into more of the [[Isomorph Ontology]], even going beyond the cognition substrates above to also wrapping in the [[Longevity]] of the [[On Capturing Personal Data|Quantified Self]] project ( through [[Garmin and Timeseries Health Data|wearables]] and [[At Home Bloodwork|bloodwork]] ). The longevity case here is that personalized n=1 data projects are a lot more accessible thanks to [[Large Language Model]]s, along with deep learning advances to make the most of cheap sensory information ( think the [SensorFM](https://research.google/blog/sensorfm-towards-a-general-intelligence-and-interface-for-wearable-health-data/) wearable foundation model from google for representation enrichment ).

I think another exciting development here is the idea of *in silico* experimentation. [[TRIBE v2]] predicts fMRI responses to video, audio and text, trained across 700+ people, so it can stand in for a brain you don't have in a scanner. I explore this in [[Probing Nurture with Content Consumption]] but also [[Maximizing Activation through Differentiable Content Consumption]], where we can treat this model as a probe into the various brain regions and how they respond to content. Seems to be gaining traction in academia as well with papers like [[NEvo]], which searches for videos that maximally drive a chosen visual region.

By embracing the [[Store Now Utilize Later]] philosophy, we can run our content history through something like [[TRIBE v2]] ( or an alternative encoder model like [[Laya]] [@panchavatiLayaLeJEPAApproach2026], a [[LeJepa]]/[[Joint Embedding Predictive Architecture|JEPA]] approach to [[On Doing EEG Work|EEG]] latent [[Representation Geometry|representation]] ). Important note here is subject conditioning our own model, as initially these are only population level, and TRIBE predicts fMRI while my headset records EEG, so the bridge between the two is a model in itself. Even with a subpar 4 channel headset like my own [[BrainAccess HALO]], we can use something like [[Zuna]] ( a [[Diffusion in Machine Learning|diffusion]] [[Variational Autoencoder|autoencoder]] ) to denoise and fill in missing channels in one pass, as long as I remember the filled in channels come from population priors and can't carry information my 4 electrodes didn't. I like to think of this as a bracket on the prior measurement problem; one sharpens our expectation, while the other sharpens the observation.

i think about this in the context of directionality a lot. My favorite example is the relationship between individual neuron spikes and neural rhythms. Individual [[Neuron]] [[Action Potentials|spike]]s add up to population [[Neural Oscillation]]s ( Gamma, Delta, [[Theta Rhythm]], etc ), but in turn the phase of these oscillations affects an individual neuron's proclivity to spike. In the same way, I see it in this loop, where cognition shapes content consumption ( you want to seek what you already are interested in ), but in turn content consumption shapes cognition ( you become what you feed your mind ).

I have a few methods for evaluating probes like [[Utilizing Cognition Enhancement Effectively]] and [[Probing Nurture with Content Consumption]], namely [[Chess]] and [[Spaced Repetition for Learning Optimization|Anki]]. Chess is an easy one, as in the [[Self Configuration For Chess]] method we can extract a lot of feedback signal using chess engines to evaluate on a per move basis beyond just game outcomes. This can steer content that is lacking in strategy, and evaluate compounds that are both for long term results via plastogens and more "inference time" enhancers for things like working memory etc.

---

the arrow runs both ways, and that is what [[Probing Nurture with Content Consumption]] is really after: not just that content and cognition move together, but which one moved first. a longitudinal record helps ( years of vault commits, [[ActivityWatch]] logs, eventually [[On Doing EEG Work|EEG]] ), because at least I can ask what changed, when, and what came right before it. timing alone won't give me causation though, both directions leave the same correlational fingerprint. what does is intervening: change the content on purpose and watch what moves ( [[Understanding Through Perturbation]] ). the n=1 version of this is just a trial on myself, switch an intervention on and off in blocks and compare.

this is the [[Store Now Utilize Later]] bet. the state I'm in right now won't stick around, the version of me running this in two years will be shaped by everything in between. the only reason I'll be able to ask what drove that change is that the snapshot gets taken now, to be read later by models that don't exist yet. the vault already has this property ( [[Vault Link Timeseries Analysis|link velocity]] and topic concentration over time are readable ), physiological data just makes each snapshot denser.

the endpoint I want isn't a dashboard, it's a model of the latent state that all these streams are views of, good enough to predict the next view. the test is easy to state: hold out one stream ( tomorrow's EEG, or which videos I end up picking ) and predict it from the rest. if that works the latent is real enough to steer with, given a target state, search for the content diet that gets there ( the same trick [[NEvo]] plays on visual cortex, just on myself and over weeks instead of seconds ). two caveats keep this honest:

- the inverse is many to one, lots of different diets land on the same state, so it's a control problem and not running the model backwards
- once I optimize a proxy like chess accuracy it stops being a clean measure ( [[Goodhart's Law]] ), which is why I want more than one eval

[[Karl Friston|Friston]]'s [[Active Inference]] is the obvious frame, an agent acting on its environment to keep its sensations in line with its model of the world. probing nurture is a bit different though, I'm curating the environment so that the model itself changes, which is closer to learning or [[Niche Construction|niche construction]] than to inference. I don't want to stretch the [[Free Energy Principle|free energy]] analogy further than that.

---

I've done a crude version of this already, deliberately saturating my feed with math content until hard problems became something I wanted to do rather than avoided ( [[On adopting an obsession with Mathematics]] ). it seems to have worked, but it was one uncontrolled run: no baseline, a vague success criterion, and no way to separate the content from everything else changing in my life at the time. closing that gap is the point of the whole project.

the strange loop here is the one [[Gödel, Escher, Bach]] keeps circling. I'm using the cognitive system to build a model of the cognitive system: the vault recording the research is also its main dataset, and the brain writing these notes is the brain being measured. this is the same problem I started with, the instrument sits inside the loop, and it has a practical side too, knowing I'm being measured changes what I do ( measurement reactivity ). you can't step outside, so you build the instruments in, account for them as part of the data, and look for the fixed points.
