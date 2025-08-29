---
id: Final Project Report
aliases:
tags:
  - cs/embedded
date: 2024-12-04
updated: 2025-03-31
class: note
---
<body style="margin: 0; font-family: 'Helvetica', sans-serif; background: linear-gradient(to bottom right, #4e54c8, #8f94fb); display: flex; justify-content: center; align-items: center; height: 100vh; color: white;">
    <div style="text-align: center; background: rgba(114, 135, 253, 0.6); padding: 50px; border-radius: 15px; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);">
        <h1 style="font-size: 50px; margin-bottom: 10px;">DARS</h1>
        <h2 style="font-size: 30px; margin-bottom: 20px;">CS2210 Final Project</h2>
        <h3 style="font-size: 24px; margin-bottom: 20px;">Date: 9/27/2024</h3>
        <p style="font-size: 20px; margin-bottom: 10px;">Team: CASE</p>
        <p style="font-size: 20px;">Ewan Pedersen - Project Lead</p>
    </div>
</body>

![[IMG_2329.jpeg|400]]

---

‎‎‎‎‎

## Table Of Contents

I have cut out the stuff that has nothing to change from the original proposal.

- [[Final Project Proposal and Pitch#Introduction|Introduction]]

- [[Final Project Proposal and Pitch#Project Detail|Project Detail]]

  - [[Final Project Proposal and Pitch#Full System Diagram|Full System Diagram]]
  - [[Final Project Proposal and Pitch#External Components|External Components]]
  - [[Final Project Proposal and Pitch#Chassis Design|Chassis Design]]
  - [[Final Project Proposal and Pitch#Software Design Choices|Software Design Choices]]

- [[Final Project Proposal and Pitch#Budget|Budget]]

- [[Final Project Proposal and Pitch#Project Plan|Project Plan]]

- [[Final Project Proposal and Pitch#References|References]]

---

## Introduction

DARS is a advanced dormitory management system that, thanks to the power of transformer based language models, will be able to interpret human natural language and route that to a proper room management action. On the surface, DARS will resemble the appearance of TARS from interstellar, and will share many traits of his personality. However, unlike other similar projects, DARS will be able to understand and interpret natural language, and will be able to perform complex actions such as room assignments, room management, and more.

By meeting these claims, DARS will not only be able to serve as an entertaining personality thanks to his open source model architecture, but also to serve as a powerfull interface for home automation. But the language model is not the only thing that will make DARS what he is.

DARS will also be running 2 other neural models locally, one for speech recodnition, and one for speech synthesis. This will be so that DARS will be able to understand the speaker without issue, but also mimic the well known voice of TARS.

In addition, DARS will present a simple and expansable interface so that devices can easily be added to the "network" of control. Wireless microcontrollers will be used to control devices, and the language model will be able to interface with them to control them.

---

## Project Detail

This project will involve undertaking the difficult task of training large language models. This is going to be difficult as, even in the smallest of these models, such as the 8B parameter model, the model will be too large to fit on the raspberry pi 5. This will require us to train the model on a more powerful machine, and then convert the model to a smaller size that will fit on the raspberry pi 5.

For this, we are planning to rent an Nvidia A100 for a few days to train the model. This will be expensive, but it is necessary for the project to be a success.

### Updated Full System Diagram Reflection

Unlike the chassis, I actually stuck fairly close to the origional design. The only things I really changed is I expanded the DARS computer hardware so it could act as a full web server, and not just a one time, hyper specific project. With the upgrades, I can interface the DARS functionality with my computer science workflow, and have it be usefull beyond managing physical appliances through the ESP-32 network.

![[Screenshot 2024-12-06 at 11.42.37 AM.png]]

This diagram shows the flow of data through the system, and how the various components interact with each other. The system will be able to take in audio input, convert that to text, run the text through the language model, and then generate a JSON output. This JSON output will then be processed by the Langroid stack, which will determine what function calls need to be made. The system will then be able to control devices such as lights, and output audio to the user.

While this diagram is quite complex, it is necessary for the system to function as intended, as we want to create this project using minimal online SAAS services for the models, and instead run them locally.

### External Components Reflection

**ESP32**: One important decision was the choice of ESP32 for the GPIO interface. We wanted a wireless solution for dormitories, and ESP32's are a great option for a variety of reasons. They are cheap, have a low power consumption, and can be programmed using the Arduino IDE. This makes them a great choice for this project. And consider that their main use will be to control lights and other devices, their low power consumption is a great advantage.

**Coral Neural TPU**: The Coral Neural TPU is another important component of this project. We knew that there was no way that the raspberry pi 5 would be able to run the language model on its own without using online services, so we needed a way to run the model locally. The Coral Neural TPU is a great option for this, as it is specifically designed to run large language models. This will allow us to run the language model locally, without needing to rely on cloud services.

### Chassis Design Reflection

By far, our chassis was the thing that was most different from what we had planned. We were going to make our chassis out of some kind of metal, possibly have it be a bit more decorated, and have some buttons at the top. And while the buttons at the top were eventually added ( along with a camera, after my presentation! ), most of the features never made it to the final, and I ended up just going with a wooden laser cut frame.

**Why did this happen?**

I consider myself to be pretty adept with most things computer - related, whether that be hardware or software. But too late, I realized that did not apply to a proper chassis construction, and I had no idea where to start with in regards to metal work.

Thankfully, this had no affect on the performance/functionality of the project, and I did notice that almost everyone else presenting also used wooden, laser cut frames.

---

## Projected VS Actual - Time and Cost

## Costs

We predicted the following budget for the total net cost of the project:

| Item               | Cost | Quantity | Total |
| ------------------ | ---- | -------- | ----- |
| Nvidia A100 Rental | $200 | 1        | $200  |
| Raspberry Pi 5     | $100 | 1        | $100  |
| Coral Neural TPU   | $150 | 1        | $150  |
| ESP32              | $5   | 5        | $25   |
| Chasis materials   | $30  | 1        | $30   |
| Microphone         | $10  | 1        | $10   |
| Speaker            | $10  | 1        | $10   |
| Small Screen       | $20  | 1        | $20   |
| Misc Pi Components | $20  | 1        | $20   |

However, what we actually spent looked like the following:

| Item               | Cost | Quantity | Total             |
| ------------------ | ---- | -------- | ----------------- |
| Nvidia A100 Rental | $60  | 1        | $60               |
| Raspberry Pi 5     | $100 | 1        | $100              |
| Coral Neural TPU   | $80  | 1        | $80               |
| ESP32              | $6   | 5        | $45 ( with taxes) |
| Chasis materials   | ~ $5 | 1        | $5                |
| Microphone         | $10  | 1        | $10               |
| Speaker            | $10  | 1        | $10               |
| Small Screen       | $30  | 1        | $30               |
| Solid State Drive  | $150 | 1        | $150              |
| API Costs          | $20  | 1        | $20               |

While we thought that the A100 rental was going to be the most expensive, we found a very clever training trick that allowed us to do roughly ~60% training thanks to some very smart discoveries by the _Unsloth_ github group

We ended up going with the cheaper version of the coral TPU, as the models best fit for using it were not big enough to justify 150 dollars of my own money on it! The 80$ ended up working just fine, and being a lot easier to work with regarding TensorFlow Lite.

The Pi 5 upgrade was a much needed expense, as it allowed us to run Ollama 3.1 8B locally without much issue ( although still quite slow! )

## Time

The funny thing about our time management is the things we expected the least amount of time was needed for ended up being quite difficult to the end of our project. We never really spent enough time prototyping a proper Chassis, as our tea

---

## Project Plan

Our timescale is designed to give us enough time to figure out the software challenges in the beginning, as that is by far the most difficult undertaking of this project.

Once we have the hardware side of things complete, there is not much else to improve there besides vanity design choices. But the models behind the project will never be completely perfect, and thus, will always be able to be improved.

**Revised Gantt Chart**
![[Screenshot 2024-12-06 at 11.39.00 AM.png]]

This revised Gantt chart includes how I did delay the chassis to the end, but also used the time to make some pretty noticeabe upgrades to the LLM backend for function calling.

### Fallback Plan

The fallback plan didn't end up being necessary, but we did use some API's anyway for some of the backend functionality, as I wanted to expand the functionality of the system to the internet of things.

---

## Target Market

While this project itself is mainly geared towards people like me, who enjoy these sorts of techie devices, the market that this kind of technology is aimed at has a huge potential. The ability for Modern Transformers to be able to understand and replicate natural language gives them a huge advantage in the automated home industry.

Up until this point, voice assistants have been... well... pretty much useless. Yes, you could ask it to play a song or send a text, but anything more complicated or uniquely phrased, they had no idea how to handle.

This project paves the way for a real home assistant that can bridge the gap between human language and the devices in our living areas that we want to control. Translating from natural language to a discrete output is an untapped market with a huge potential to create the virtual assistants we all dreamed of. And with the open source nature of the project, it is easy to see how this could be implemented in a wide variety of devices.

By building a system that successfully links human natural language to home control, we hope that process can be replicated to other factors of life, where human language is the most efficient way to interface with a system. Cases where advanced machines exists, but are not able to be controlled by a human, are where this technology will shine, as it can make any system more user friendly.

We hope to bring the dream of virtual assistants from movies like Iron Man and Interstellar to reality, and make them accessible to everyone in a way that we all hoped that Siri and Alexa would be.

---

## Final Reflection

Overall, I think this project was quite a success, so much so that I genuinely want to continue development outside of this class, as part of my upcoming homelab project. I think the biggest thing I learned was that the most important part of a project like this is the software, and that the hardware is almost secondary to the software. I think that the hardware is important, but the software is what makes the project, and that is where the most time should be spent.
