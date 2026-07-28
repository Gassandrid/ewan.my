---
date: 2025-12-16
updated: 2026-02-10T10:11:14-05:00
class:
  - note
tags:
  - comp-neuro/models
  - math/calculus/differential/ode
source:
  - "[[The Core Equation Of Neuroscience]]"
  - "[[Elegant Geometry of Neural Computations]]"
  - "[[Artem Kirsanov]]"
  - "[[Morris-Lecar Model]]"
related:
author:
description: the most well know 4 dimension coupled ODE for single neuron modeling
aliases:
  - Hodgkin Huxley
  - Hodgkin-Huxley Model
  - HH
---
Famous and standard model for Neuronal Current prediction. While quite complicated for large population models, HH does a great job at modeling single neurons by directly capturing the biophysics of the [[Ion Channels#K⁺ Channels|Potassium]] and [[Ion Channels#Na⁺ Channels|Sodium]] channels.

$$
\begin{cases}
C_{m} \frac{dV}{dt}=\bar{g}_{Na} \color{red} m\color{white}^3 \color{yellow} h \color{white}(E_{Na}-\color{blue}V \color{white}) \\ \quad \quad+ \bar{g}_{K} \color{green} n\color{white}^4 (E_{K}- \color{blue}V \color{white}) + g_{L}(E_{L}- \color{blue} V \color{white})  \\ 
 \frac{d\color{red}m}{dt} = \alpha_{m} ( \color{blue}V \color{white}) (1-\color{red}m \color{white}) - \beta_{m} (\color{blue}V \color{white}) \color{red} m \\
\frac{d\color{yellow}h}{dt} = \alpha_{h}(\color{blue}V\color{white}) (1-\color{yellow}h \color{white}) - \beta_{h}(\color{blue}V \color{white}) \color{yellow} h  \\
\frac{d\color{green}n}{dt} = \alpha_{n} (\color{blue}V\color{white}) (1-\color{green}n \color{white}) - \beta_{n}(\color{blue}V\color{white}) \color{green}n
\end{cases}
$$

## Membrane Voltage

$$
\begin{cases}\\
C_{m} \frac{dV}{dt}=\overbrace{ \bar{g}_{Na} \color{red} m\color{white}^3 \color{yellow} h \color{white}(E_{Na}-\color{blue}V \color{white}) }^{ I_{Na^+} } \\ \quad \quad+ \underbrace{ \bar{g}_{K} \color{green} n\color{white}^4 (E_{K}- \color{blue}V \color{white}) }_{ I_{K^+} } + \underbrace{ g_{L}(E_{L}- \color{blue} V \color{white}) }_{ I_{leak} }  \\ \\
\end{cases}
$$

![[hodHux.png]]

## Gates
