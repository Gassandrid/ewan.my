---
tags:
  - projects/homelab
  - cs/homelab
date: 2025-08-27
updated: 2025-08-31
class:
  - note
---

It has been a while since I have updated this project, as it was working as intended for the rest of my second year at the [[University Of Vermont]].

However, I have moved off campus now, with a lot more space for a proper server shelf, and some new home automation features.

---

## Big Picture

### Home Assistant

I have all the services I had before still running on docker containers, but this time around I want to focus on [[Home Assistant]] automations for my room.

This would consist of lights in my room (since my room has no built in lights of its own), a bunch of sensors for all kinds of things(mainly 3d printing particulates), and some camera stuff for both in and outside the room(I have a nice window I want to time lapse).

This consists of 3 sub projects, a few of which I have already planned out:

- [[WLED Strips With Home Assistant]]
- [[Room Automations with Home Assistant]]
- [[Home Server Ip Cameras]]

[[Home Assistant]] security will be a nice feature for monitoring interesting happenings outside my room, but beyond home assistant it will also be a nice way for me to test machine learning models with computer vision data, etc.
- this could also involve the raspberry pi camera module that i have lying around, good stuff to play around with before [[Sprinter Van Plan 1]] stuff

I have added some products I would like to get to my obsidian db, namely [[CX820 IP Camera]] and [[Kasa Smart Plug]]

### Server Rack

I still like the idea of building a 3d printed server rack that I outlined in my [[A 2025 Home Server Update#^a1bbd8|second semester]] update for sophamore year. This is much more feasible now, and I think I will go ahead with either the *Saturn V* design or the more practical *LabRax* one:

- [x] [Saturn V](https://makerworld.com/en/models/1381701-saturn-v-u-diy-10-network-rack#profileId-1430257) ( i chose this one)
- ~~[Lab Rax](https://makerworld.com/en/models/1294480-lab-rax-10-server-rack-5u?from=search#profileId-1325352)~~

It doesnt really matter how I implement the rack whether its 3d printed or not, but the central idea is that I would like a 10 inch rack, as that is the best for what I need right now. The moment it starts getting into GPU stuff and complexity, then it is no longer really worth it for a home server unless you are willing to invest a LOT of money. 

#### Saturn V Server Rack

This is now under the [[Saturn V Server Rack]], and that will be documenting the creation process.

#### What to Do with Laptops

These will still be used, but not really as servers as they are not capable **at all**. I will maybe continue to use the macbook pro as it has the GB of ram and a decent processor, but the two MB Airs will be used as [[Laptop Kiosk Displays]].

## Other Services

### Obsidian LiveSync

I have gotten quite tired of the git sync for obsidian when working with mobile, it really doesnt work and I am tired of it. I plan to implement this with some selfhosted bucket, following the guide below:

https://www.reddit.com/r/selfhosted/comments/1eo7knj/guide_obsidian_with_free_selfhosted_instant_sync/

### Cloud Services

This will start with the [[Nextcloud]] setup again, but I want to have this operate over a better

### RF Rig

I dont do as much RF stuff as I used to, but it would be nice to have a passive RF frequency monitor using an RTL-SDR or something of the sort, just to track the surrounding radio landscape.
