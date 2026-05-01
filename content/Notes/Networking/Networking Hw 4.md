---
id: Networking Hw 4
aliases: []
tags: []
abstract: "Instructions: Complete each of the following problems. There are 100 total points. Each problem has its own point value. If a problem has multiple parts, they are equi-valued. Please use a word processor or text editor for solutions, and submit as a pdf file via brightspace.A note about command line tools: The computer commands referenced by questions below are immediately available for Linux, MacOS, and Unix platforms, and similar tools are available for Windows. If you do not have access to these on your personal machine, you can access them by using ssh to remotely log in to silk.uvm.edu."
author:
  - Ewan Pedersen
date: 2026-04-21T18:15:21-04:00
title: Homework 4
updated: 2026-04-21T21:38:56-04:00
---

## Problem 1 (20 points).

> [!Question]
> As he writes this problem, Professor Skalka is working on a Mac laptop connected to a Wifi router. When looking up the IPv4 address of his laptop via Wifi details in system settings, he sees it is 10.0.0.54. However, when looking up his IPv4 address via online tools (such as https://www.whatismyip.com/), he sees it is 71.234.168.254. Explain this discrepancy.

### Solution

> [!Success] answer
> `10.0.0.54` adress is just **privat ip** that wifi router gave t laptop. for local network use only and arent routable on open web `10.x.x.x` range is standard private block.
> 
> the other one, `71.234.168.254`, is the **public ip** adress of the actual router, which was assigned by the isp. this is what the outside world sees. 
> 
> difference due to **nat** (network adress translation). router sits in middl, swaps out internal priv ip for own public one when sending packets out to the internet. standradr tools can see pulibc, but only mac knows local one it is being handed.

## Problem 2 (20 points).

> [!Question]
> Answer each of the following questions about CIDR addressing.
> 
> a. Write the netmask 255.255.0.0 in equivalent “slash” notation.
> b. What address range is represented by 198.228.12.20/24?
> c. Suppose a corporation was allocated the block 198.226.12.20/16, and they wanted to maintain /24 subnets. How many subnets could they define, given this address block?
> d. Given assumptions in (c), how many host IP addresses are available for each subnet?

### Solution

> [!Success] answer
> **a.** 255.255.0.0 is **/16**. first two octets r all 1s ($8+8=16$).
> 
> **b.** range: **198.228.12.0 t 198.228.12.255**. /24 means first 3 octets fixed for netwrok, last one for host.
> 
> **c.** got /16 and want /24s. thats 8 bits for subnetting ($24-16=8$), so can hav $2^8 =$ **256 subnets**.
> 
> **d.** in /24, 8 bits for host, so $2^8 = 256$ total adresses. drop netwrok adress and broadcast, so **254 host adresses** are availabl.

## Problem 3 (20 points).

> [!Question]
> Suppose your Internet host is running on a system using NAT addressing, and is assigned IP address 10.0.0.1. An Internet application you’re running on port 100 sends a TCP message to a server listening at IP address 192.168.1.3, port 80, to which the server responds. Assume that your LAN’s NAT router maps IP 10.0.0.1, port 100 to IP 192.168.7.1, port 333. Answer the following:
> 
> a. What destination port number will be in the segment header of the server’s response and what destination IP address will be in the datagram header before it reaches your LAN’s NAT router.
> b. What destination port number will be in the segment header of the server’s response to your application and what destination IP address will be in the datagram header after it traverses your LAN’s NAT router?

### Solution

> [!Success] answer
> **a. before nat router:**
> server is respondng t pulibc identity of router.
> - **dest ip:** 192.168.7.1
> - **dest port:** 333
> 
> **b. after nat router:**
> router translate packet back for local host.
> - **dest ip:** 10.0.0.1
> - **dest port:** 100

## Problem 4 (20 points).

> [!Question]
> Complete Chapter 4, P8 on page 322 of the textbook, but use CIDR notation (not binary strings and *) to specify prefixes in your forwarding table.

### Solution

ranges in screenshot looking for longest prefix for each:

**a. forwarding table**

| prefix match | link interface |
| --- | --- |
| `11100000 00` (/10) | 0 |
| `11100000 01000000` (/16) | 1 |
| `11100000 01` (/10) | 2 |
| `11100001 0` (/9) | 2 |
| otherwis | 3 |

**b. interface determination**

1. `11001000 ...`: doesnt match any `1110` prefixes. **interface 3**.
2. `11100001 01000000 ...`: matches /9 prefix for link 2. **interface 2**.
3. `11100001 10000000 ...`: match first 8 bits but 9th bit is a 1, so it fails /9 match. nothing else. **interface 3**.

## Problem 5 (20 points).

> [!Question]
> Complete Chapter 4, P23 on page 326 of the textbook. In your flow table specs you can omit header fields where any value is allowed.

### Solution

using standard ips for h1-h6 from text.

> [!Success] answer

**1. h1/h6 t h3/h4 only**

| src ip   | dst ip   | action      |
| -------- | -------- | ----------- |
| 10.1.1.1 | 10.1.2.1 | forward(h3) |
| 10.1.1.1 | 10.1.2.2 | forward(h4) |
| 10.1.3.2 | 10.1.2.1 | forward(h3) |
| 10.1.3.2 | 10.1.2.2 | forward(h4) |

**2. only tcp t h3/h4**

| ip proto | dst ip | action |
|---|---|---|
|tcp|10.1.2.1|forward(h3)|
|tcp|10.1.2.2|forward(h4)|

**3. only t h3**

| dst ip | action |
|---|---|
|10.1.2.1|forward(h3)|

**4. only udp from h1 t h3**

| src ip | dst ip | ip proto | action |
|---|---|---|---|
|10.1.1.1|10.1.2.1|udp|forward(h3)|
