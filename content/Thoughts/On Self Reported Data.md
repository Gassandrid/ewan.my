---
title: On Self Reported Data
class:
  - note
tags:
  - generated/claude
  - quantified-self
  - cs/homelab/data
  - health/tracking
  - OCD
related:
  - "[[On Capturing Personal Data]]"
  - "[[Store Now Utilize Later]]"
  - "[[Habit Tracking Via Daily Note]]"
  - "[[Garmin Venu 4]]"
  - "[[Polar H10]]"
  - "[[OMRON 3 Series Upper Arm Blood Pressure Monitor]]"
  - "[[Dexcom Stelo]]"
  - "[[ActivityWatch]]"
  - "[[BrainAccess HALO]]"
  - "[[AirGradient ONE]]"
  - "[[At Home Bloodwork]]"
date: 2026-05-24
updated: 2026-07-28T16:08:22-07:00
aliases:
  - Self Reported Data
---

My current problem is not that my [[On Capturing Personal Data|Quantified Self]] system lacks the data, it is that the actual missing data is usually the small semantiic event explaining the passive streams. Things like the supplements and drugs i took, what I ate, my exact excercises for that day, etc. These are not hard to capture, however they cannot be captured *latently* -- they must be **self reported**. My issue, thanks to my lovely neurodivergence, is that I cannot stick to thise through obsidian for the life of me. What I believe to be the issue, however, is the recording medium and not the act itself.

Self report should therefore be treated as an annotation layer, not the primary substrate. Garmin, ActivityWatch, environmental sensors, EEG, eye tracking, audio/transcripts, calendar, and lab records are better at continuous measurement. Self report is valuable where machines cannot infer intent, dose, meaning, or context.

## The Split

Obsidian is great for natural language, and will repain the reflective capture surface. Daily notes capture what I did, and some summary of my cognitive state for the day. However I am done with recording the self reported streams described above ( substances, food, excercises, etc ) in the daily note, and have made a simple phone app for this instead ( see [[Self reported data via phone app]] ).

The eventual canonical store should still be the personal-data monorepo under `~/DATA` or the homelab successor. That layer should store durable timestamped events, sensor streams, provenance, and exports. It should not require Obsidian to become a time-series database.

The iPhone app should sit between these layers. Allows for the checkbox items I already had, e.g. sauna / morning skincare. Also can record other things that are self reported at least for the current moment like weight. This also has plenty of room for extention in the future as a self report interface, while also capturing other latent features about the way I self report the data ( like the time I do the checkboxes ).

I will still have the bad habit declaration in the daily note ( might change this ), as this is something I will typically write about in the journal contents.

## Calendar As Scaffolding

The useful pattern is a protected daily reconciliation block: check the daily note, add missing intervention events, and resolve obvious gaps while the day is still recoverable. Calendar can also define planned-vs-actual structure, which becomes useful when compared against [[ActivityWatch]], Garmin, location/place context, and manual events.
