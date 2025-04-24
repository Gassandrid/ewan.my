---
date: 2024-12-10
updated: 2025-04-24
title: code running test
password: testing
---

## Non Code Runner Vs Code Runner

Not runnable:

```python
print("hello world")
```

Runnable

```python-r
print("hello world")
```

---

## Workspace Remember Test

```python-r
x = 1
y = 2
def add(x,y):
	return x+y
```

```python-r
z = add(x,y)
print("we got " + z)
```

title test

```ts title="quartz.layout.ts"
console.log("hello")
```

matplotlib test m

```python-r
import matplotlib.pyplot as plt
import numpy as np

# Define the function f(x) and its derivative f'(x)
def f(x):
    return np.sin(x)  # Example of a function with a local max and min

def df(x):
    return np.cos(x)  # Derivative of sin(x)

# Create x values
x_vals = np.linspace(0, 2 * np.pi, 500)

# Points of local max and min (pi/2 and 3pi/2 for sin(x))
x_max = np.pi / 2
x_min = 3 * np.pi / 2
y_max = f(x_max)
y_min = f(x_min)

# Tangent lines at local max and min
tangent_max_x = np.linspace(x_max - 1, x_max + 1, 100)
tangent_max_y = df(x_max) * (tangent_max_x - x_max) + y_max

tangent_min_x = np.linspace(x_min - 1, x_min + 1, 100)
tangent_min_y = df(x_min) * (tangent_min_x - x_min) + y_min

# Create plot
plt.figure(figsize=(6, 6))
plt.plot(x_vals, f(x_vals), label=r'$f(x) = \sin(x)$', color='black')

# Plot points of local max and min
plt.scatter([x_max, x_min], [y_max, y_min], color='black', zorder=5)

# Plot tangent lines
plt.plot(tangent_max_x, tangent_max_y, color='red', linestyle='-', linewidth=2)
plt.plot(tangent_min_x, tangent_min_y, color='red', linestyle='-', linewidth=2)

# Add labels and title
plt.text(x_max + 0.1, y_max + 0.01, 'Local Max', fontsize=12)
plt.text(x_min + 0.1, y_min - 0.3, 'Local Min', fontsize=12)
plt.title(r'Demonstration of Local Max and Min of $f(x) = \sin(x)$')

# Add axes
plt.axhline(0, color='black',linewidth=0.5)
plt.axvline(0, color='black',linewidth=0.5)

# Show plot
plt.show()
```

## Pandas URL Stuff

```python-r
import pandas as pd
from pyodide.http import open_url

url = "https://gassandrid.xyz/datasets/housing.csv"

try:
    data = pd.read_csv(open_url(url))
    print(data.head())  # Print the first few rows to verify
except Exception as e:
    print(f"An error occurred: {e}")
```

---

## Animate and 3d Tests

3d:

```python-r
import matplotlib.pyplot as plt
import numpy as np
from mpl_toolkits.mplot3d import Axes3D

# Create grid
x = np.linspace(-5, 5, 100)
y = np.linspace(-5, 5, 100)
x, y = np.meshgrid(x, y)

# Bowl shape (z = x^2 + y^2)
z = x**2 + y**2

# Create figure
fig = plt.figure()
ax = fig.add_subplot(111, projection="3d")

# Plot contour map
contour = ax.contour(x, y, z, levels=[5, 10, 15, 20, 25], cmap="viridis", extend3d=True)
ax.clabel(contour, inline=True, fontsize=10)

# Set labels
ax.set_xlabel("X")
ax.set_ylabel("Y")
ax.set_zlabel("Z")

# Add title
ax.set_title("3D Contour Map of Bowl Shape")

# Show plot
plt.show()
```


3d + animated:

