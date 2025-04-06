---
id: Theta Rhythm - A memory clock
aliases: []
tags:
  - neuroscience
  - todo
  - artem-kirsanov
date: 2025-02-03
title: Theta Rhythm - A memory clock
updated: 2025-04-06
---

_study notes for a [[Artem Kirsanov]] [video](https://youtu.be/5CxSoFK5tOQ?si=xNx2_g403li49K1i)_

Recently, there have been some significant advancements in decoding the hippocampus, and how it is involved in memory. This is a very complex structure, and it is not yet fully understood. However, we do know that the hippocampus is involved in the formation of new memories, and the retrieval of old ones.

More specifically, looking at the brain's internal clock, the **Theta Rhythm** is a very interesting phenomenon. This is a brain wave that is present in the hippocampus, and it is associated with [[Memory Formation]] and retrieval. We believe that the theta rhythm is a clock that helps the brain to organize memories in time.

---

## Brain Waves

Let's start by coming to understand what the brains internal waves actually are.

**Brain Waves** were first discovered in the 1920s by a German psychiatrist named Hans Berger. He discovered that the brain emits electrical signals, and that these signals can be measured using an **Electroencephalogram (EEG)**, essentially some electrodes attached to someone's head. This is a device that measures the electrical activity of the brain.

What was shown was several different oscillating patterns, which we now call **Brain Waves**. These waves are classified by their frequency, and they are associated with different states of consciousness.

At this point in history, we know quite a lot about the different kinds of brain waves, and the frequencies that they operate at. For example, **Delta Waves** are associated with deep sleep, **Alpha Waves** are associated with relaxation, and **Beta Waves** are associated with alertness.

![[Pasted image 20250324102549.png]]

But for this note, we are interested in the **Theta Rhythm**. This is a wave that operates at a frequency of around 4-8 Hz, and it is associated with the hippocampus.

---

## Generation of Theta Rhythm

The theta rhythm is characteristically described by its wavelength, with a frequency between **4** and **12** Hz.

It is measured by sticking an electrode inside the hippocampus and measure the voltage difference between a point in [[Extracellular Space]] and a ground electrode ( typically in the base of the skull ). 

This voltage arises out of the summation of currents of neurons, reflecting synchronous synaptic inputs.

That is, when **one neuron** sends information to another through synapses.

![[Screenshot 2025-02-03 at 1.53.13 PM.png]]

In the case where there is a large number of neurons surrounding this electrode, and they are constantly sending signals simultaneously, then these individual currents **add up**, leading to the voltage becoming strong enough to be sensed by external electrode.

> [!Warning] Note
> Remember this measurement is finding the **overall activity** sensed by the electrode, and not the behavior of any individual neuron. As [[Artem Kirsanov|Artem]] put it, this is like putting a microphone over a stadium, you cant discern individual phenomena but rather general group behavior patterns(which are still useful).

This special rhythm is generated in a special structure, called the [[Medial Septum]]. This structure contains a large amount of something called [[Pacemaker Neurons]], which are known to regularly discharge something between 4 and 12 times a second.

These special neurons have some special proteins called [[Hyperpolarization Activated Channels]](HCNs), which allow Ions to flow into the cell at a regulated time interval, generating this rhythmic pattern.

![[Screenshot 2025-03-26 at 12.07.01 PM.png]]

>[!Important] Fun Fact
> These are the same proteins that your heart uses to regulate its beating rhythm.

These [[Pacemaker Neurons]] then send their connections straight to the [[Hippocampus]], thus providing the rhythmic output and leading to the rise of the theta wave. This causes the activity of the Hippocampus to wax and wane, following the rhythm that the conductor([[Medial Septum]]) is providing.

---

>[!Warning] Quick Note again...
> This is quite the oversimplification of an otherwise very complex process. As [[Artem Kirsanov|Artem]] mentions, a group of researchers led by Romain Goutagny[^1] found that under certain conditions, the Hippocampus itself can generate theta rhythm, indicating that it contains some neuronal machinery sufficient enough for the generation of intrinsic rhythm.

In this scenario, it would mean that the hippocampus, much like a well trained orchestra, can perform coherently even in the absence of its conductor.

Goutagny Et al.[^1] found that rhythmic activity arises due to the interactions between excitatory and inhibitory neurons, through a negative feedback loop. 

![[Screenshot 2025-03-26 at 12.18.34 PM.png]]

[^2]

It is quite an elegant mechanism, however a tad bit complex for an introduction to Theta Rhythm. I will most likely create a note later on taking a [[Self-generated theta oscillations in the hippocampus|deeper look at the paper alone]].

Aside from that quick detour, let us assume that for the most part, the [[Medial Septum]] is responsible for the beat generation for the [[Hippocampus]]. Even though the hippocampus does have an **intrinsic oscillator** within, a bulk of the computation will come from the **upstream oscillation** of the medial septum.

![[Screenshot 2025-03-26 at 12.29.47 PM.png]]

---

## Functions of the Theta Wave

Just like any other brain rhythm, Theta is not always present.

Theta Rhythm is observed under some specific physiological states, namely periods of locomotion(aka running), exploratory sniffing, and various environment related behaviors.o

One example might be when an animal is grooming itself, it is unlikely that Theta activity would be present at all, or at the very least, under very sparse bursts. You wouldn't note the slow frequency component in this case.

But when this animal starts engaging in an activity such as running or for the search of food, it's [[Hippocampus]] would light up the rhytmic theta wave.

[[Spacial Navigation]] is closely linked to [[Memory Formation]](as they are both functions of the Hippocampus), and this makes sense for a lot of creatures. Say you are a mouse, and you find a food source by taking a specific route to find it. It is evolutionarily beneficial to take special note of a route like this so that the mouse can retrieve it next time.

> While the specifics are up for discussion, [[Artem Kirsanov|Artem]] seeks to make the argument that the central purpose of **theta rhythm** is to provide a computational mechanism to **construct** and **retrieve** memory traces.

For the purpose of explaining what he means here, let's think of a [[Memory]] as a **temporal** sequence of neuronal patterns activating one after another.  Each one of these patterns is a **collection** of neuronal assemblies, which together form an **integrated representation** of the world.

![[Screenshot 2025-04-05 at 2.43.48 PM.png]] 

This "integrated representation" has the feature of encoding different modalities of a given experience.

This could be things like the **current position**, **sensory cues**, the **emotional state** at that time, the **social interactions** in that given place/experience... The list goes on.

Each of these "modalities" has a **corresponding pattern** of brain activity, a "neural fingerprint" of sorts that uniquely identifies this given information source.

A great example of this is another video made by Artem(which I plan on writing a note on, if not done already) about [[Place cells: How your brain creates maps of abstract spaces|Place Cells]], which are neurons that essentially associate certain behavior with a given location. Each of these Place Cells has a **preferred location** in which they tend to fire. Bringing all these place cells together, we get something of a "code" of physical position.

---

However, the [[Hippocampus]] has been shown to encode much more than just spatial variables, things like **sound frequencies**, and even the **identities** of certain people(in the case of humans at the least).

These all come together to form a modality rich experience that represents all of the different sources of information for a given episodic memory.

But to form an integrated representation for the external world, the brain has the problem of **unifying** these different modalities into a single "picture". **Theta Rhythm** has the purpose of ensuring that all these separate components link together to form a unified memory.

In addition to the "assembly" of a unified memory, another problem that the brain has to solve is the arrangement of these instantaneous representations into a meaningful **temporal sequence**, to form a meaningful memory which unfolds in time.

![[Screenshot 2025-04-05 at 3.19.03 PM.png]]

This so-called **sequence organization**(a one dimensional process) is vital for [[Spacial Navigation]], as each trajectory/path is made up of a sequence of activated place cells. But it is also vital for **episodic memory** in general. Theta Rhythm helps in the process of forming these "chains of representation", ensuring the correct temporal order.

---

## Forming an integrated representation

To cement these concepts properly, lets work with an example:

> [!Example]
> **Alice** and **Bob** are childhood friends who have not seen each other in a very long time. 
>
> One day, they randomly bump into each other in the bank. But, given that both were busy, they thought it best to go and meet up later at their **favorite coffee shop** to catch up with each other.
>
> Suppose they dont have the luxuries we do now ( the internet, phones, etc ) to communicate with each other, other than face to face interaction. How can they possibly make the meeting at the coffee shop happen?

One way is to agree on the place to meet like they did, and then occasionally visit it once in a while. There is a small chance that they meet each other there by coincidence, where they can finally sit down and talk. But we can all agree that this is a sub-par method of ensuring contact.

A more intuitive way to us is to **agree on a time** in advance. If they both know that they are meeting each other at *1pm* tomorrow at their favorite coffee shop, there is no ambiguity left. In layman terms, even if they don't communicate directly, they can use an **external factor**, in the form of time, which they both have access to in order to **coordinate** their arrival.

![[Screenshot 2025-04-06 at 4.16.18 PM.png]]

[^1]: Goutagny R, Jackson J, Williams S. Self-generated theta oscillations in the hippocampus. Nat Neurosci. 2009 https://pubmed.ncbi.nlm.nih.gov/19881503/
[^2]: Hummos A, Nair SS. An integrative model of the intrinsic hippocampal theta rhythm. Lytton WW, editor. PLoS ONE. 2017 https://pubmed.ncbi.nlm.nih.gov/28787026/
	