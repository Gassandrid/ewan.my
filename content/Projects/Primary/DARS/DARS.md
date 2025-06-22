---
date: 2024-10-03
tags:
  - projects/dars
updated: 2025-06-20
---

## Prototype Demo

![](https://youtu.be/tM5SlI3h57M?si=PV-mKThFCWkRtbUP)

---

## Current(and planned) Capabilities

DARS is designed to leverage the power of language models to bridge the connection between natural language and programmatic output. This can be anything from a simple song request, to turning on/off a light in my room, to drafting a custom schedule for the day that automatically gets synced with my obsidian calendar. 

DARS serves to give Language Models the tools to interact with the real world, and in this case, my room and computer science automation tasks.

How this works right now is that speech is heard and recognized via a model, it is sent to both the frontend and backend language models for their respective responses, and a voice is synthesized from the frontend response to sound like TARS. The backend prepares a function call to get/send information, giving the project its ability to interact with the world. 

If it is a room control function, the Pi calls the master ESP-32 to send a signal to a specified slave ESP-32 via the ESP-NOW protocol. This could be something like the [[DARS Media Gallery#Relay for Appliance Power Control|esp-controlled relay switch]].

**Hardware Stack**

- RPi 5
- Coral TPU
- ESP-32 network
- Harddrive

**Software Stack:**

- A fine-tuned local Ollama  3.1 7B for the frontend "personality" of DARS
	- GPT 4o backend for function calling
- Speech Synthesis to sound like TARS
- Speech Recognition running Locally
- Langroid for Function Calling and Framework
- Quartz for Website architecture(this website), hosted on DARS.

### Planned Features

- [ ] [[AI Command API]] - kind of like talking to DARS in person, but the natural language prompt is provided via a API somewhere in the world. This would allow me to interact with my room from anywhere in the world, or get information about my room sent to me.
- [ ] Full File Interface - Control my notes, my cs projects, my music... all from one point. I would probably have to make DARS into a NAS first
- [ ] Camera Features - Coral TPU specializes at object recodnition tasks, and I have a pi camera inside the box now, just need to handle the software side of things.

---

## Why

As much as we love the idea of voice assistance, I can't help but admit the ones we have today kind of suck. I have never been able to use Siri for more than setting a timer, and even that it oftentimes struggles with. 

With the introduction of language models, we no longer need to rely on these discrete systems to route our requests to a defined output. Language models can extract the important information out of our own natural language, and are masters at understanding it.

I saw the opportunity to make 

For a University Course, I am required to make a project with a Rasberry Pi, and since I have been doing this already for years on end with all sorts of [[Microprocessors]], I thought I might as well push myself out of my comfort zone.

## Current Progress Log

Currently, DARS is taking the form outlined in the [[Wood Box Demo]], where the vanity side of the project has not been fully decided yet!

I have some ideas for how the project can serve as a online server, where DARS would have a [[AI Command API]] to provide an interface of control through the web.

DARS will be multifaceted,
