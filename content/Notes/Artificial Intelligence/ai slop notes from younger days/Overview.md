---
date: 2024-09-12
updated: 2026-10-01T14:59:49-04:00
---

### 1. **Understanding Neural Networks**

- **Introduction to Neural Networks**
    - What are neural networks?
    - Basic components and architecture
    - Types of neural networks (Feedforward, [Convolutional](Convolutions.md), Recurrent, etc.)
- **Biological Inspiration**
    - How neural networks are inspired by the human brain
    - Similarities and differences

### 2. **Neurons: The Building Blocks**

- **Structure of a [[Artificial Neuron]]**
    - Inputs, Weights, Biases, Activation Functions
- **[[Activation Functions]]**
    - Role of activation functions
    - Common types: Sigmoid, ReLU, Tanh, Softmax, etc.
- **Learning Process**
    - How neurons learn (weight adjustments)
    - [[Gradient Descent]] and backpropagation (coming soon)

### 3. **Designing The Architecture**

- **Layers of a Neural Network**
    - Input layer, Hidden layers, Output layer
- **Types of Layers**
    - Fully connected (Dense) layers
    - Convolutional layers (for CNNs)
    - Recurrent layers (for RNNs)
- **Choosing the Number of Layers and Neurons**
    - How to decide the depth and width of your network

I have also layed out the workflow for how to design a model to fit a certain task/dataset in [[Network Modeling Workflow]]

### 4. **Loss Functions and Optimization**

- **[[Loss Functions]]**
    - Purpose and types: MSE, Cross-Entropy, Hinge, Huber
- **Optimization Algorithms**
    - Gradient Descent (SGD, Mini-batch, etc.)
    - Advanced optimizers: Adam, RMSprop, Adagrad
- **Regularization Techniques**
    - Preventing overfitting: L1/L2 regularization, Dropout, etc.

### 5. **Training The Neural Network**

- **Forward Propagation**
    - How inputs are processed through the network
- **Backward Propagation**
    - Calculating gradients and updating weights
- **Training Cycles**
    - Epochs, Batches, and Iterations
- **Evaluation Metrics**
    - Accuracy, Precision, Recall, F1 Score, etc.

### 6. **Data Preparation**

- **Dataset Collection**
    - Finding and curating datasets
- **Data Preprocessing**
    - Normalization, Standardization, Handling missing data
- **Data Augmentation**
    - Techniques to artificially increase dataset size (especially in image processing)

### 7. **Model Evaluation and Tuning**

- [[Cross Validation]]
    - Ensuring generalization with techniques like k-fold cross-validation
- [[Hyperparameter Tuning]]
    - Tuning learning rate, batch size, number of epochs, etc.
    - Grid Search, Random Search, Bayesian Optimization
- **Generative Models**
    - [[Generative Adversarial Network]], [[Variational Autoencoder]], and other generative approaches
- **Neural Network Interpretability**
