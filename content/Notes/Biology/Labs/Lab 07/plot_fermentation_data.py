import matplotlib.pyplot as plt
import numpy as np

# Time points (minutes)
time_points = [5, 10, 15, 20]

# 10% concentration data
initial_10 = {
    'A': [2.62, 2.66, 2.66, 2.65],
    'B': [2.64, 2.65, 2.66, 2.66],
    'C': [2.67, 2.65, 2.65, 2.66],
    'D': [2.66, 2.66, 2.65, 2.65]
}

post_10 = {
    'A': [2.61, 2.50, 2.54, 1.77],
    'B': [2.62, 2.50, 2.28, 2.36],
    'C': [2.68, 2.51, 2.47, 2.25],
    'D': [2.66, 2.49, None, 2.26]  # FAIL marked as None
}

# 2.5% concentration data
initial_2_5 = {
    'A': [2.62, 2.65, 2.65, 2.66],
    'B': [2.63, 2.63, 2.66, 2.64],
    'C': [2.67, 2.65, 2.63, 2.65],
    'D': [2.68, 2.64, 2.63, 2.66]
}

post_2_5 = {
    'A': [2.50, 2.12, 2.20, 2.09],
    'B': [2.48, 2.23, 2.15, 2.20],
    'C': [2.40, 2.46, 2.39, 2.02],
    'D': [2.39, 2.32, 2.17, 2.10]
}

# Calculate weight loss for each sample
def calculate_weight_loss(initial, post):
    weight_loss = {}
    for sample in initial:
        weight_loss[sample] = []
        for i in range(len(initial[sample])):
            if post[sample][i] is not None:
                loss = initial[sample][i] - post[sample][i]
                weight_loss[sample].append(loss)
            else:
                weight_loss[sample].append(None)
    return weight_loss

weight_loss_10 = calculate_weight_loss(initial_10, post_10)
weight_loss_2_5 = calculate_weight_loss(initial_2_5, post_2_5)

# Create figure with subplots
fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle('Fermentation Analysis - Weight Changes Over Time', fontsize=16, fontweight='bold')

# Plot 1: Weight Loss over time for 10%
ax1 = axes[0, 0]
for sample in ['A', 'B', 'C', 'D']:
    times = []
    losses = []
    for i, loss in enumerate(weight_loss_10[sample]):
        if loss is not None:
            times.append(time_points[i])
            losses.append(loss)
    ax1.plot(times, losses, marker='o', label=f'Sample {sample}', linewidth=2)

ax1.set_xlabel('Time (minutes)', fontsize=11)
ax1.set_ylabel('Weight Loss (g)', fontsize=11)
ax1.set_title('10% Concentration - Weight Loss', fontsize=12, fontweight='bold')
ax1.legend()
ax1.grid(True, alpha=0.3)

# Plot 2: Weight Loss over time for 2.5%
ax2 = axes[0, 1]
for sample in ['A', 'B', 'C', 'D']:
    ax2.plot(time_points, weight_loss_2_5[sample], marker='o', label=f'Sample {sample}', linewidth=2)

ax2.set_xlabel('Time (minutes)', fontsize=11)
ax2.set_ylabel('Weight Loss (g)', fontsize=11)
ax2.set_title('2.5% Concentration - Weight Loss', fontsize=12, fontweight='bold')
ax2.legend()
ax2.grid(True, alpha=0.3)

# Plot 3: Average weight loss comparison
ax3 = axes[1, 0]
avg_loss_10 = []
avg_loss_2_5 = []

for i in range(len(time_points)):
    # For 10%
    losses = [weight_loss_10[sample][i] for sample in ['A', 'B', 'C', 'D'] if weight_loss_10[sample][i] is not None]
    avg_loss_10.append(np.mean(losses) if losses else 0)

    # For 2.5%
    losses = [weight_loss_2_5[sample][i] for sample in ['A', 'B', 'C', 'D']]
    avg_loss_2_5.append(np.mean(losses))

ax3.plot(time_points, avg_loss_10, marker='s', label='10% Concentration', linewidth=2, markersize=8)
ax3.plot(time_points, avg_loss_2_5, marker='s', label='2.5% Concentration', linewidth=2, markersize=8)
ax3.set_xlabel('Time (minutes)', fontsize=11)
ax3.set_ylabel('Average Weight Loss (g)', fontsize=11)
ax3.set_title('Comparison of Average Weight Loss', fontsize=12, fontweight='bold')
ax3.legend()
ax3.grid(True, alpha=0.3)

# Plot 4: Post-bath weights comparison
ax4 = axes[1, 1]
x = np.arange(len(time_points))
width = 0.35

# Calculate average post-bath weights
avg_post_10 = []
avg_post_2_5 = []

for i in range(len(time_points)):
    # For 10%
    weights = [post_10[sample][i] for sample in ['A', 'B', 'C', 'D'] if post_10[sample][i] is not None]
    avg_post_10.append(np.mean(weights) if weights else 0)

    # For 2.5%
    weights = [post_2_5[sample][i] for sample in ['A', 'B', 'C', 'D']]
    avg_post_2_5.append(np.mean(weights))

bars1 = ax4.bar(x - width/2, avg_post_10, width, label='10% Concentration', alpha=0.8)
bars2 = ax4.bar(x + width/2, avg_post_2_5, width, label='2.5% Concentration', alpha=0.8)

ax4.set_xlabel('Time (minutes)', fontsize=11)
ax4.set_ylabel('Average Post-Bath Weight (g)', fontsize=11)
ax4.set_title('Average Post-Bath Weights', fontsize=12, fontweight='bold')
ax4.set_xticks(x)
ax4.set_xticklabels(time_points)
ax4.legend()
ax4.grid(True, alpha=0.3, axis='y')

plt.tight_layout()
plt.savefig('fermentation_analysis.png', dpi=300, bbox_inches='tight')
print("Graph saved as 'fermentation_analysis.png'")
plt.show()
