import numpy as np
import matplotlib.pyplot as plt

# ── Gram-Schmidt QR method for Lyapunov exponents (Section 5.2) ──
# At each step: apply Jacobian to orthonormal basis, Gram-Schmidt,
# record log of norms before normalizing.

def lyapunov_exponents(f, Df, x0, n_iter=100000, transient=1000):
    """Compute Lyapunov exponents for a 2D map via QR method."""
    m = len(x0)
    x = np.array(x0, dtype=float)
    W = np.eye(m)  # orthonormal basis
    log_sums = np.zeros(m)

    for k in range(n_iter + transient):
        J = Df(x)
        x = f(x)

        # apply Jacobian to each basis vector: Z = J @ W
        Z = J @ W

        # Gram-Schmidt orthogonalization
        Y = np.zeros_like(Z)
        for i in range(m):
            Y[:, i] = Z[:, i]
            for j in range(i):
                Y[:, i] -= (Z[:, i] @ Y[:, j]) / (Y[:, j] @ Y[:, j]) * Y[:, j]

        # record norms and normalize (after transient)
        norms = np.linalg.norm(Y, axis=0)
        if k >= transient:
            log_sums += np.log(norms)
        W = Y / norms

    return log_sums / n_iter


# ── Map definitions ──

# Hénon: f(x,y) = (1 - a*x^2 + y, b*x)
def henon_f(v, a=1.4, b=0.3):
    return np.array([1 - a*v[0]**2 + v[1], b*v[0]])

def henon_Df(v, a=1.4, b=0.3):
    return np.array([[-2*a*v[0], 1.0], [b, 0.0]])

# Ikeda: F(x,y) = (R + C2*(x*cos(tau) - y*sin(tau)), C2*(x*sin(tau) + y*cos(tau)))
# tau = C1 - C3/(1 + x^2 + y^2)
def ikeda_f(v, R=1, C1=0.4, C2=0.9, C3=6):
    x, y = v
    tau = C1 - C3 / (1 + x**2 + y**2)
    ct, st = np.cos(tau), np.sin(tau)
    return np.array([R + C2*(x*ct - y*st), C2*(x*st + y*ct)])

def ikeda_Df(v, R=1, C1=0.4, C2=0.9, C3=6):
    x, y = v
    r2 = 1 + x**2 + y**2
    tau = C1 - C3 / r2
    ct, st = np.cos(tau), np.sin(tau)
    dtdx = 2*C3*x / r2**2
    dtdy = 2*C3*y / r2**2
    u = x*ct - y*st
    w = x*st + y*ct
    return np.array([
        [C2*(ct - w*dtdx), C2*(-st - w*dtdy)],
        [C2*(st + u*dtdx), C2*(ct + u*dtdy)]
    ])

# Tinkerbell: f(x,y) = (x^2 - y^2 + c1*x + c2*y, 2xy + c3*x + c4*y)
def make_tinkerbell(c1, c2, c3, c4):
    def f(v):
        x, y = v
        return np.array([x**2 - y**2 + c1*x + c2*y, 2*x*y + c3*x + c4*y])
    def Df(v):
        x, y = v
        return np.array([[2*x + c1, -2*y + c2], [2*y + c3, 2*x + c4]])
    return f, Df


# ── Verification: Hénon and Ikeda ──

print("=== Hénon map (a=1.4, b=0.3) ===")
print("  Text values: h1 = 0.42, h2 = -1.62")
h = lyapunov_exponents(henon_f, henon_Df, [0.1, 0.1])
print(f"  Computed:    h1 = {h[0]:.4f}, h2 = {h[1]:.4f}")

print("\n=== Ikeda map (R=1, C1=0.4, C2=0.9, C3=6) ===")
print("  Text values: h1 = 0.51, h2 = -0.72")
h = lyapunov_exponents(ikeda_f, ikeda_Df, [0.1, 0.1])
print(f"  Computed:    h1 = {h[0]:.4f}, h2 = {h[1]:.4f}")


# ── Tinkerbell: quasiperiodic (c1=-0.3, c4=0.5) ──

print("\n=== Tinkerbell quasiperiodic (c1=-0.3, c4=0.5) ===")
f, Df = make_tinkerbell(-0.3, -0.6, 2.0, 0.5)
h = lyapunov_exponents(f, Df, [0.1, 0.1])
print(f"  Computed:    h1 = {h[0]:.4f}, h2 = {h[1]:.4f}")
print(f"  (one should be ≈ 0)")


# ── Tinkerbell: chaotic (c1=0.9, c4=0.5) ──

print("\n=== Tinkerbell chaotic (c1=0.9, c4=0.5) ===")
f_chaos, Df_chaos = make_tinkerbell(0.9, -0.6, 2.0, 0.5)
h = lyapunov_exponents(f_chaos, Df_chaos, [0.1, 0.1])
print(f"  Computed:    h1 = {h[0]:.4f}, h2 = {h[1]:.4f}")

# Plot the chaotic Tinkerbell orbit
N = 200000
xs = np.zeros(N); ys = np.zeros(N)
xs[0], ys[0] = 0.1, 0.1
for i in range(1, N):
    v = f_chaos(np.array([xs[i-1], ys[i-1]]))
    xs[i], ys[i] = v
    if xs[i]**2 + ys[i]**2 > 1e8:
        N = i; break

t = 1000
fig, ax = plt.subplots(1, 1, figsize=(8, 8))
ax.plot(xs[t:N], ys[t:N], 'k.', markersize=0.1)
ax.set_title('Tinkerbell Map, $c_1 = 0.9$ (chaotic)', fontsize=14)
ax.set_aspect('equal')
ax.set_xlabel('x'); ax.set_ylabel('y')
plt.tight_layout()
plt.savefig('/Users/gassandrid/VAULT/Notes/Chaos Theory/Homework/tinkerbell_chaotic.png', dpi=300)
plt.close()
print("\nSaved tinkerbell_chaotic.png")
