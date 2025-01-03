---
date: 2025-01-02
updated: 2025-01-02
tags:
  - homelab
  - cs
type: project
title: Brainstorming Software Stack
---

Looking for a general purpose Linux sandbox hosting environment, containers, vms, etc. This could either be through hypervisors/k3s-nix, not sure yet.

Good Reddit thread covers my questions: 

- https://www.reddit.com/r/homelab/comments/167luly/looking_for_advise_on_beginner_home_server/

## Ideas

- **Proxmox** as hypervisor software on lowest level
	- Can run **Home Assistant as well** - https://tteck.github.io/Proxmox/#proxmox-ve-tools
- **Home Assistant** as the end-all-be-all top level management for all the systems.
	- This gives me a great one place dashboard to control everything as well as monitor the systems on the homelab as well

### Ai Software

[[DARS]] although might as well **just use home assistant LLM integration - ** https://www.youtube.com/watch?v=op9_hM1TpeU




- local AI LLM running stuff, art generator and home assistant with llm, etc
	- comfyui for flux?
	- sillyTavern + llama.cpp backend

## Homelab Software Services

**Homelab Services List:**
- https://www.reddit.com/r/homelab/comments/10zsjt6/what_services_do_you_run_in_your_homelab/