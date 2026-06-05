---
date: 2024-10-25
tags:
  - cs/embedded
  - university
updated: 2025-03-31
class: note
---
> [!abstract] Student Information
> Ewan Pedersen
> CS2210
> 10 • 25 • 2024

---

## What Has Been Accomplished

So far, a lot of the software bloat has been completed, where all the tedious stuff has been sorted out. We have developed a script to fine tune the Llama 3.1 Model we will be using, set up the docker environment to make proper use of the Coral TPU, and tested the voice recognition model.

I have also done some fine tuning of the voice synthesis model and begun training it to sound like TARS from interstellar, but a lot of work still needs to be done to perfect it.

---

## What Work Remains

Most, if not all of the hardware and vanity work remains. We are still waiting on the delivery of some of the excess parts, like the ESP32's. We had ordered on AliExpress to save some money, at the cost of month-long deliveries.

We have done some testing with the coral TPU on virtual environments, but we have yet to get it to properly work with a normal version of Llama 3.1. 

On that Subject, Llama 3.2 has just released, bringing some new low Parameter models we can play around with. However, the fine tuning framework is not all as developed as 3.1, so we will have to wait and see which one we end up going with.

---

## Reflection on the Team (what is Working, what Needs Improvement, Member Contributions, etc.)

As a one-man army, I have to say team collaboration has never been better! We all seem to agree on what design choices/decisions to make.

---

## Include Updated time Log

| Date       | Name | Role                | Description                                    | Time(Hrs) |
| ---------- | ---- | ------------------- | ---------------------------------------------- | --------- |
| 10/15/2024 | Ewan | Software Engineer   | Fine tuning neural network program development | 3.5       |
| 10/20/2024 | Ewan | Lead Model Engineer | Working Prototype speech recodnition           | 2         |
| 10/24/2024 | Ewan | Hardware Engineer   | Prototyping with CORAL TPU                     | 3         |

---

## Include Updated Gantt Chart Showing Status of Project Plan

I just ended up making a new Gantt chart for all the stuff I have left to do, including the new Llama 3.2 experimentation.

![[Screenshot 2024-10-25 at 11.09.30 PM.png]]

---

## Include Pictures of Project

I don't have much hardware set up, but here's the coral TPU( one of them ) properly up with the pi. There are two options for TPU which I have, and I am experimenting with both of them.

![[Screenshot 2024-10-25 at 10.04.34 PM.png]]

---

## Are You on Track? Challenges?

We are a little behind on the hardware department, but that is purely because of orders, and we are not worried about getting the physical project complete when the parts do eventually arrive.