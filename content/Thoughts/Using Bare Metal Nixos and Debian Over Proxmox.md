---
title: Using Bare Metal Nixos and Debian Over Proxmox
date: 2025-01-28
updated: 2026-01-18T08:30:29-05:00
tags:
  - cs
  - projects/homelab/software
  - projects/homelab/dorm
---
This idea was born from the fact that during the process described in [[Bridging my University Wifi to host own network access point]], I noted that it would be quite difficult to assign static IP's without access to the router myself.

Given that this is a WPA2-Enterprise University network, I doubt that I am getting acesss to that any time soon. One possibility that I looked at in that Document is the idea to use my local router to assign something of a static ip and have traffic go through there, but despite my best efforts that has not yielded any results(thanks again to WPA2-Enterprise).

This led me to the idea to just consider running the laptop cluster as baremetal linux machines. This has a lot of benefits, especially regarding complexity, as it means I have to do a lot less infrastructure stuff given what I have. Not only that, but given that a lot of these machines are quite poor performance, it might be for the best to run bare metal to save on memory.

---

## Docker Containers

This all comes together in the fact that my main method of operation is already going to be through docker containers and Kubernetes, so I was thinking about just how much of a benefit would I see wrapping that in yet another virtualization layer, given my memory contraints?

Not only that, but immutable distros like NixOS offer the same benefits of running virtual machines, as I can declaratively manage the state of the machine in a near perfect manner. I like the idea of running both NixOS machines and debian ones, for a mix of production systems and experimentation systems(like the raspberry pi).

---

I still want to learn Proxmox, and I do think it is by far the best option in the field for the larger systems. But given the circumstance and my constraints, it would be wasteful and overly complex for what would otherwise be a pretty small home lab system.
