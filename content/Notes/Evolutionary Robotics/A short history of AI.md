---
class:
  - note
  - lectureNote
tags:
  - university
course: "[[Evolutionary Robotics]]"
lesson:
  - lecture
lecture-number: 2
source:
related:
author:
description:
date: 2026-01-15T08:29:40-05:00
updated: 2026-01-15T08:52:56-05:00
---

## A short Recap

We looked at flexible muscle based locomotion for bipedal creatures. This was done by creating a simulation environment where creatures with different morphologies could be evolved to walk using a genetic algorithm.

> [!Example] What is the task of the evolutionary algorithm of a quadruped robot?
>
> ![](https://www.youtube.com/watch?v=en8Xer4ynbU)
>
> 1. Create a **task environment**: A simulated world where the robot can move and interact.
> 2. Create the **robot**
> 3. Create the robot's brain, or Artificial Neural Network (ANN)
> 4. Use an **evolutionary algorithm** to evolve the robot's morphology and control system to perform the task of walking.

_Every time the robot gets closer to the reward (in this case, grabbing the blue bock), it gets a higher fitness score._ We then make the goal **harder** by moving the block further away.

### Pros and Cons of Evolutionary Algorithms

> [!Success] Pros
>
> - It can discover novel and unexpected solutions that humans might not think of. In this case, the robot learned to use its back to carry the ball, which is a creative solution.
> - They can optimize both the morphology and control system of the robot simultaneously, leading to more integrated and effective designs.

> [!Failure] Cons
>
> - It takes generations to evolve a good solution. The example took two weeks on UVMs supercomputer. This is **sample innefficiency**, it takes millions of failed attempts to get a good solution.
> - It is only optimizing for a very specific fitness metric, which in this case is minimizing the distance between the blue block and the ball on its back. This can also lead to **perverse instantiations** where the robot finds a loophole in the fitness function to get a high score without actually performing the desired task.

AIs are like teenagers, they will do what you ask exactly, not what you want them to do. Instructions have to be very precise.

---

## I Think, Therefore I Am

> _Cognito, ergo sum_
>
> **René Descartes, 1637**

This famous philosophical statement by Descartes emphasizes the act of thinking as proof of existence. In the context of AI, it raises questions about whether machines that can think or simulate thought processes can be considered to possess consciousness or self-awareness.

There is an emphasis on the pronoun **I**, in essence we cannot trust that anything beyond our own mind exists. Everything else, including my body, we are not so sure about.

### Why Talk about This?

Descartes cleaves the world into two distinct substances: the mind (res cogitans) and the body (res extensa). This dualistic view has influenced philosophical discussions about the nature of consciousness and the mind-body problem.

We call this **Cartesian Dualism**: the mind body _problem_. Why is it a problem? Because if the mind and body are separate, how do they interact? How can a non-physical mind influence a physical body, and vice versa?

Thinking about the interface is now even more problematic than the prior question of whether the mind and body are separate.

---

## Input First, then Processing, then Output

From the time of the [[Turing Machines|Turing Machine]], the very idea of computation has been based on a simple notion of input first, then processing, then output. This is the basis of the **von Neumann architecture** that underpins most modern computers.

### Fast Foward to 1956

The Dartmouth Summer Research Conference on Artificial Intelligence (1956) **Origin of the word “artificial intelligence”**.

The proposal for the conference stated:

> We propose that a 2 month, 10 man study of artificial intelligence be carried out during the summer of 1956 at Dartmouth College in Hanover, New Hampshire. The study is to proceed on the basis of the conjecture that every aspect of learning or any other feature of intelligence can in principle be so precisely described that a machine can be made to simulate it.
>
> An attempt will be made to find how to make machines use language, form abstractions and concepts, solve kinds of problems now reserved for humans, and improve themselves.
>
> We think that a significant advance can be made in one or more of these problems if a carefully selected group of scientists work on it together for a summer.

In Laymanns terms, **every thing that a human can do, a computer can do** given enough time and resources. Not only that, but they should be able to **improve themselves**.

Safe to say, they did not figure out Artificial Intelligence that summer.

Among the attendees were John McCarthy (who coined the term "Artificial Intelligence"), Marvin Minsky, Nathaniel Rochester, and Claude Shannon(founder of [[Information Theory]]). They are considered the founding fathers of AI.

### Goals of Artificial Intelligence

1. Understand the biological systems

Mother nature has done an excellent job of creating intelligent systems (humans, animals). By studying these systems, we can gain insights into how intelligence works and apply those principles to artificial systems. Term **bioinspiration** will pop up a lot.

2. Distill out the general principles of intelligent behavior

Our ancestors evolved an exceptional shoulder joint to throw spears accurately. Very awesome, but do we need to build robots that can throw spears? No. We need to distill out the general principles of intelligent behavior that can be applied across a wide range of tasks and environments.

3. Apply these principles to build intelligent artifacts

What do we need to actually build intelligent systems? Maybe a brain that can **predict sensory input** (if you are a fan of the [[Bayesian Brain]] and [[Free Energy Principle]] theories).

### Eliza

Created in 1966 by Joseph Weizenbaum, **Eliza** was one of the first chatbots. It simulated a Rogerian psychotherapist by using pattern matching and substitution to respond to user inputs.

It was a very simplistic system, but it was able to convince some users that they were talking to a real person. This led to discussions about the nature of intelligence and whether machines could truly understand human language.

> [!Abstract] Dialogue Example
>
> **User**: I am feeling sad.
> **Eliza**: Why are you feeling sad?
> **User**: Because my dog died.
> **Eliza**: I'm sorry to hear that. How long have you had your dog
> **User**: For 10 years.
> **Eliza**: Tell me more about your dog.

The program would parse the sentence looking for **pronoun**, **verbs**, and **nouns**, and then use a set of pre-defined rules to generate a response. For example, if the user said "I am feeling sad", Eliza would recognize the pronoun "I" and the verb "am feeling", and respond with "Why are you feeling sad?".

The lesson? Humans often **anthropomorphize** machines, attributing human-like qualities to them even when they are not present. This can lead to misunderstandings about the capabilities of AI systems.
