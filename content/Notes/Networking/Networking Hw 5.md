---
id: Networking Hw 5
aliases: []
tags: []
abstract: "Instructions: Complete each of the following problems. There are 100 total points. Each problem has its own point value. If a problem has multiple parts, they are equi-valued. Please use a word processor or text editor for solutions, and submit as a pdf file via Brightspace."
author:
  - Ewan Pedersen
date: 2026-05-01T09:40:19-04:00
title: Homework 5
updated: 2026-05-01T11:08:14-04:00
---

## Problem 1

> [!Question]
> Complete Problem P7 on page 382 in the textbook. For part (a), assume that x has already computed its distance vector update after having received w and y's distance vectors with the information described in the problem.

### Solution

fig values: $c(x,w)=2$, $c(x,y)=5$, $c(w,y)=2$. given $D_w(u)=5$, $D_y(u)=6$. so $D_w(y)=2$, $D_y(w)=2$ from the direct w-y link.

> [!Success] answer
> **a.** x's DV after receiving w and y's vectors:
> - $D_x(w) = \min\{c(x,w),\; c(x,y) + D_y(w)\} = \min\{2,\; 5+2\} = 2$
> - $D_x(y) = \min\{c(x,y),\; c(x,w) + D_w(y)\} = \min\{5,\; 2+2\} = 4$ (route thru w, not direct)
> - $D_x(u) = \min\{c(x,w) + D_w(u),\; c(x,y) + D_y(u)\} = \min\{2+5,\; 5+6\} = 7$ (via w)
> 
> **b.** decreas $c(x,w)$ from 2 t 1. new $D_x(u) = 1+5 = 6 < 7$, min-cost t u changes, x informs neighbors. (alt: rais $c(x,w)$ above 6 so x switches t the y-route — also triggers update.)
> 
> **c.** increas $c(x,y)$ from 5 t 6 (or higher). $D_x(u)$ stil $\min\{7,\; 12\} = 7$ via w. $D_x(y)$ stil 4 via w (since via-w path costs 4, unaffected by $c(x,y)$ as long as it stays $\ge 4$). nothng changes, no update sent. the unused-for-u link has slack.

## Problem 2

> [!Question]
> Describe how loops in paths can be detected in BGP.

### Solution

> [!Success] answer
> bgp uses the **AS-PATH** attribute. evry route advertisemnt carries the ordered list of AS numbers it has traversd so far. when an AS receivs an advertisemnt, it inspects AS-PATH; if its own AS num already appears in the list, the route is rejected outright. that guarantees any accepted route is loop-free at the AS level.
> 
> works b/c bgp is a **path-vector** protocol, not pure distance-vector — full path is carried explicitly, so loops are visible directly w/o the count-t-infinity behavior DV suffers from.

## Problem 3

> [!Question]
> Review the article here: https://tinyurl.com/4vn3krbc
> 
> Answer the following:
> 
> a. Was Google actively malicious in this incident?
> 
> b. Why was Japan most severely affected by the incident?
> 
> c. What red flag was missed by Verizon that could have decreased the severity of this incident?

### Solution

> [!Success] answer
> **a.** no, not malicious — accidental BGP leak on aug 25 2017. google leaked ~160k more-specific prefixes that were evidently used internally for traffic shaping w/in their own network, and these mistakenly got announced t verizon. google apologized publicly afterwards. classic misconfig, not an attack.
> 
> **b.** confluence of factors hit japan hardest:
> - of the ~160k leaked routes, over **25k were NTT OCN's address space** (most of any single net) — so OCN destinations became reachable thru google.
> - **KDDI** (a verizon transit customer) accepted ~95k leaked prefixes from verizon.
> - **IIJ** accepted ~97k leaked prefixes from verizon as well.
> - net result: traffic from KDDI/IIJ destined for OCN got rerouted halfway around the world thru google's network in chicago. round-trip times jumpd from ~15ms t ~256ms, much of it droppd due t bandwidth/latency constraints. so two big japanese telcos were sending traffic for a third big japanese telco via chicago.
> 
> **c.** verizon missed a **MAXPREF (max-prefix) trip**. google normally sends verizon fewer than ~50 prefixes on any given day. an instantaneous jump t 160,000+ prefixes (representing ~400M IPv4 adresses) should hav blown past any sane max-prefix limit on the verizon-google bgp session and automatically shut the session down or filtered. verizon had no such guardrail in place, so they happily accepted and re-advertised the flood t their own customers.
