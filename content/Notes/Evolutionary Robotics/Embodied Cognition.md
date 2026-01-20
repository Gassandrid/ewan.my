---
date: 2026-01-20T08:29:59-05:00
updated: 2026-01-20T09:42:54-05:00
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

See [@mettaBetterVisionManipulation2003] for more.

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

---

## Libet Free Will Experiment

> [!Example]
> Another aspect of human cognition: free will. Most people believe that htey have free willo

Researchers hooked up subjects to [[Electroencephalography|EEG]] sensors on their brain, and [[Electromyography|EMG]] sensors on their finger muscles.

Subjects were given the task to, at any given time, decide the retract their index finger. They could randomly choose when to do this, but they had to remember the time on a clock when they first became aware of their intention to move their finger.

Not only was there a signal in the EEG data that predicted when the subject would move their finger, but this signal occurred **several hundred milliseconds before** the subject reported being consciously aware of their intention to move.

Subjects would have already made a decision for when they were ready, _they just didn't know it yet_. Quite unsettling!

![[LibetFreeWillExperiment.png]]

One possible solution could be that the "Central Coordination Factor" only gets synchronized with the motor action after the action has already been initiated unconsciously. The brain is a distributed system, but our "consciousness" might be a centralized narrative that gets updated after the fact.

See [@libetTimeConsciousIntention1983] for more.

---

## Subsumption Architecture

The **Subsumption Architecture** was developed by Rodney Brooks in the 1980s as a way to build intelligent robots that could operate in complex environments without relying on high-level planning or symbolic reasoning.

It got rid of planning altogether, and instead focused on building a set of simple, reactive behaviors that could be combined to produce more complex behavior.

The process is as follows:

1. Behaviors are arranged in parallel, not serial.
2. One behavior is always in control at any one time.
3. When stimuli are not present, higher levels subsume control of the robot.

![[subsumptionArchitecture.png]]

Subsumption architecture has been used to build a variety of robots, including the famous **Roomba** vacuum cleaner. An unintuitive but simple approach to building intelligent systems.

---

## Embodied Cognition

This brings us to the crux of the lecture: **Embodied Cognition**. What does this mean? The _machines_ that we use day by day have the aspects of cognition, but no way to interact with the world. They are disembodied. The central idea is:

> [!Abstract] Embodied Cognition
> **the way you process information is affected by the fact that you have a body**

> [!Example]
>
> If you have a body that can move, and you can see, then moving will cause _immediate_ feedback.
>
> Non-embodied technologies like computers must _wait_ for feedback from another device/computer or person.

### Situated Cognition

Slightly different from embodied cognition is **Situated Cognition**, which emphasizes that cognition is not just about having a body, but also about being situated in a specific environment.

> [!Abstract] Situated Cognition
> **the way you process information is affected by the fact that you are physically situated in the world**

---

A complete agent is one that can properly utilize both embodied and situated cognition to achieve its goals. But they also have 3 other important properties which we will discuss next lecture:

1. **They are subject to the laws of physics (by being in the world).**

> [!Example]
> We use it to move around, manipulate objects, and interact with our environment. We store potential energy in water to generate electricity.

2. **They generate sensory stimulation (through behavior).**

> [!Example]
> When we move our eyes, we change the visual input to our brain. When we touch objects, we generate tactile feedback. Yet another example of the [[Free Energy Principle]] in action.

3. **They affect the environment (through behavior).**

> [!Example]
> Like when we use tools to manipulate objects, or when we build structures to change our surroundings.
