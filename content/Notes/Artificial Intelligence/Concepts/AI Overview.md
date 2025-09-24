---
date: 2024-09-12
updated: 2025-09-22
class:
  - navigation
tags:
  - cs/ai
  - generated
  - junk
---

>[!Warning] Important
>A **very** old overview of the starting point for my [[Machine Learning]] work. This was before I had a large graph network, and wanted to introduce structure to the notes. For more modern notes, they can be found more organically litered throughout the [[Artificial Intelligence]] directory

## Neurons

- **Structure of a [[Artificial Neuron]]**
    - Inputs, Weights, Biases, Activation Functions
- **[[Activation Functions]]**
    - Role of activation functions
    - Common types: Sigmoid, ReLU, Tanh, Softmax, etc.
- **Learning Process**
    - How neurons learn (weight adjustments)
    - [[Gradient Descent]] and backpropagation (coming soon)

## Architecture

- **Layers of a Neural Network**
    - Input layer, Hidden layers, Output layer
- **Types of Layers**
    - Fully connected (Dense) layers
    - Convolutional layers (for CNNs)
    - Recurrent layers (for RNNs)
- **Choosing the Number of Layers and Neurons**
    - How to decide the depth and width of your network

I have also layed out the workflow for how to design a model to fit a certain task/dataset in [[Network Modeling Workflow]]

## Loss Functions

- **[[Loss Functions]]**
    - Purpose and types: MSE, Cross-Entropy, Hinge, Huber
- **Optimization Algorithms**
    - Gradient Descent (SGD, Mini-batch, etc.)
    - Advanced optimizers: Adam, RMSprop, Adagrad
- **Regularization Techniques**
    - Preventing overfitting: L1/L2 regularization, Dropout, etc.

## Training

- **Forward Propagation**
    - How inputs are processed through the network
- **Backward Propagation**
    - Calculating gradients and updating weights
- **Training Cycles**
    - Epochs, Batches, and Iterations
- **Evaluation Metrics**
    - Accuracy, Precision, Recall, F1 Score, etc.

## Data Processing

- **Dataset Collection**
    - Finding and curating datasets
- **Data Preprocessing**
    - Normalization, Standardization, Handling missing data
- **Data Augmentation**
    - Techniques to artificially increase dataset size (especially in image processing)

## Model Eval

- **Cross-Validation**
    - Ensuring generalization with techniques like k-fold cross-validation
- **Hyperparameter Tuning**
    - Tuning learning rate, batch size, number of epochs, etc.
    - Grid Search, Random Search, Bayesian Optimization
- **Model Evaluation**
    - Testing on unseen data
    - Analyzing confusion matrix and other metrics

## Generative Modeling

- [[Variational Autoencoder]]
	- Changes the task of a neural network from predicting some exact output parameters to preciting a probability distribution, and then randomly sampling from said distribution.
- [[Boltzmann Machine]]
- [[Diffusion]]
