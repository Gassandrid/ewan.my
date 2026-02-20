---
created_on: "[[08-21-2025]]"
class:
  - note
  - lecture
tags:
  - university
  - cs/robotics
  - cs/ai/evolution
course: "[[Evolutionary Robotics]]"
lecture-number: 9
source:
related:
  - "[[Minimal Cognition]]"
  - "[[Sensation vs Perception]]"
author:
description:
aliases:
date: 2026-02-17T08:44:29-05:00
updated: 2026-02-19T09:19:16-05:00
---
**Think of the task**: several objects are placed in front of you. YOu must separate the round from edged objects while wearing a blindfold. How would you interact with the objects?

![[Screenshot 2026-02-17 at 9.31.52 AM.png]]

>[!Abstract] Active Categorical Perception
> The ability of an animal or robot to **interact** with objects of interest to **gather sensorimotor data** sufficient to **categorize** them, where the movement itself is the perceptual act.

---

## For a [[Continuous Time Recurrent Neural Networks|CTRNN]]

A [[Continuous Time Recurrent Neural Networks|CTRNN]]-controlled agent is evolved to perform active categorical perception on objects it cannot directly "see", it must develop a motor strategy that produces informative sensory signals. The evolved behavior often looks like poking or circling, generating a sequence of sensor readings that encodes object geometry.

Builds directly on the self/nonself discrimination work from [[Minimal Cognition]]: the arm experiment already required the agent to move to *learn*; ACP scales this to objects external to the agent's body.

![[Screenshot 2026-02-19 at 8.36.35 AM.png]]

$$
\tau_{i} \dot{y}_{I}=\begin{cases}
-y_{i} +gI_{i} & i=1,\dots,22 \\
-y_{i} + \sum_{j=n}^{m} \omega_{ij}\sigma(y_{j}+\beta_{j}) & i=23,\dots,48
\end{cases}
$$

$$
n=1, m=30, \quad for \ i = 23, \dots,30
$$

$$
n=23, m=30 \quad for \ i = 31,\dots,48
$$

$$
\sigma(x)=\frac{1}{1+e^{-x}}
$$

Why 14($31\to 44$) motor neurons, but only 7 joints? Why two different forms for $\tau_{i}\dot{y}_{i}$? What does the $n=1, m=30, \quad for \ i = 23, \dots,30$ mean?

---

Mental representations of spheres and ellipsoids:

$$
\sigma(y_{47}(t) + \beta_{47}) = \text{Value of neuron 47 at time step t}
$$

$$
0.95T<t<T = \text{The last 5\% of the time steps during the behavior}
$$

In each trial $e$, the agent represents the experienced object (i.e. the sphere $S$ or the ellipsoid $D$) by associating it to a rectangle $R_{Se}$ or $R_{De}$ whose vertices are:

Bottom left vertex:

$$
(min_{0.95T<t<T} \sigma(y_{47}(t)+\beta_{47}), min_{0.95T<t<T}\sigma(y_{48}(t)+\beta_{48}))
$$

Top right vertex:

$$
(max_{0.95T<t<T} \sigma(y_{47}(t)+\beta_{47}), max_{0.95T<t<T}\sigma(y_{48}(t)+\beta_{48}))
$$

The sphere category, referred to as $C_{S}$, corresponds to the minimum bounding box of all $R_{Se}$; the ellipsoid category, referred to as $C_{D}$, corresponds to the minimum bounding box of all $R_{De}$.

$$
C_{s}=(C)lassified \ as \ a \ (S)phere
$$

$$
C_{D} = (C)lassified \ as \ an \ ellipsoi(D)
$$

---

### Fitness Function

For fitness function $FF$, why are there two fitness terms $F_{1}$ and $F_{2}$? What does $F_{1}$ stand for? What does $F_{2}$ stand for

?

$$
FF = F_{1}+F_{2}
$$

$$
F_{1} = \frac{1}{E} \sum_{e=1}^{E} \left( 1-\frac{d_{e}}{d_{max}} \right)
$$

$$
F_{2} = \begin{cases}
0 & if \ F_{1}<1 \\
1-\frac{area(C_{S}\cap C_{D})}{min\{ area(C_{S}), area(C_{D}) \}} & otherwise
\end{cases}
$$

with $d_{e}$ the euclidean distance between the object sand the center of the palm at the end of the trial $e$; $d_{max}$ the maximum distance between the palm and the object when located on the table.

$$
C_{S} = (C)lassified \ as \ a \ (S)phere
$$

$$
C_{D} = (C)lassified \ as \ an \ ellipsoi(D)
$$

$$
(C_{S}, C_{D} \ are \ bounding\ boxes)
$$
