---
class:
  - note
tags:
  - cs/ai/training/hyperparameter
source:
related:
  - "[[Network Modeling Workflow]]"
  - "[[Hyperparameter Tuning]]"
author:
description: How to pick the depth and width of a network's hidden layers, and why there is no formula for it.
aliases:
  - Hidden Layer Size
  - Choosing Hidden Layers
  - Network Width and Depth
date: 2024-09-12
updated: 2026-11-19T19:40:11-05:00
---
- there's no formula for how many layers or [[Artificial Neuron|neurons]] a [[Neural Networks|network]] needs; treat depth and width as hyperparameters and search, judged on held out data
	- too small underfits; too big used to mean overfitting, but heavily overparameterized nets often generalize *better* with good regularization ( [[Double Descent]], [[But what is grokking?|grokking]] )
- rules of thumb, just starting points
	- start with 1-2 hidden layers and grow only if validation loss says so
	- width somewhere between input and output size, or 1-2x the number of features
	- prefer a bigger net with regularization over a carefully tiny one
- how to actually choose: [[Hyperparameter Tuning]]
	- [[Cross Validation]] ( k-fold, or leave one out for tiny data ) for a less noisy estimate of generalization
	- grid search is wasteful; random search does better because only a few hyperparameters matter ( Bergstra & Bengio 2012 )
	- [[Bayesian Optimization]] fits a model of score vs hyperparameters and picks the next try, e.g. [[Optuna]]
	- neural architecture search automates the whole thing at large compute cost
	- [[Activation Functions|activation]] choice matters less than size; [[ReLU]] is the default
- regularization so the big net doesn't memorize
	- L1/L2 weight penalties in the [[Loss Functions|loss]], dropout, early stopping on validation loss
	- [[Batch Normalization]] stabilizes training of deeper stacks
- after training, pruning often removes most weights with little accuracy loss, more evidence that the "right" size is mostly about trainability, not capacity
- the workflow i used around this: [[Network Modeling Workflow]]
