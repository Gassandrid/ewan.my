---
class:
  - note
  - voicenote
tags:
  - seed
  - cs/ai/latent-space
  - projects/temporal-vault-sync
  - cs/homelab/data
source:
related:
  - "[[Vault to Youtube Cross Synchronization]]"
  - "[[Using ActivityWatch Data for Temporal Vault Project]]"
  - "[[On Capturing Personal Data]]"
  - "[[Brainstorming Data Science Temporal Project#4. Youtube Data]]"
  - "[[Scraping My Youtube History#Future Plans]]"
author:
description:
date: 2025-11-17
updated: 2025-11-17
---

This is just an idea I was thinking about. I don't know if I actually plan on implementing it, but given all the data that I have been collecting of my own YouTube video activity and the fact that it is time series, in that A, I see which one I see after one another, and also I see how long or how much attention I put into that video, given that it tracks all the different window switches I do with [[ActivityWatch]]. I was thinking if I could find a way to embed these YouTube videos, say with a natural language summary that Gemini provides for YouTube videos or another source, then I could embed those in the latent space, create a path or a phase diagram for the path I take, and scale by my attention, which might have to be calculated in an interesting way, to get an overall path of where I go. This could then be projected down with UMap to see any interesting insights. Probably not an interesting idea, which is why I'm just marking this as a seed note, but if I do, it will be an interesting link to implement.
