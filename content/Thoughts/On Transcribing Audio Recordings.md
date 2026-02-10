---
date: 2025-11-19
updated: 2026-02-09T19:18:05-05:00
class:
  - note
  - voicenote
tags:
  - voice-note
  - journal/workflow
source:
related:
author:
description: a simple transcription tool i made for rapid journaling
---

>[!Quote] Transcription
> This tool has been around for a while now. I wanted to write about it, given how much I've been using it recently. I have hit a bottleneck in how fast I can type. I type quite fast, and my [[typing]] speed doesn't seem to be increasing anymore, despite me doing more monkeytype practice runs. Now, no matter how fast I could type, nothing could really be faster. then how fast people can talk. And I had seen tools like Whisper Flow that were exceptional at this ability. However, Whisper flow costs money and runs on someone else's server. That makes no sense for such a lightweight program, so I decided to make my own. This uses the Nemo Parakeet model, a very lightweight model from Nvidia, which is great, but I'm on a MacBook Pro. So what I ended up doing was I found a library that does Nemo Parakeet on MLX architecture and created a Python interface that runs in the background so that when I press Alt R, it starts listening. When I stop, it creates a recording and then starts processing it, transcribing it, and putting up my clipboard. The new update I added allows it to start transcribing as I am talking to speed up the transcription time when I finally stop the recording. This is a good feature that has made this an incredibly fast tool and one that I can no longer live without.

Transcriptions will use the callout as show above.
