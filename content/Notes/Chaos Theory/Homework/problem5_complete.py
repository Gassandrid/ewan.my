import numpy as np
import matplotlib.pyplot as plt

def henon_bifurcation(coord="x", amin=0.0, amax=2.0, b=-0.3, N=10**3, da=10**-3):
    x = np.zeros(N + 1)
    y = np.zeros(N + 1)
    a_vals, coord_vals = [], []

    for a in np.arange(amin, amax + da/2, da):
        x[0], y[0] = 0.0, 2.0

        for i in range(N):
            x[i+1] = a - x[i]**2 + b*y[i]
            y[i+1] = x[i]

        # detect period
        data = x if coord == "x" else y
        p = 9
        for j in range(10):
            if np.abs(data[-1] - data[-1 - 2**j]) < 1e-5:
                p = j
                break

        pts = data[-2**p:]
        coord_vals.extend(pts)
        a_vals.extend([a] * len(pts))

    return a_vals, coord_vals

def detect_period(a, b=-0.3, N=15000):
    x = np.zeros(N + 1)
    y = np.zeros(N + 1)
    x[0], y[0] = 0.0, 2.0

    for i in range(N):
        x[i+1] = a - x[i]**2 + b*y[i]
        y[i+1] = x[i]

    for power in range(8):
        p = 2**power
        if p > N // 4:
            break
        matches = sum(abs(x[-1-i] - x[-1-i-p]) < 1e-5 for i in range(min(p*2, 100)))
        if matches / min(p*2, 100) > 0.9:
            return p
    return -1

# part (a): x vs y coordinates
a_x, x_vals = henon_bifurcation(coord="x")
plt.figure(figsize=(10, 8))
plt.scatter(a_x, x_vals, c="k", s=1, marker=".")
plt.xlabel("parameter a", fontsize=20)
plt.ylabel("x", fontsize=20)
plt.title("Bifurcation Diagram: x-coordinate", fontsize=16)
plt.ylim([-0.5, 2])
plt.xlim([0, 2])
plt.tight_layout()
plt.savefig("part_a_x_coordinate.png", dpi=300)
plt.close()

a_y, y_vals = henon_bifurcation(coord="y")
plt.figure(figsize=(10, 8))
plt.scatter(a_y, y_vals, c="k", s=1, marker=".")
plt.xlabel("parameter a", fontsize=20)
plt.ylabel("y", fontsize=20)
plt.title("Bifurcation Diagram: y-coordinate", fontsize=16)
plt.ylim([-0.5, 2])
plt.xlim([0, 2])
plt.tight_layout()
plt.savefig("part_a_y_coordinate.png", dpi=300)
plt.close()

# part (b): zoom
a_zoom, x_zoom = henon_bifurcation(coord="x", amin=1.925, amax=1.975, N=10**4, da=10**-4)
plt.figure(figsize=(12, 8))
plt.scatter(a_zoom, x_zoom, c="k", s=0.5, marker=".")
plt.xlabel("parameter a", fontsize=20)
plt.ylabel("x", fontsize=20)
plt.title("Zoomed Bifurcation Diagram: a ∈ [1.925, 1.975]", fontsize=16)
plt.xlim([1.925, 1.975])
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig("part_b_zoom.png", dpi=300)
plt.close()

# part (c): feigenbaum constant
periods = [(a, detect_period(a)) for a in np.linspace(1.0, 1.5, 2000)]
bifurcations = []
for i in range(1, len(periods)):
    if periods[i-1][1] > 0 and periods[i][1] > 0:
        if periods[i][1] == 2 * periods[i-1][1]:
            bifurcations.append((periods[i-1][1], periods[i][0]))

if bifurcations:
    print(f"found {len(bifurcations)} bifurcations:")
    for p, a in bifurcations:
        print(f"  period {p} → {2*p} at a ≈ {a:.6f}")

if len(bifurcations) >= 3:
    print("\nfeigenbaum estimates:")
    for i in range(len(bifurcations) - 2):
        a1, a2, a3 = bifurcations[i][1], bifurcations[i+1][1], bifurcations[i+2][1]
        if abs(a3 - a2) > 1e-8:
            print(f"  δ_{i+1} ≈ {(a2 - a1) / (a3 - a2):.6f}")
