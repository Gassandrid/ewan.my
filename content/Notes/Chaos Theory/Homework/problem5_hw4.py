import numpy as np
import matplotlib.pyplot as plt

def henon(a, b, x0, y0, N):
    x, y = np.zeros(N + 1), np.zeros(N + 1)
    x[0], y[0] = x0, y0
    for i in range(N):
        x[i + 1] = a - x[i]**2 + b * y[i]
        y[i + 1] = x[i]
    return x, y

def detect_period(x, max_period=256, tol=1e-6):
    for p in range(1, max_period + 1):
        n_check = min(2 * p, 200)
        matches = sum(abs(x[-1 - i] - x[-1 - i - p]) < tol for i in range(n_check))
        if matches / n_check > 0.95:
            return p
    return -1

b = 0.4
x0, y0 = 0.0, 0.0

# --- Figure 2.17: 6 panels ---
panels = [
    (0.9,    "period 4 sink"),
    (0.988,  "period 16 sink"),
    (1.0,    "four-piece attractor"),
    (1.0293, "period 10 sink"),
    (1.045,  "two-piece attractor"),
    (1.2,    "one-piece attractor"),
]

fig, axes = plt.subplots(3, 2, figsize=(10, 12))
labels = "abcdef"

for idx, (a, desc) in enumerate(panels):
    row, col = divmod(idx, 2)
    ax = axes[row][col]

    # chaotic attractors need more iterates and plot many points
    if a in (1.0, 1.045, 1.2):
        N = 10**5
        transient = 50000
        x_h, y_h = henon(a, b, x0, y0, N)
        ax.plot(x_h[transient:], y_h[transient:], 'k.', markersize=0.3)
    else:
        N = 10**4
        x_h, y_h = henon(a, b, x0, y0, N)
        p = detect_period(x_h)
        lag = max(5 * p, 50) if p > 0 else 200
        ax.plot(x_h[-lag:], y_h[-lag:], 'k+', markersize=8)

    ax.set_xlim(-2.5, 2.5)
    ax.set_ylim(-2.5, 2.5)
    ax.set_xlabel('x', fontsize=14)
    ax.set_ylabel('y', fontsize=14)
    ax.set_title(f'({labels[idx]}) a = {a}, {desc}', fontsize=11)

plt.tight_layout()
plt.savefig('fig_2_17_recreation.png', dpi=300)
plt.close()
print("Saved fig_2_17_recreation.png")

# --- Period > 16: period-32 at a = 0.99 ---
x3, y3 = henon(0.99, b, x0, y0, 10**5)
p3 = detect_period(x3, max_period=128)
print(f"Period > 16 orbit: a = 0.99, detected period = {p3}")

plt.figure(figsize=(8, 6))
plt.plot(x3[-5*p3:], y3[-5*p3:], 'k+', markersize=10)
plt.xlabel('x', fontsize=20)
plt.ylabel('y', fontsize=20)
plt.title(f'Period-{p3} orbit: a = 0.99, b = 0.4', fontsize=16)
plt.xlim(-2.5, 2.5)
plt.ylim(-2.5, 2.5)
plt.tight_layout()
plt.savefig('period_gt16_orbit.png', dpi=300)
plt.close()
print("Saved period_gt16_orbit.png")
