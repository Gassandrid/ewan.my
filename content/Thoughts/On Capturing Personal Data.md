---
class:
  - note
tags:
  - cs/data-science
  - cs/homelab/data
  - comp-neuro
  - journal
  - OCD
  - tree
source:
related:
author:
date: 2025-10-08
updated: 2026-01-14T10:07:18-05:00
aliases:
  - Quantified Self
---

While working on a project for my class [[Brainstorming Data Science Temporal Project]], I had the opportunity to sit down and actually view the data that I had been collecting in my vault without really thinking about it. This vault contains notes yes, but also structured data for **videos** I watch,

---

## Longevity

The start of this obession came with the idea of perfecting my life as if it was parameterized by latent variables for which I could not observe. This was simple enough at first, tracking things like air quality using a [[Home Assistant]] device called the [[AirGradient ONE]]. This would just give me basic, single dimensional sample which I could use to retune the parameters of my environment.

But the dreams of [[Mutual Information]] soon took over. Dreams of cross correlating air quality with things like say, a sleep score from a [[Garmin Venu 4]] watch gave the promise of double the information, but exponentially more insight. The inherent richness of the multi dimensional data could drive me down a rabbit hole of ML models for tuning my life. This was also motivated by the idea of high frequency immediate feedback, where methods/changes could be tested in rapid iteration and the results observed immediately. This mirrored workflow ideals I had garnered from the software engineering world, but also through the [[3d Printing]] process.

## Mind Mapping

This is much more in line with both the fundamental purpose of obsidian, but also my ventures into understanding the nature of [[Consuming and Choosing Content Effectively|content consumption]] and domains of [[Computational Neuroscience]]

This also includes physical sensors to provide that mutual information seen above. An obvious pairing with [[ActivityWatch]] would be some kind of eye tracker like the [[Tobii Eye Tracker 5]], but the real cream of the crop would come from combining this with an EEG headset (maybe [[BrainAccess HALO]] ) as a means to denoise the signal when filtered via meaningfull eye capture.

While quite an unrealistic idea, I also often have dreams of a world in which I could perform the same kind of parameter tuning to "descend the gradient" of my own mind for learning/habit optimization. Quite unlikely given todays modeling capabities, but I view this as a "store now decrypt later" kind of problem. If I can capture all the data about my mind wandering now, it is possible I would have the tools later in my research career to extract meaningfull output.

---

## Data Sources

To satiate my OCD desires, I think it best to compile a list of all data ventures planned and already doing, serving as an entry point to

### Health Data

#### Wearable

[[Garmin Venu 4]] is probably the best option for this, it is not super expensive like the other watches but has the same sensors without a GPS and all that crap.

#### Body Scan

There are also health biomarker systems that track a lot more, but are not low delta timeseries data that wearables provide. They often take the form of a scale. The one that I have been looking at, while a bit contraversial in some cases, is the [[Withings Body Scan]] system. Beyond body composition data, it also measure nerve heatth and many other biomarkers.

##### [[01-10-2026]] Update - New Withings Scale

The [[Withings Body Scan 2]] was just announced, a big upgrade for [[Longevity]] tracking. Instead of getting bodyscan Ill just wait for this to release.

#### Air Quality

Using an [[AirGradient ONE]] with [[home assistant]]. Data is already collected by the server, so this is easy to integrate.

### Brain Data

#### EEG

Would likely use something like the [[Ultracortex "Mark IV" EEG Headset]] to record my own data. I compiled some useful information about this + some aliexpress addons under [[Exploring Personal EEG Solutions]].

On further thought, I have decided that this too expensive given the quality of the parts. Yes, OpenBCI is the most trusted in the game, but 600 for the [[Electrodes]], another 350 for the analog chip on ali express, and it gets out of hand. Likely will stick wtih something simpler like a [[BrainAccess HALO]].

#### Eye Tracking

Could use the [[Tobii Eye Tracker 5]] as another source of attention in correlation with [[ActivityWatch]]. Dot product could be computed to

### Online Data

The crux of the *input* to my mind. In addition to manual takeouts/data requests, we can also use tracking services like [[ActivityWatch]] to collect timeseries data as we go by. I document this under [[Tracking EVERYTHING I do on my computer]].

#### Youtube / Google

