---
date: 2025-01-04
created_on: "[[01-04-2025]]"
updated: 2026-02-09T13:23:57-05:00
title: Python Libraries to Learn
tags:
  - cs/python
  - resource/programming
  - todo/programming
  - todo/neuro
  - todo/math
---
**Comp Neuro:**
https://neuralensemble.org/
- [ ] [[Brian2]] - best for prototyping, general comp neuro abstract modelling
- [ ] [[Elephant]] - working with actual brain data
- [ ] [[NEST]] - for REALLY big simulations - im talking about supercomputer level
- [ ] [[Nengo]] (maybe, I dont know if it is still relavent)
- [ ] [[TransformerLens]] - good for [[Mechanistic Interpretability]] research in ai


**Misc**:
- [ ] [[yt-dlp]]

**Ai**:

---

## ChatGPT Generated

#### Computational Neuroscience

|Library|Why You Need It|
|:--|:--|
|**Brian2**|THE simulator for spiking neural networks — fast, very Pythonic, fantastic for experimenting with neuron models.|
|**NEURON** + **LFPy**|If you need detailed, biologically-realistic neuron modeling (ion channels, dendrites, etc.) — used in "heavy" neuroscience papers.|
|**NEST**|Large-scale spiking neural network simulations. Good if you're scaling up to networks of thousands/millions of neurons.|
|**Elephant**|Data analysis for neuroscience (spike trains, time series, STA, etc.). Works well with Neo.|
|**Neo**|Data structures for electrophysiology data (standardizes how spikes, events, analog signals, etc. are stored).|
|**BindsNET**|Deep learning + spiking neural network toolkit. If you want SNNs _and_ ML connections.|
|**PyNN**|Abstraction layer to write one code that can run on Brian2, NEST, NEURON, etc.|

If you only want a "working core" you can expand later:

- `numpy`, `scipy`, `matplotlib`, `pandas`
- `brian2`, `neo`, `elephant`
- `sympy`, `jax`
- `seaborn`, `h5py`, `scikit-learn`
- `dask` (for larger data)

---

## General

| Rank | Library         | Primary Use Case            | Learning Source                                                 |
| ---- | --------------- | --------------------------- | --------------------------------------------------------------- |
| 1    | `NumPy`         | Scientific Computing        | [documentation](https://numpy.org/doc/stable/)                  |
| 2    | `Pandas`        | Data Analysis               | [documentation](https://pandas.pydata.org/docs/)                |
| 3    | `Matplotlib`    | Data Visualization          | [documentation](https://matplotlib.org/stable/users/index.html) |
| 4    | SciPy           | Scientific Computing        |                                                                 |
| 5    | Scikit-learn    | Machine Learning            |                                                                 |
| 6    | TensorFlow      | Machine Learning/AI         |                                                                 |
| 7    | Keras           | Machine Learning/AI         |                                                                 |
| 8    | `PyTorch`       | Machine Learning/AI         |                                                                 |
| 9    | `Flask`         | Web Development             |                                                                 |
| 10   | Django          | Web Development             |                                                                 |
| 11   | Requests        | HTTP for Humans             |                                                                 |
| 12   | `BeautifulSoup` | Web Scraping                |                                                                 |
| 13   | `Selenium`      | Web Testing/Automation      |                                                                 |
| 14   | PyGame          | Game Development            |                                                                 |
| 15   | `SymPy`         | Symbolic Mathematics        |                                                                 |
| 16   | `Pillow`        | Image Processing            |                                                                 |
| 17   | SQLAlchemy      | Database Access             |                                                                 |
| 18   | Plotly          | Interactive Visualization   |                                                                 |
| 19   | Dash            | Web Applications            |                                                                 |
| 20   | Jupyter         | Interactive Computing       |                                                                 |
| 21   | FastAPI         | Web APIs                    |                                                                 |
| 22   | PySpark         | Big Data Processing         |                                                                 |
| 23   | NLTK            | Natural Language Processing |                                                                 |
| 24   | spaCy           | Natural Language Processing |                                                                 |
| 25   | Tornado         | Web Development             |                                                                 |
| 26   | Streamlit       | Data Apps                   |                                                                 |
| 27   | Bokeh           | Data Visualization          |                                                                 |
| 28   | PyTest          | Testing Framework           |                                                                 |
| 29   | Celery          | Task Queuing                |                                                                 |
| 30   | Gunicorn        | WSGI HTTP Server            |                                                                 |
|      |                 |                             |                                                                 |

## Neuroscience Tools

- [Nengo](https://github.com/nengo/nengo) - Library for creating and simulating large-scale brain models.
- [Nitime](https://github.com/nipy/nitime) - Timeseries analysis for neuroscience data.
- [Nilearn](https://github.com/nilearn/nilearn) - Module for performing statistical learning/machine learning on NeuroImaging data.
- [DIPY](https://github.com/nipy/dipy) - Toolbox for analysis of MR diffusion imaging.
- [MNE-Python](https://github.com/mne-tools/mne-python) - Community-driven software for processing time-resolved neural signals including electroencephalography (EEG) and magnetoencephalography (MEG).
- [NiBabel](https://github.com/nipy/nibabel) - Provides read and write access to some common medical and neuroimaging file formats.
- [PsychoPy](https://github.com/psychopy/psychopy) - Package for running psychology and neuroscience experiments. It allows for creating psychology stimuli in Python.
- [NuPic](https://github.com/numenta/nupic) - Numenta Platform for Intelligent Computing is an implementation of Hierarchical Temporal Memory (HTM), a theory of intelligence based strictly on the neuroscience of the neocortex.
- [Brian2](https://github.com/brian-team/brian2) - Free, open source simulator for spiking neural networks.
- [expyriment](https://github.com/expyriment/expyriment) - Platform-independent lightweight Python library for designing and conducting timing-critical behavioural and neuroimaging experiments.
 - [BindsNET](https://github.com/Hananel-Hazan/bindsnet) - Package for simulating spiking neural networks for reinforcement & machine learning.
 - [SpikeInterface](https://github.com/SpikeInterface/spikeinterface) - Framework designed to unify spike-sorting technologies
 - [NiMARE](https://nimare.readthedocs.io/en/latest/) - NiMARE is a Python package for neuroimaging meta-analyses

---
