---
date: 2026-01-21T12:10:45-05:00
updated: 2026-01-27T10:45:27-05:00
class:
  - note
tags:
  - math/chaos/fixed-point
source:
related:
author:
description:
aliases:
  - Feigenbaum Constants
---
The **Feigenbaum constant** arises in [[Chaos Theory]] when studying the behavior of certain types of functions as they undergo period-doubling bifurcations. It is named after the physicist Mitchell Feigenbaum, who discovered it in the 1970s.

First example was found by Feigenbaum studying the [[Logistic Map]], where period double bifurcations happen as the parameter r is increased. However it was later found to apply to all one dimensional maps with single quadratic maxima. Meaning, **every chaotic system** corresponds to this description will bifurcate at the same rate.

Roughly defined as:

$$
\delta = \lim_{n \to \infty} \frac{a_{n-1} - a_{n-2}}{a_{n} - a_{n-1}} = 4.6692016091029906718532038204662016172581855774757686327456513435...
$$

Not to be confused with the [[Feigenbound Constant]], which is a different mathematical constant related to the bounds of certain functions.

---

## Second Constant

There are actuall two Feigenbaum constants. The second one $\alpha$, also known as the **Feigenbaum reduction parameter**, is defined as:

$$
\alpha = \lim_{n \to \infty} \frac{d_{n}}{d_{n+1}} = 2.50290787509589282228390287321821578...
$$

It is the ratio between the width of a tine and the width of one of its two subtines (except the tine closest to the fold).
