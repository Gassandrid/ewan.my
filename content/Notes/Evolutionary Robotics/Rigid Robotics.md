---
created_on: "[[04-07-2026]]"
class:
  - note
  - lecture
tags:
  - university
course: "[[Principles of Biology 1]]"
lecture-number: 20
source:
related:
author:
description:
aliases:
date: 2026-04-07T08:47:23-04:00
updated: 2026-04-14T09:08:58-04:00
---

## Karl Sims

Pioneer of evolving 3d morphology on a computer.

![](https://www.youtube.com/watch?v=JBgG_VSP7f8&source_ve_path=OTY3MTQ&embeds_widget_referrer=https%3A%2F%2Fdocs.google.com%2Fpresentation%2Fd%2F1fCxh1KjsTBuDr84qQDpCk0CoTD136GOmrhwmSrHbx_Y%2Fedit%3Fslide%3Did.p3&embeds_referring_euri=https%3A%2F%2Fobsidian.md%2F&embeds_referring_origin=https%3A%2F%2Fdocs.google.com)

### Body Construction

The trick presented here is to use *recursion* to contruct rigid morphologies.

**Genotypes:** nested, directed multigraphs.

would look something like the following pseudocode.

```
Node labels:
     body part dimensions
     joint-type: hinge, ball/socket…
     joint-limits
     recursive-limit (RL):
     if ( RL>0 ):
          RL = RL-1
          follow all outgoing edges.

Edge labels:
     change in position
     change in orientation
     change in scale
     reflection
     terminal-only flag (TO):
     if ( TO==true &&
           parent->RL==0 ):
         follow edge;
```

**Phenotypes:** Simulated robots.

![[recursiveConstruction.png]]

### Brain Construction

---

## Using Soft Robots for Rescue

> imagine in the event of a natural disaster where methods for delivering water to humans might be necessary, but also difficult. 

**Phototaxis**: movement of an agent/organism toward or away from light source.

**Thermotaxis**: similar, except governed by temperature gradients

Ideal would be to create a braitenburg vehciel that synthesizes the information from all the sources in an intelligent way for optimal human-seeking behavior.

## Returning to the "evil starfish" from [[Resilient Machines Project]]

What if we put the agent in a circumstance where it is cut in half or damaged in the simulation. What would that look like? How would soft robots learn to locomote under injury?

![](https://www.youtube.com/watch?v=wbEvppR4OdE&t=1s)

![](https://www.youtube.com/watch?v=an8JTjE8aFg&time_continue=0&source_ve_path=NzY3NTg&embeds_referring_euri=https%3A%2F%2Fobsidian.md%2F&embeds_referring_origin=https%3A%2F%2Fdocs.google.com)

![](https://www.youtube.com/watch?v=fk_2Ikpub_Y&time_continue=0&source_ve_path=NzY3NTg&embeds_referring_euri=https%3A%2F%2Fobsidian.md%2F&embeds_referring_origin=https%3A%2F%2Fdocs.google.com)

---

## Fractal Robots

reminds us of [[Chaos, Fractals, and Dynamical Systems|chaos theory]]!

Idea: **self similarity** for robots, not only on morphology but also itsoo

Evolve **small** CPPNs alone, then evolve the fractal-ish collection of small CPPNs as one robot. Dual evolution objective; good alone *and* good together.
