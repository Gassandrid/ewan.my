---
class:
  - note
  - lecture
tags:
  - university
  - math/chaos
course: "[[Chaos, Fractals, and Dynamical Systems]]"
lecture-number: 10
source:
related:
author:
description:
aliases:
date: 2026-02-12T10:09:10-05:00
updated: 2026-02-17T10:54:30-05:00
---

We finally will define what it means for a system to be *chaotic*.

**Typical behavior:** 

- [[Fixed Point Classification|Fixed Points]]
	- [[Attracting fixed point|Sink]]
	- [[Repelling fixed point|Source]]
	- [[Saddle fixed point|Saddle]]
- [[Periodic Orbit Stability|Periodic Orbits]]
	- also have those 3
- Unbounded

Unstable behavior may be *transcient*, gives way to stability in the long run.

Initial conditions that are near [[Repelling fixed point|Sources]] don't necessarily end up in the basin of a [[Attracting fixed point|sink]]. A **chaotic** orbit will be one that experiences the unstable behavior associated with being near a source, [[Sensitive Dependence on Initial Conditions]], but that is not itself fixed or [[Periodic Orbit Stability|periodic]].

> [!Abstract] Lyapunov Number
> 
> Let $f$ be a continuous map on $\mathbb{R}$. The Lyapunov number $L(x_{1})$ of the orbit $\{ x_{1},x_{2},\dots \}$ is defined as:
>
> $$
> L(x_{1}) = \lim_{ n \to \infty } (|f^{'}(x_{1})|\cdot |f^{'}(x_{2})|\dots |f^{'}(x_{N})|)^{\frac{1}{n}} \quad if \ it \ exists
> $$

>[!Example]
> If $x_{1}$ is in the basin of a fixed point sink $p$, then:
>
> $$
> \begin{align*}
> L(x_{1}) &= \lim_{ n \to \infty } \left( \begin{array}
> f \text{product of n} \\
> \text{slopes approaching } \\
> f^{'}(p)
> \end{array} \right) \\
> &= |f^{'}(p)|
> \end{align*}
> $$

If $x_{1}$ is in the basin of a period-2 [[Attracting fixed point|sink]] $\{ p_{1},p_{2} \}$,  then:

$$
\begin{align*}
L(x_{1}) &= \sqrt{ |f^{'}(p_{1})|\cdot |f^{'}(p_{2})| } \\
&= (|f^{'}(p_{1})|\cdot |f^{}(p_{2})|)^{\frac{1}{2}}
\end{align*}
$$

$$
\begin{align*}
L<1 &\Rightarrow sink \\
L> 1 &\Rightarrow source \text{(or something else)}\\
\end{align*}
$$

>[!Example]
>
> $$
> f(x) = 3x(\mod 1)
> $$

imagine $x_{1} \in\text{Irrational}$  $L(x_{1})=3$

---

## [[Lyapunov Exponents]]

$h(x_{1})$ is defined as:

$$
h(x_{1}) = \lim_{ n \to \infty } \frac{1}{n} \left( \ln |f^{'}(x_{1})| + \ln |f^{'}(x_{2})| + \dots + \ln |f^{'}(_{n})| \right)
$$

if it exists, and $\ln(L)=h$, 

If $x_{1}$ is a period-K point, then:

$$
h(x_{1}) = \underbrace{ \frac{1}{K} \left(\ln |f^{'}(x_{1})| + \ln |f^{'}(x_{2})| + \dots \ln |f^{'}(x_{n})| \right) }_{ \text{limit is now gone} }
$$

We are describing the average local stretching or shrinking along an orbit.

$$
\begin{align*}
h>0, L>1 &\Rightarrow \text{stretching} \\
h<0, 0<L<1 &\Rightarrow \text{shrinking}
\end{align*}
$$

Let $f$ be a smooth map on $\mathbb{R}$. An orbit $\{ x_{1},x_{2},\dots,x_{n} \}$ is called *[[asymptotically periodic]]*(A.P.) if it converges to a periodic orbit as $n\to \infty$. 

In other words, there exists a periodic orbit given by $\{ y_{1},y_{2},\dots,y_{k}, y_{1},y_{2},\dots y_{k}\dots \}$  such that:

$$
\lim_{ n \to \infty } |x_{n} - y_{n}| = 0
$$

orbits that are [[eventually periodic]] (E.P.) will also be *[[asymptotically periodic]]*.

---

## Chaotic Orbits

Let $f$ be a smooth map on $\mathbb{R}$ and let $\{ x_{1},x_{2},\dots \}$ be an orbit of $f$. The orbit is **chaotic** if:

1. the orbit must be bounded ( not in basin of $\infty$ )
2. the orbit must not *[[asymptotically periodic]]*
3. the [[Lyapunov Exponents|Lyapunov Exponent]] $h(x_{1})>0$

>[!Example]
> Consider the map
>
> $$
> f(x) = (x+q) (\mod 1) \quad \text{where  } q \in (0,1) \text{ is irrational}
> $$

> [!Info] Desmos
> <iframe src="https://www.desmos.com/calculator/rkda9auwgz" width=600 height="400" ></iframe>

> [!Quote] Transcription
> this ia test  


**Chaotic Orbits?**

1. $f$ has **no** [[Periodic Orbit Stability|periodic orbits]]. - YES
2. no periodic orbits to BE approaching - YES
3. $h>0$? - NO
	- because $h=0$ everywhere

If $q$ were rational, then rational [[Sensitive Dependence on Initial Conditions|Initial Conditions]] would be [[Eventually Periodic]], and irrationals would bounce around forever, never repeating, but also never separating from the neighbors. 

A bounded orbit that is not [[Asymptotically Periodic]] and does not exhibit [[Sensitive Dependence on Initial Conditions|SDIC]] is [[Quasi Periodic]]
