---
id: Networking Hw 2
aliases: []
tags: []
abstract: "Instructions: Complete each of the following problems. There are 100 total points. Each problem has its own point value. If a problem has multiple parts, they are equi-valued. Please use a word processor or text editor for solutions, and submit as a pdf file via brightspace.A note about command line tools: The computer commands referenced by questions below are immediately available for Linux, MacOS, and Unix platforms, and similar tools are available for Windows. If you do not have access to these on your personal machine, you can access them by using ssh to remotely log in to silk.uvm.edu."
author:
  - Ewan Pedersen
date: 2026-02-26T10:26:10-05:00
title: Homework 2
updated: 2026-02-26T22:32:46-05:00
---

## Problem 1 (18 points).

> [!Question]
> Specify whether each of the following is true or false (exclusively):

### Solutions

1. Two different clients can send application layer data to the same host over the same UDP socket.

> [!Success] True
> udp is connectionless, server can recieve from multiple clients simultaneously

2. Two different clients can send application layer data to the same host over the same TCP socket.

> [!Error] False
> tcp connection oriented, new socket spawned for each client. clients cannot share socket

3. Both TCP and UDP provide segmentation and multiplexing services.

> [!Error] False
> both have multiplexing, but segmentation is TCP specific. UDP passes message as single datagram, fragmentation happens at ip layer not transport.

4. UDP allows the socket client to control communication latency.

> [!Error] False
> udp has no latency control system, no flow control, etc. can send whenever, but no control of comm latency

5. The UDP checksum guarantees integrity of messages.

> [!Error] False
> can miss certain error patterns, think two bit flips that cancel out. error detection is probablistic, so not a "guarantee"

6. IP addresses from datagrams received at the network layer are available at the transport layer for socket addressing.

> [!Success] True
> network layer passes addesses up to transport. TCP uses full 4 tuple (source ip / port, dest ip / port)

## Problem 2 (17 points).

> [!Question]
> Suppose that a TCP server socket on a host with IP address X is available for connections at port 11000. Further, suppose that two client processes P1 and P2 on hosts with IP addresses Y and Z respectively have requested a connection with X at port 11000 from sender port 10001. After a TCP connection is established for both P1 and P2 with the server, what information identifies the server socket (or sockets) that the server will use to communicate with each of these processes P1 and P2?

### Solution

> [!Success] Answer
> TCP demultiplexes using the 4 tuple: (source IP/port, dest/port). Even though P1 and P2 both connect from port 10001,  source IPs are different in that (Y vs Z), so the 4-tuples are distinct: P1: (Y, 10001, X, 11000), P2: (Z, 10001, X, 11000)
>
> server creates two separate connection sockets, one per client. Each socket is uniquely identified by its 4-tuple, so despite the shared sender port, there's no ambiguity. The welcome socket at (X, 11000) stays open to accept new connections; P1 and P2 each get their own dedicated socket.

## Problem 3 (16 points).

> [!Question]
> In the class lecture slides for Chapter 3, a "fatal flaw" is identified in rdt2.0. Using messaging diagrams in the style of the text and slides (e.g., slides 62-63), illustrate this fatal flaw.

### Solution

> [!Success] Answer
> flaw is that rdt2.0's sender FSM has no defined transition `corrupt(rcvpkt)` in Wait for ACK /NAK state. It handles `isACK` (proceed) and `isNAK` (retransmit), but but gibberish response not classifiable

case for ack corruption where retransmission causes duplication

![[Screenshot 2026-02-26 at 10.27.52 PM.png]]

case for nak corruption where lost goes is not recovered

![[Screenshot 2026-02-26 at 10.28.27 PM.png]]

> Fix (rdt2.1): add sequence numbers so the receiver can detect and discard duplicates, making retransmit-on-any-ambiguity safe.

## Problem 4 (17 points).

> [!Question]
> Consider the alternating bit protocol rdt3.0 described in Section 3.4.1 in the textbook (and in the course Chapter 3 slides 58-63), and suppose that 5 data messages (numbered 0-4) are to be sent by the application, and each message is sent as a distinct segment (packet) by the sender. Using messaging diagrams in the style of the text and slides (e.g., slides 62-63), show the sequence of message exchanges under the assumption that the first send of message 2 is lost and that the first ack of the message 3 packet is corrupted.

### Solution

Used a mermaid diagram, as they have a tool for these exact kinds of conversation flows.

> [!Success] Answer

![[Screenshot 2026-02-26 at 10.32.16 PM.png]]

![[Screenshot 2026-02-26 at 10.32.38 PM.png]]

## Problem 5 (16 points).

> [!Question]
> In class we have discussed that UDP is naively a better choice than TCP for streaming video, due to typically lower latency and loss tolerance of the application. However, is this true in practice? Research the following question online and provide 1-2 paragraphs of explanation: Does Netflix use TCP or UDP for video streaming, and why? Note you may get some AI slop doing a google search on the topic, but Quora, for example, has a good discussion.

### Solution

> [!Success] Answer
> It uses TCP, something called "DASH" - dynamic adaptive streaming over http, on their cdn. you would think the UDP is better for streaming intuition, but instead netflix has a buffer based model, not a latency sensitive thing. several minute long buffer. TCP retransmission overhead doesnt matter much here, as buffer absorbs delay. Video quality and lack of corruption are our priority here.
> 
> UDP has an advantage of low latency, but that only matters for actually real time apps, like a live video game or video call. Retransmission is essentially useless in those cases, as it would already be too late. Reliability is much more important in on demand video streaming, and adaptive bitrate methods to scale quality based on throughput, pairs well wtih TCP congestion control. 

## Problem 6 (16 points).

> [!Question]
> Do the following problems in the textbook, beginning on page 247: R7, P5

### Solutions

#### R7

> [!Success] Answer
> yes, since both segments directed to same socket. UDP demultiplexes on dest ip/port, not full 4 tuble like TCP is. Since btoh a/b are sending C:6789, hit same socket regardless of origin.
>
> process is dinstinguished by source ip / port embedded in each datgram. OS brings this via `recvfrom()`, to return sender adress long with data. socket is shared, but each incoming datgram carries origin.

#### P5

> [!Success] Answer
> no,  mactching checksum does not guarentee no errors occuring. UDP checksum is 1s complement over 16 bit words, possible for multiple errors to "cancel out", producing same checksum
>
> simple case: two bits flip in different words s.t. one word and another increase/decrease by same amount. sum is unchanged, checksum matches despite data corruption. probablistic detection over guarentee
