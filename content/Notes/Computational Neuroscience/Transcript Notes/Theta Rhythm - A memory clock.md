---
id: Theta Rhythm - A memory clock
aliases: []
tags:
  - neuroscience
  - todo
  - artem-kirsanov
date: 2025-02-03
title: Theta Rhythm - A memory clock
updated: 2025-04-09
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

> [!Important] Fun Fact
> These are the same proteins that your heart uses to regulate its beating rhythm.

These [[Pacemaker Neurons]] then send their connections straight to the [[Hippocampus]], thus providing the rhythmic output and leading to the rise of the theta wave. This causes the activity of the Hippocampus to wax and wane, following the rhythm that the conductor([[Medial Septum]]) is providing.

---

> [!Warning] Quick Note again...
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

For the purpose of explaining what he means here, let's think of a [[Memory]] as a **temporal** sequence of neuronal patterns activating one after another. Each one of these patterns is a **collection** of neuronal assemblies, which together form an **integrated representation** of the world.

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

## Forming an Integrated Representation

To cement these concepts properly, lets work with an example:

> [!Example] > **Alice** and **Bob** are childhood friends who have not seen each other in a very long time.
>
> One day, they randomly bump into each other in the bank. But, given that both were busy, they thought it best to go and meet up later at their **favorite coffee shop** to catch up with each other.
>
> Suppose they dont have the luxuries we do now ( the internet, phones, etc ) to communicate with each other, other than face to face interaction. How can they possibly make the meeting at the coffee shop happen?

^85a4a4

One way is to agree on the place to meet like they did, and then occasionally visit it once in a while. There is a small chance that they meet each other there by coincidence, where they can finally sit down and talk. But we can all agree that this is a sub-par method of ensuring contact.

A more intuitive way to us is to **agree on a time** in advance. If they both know that they are meeting each other at _1pm_ tomorrow at their favorite coffee shop, there is no ambiguity left. In layman terms, even if they don't communicate directly, they can use an **external factor**, in the form of time, which they both have access to in order to **coordinate** their arrival.

![[Screenshot 2025-04-06 at 4.16.18 PM.png]]

> [!Abstract] Note
> In the ancient times before clocks were around, people used the position of the sun for the exact same purpose

In the [[Hippocampus]], the Theta Rhythm, and in particular it's **phase**(between $0^\circ$ and $360^\circ$) is used as this so called "clock". An **external agent"**, which all [[Neuron]]s can listen to, and coordinate their spiking activity.

![[Screenshot 2025-04-06 at 4.50.54 PM.png]]

Because, for the brain to "link" assemblies together(such as ones representing **where** and **with whom**), spikes from their neurons should arrive at the receiver neuron in a very small time window, with a very short interval between each other. That way, theta oscillation provides a **temporal reference** which can be used by neurons to adjust the timings of their spikes in order to caryr out information transfer more effectively.

The reason why theta rhythm activates during exploratory behavior(running, etc), is that spacial behavior needs navigation and memory encoding. For this reason, our brain requires that we constantly form **integrated representations** of environments.