Can use **Google Takeout** to extract your data, but some web scraping like [[Scraping My Youtube History]] will work as well.

#### Browsing History

Firefox stores all this data locally in a file called `places.sqlite`, not too hard to get. 

Given that I have [[ActivityWatch]] set up now, this seems to do a better job of caputuring the high frequency nature of browsing activity (switching between a lot of tabs really quickly), and it has a firefox extension for more detailed history. I will still keep the places.sqlite file as a backup/general purpose for all the content before I set it up, but this will be the primary method from now on.

#### Instagram

#### Spotify

Spotify has an option for this on the privacy section of their website: <https://www.spotify.com/us/account/privacy/>

I have requested the data, it should hopefully take no longer than 30 days.

- [[Get requested spotify data]]

#### Discord

This one was easy enough. I have used a tool in the past called [[DiscordChatExporter]] which allows you to select channels to export from.

#### Location Data

This is under online data as the best way to track this is with GPS on my phone. I have opted to use [[OwnTracks]] with [[Home Assistant]] to track this. This will hopefully turn out very intereststing, as a lot of things can be cross referenced with location for novel findings. I document setting up this idea under [[Capturing my Phones Location Data]]

[[Garmin Venu 4]] also tracks this, can be graphed wtih [[garmin-grafana]].

### Self Reported Data

This is all stuff obsidian, but there is an issue at hand. For one, a lot of the data I record here are just extracts from **Online Data**. In the future, I want to find a way to merge these two data sources together, without crashing my obsidian in an instant.

#### Obsidian Daily Notes

The best spot for self reported data aggregation, mostly semantic but also has a checklist and some rudimentary front matter to fill out. In all honesty, there isnt that much numerical data to self report that Iwouldn'tt just be using a tool for anyway. This would mostly be for relationship management and semantic data tracking.

Some external options have been around like [exist.io](https://exist.io/), but I think I can honestly integrate that into obsidian with the daily note system. I updated the [[daily note template]], but I dont want to add too much that I'll just end up tracking with the [[health]] data.

>[!Warning] Updates
> I have taken some time to do some [[Private/Garden Tending|Garden Tending]] on the workflow, and have changed the structure of the [[daily note template]]. While I did say I didnt want to add too much, I sort of changed my mind, and added a **bunch** of yaml properties in place of the old everyday checklist. This also has options besides checkboxes, for thinkgs like exact wakeup/bedtime and meal choices ( which can be links to meal notes I have prepared, eg [[Super Veggie]])

#### Financial Tracking

I do this with [[Hledger docs|hledger]], but luckily this is still inside of the obsidian vault so no consolidation needs to be done. It is plain text, and thus no fancy work needs to be done to track this in accordance wtih all my other stuff. 

It would be nice to integrate this better into a database format for cross referencing, but this woudl require that I use [[Hledger docs|hledger]] more often, as right now the only thing I use it for is my college expenses.

##### [[01-09-2026]] Update - Obsidian Solution

While Hledger has been great for a lot of things in the short term, it wasnt exactly cut out for my purpose. It was simultaneously far too complex and feature rich, having actual accountants in mind as the user base, but the interface itself was also limiting in its platform compatability. I am all for command line interfaces, but this required something closer to my personal life.

With obsidian bases and a few templating plugins, I created a drop in replacement that has the exact same prompts as [[Hledger docs|hledger]], but as obsidian notes. [[Transactions.base]] now handles this for me.

---

## Checklist

- [x] air quality
- [x] wearable
- [x] instagram
- [x] youtube - SEMI DONE
- [x] spotify
- [x] discord
- [x] browser 

---

## Data Aggregation

There are a lot of options here, all of which will likely involve Homelab + Obsidian. But, given the complexity of how much data I will have around, I think the best choice is to have a **MonoRepo** using **Git** and **DVC**(data version control) to manage all the different data source I have there. With the monorepo architecture, it would be easy to handle processing and whatnot when I please, maybe adding to [[Grafana]] and other visualization tools.

This is begginging to be designed under [[Setting up a sort of Monorepo for personal data]], namely splitting the data from the stuff we collect automatically (air quality,)

**Claude Idea:**
<https://claude.ai/chat/6a037e65-1106-448c-b45b-57d6898cc5cc>
