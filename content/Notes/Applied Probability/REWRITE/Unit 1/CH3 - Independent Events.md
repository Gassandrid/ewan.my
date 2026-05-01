---
id: CH3 - Independent Events
aliases: []
tags:
  - math/probability/statistics
date: 2025-01-17
title: CH3 - Independent Events
updated: 2025-06-21
---
This chapter will cover the concept of independent events in probability theory. Understanding independent events is crucial for various statistical analyses and decision-making processes. We will explore the definition of independent events, their properties, and how to calculate probabilities involving independent events.

---

## Independent Events

Say that we have 2 sequential events $A,B$. The outcome of the first event does not effect the likelihood of the second event occurring.

We distinguish independent events with things like **rolling a die once/twice**, or **flipping a coin a certain amount of times.**

No matter what, the outcome of a previous trial of these tests will never effect the future trials.

On the other hand, we have dependent events, like **picking a card after already taking one out**.

> [!Example]
> What is the probability of pulling an ace out of a deck of cards?

> [!Success] Solution
> The probability of pulling an ace out of a deck of cards is $\frac{4}{52} = \frac{1}{13}$.

This makes perfect sense, as there are 4 aces in a deck of 52 cards.

> [!Example]
> Continuing from the previous example, what is the probability of pulling another ace after already pulling one out?

> [!Success] Solution
> Because we already pulled out an ace, there are now 3 aces left in the deck. The probability of pulling another ace is $\frac{3}{51} = \frac{1}{17}$.

---

## General Multiplication Rule

For events $A,B$ which are independent:

$$
P(A \cap B) = P(A) \cdot P(B)
$$

Joint probability is the probability of both events occurring.

> [!Warning]
> Be careful! This rule only applies to independent events.

If you are dealing with dependent events, you will need to use the **Conditional Probability** formula.

---

## Conditional Probability

Conditional probability is the probability of an event occurring given that another event has already occurred.

We can calculate conditional probability using the following formula:

$$
P(A|B) = \frac{P(A \cap B)}{P(B)}
$$
