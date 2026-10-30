---
class:
  - note
tags:
  - healthtrac
  - math/waves/signals
source:
  - https://en.wikipedia.org/wiki/Mel-frequency_cepstrum
related:
author:
description:
aliases:
  - MFCC
  - MFCCs
  - Mel-frequency cepstrum
  - Mel frequency cepstrum
  - Log Mel Spectrogram
date: 2026-10-02T15:46:13-04:00
updated: 2026-10-29T09:39:22-04:00
---


- coefficients collectively make up the **MFC**.
	- derived from a type of cepstral [[Representation]] of the audio clip ( [[Nonlinear]] "spectrum of a spectrum" )
- commonly used for speech recognition feature systems, for example systems that an recognize a spoken number over a telephone.

we should test if [[Mel-frequency cepstral coefficients|MFCCs]] are a valid algorithm for [[HealthTRAC]] project, and evals on the [[Temporal Dynamics]]

[[smithSpeechAcousticMarkers2025]] [@smithSpeechAcousticMarkers2025]

## [[10-29-2026]] Nemotron 3.5 Transcribe

This new model actaully uses a log mel spectrogram for encoding waveforms for the transformer to process!

- Rich transcription: 10 timed event tags (laughter, breath, throat/cough, effort/strain, crying, mouth noise, pause, shout, gesture noise, sung vocals) and 11 speaking-style spans (flat, vocal texture/delivery, vocal intensity/pitch, sadness/regret, calm/reflective, uncertainty/surprise, fear/urgency, positive affect, anger/contempt, social intent, authority/assertion). The word-timing model's vocabulary includes these tags, so they should get times. NVIDIA released this with no quantitative evaluation, trained on 2.3k annotated hours.
- Other prompted tasks: the transcript with disfluencies removed, transcribing only the speaker nearest the microphone, keyword-boosted ASR, language ID, and question answering about speech and sound.
- Measured accuracy: gender 88%, intent 90%, emotion 60%, age 30% (unusable).
- Fine-tuning is where the clinical value is. The report fine-tuned 17 tasks at 0.5–2.3 GPU-hours each: