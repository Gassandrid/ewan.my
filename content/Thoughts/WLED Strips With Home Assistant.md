---
title: WLED Strips With Home Assistant
date: 2025-01-24
updated: 2025-09-30
tags:
  - cs
  - projects/homelab/hardware
  - projects/homelab/apartment
class:
  - note
source:
  - "[[Home Assistant]]"
---
Now that I am getting more into Home Assistant and my home lab as a whole, I want to take some aspects of my room and migrate them over to home assistant.

---

## My Current LED Config

I have a large strip of rgbLED lights that I got off of Ali express for quite cheap. They are fully addressable, but don't include anything to control it for obvious reasons. It won't be hard to get these connected via an esp 32 and some power source, but I need to do some weird stuff with my network config to get it to connect to home assistant.

But once I get that configured sorted via [[Bridging my University Wifi to host own network access point]], this should no longer be a problem.

Once that is sorted, I plan to use something called the [WLED](https://kno.wled.ge/) Project, which allows one to host a web server to control addressable LED Strips, and has great support for 

---

## Workflow and Links

**A good tutorial on setting up WLED:**
https://www.youtube.com/watch?v=exAWzMfmwQ8

Eventually I would like to connect this to [[Home Assistant]] when I get the chance, along with some **smart plugs** for controlling main room lights as well.

**A good wall plug toggle**:
https://www.amazon.com/dp/B07YDC6D4D

---

## Plug and Play Options no Manual

**Chip**

https://www.amazon.com/MagWLED-1-Controller-USB-C-Delivery-Pre-Installed/dp/B0CYKYDH64?=&linkCode=sl1&tag=chrismaher-20&linkId=f586149456f1cbfb60ed65270fdd9698&language=en_US

**Power**

https://www.amazon.com/gp/product/B0CQ4P2T8H?ie=UTF8&th=1&linkCode=sl1&tag=chrismaher-20&linkId=5bf39c5edcc24cb2a1b6930dc064d70f&language=en_US&ref_=as_li_ss_tl
