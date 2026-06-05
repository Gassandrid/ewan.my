---
title: Migrating my Quartz, DARS, and media to one big Homelab Server
date: 2025-01-02
updated: 2025-09-19
tags:
  - projects/homelab
  - projects/homelab/dorm
class:
  - note
---
My general idea for this "system" is that I can take all the other things that I have been wanting to do and have already done and combine it into one thing.

[[DARS]] was a great starting point for this concept, as the concept summed up exactly what I wanted my home server / homelab to be, an all in one system integrated with a [[Large Language Model|LLM]] given tools to understand the context of my infrastructure, and perform actions with those tools.

Right now this project is mostly just a clutter of brainstorming efforts to bring the collection together, etc.

---

## Running ML Models

I want this server to act both as a training ground for me to develop models of my own, but also run several models in parallel ranging from language and image generation to several recodnition models to work alongside home assistant 

---

## Home Assistant

One of the big features of this project would be the home assistant functionality, however I am not sure where to run it.

I have both several Raspberry Pi's, and also several machines that would inevitably be running proxmox. I can run home assistant as its own container on proxmox, or run it bare metal on the pi. Running on the Pi would be easier to set up and less complex, but would be resource limited and not be containerized like the rest of the apps

- I think the best would be to start my practice with running home assistant on the Pi, and then in the long term moving it to HAOS as a container on Proxmox

---

## Tasks

- [x] [[Brainstorming Software Stack]]
- [x] [[Brainstorming Hardware Stack]]
	- rPi project, also new mini pc, old laptops, etc. any computer I can get my hands on.
- [x] [[Proxmox on old Macbooks]]

---

## Move Hosting of quartz/vault to Homelab

This would be nice for the simple reason that my Vault SRC would be able to exceed the `5GB` limit of Github. This could mean I could have all my photos, videos, and audio recordings all be stored under the same vault.

I could also better protect some aspects of the vault from the public, and have a login for different authentication levels for note access.

> [!Warning] Useful Feature
> This could also mean that I would be able to attach unique and usefull backends to the website.
