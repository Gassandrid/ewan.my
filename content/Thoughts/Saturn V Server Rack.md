---
tags:
  - engineering/3dprinting
  - projects/homelab/hardware
  - cs/homelab
  - projects/homelab/apartment
  - tree
date: 2025-08-31
updated: 2026-01-18T08:29:32-05:00
class:
  - note
source:
related:
  - "[[Global Homelab Management]]"
author:
description:
aliases:
---
My current primary **homelab** as per se - it is feature complete in terms of hardware now, the only thing I could really see to add now would be a zig-bee dongle and and SDR for passive RF monitoring. Most work now consists of [[Saturn Rack Software]].

---

## Finished Product

Now that the server rack has been completed, the main task is to build the [[Brainstorming Software Stack|Software Stack]], such that all computers are being evenly distributed. The [[Cyr]] mini pc has the most ram and is the most capable pc in terms of compute, so most services should be focused there. [[Tysis]] is the NAS, only has an intel n100 and thus docker services should not be hosted here, instead having cyr services point to tysis for their data stores.

![[saturnRack.png]]

---

## Hardware

3 main clients:

### [[Tysis]]

The NAS of the system. It is a **[[Beelink ME Mini NAS]]** running NixOS. Serves as the store for all the other services, but also runs [[Home Assistant]] and [[Immich]].

### [[Talkamar]]

An old macbook bro, but has a good deal of ram and a solid CPU. I dont really run anything on it right now, but it is also running NixOS. It is mainly a backup node for when I need to do maintenance on the other pcs.

### [[Cyr]]

The workhorse of the system. Another beelink mini pc, 32gb ram and an 16 thread cpu. Currently running Debian, but I plan to move it to NixOS as well. This is where most of the docker services are running. Things like [[coredns]], my homepage, [[Graphana]], [[Prometheus]], and much more.

For hardware I can stick with the stuff i have for now, but eventually want to invest in a full solution like the video below:

<https://www.youtube.com/watch?v=wbRViRwflbI>

I want to implement 3d min pc nodes with the structure from [[This homelab setup is my favorite one yet.]]

I am thinking of two [[Venus UM790 Pro Mini PC]]'s and a mini nas like the [[Beelink ME Mini NAS]] which is perfect for a 10 inch rack. However, I do not yet have a need for any more compute, so the **priority would be setting up the mini nas beelink.**

---

## Software

Software is documented at [[Saturn Rack Software]], but the main things would be some basic NAS/cloud storage tech, but also room for experiments etc.

### Pieces to Print

I like some of the ideas for mountings from [this video](https://www.youtube.com/watch?v=t5ZMkzbdSR8), namely the ones for the mini pcs, will look into them.
