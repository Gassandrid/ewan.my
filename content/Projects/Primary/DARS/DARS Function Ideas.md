---
tags:
  - projects/dars
date: 2024-11-25
updated: 2025-06-20
---
 

Since DARS is a raspberry pi and ESP 32 project, a lot of the commands are going to be focused on room control devices and features. However, I think it would be nice to implement some software features in addition.

## Hardware Functions

These will be functions that are routed from the Pi to the master ESP-32, which is then routed to a slave ESP 32, like for controlling the RGB lights

---

## Software Functions

These will mostly be API-based, and offer utility similar to that of modern home assitants.

### Mock Database / Entry Logs

Using the onboard hardrive, I think a cool feature would be for the user to ask DARS to make a data log of some kind, where they are asked to name it, and then can provide content for which the language model can decide how to populate it. This entry can then be called at any time, where the name of the log ( and also the date ) can be called to find the information. 

This goes beyond just a journal, as the user could ask DARS to populate the log with a list of event ideas which the LLM would be left to come up with.

### Simple Todo-List

This could possibly be combined with the log function, but a todo list that can be called by just asking the model something like " what tasks do I have to do "
