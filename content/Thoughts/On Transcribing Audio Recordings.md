---
date: 2025-11-19
created_on: "[[11-19-2025]]"
updated: 2026-03-13T15:32:01-07:00
class:
  - note
  - voicenote
tags:
  - journal/workflow
  - projects/HealthTRAC
  - cs/ai/speech
source:
related:
author:
description: a simple transcription tool i made for rapid journaling
aliases:
  - Transcription
---

**Trancription** is simply the process of turning human speech into text. While mostly an easy and solved problem through [[Artificial Intelligence]], there are a few edge cases like the [[Cocktail Party Problem]], where overlapping speakers (people tend to slightly interupt each other) make it difficult to parse speech. Humans can do it because they have learned to focus on a select sample of speakers, so even though the cocktail party is loud and filled with speech, you still understand the people you are talking to perfectly.

---

## Transcription in My Workflow

made myself a little tool with nvidieas parakeet nemo model, using the MLX version to run on apple silicon, bound to alt+r to transcribe my speech to clipboard.

>[!Quote] Transcription
> This tool has been around for a while now. I wanted to write about it, given how much I've been using it recently. I have hit a bottleneck in how fast I can type. I type quite fast, and my [[typing]] speed doesn't seem to be increasing anymore, despite me doing more monkeytype practice runs. Now, no matter how fast I could type, nothing could really be faster. then how fast people can talk. And I had seen tools like Whisper Flow that were exceptional at this ability. However, Whisper flow costs money and runs on someone else's server. That makes no sense for such a lightweight program, so I decided to make my own. This uses the Nemo Parakeet model, a very lightweight model from Nvidia, which is great, but I'm on a MacBook Pro. So what I ended up doing was I found a library that does Nemo Parakeet on MLX architecture and created a Python interface that runs in the background so that when I press Alt R, it starts listening. When I stop, it creates a recording and then starts processing it, transcribing it, and putting up my clipboard. The new update I added allows it to start transcribing as I am talking to speed up the transcription time when I finally stop the recording. This is a good feature that has made this an incredibly fast tool and one that I can no longer live without.

Transcriptions will use the callout as show above.

---

## [[03-13-2026]] Update - [[HealthTRAC]]

neat thing is I now get to do a lot of work with [[On Transcribing Audio Recordings|Transcription]]/[[Diarization]] for my [[Undergraduate Research]]. This will be playing around a lot more with the [[Mathematics]] side of transcription. Looking at a lot of algorithms, and even lead me into better understand [[Hidden Markov Models|Hidden Markov Model]] implementations through [[Viterbi decoder]]s and the [[Forward Backward Algorithm]].
