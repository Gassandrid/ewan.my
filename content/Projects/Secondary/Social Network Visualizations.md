---
title: Social Network Visualizations
date: 2025-02-24
updated: 2025-02-25
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

---

I was able to cobble together a simple selenium python script which accomplished this. Essentially, the process looked something like:

- open discord website
- log in
- go to all tab for friends
- for each friend, right click and select profile
- click mutual friends and save results
- click mutual servers and save results
- escape, on to next friend

This would all get compiled and saved to a json file. While this might look like it is mostly complete, there are a few things I want to be able to do.

I want this program to run universally on other people's computers, so that we can concatonate each others' results.

For **this**, we will need to use *Docker* and write a program to merge the json documents together.

And eventually, because I like the way the visualize it, we will need a markdown compiler that can convert these relationships to markdown notes for obsidian.

---

## Json to Obsidian Markdown Notes

Now that I had a JSON file of my friends and their mutuals, I wanted a way to visualize this without hassle.

Now, I could just use Matplotlib or some other simple library to generate the graph, but no, I don't like the easy and obvious way. 

We are going to generate markdown files, and open the graph in obsidian instead.

---

What this ended up doing is:

- reading the users name and creating a markdown file for them
- adding some front matter to the file, with a tags element containing the servers they are in
- adding a header to the file titled Relationships
- under the header create a Obsidian link `[[filename]]` for each of the mutual friends.

and Tada! We have a graph now!

![[preview_graph.png]]