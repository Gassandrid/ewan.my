---
date: 2024-09-18
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
> [![Screenshot 2024-09-19 at 7.54.45 PM.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/bbb4b08ae383c96d721acb1cde5a75579874cc9ee293b5874e49597b4db2e538/Screenshot%202024-09-19%20at%207.54.45%20PM.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/bbb4b08ae383c96d721acb1cde5a75579874cc9ee293b5874e49597b4db2e538/Screenshot%202024-09-19%20at%207.54.45%20PM.png)

**Some Caveats:**
My Pi did not support **md4** [[hashing]] due to its age, so I opted to use **Sha256** instead.

c19d40e797a1db3e0daa39fda6df3740bdc9b07b91b1989b16c67bbb699aaa7a

---

## 4. Create a New Folder inside the `Desktop` Folder Inyour home Directory Called `CS2210`

>[!Info] Screenshot
> ![[Private/images/misc_media/Screenshot 2024-09-19 at 7.56.54 PM.png]] 

---

## 5. Hostname of the Pi, Displaying it via the `hostname` Command.

>[!Info] Screenshot
>[![Screenshot 2024-09-19 at 9.04.04 PM.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/8346ffad40bc529eff4ebb1cd0a75845cfad39e9891685758872db2f5256786e/Screenshot%202024-09-19%20at%209.04.04%20PM.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/8346ffad40bc529eff4ebb1cd0a75845cfad39e9891685758872db2f5256786e/Screenshot%202024-09-19%20at%209.04.04%20PM.png)

---

## 6. IP Address of the Pi, Displaying it via the `hostname -I` Command.

>[!Info] Screenshot
> [![Screenshot 2024-09-19 at 9.04.56 PM.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/5beee41a64bfc4147d30fc51d2faf25423d19f69db1e7a30e472269937a7996b/Screenshot%202024-09-19%20at%209.04.56%20PM.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/5beee41a64bfc4147d30fc51d2faf25423d19f69db1e7a30e472269937a7996b/Screenshot%202024-09-19%20at%209.04.56%20PM.png)

---

## 7. Output of the Command: `df -T`

>[!Info] Screenshot
> [![Screenshot 2024-09-19 at 9.06.12 PM.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/35345e7d568afc3bac4a953bea504f573d9be0d2d2c773e106bfba5a9ee9ec4a/Screenshot%202024-09-19%20at%209.06.12%20PM.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/35345e7d568afc3bac4a953bea504f573d9be0d2d2c773e106bfba5a9ee9ec4a/Screenshot%202024-09-19%20at%209.06.12%20PM.png)

---

## 8. What is the File System Type Listed for the Root Partition?

From the following screenshot, we can determine that the file system type for the root partition is `ext4`

>[!Info] Screenshot
> ![[Private/images/misc_media/Screenshot 2024-09-19 at 9.07.51 PM.png]]

---

## 9. Confirmation Message that Appears after Expanding the File System to Use the Entire microSD Card

>[!Info] Screenshot
> [![Screenshot 2024-09-19 at 9.11.09 PM.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/205786053c422dde3adae570b52d999ee3057d13da6b1b2b6fd377e4a002c418/Screenshot%202024-09-19%20at%209.11.09%20PM.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/205786053c422dde3adae570b52d999ee3057d13da6b1b2b6fd377e4a002c418/Screenshot%202024-09-19%20at%209.11.09%20PM.png)

---

## 10. Use the `ping` Command to Ping the IP Address of UVM's home Page

>[!Info] Screenshot
> [![Screenshot 2024-09-19 at 9.14.15 PM.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/2a22ba5bfdf4361f6555ea299150db5658a27f2a512c45aeb1cf6533b6316b8b/Screenshot%202024-09-19%20at%209.14.15%20PM.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/2a22ba5bfdf4361f6555ea299150db5658a27f2a512c45aeb1cf6533b6316b8b/Screenshot%202024-09-19%20at%209.14.15%20PM.png)

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
> [![Screenshot 2024-09-19 at 9.25.23 PM.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/9d49a036e79cec5fb972ce03ec9ca8b5188515ecdd2866455d60ac315944c682/Screenshot%202024-09-19%20at%209.25.23%20PM.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/9d49a036e79cec5fb972ce03ec9ca8b5188515ecdd2866455d60ac315944c682/Screenshot%202024-09-19%20at%209.25.23%20PM.png)

---

## 13. Run `hello1.py` from the Command Line.

>[!Info] Screenshot
> ![[Private/images/misc_media/Screenshot 2024-09-19 at 9.27.11 PM.png]]

---

## 14. Create the following New Users and a **take a screenshot** Demonstrating how They Were Created.

There were other ways to achieve this in the documentation, but I always prefer short bash one liners.

- `your_name`, with sudo privileges

>[!Info] Screenshot
> [![Screenshot 2024-09-19 at 9.30.21 PM.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/4bf0ebff70550f03146d0146cc7f3c9338824bcc3a4ddd6fda8df986ee38f231/Screenshot%202024-09-19%20at%209.30.21%20PM.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/4bf0ebff70550f03146d0146cc7f3c9338824bcc3a4ddd6fda8df986ee38f231/Screenshot%202024-09-19%20at%209.30.21%20PM.png)

- `user1`, without sudo privileges

>[!Info] Screenshot
> [![Screenshot 2024-09-19 at 9.31.55 PM.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/256670c8be346547b075131a2fb0aa8d68bfbec5ea20ce09a6c9038837c087b2/Screenshot%202024-09-19%20at%209.31.55%20PM.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/256670c8be346547b075131a2fb0aa8d68bfbec5ea20ce09a6c9038837c087b2/Screenshot%202024-09-19%20at%209.31.55%20PM.png)

---

## 16. Create a Python File Using Vim Called `hello2.py`. Write a line of Code that Displays "Hello, This is [your name] Using Vim on My Raspberry Pi".

Since I already daily drive Vim on my own setup, I went ahead and installed my Vim Dotfile Configuration onto my Pi.

>[!Info] Screenshot
> [![Screenshot 2024-09-19 at 9.39.20 PM.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/407d49c3913ac22301d59406f046910fccd4651fe24e6c611e05e6dbf5f5fcf5/Screenshot%202024-09-19%20at%209.39.20%20PM.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/407d49c3913ac22301d59406f046910fccd4651fe24e6c611e05e6dbf5f5fcf5/Screenshot%202024-09-19%20at%209.39.20%20PM.png)

---

## 17. Create a Directory Called `lab01` Using the `mkdir` Command, and Use the `mv` Command to Move `hello2.py` into It.

>[!Info] Screenshot
> [![Screenshot 2024-09-19 at 9.41.07 PM.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/6b6575ea35f226ee268878bb12fcc7dc2e8b2fa70ba52cbb1d1250e1a03e21ff/Screenshot%202024-09-19%20at%209.41.07%20PM.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/6b6575ea35f226ee268878bb12fcc7dc2e8b2fa70ba52cbb1d1250e1a03e21ff/Screenshot%202024-09-19%20at%209.41.07%20PM.png)

---

## 18. Execute `hello2.py` via the Command line

>[!Info] Screenshot
> ![[Private/images/misc_media/Screenshot 2024-09-19 at 9.41.59 PM.png]]

---

## 19. Install Any Recent Updates to Your Raspberry Pi OS Distribution via `sudo apt update` and then `sudo apt upgrade`

>[!Info] 
> Screenshot[![Screenshot 2024-09-19 at 9.43.08 PM.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/315619d367865cd173dae5631cafbb37d8c215c38264d1ed659325ac67ead757/Screenshot%202024-09-19%20at%209.43.08%20PM.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/315619d367865cd173dae5631cafbb37d8c215c38264d1ed659325ac67ead757/Screenshot%202024-09-19%20at%209.43.08%20PM.png)
