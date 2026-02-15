---
created_on: "[[02-12-2026]]"
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
updated: 2026-02-12T09:26:59-05:00
---
**What would you classify the following objects under?**

![[collectionObjects1.png]]

Likely some form of chair or place to sit. Collection is obvious.

**What about these following objects:**

![[collectionObjects2.png]]

You would think of them as fuel sources, also quite obvious. But notice how the wood stump falls under both collections.

This is what can make classification for [[Evolutionary Robotics]]. In neuroscience/philosophy we can think of this hierarchy under the [[Rhizome]] hierarchy. Also similar to Obsidians tag clustering methods. Also reminiscent of [[Cortical Columns]] in the [[Neocortex]].

## Minimal Cognition

For a [[Continuous Time Recurrent Neural Networks|CTRNN]] experimental agent working towards passability experiments. Agent moves horizontally while a wall with an adjustable aperture falls from above. The rays of the agent's proximity sensors are shown.

![[minCognition.png]]

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

After performing an evolutionary algorithm, deleting poor performers and making random modifications.

![[Screenshot 2026-02-12 at 8.44.18 AM.png]]

### Strategy

Below graphs how the apertures would move in relation to the agent. Note that while the apertures fall at a consistent rate, the horizontal movement is due to the agent moving from side to side. Left graph is for apertures 1 unit smaller than the agent, right side is 1 unit larger apertures. Time starts at top and increases downward.

![[agentAvoidance.png]]

---

## New Experiment

Agent has now been modified for the task of self/nonself discimination. Agent is now stationary, but can swing an "arm", which also interacts with its proximity sensors. Goal was to see if it could understand the variable it controlled and how it affected its sensors.

![[selfNonSelfDiscrimination.png]]

### Fitness Function

$$
\sum_{i=1}^{NumTrials} p_{i} \frac{1}{NumTrials}
$$

where:

$$
p_{i}= 1 - \frac{min\left( \frac{\pi}{4} ,| \theta_{i}| \right)}{\frac{\pi}{4}}
$$

and $\theta_{i}$ is the angular error at the end of the $i^{th}$ trial.

### After Training

As one would expect, model seems to align arm with object. Final angular position of the hand is plotted against the final angle of the object. 

![[armVsObjectAngle.png]]

Also plotted is arm trajectories over time of the best self/nonself discrimination  agent catching objects at the midline from initial hand positions at either the left or right edge of the visual field. The trajectories are shaded according to the initial angular position of the object as indicated at the top of the plot.

![[angularPosTime.png]]

---

