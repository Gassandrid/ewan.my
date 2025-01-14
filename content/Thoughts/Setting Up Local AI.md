---
date: 2025-01-03
updated: 2025-01-14
tags:
  - ai
  - ollama
  - flux
title: Setting Up Local AI
aliases:
  - ollama
  - oobabooga
  - huggingface
---

This has nothing to with my [[Migrating my Quartz, DARS, and media to one big Homelab Server|homelab]] project, however a lot of the decisions I make might influence the [[Brainstorming Software Stack|software]] infrastructure of some of the servers.

---

## Local LLM

The inference provider isn't really a difficult choice, as Ollama.cpp and the ollama models in general just dominate in the field of local level LLMs with their modest sizing. I am only pushing for running the 8b/11b models on my own laptop, but maybe if I push hard enough I could probably squeeze out enough performance to run one of the 70b models on the home lab? Not sure yet, and if I did, it would certainly be very slow ( likely ~ `1.5 t/s` ).

As for UI/middleware, there are two main options that stand out to me right now:

### [oobabooga/text-generation-webui](https://github.com/oobabooga/text-generation-webui?tab=readme-ov-file)

- This one is without a doubt the best overall, but requires a lot of tinkering/work to make it perfect
- I have also heard that using this as a semi-backend in combination with [SillyTavern](https://github.com/SillyTavern/SillyTavern) work really well

### [huggingface/chat-ui](https://github.com/huggingface/chat-ui)

- This one requires much less work, but has really good web searching capabilities which negates a lot of the faults/weaknesses of the 8b/11b models that can struggle with hallucinations due to their low parameter count.

### [open-webui](https://github.com/open-webui/open-webui)

> [!Success] Current Choice

- More recent find, seems to have all the capabilities I need and has the added bonus of looking really nice as well. Also has the most stars on github out of the 3.

*I sourced my decisions from [this reddit post](https://www.reddit.com/r/LocalLLaMA/comments/1847qt6/llm_webui_recommendations/)*

### Choosing the Right Model

This is an ever-changing choice, as the LLM landscape is quite volitile and always improving. Some reasonable choices right now are:

1. Llama, 3.1 8B, 3.2 11b, etc
	- This is a strong all around choice, 3.1 is a little dated, 11b is a good vision model
2. Gemma 2 9B
	- Great for its parameter count, id say slightly better choice than llama 3.1 right now, but if you want a strong model I would go with a little more parameters. Maybe good for one of the laptops in the [[Proxmox on old Macbooks|Proxmox Cluster]] 
3. Phi 4 14b
	- even for its size, one of the best "reasoning" models right now. most recent so also one of the most up to date out of the bunch.

---

## Local Image Generation

Image + other types of media generation have a lot more variety when it comes to the actual models you can run. As of now though, I think I am going to stick with [Flux](https://huggingface.co/black-forest-labs/FLUX.1-dev), as while the new [Stable Diffusion 3.5](https://huggingface.co/stabilityai/stable-diffusion-3.5-large) has the potential to one day be better than flux, as of right now Flux is a much more complete diffusion model, and has the added benefit of being extremely reliable with text and hand generation.

However the UI sphere has been a lot more confusing for me to grasp, so I am picking two that I think are the best in their own categories.

### [comfyanonymous/ComfyUI](https://github.com/comfyanonymous/ComfyUI?tab=readme-ov-file#manual-install-windows-linux)

> [!Success] Current Choice

In my opinion, this is probably the most *capable* UI as of this moment in terms of features and complexity. However, it also seems to be the most difficult to learn to use, and doesn't just "work out of the box" like a lot of the other UI's.

### [mcmonkeyprojects/SwarmUI](https://github.com/mcmonkeyprojects/SwarmUI)

Made by the same people as ComfyUI, but with the intention to be more usable and in the likeness of automatic1111 web-ui, which was also the inspiration behind [[Setting Up Local AI#[oobabooga/text-generation-webui](https //github.com/oobabooga/text-generation-webui?tab=readme-ov-file)|oobabooga webui]].

---

## Next steps

Now that I have gotten enough of an Idea of how I want my model architecture to look, it is time to plan out how to implement it for my [[Migrating my Quartz, DARS, and media to one big Homelab Server|Home Server]] project. Because I chose [[Setting Up Local AI#[open-webui](https //github.com/open-webui/open-webui)|open webui]], docker integration is already recommended, which allows me to package this in a server as possibly a Kubernetes cluster, having the similar models run in parallel as separate docker containers.
