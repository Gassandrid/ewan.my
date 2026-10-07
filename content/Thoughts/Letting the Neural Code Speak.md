---
source: https://enigma-brain.github.io/letting-the-neural-code-speak/
image: https://www.google.com/s2/favicons?domain=https://enigma-brain.github.io/letting-the-neural-code-speak/&sz=256
class:
  - website
  - note
tags:
  - website
related:
status: none
author:
  - "[[Sophia Sanborn]]"
date: 2026-09-04T19:18:29-04:00
updated: 2026-09-14T16:01:37-04:00
---

This is a recent project, in part, done by [[Sophia Sanborn]] at Stanford. What really speaks to me about this is the idea of [[In Silico]] models again. This is reminiscent of what I've been doing with [[Maximizing Activation through Differentiable Content Consumption]] and the work with [[TRIBE v2]]. Specifically, the idea that you train deep learning models to predict the activity of naturalistic stimuli, and then take that model and then reverse the process to find what makes that model activates to regenerate stimuli and even find stimuli that would maximize activation. This is influencing me a lot in that is starting to define the kind of work I imagine myself doing as I plan my PhD.

In that, I mean that I see myself taking a path towards working to make representation models ( like my [[On Doing EEG Work|EEG Representation Model]] but also using sparse sources of cognition as described in [[Mapping The Mind]] ), and then treating these models as [[In Silico]] for [[Mechanistic Interpretability]] surrogates to understand what our brains our encoding. This should suggest a path forward with encoder models, likely self supervised ones.

---

## Page Content

### Prediction Isn't Understanding

The classical view of a visual neuron is a feature detector that fires when its preferred stimulus appears and remains largely silent otherwise. In early visual cortex (V1), this view has been remarkably productive -- where neurons behave like oriented edge filters. But the classical feature detector picture says little about the other side of a V1 neuron, what silences it.

Moving up the visual hierarchy, to midlevel visual cortex (V4), what excites and supresses a neuron becomes harder to pin down. Neurons respond to complex conjunctions of shape, color, and texture. We know this from decades of painstaking experiments, each testing a hand-crafted hypothesis about what a single neuron might prefer. The approach works, but it doesn't scale, and it has not produced a general vocabulary for selectivity. We believe natural language can help fill that gap.

Deep learning has begun to change this paradigm, where a network trained on a neuron's responses to thousands of natural images can predict its response to almost any new image with high accuracy. These "digital twins" of visual cortex let us screen millions of images in seconds, and better probe what drives and suppresses a neuron.

But knowing which images drive a neuron isn't the same as knowing what it's tuned for. The digital twin is accurate in predictions but does not provide a human interpretable description of what the neuron encodes.

### Functional Digital Twins of Visual Cortex

A convolutional network turns an image into features, and a small learned readout maps those features onto the predicted firing rate of a single biological neuron. Trained on high-resolution recordings from macaque V1 and V4, these models generalize well to images the neuron has never seen.

