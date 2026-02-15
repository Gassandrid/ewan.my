---
date: 2024-09-12
created_on: "[[09-12-2024]]"
updated: 2026-01-22T19:30:42-05:00
tags:
  - generated
  - cs/ai/llm/inference
class:
  - note
source:
related:
author:
description:
aliases:
---
Function calling in language models refers to the ability of a model to not only generate text but also interact with external functions or APIs. This capability allows the model to perform specific tasks like retrieving data, performing calculations, or interacting with other systems, enhancing its utility beyond just text generation.

It is kind of Warhammer-esque in that it is basically "talking to the machine spirit" of the [[Large Language Model]], and asking it nicely to "please return json like this and we will give you the information you need and you can do this"

Looks something like this in most frameworks:

```python
from langroid.agent import Agent

def weather_function(location):
	return f"The weather in {location} is cloudy."

agent = Agent()
agent.add_function("get_weather", weather_function)

response = agent.query("Get the weather in London")
print(response)
```

## Agents

This was the precursor to tools like [[Claude Code]] and related programs, that put the [[Large Language Model]] as the "action agent". It turns out, making the LLM interact and debug code like a software engineer seems to improve its performance! Who would have guessed!
