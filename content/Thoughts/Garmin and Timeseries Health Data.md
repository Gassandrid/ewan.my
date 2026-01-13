---
class:
  - note
tags:
  - cs/homelab/data
  - cs/data-science
  - transhumanism/longevity/biomarkers
  - projects/homelab/hardware
  - projects/homelab/software
source:
related:
author:
description: using GarminDB to integrate data into homelab
updated: 2026-01-07T12:43:54+02:00
date: 2025-12-30T12:57:58+02:00
---

For Christmas, I got the watch that I had been looking at for forever: the [[Garmin Venu 4]]. I have been harping on about my [[On Capturing Personal Data]] plan for a few months now, but this was the first step in the Quantified Self Equipment that I can make genuine progress with.

This represents the big step towards a constant stream of high delta timeseries data. Along with [[AirGradient ONE]] and [[ActivityWatch]], I can now track second by second changes over long periods of time without significant effort on my part. Having this form of sub second, constant data flow, even if it is basic biomarkers/metrics, is the most important base towards [[Longevity]] improvement and eventual endeavors like [[Withings Body Scan]] and [[At Home Bloodwork]].

**Why the Garmin**? It came down to a few factors, namely subscriptions services and data access. For what I found, the [[Garmin Venu 4]] seems to be the best combination of a solid sensor array and watch that also doesnt require any subscription to use like Whoop. In addition, I found out later that the export options for Garmin are actually quite exceptional. Yes, it is still going through their servers and cloud which annoys me, but in exchange I am given an export endpoint that is not tied to physical distance from the watch, meaning I can just run a daily job on my [[New Year Homelab Updates and Plans|Homelab]] that exports all new data straight to a sqlite database called [[GarminDB]].

For the case, it just means I can leave my watch be, with its sync with my phone to the Garmin app. Then, as long as it is syncing correctly, GarminDB will take incrementall pulls from the garmin servers to integrate into my monorepo. Some thing I might add later to my [[Grafana]] dashboard is a custom fullstack docker container, [[garmin-grafana]], which manages visualization and fetching for me.
