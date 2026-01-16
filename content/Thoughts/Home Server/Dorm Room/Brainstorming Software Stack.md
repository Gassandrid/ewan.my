---
date: 2025-01-02
updated: 2026-01-12T10:24:32-05:00
tags:
  - cs
  - projects/homelab/software
title: Brainstorming Software Stack
class:
  - note
---

 Found a great list of usefull software services to run:

 <https://github.com/TechHutTV/homelab>

Looking for a general purpose Linux sandbox hosting environment, containers,

vms, etc. This could either be through hypervisors/k3s-nix, not sure yet.

Goods Reddit thread covers my questions: 

- <https://www.reddit.com/r/homelab/comments/167luly/looking_for_advise_on_beginner_home_server/>

## Ideas

- **Proxmox** as hypervisor software on lowest level
	- Can run **Home Assistant as well** - <https://tteck.github.io/Proxmox/#proxmox-ve-tools>
- **Home Assistant** as the end-all-be-all top level management for all the systems.
	- This gives me a great one place dashboard to control everything as well as monitor the systems on the homelab as well
- Open WebUI + Home assistant LLM for a great home control interface
	- <https://github.com/maxi1134/Home-Assistant-Config/blob/master/documentation/guides/voice_assistance_guide_open_webui.md>
- Open WebUI + Comfy UI to integrate image generation into the server
	- <https://www.youtube.com/watch?v=t68_mYLnSG4>

### Ai Software

[[DARS]] although might as well **just use home assistant LLM integration - ** <https://www.youtube.com/watch?v=op9_hM1TpeU>

- local AI LLM running stuff, art generator and home assistant with llm, etc
	- comfyui for flux?
	- sillyTavern + llama.cpp backend

### Open Webui

For setting up an API to pass other services to the open webui backend, good for a central control surface for llm stuff.

<https://docs.openwebui.com/getting-started/advanced-topics/api-endpoints>

## Homelab Software Services

**Homelab Services List:**
- <https://www.reddit.com/r/homelab/comments/10zsjt6/what_services_do_you_run_in_your_homelab/>
- **Snapdrop**
	- local hosted airdrop alternative for people on your network
- **Local File Explorer**
	- has good login, good for remote management of my files, etc
	- <https://filebrowser.org/installation>

## Node Orchestration

I want to get familiar with both Kubernetes and docker compose with this project. Deciding which to use what on is quite important, but a simple answer.

My AI Proxmox VM, which is entirely a local endeavor, does not need scaling abilities, and would be best to pair with docker compose to tie together things like comfyui, ollama.cpp, and open webui

My public facing website on the other hand might face scaling requirements, and is a simple enough starting point for me to get to know Kubernetes better.
