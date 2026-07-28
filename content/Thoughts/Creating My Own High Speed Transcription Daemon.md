---
date: 2025-11-11
updated: 2026-07-22T15:59:52-07:00
tags:
  - cs/python
  - cs/ai/speech
  - seed
  - projects/aletheia
class:
  - note
source:
related:
  - "[[On Transcribing Audio Recordings]]"
author:
description: a simple python daemon leveraging nemo parakeet for fast transcription
---

A sad realization I have come to is that I have kind of reached a point with [[Typing]] where the returns are in fact, diminishing. Even though I have gotten to an impressive average of around `160` wpm, this is still not really enough to keep up with the speed at which I think, and at which my OCD tendancies require that I write things down.

I was getting some ads for a solution to this called **Whispr Flow**. It was posed as a transcription service that trully allowed you to speak as fast as you possibly could think, without worrying about accuracy. This sounds perfect.

However, this unfortunately ends up being a "freemium" service ( limited free plan ), and it is also **not local!** *Dealbreaker*. I need this voice recognition service to run on my own computer, which is not a big ask as these models are incredibly lightweight nowadays

---

Basically what I did was wrap nvidea's NeMo parakeet model with a hotkey, so that I can call it and transcribe instantly. Quality is near perfect, but not only that but it runs completely locally thanks to a fork of the project called Parakeet-mlx.

Not only that, but because of its incredible accuracy, I can talk really fast unlike anything I've I've ever been able to do with previous transcription models. I don't have to enunciate with my words, I can speak as fast as I want, as I am doing here as a test, and it's working incredibly well.

This preceded my work on [[Aletheia]] and 24/7 audio transcription.

---

## [[07-22-2026]] Replacing Hotkey Transcription

This isn't touching my twenty four-seven transcription engine project. However, for my hotkey based Parakeet model, I have decided to stop using that and instead use Fluid Voice, which actually uses the same underlying NVIDIA parakeet model, but is a lot more consistent and dynamic in the way that I've been trying to get it to work.
