---
date: 2024-09-12
updated: 2026-10-30T11:36:52-04:00
tags:
  - cs/ai/llm/inference
class:
  - note
source:
related:
author:
description:
aliases:
---

## [[10-30-2026]] Looking back

A big part of what makes [[Passive Obsidian Worktime]] so effective is naturally stumbling across old notes like this. I made this note when I was trying to make what eventually became agent harnesses for silly little projects. I could delete this notes and throw it away given how out of date and how much of a layman I was back then but instead it is nice to include a [[Note updates as links to daily notes]] here to show the accumulation of knowledge and returning to old notes as part of the process.

Nobody really goes about implementing function calling by hand anymore, and it really isnt a concept deserving of a note - all you are doing is parsing output for syntax. Could say the same about MCP tbh, hyped up acronyms that are really basic concepts.

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
