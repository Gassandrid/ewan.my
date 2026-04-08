import numpy as np
import matplotlib.pyplot as plt

def boxcount(coordmat, maxstep, ax=None):
    glob_llx = np.min(coordmat[:, 0])
    glob_lly = np.min(coordmat[:, 1])
    glob_urx = np.max(coordmat[:, 0])
    glob_ury = np.max(coordmat[:, 1])
    
    epsilon = 1e-8
    glob_llx -= epsilon
    glob_lly -= epsilon
    glob_urx += epsilon
    glob_ury += epsilon

    x_vals = []
    y_vals = []
    
    for step in range(maxstep + 1):
        n_sds = 2**step
        H, _, _ = np.histogram2d(coordmat[:, 0], coordmat[:, 1], bins=(n_sds, n_sds), 
                                 range=[[glob_llx, glob_urx], [glob_lly, glob_ury]])
        n_boxes = np.sum(H > 0)
        x_vals.append(step * np.log(2))
        y_vals.append(np.log(n_boxes) if n_boxes > 0 else 0)
        
    x_vals = np.array(x_vals)
    y_vals = np.array(y_vals)
    
    A = np.vstack([x_vals, np.ones(len(x_vals))]).T
    param, _, _, _ = np.linalg.lstsq(A, y_vals, rcond=None)
    frac_dim = param[0]
    
    if ax is not None:
        ax.plot(x_vals, y_vals, 'o')
        ax.plot([x_vals[0], x_vals[-1]], [param[0]*x_vals[0] + param[1], param[0]*x_vals[-1] + param[1]], '-')
        ax.set_title(f'Estimated fractal dimension = {frac_dim:.6f}')
        ax.set_xlabel('n*ln(2)')
        ax.set_ylabel('ln(n_boxes)')
        
    return frac_dim

# Koch
k = 6
mmax = 4**k
x = np.zeros(mmax + 1)
y = np.zeros(mmax + 1)
h = 3**(-k)
angle = [0, np.pi/3, -np.pi/3, 0]

for a in range(1, mmax + 1):
    m = a - 1
    ang = 0
    for b in range(1, k + 1):
        segment = m % 4
        m = m // 4
        ang += angle[segment]
    x[a] = x[a-1] + h * np.cos(ang)
    y[a] = y[a-1] + h * np.sin(ang)

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
axes[0].plot(x, y, 'b')
axes[0].set_aspect('equal')
axes[0].set_title('Koch Curve')

coordmat = np.column_stack((x, y))
frac_dim = boxcount(coordmat, 9, ax=axes[1])
plt.savefig('koch.png', dpi=300)
plt.close()
print(f"Koch dimension: {frac_dim}")

# Sierpinski
Nmax = 50000
A = np.array([0, 0])
B = np.array([4, 0])
C = np.array([2, 2*np.sqrt(3)])
P = np.zeros((Nmax + 1, 2))
scale = 0.5

for n in range(Nmax):
    r = np.random.rand()
    if r < 1/3:
        P[n+1] = P[n] + (A - P[n]) * scale
    elif r < 2/3:
        P[n+1] = P[n] + (B - P[n]) * scale
    else:
        P[n+1] = P[n] + (C - P[n]) * scale

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
axes[0].plot(P[:, 0], P[:, 1], '.', markersize=1)
axes[0].set_xlim(0, 4)
axes[0].set_ylim(0, 2*np.sqrt(3))
axes[0].set_aspect('equal')
axes[0].set_title('Sierpinski Triangle')

frac_dim = boxcount(P, 9, ax=axes[1])
plt.savefig('sierpinski.png', dpi=300)
plt.close()
print(f"Sierpinski dimension: {frac_dim}")

# Fern
N = 50000
P = np.zeros((N, 2))
P[0] = [0.5, 0.5]

def T(P, a, b, c, d, e, f):
    return np.array([a*P[0] + b*P[1] + c, d*P[0] + e*P[1] + f])

for k in range(N - 1):
    r = np.random.rand()
    if r < 0.05:
        P[k+1] = T(P[k], 0, 0, 0, 0, 0.2, 0)
    elif r < 0.86:
        P[k+1] = T(P[k], 0.85, 0.05, 0, -0.04, 0.85, 1.6)
    elif r < 0.93:
        P[k+1] = T(P[k], 0.2, -0.26, 0, 0.23, 0.22, 1.6)
    else:
        P[k+1] = T(P[k], -0.15, 0.28, 0, 0.26, 0.24, 0.44)

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
axes[0].plot(P[:, 0], P[:, 1], '.', markersize=1)
axes[0].set_xlim(-2.5, 3.5)
axes[0].set_ylim(0, 11)
axes[0].set_title('Barnsley Fern')

frac_dim = boxcount(P, 9, ax=axes[1])
plt.savefig('fern.png', dpi=300)
plt.close()
print(f"Fern dimension: {frac_dim}")
