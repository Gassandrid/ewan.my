---
date: 2024-11-11
tags:
  - cs/embedded
updated: 2025-03-31
fileClass: note
---

# Final Project Status Update 3

> [!abstract] Student Information
> Ewan Pedersen
>
> CS2210
>
> 11 • 11 • 2024

---

## Summary of Progress

We have gotten to a place where most of the software is done, but we are still having some trouble with our hardware. All of our models work on our Lead Engineers' Computer, but is having trouble running on the very specialized Coral TPU. 

Other than that, we are in a good place! all our basic models, aka speech to text, text to speech, and the LLM(with personality) is working!

We have also begun implementing some stuff for the screen. While this doesnt serve any functional aspect, we want it to display a terminal, the words it is "hearing" and its LLM response. This is to replicate what TARS' screen looks like in the movies.

---

## Time Log

| date       | Name | Role                | Description                                                                                                | Time(Hrs) |
| ---------- | ---- | ------------------- | ---------------------------------------------------------------------------------------------------------- | --------- |
| 11/04/2024 | Ewan | Lead Model Engineer | Completed Voice recodnition and synthesis                                                                  | 4         |
| 11/06/2024 | Ewan | Lead Model Engineer | completed LLM fine tuning and langroid structure                                                           | 5         |
| 11/10/2024 | Ewan | Lead Model Engineer | functioning hardware prototype working (microphone, speaker, monitor, coral TPU semi but not with our LLM) | 3         |

---

## Next Steps

We still have yet to complete the ESP 32 wireless network for which we will use to communicate with the devices in the room. For this demo, we only plan to have 1-2 devices on the network of control under DARS. One will be controlling some RGB strips(with hex code specification), and the other will be to toggle power to some of the stuff in the room.

This will require some additions to the Langroid framework, which serves as the glue that keeps it all together, calling other python files to then tell the RPi esp 32 to communicate with another esp 32, which then controls the devices in the room.

In addition, we still need a chassis....

---

## Challenges

The biggest challenge right now is, Ironically, what is considered to be the easiest. We have no Chassis. We have no idea how to make a chassis. We do not know where to start. While this won't effect the functionality of DARS, it is kind of the whole aesthetic behind the name of the project, so we need to have SOMETHING resembling the robot!

Luckily, we are not to worried about this, as regardless of the outcome of our chassis, our project will still work functionally( even if it looks like a bunch of scrap! )