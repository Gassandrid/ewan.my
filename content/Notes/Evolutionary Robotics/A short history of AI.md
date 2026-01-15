---
class:
  - note
  - lectureNote
tags:
  - university
  - cs/robotics
  - cs/ai/evolution
course: "[[Evolutionary Robotics]]"
lesson:
  - lecture
lecture-number: 2
source:
related:
author:
description:
date: 2026-01-15T08:29:40-05:00
updated: 2026-01-15T09:33:12-05:00
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

### The Turing Test

Hence to say, if it is this easy to fool humans into thinking they are talking to a human, how do we actually test for intelligence in machines?

Up until quite recently, the most widely accepted test for machine intelligence was the **Turing Test**, proposed by Alan Turing in 1950.

The test is quite simple: a human judge engages in a natural language conversation with both a human and a machine, without knowing which is which. If the judge cannot reliably distinguish between the human and the machine, the machine is said to have passed the Turing Test.

![[turingTest.png]]

#### The Chinese Room Argument

The Turing Test has been criticized for not truly measuring intelligence or understanding. One of the most famous critiques is the **Chinese Room Argument**, proposed by philosopher John Searle in 1980.

> Imagine a person who does not understand Chinese is locked in a room. They have a set of rules (a program) that allows them to manipulate Chinese symbols based on the input they receive. To an outside observer, it may appear that the person in the room understands Chinese, as they can produce appropriate responses to Chinese questions. However, the person inside the room does not actually understand the language; they are simply following syntactic rules.

Do they really understand Chinese? No, they are just manipulating symbols based on rules. This suggests that passing the Turing Test does not necessarily imply true understanding or consciousness.

![[chineseRoomARgument.png]]

Some suggest that intelligence to solve this arrises from levels of abstraction, where the system is not just manipulating symbols, but also has a model of the world and can reason about it.

_This reminds me of the [[Aunt Hillary]] dialogue from [[Gödel, Escher, Bach]] by [[Douglas Hofstadter]]. Aunt Hillary is an anthill that can simulate human conversation by following a set of rules. Aunt Hillary understands the rules, but her components (the ants) do not. There are several levels of abstraction in between the ants and aunt Hillary that allow for this emergent behavior. You could not understand Charles Dickens with just a knowledge of the set of symbols of letters._

---

## Vehicles

A book by Valentino Braitenberg, **Vehicles** introduces a series of (hypothetical) simple robots that seem, to the outside observer, to exhibit complex behavior. The complex behavior does not come from a complex brain, but from a simple agent interacting with a rich environment.

### Vehicle 1: Getting around

A single sensor is attached to a single motor. Propulsion of the motor is proportional to the signal detected by the sensor. The vehicle moves towards the source of the signal. It will always move in a straight line towards the source, slowing down in the cold spots and speeding up in the hot spots.

> _Imagine, now, what you would think if you saw such a vehicle swimming around in a pond. It is restless, you would say, and does not like warm water. But it is quite stupid, since it is not able to turn back to the nice cold spot it overshot in its restless ness. Anyway, you would say, it is ALIVE, since you have never seen a particle of dead matter move around quite like that._
>
> **Braitenberg**

### Vehicle 2: Fear and aggression

Each vehicle has two sensors and two motors. Still a directly proportionate relationship between the signal strength and force of the motor.

**The aggressor**: Left sensor is attached ot the right motor, and the right sensor is attached to the left motor. Will charge the light if it’s dead-ahead; Will charge the light if it’s off to the side; Will eventually hit it, as long as the light stays in the vicinity.

> [!Question] Change: swap sensor and motor pairings
>
> **How will this vehicle behave?**
>
> Now it seems to avoid the light source. It _fears_ the light. But how can a robot of this complexity show aggression or fear?
