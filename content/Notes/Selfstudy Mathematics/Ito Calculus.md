---
id: Ito Calculus
aliases: []
tags:
  - math/calculus
class:
  - note
date: 2025-10-06
updated: 2025-10-11
---
**Ito Calculus** represents a fundamental framework in stochastic calculus, primarily used to model random processes that evolve over time. It is named after the Japanese mathematician Kiyoshi Itō, who developed the theory in the mid-20th century. Ito Calculus is particularly important in fields such as financial mathematics, physics, and engineering, where it is used to analyze systems influenced by random noise.

The main component behind Ito Calculus is the **Ito Stochastic Integral**, which allows for the integration of functions with respect to [[Brownian motion]] (or Wiener process). Unlike traditional calculus, where integrals are defined in a deterministic manner, Ito integrals account for the randomness inherent in the processes being studied.

$$
Y_t = \int_0^t H_s \, dX_s
$$

![[itoCalculusVsBrownian.png]]

*The above graph represents the **Ito Integral**(blue) compared to [[Brownian Motion]] (red) *
