---
class:
  - note
tags:
  - math/calculus/differential
  - math/probability/stochastic
source:
  - https://en.wikipedia.org/wiki/Stochastic_differential_equation
related:
date: 2025-09-09
updated: 2025-12-14
---
A stochastic differential equation (SDE) is a differential equation in which one or more of the terms is a stochastic process, leading to a solution that is itself a stochastic process. SDEs are used to model systems that are influenced by random noise or uncertainty, such as financial markets, physical systems subject to thermal fluctuations, and biological processes. The formulation originates from [[Brownian Motion]] and [[Ito Calculus]]. For a while, it even had use in the early diffusion models like DDPM( [[Denoising Diffusion Probabilistic Models]] ).

They consist of both a deterministic component and a stochastic component. The deterministic part describes the average behavior of the system, while the stochastic part accounts for random fluctuations.

---

## General Form

A typical SDE can be written in the form:

$$
\frac{dX_t}{dt} = a(X_t, t) + b(X_t, t) \cdot \frac{dW_t}{dt}
$$

Where:

- $a(X_t, t)$ is the drift term, representing the deterministic part of the equation.
- $b(X_t, t)$ is the diffusion term, representing the intensity of the stochastic
- $\frac{dW_t}{dt}$ is the derivative of a Wiener process (or [[Brownian motion]]), representing the random noise.

---

## Python Implementation

This example simulates multiple paths of an Ornstein-Uhlenbeck process, a common type of SDE used in various fields such as finance and physics.[^1] The Ornstein-Uhlenbeck process is defined by the SDE:

```python-r
import numpy as np
import matplotlib.pyplot as plt

# Parameters for the Ornstein-Uhlenbeck process
# dX(t) = theta * (mu - X(t)) * dt + sigma * dW(t)
theta = 2.0    # mean reversion speed
mu = 0.0       # long-term mean
sigma = 1.0    # volatility
X0 = 2.0       # initial value

# Simulation parameters
T = 2.0        # total time
N = 1000       # number of time steps
dt = T / N     # time step size
n_paths = 10   # number of paths to simulate

# Time array
t = np.linspace(0, T, N + 1)

# Initialize array to store all paths
paths = np.zeros((n_paths, N + 1))
paths[:, 0] = X0  # set initial condition for all paths

# Generate random increments
np.random.seed(42)  # for reproducible results
dW = np.random.normal(0, np.sqrt(dt), (n_paths, N))

# Simulate the SDE using Euler-Maruyama method
for i in range(N):
    for path in range(n_paths):
        drift = theta * (mu - paths[path, i]) * dt
        diffusion = sigma * dW[path, i]
        paths[path, i + 1] = paths[path, i] + drift + diffusion

# Create the plot
plt.figure(figsize=(12, 8))

# Plot all paths
colors = plt.cm.tab10(np.linspace(0, 1, n_paths))
for i in range(n_paths):
    plt.plot(t, paths[i, :], color=colors[i], alpha=0.7, linewidth=1.5,
             label=f'Path {i+1}' if i < 5 else "")  # Only show first 5 in legend

# Add theoretical mean
theoretical_mean = mu + (X0 - mu) * np.exp(-theta * t)
plt.plot(t, theoretical_mean, 'k--', linewidth=2, alpha=0.8,
         label='Theoretical Mean')

# Formatting
plt.xlabel('Time (t)', fontsize=12)
plt.ylabel('X(t)', fontsize=12)
plt.title(f'Ornstein-Uhlenbeck Process: {n_paths} Stochastic Paths\n' +
          f'dX(t) = {theta}(μ - X(t))dt + {sigma}dW(t), X(0) = {X0}',
          fontsize=14)
plt.grid(True, alpha=0.3)
plt.legend(loc='upper right')

# Add statistics text box
mean_final = np.mean(paths[:, -1])
std_final = np.std(paths[:, -1])
textstr = f'Final values:\nMean: {mean_final:.3f}\nStd: {std_final:.3f}\nTheoretical mean: {mu:.3f}'
props = dict(boxstyle='round', facecolor='wheat', alpha=0.5)
plt.text(0.02, 0.98, textstr, transform=plt.gca().transAxes, fontsize=10,
         verticalalignment='top', bbox=props)

plt.tight_layout()
plt.show()

# Print some statistics
print(f"Simulation completed with {n_paths} paths over time [0, {T}]")
print(f"Initial value: {X0}")
print(f"Final mean: {mean_final:.4f}")
print(f"Final standard deviation: {std_final:.4f}")
print(f"Theoretical long-term mean: {mu}")
print(f"Mean reversion parameter θ: {theta}")
print(f"Volatility σ: {sigma}")
```

[^1]: <https://en.wikipedia.org/wiki/Stochastic_differential_equation>
