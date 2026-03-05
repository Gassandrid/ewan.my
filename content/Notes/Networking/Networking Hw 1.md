---
id: Networking Hw 1
created_on: "[[02-03-2026]]"
aliases: []
tags: []
abstract: "Instructions: Complete each of the following problems. There are 100 total points. Each problem has its own point value. If a problem has multiple parts, they are equi-valued. Please use a word processor or text editor for solutions, and submit as a pdf file via brightspace.A note about command line tools: The computer commands referenced by questions below are immediately available for Linux, MacOS, and Unix platforms, and similar tools are available for Windows. If you do not have access to these on your personal machine, you can access them by using ssh to remotely log in to silk.uvm.edu."
author:
  - Ewan Pedersen
date: 2026-02-03T14:12:01-05:00
title: Homework 1
updated: 2026-02-05T17:29:30-05:00
---

## Problem 1 (15 points).

> [!Question]
> List all 5 layers of the TCP/IP stack and briefly explain the purpose of each, 1-2 sentences per layer.

### Solution

**1. Physical Layer**: handles transmission of the raw bits we work over, via some meidum. Definition for electricial/mech/timing specs, for data across hardware.

**2. Link Layer**: data transfer between directly connected clients on the same local network. Node to node, includes protocols like MAC addresses, media access control, and error detection.

**3. Network Layer**: routing packets across local networks, and adressing via IP Adresses. Finds the best path for data to travel through weighing multiple paths over networks. Responsible for protocols like IP, ICMP, and other routing stuff.

**4. Transport Layer**: fully end to end communication framework, handeling reliability/flow control/multiplexing. Protocols like TCP and UDP are defined here, also process to process communication over port numbers.

**5. Application Layer**: direct network service for user applications, and protocols to support that. Things like HTTP/s, FTP, DNS all live on this level. Used to exchange data in bulk, packets, etc.

## Problem 2 (35 points).

> [!Question]
> Answer each of the following problems from the textbook, starting on page 146 of the domestic version of the 9th edition (refer to screenshots of problems included with this assignment if you do not have access to this version): R5, R6, R10, R11, R19, R23, P3.

### Solutions

#### R5: What Information is Used by a Process Running on One Host to Identify a Process Running on Another Host?

> [!Success] Answer
> They are identified by using the **IP Address** for the destination host, and the **Port Number** to specify the specific process on said host. These come together to form [[Sockets|socket]] addresses. IP locates machine on network, port directs data to application on machine.

#### R6: Suppose You Wanted to Do a Transaction from a Remote Client to a Server as Fast as Possible. Would You Use UDP or TCP? Why?

> [!Success] Answer
> UDP. It is faster for a single transcation, no overhead for reliability/redundancy. TCP requires a complex 3 way handshake, whereas UDP skips and sends data immediately without setup.

#### R10: What is Meant by a Handshaking Protocol?

> [!Success] Answer
> Handshakes are an exchange protocol which two or more entities use to establish the paramaters of the connection, along with ensuring stability and readyness. TCP uses a three way handshake for starting connection state, buffer sizes, and other coordination efforts.

#### R11: Why Do HTTP, SMTP, and IMAP Run on top of TCP rather than on UDP?

> [!Success] Answer
> integration of reliability guardrails to ensure data integrity even over unstandble connections. they cannot afford to break up the order of the data. HTTP is for web pages, it makes sense why this would need order. If data order was not preserved or some missing, pages, and documents would be broken and unusable. SMTP needs this as emails must be delivered without loss, no room for corruption or partial. Same case for IMAP as email retrieval needs all headers and attachments in one complete unobstructed transfer.
>
> TCP can guarentee packet delivery by retransmission if failed, and preserves order with sequence indices. Does this with error detection/correction. UDP, while fast, cannot do any of these things.

#### R19: Is it Possible for an Organization's Web Server and Mail Server to Have Exactly the Same Alias for a Hostname (for Example, `foo.com`)? What Would Be the Type for the RR that Contains the Hostname of the Mail Server?

> [!Success] Answer
> yes, because DNS uses a resource record to distinguish services, not just the hostname. For web servers an A record is used, while mail servers use MX records. Both can point to the same hostname `foo.com` but are differentiated by their record type.

#### R23: In Section 2.6, the UDP Server Described Needed only One Socket, whereas the TCP Server Needed Two Sockets. Why? If the TCP Server Were to Support _n_ Simultaneous Connections, Each from a Different Client Host, how Many Sockets Would the TCP Server Need?

