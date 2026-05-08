---
id: Networking Hw 5
aliases: []
tags: []
abstract: "Instructions: Complete each of the following problems. There are 100 total points. Each problem has its own point value. If a problem has multiple parts, they are equi-valued. Please use a word processor or text editor for solutions, and submit as a pdf file via Brightspace."
author:
  - Ewan Pedersen
date: 2026-05-01T09:40:19-04:00
title: Homework 5
updated: 2026-05-01T22:14:18-04:00
---

## Problem 1

> [!Question]
> Complete Problem P7 on page 382 in the textbook. For part (a), assume that x has already computed its distance vector update after having received w and y's distance vectors with the information described in the problem.

fig values: $c(x,w)=2$, $c(x,y)=5$, $c(w,y)=2$. given $D_w(u)=5$, $D_y(u)=6$. so $D_w(y)=2$, $D_y(w)=2$ from the direct w-y link.

### A

bellman-ford at x. two next-hops: w (cost 2) and y (cost 5).

- $D_x(w) = \min\{2,\ 5+2\} = 2$ (direct)
- $D_x(y) = \min\{5,\ 2+2\} = 4$ (via w, not direct; w-y link costs 2)
- $D_x(u) = \min\{2+5,\ 5+6\} = 7$ (via w)

### B

drop $c(x,w)$ to 1. new $D_x(u) = 1+5 = 6 < 7$. min-cost path to u changed, so x sends updated DV to neighbors.

### C

raise $c(x,y)$. $D_x(u)$ still $\min\{7, c(x,y)+6\} = 7$, y-route never competitive as long as $c(x,y) > 1$. $D_x(y)$ still 4 via w as long as $c(x,y) \geq 4$. nothing changes, no update sent. the direct x-y link has slack; all minimums are via w.

> [!Success] Answer
> **(a)** $D_x(w)=2$, $D_x(y)=4$ (via w), $D_x(u)=7$ (via w). **(b)** decrease $c(x,w)$ to 1 → $D_x(u)$ drops to 6, triggers update. **(c)** increase $c(x,y)$ → no minimum changes, no update.

---

## Problem 2

> [!Question]
> Describe how loops in paths can be detected in BGP.

bgp is **path vector** protocol. every route advertisement carries full ordered AS-PATH, not just a scalar distance. on receipt, a router checks whether its own ASN already appears in AS-PATH; if yes, the route is dropped.

this works directly because the path is explicit. pure DV protocols don't carry path info, so they can count to infinity around a loop. bgp doesn't have that problem. the loop is literally visible in the attribute.

> [!Success] Answer
> AS-PATH attribute carries the full ordered list of ASNs traversed. receiver rejects any route whose AS-PATH contains its own ASN. works because full path is explicit (path-vector, not DV); loops are directly observable rather than inferred from distances.

---

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

### A

not malicious. aug 25 2017, accidental leak. google was using ~160k more-specific prefixes internally for traffic engineering and those routes mistakenly got announced to verizon. google apologized. classic misconfig, not an attack.

### B

three concurrent factors amplified each other, namely that 25k+ of the leaked routes were NTT OCN's address space (largest single-network share in the leaked set), the **KDDI** (verizon transit customer) accepted  roughly 95k leaked prefixes from verizon, **IIJ** accepted roughly 97k leaked prefixes from verizon as well. net result was KDDI and IIJ, trying to reach OCN address space, routed traffic through google's chicago infrastructure. RTT jumped from ~15ms to ~256ms. two major japanese telcos were sending domestic traffic to a third japanese telco via chicago.

### C

**MAXPREF (max-prefix limit)**. google's normal announcement to verizon is under ~50 prefixes. an instantaneous jump to 160,000+ should have auto-tripped the session; any sane limit would have caused verizon to reject or tear down the session. no such limit was configured, so verizon accepted and re-advertised the full flood to downstream customers.

> [!Success] Answer
> **(a)** not malicious. accidental misconfig, google apologized. **(b)** KDDI and IIJ are verizon transit customers that each accepted ~95–97k leaked prefixes; 25k+ of those were NTT OCN's address space, so both ended up routing domestic japan traffic through chicago. **(c)** verizon had no MAXPREF limit. a jump from <50 to 160k+ prefixes should have auto-tripped the session.
