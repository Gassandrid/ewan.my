---
title: Cloudflare Tunnels - The temporary solution
date: 2025-03-21
updated: 2026-03-13T14:00:18-07:00
tags:
  - projects/homelab/software
  - cs/web/tunneling
  - projects/homelab/dorm
---

 While the home server project has been going well as far as local deployments, I have yet to properly expose this network to the internet, for a few reasons.

 ---

## University Wifi

My university Wi-Fi is not only WPA2-Enterprise, but it is also quite a large network for which I don't really have any control over( for good reason! ) and as such I cannot just expose a port to the internet like one might traditionally do.

For this reason, it is not feasible to expose my home server network to the internet directly, as I just dont know how I could really forward internet packets through the uni wifi. There are always options like [[OpenWRT]] but those are a bit overcomplicated for my usecase.
