import numpy as np
import matplotlib.pyplot as plt

def rk2(f, tspan, x0, h):
    t0, tf = tspan
    N = int(np.floor((tf - t0) / h)) + 1
    t = np.linspace(t0, t0 + (N-1)*h, N)
    y = np.zeros((N, len(x0)))
    y[0] = x0
    for k in range(N - 1):
        s1 = f(t[k], y[k])
        s2 = f(t[k] + h, y[k] + h*s1)
        y[k+1] = y[k] + h*(s1 + s2)/2
    return t, y

def boxcount3(coords, maxstep, ax=None):
    mins = coords.min(axis=0) - 1e-8
    maxs = coords.max(axis=0) + 1e-8
    xs, ys = [], []
    for step in range(maxstep + 1):
        n = 2**step
        H, _ = np.histogramdd(
            coords, bins=(n, n, n),
            range=[(mins[0], maxs[0]), (mins[1], maxs[1]), (mins[2], maxs[2])]
        )
        nb = np.sum(H > 0)
        xs.append(step * np.log(2))
        ys.append(np.log(nb) if nb > 0 else 0)
    xs = np.array(xs); ys = np.array(ys)
    fit_lo, fit_hi = 1, 4
    A = np.vstack([xs[fit_lo:fit_hi+1], np.ones(fit_hi - fit_lo + 1)]).T
    slope, intercept = np.linalg.lstsq(A, ys[fit_lo:fit_hi+1], rcond=None)[0]
    if ax is not None:
        ax.plot(xs, ys, 'ko', label='data')
        xl = np.array([xs[0], xs[-1]])
        ax.plot(xl, slope*xl + intercept, 'r-', label=f'fit slope = {slope:.4f}')
        ax.axvspan(xs[fit_lo], xs[fit_hi], color='gray', alpha=0.15, label='fit range')
        ax.set_xlabel(r'$n \ln 2 = \ln(1/\epsilon) + \text{const}$')
        ax.set_ylabel(r'$\ln N(\epsilon)$')
        ax.set_title(f'bcd estimate = {slope:.4f}')
        ax.legend()
    return slope

# Lorenz params
sigma, r, b = 10.0, 28.0, 8.0/3.0
def lorenz(t, x):
    return np.array([
        sigma*(x[1] - x[0]),
        r*x[0] - x[1] - x[0]*x[2],
        x[0]*x[1] - b*x[2],
    ])

x0 = np.array([7.659416862050756, 7.659416862050771, 22.000000000000032])
t, y = rk2(lorenz, (0, 2000), x0, 0.005)

# drop transient
y = y[2000:]

fig = plt.figure(figsize=(13, 5.5))
ax1 = fig.add_subplot(1, 2, 1, projection='3d')
ax1.plot(y[:,0], y[:,1], y[:,2], 'k,', alpha=0.4)
ax1.set_xlabel('x'); ax1.set_ylabel('y'); ax1.set_zlabel('z')
ax1.set_title('Lorenz attractor')

ax2 = fig.add_subplot(1, 2, 2)
bcd = boxcount3(y, 9, ax=ax2)
print(f'bcd = {bcd:.4f}')

plt.tight_layout()
plt.savefig('lorenz_bcd.png', dpi=200)
