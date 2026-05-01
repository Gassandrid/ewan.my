---
date: 2026-02-02T10:51:50-05:00
updated: 2026-04-23T09:42:48-04:00
class:
  - note
tags:
  - math/waves/signals
source:
  - https://docs.astropy.org/en/latest/timeseries/lombscargle.html
  - https://en.wikipedia.org/wiki/Least-squares_spectral_analysis
related:
author:
description:
aliases:
---

for analysis of timeseries signal to attempt to find and classify periodic signals, except unlike [[Fourier Transform]] approaches, it works in an unevenely sampled/missing data environment. In essence, use like [[Discrete Fourier Transform]]/[[Fourier Transform]] in cases where observations are **unevenely spaced** or noisy.

- means it can handle irregular sampling and wont accumulate bias by interpolating missing data.   
- equivelant to a least squares fit of sine/cosine functions to data.
- all frequencies from lombscargle are not **angular frequencies**, rather frequencies of oscillation (num cycles per unit time)

![[scargleVsFourier.png]]
