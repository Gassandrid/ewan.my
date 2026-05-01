---
class:
  - note
tags:
  - curation
  - cs/homelab/data
source:
related:
author:
description:
aliases:
date: 2026-03-01T16:19:12-05:00
updated: 2026-03-04T15:52:30-05:00
---

One of the annoying things that I find myself occupied with is managing the sheer quantity of random pieces of media I find myself saving. Anything from memes to screenshots to random camera photos that somehow ended up in my filesystem, I rack up a ton.

It gives me quite an OCD sense knowing that I have all this stuff which I would love to sort like I do for markdown notes, but cant. Believe it or not, there are basically no programs that have the same kinds of declarative organization techniques that Obsidian offers. Some, like **Eagle.cool**, have similar features, but even then dont quite capture all the neat things like bases and hiearchical tags.

My solution was quite simple: develop a plugin fork of the **Binary File Manager**, that creates sidecar files for each uploaded media. More importantly, this plugin is able to extract important metadata like geographical coordinates and primary colors, such that we can search by  them through the bases menu. This basically gives you access to all the functionality that eagle.cool provides, say the web extension. Im sure you could do something similar with obsidian web clipper but that would take a bit of work.
