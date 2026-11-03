---
source:
  - https://x.com/aidan_sirbu/status/2112889537198207289
  - https://aidansirbu.com/SCAMPER-site/
author:
  - Aidan
handle: aidan_sirbu
published: 2026-10-21
created: 2026-10-23
image: https://pbs.twimg.com/amplify_video_thumb/2112889519720534016/img/wEBNj5Y7BPNYryZH.jpg
tags:
  - tweet
date: 2026-10-23T19:37:55-04:00
updated: 2026-10-23T19:38:20-04:00
---

https://aidansirbu.com/SCAMPER-site/

---

## Original Post

>[!quote] 1/14) Virtual animals are a long-standing goal in neuro-AI, but they should actually behave like real animals.
> 1/14) Virtual animals are a long-standing goal in neuro-AI, but they should actually behave like real animals.  
>   
> We present SCAMPER: a virtual rat for RL studies that moves naturally during both exploration, and goal-directed behavior.  
>   
> Project page: [https://aidansirbu.com/SCAMPER-site/](https://t.co/s0J1igsgEv)
>
> ![](https://pbs.twimg.com/amplify_video_thumb/2112889519720534016/img/wEBNj5Y7BPNYryZH.jpg)

## Replies

> [!quote] 2/14) Existing approaches fall short: RL from scratch produces unnatural movements, and existing frameworks exhibit limited task-transfer ability. We build on MIMIC-MJX by using two learned priors: one for task-based control, and one for generating goal-free behavior.

> [!quote] 3/14) SCAMPER trains in 4 stages:
1\. Train an expert imitator using motion capture from real rats.
2\. Distill the expert into a latent skill controller.
3\. Distill a second “behavior prior” from the frozen encoder.
4\. Train task policies that gate between the two priors.
![Image](https://pbs.twimg.com/media/HVJ94WjXAAAd1RI?format=jpg&name=large)

> [!quote] 4/14) The policy network can choose when to explore by sampling the behavior prior, and when to exploit by residually controlling the motion prior which constrains the latents to the manifold of motion learned during imitation.

> [!quote] 5/14) SCAMPER is trained on a motion capture dataset of ~1hr of rats freely-behaving in a small arena. The rats would walk, rear up, and groom themselves. Despite not containing any gaits faster than walking, SCAMPER generalizes and can learn to trot and gallop like real rats.
![Image](https://pbs.twimg.com/media/HVJ941tXYAAvM7f?format=jpg&name=large)

> [!quote] 6/14) SCAMPER also greatly increases the precision and stability of rearing motions. In a task where the agent must rear up to a target and hold that position for a full second, only SCAMPER can achieve enough stability to successfully solve the task.
