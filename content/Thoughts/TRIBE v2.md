---
source:
  - https://ai.meta.com/blog/tribe-v2-brain-predictive-foundation-model/
  - https://ai.meta.com/research/publications/a-foundation-model-of-vision-audition-and-language-for-in-silico-neuroscience/
image: https://www.google.com/s2/favicons?domain=https://ai.meta.com/blog/tribe-v2-brain-predictive-foundation-model/&sz=256
class:
  - website
  - note
tags:
  - website
  - cs/ai
  - comp-neuro/models
related:
  - "[[Zuna]]"
  - "[[TRIBE v2 model architecture and implementation]]"
date: 2026-03-30T09:53:06-04:00
updated: 2026-07-30T10:54:32-07:00
description: A Predictive Foundation Model Trained to Understand How the Human Brain Processes Complex Stimuli
---

Foundation model trained with [[NeuralSet]] for predicting [[fMRI]] activations conditioned on embedded semantic stimulus; could be video via [[V-JEPA 2.1]], audio via wav2vec, text via llama, or Bert for images.

What makes this model of particular interest is the idea of [[In Silico]] experimentation; given that we have a reasonable approximation for human spatial brain activity, we can probe the model/stimulus for changes in its output.

- I explored this a bit in [[Maximizing Activation through Differentiable Content Consumption]], like others, where we walk the gradient on a frozen tribe v2 to turn the objective arround: producing video stimulus that create the maximum possible activation in a given region of the brain.
	- This is also being explored in new papers like **[NEvo](https://nevo-project.epfl.ch/)**

---

## Clipped Source

Understanding how the human brain processes the world around us is one of the greatest open challenges in neuroscience. Breakthroughs here could transform how we understand and treat neurological conditions affecting hundreds of millions of people — and improve AI systems by directly guiding their development from neuroscientific principles.

Today, we're announcing TRIBE v2: our first AI model of human brain responses to sights, sounds, and language. Building on our [Algonauts 2025 award-winning model](https://arxiv.org/html/2508.10784v1), which was trained on the low-resolution fMRI recordings of four individuals, we leverage a massive dataset of more than 700 healthy volunteers who were presented with a wide variety of media, including images, podcasts, videos, and text. TRIBE v2 reliably predicts high-resolution fMRI brain activity — enabling zero-shot predictions for new subjects, languages, and tasks — and consistently outperforms standard modeling approaches. By creating a digital model of the human brain, researchers can rapidly test hypotheses about its underlying functions without the need for human subjects in every experiment.

To accelerate the pace of neuroscience discovery and open up new avenues for clinical practice, we’re sharing a research paper, along with model weights and code, under a CC BY-NC license. We also invite everyone to explore TRIBE v2 on our demo website. By sharing this work, we hope to help accelerate neuroscience research that will unlock scientific and clinical breakthroughs for the greater good.

**Read the Paper**

https://ai.meta.com/research/publications/a-foundation-model-of-vision-audition-and-language-for-in-silico-neuroscience/

**Download the Code**

https://github.com/facebookresearch/tribev2

**Download the Model**

https://huggingface.co/facebook/tribev2
