---
title: Proxmox on old Macbooks
date: 2025-01-02
updated: 2025-01-02
tags:
  - homelab
  - cs
---
 
While my mini pc's haven't arrived yet, I thought I might as well go ahead and convert some of my old laptops - namely macBooks - into containerized Linux machines. This will be nice as I can have a bunch of old machines that split the workloads across themselves, and use the system as namely one giant [proxmox cluster](https://pve.proxmox.com/wiki/Cluster_Manager).

## Online Tutorial

I found [this video](https://youtu.be/FsPYgZYXyZw?si=twxsutQ-GoAIYHXl) which contained a lot of useful information on converting old machines to these fresh proxmox linux devices. It didn't really have much information on clustering multiple systems together, but luckily I found another video for doing this:

![](https://www.youtube.com/watch?v=at4J2bVPdwc)

While this wont let me use the different laptops as one system, it does mean I can access and manage all these devices from one place, which is nice.

## More useful links:

- [using pi in addition to a cluster](https://www.reddit.com/r/homelab/comments/e30qmh/my_rack_lab_with_proxmox_and_rpi/)
	- I dont really want to run proxmox on the rPi as it is already such a limited resource that I dont really see the point. Prefer just to have it act on its own and interact with the other machines via network.