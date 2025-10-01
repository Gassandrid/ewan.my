---
date: 2025-01-04
updated: 2025-09-29
title: Python Libraries to Learn
tags:
  - cs/python
  - resource/programming
  - todo/programming
  - todo/neuro
  - todo/math
---

A lot of these I already know, but I thought it would be useful to have a list of not only libraries I need to learn, but their importance in doing so.

I know a lot of these libraries already, but I like writing down references anyway so.....

## Main Checklist for Reference Notes

**Math:**
- [ ] [[Numpy]]
- [ ] [[SciPy]]
- [ ] [[SymPy]]
- [ ] [[TransformerLens]] - good for [[Mechanistic Interpretability]] research in ai

**Stats:**
- [ ] [[Pandas]]
- [ ] [[MatPlotLib]]
- [ ] [[PyTorch]]
- [ ] [[Seaborn]]
- [ ] [[Plotly]]
- [ ] [[Scikit-Learn]]

**Comp Neuro:**
https://neuralensemble.org/
- [ ] [[Brian2]]
- [ ] [[Elephant]]
- [ ] [[NEST]]
- [ ] [[Nengo]] (maybe, I dont know if it is still relavent)

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

#### Math / Numerical Methods

| Library    | Why You Need It                                                                                                            |
| :--------- | :------------------------------------------------------------------------------------------------------------------------- |
| **NumPy**  | Obviously. Vectorized arrays, linear algebra, basic numerics.                                                              |
| **SciPy**  | Signal processing, integration, ODE solvers, optimization — _especially_ important for modeling neurons and systems.       |
| **SymPy**  | Symbolic math (algebra, calculus, solving equations symbolically). Useful for deriving equations before coding.            |
| **JAX**    | If you want **autograd** (automatic differentiation) and **insane speedups** with GPU/TPU acceleration for numerical work. |
| **mpmath** | Arbitrary-precision math. Helps if you need very high precision (rare but sometimes essential).                            |
| **CVXPY**  | Convex optimization modeling, if you’re solving optimization problems (important for fitting models, control theory, etc.) |

---

#### Data and Visualization

| Library                                       | Why You Need It                                                                                                                                   |
| :-------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Pandas**                                    | Essential for managing experimental data, behavioral recordings, trial logs, spike data, etc.                                                     |
| **Matplotlib** (with **mpl_toolkits** for 3D) | Standard, but flexible enough if you get good with it (not just basic plots).                                                                     |
| **Seaborn**                                   | Statistical data visualization built on top of matplotlib. Very clean for correlation matrices, kernel density plots, etc.                        |
| **Plotly**                                    | If you need **interactive** 2D/3D plots (like dragging around brain activity plots).                                                              |
| **h5py**                                      | Reading and writing `.h5` (HDF5) files. Essential when datasets get too big for CSVs and small formats.                                           |
| **scikit-learn**                              | Standard ML algorithms and preprocessing — **not for big models**, but awesome for exploratory data work (e.g., PCA, clustering neural activity). |
| **xarray**                                    | Multidimensional labeled arrays — great for managing very high-dimensional simulations, like time × space × neurons × trials.                     |
| **PyTables**                                  | Advanced handling of very large datasets stored in HDF5 format.                                                                                   |

---

## 🔥 Bonus (Power Tools You Might Not Know)

| Library                     | Why You Need It                                                                                              |
| :-------------------------- | :----------------------------------------------------------------------------------------------------------- |
|                             | Better package management than pip/conda for scientific projects.                                            |
| **Numba**                   | Just-in-time (JIT) compiler for speeding up inner loops that can't be vectorized.                            |
| **dask**                    | Parallelize data operations when your data doesn't fit in memory (and way easier than pure multiprocessing). |
| **NetworkX**                | Graph theory, essential if you're modeling brain connectivity as a network (very common).                    |
| **PyMC** / **ArviZ**        | Bayesian modeling, probabilistic programming. Crucial for uncertainty quantification.                        |
| **OpenAI Gym / PettingZoo** | If you later branch into neural control tasks, simulations of environments are here.                         |
| **Scikit-image**            | For analysis if you're working with microscopy or brain imaging data.                                        |
| **statsmodels**             | Advanced statistical tests and models, beyond what scikit-learn usually covers.                              |

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
