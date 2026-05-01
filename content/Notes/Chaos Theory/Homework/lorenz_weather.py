import numpy as np
import matplotlib.pyplot as plt

sigma, b = 10.0, 8.0/3.0

def max_re_eig(x, y, z, r):
    # x, y: (N,) arrays. z, r: scalars. return (N,) max real eigenvalue of Df.
    N = x.size
    J = np.zeros((N, 3, 3))
    J[:, 0, 0] = -sigma; J[:, 0, 1] = sigma
    J[:, 1, 0] = r - z;  J[:, 1, 1] = -1.0;  J[:, 1, 2] = -x
    J[:, 2, 0] = y;      J[:, 2, 1] = x;     J[:, 2, 2] = -b
    ev = np.linalg.eigvals(J)
    return ev.real.max(axis=1)

# grid
n = 400
xs = np.linspace(-25, 25, n)
ys = np.linspace(-25, 25, n)
XX, YY = np.meshgrid(xs, ys, indexing='xy')
xf = XX.ravel(); yf = YY.ravel()

rs = [12.0, 24.5, 28.0]
zs = [15.0, 25.0, 35.0]

# compute all 9 and use shared colorbar range
maps = {}
vmin, vmax = np.inf, -np.inf
for r in rs:
    for z in zs:
        j = max_re_eig(xf, yf, z, r).reshape(XX.shape)
        maps[(r, z)] = j
        vmin = min(vmin, j.min())
        vmax = max(vmax, j.max())
print(f'vmin={vmin:.3f} vmax={vmax:.3f}')

# symmetric color scaling around zero for readability
lim = max(abs(vmin), abs(vmax))

fig, axes = plt.subplots(3, 3, figsize=(13, 12), sharex=True, sharey=True)
for i, r in enumerate(rs):
    for k, z in enumerate(zs):
        ax = axes[i, k]
        j = maps[(r, z)]
        im = ax.pcolormesh(XX, YY, j, cmap='RdBu_r', vmin=-lim, vmax=lim, shading='auto')
        ax.contour(XX, YY, j, levels=[0.0], colors='k', linewidths=0.6)
        ax.set_title(f'$r={r}$,  $z={z}$')
        ax.set_aspect('equal')
        if i == 2: ax.set_xlabel('x')
        if k == 0: ax.set_ylabel('y')

fig.subplots_adjust(right=0.9)
cbar_ax = fig.add_axes([0.92, 0.15, 0.02, 0.7])
cbar = fig.colorbar(im, cax=cbar_ax)
cbar.set_label(r'$\max\,\mathrm{Re}\,\lambda(Df)$')
fig.suptitle('Lorenz local instability map: max real eigenvalue of Jacobian', fontsize=13)
plt.savefig('lorenz_weather.png', dpi=180, bbox_inches='tight')
print('saved')
