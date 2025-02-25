---
title: Social Network Visualizations
date: 2025-02-24
updated: 2025-02-24
tags:
  - python
  - projects
  - todo
---
*[repo](https://github.com/Gassandrid/DiscordSocialNetwork) for the project*

I have had a lot of fun working with obsidian and its fancy *graph view*, and how it helps to reveal the relationships between my notes and my thoughts.

However, I wanted to try and apply this view to some of the social networks that I use from day to day, perhaps as a tool to visualize my relationships with others.

A friend on discord showed me how he was using Obsidian as a way to catalog his friendships and use it for data science, and this inspired me to try and automate this by scraping services like Discord and Instagram for local friendship connections.

![[Pasted image 20250224200555.png]]

*what a social network graph could look like*

---

## Scraping Discord

I decided to start with discord as it would be a bit more of a challenge to scrape. Instagram already has an API for getting this information, but the main problem is the connections would pile up really quickly, and I would probably hit my rate limit near instantly again, which would suspend my account.

So for this, I decided to have some fun and work with a web scraping library called [Selenium](https://www.selenium.dev/) for python. It not only very capable like other web scraping libraries, but actually fully simulates the browser on your computer. This means while the browser is fully automatable, anti bot mechanisms are not as easily triggered as it appears like a genuine web client on your computer.

