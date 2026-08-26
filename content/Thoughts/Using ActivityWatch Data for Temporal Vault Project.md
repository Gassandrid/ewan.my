---
class:
  - note
tags:
  - projects/temporal-vault-sync
source:
related:
  - "[[ActivityWatch]]"
  - "[[Temporal Vault Research Proposal]]"
author:
date: 2025-10-23
updated: 2026-08-23T13:35:09-07:00
---

This is just an idea for now, but I have been thinking that the new data collection method I have set up called [[ActivityWatch]] would serve as not only an excellent temporal dataset (website/window interactions can be treated as firing rate spikes, given how often I switch around), but also as a cross correlation comparission with the more traditional [[Vault to Youtube Cross Synchronization]] and the original [[Preliminary Vault Tag and Timeseries Analysis]] data.

![[FiringRateActivityWatch.png]]

Not only that, but because of the nature of the fact that we can associate custom vector emdeddings for some streams, like that of the browsing URL data. This could easily be converted into a natural language embedding for most sites, and players like youtube often provide a natural language description of the video as well.

---

- [[03-13-2026]] Update: this has some application in the [[Isomorph]] project, as we are seeking to perform global cross synchronization. A little different from [[Vault to Youtube Cross Synchronization]], as instead of just youtube we will have other web activity to track. We will have to implement custom input templates though.
- [[08-23-2026]] 13:32 update - while quite beyond this project, I have been thinking of novel ways to utilize activity watch content consumption data, mainly youtube videos. While embedding before was largely an idea to be done through the transcript or other methods of natural language extraction, [[TRIBE v2]] has show how much can be done with [[On Doing EEG Work|EEG Representation Model|Representation models]] like [[V-JEPA 2.1]], a [[Self Supervised Learning|Self Supervised]] approach to embedding videos. Should still do the natural language seperately however as [[Large Language Model|LLM]]s still have the best ways for representing higher order thought.
