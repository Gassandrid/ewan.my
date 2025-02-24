---
date: 2025-02-12
updated: 2025-02-21
tags:
  - seed
  - projects/homelab/software
title: Docker Swarm as an alternative to proxmox
---
*[article](https://medium.com/@georgeveersingh27/docker-compose-vs-docker-swarm-choosing-the-right-orchestration-tool-bdaf3b52e9a2) discussed* 

Because of the conclusion I came to in [[Using Bare Metal Nixos and Debian Over Proxmox]], I decided not to use proxmox entirely for my project due to the restrictions of my University Network.

But as I have worked with docker more and more, I heard about docker swarms as a way to cluster machines together.

This is great for my use case, as I have some 8 machines that **must** be able to work together efficiently due to the limited resources of a lot of the nodes.

This also allows the individual computers to run as their own machines without a hypervisor, simply with a docker daemon under the hood.

[Docker Swarm Docs](https://docs.docker.com/engine/swarm/)
