---
date: 2025-04-29
updated: 2025-04-29
tags:
  - math/linear-algebra
fileClass: transcript
---

*for a [Normalized Nerd](https://youtu.be/i3AkTO9HLXo?si=0HlExQr2nVNWsNEG) video*

 Markhov chains are used for everything - statistics, biology, and machine learning of course. They allow for some very interesting probability theory.

Let's start with an example.

 ---

 Imagine there is a restaurant that serves 3 different kinds of foods: **burger**, **pizza**, and **hotdog**. However, they have a weird rule where they only serve one of these 3 items on any given day. And, it depends what they served yesterday.

 Essentially, if you know the probabilities and what they served today, you could predict what they will serve tomorrow.

Let's say we are given a graph with all 3 foods, with arrows pointing to other foods with a number between 0 and 1 for their probability.

If we are on **pizza** today, we can predict that there is a $70\%$ chance of having **hotdogs** tomorrow.

 

![[Screenshot 2025-04-29 at 1.29.21 PM.png]]

While quite a simple diagram, this is actually a complete Markov chain!

In more formal math notation, we can represent the probability of a certain food choice on a given day considering **only** what was had yesterday:

$$
P(X_{n+1} = x | X_{1}=x_{1}, X_{2}=x_{2},\dots,X_{n}=x_{n})
$$

This is the **essential** property of Markov chains: you **only** need the previous state to figure out the next, and not the whole history/probability distribution.

> [!Example] 
> For finding the probability of getting **Hotdog** given that the previous day had **Pizza**(on the $4_{th}$ day):
>
> $$
> P(X_{4} = HOTDOG | X_{3} = PIZZA) = 0.7
> $$

This is known as the **Markov Property**.

The other important property is that sum of the weights of the outgoing arrows from any state is equal to 1. This makes sense, as 1 represents the total probability of an action, and if all options dont add up to it, something is wrong.

*However, there are special Markov Chains with unique properties that break this rule, we will discuss later.*

---

## Exploring the probability Distribution

To get a feel for what you might see over a long time period of this chain, lets *walk* the chain and see what we get:

![[Screenshot 2025-04-29 at 1.40.45 PM.png]]

After 10 steps, we are left with this. But how can we find