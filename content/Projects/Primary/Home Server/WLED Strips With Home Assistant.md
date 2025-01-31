---
title: WLED Strips With Home Assistant
date: 2025-01-24
updated: 2025-01-28
tags:
  - home-assistant
  - homelab
  - cs
---

Now that I am getting more into Home Assistant and my home lab as a whole, I want to take some aspects of my room and migrate them over to home assistant.

---

## My Current LED Config

I have a large strip of rgbLED lights that I got off of Ali express for quite cheap. They are fully addressable, but don't include anything to control it for obvious reasons. It won't be hard to get these connected via an esp 32 and some power source, but I need to do some weird stuff with my network config to get it to connect to home assistant.

But once I get that configured sorted via [[Bridging my University Wifi to host own network access point]], this should no longer be a problem.

Once that is sorted, I plan to use something called the [WLED](https://kno.wled.ge/) Project, which allows one to host a web server to control addressable LED Strips, and has great support for 
