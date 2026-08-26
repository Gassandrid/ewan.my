import numpy as np
import matplotlib.pyplot as plt

def julia_inverse_iteration(a, b, k=20):
    """Approximate Julia set of f(z) = z^2 + c via inverse iteration.
    c = a + bi. Backward map: z -> +-sqrt(z - c), randomly choosing sign."""
    niter = 2**k
    x = np.zeros(niter + 1)
    y = np.zeros(niter + 1)

    # IC: fixed point z = 0.5 + sqrt(0.25 - c)
    c = complex(a, b)
    z0 = 0.5 + np.sqrt(0.25 - c)
    x[0] = z0.real
    y[0] = z0.imag

    for n in range(niter):
        x1, y1 = x[n], y[n]
        # compute sqrt(z - c) manually
        u = np.sqrt((x1 - a)**2 + (y1 - b)**2) / 2
        v = (x1 - a) / 2
        u1 = np.sqrt(max(u + v, 0))
        v1 = np.sqrt(max(u - v, 0))
        x[n+1] = u1
        y[n+1] = v1
        if y[n] < b:
            y[n+1] = -y[n+1]
        if np.random.random() < 0.5:  # flip coin for +/- branch
            x[n+1] = -u1
            y[n+1] = -y[n+1]

    return x, y


# problem 5: four Julia sets
c_values = [(-0.5, 0.3), (0, 1), (-1, 0), (0, 1.1)]
labels = [r'$c = -0.5 + 0.3i$', r'$c = i$', r'$c = -1$', r'$c = 1.1i$']

fig, axes = plt.subplots(2, 2, figsize=(12, 12))
for idx, ((a, b), label) in enumerate(zip(c_values, labels)):
    row, col = divmod(idx, 2)
    ax = axes[row][col]
    x, y = julia_inverse_iteration(a, b)
    skip = 1000  # discard transient
    ax.plot(x[skip:], y[skip:], 'k.', markersize=0.3)
    ax.set_xlim(-1.6, 1.6)
    ax.set_ylim(-1.6, 1.6)
    ax.set_aspect('equal')
    ax.set_xlabel('Re(z)', fontsize=14)
    ax.set_ylabel('Im(z)', fontsize=14)
    ax.set_title(label, fontsize=16)

plt.tight_layout()
plt.savefig('julia_sets.png', dpi=300)
plt.close()

# part (b): check critical orbit boundedness for each c
print("Critical orbit of 0 under z -> z^2 + c:")
for (a, b), label in zip(c_values, labels):
    c = complex(a, b)
    z = 0 + 0j
    escaped = False
    for i in range(100):
        z = z**2 + c
        if abs(z) > 2:
            print(f"  {label}: escapes at iterate {i+1}, |z| = {abs(z):.3f}")
            escaped = True
            break
    if not escaped:
        print(f"  {label}: bounded after 100 iterates, z = {z:.4f}")

# part (c): find attracting orbits
print("\nAttracting bounded orbits:")
for (a, b), label in zip(c_values, labels):
    c = complex(a, b)
    z = 0.01 + 0.01j  # near-critical start
    for _ in range(1000):
        z = z**2 + c
        if abs(z) > 10:
            print(f"  {label}: no attracting bounded orbit (escapes)")
            break
    else:
        # check period
        orbit = [z]
        for _ in range(20):
            z = z**2 + c
            orbit.append(z)
        for p in range(1, 10):
            if abs(orbit[-1] - orbit[-1-p]) < 1e-8:
                cycle = orbit[-(p+1):-1]
                print(f"  {label}: attracting period-{p} orbit at {[f'{z:.4f}' for z in cycle]}")
                break