> [!Success] Answer
> UDP only needs one socket because it is connectionless. server receives datagrams from any client on the same socket, and can respond to each client by reading the source address from the datagram. doesnt need to do any connection setup.
>
> TCP on the other hand is connection oriented. it needs a welcome socket to listen for incoming connections, and then creates a new connection socket for each client after accepting the connection. the welcome socket stays open to accept new connections, while the connection socket handles data transfer with that specific client.
>
> in the case of n simultaneous connections, the TCP server would need to have one welcome socket plus n connection sockets, for a total of n + 1 sockets.

#### P3: Consider an HTTP Client that Wants to Retrieve a Web Document at a given URL. The IP Address of the HTTP Server is Initially Unknown. What Transport and Application-layer Protocols besides HTTP Are Needed in This Scenario?

> [!Success] Answer
> We would use DNS for the application layer to resolve hostname in URL to IP address. Transport layer would use UDP for DNS queries, and TCP for HTTP connection.
>
> we would follow something like:
>
> 1. client gets hostname from url
> 2. client send dns query over udp to dns server
> 3. dns server responds with ip address
> 4. client establishes tcp connection to ip address
> 5. client sends http get request over tcp connection

## Problem 3 (10 points).

> [!Question]
> Identify the RFC that defines TLS 1.3, and list the security properties TLS is intended to support as a communications channel, as described in the RFC Section 1.

### Solution:

> [!Success] Answer
> TLS 1.3 is defined in **RFC 8447** (Aug 2018), main security properties are;
>
> - authentication, server side always, client side optionally
> - confidentiality, data only visible to endpoints
> - integrity, data cannot be modified without detection
>
> will remain even if attacker has full network control.

## Problem 4 (20 points).

> [!Question]
> In this problem you are to explore using using the dig and host utilities to explore DNS queries. a. Using host, identify the URL and IPv4 addresses of all mail servers associated with uvm.edu. b. Using dig, identify the URL and IPv4 addresses of all the authoritative DNS servers for uvm.edu.

### Solution

#### A. Mail Servers for uvm.edu

> [!Success] Answer
> from `host -t MX uvm.edu`:
>
> uvm.edu has 4 mail servers, all with priority 5: plover.in-mail.uvm.edu(132.198.101.207), sandpiper.in-mail.uvm.edu(132.198.101.208), wigeon.in-mail.uvm.edu(132.198.101.209), shoveler.in-mail.uvm.edu(132.198.100.36)
>
> they all have equal priority thus equal distribution/load balancing.

#### B. Authoritative DNS Servers for uvm.edu

> [!Success] Answer
> form `dig uvm.edu NS +short`:
>
> uvm.edu has 2 authoritative nameservers: ns1.uvm.edu(132.198.201.10), ns2.uvm.edu(132.198.202.10)
>
> main source of truth for DNS records in uvm.edu domain.

## Problem 5 (20 points).

> [!Question]
> Use nc to open a socket to one of the CEMS mails servers, in the manner demonstrated in class and described in the slides and textbook.
>
> Send an email message to our TA Omar Awajan (omar.awajan@uvm.edu) using the SMTP protocol, making sure to identify yourself and the purpose of your message in both the subject header and the body. It's easy for us to tell whether the message was sent using this technique, vs. a mail reader, so it will be easy to evaluate completion of this problem. 1

### Solution

I was having issues with NC on macos, so i just used telnet from brew and that did the job.

> [!Success] Answer
> connected to **plover.in-mail.uvm.edu** via port 25 using telnet.
>
> **My command**:
>
> ```bash
> (
>   echo "HELO uvm.edu"
>   echo "MAIL FROM:<ejpeders@uvm.edu>"
>   echo "RCPT TO:<omar.awajan@uvm.edu>"
>   echo "DATA"
>   echo "Subject: Homework 1 Problem 5"
>   echo "From: Ewan Pedersen <ejpeders@uvm.edu>"
>   echo "To: Omar Awajan <omar.awajan@uvm.edu>"
>   echo "Hi, this is Ewan Pedersen. Email is ejpeders@uvm.edu. This for problem 5."
>   echo "."
>   echo "QUIT"
>   sleep 1
> ) | telnet plover.in-mail.uvm.edu 25
> ```
>
> **Command Output:**
>
> ```bash
> Trying 132.198.101.207...
> Connected to plover.in-mail.uvm.edu.
> Escape character is '^]'.
> 220 ***********************************************************************************
> 250 plover.in-mail.uvm.edu Hello
> 204-13-45-212-dhcp.burlingtontelecom.net [204.13.45.212] (may be forged), pleased to meet you
> 250 2.1.0 <ejpeders@uvm.edu>... Sender ok
> 250 2.1.5 <omar.awajan@uvm.edu>... Recipient ok
> 354 Enter mail, end with "." on a line by itself
> 250 2.0.0 615MOPZr014194 Message accepted for delivery
> 221 2.0.0 plover.in-mail.uvm.edu closing connection
> Connection closed by foreign host.
> ```
