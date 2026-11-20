---
date: 2025-10-16
updated: 2026-01-18T08:29:09-05:00
class:
  - note
tags:
  - projects/homelab/monitoring
  - projects/homelab/apartment
source:
related:
  - "[[Master Homelab Architecture]]"
author:
---
The last thing really missing on my [[Saturn Rack Software]] is a way to cleanly manage all the stuff in one spot. Up to this point, I have been all over the place, [[SSH]]'ing into each individual server to make changes, with each server having their docker compose stacks in sporadic places.

This project hopes to centralize this all under one git repo on my local computer, where I can manage every configuration file in one place. And, when I am done, I can run a new script `sync.sh` to use **rsync** to copy over all the config files to their respective machine, and rebuild.

This would also make the process of completing the [[Master Homelab Architecture]] overview note a lot easier, and I could use a [[Large Language Model|LLM]] agent to scrape the relavant info from the repo for that note. Would still have to make the main [[Whiteboard.excalidraw]] diagram myself though.

## A Rough Idea

What I have so far is this directory listing for the hosts:

```
├── hosts
│   ├── cyr
│   │   ├── cyr.md
│   │   └── services
│   │       ├── bin
│   │       ├── homelab-dashboard
│   │       │   ├── coredns
│   │       │   │   └── Corefile
│   │       │   ├── docker-compose.yml
│   │       │   ├── homepage
│   │       │   │   └── config
│   │       │   │       ├── bookmarks.yaml
│   │       │   │       ├── docker.yaml
│   │       │   │       ├── kubernetes.yaml
│   │       │   │       ├── proxmox.yaml
│   │       │   │       ├── services.yaml
│   │       │   │       ├── settings.yaml
│   │       │   │       └── widgets.yaml
│   │       │   ├── nginx
│   │       │   │   └── nginx.conf
│   │       │   ├── prometheus
│   │       │   │   └── prometheus.yml
│   │       │   └── README.md
│   │       ├── nextcloud
│   │       ├── obsidian_livesync
│   │       │   └── docker-compose.yml
│   │       ├── ollama_middleware
│   │       │   └── docker-compose.yml
│   │       ├── redirect
│   │       │   └── docker-compose.yml
│   │       ├── rtl_sdr
│   │       └── snapdrop
│   ├── ewanpi4
│   ├── ewanpi5
│   ├── talkamar
│   │   ├── configuration.nix
│   │   ├── services
│   │   │   ├── gitea
│   │   │   │   └── docker-compose.yml
│   │   │   └── personal-data
│   │   │       └── docker-compose.yml
│   │   └── talkamar.md
│   └── tysis
│       ├── configuration.nix
│       ├── homeassistant
│       │   └── docker-compose.yml
│       ├── immich
│       │   └── docker-compose.yml
│       └── tysis.md
```

However I would like to have stuff beyond the specific config files of each machine. This would also streamline the declaration/sharing of key variable names/datastores, things like micro docker service addresses and whatnot. Makes sharing services with clients on the [[Tailscale]] network nice and easy.
