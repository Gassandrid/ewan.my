---
class:
  - note
  - lecture
tags:
  - university
  - cs/ai/evolution
  - cs/robotics/reality-gap
course: "[[Evolutionary Robotics]]"
lecture-number: 14
source:
related:
author:
description:
aliases:
date: 2026-03-17T08:36:45-04:00
updated: 2026-03-17T09:44:42-04:00
---

meant as an attempt to solve the **[[Reality Gap|reality gap]]** (the discrepancy between simulated and real-world dynamics that causes sim-trained policies to fail on physical hardware)

## [[The Golem Project]]

1. Investigators evolved a robot to locomotive in simulation
	- they are not just evolving the body, but the body and [[Brain|brain]] combined
2. Manufacture robot using a [[3d Printing|3d printer]]
	- 3d printing is great, but it is limited to the static, plastic pieces of the process. All the active mechanical components still had to be added manually.
3. snap in motors and complex components (human in the loop)

[![ModelgolemProject.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/3170c9f8d5c7a4ea4ec58eb2916b0a942b08ae45e694b5f8c12c3e2ad1087483/ModelgolemProject.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/3170c9f8d5c7a4ea4ec58eb2916b0a942b08ae45e694b5f8c12c3e2ad1087483/ModelgolemProject.png)

### Genotype Encoding

$$
robot:= \langle vertices \rangle \langle bars \rangle \langle neurons \rangle \langle actuators \rangle
$$

> a robot is fully described by its geometry, structural elements, [[Neural Networks|neural network]], and the actuators that connect them

$$
vertex := \langle x,y,z \rangle
$$

> a vertex is just a point in 3D space

$$
bar:= \langle vertex \ 1 \ index, vertex \ 2 \ index, relaxed \ length, \ stiffness \rangle
$$

> a bar connects two vertices and has a rest length and spring constant governing how it resists deformation

$$
neuron:= \langle threshold, synapse \ coefficients \ of \ connections \ to \ all \ neurons \rangle 
$$

> a [[Neuron|neuron]] fires when its weighted input exceeds its threshold, with one synaptic weight per incoming connection

$$
actuator := \langle bar \ index , neuron \ index, bar \ range \rangle 
$$

> an actuator ties a specific bar to a specific neuron and defines how far that bar can extend or contract

### Parameters

Initial Population: 200 null genotypes

Fitness: Displacement of the center of mass

Evaluation period: "fixed number (12) of cycles of its neural control"?

### Possible Mutations

pick random number between 1 and 10:

1. change the length of a bar (10%)
2. change a synaptic weight (10%)
3. add or 
4. remove a dangling bar (1%)
5. add or
6. remove unconnected neuron (1%)
7. split vertex into two and add a small bar (3%)
8. split bar into two and add vertex (3%)
9. attach or 
10. detach neuron to bar (3%)

One mutation was applied to each newly created genome. Every time a mutation adds a new neuron, all existing neurons add a [[Synapses|synapse]] connection to that new neuron.

---

## Some Results

**From one generation**:

[![Screenshot 2026-03-17 at 9.26.30 AM.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/7249e12f4585a40ac35d5e01235f6cf366f1935ca6e9b4e813297069ff69a242/Screenshot%202026-03-17%20at%209.26.30%20AM.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/7249e12f4585a40ac35d5e01235f6cf366f1935ca6e9b4e813297069ff69a242/Screenshot%202026-03-17%20at%209.26.30%20AM.png)

**From varying generations across one "run"**:

[![Screenshot 2026-03-17 at 9.27.16 AM.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/55f67e467fbd1f7b0be2b79b98034b7a560bbeee2a563b30b81d7ff679736760/Screenshot%202026-03-17%20at%209.27.16%20AM.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/55f67e467fbd1f7b0be2b79b98034b7a560bbeee2a563b30b81d7ff679736760/Screenshot%202026-03-17%20at%209.27.16%20AM.png)

---

## Phylogenetic Trees

Top to bottom is generation timeline, the links display similarity of ancestry. Gives a sense of *which ancestors lead to success*

[![phylogeneticTree.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/ccf514d0600a96c13e61e7c1035b522ee9fe8015746c0e02f541fee271e8bc3a/phylogeneticTree.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/ccf514d0600a96c13e61e7c1035b522ee9fe8015746c0e02f541fee271e8bc3a/phylogeneticTree.png)

We can see **macro evolutionary events**

>[!Abstract] Macro Evolutionary Events
> 1. Divergence
> 2. Convergence
> 3. Emergence of species
> 4. Extinction

---

## In Reality

Model performed well in real life on a carpet surface, with some interesting design choices made by the evolutionary algorithm.

The success of evolutionary generated hardware via [[3d Printing]] got many interested in how 3d printing could allow for 

 
