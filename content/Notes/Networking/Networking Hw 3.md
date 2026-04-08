---
id: Networking Hw 3
created_on: "[[04-02-2026]]"
aliases: []
tags: []
abstract: "Instructions: Complete each of the following problems. There are 100 total points. Each problem has its own point value. If a problem has multiple parts, they are equi-valued. Please use a word processor or text editor for solutions, and submit as a pdf file via brightspace. A note about command line tools: The computer commands referenced by questions below are immediately available for Linux, MacOS, and Unix platforms, and similar tools are available for Windows. If you do not have access to these on your personal machine, you can access them by using ssh to remotely log in to silk.uvm.edu."
author:
  - Ewan Pedersen
date: 2026-04-02T15:41:40-04:00
title: Homework 3
updated: 2026-04-02T19:51:51-04:00
---

> [!Note] Note about Go-Back-N
> Consistent with the course textbook definition, we assume that the Go-Back-N receiver does not buffer packets received out-of-order, but just discards them.

## Problem 1 (24 points).

> [!Question]
> Consider the Go-Back-N and Selective Repeat protocols. Assume that 8 packets with sequence numbers 0-7 are to be sent, with a window size N=4. Using messaging diagrams in the style we've been using, show the sequence of exchanges that result for both Go-Back-N and selective repeat given all of the following assumptions:
>
> - RTT does not change, and is less than the protocol timeout intervals.
> - The transmission rate of packets is negligible.
> - The first ack of packet 2 is lost.
> - The first sends of packets 6 and 7 arrive out-of order.

### Solution

#### Go-Back-N

we see cumalative acks, ACK 2 lost howevr ACK 3 arrives, thus sender slides window past 2. when 7 arrives before 6, receiver discards 7 and re ACKs 5.sender times out on 7 and retransmits.

> [!Success] Answer
> *warning diagram may be on another page*

![[Screenshot 2026-04-02 at 7.47.45 PM.png]]

![[Screenshot 2026-04-02 at 7.48.16 PM.png]]

#### Selective Repeat

just individual acks, ACK 2 lost triggers a timeout for packet 2 only. out-of-order packets 6 and 7 are buffered at the receiver, so only packet 2 needs to be retransmitted.

> [!Success] Answer
> *warning diagram may be on another page*

![[Screenshot 2026-04-02 at 7.49.03 PM.png]]

![[Screenshot 2026-04-02 at 7.49.16 PM.png]]

> [!Question]
> Consider the Go-Back-N protocol with a window size N = 50. Suppose only 30 packets are to be sent with sequence numbers 0-29, and also assume the following:
>
> - RTT does not change, and is less than the protocol timeout intervals.
> - The transmission rate of packets is negligible.
> - The first send of the packet with sequence number 9 is lost.
>
> Now, answer the following:
>
> a. How many packets will be resent?
> b. Imagine that the Fast Retransmit optimization has been added to the protocol with the addition of receiver-side buffering to support the optimization (as we've discussed in Active Learning 2, Topic 3.c). How many packets will be resent in this case?

### Solution

> [!Success] Answer
> a. packet 9 lost, thus receiver discards everything after (10-29) and sends dup ACK 8 for each. after sender timer expires, retransmits 9 - 29. total of 21 packets
>
> b. given fast retransmit and receiver buffering, receiver stores 10-29, 3 dup ACKs for 8 trigger early retransmit of only packet 9. after 9 arrives, receiver delivers 9-29 in order and ACKs 29. total of 1 packet

## Problem 3 (20 points).

> [!Question]
> Assume that in some TCP communication cwnd is currently at 80. For simpicity assume MSS = 1. Specify resulting values of cwnd and the slow-start threshold in each of the following scenarios:
>
> a. A triple-duplicate ACK is detected using TCP Reno.
> b. A triple-duplicate ACK is detected using TCP Tahoe.
> c. A timeout is detected using TCP Reno.
> d. A timeout is detected using TCP Tahoe.

### Solution

> [!Success] Answer
> for all given cases, $ssthresh = cwnd/2 = 40$.
>
> a. TCP Reno (3-dup ACK): fast recovery. $ssthresh = 40$, $cwnd = 43$ ($ssthresh + 3$ for the 3 dup-ACKd segments still in flight).
>
> b. TCP Tahoe (3-dup ACK): no fast recovery, and treated same as timeout. $ssthresh = 40$, $cwnd = 1$.
>
> c. TCP Reno (timeout): resets to slow start $ssthresh = 40$, $cwnd = 1$.
>
> d. TCP Tahoe (timeout): $ssthresh = 40$, $cwnd = 1$.

## Problem 4 (36 points).

> [!Question]
> Do the following problems in the textbook Chapter 3: P23 (10 points), P31 (12 points), P40(a-g) (14 points). Photos of these problems are included in the Brightspace posting for this assignment.

### Solutions

#### P23

> [!Success] Answer
> window size $N=3$, sequence space $= 4$ (indices 0-3). showing receiver can accept a duplicate if $N > \text{space}/2$:
>
> 1. sender sends 0, 1, 2. receiver delivers and sends ACK 0, 1, 2. receiver window slides to [3, 0, 1].
> 2. all ACKs (0, 1, 2) are lost.
> 3. sender's timer for 0 expires, retransmits packet 0.
> 4. receiver sees 0 is in its current window [3, 0, 1], accepts it as *new* and delivers it again.
>
> protocol failure. to prevent this, need $W \leq \text{SeqSpace}/2$.

#### P31

> [!Success] Answer
> $\alpha = 0.125$, $\beta = 0.25$, initial $EstRTT = 100\text{ms}$, $DevRTT = 5\text{ms}$.
>
> - $EstRTT = (1 - \alpha) \cdot EstRTT + \alpha \cdot SampleRTT$
> - $DevRTT = (1 - \beta) \cdot DevRTT + \beta \cdot |SampleRTT - EstRTT|$
> - $Timeout = EstRTT + 4 \cdot DevRTT$
>
> | Sample | SampleRTT | EstimatedRTT | DevRTT | TimeoutInterval |
> | :--- | :--- | :--- | :--- | :--- |
> | - | - | 100.00 | 5.00 | 120.00 |
> | 1 | 106 | 100.75 | 5.25 | 121.75 |
> | 2 | 120 | 103.16 | 8.75 | 138.16 |
> | 3 | 140 | 107.76 | 14.61 | 166.20 |
> | 4 | 90 | 105.54 | 15.40 | 167.14 |
> | 5 | 115 | 106.72 | 13.91 | 162.36 |

#### P40

> [!Success] Answer
> a. slow start intervals: rounds [1, 6] and [17, 22].
>
> b. congestion avoidance intervals: rounds [6, 16] and [22, 26].
>
> c. loss at round 16: timeout. cwnd drops to 1, not half, triple-dup ACK in Reno would halve it.
>
> d. loss at round 22: triple duplicate ACK. cwnd halves rather than resetting to 1.
>
> e. initial ssthresh: 32. exponential growth switches to linear at round 6 when cwnd hits 32.
>
> f. ssthresh at round 18: 21. loss at round 16 with cwnd=42, so $ssthresh = 42/2 = 21$.
>
> g. ssthresh at round 24: 21. no new loss event, ssthresh unchanged.
>
> h. 70th segment: rounds 1-6 send $1+2+4+8+16+32 = 63$ segments. round 7 has cwnd=33. 70th segment sent in round 7.
>
> i. triple-dup ACK at round 26 with cwnd=25: $ssthresh = 12$, $cwnd = ssthresh + 3 = 15$.
