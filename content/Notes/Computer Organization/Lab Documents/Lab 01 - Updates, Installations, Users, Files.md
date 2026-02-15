---
date: 2024-09-18
created_on: "[[09-18-2024]]"
tags:
  - university
  - cs/embedded
updated: 2025-03-31
class: note
---
> [!abstract] Student Information
> Ewan Pedersen
> CS2210
> 9 • 18 • 2024

I am going to skip labeling the steps that don't require any submission, so the answers will only include terminal screenshots and answers to questions.

---

## 2. If You Successfully Join a Wireless Network, Typing `iwgetid` in the Terminal Should Display the Network name as Follows.

>[!Info] Screenshot
> ![[Screenshot 2024-09-19 at 7.54.45 PM.png]]

**Some Caveats:**
My Pi did not support **md4** hashing due to its age, so I opted to use **Sha256** instead.

c19d40e797a1db3e0daa39fda6df3740bdc9b07b91b1989b16c67bbb699aaa7a

---

## 4. Create a New Folder inside the `Desktop` Folder Inyour home Directory Called `CS2210`

>[!Info] Screenshot
> ![[Private/images/misc_media/Screenshot 2024-09-19 at 7.56.54 PM.png]] 

---

## 5. Hostname of the Pi, Displaying it via the `hostname` Command.

>[!Info] Screenshot
>![[Screenshot 2024-09-19 at 9.04.04 PM.png]]

---

## 6. IP Address of the Pi, Displaying it via the `hostname -I` Command.

>[!Info] Screenshot
> ![[Screenshot 2024-09-19 at 9.04.56 PM.png]]

---

## 7. Output of the Command: `df -T`

>[!Info] Screenshot
> ![[Screenshot 2024-09-19 at 9.06.12 PM.png]]

---

## 8. What is the File System Type Listed for the Root Partition?

From the following screenshot, we can determine that the file system type for the root partition is `ext4`

>[!Info] Screenshot
> ![[Private/images/misc_media/Screenshot 2024-09-19 at 9.07.51 PM.png]]

---

## 9. Confirmation Message that Appears after Expanding the File System to Use the Entire microSD Card

>[!Info] Screenshot
> ![[Screenshot 2024-09-19 at 9.11.09 PM.png]]

---

## 10. Use the `ping` Command to Ping the IP Address of UVM's home Page

>[!Info] Screenshot
> ![[Screenshot 2024-09-19 at 9.14.15 PM.png]]

---

## 11. What Was the Average Packet round Trip Time?

Given the following packet times:

- 1.60 ms
- 16.0 ms
- 47.1 ms
- 4.63 ms

We can use the average formula to find this(duh)

$$
\text{Average} = \frac{x_1 + x_2 + x_3 + \dots + x_n}{n}
$$

$$ \text{Average} = \frac{1.60 + 16.0 + 47.1 + 4.63}{4} = \frac{69.33}{4} = 17.33 \, \text{ms} $$

Therefore, the average was **17.33**ms

---

## 12. Create a Python File Using `nano` Called `hello1.py`. Write a line of Code that Displays "Hello, This is [your name] Using Nano on My Raspberry Pi".

Unfortunately my terminal emulator didn't support **nano** through ssh, so I was forced to use apple terminal! Oh No!

>[!Info] Screenshot
> ![[Screenshot 2024-09-19 at 9.25.23 PM.png]]

---

## 13. Run `hello1.py` from the Command Line.

>[!Info] Screenshot
> ![[Private/images/misc_media/Screenshot 2024-09-19 at 9.27.11 PM.png]]

---

## 14. Create the following New Users and a **take a screenshot** Demonstrating how They Were Created.

There were other ways to achieve this in the documentation, but I always prefer short bash one liners.

- `your_name`, with sudo privileges

>[!Info] Screenshot
> ![[Screenshot 2024-09-19 at 9.30.21 PM.png]]

- `user1`, without sudo privileges

>[!Info] Screenshot
> ![[Screenshot 2024-09-19 at 9.31.55 PM.png]]

---

## 16. Create a Python File Using Vim Called `hello2.py`. Write a line of Code that Displays "Hello, This is [your name] Using Vim on My Raspberry Pi".

Since I already daily drive Vim on my own setup, I went ahead and installed my Vim Dotfile Configuration onto my Pi.

>[!Info] Screenshot
> ![[Screenshot 2024-09-19 at 9.39.20 PM.png]]

---

## 17. Create a Directory Called `lab01` Using the `mkdir` Command, and Use the `mv` Command to Move `hello2.py` into It.

>[!Info] Screenshot
> ![[Screenshot 2024-09-19 at 9.41.07 PM.png]]

---

## 18. Execute `hello2.py` via the Command line

>[!Info] Screenshot
> ![[Private/images/misc_media/Screenshot 2024-09-19 at 9.41.59 PM.png]]

---

## 19. Install Any Recent Updates to Your Raspberry Pi OS Distribution via `sudo apt update` and then `sudo apt upgrade`

>[!Info] 
> Screenshot![[Screenshot 2024-09-19 at 9.43.08 PM.png]]
