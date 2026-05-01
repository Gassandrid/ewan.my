import numpy as np
import matplotlib.pyplot as plt
import time

sigma, b = 10.0, 8.0/3.0
dt = 0.005

def rhs(x, r):
    # x: (..., 3). r: scalar or array broadcastable to x[...,0]
    x0 = x[..., 0]; x1 = x[..., 1]; x2 = x[..., 2]
    return np.stack([
        sigma*(x1 - x0),
        r*x0 - x1 - x0*x2,
        x0*x1 - b*x2,
    ], axis=-1)

def rk4(x, r, dt):
    k1 = rhs(x, r)
    k2 = rhs(x + dt*k1/2, r)
    k3 = rhs(x + dt*k2/2, r)
    k4 = rhs(x + dt*k3, r)
    return x + dt*(k1 + 2*k2 + 2*k3 + k4)/6

# ----- Fig 9.3: successive z-maxima at r = 28 -----
r = 28.0
x = np.array([1.0, 1.0, 20.0])
# burn-in
for _ in range(int(50/dt)):
    x = rk4(x, r, dt)

T = 1500.0
N = int(T/dt)
z_prev2 = x[2]; x = rk4(x, r, dt); z_prev1 = x[2]
zmax = []
for k in range(N):
    x = rk4(x, r, dt)
    z = x[2]
    if z_prev1 > z_prev2 and z_prev1 > z:
        zmax.append(z_prev1)
    z_prev2 = z_prev1
    z_prev1 = z
zmax = np.array(zmax)
print(f'fig 9.3: {len(zmax)} maxima')

fig, ax = plt.subplots(figsize=(6, 6))
ax.plot(zmax[:-1], zmax[1:], 'k,')
lo, hi = 28, 50
ax.plot([lo, hi], [lo, hi], 'gray', lw=0.5, alpha=0.6)
ax.set_xlim(lo, hi); ax.set_ylim(lo, hi)
ax.set_aspect('equal')
ax.set_xlabel(r'$z_n$'); ax.set_ylabel(r'$z_{n+1}$')
ax.set_title(r'Lorenz $z$-maximum return map, $r=28$')
plt.tight_layout()
plt.savefig('lorenz_tent.png', dpi=200)
plt.close()

# ----- Fig 9.4: bifurcation diagram over r ∈ [25, 325] -----
t0 = time.time()
r_grid = np.arange(25.0, 325.0 + 1e-9, 0.5)
M = len(r_grid)
print(f'bifurcation: {M} r-values')

# vectorized integration
X = np.tile([1.0, 1.0, 20.0], (M, 1)).astype(float)
# transient
for _ in range(int(80/dt)):
    X = rk4(X, r_grid, dt)
    bad = ~np.isfinite(X).all(axis=1)
    if bad.any():
        X[bad] = [1.0, 1.0, 20.0]

# collect z-maxima
T_run = 80.0
n_run = int(T_run/dt)
z_prev2 = X[:, 2].copy()
X = rk4(X, r_grid, dt)
z_prev1 = X[:, 2].copy()
rs_list, zs_list = [], []
for k in range(n_run):
    X = rk4(X, r_grid, dt)
    z = X[:, 2]
    mask = (z_prev1 > z_prev2) & (z_prev1 > z) & np.isfinite(z_prev1)
    if mask.any():
        rs_list.append(r_grid[mask])
        zs_list.append(z_prev1[mask])
    z_prev2 = z_prev1
    z_prev1 = z.copy()

rs = np.concatenate(rs_list)
zs = np.concatenate(zs_list)
print(f'  {len(rs)} max points, {time.time()-t0:.1f}s')

fig, ax = plt.subplots(figsize=(11, 6))
ax.plot(rs, zs, 'k,', alpha=0.5)
ax.set_xlim(25, 325); ax.set_ylim(0, 400)
ax.set_xlabel(r'$r$'); ax.set_ylabel(r'$z$ local max')
ax.set_title('Lorenz bifurcation diagram: $z$-maxima vs $r$')
plt.tight_layout()
plt.savefig('lorenz_bif.png', dpi=200)
plt.close()
