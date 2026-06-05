---
class:
  - note
  - journal
tags:
  - cs/homelab/data
  - cs/data-science
  - journal
source:
related:
author:
date: 2025-10-01
updated: 2026-01-28T09:47:31-05:00
---
I have been thinking about how and what I actually want to capture in terms of my own data using my homelab. I love the idea of capturing what I watch, which isnt hard to do thanks to google takeout. However, I feel like this doesnt capture the full picture of my online activity, and I want to do this for other services like Instagram, twitter, etc.

This is just an idea, but I have been thinking the easiest way to do all of those would just be to track the browsing history of my main computer [[Alarais]]

This actually would not be too hard to work with, as Firefox/Zen just uses a sqlite database file called `places.sqlite`, although I need some time to learn my way around it.

Not sure if I will actually pick up this idea, but it makes sense given the work I have been doing with [[Scraping My Youtube History]] and [[Brainstorming Data Science Temporal Project]]. I could do a variation of the [[Vault to Youtube Cross Synchronization]] where I use the browsing history as the expected predictor of notes - this has the advantage of including most of the youtube videos I watch in the data set anyway, and the research I do for said notes.

## Update - Just Use [[ActivityWatch]]

Much better timeseries data, and tracks well with external apps as well.
