---
id: Firing Rate Approximation
aliases: 
tags:
  - neuroscience
  - cs/python
  - todo
date: 2025-04-11
updated: 2025-04-11
---

This serves as a simple notebook for implementing the different kinds of Firing Rate Approximation Functions as defined in [[1.2 - Spike Trains and Firing Rates]].

In most cases you would be doing this for multiple [[Neuron]]s, but here we will just do one like the Textbook's figures.

**Module Imports:**
```python-r
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
```

---

## Defining the Data

Here we define our model parameters for the test, we dont want anything too big so we will just do **10** seconds, **1** neuron( you can adjust if you like), and a time resolution of **1** ms.

```python-r
num_neurons = 1 # number of neurons
duration = 10 # trial duration
dt = 0.001 # time resolution

time = np.arange(0, duration, dt) # constructing the timeframe
print(time) # a long list of 1ms time slots for 10 seconds
```

#### Creating Spike Trains

This won't be as accurate as a "real" dataset, but `numpy` has a capable seed random number generator that creates realistic data for this case:

```python-r
firing_rates = np.random.uniform(5, 20, size=num_neurons) # for "noise"

# initializing the spike trains, where 0 no spike, 1 is spike
spike_trains = np.zeros((len(time), num_neurons))
for i in range(num_neurons):
    prob_spike = firing_rates[i] * dt  # probability of spike at each time step
    spike_trains[:, i] = np.random.rand(len(time)) < prob_spike

# we will want this as a pandas dataframe for easy use
data = pd.DataFrame(spike_trains, columns=[f'neuron_{i}' for i in range(num_neurons)])
data['time'] = time # using our timeframe as the dimension
print(data)

```

---

## Raster Spike Train Graph

Without any kind of rate approximation, let's get a sense of what the data looks like.

```python-r
n_neurons = len([col for col in data.columns if col.startswith('neuron_')])
for i in range(min(5, n_neurons)):  # Plot first 5 neurons or all if less than 5
    spike_times = data['time'][data[f'neuron_{i}'] == 1]
    plt.vlines(spike_times, i + 0.5, i + 1.5)
plt.yticks(np.arange(1, min(5, n_neurons) + 1), [f'neuron_{i}' for i in range(min(5, n_neurons))])
plt.xlabel('Time (s)')
plt.ylabel('Neuron')
plt.title('Neuron Spike Raster')
plt.show()
```

---

## Discrete Bin Graph

One way to approximate the firing rate is through the use of _binning_. This procedure generates an estimate of the firing rate that is a piecewise constant function of time, something of a _histogram_.

Because spike counts can take only integer values, the rates computed by this method will always be integer multiples of $\frac{1}{\Delta t}$, and thus they only take discrete values.

For this approach, we will use bins of size $\Delta t = 100ms$.

```python-r
bin_size = 0.1  # 100 ms
num_bins = int(duration / bin_size)  # number of bins

# sorting the data into the bins, making a new dataframe
data['bin'] = (data['time'] // bin_size).astype(int)
for i in range(num_neurons):
    data[f'neuron_{i}_bin'] = data.groupby('bin')[f'neuron_{i}'].transform('sum')
print(data)

# plotting for all neurons (should just be one)
plt.figure(figsize=(6, 3 * min(5, num_neurons)))
for i in range(min(5, num_neurons)):  # we dont want more than 5
    plt.subplot(min(5, num_neurons), 1, i + 1)
    plt.bar(data['bin'] * bin_size, data[f'neuron_{i}_bin'], width=bin_size, align='edge', alpha=0.7)
    plt.ylabel(f'Neuron {i}')
    plt.xlim(0, duration)
    if i == min(5, num_neurons) - 1:  # label should only be on bottom
        plt.xlabel('Time (s)')
    plt.xticks(np.arange(0, duration + bin_size, bin_size))
    plt.grid()
plt.suptitle('Binned Spike Count for Neurons')
plt.tight_layout()
plt.show()
```

---

## Sliding Window Rectangular

Placement of bins introduces a new issue, as the firing rate estimate now depends not only on the size of the time bins, but also their placement. We dont want this to be arbitrary, so we can instead use a single bin and slide it across the timeframe.

This will yield a hopefully higher approximation resolution, but since it is still a rectangular window it will have those same jagged edges as the previous method.

The firing rate approximated this way will be expressed as the sum of a window function over time $t_{i}$

$$
r_{approx}(t) = \sum_{i=1}^n w(t-t_{i})
$$

where $i$ is a list of times $i=1,2,\dots,n$, and $n$ is the number of spikes.

In this case, our sliding window function $w(t)$ is defined as:

$$
w(t) = \begin{cases}
\frac{1}{\Delta t} & if \ -\frac{\Delta t}{2}\leq t \leq \frac{\Delta t}{2} \\
0 & otherwise
\end{cases}
$$

```python-r
window_size = 0.1  # 100 ms

# first, we extract spike times for each neuron
def extract_spike_times(data, neuron_idx):
    return data['time'][data[f'neuron_{neuron_idx}'] == 1].values

# then create function to calculate the sliding window rate
def sliding_window_rate(spike_times, eval_times, window_size):
    rate = np.zeros_like(eval_times, dtype=float)
    half_window = window_size / 2

    for i, t in enumerate(eval_times):
        # count spikes within window at time t
        count = np.sum((spike_times >= t - half_window) & (spike_times < t + half_window))
        # convert to (spikes/second)
        rate[i] = count / window_size

    return rate

# plotting
plt.figure(figsize=(6, 2))
for i in range(min(5, num_neurons)):
    spike_times = extract_spike_times(data, i)
    # calc rate at regular intervals
    eval_times = np.arange(0, duration, dt)
    rate = sliding_window_rate(spike_times, eval_times, window_size)
    plt.plot(eval_times, rate, label=f'Neuron {i}')

plt.xlabel('Time (s)')
plt.ylabel('Firing Rate (Hz)')
plt.title(f'Sliding Window (Rectangular) Firing Rate, Window = {window_size} s')
plt.legend()
plt.grid(True)
plt.show()
```


---

## Sliding Window Gaussian

The next step after this is quite clear - the sliding window provides the precision we need, but due to the rectangular shape it retains those jagged edges from the bin method.


