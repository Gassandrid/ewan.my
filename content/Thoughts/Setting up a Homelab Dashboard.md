---
id: Setting up a Homelab Dashboard
aliases: []
tags:
  - projects/homelab/software
  - cs/homelab/monitoring
  - projects/homelab/apartment
class:
  - note
date: 2025-10-01
updated: 2026-01-18T08:29:28-05:00
---
My old homelab in my dorm room was all over the place, in both hardware and software. On the software side, I kind of just found services that I wanted and hosted the docker container with no foundation.

I didnt want to make that same mistake on the rebuild, so the first proper service I wanted to host was a homepage "foundation" to base everything off of.

---

## Some Big Changes

A big personal change in philosophy is my move from publically facing services to private. The more I work with this stuff, the more I worry about the safety of said services. So, first things first, I wanted to set up a [[Reverse Proxy]] with [[Tailscale]], so as to create a web frontend that only clients on my tailnet could access. This page, `lab.ewan.my`, will serve as that homepage with metric across all of my machines.

---

## Architecture

This frontend consists of **7 containers** within the docker compose:

### [[Homepage(Homelab)|Homepage]]

This is the entry point that actually runs on `lab.ewan.my`, with links to all the other services here.

It runs on port `3000`.

### [[Grafana]]

Graphana is a well known service for visualizing metrics. I use it to visualize all the metrics collected by Prometheus, and the running docker containers on each machine. Its dashboard is available at <http://lab.ewan.my/grafana> and it also runs on port `3000`.

### [[Prometheus]]

Prometheus is a metrics collection and alerting service. It scrapes metrics from various endpoints, including the node-exporter, cAdvisor, and CoreDNS, and stores them in a time-series database. Its dashboard is available at <http://lab.ewan.my:9090/> ( even though it should be behind the reverse proxy, I havent set that up yet ).

### Node-exporter

I wont go into too much detail about this as all it is for is exporting metrics about the host machine, such as CPU usage, memory usage, disk usage, and network statistics. Each machine in my homelab runs a node-exporter container, which Prometheus scrapes for metrics.

### CoreDNS

This is what I am using in conjunction with NginX and tailscale to epxpose my services to my tailnet. It runs on port `53` and is configured to resolve `*.ewan.my` to the appropriate IP address.

### cAdvisor

Minimalist container for monitoring resource usage and performance characteristics of running containers. It provides container users an understanding of the resource usage and performance characteristics of their running containers.

### NginX Reverse Proxy

This is so I can have links like `lab.ewan.my/grafana` instead of `lab.ewan.my:3000`. It runs on port `80` and forwards requests to the appropriate service based on the URL path.
