---
class:
  - note
tags:
source:
  - https://huggingface.co/blog/karina-zadorozhny/guide-to-llm-post-training-algorithms
  - https://jzhao.xyz/thoughts/reinforcement-learning
related:
author:
description:
aliases:
  - RL
date: 2026-09-11T19:36:11-04:00
updated: 2026-10-01T14:57:31-04:00
---

> [[Machine Learning]] technique where comptuer programs ( often [[Neural Networks]] now through [[Policy Gradient Methods]], see [[Proximal Policy Optimzation]] and other [[Large Language Model|LLM]] based advancements ) learns to make choices through trial and error to reach some reward function.

We all know what RL is, this is just going to serve as a high level note on the theory behind it regarding [[Markov Decision Process]]

---

## Main [[Markov Decision Process]] Loop

![[Screenshot 2026-09-11 at 7.42.25 PM.png]]

- **Agent**
	- represent that which learns and takes **actions** at each moment in time $T$
- **Action**
	- $A_{t}$ is received by **environtment** to produced **reward** and **state** for that moment in time
- **Environtment**
	- produces reward $R_{t+1}$ and a state $S_{t+1}$ at the next moment in time
- this is passed back to agent for next action to be decided

Time is discrete:

$$
t \in \{ 0,1,2,\dots \}
$$

then we have uppercase random variables $S,A,R$ for state action and reward, with lowercase values for the values they take $s,a,r$.

they are sets:

$$
s \in \underbrace{ S }_{ \text{set can be anything here} }
$$

the set $a$ belongs to dictates that the set of actions that $a$ can take depends on the current state that the agent is in.

$$
a \in \underbrace{ \mathcal{A}(s) }_{ \text{depends on current state} }
$$

and:

$$
r \in \mathcal{R} \in \mathbb{R}
$$

Dynamics of agent env interaction specified by distribution function:

$$
\underbrace{ p(s',r \mid s, a) }_{ \text{shorthand} } = Prob(S_{t+1}=s', R_{t+1}=r \mid S_{t}=s, A_{t}=a)
$$

this has the markov property, depends only on current state.

This defines the **Finite [[Markov Decision Process]]**, main objective of RL

### Defining Behavior

We now have the **policy**, giving us the probability the agent will take a particurlar action when in a given state, likely a discrete probability distribution (could be continuous)

$$
\pi(a \mid s)
$$

if it is deterministic then its just:

$$
a = \pi(s)
$$

the goal of a policy is to accumulate a lot of a reward, which we call the **return**:

$$
G_{t} = \overbrace{ \sum_{k=t+1}^T }^{ \text{this may sometimes be infinity} } \gamma^{k-t-1}R_{k}
$$

just a sum of future reward, but because we want to favor sooner behavior rather than later, we add a discounting parameter $\gamma$, looks odd but just know that gamma when expanded means that rewards further away will have less weight:

$$
R_{t+1} + \gamma R_{t+2} + \gamma^2 R_{t+3} + \dots
$$

we use $T$ because this assume that the loop will reach a **terminal state**, which for cases like this we refer to the set of states as $\cal{S^+}$

in this case, we can now define the **goal** as the policy that will maximize the expected **return**.

$$
{max}_{\pi} \mathbb{E} [ G_{t}]
$$

---

>[!Example] 
> - Lets list out the different possible states $s$ as shades of red.
> - in each **state**, an agent can take one of two **actions** $a$: up or down
> 	- this lays out the conditional part $p(s',r \mid \underbrace{ s, a }_{  })$
> 
> for each combination of state and action, we will have a distribution over the next state and reward
>
> - lets say possible rewards $r$ are $\{ -1,0,1 \}$, and obviously the possible next states $s'$ are the possible shades of red
> 
> we can picture these distributions as heatmaps:
> 
> ![[Screenshot 2026-09-11 at 8.05.25 PM.png]]

**State Value Function**

$$
v_{\pi}(s) = \underbrace{ \mathbb{E}_{\pi} [ G_{t} \mid S_{t} = s] }_{\begin{array}
j \text{very similar to goal fuction}  \\
max_{\pi} \mathbb{E}_{\pi} [ G_{t}]
\end{array}}
$$

**Action Value Function**

Defined similar, but also condition on the action

$$
q_{\pi} (s,a) = \mathbb{E}_{\pi} [ G_{t} \mid S_{t} = s, A_{t} = a]
$$

>[!Warning]
> knowing these two functions in practice will typically be impossible! we will have to settle for *estimates*

what makes these useful? goal is to find the **optimal policy** $\pi_{*}$, which it turns out can be defined by their value functions:

$$
v_{\pi_{*}}(s) \geq v_{\pi}(s) \quad \text{for all s and for any } \pi
$$

it is guarenteed there is always at least one optimal policy. same holds for value functions as well.

$$
q_{\pi_{*}}(s,a) \geq q_{\pi}(s,a) \quad \text{for all s,a and for any } \pi
$$

## Assumptions

- the agent observes $S_{t}$
- $S_{t}$ has the **Markov Property**

We *sometimes assume*

- **Tabular**: all states and actions can be listed
- **Complete knowledge** we have complete access to the envrionment's dynamics
	- e.g. we have access to $p(s', r \mid s, a)$

---

## Policy Implementations

Big jump from prior guided learning writing, this part serves as an index of SOTA RL for mostly [[Large Language Model]] stuff.

### [[Direct Policy Optimizatoin]]

- skips RL loop, instead deriving a closed form loss over preference pairs with the same optimum as [[Kullback-Leibler Divergence|KL]] constrained [[Reinforcement Learning with Human Feedback|RLHF]] obj, thus you train directly on (chosen, rejected ) wtihout any sampling
	- quite cheap and stable, however off policy against a fixed dataset, thus thus can only reweight behavior that already appears within data.

### [[Proximal Policy Optimzation]]

- clip [[Importance Sampling|importance]] ratio $\pi _\theta / \pi_{\theta_{old}}$ to $\left[ 1-\epsilon,1+\epsilon \right]$, so a single large advantage cant blow up the policy in a single update
- however needs a seperate value network, the Critic, to estimate $V(s)$, so roughly **twice** the parameters in memory during training
- default for [[Reinforcement Learning with Human Feedback]] for several years even InstructGPT, lot of surface to tune however: value head, [[Generalized Advantage Estimate|GAE]], cilp range, [[Kullback-Leibler Divergence|KL]] coefficient

### [[Group Relative Policy Optimization]]

- we drop the critic entirely and instead take samples of group $G$ completions for same prompt and use groups own reward stats as the baseline, $A_{i}=\frac{r_{i}-mean(r)}{std(r)}$
	- much cheaper for this reason, and a great fit for [[Reinforcement Learning with Verifiable Rewards|RLVR]] since the only thing you need per completion is a scalar reward value.
	- has some failiure modes regarding length bias along with the std [[Normalization]] inflating advantage on groups where every sample scored about the same.
- created by deepseek and how deepseek r1 was trained.

## Rewards

### [[Reinforcement Learning with Human Feedback|RLHF]]

- takes reward from a preference trained model, prefernce model is usually around the same size as the model being trained. Can be applied to anything however there is a tendancy for reward hacking as the reward model is only al earned approximation

### [[Reinforcement Learning with Verifiable Rewards|RLVR]]

- takes reward from a checker, a lot more narrow in what it can be applied to ( popularity came from training [[Large Language Model|LLM]]s for math and coding ), but the signal is rock solid and wont degrade unlike a reward model approximation.
