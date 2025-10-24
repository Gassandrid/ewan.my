---
tags:
  - projects/homelab/software
date: 2025-08-31
updated: 2025-10-23
class:
  - note
---

For the new modern [[Saturn V Server Rack]] that I am building, I want to rethink the software stack from the ground up.

See [[Master Homelab Architecture]] for private version.

---

## Storage Related

### [[Samba]] (nas software)

- [x] done

### [[GitTea]]

### NextCloud

$$
y''+y=\sin (x)
$$

$$
y_{p}
$$

### Obsidian LiveSync

- [x] done

## DNS/Networking

### NginX [[Reverse Proxy]]

Done for making the selfhosted services easier to access, as without I would have to type something like `http://home.ewan.my:8123/` for it to work instead of just `home.ewan.my`.

### CoreDNS

A simple, basic DNS service for resolving my [[Tailscale]] magic DNS queries. Works in conjunction with the [[Reverse Proxy]] to make access nice and easy.

### PiHole

https://hub.docker.com/r/pihole/pihole

Decided not to do this as I dont really want to mess with the Apartment router, I am not alone in this apartment and thus everything has been local/forwarded via a vpn/bridge like [[Tailscale]].

### N8N

- [x] done

https://n8n.io/
