---
status: open
priority: normal
scheduled: 2026-01-20T14:50:00
contexts:
  - college
timeEstimate: 75
dateCreated: 2026-01-13T15:07:28.552-05:00
dateModified: 2026-01-16T17:52:57.975-05:00
reminders:
  - id: rem_1768334833457_gbzjl8pqn
    type: relative
    relatedTo: due
    offset: -PT15M
class:
  - course
  - task
recurrence: DTSTART:20260113;FREQ=WEEKLY;BYDAY=TU,TH;UNTIL=20260601
date: 2026-01-13T15:07:28-05:00
updated: 2026-01-13T15:39:31-05:00
tags:
  - university
  - cs/networking
code: CS3650
professor: "[[Christian Skalka]]"
crn:
location:
  - Votey 303
semester: Spring 2026
image:
credits: 3
source:
  - https://brightspace.uvm.edu/d2l/home/149512
related:
author:
description:
complete_instances:
  - 2026-01-13
  - 2026-01-15
skipped_instances: []
---
Introduction to the theoretical and pragmatic principles and practices of computer networking, with an emphasis on the TCP/IP (Internet) protocol stack, and modern techniques and concerns such as security and software defined networking. 

We focus on the Internet, especially the TCP/IP protocol stack, the world-wide-web, Internet standards, and network security.  

## Course Topics:

### Basic Networking Concepts

- Packet vs. circuit switching  
- Protocols and service models  
- Protocol layering concepts  
- Standards and organizations  

### Application Layer

- HTTP  
- FTP  
- DNS  
- Basic socket programming  

### Transport Layer

- Mux and demux  
- TCP and UDP  
- Reliable data transport principles and Go-back-n, selective repeat  
- Congestion control principles and algorithms  

### Network Layer

- Routing and forwarding  
- IP datagram format  
- IP addressing  
- ICMP  
- Decentralized routing algorithms: Link State and Distance Vector  
- Internet ASs and routing  

### Link Layer

- Basic error detection  
- MAC protocols: CSMA  

### Network Security

- Security properties
- Dolev-Yao model  
- Diffie-Hellman protocol  
- Certificate formats  
- TLS  
- Real-world vulnerabilities and countermeasures DDoS, Buffer overflow attacks, Heartbleed, Mirai  

### Advanced Topics: Software Defined Networking

Basic concepts  
Language (OpenFlow) and implementation support  
Network federation and security concerns  
