---
date: 2024-10-09
tags:
  - cs/embedded
  - university
updated: 2025-03-31
class:
  - note
---
> [!abstract] Student Information
> Ewan Pedersen
> CS2210
> 10 • 09 • 2024

---

## 6. Add a Yellow LED that is ON while the Red LED is OFF (alternating LEDs). **Take a picture** of Your Completed Circuit on the Breadboard, Connected to Your Pi.

>[!Info] Screenshot
> [![Screenshot 2024-10-10 at 7.17.05 PM.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/92a2852902575ec66d2df50cfed7525aafb2fdbb21ac1f0247e8217aa05bad62/Screenshot%202024-10-10%20at%207.17.05%20PM.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/92a2852902575ec66d2df50cfed7525aafb2fdbb21ac1f0247e8217aa05bad62/Screenshot%202024-10-10%20at%207.17.05%20PM.png)

---

## 7. What is the Current in Milliamps?

**Ohm's Law:**

   $$
   I = \frac{V_{supply} - V_{forward, red}}{R}
   Substituting the values:
   $$

**Red LED**:
   - $V_{supply} = 3.3V$
   - $V_{forward, red} = 2.0V$
   - $R = 220 ohms$

Plugging in values:

   $$
   I_{red} = \frac{3.3V - 2.0V}{220 \, \Omega} = \frac{1.3V}{220 \, \Omega} = 0.00591 \, \text{A} = 5.91 \, \text{mA}
   $$

**Yellow LED**:
   - $V_{supply} = 3.3V$
   - $V_{forward, yellow} = 2.1V$
   - $R = 220 ohms$

Plugging in values:

$$
   I_{yellow} = \frac{3.3V - 2.1V}{220 \, \Omega} = \frac{1.2V}{220 \, \Omega} = 0.00545 \, \text{A} = 5.45 \, \text{mA}
$$

**Results:**

$RED = 5.91 mA$

$YELLOW = 5.45 mA$

---

## 8. Use [https://www.lucidchart.com](https://www.lucidchart.com/) (free account with a .edu Email address), or [https://www.draw.io](https://www.draw.io/) to Create a Circuit Diagram of Your Final Circuit (with both LEDs). **Take a screenshot** of Your Diagram.

You can't see it from the screenshot, but the glow follows your cursor as you hover over the card.

>[!Info] Screenshot
> [![Screenshot 2024-10-10 at 7.29.55 PM.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/1222d35f71531875ad1a48c2297543caf3adaa0a68b757865b937812177dedb2/Screenshot%202024-10-10%20at%207.29.55%20PM.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/1222d35f71531875ad1a48c2297543caf3adaa0a68b757865b937812177dedb2/Screenshot%202024-10-10%20at%207.29.55%20PM.png)

---

## Completed Code from Steps 5 and 6

Since I am on a Raspberry Pi 5 and not 4, the code had to be changed a bit during troubleshooting, so might be a bit unconventional.

**Step 5:**

>[!Info] Screenshot
> [![Screenshot 2024-10-10 at 6.50.23 PM.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/4663530566fb4010de3b287a58d4ce8af0c1881ac44b134d16c01833d30b2c8d/Screenshot%202024-10-10%20at%206.50.23%20PM.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/4663530566fb4010de3b287a58d4ce8af0c1881ac44b134d16c01833d30b2c8d/Screenshot%202024-10-10%20at%206.50.23%20PM.png)

**Step 6:**

>[!Info] Screenshot
> [![Screenshot 2024-10-10 at 7.18.04 PM.png](https://lab.ewan.my/api/lab/v1/loupe/v1/o/0fad6f757ee7fd2297fafc9570a94c122c31ed35e30cb6bb8d0d7e1dda52d210/Screenshot%202024-10-10%20at%207.18.04%20PM.png?size=s1024)](https://lab.ewan.my/api/lab/v1/loupe/v1/o/0fad6f757ee7fd2297fafc9570a94c122c31ed35e30cb6bb8d0d7e1dda52d210/Screenshot%202024-10-10%20at%207.18.04%20PM.png)