Going back to [[Theta Rhythm - A memory clock#^85a4a4|our example]], this means that all of a sudden, everyone has a lot of catching up to do with their old friends. Therefore, the **global timing mechanism** is used for hundreds of similar people to coordinate their arrivals effectively en masse.

_However, this only really represents about half of the purpose of theta rhythm, as we will learn_

At this point, these constructed amalgamations of information sources is only a stationary snapshot of the external world at some point in time. It does not encode the past or future temporal order into the episodic memory. It is the **chaining** of these neuronal assemblies into a temporal sequence that of better use to the brain.

_this is like taking a freeze frame of a movie!_

---

## Sequential Organization

To achieve this **chaining of assemblies**, there are two possible mechanisms we can use.

1. The first one are **externally generated** sequences. they arrise when the incoming information _already_ has a sequencial organization.

> [!Example]
> suppose you(a mouse) are walking through a corridor with a rainbow colored gradient wall. In the beggining its red, middle its yetllow, end is blue, etc.
>
> In that case, visual information, which is organized as a succesion of changing colors, evokes a chain corresponding representations in the brain
>
> ![[Screenshot 2025-04-06 at 7.09.12 PM.png]]

2. The alternative and much more interesting option is that of the **internally generated** sequences. This would likely emerge when there are little to no incoming sensory information, and thus it is left up to the brain to organize sequentially

> [!Example]
> Imagine if that same mouse has sat to lie down with its eyes closed, and is trying to recall the experience of walking through that rainbow gradient corridor. In this case, the sequence representation has to be generated by the brain itself. Connectivity patterns and synaptic strengths between members of the assembly itself. Aka, if the activation of the first assembly leads to the second, and so on and so fourth.
>
> ![[Screenshot 2025-04-06 at 7.20.02 PM.png]]

^4f4e3b

The interesting thing here is that it turns out that **Theta Rhythm** itself is _essential_ for the generation [[Theta Rhythm - A memory clock#^4f4e3b|the latter type]].

When the Theta Rhythm is abolished in test subjects, it severely affects the emergence of this type of sequential activity, which is normally observed during planning and memory retrieval.

Let's put this in better terms by returning to the [[Theta Rhythm - A memory clock#^85a4a4|cafe example]]:

> [!Example]
> Now lets suppose that all these "pair encounters" between many different **Alices** and **Bobs** should happen in a **strict temporal succession**. For this case, lets suppose this takes the form of a _couples_ therapy.
>
> First, Alice and Bob go at `10AM`. Then, Claire and Dan go after them at `11AM`, and so fourth.

In this case, just like we saw before, **time serves to coordinate arrivals of individuals** within a couple. But, at the same time, **external clock** is used to separate different sessions in time, to ensure they happen one after another in a well defined order.

![[Screenshot 2025-04-07 at 9.46.48 AM.png]]

Otherwise, it would be somewhat awkward if _all_ the couples showed up for their session at the same time.

In the same way, **Theta Rhythm** provides a mechanism to arrange experience into a **temporal sequence**. And just like in the previous case, it is the **phase** of the wave which serves as the **coordination parameter**.

Because neurons adjust timings of their spikes to the ticking of the [[Hippocampus|hippocampal]] clock, episodic memories can unfold in a _meaningful_ temporal succession, instead of being jumbled together.

---

## Phase Precession

We have already talked about how a **path** through an environment can be represented sequence of [[Place cells: How your brain creates maps of abstract spaces|place cell]] activations(the specialized neurons that encode physical location and subsequent behavior).

Each of those cells has a preffered patch of ground, called the **place field**, where if fires most actively.

When the animal enters the place field, reaches center, and leaves it, the **firing rate**(see [[1.2 - Spike Trains and Firing Rates|textbook]]) of that neuron would gradually increase. In reaches its maximum value at the **center** of the place field, and then gradually decreases.

![[Screenshot 2025-04-09 at 4.26.15 PM.png]]

This phenomenon is what we like to call **Rate Coding**, where the information about the position is directly encoded in whatever neuron is currently spiking, and the **firing rate** of said neuron.

![[Screenshot 2025-04-09 at 4.28.20 PM.png]]

However, it turns out that the phase of **Theta Rhythm** at which these neurons spike also plays a role in the information transfer. This is known as **phase coding**.

More specifically, if one was to record the activity of individual neurons in addition to the surrounding Theta Rhythm, you would notice some very bizarre behavior. As the neuron moves through the place field of a neuron, its spikes would occur at early and earlier phases of Theta.

![[Screenshot 2025-04-09 at 4.31.48 PM.png]]

It gets even more interesting when you consider this **Phase. Precession** when accounting for multiple neurons. If you look at how multiple place cells **spike** relative to each other, you will see that the **order of spikes** within one **Theta Cycle**(The time window between two peaks) **Recapitulates** the exact order of place fields on the portion of the trajectory.

![[Screenshot 2025-04-09 at 4.36.17 PM.png]]

Looking at this visualization, you will notice that there the most overlap at the exact center of the "red" spike firing rate. This peak firing rate is observed at the **trough**(valley) of the Theta wave, at around the $180^{\circ}$ mark.

The "recent past" place cells of yellow is gradually shifted to the left as time passes, and you will notice at the end it is roughly at the $0^{\circ}$ mark of the Theta Wave.

Subsequently, the place cells that are just at the beginning of their firing arc represent the **near future** neuronal spikes at the $360^{\circ}$ mark.

![[Screenshot 2025-04-09 at 4.58.28 PM.png]]

This way, every cycle of **Theta** bears some sort of information about the past, present, and future, in proper order. As the animal moves and Theta Rhythm progresses, the representations would shift accordingly along the wave to maintain this "time-phase" relationship.

It is a very interesting little system of temporal organization which sorts segments of experiences.

It is believed that these are pieces of a much bigger puzzle, which are referred to as "Theta Sequences". These sequences are likely stitched together to encode for a full memory system.

---

## Conclusion/Summary

To summarize, the **Theta Rhythm** is a very interesting phenomenon that is observed in the [[Hippocampus]]. It is a brain wave that operates at a frequency of around 4-8 Hz, and it is associated with memory formation and retrieval.

Integrated Representation of the external world is achieved by the **Theta Rhythm**, which serves as a **global timing mechanism** for the [[Hippocampus]]. It helps to link different modalities of information together, and to organize them into a meaningful temporal sequence.

And, to top it all off, this **Theta Wave** is also responsible for the **Phase Precession** of \*_Place Cells_, which allows the brain to encode information about the past, present, and future in a meaningful way.

---

[^1]: Goutagny R, Jackson J, Williams S. Self-generated theta oscillations in the hippocampus. Nat Neurosci. 2009 https://pubmed.ncbi.nlm.nih.gov/19881503/

[^2]: Hummos A, Nair SS. An integrative model of the intrinsic hippocampal theta rhythm. Lytton WW, editor. PLoS ONE. 2017 https://pubmed.ncbi.nlm.nih.gov/28787026/
