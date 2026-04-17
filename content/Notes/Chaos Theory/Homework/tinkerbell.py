import numpy as np
import matplotlib.pyplot as plt

def tinkerbell(x, y, c1, c2, c3, c4):
    return x**2 - y**2 + c1*x + c2*y, 2*x*y + c3*x + c4*y

def orbit(c1, c2, c3, c4, x0=0.1, y0=0.1, N=100000, transient=1000):
    xs = np.zeros(N)
    ys = np.zeros(N)
    xs[0], ys[0] = x0, y0
    for i in range(1, N):
        xs[i], ys[i] = tinkerbell(xs[i-1], ys[i-1], c1, c2, c3, c4)
        if xs[i]**2 + ys[i]**2 > 1e6:
            return xs[:i], ys[:i], transient
    return xs, ys, transient

# Base parameters
c1, c2, c3 = -0.3, -0.6, 2.0

# Main plot: default c4=0.5 plus variations
c4_vals = [0.3, 0.4, 0.5, 0.6, 0.7, 0.8]
fig, axes = plt.subplots(2, 3, figsize=(15, 10))

for idx, c4 in enumerate(c4_vals):
    ax = axes[idx // 3][idx % 3]
    xs, ys, t = orbit(c1, c2, c3, c4)
    ax.plot(xs[t:], ys[t:], 'k.', markersize=0.1)
    ax.set_title(f'$c_4 = {c4}$', fontsize=14)
    ax.set_aspect('equal')
    ax.set_xlabel('x')
    ax.set_ylabel('y')

plt.suptitle('Tinkerbell Map Orbits', fontsize=16)
plt.tight_layout()
plt.savefig('/Users/gassandrid/VAULT/Notes/Chaos Theory/Homework/tinkerbell_c4_sweep.png', dpi=300)
plt.close()
print("Saved c4 sweep")

# Also make a clean plot of just the default c4=0.5
fig, ax = plt.subplots(1, 1, figsize=(8, 8))
xs, ys, t = orbit(c1, c2, c3, 0.5)
ax.plot(xs[t:], ys[t:], 'k.', markersize=0.2)
ax.set_title('Tinkerbell Map, $c_4 = 0.5$ (quasiperiodic)', fontsize=14)
ax.set_aspect('equal')
ax.set_xlabel('x')
ax.set_ylabel('y')
plt.tight_layout()
plt.savefig('/Users/gassandrid/VAULT/Notes/Chaos Theory/Homework/tinkerbell_default.png', dpi=300)
plt.close()
print("Saved default")