Using this approach, we recently found that the most activating images for a given neuron are perceptually coherent, clustering around a consistent visual feature. So are the least activating images, for neurons with high baseline firing rates (non-sparse neurons). For more on the recordings and digital twin architecture underlying this work, see [Franke & Karantzas et al., 2025](https://enigma-brain.github.io/dual-feature-selectivity/).

![How the digital twin is trained to predict real neuron responses](https://enigma-brain.github.io/letting-the-neural-code-speak/images/Figure_Overview_legacy.jpeg)

**Training the digital twin.** A deep network learns to map natural images to the recorded spiking responses of real neurons, yielding an in-silico model that reproduces each neuron's selectivity and can be queried with arbitrary stimuli.

![Full pipeline overview: Translate, Hypothesize, Verify](https://enigma-brain.github.io/letting-the-neural-code-speak/images/Fig_Overview.png)

**Framework overview.** The pipeline translates neural selectivity into semantic hypotheses and validates them through generative testing. Each stage is automated and scalable to hundreds of neurons.

### Casting Vision to Language

Rather than comparing images directly, we first convert each one into an exhaustive text caption specifying precise colors, textures, spatial arrangements, and lighting conditions. Language models are far more reliable at finding patterns across many descriptions than vision models are across raw images, particularly when the relevant features don't correspond to clean semantic categories. We confirm that these captions are faithful with a text-to-image round-trip test: images regenerated from a caption are consistently more similar to the original than to unrelated images, so little visually relevant information is lost in translation.

![Rainbow Lorikeet](https://enigma-brain.github.io/letting-the-neural-code-speak/images/lorikeet.png)

Gemini 3.0 Pro — Dense Captioning

![V4 translation validation](https://enigma-brain.github.io/letting-the-neural-code-speak/Figures/Fig_Translate.png)

**Caption faithfulness.** A round-trip reconstruction test confirms that dense captions preserve visually relevant information. Images synthesized from captions are consistently more similar to their originals than to unrelated images in DINO embedding space.

Stage 2

## Semantic Hypotheses of Neural Selectivity

With captions in hand for a neuron's most- and least-activating images, a language model identifies the theme that unifies each set and writes a concise, testable claim for each: what drives the neuron, and, for neurons with a high baseline firing rate, what suppresses it. In V1, these descriptions recover the canonical vocabulary of early visual cortex: oriented edges, spatial frequency, and contrast polarity, without any visual neuroscience built in. In V4, they capture richer conjunctions of curvature, color, and texture, including object-like structures such as eye-shaped forms set against organic backgrounds.

Because it recovers these known V1 properties on its own, the pipeline passes a positive control: it works where the answer is largely known, before it is trusted where the answer is not. The figures below focus on the richer V4 case; the full V1 results and figures are reported in the [paper](https://arxiv.org/pdf/2605.12485).

![V4 semantic hypotheses](https://enigma-brain.github.io/letting-the-neural-code-speak/Figures/Fig_Hypothesis.png)

**V4 semantic hypotheses.** Top-activating images are identified via the digital twin and their captions distilled into interpretable selectivity descriptions. Examples show diverse feature conjunctions including eye-like structures, curved edges, and textured surfaces.

## Language Preserves the Geometry of Neural Selectivity

If language truly captures neural selectivity, it should also reflect how neurons relate to each other. That is, neurons with similar tuning should end up with similar descriptions. We tested this using representational similarity analysis, asking whether neuron-to-neuron similarity patterns in neural activity space are preserved in language embedding space.

They are, partially. Neural activity aligns strongly with visual feature embeddings (*r* = 0.52 in V4) and more modestly with language (*r* = 0.36). Text is a lossy compression of the visual signal, but faithful enough that images regenerated from hypotheses largely restore the alignment (*r* = 0.49). The descriptions are consistent enough across the population to preserve the structure of the neural code through a different modality.

![V4 cross-modal alignment RSA](https://enigma-brain.github.io/letting-the-neural-code-speak/Figures/Fig_Alignment.png)

**Cross-modal alignment.** RSMs across six embedding spaces show consistent block structure. Image–caption alignment is strongest (r = 0.67), and neural responses to hypothesis-generated images preserve the original selectivity structure (r = 0.49 in V4).

## A Semantic Cartography of Neural Selectivity

Projecting V4 neurons into two dimensions using population activity similarity and annotating each with keywords from its semantic hypothesis reveals smooth transitions across the embedding. Neighborhoods contain neurons whose descriptions share vocabulary. Individual neurons tile localized, semantically coherent regions. Language embeddings can serve as a coordinate system for navigating neural selectivity space: rather than characterizing neurons one at a time, we can identify functional clusters, interpolate between known tuning profiles, and predict which neurons should respond to novel feature combinations.

![UMAP semantic clustering](https://enigma-brain.github.io/letting-the-neural-code-speak/Figures/Fig_Cluster.png)

**Semantic structure of neural selectivity.** *Left:* UMAP embedding annotated with nouns and adjectives from each neuron's hypothesis, showing smooth transitions from eyes and organic forms to geometric textures. *Right:* Individual neurons tile localized, semantically coherent regions with smoothly varying activation.

### What This Opens up

For most neurons in macaque areas V1 and V4, selectivity is expressible in words precisely enough to generate new images that push the neuron's predicted response to either extreme, driving it or suppressing it. The approach requires no prior domain knowledge, which matters for where neuroscience is heading. Large-scale recording technologies are opening access to cortical areas with no established stimulus vocabulary, and a framework that operates on arbitrary natural-image responses and returns testable descriptions is well suited for discovery in exactly those regions.

The natural next step is a fully agentic workflow, where experimental outcomes drive decisions about what to probe next, iterating toward a hypothesis rather than generating one in a single pass. Digital twins make that inner loop cheap: an agent can query predicted responses to arbitrary stimuli at negligible cost, running hypothesis generation entirely in silico before any biological experiment is needed. This is where models become real partners in discovery. Here we characterize neurons at a scale no experiment could reach, so that the human work, asking the right questions and making sense of the answers, can go further than it could alone.
