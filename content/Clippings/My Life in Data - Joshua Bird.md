---
title: My Life in Data
source: https://joshuabird.com/blog/post/my-life-in-data
author:
  - Joshua Bird
published: 
created: 2025-04-07
description: Visualising my sleep, Spotify, social media habits and everything in between
tags:
  - clippings
date: 2025-04-07
updated: 2025-04-07
---
## Introduction

There has been a distinct lack of computer science blog posts on my site, which is a bit embarrassing considering that I'm studying computer science. Since I would like to get employed at some point and I don't want my future employers to think that I'm only interested in film cameras, here's a collection of small data science projects I worked on a year ago! None of the analysis here is particularly rigorous, it's just me having a fun poke around my data to see what I can learn.

## Sleep Analysis

One of the main reasons I bought myself an Apple Watch 3 years ago was for the sleep tracking data. My life over the last few years has gone through some pretty distinct phases, from online school to university life to working 16-hours days in a Japanese hotel, so I've always wanted to see how that is reflected in my sleep.

It's pretty easy to download sleep data from the iPhone Health app, however for some reason the data doesn't account for time zones! This makes it a garbled mess if you do any travelling:

![](https://joshuabird.com/assets/blog/index/img/my-life-in-data/1.png)

Garbled, timezone-less sleep data

It's bizarre that Apple doesn't account for time zones for their sleep data – even when viewed in the native health app, the sleep data gets messed up when you change time zones.

To fix these timezone inconsistencies I needed to know what country I was in for every day for the last 3 years. Coincidentally, I've also been tracking my exact location for the last 3 years! A few years ago, I turned on a setting in my journaling app which allowed it to record and log my exact location throughout the day. I've had to constantly fend off Apple's privacy alerts telling me how stupid of an idea it is to give that kind of data to an app, but I knew the data would come in handy one day, and it sure did!

I downloaded and parsed my location history from the app and was blown away by how accurate it was. Everything that I've done in the last three years was in there: trips to Hong Kong Disneyland, hikes to beaches, holidays in Europe.

![](https://joshuabird.com/assets/blog/index/img/my-life-in-data/7.jpg)

The location data for a hike I went on two years ago across the south of Hong Kong Island

But we're getting sidetracked, back to the sleep data. I was able to use my location history to figure out what timezone I was in for any given day, correcting the sleep data to be in local time.

![](https://joshuabird.com/assets/blog/index/img/my-life-in-data/2.jpg)

Timezone corrected sleep data

You can see all kinds of things in this graph. Here are some highlights:

1. I had my standardised exams held online from 2-6am because of covid, so I changed my sleep schedule to wake up at 2am.
2. I barely had any in-person classes for my last 2 years of High School.
3. I tried waking up to go to lectures for about 3 weeks before giving up.
4. Working at my internship in Hong Kong
5. Working at a hotel in Japan

## Spotify Analysis & how we reveal more to companies than we think

On to the next data set, my Spotify account! I analysed a bunch of stats about how my genre tastes have changed over time and how often I skip songs, but the most interesting dataset ended up being my listening history.

![](https://joshuabird.com/assets/blog/index/img/my-life-in-data/3.jpeg)

Spotify listening data from 2021

This graph shows my listening history for every day in 2021. It's pretty shocking how much Spotify I listen to; I basically only turn it off when I'm watching YouTube. Here are some interesting bits in the graph:

1. You can see me having dinner at about 8pm every day during this period when I was living in Hong Kong.
2. I left Spotify on all night I guess.

But more importantly, does something in this graph look familiar to you?

If we overlay my 2021 sleep data on this graph, we can see that it almost perfectly lines up with my listening data! It's crazy to see two seemingly disjoint datasets having such a strong correlation. You could almost perfectly derive my sleeping schedule from my Spotify listening history.

<video controls=""><source src="https://joshuabird.com/assets/blog/index/img/my-life-in-data/4.mp4#t=2.5" type="video/mp4"></video>Sleep data overlayed over Spotify data. Isn't that crazy?

Stuff like this really shows the power of data. If Spotify can figure out my sleeping schedule from just a quick glance at my listening data, I can only imagine what Amazon knows about me (and yet it still seems to give me absolutely useless product recommendations).

People always seem to think that Google must be listening to them through their phones because they serve us ads for products we've only ever thought about, but in reality people just don't understand how much information about your lives these companies can glean from your interactions with a computer or website.

As an aside, the company which impresses me the most is Tok Tok for sure. They somehow manage to figure out a user's interests with incredible accuracy just from analysing their engagement on random videos that the algorithm throws at them. Really impressive stuff.

## Message Analysis

I did a lot of interesting stuff with my messaging history, but obviously it's a bit hard to talk about it without revealing far too much about myself and the people I talk to. However, there is one graph that I find really interesting.

Below is the graph of my reply times vs other people's reply times in the same period of time. You can see the extremely high correlation between the two of r=0.86. In other words, when the person I'm talking to takes ages to reply I also take ages to reply, and vice versa. I always kinda knew that this was the case, but I never realised how extreme the correlation was!

![](https://joshuabird.com/assets/blog/index/img/my-life-in-data/5.jpg)

My reply time vs other's reply time

## Instagram Analysis

This one is pretty short. I reverse engineered the Instagram api to scrape all my friends and their friends. My goal was to figure out what unlikely connections there were between friends of friends, but unfortunately I pretty quickly hit the api rate limit and my account was suspended lol.

I kinda neglected the exponential growth of searching a tree with a huge branching factor, even if only searching two layers deep. I only have about 500 friends, but if all my friends also have 500 friends this ends up being a 250,000 people! Yeah I probably should have done that quick calculation before even attempting this.

There was a pretty ominous message about how they could permanently suspend my account if it happened again, so I'm not trying that again! Anyway, here's the data I managed to get before getting suspended.

![](https://joshuabird.com/assets/blog/index/img/my-life-in-data/6.jpeg)

(Partial) Instagram 2nd-degree friend graph

The two very distinct groups are my high school friends and my uni friends, which is no surprise. I was hoping to see more mutual friend connections between my Cambridge and Hong Kong friends (which I know exist), but I guess the web scraper didn't get to those people before I reached the API limit.

## Conclusion

I'm pretty terrible at writing blog posts in a timely manner – most of these projects were completed well over a year ago in January of 2022. As it turns out, this was just the start of my journey into data science. In the summer of 2022 I interned at AMPD Energy where I worked on some really interesting data science/ML projects and this summer I'll be interning at Palantir, a leading data science company, which I'm extremely excited about. These projects showed me the power that data science has to reveal fascinating insights out of our seemingly mundane data and really sparked my interest in the field.