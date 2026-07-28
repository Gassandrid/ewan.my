---
date: 2026-05-26T16:23:21-07:00
updated: 2026-06-17T13:40:21-07:00
class:
  - note
tags:
  - workflow
  - cs/homelab/data/reported
source:
related:
  - "[[On Self Reported Data]]"
author:
description:
aliases:
---

The reality: obsidian is not a great place to record self reported data. I was recording the supplements i took, the meals I ate, my habit checklist, and much more in my [[daily note template]].

This didnt work for a number of reasons, the main one being a lot of these benefit from timeseries data.

In the age of LLM coding, I decided to just go ahead and vibe out some slop mobile app and sideload it as a developer test app. It is quite simple, just allows me to record the supplements I take, how much of them I take, and what time. This information is inhererently object oriented, and obsidian properties ( the way I was tracking it before ) just wasnt cutting it. 

- I had a `supplements` property before that would just have list items ( `creatine, vitamind d3, zinc, etc` ).  These have no context over dose, or more importantly timeseries data.
	- Timeseries is of particluar importance. If we have timeseries data of drugs and supplements we take, we can observe direct impacts via [[Garmin and Timeseries Health Data]] through [[Garmin Venu 4]]. Take a stimulant? See immediate HR and HRV effects.

This is not a complicated change, but something worth documenting in the pursuit of the [[On Capturing Personal Data|Quantified Self]] dream.
