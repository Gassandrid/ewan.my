---
date: 2025-01-04
updated: 2026-05-07T17:38:54-04:00
title: Python Libraries to Learn
tags:
  - cs/python
  - resource/programming
  - todo/programming
  - todo/neuro
  - todo/math
---

not really a "learning" file, but a reference for cool toolboxes in python that I should have a look at.

**Comp Neuro:**

https://neuralensemble.org/

- [ ] [[Brian2]] - best for prototyping, general comp neuro abstract modelling. basically entirely for [[Spiking Neural Network]]s
	- update [[03-12-2026]] : probably the most useful one here, i mean if [[Emulation of the Drosophila Fly brain]] can be done in it then it is more than enough for big sims, especially since there is Brian2Cuda
- [ ] [[NeuralSet]] for packaging neural sensory data into torch tensors,
	- great for multi modal ( think EEG + eye tracking with image/video stimulus )
- [ ] [[Elephant]] - working with actual brain data, specifically from [[Electrodes]].
- [ ] [[TransformerLens]] - good for [[Mechanistic Interpretability]] research in ai
- [ ] [[NEST]] - for REALLY big simulations - im talking about supercomputer level
- [ ] [[Nengo]] (maybe, I dont know if it is still relavent)
- [ ] NEURON - for super detailed biophysical models, not really my expertise so not high on list of priority

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
| 11   | Requests<br>    | HTTP for Humans             |                                                                 |
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
