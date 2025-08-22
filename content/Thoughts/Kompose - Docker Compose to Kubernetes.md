---
title: Kompose - Docker Compose to Kubernetes
date: 2025-02-04
updated: 2025-08-21
tags:
  - seed
  - cs/homelab
fileClass:
  - note
---

I work with docker a lot and, for the most part, don't really need to use Kubernetes for anything as most of my hosted services are only for my own use(namely Home Assistant, Nextcloud, etc). I have these services packaged as Docker Compose projects so that the separate containers can easily work with the other containers that they rely heavily on.

**Kompose** would allow me to translate these compose projects directly to a Kubernetes Cluster without all the hassle. Namely, translating the docker compose file to the Kubernetes cluster's config file. 

I love the idea of Kubernetes and my OCD brain wants me to use it more, but the practical side of me doesn't want to put in an absurd amount of time into something that I don't really have much of a use for. This would allow me to have fun with Kubernetes when I need/want to, while still allowing me to work with what I'm already familiar with, Docker  and Docker Compose.

---

## Relevant Links

[Translating a Docker Compose File to Kubernetes with Kompose](https://kubernetes.io/docs/tasks/configure-pod-container/translate-compose-kubernetes/)

[Docker](https://www.docker.com/)

[Docker Compose](https://docs.docker.com/compose/)

[Kubernetes](https://kubernetes.io/)
