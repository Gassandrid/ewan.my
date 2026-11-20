---
class:
  - note
  - lecture
tags:
  - university
  - cs/robotics
  - cs/ai/evolution
course: "[[Evolutionary Robotics]]"
lecture-number: 10
source:
related:
author:
description:
aliases:
date: 2026-02-12T08:32:11-05:00
updated: 2026-02-17T09:14:43-05:00
---
**What would you classify the following objects under?**

[![collectionObjects1.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/a2e1624cf1f8b2864e75462dccffa20081d313ab2fba5d1b0623c6aeaaf92b0d/collectionObjects1.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/a2e1624cf1f8b2864e75462dccffa20081d313ab2fba5d1b0623c6aeaaf92b0d/collectionObjects1.png)

Likely some form of chair or place to sit. Collection is obvious.

**What about these following objects:**

[![collectionObjects2.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/7ea198dc1424c5f4839ce98c7799441fb0e90a4d9cac74799260b374b067bea6/collectionObjects2.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/7ea198dc1424c5f4839ce98c7799441fb0e90a4d9cac74799260b374b067bea6/collectionObjects2.png)

You would think of them as fuel sources, also quite obvious. But notice how the wood stump falls under both collections.

This is what can make classification for [[Evolutionary Robotics]]. In neuroscience/philosophy we can think of this hierarchy under the [[Rhizome]] hierarchy. Also similar to Obsidians tag clustering methods. Also reminiscent of [[Cortical Columns]] in the [[Forebrain|Neocortex]].

## Minimal Cognition

For a [[Continuous Time Recurrent Neural Networks|CTRNN]] experimental agent working towards passability experiments. Agent moves horizontally while a wall with an adjustable aperture falls from above. The rays of the agent's proximity sensors are shown.

[![minCognition.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/ed244884ca4f0530f31d48bfea21deae80282f6781fb585fd5b0f7de97cdf21e/minCognition.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/ed244884ca4f0530f31d48bfea21deae80282f6781fb585fd5b0f7de97cdf21e/minCognition.png)

Our fitness function will look like:

$$
p= \sum_{i=1}^{NumTrials} p_{i} \frac{1}{NumTrials}
$$

where:

$$
p_{i}= \begin{cases}
2|d_{i}| & \text{if agent collides with wall} \\
100 & \text{otherwise}
\end{cases}
$$

for an opening too narrow for the agent to pass through and:

$$
p_{i}= \begin{cases}
max(0,80-4|d_{i}|) & \text{if agent collides with wall} \\
100 & \text{if between blocks} \\
0 & \text{if beyond blocks}
\end{cases}
$$

for an aperture wide enough for the agent for pass through, and $d_{i}$ is the final horizontal separation between the center of the agent and the center of the aperture at the end of the $i^{th}$ trial. This fitness measure assigns *near zero* fitness to incorrect options.

### After Training

After performing an [[Evolutionary Algorithm|evolutionary algorithm]], deleting poor performers and making random modifications.

[![Screenshot 2026-02-12 at 8.44.18 AM.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/8c5255e9656211839656b9e18acfeb4c41d90e5fd3030b6427b5debe93286236/Screenshot%202026-02-12%20at%208.44.18%20AM.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/8c5255e9656211839656b9e18acfeb4c41d90e5fd3030b6427b5debe93286236/Screenshot%202026-02-12%20at%208.44.18%20AM.png)

### Strategy

Below graphs how the apertures would move in relation to the agent. Note that while the apertures fall at a consistent rate, the horizontal movement is due to the agent moving from side to side. Left graph is for apertures 1 unit smaller than the agent, right side is 1 unit larger apertures. Time starts at top and increases downward.

[![agentAvoidance.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/79aae96c8bcba72e23a20e009a319ba6d2d69a0676d36bde680f8866d3195927/agentAvoidance.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/79aae96c8bcba72e23a20e009a319ba6d2d69a0676d36bde680f8866d3195927/agentAvoidance.png)

---

## New Experiment

Agent has now been modified for the task of self/nonself discimination. Agent is now stationary, but can swing an "arm", which also interacts with its proximity sensors. Goal was to see if it could understand the variable it controlled and how it affected its sensors.

[![selfNonSelfDiscrimination.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/efe038dc13a9d68bcd8f659b90b0beb2a311c5b08a33f914a83289dac47c38ab/selfNonSelfDiscrimination.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/efe038dc13a9d68bcd8f659b90b0beb2a311c5b08a33f914a83289dac47c38ab/selfNonSelfDiscrimination.png)

### Fitness Function

$$
\frac{1}{NumTrials} \sum_{i=1}^{NumTrials} p_{i} 
$$

where:

$$
p_{i}= 1 - \frac{min\left( \frac{\pi}{4} ,| \theta_{i}| \right)}{\frac{\pi}{4}}
$$

and $\theta_{i}$ is the angular error at the end of the $i^{th}$ trial.

### After Training

As one would expect, model seems to align arm with object. Final angular position of the hand is plotted against the final angle of the object. 

[![armVsObjectAngle.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/1159996d6c35863a08dbe827ae1052e99327199d3c8325710b0d0bb40f4ad0bb/armVsObjectAngle.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/1159996d6c35863a08dbe827ae1052e99327199d3c8325710b0d0bb40f4ad0bb/armVsObjectAngle.png)

Also plotted is arm trajectories over time of the best self/nonself discrimination  agent catching objects at the midline from initial hand positions at either the left or right edge of the visual field. The trajectories are shaded according to the initial angular position of the object as indicated at the top of the plot.

[![angularPosTime.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/c48bbe897156557525b03e8ba60e6663d8456442f49cddb34b87ad815a3efef2/angularPosTime.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/c48bbe897156557525b03e8ba60e6663d8456442f49cddb34b87ad815a3efef2/angularPosTime.png)

---

## Selective Attention

We change the goal yet again. The agent now has to *select* which target to focus on, as there are now two ones coming at once. It still has to catch both, but it has to *select* which one to catch first.

[![twoObjectsCognition.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/0a8ccce79b764948fd5c5ffa735513f45d7518d4e953e35255db39969f0a1f33/twoObjectsCognition.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/0a8ccce79b764948fd5c5ffa735513f45d7518d4e953e35255db39969f0a1f33/twoObjectsCognition.png)

*Experimental setup for [[Attention|selective attention]] experiments. The agent can move horizontally while 2 objects fall from above. the initial positions and velocities of the two objects are constrained so that the agent as a reasonable chance of catching both.*

### Fitness Function

$$
200 - \left( \frac{1}{NumTrials} \sum_{i=1}^{NumTrials} p_{i} \right)
$$

**where:**

- $p_i= |d_{i,1}|+|d_{i,2}|$
- $d_{i,j}$ is the horizontal distance between objects $j$'s final positions and agents final position.

**PO**: passing objects' problem
**OP**: object permanence problem

### Arising Problems

Behavior of the best selective attention agent. Example motion plots are shown for different combinations of passing objects (PO) and object permanence (OP).

[![POvsOP.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/e1af09493503172f06b85dcc7fd9c6f585cd010d100ee58064843059d3e4bdd3/POvsOP.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/e1af09493503172f06b85dcc7fd9c6f585cd010d100ee58064843059d3e4bdd3/POvsOP.png)

---

## A short Segment on [[Gradient Descent]]

Beyond actual evolutionary algorithms to train our robots, we also have the option of [[Gradient Descent]] to tune our parameters.

We seek to calculate a **behavioral loss**, a function which calculates the amount of error in prediction vs actual. We then use Chain rule to calculate the derivative at that point in the [[Loss Functions|loss function]], such that [[Gradient Descent]] can take a step in the direction of loss minimization. This is the **forward pass**.

**[[The F=ma of Artificial Intelligence Backpropagation|Backward pass]]** is when we actually tune the [[Neuron|neurons]] with our new information.

In the robotics perspective, remember that weights are not purely for modifying the neuronal weights of the robot, but also to alter parts of the body itself. Perhaps we can tune the *mass* of the front leg, as this could also be to blame for a nonzero loss.
