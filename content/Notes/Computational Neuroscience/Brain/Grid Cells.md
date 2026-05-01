---
class:
  - note
tags:
  - comp-neuro/brain/neurons
  - math/topology
source:
  - "[[Toroidal topology of population activity in grid cells - Nature]]"
  - https://en.wikipedia.org/wiki/Grid_cell
  - "[[Your brain is moving along the surface of the torus 🤯]]"
related:
  - "[[Continuous Attractor Network]]"
  - "[[Place cells - How your brain creates maps of abstract spaces]]"
  - "[[Neuron]]"
  - "[[Attractor Network]]"
author:
date: 2025-09-19
updated: 2026-03-23T09:57:09-04:00
description: a type of neuron in the brain that helps with spatial navigation by creating a coordinate system
aliases:
  - Grid Neurons
  - Grid Neuron
---

The arrangement of grid cells' spatial firing fields, equidistant from neighbors, led to a hypothesis that they encode some neural representation of Euclidean Space. Also hints at a mechanism for dynamic computation of relative/self position based on continous updates regarding direction/position.

![[TopologyGridCell.png]]

---

## Toroidal Topology of Grid Cells

It is theorized that [[Continuous Attractor Network]]s serve as a substrate of the grid pattern. However it is still unclear if they really show Continuous Attractor Dynamics.

When looking at grid cells in the medial [[Entorhinal Cortex]] fire at various locations, a distinct periodic hexogonal pattern emerges. However, when looking at the **population activity**(collective grid cell firing rate patterns), researchers ( [@gardnerToroidalTopologyPopulation2022] ) found that 2d grid pattern could not extend to this case. Rather, it was constrained to the surface of a Torus. *Certainly more to investigate regarding these cells when I get the time*
