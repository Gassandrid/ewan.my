import numpy as np
import matplotlib.pyplot as plt
import time

r = 28.0
sigmas = np.arange(0.0, 60.0 + 1e-9, 0.1)
bs     = np.arange(0.0, 10.0 + 1e-9, 0.1)
S, B = np.meshgrid(sigmas, bs, indexing='ij')
shape = S.shape
sigma_f = S.ravel()
b_f     = B.ravel()
M = len(sigma_f)
print(f'grid: {shape}  M={M}')

rng = np.random.default_rng(0)
x = np.tile(np.array([1.0, 1.0, 20.0]), (M, 1)) + 0.1*rng.standard_normal((M, 3))
w = rng.standard_normal((M, 3))
w /= np.linalg.norm(w, axis=1, keepdims=True)

def rhs(x, sig, bb):
    dx = sig*(x[:,1] - x[:,0])
    dy = r*x[:,0] - x[:,1] - x[:,0]*x[:,2]
    dz = x[:,0]*x[:,1] - bb*x[:,2]
    return np.stack([dx, dy, dz], axis=1)

def Jw(x, w, sig, bb):
    dw0 = -sig*w[:,0] + sig*w[:,1]
    dw1 = (r - x[:,2])*w[:,0] - w[:,1] - x[:,0]*w[:,2]
    dw2 = x[:,1]*w[:,0] + x[:,0]*w[:,1] - bb*w[:,2]
    return np.stack([dw0, dw1, dw2], axis=1)

def rk4_state(x, sig, bb, dt):
    k1 = rhs(x, sig, bb)
    k2 = rhs(x + dt*k1/2, sig, bb)
    k3 = rhs(x + dt*k2/2, sig, bb)
    k4 = rhs(x + dt*k3, sig, bb)
    return x + dt*(k1 + 2*k2 + 2*k3 + k4)/6

def rk4_both(x, w, sig, bb, dt):
    k1x = rhs(x, sig, bb);             k1w = Jw(x, w, sig, bb)
    xh  = x + dt*k1x/2;                wh  = w + dt*k1w/2
    k2x = rhs(xh, sig, bb);            k2w = Jw(xh, wh, sig, bb)
    xh  = x + dt*k2x/2;                wh  = w + dt*k2w/2
    k3x = rhs(xh, sig, bb);            k3w = Jw(xh, wh, sig, bb)
    xh  = x + dt*k3x;                  wh  = w + dt*k3w
    k4x = rhs(xh, sig, bb);            k4w = Jw(xh, wh, sig, bb)
    xn = x + dt*(k1x + 2*k2x + 2*k3x + k4x)/6
    wn = w + dt*(k1w + 2*k2w + 2*k3w + k4w)/6
    return xn, wn

dt = 0.01
T_trans = 15.0
T_run   = 25.0
n_trans_steps = int(round(T_trans/dt))
n_intervals   = int(round(T_run))
steps_per     = int(round(1.0/dt))

t0 = time.time()
for _ in range(n_trans_steps):
    x = rk4_state(x, sigma_f, b_f, dt)
    # guard against blow-up at extreme parameters
    bad = ~np.isfinite(x).all(axis=1)
    if bad.any():
        x[bad] = 0.0
print(f'transient done {time.time()-t0:.1f}s')

w = rng.standard_normal((M, 3))
w /= np.linalg.norm(w, axis=1, keepdims=True)

log_growth = np.zeros(M)
total_time = 0.0
for i in range(n_intervals):
    for _ in range(steps_per):
        x, w = rk4_both(x, w, sigma_f, b_f, dt)
    nrm = np.linalg.norm(w, axis=1)
    nrm = np.where(np.isfinite(nrm) & (nrm > 0), nrm, 1.0)
    log_growth += np.log(nrm)
    w = w / nrm[:, None]
    # sanitize nonfinite states
    bad = ~(np.isfinite(x).all(axis=1) & np.isfinite(w).all(axis=1))
    if bad.any():
        x[bad] = 0.0
        w[bad] = np.array([1.0, 0.0, 0.0])
    total_time += 1.0
    if (i+1) % 5 == 0:
        print(f'  interval {i+1}/{n_intervals}  t={time.time()-t0:.1f}s')

lle = log_growth / total_time
lle_map = lle.reshape(shape)

# save for plotting
np.savez('lle_map.npz', lle=lle_map, sigmas=sigmas, bs=bs)

fig, ax = plt.subplots(figsize=(10, 6))
clip = np.clip(lle_map, -2.0, 2.0)
im = ax.pcolormesh(S, B, clip, cmap='RdBu_r', shading='auto', vmin=-2, vmax=2)
ax.contour(S, B, lle_map, levels=[0.0], colors='k', linewidths=0.8)
ax.set_xlabel(r'$\sigma$')
ax.set_ylabel(r'$b$')
ax.set_title(r'Largest Lyapunov exponent, Lorenz (r=28) over $(\sigma, b)$')
cbar = plt.colorbar(im, ax=ax)
cbar.set_label(r'$\lambda_{\max}$ (clipped to $[-2, 2]$)')
plt.tight_layout()
plt.savefig('lorenz_le_map.png', dpi=180)
print('done', time.time()-t0, 's')
