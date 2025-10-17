import matplotlib.pyplot as plt
import numpy as np

solutions = ["Control", "Test"]
averages = [0.37126984, 0]
std_deviations = [0.300347032, 0]

fig, ax = plt.subplots(figsize=(8, 6))

bars = ax.bar(
    solutions,
    averages,
    yerr=std_deviations,
    capsize=10,
    color=["#2E8B57", "#DC143C"],
    alpha=0.7,
    ecolor="black",
)

ax.set_xlabel("Solution Type", fontsize=12, fontweight="bold")
ax.set_ylabel("Average Proportion of Paramecium", fontsize=12, fontweight="bold")
ax.set_ylim(0, max(averages) + max(std_deviations) + 0.1)

ax.grid(axis="y", alpha=0.3, linestyle="--")
ax.set_axisbelow(True)

ax.spines["top"].set_visible(False)
ax.spines["right"].set_visible(False)
ax.tick_params(axis="both", which="major", labelsize=10)

plt.tight_layout()

# download file
plt.savefig("paramecium_bar_chart.png", dpi=300)
