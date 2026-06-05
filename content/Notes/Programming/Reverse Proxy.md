---
class:
  - note
tags:
  - cs/homelab/dns
source:
related:
author:
date: 2025-10-14
updated: 2025-10-14
---
A **reverse proxy** is a server that sits between client devices and backend servers, forwarding client requests to the appropriate backend server and returning the server's response to the client. It acts as an intermediary for requests from clients seeking resources from one or more servers.

The typical case for selfhosting is **nginx reverse proxy**. Nginx is a popular web server that can also be used as a reverse proxy server.

---

## Use Cases

The most common use case for a reverse proxy in a selfhosting setup is to manage multiple web services running on different ports or servers and expose them through a single domain name. This is particularly useful when you have several applications running on the same server or across multiple servers, and you want to provide access to them via subdomains or specific paths.

I use this for my homelab to take a tailscale magic domain like `lab.ewan.my:8080` and have it be able to be accessed simply as `lab.ewan.my` or `sonarr.lab.ewan.my`.

You could also use a reverse proxy to manage SSL/TLS certificates for your services, handle load balancing, or provide caching and compression to improve performance.