```python-r
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
from mpl_toolkits.mplot3d import Axes3D

# Set up the figure
fig = plt.figure(figsize=(10, 8))
ax = fig.add_subplot(111, projection='3d')

# Constants (in astronomical units)
AU = 149.6e6  # 1 AU in kilometers
EARTH_DISTANCE = 1.0  # Earth's distance from Sun (1 AU)
MARS_DISTANCE = 1.524  # Mars' distance from Sun (1.524 AU)

# Create orbit paths
theta = np.linspace(0, 2*np.pi, 1000)

# Earth's orbit
earth_x = EARTH_DISTANCE * np.cos(theta)
earth_y = EARTH_DISTANCE * np.sin(theta)
earth_z = np.zeros_like(theta)

# Mars' orbit
mars_x = MARS_DISTANCE * np.cos(theta)
mars_y = MARS_DISTANCE * np.sin(theta)
mars_z = np.zeros_like(theta)

# Plot the Sun
ax.scatter([0], [0], [0], color='yellow', s=300, label='Sun')

# Plot Earth's orbit
ax.plot(earth_x, earth_y, earth_z, color='blue', linestyle='dashed', alpha=0.7)

# Plot Mars's orbit
ax.plot(mars_x, mars_y, mars_z, color='red', linestyle='dashed', alpha=0.7)

# Starting positions (arbitrarily chosen for visualization)
earth_pos = np.radians(0)  # Earth starting position
mars_pos = np.radians(44)  # Mars at position for optimal transfer

# Plot Earth and Mars
earth = ax.scatter(
    EARTH_DISTANCE * np.cos(earth_pos),
    EARTH_DISTANCE * np.sin(earth_pos),
    0, color='blue', s=100, label='Earth'
)
mars = ax.scatter(
    MARS_DISTANCE * np.cos(mars_pos),
    MARS_DISTANCE * np.sin(mars_pos),
    0, color='red', s=80, label='Mars'
)

# Calculate transfer orbit (Hohmann transfer)
# Semi-major axis of the transfer orbit
a_transfer = (EARTH_DISTANCE + MARS_DISTANCE) / 2
# Eccentricity of the transfer orbit
ecc = (MARS_DISTANCE - EARTH_DISTANCE) / (MARS_DISTANCE + EARTH_DISTANCE)

# Create transfer orbit path
transfer_theta = np.linspace(0, np.pi, 1000)  # Half an ellipse
transfer_r = a_transfer * (1 - ecc**2) / (1 + ecc * np.cos(transfer_theta))
transfer_x = transfer_r * np.cos(transfer_theta)
transfer_y = transfer_r * np.sin(transfer_theta)
transfer_z = np.zeros_like(transfer_theta)

# Rotate the transfer orbit to match Earth's departure position
rotation_angle = earth_pos
rotation_matrix = np.array([
    [np.cos(rotation_angle), -np.sin(rotation_angle), 0],
    [np.sin(rotation_angle), np.cos(rotation_angle), 0],
    [0, 0, 1]
])

rotated_points = np.dot(rotation_matrix, np.vstack([transfer_x, transfer_y, transfer_z]))
transfer_x, transfer_y, transfer_z = rotated_points

# Plot transfer orbit
ax.plot(transfer_x, transfer_y, transfer_z, color='green', linewidth=2, label='Transfer Orbit')

# Calculate spacecraft trajectory points for animation
num_frames = 100
spacecraft_x = transfer_x[::10][:num_frames]  # Sample points along transfer orbit
spacecraft_y = transfer_y[::10][:num_frames]
spacecraft_z = transfer_z[::10][:num_frames]

# Initial spacecraft point
spacecraft = ax.scatter(
    spacecraft_x[0], spacecraft_y[0], spacecraft_z[0],
    color='white', edgecolor='black', s=80, label='Spacecraft'
)

# Trajectory line (will be updated during animation)
trajectory, = ax.plot([], [], [], color='green', linewidth=1, alpha=0.5)

# Set plot limits and labels
ax.set_xlim(-2, 2)
ax.set_ylim(-2, 2)
ax.set_zlim(-0.5, 0.5)
ax.set_xlabel('X (AU)')
ax.set_ylabel('Y (AU)')
ax.set_zlabel('Z (AU)')
ax.set_title('Earth to Mars Trajectory')

# Add legend
ax.legend(loc='upper right')

# Animation update function
def update(frame):
    # Update spacecraft position
    spacecraft._offsets3d = ([spacecraft_x[frame]], [spacecraft_y[frame]], [spacecraft_z[frame]])
    
    # Update trajectory line
    trajectory.set_data(spacecraft_x[:frame+1], spacecraft_y[:frame+1])
    trajectory.set_3d_properties(spacecraft_z[:frame+1])
    
    return spacecraft, trajectory

# Create animation
ani = FuncAnimation(fig, update, frames=num_frames, interval=50, blit=False)

# Add text indicating travel time
ax.text2D(0.05, 0.95, "Travel Time: ~9 months", transform=ax.transAxes)

plt.tight_layout()
plt.show()
```
