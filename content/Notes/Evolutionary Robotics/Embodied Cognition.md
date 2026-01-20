---
date: 2026-01-20T08:29:59-05:00
updated: 2026-01-20T09:05:59-05:00
class:
  - note
  - lectureNote
tags:
  - cs/robotics
  - cs/ai/evolution
  - university
source:
related:
author:
description:
aliases:
course: "[[Evolutionary Robotics]]"
lesson:
  - lecture
lecture-number: 3
---

What does it really mean to have a body and _exploit it_ for intelligent action?

> **Challenge:** How to recognize objects in a scene; where are the object’s boundaries? This problem is known as ‘image segmentation’ in the field of computer vision.

We need to think about all the things that an intelligent agent _should_ be able to do. Things like **pattern recognition**.

Below is a picture of **Marylin Monroe**. Can you recognize her? This is an example of older computer vision systems failing to deduce the human face in the image. Modern neural networks can easily recognize the face, thanks to advancements in [[Diffusion in machine learning]] through models like [[CLIP]], which learned to associate an image vector with a text vector.

![[aiPatternRecognition.png]]

---

## How to Recognize Patterns

> [!Success] Solution(sort of)
> **Cog:** cog _interacts_ with the scene, rather than passively observing it.

The researchers working with Cog treated Cog like a baby, as like most newborn infants it was mostly blind. Could only perceive blobs of motion.

In the example below, Cog didn't have any goal, it just moved things around. Would send signals to its motors, see some blobs of motion, and when it stopped sending signals it would suddenly see nothing.

![[cogRobotMotion.png]]

Cog _learned_ to associate its motor commands with the visual feedback it received. For example, when it moved its arm to the left, it would see a blob of motion on the left side of its visual field. Over time, Cog learned to predict what it would see based on its motor commands.

_See [@mettaBetterVisionManipulation2003] for more_

---

## Kasparov Vs Deep Blue

An iconic and pivotal moment in AI history was when IBM's Deep Blue defeated world chess champion Garry Kasparov in 1997. This event highlighted the capabilities of AI in strategic thinking and problem-solving.

**How did Deep Blue work?** It used a brute-force search algorithm called [[Minimax]] combined with [[Alpha-Beta Pruning]] to evaluate millions of possible chess positions per second. Deep Blue's strength lay in its ability to analyze vast amounts of data and make optimal decisions based on that analysis.

This is an example of the cognitive ability of **Planning**, where Deep Blue would make complex plans based not only on its own planned moved, but also what it expected Kasparov to do in response(this is what Minimax does).

![[KasparovVDeepBlue.png]]

Deep blue won its first game **February 1996**, and its first match **May, 1997**.

---

## Embodied Planning

_Shakey the Robot_ (Stanford Research Institute, 1966-1972), was a robot that could perceive its environment, make plans, and execute actions to achieve goals. It was surrounded by bricks that it could not move, but could move itself and a few other objects. Shakey would make a rich simulation of its environment, and then plan a route to escape its invoronment.

It would _move_ an inch, _stop_ (this is how it got the name Shakey), _perceive_ its environment, _update_ its internal model, and then _plan_ its next move.

![[shakeyTheRobot.png]]
