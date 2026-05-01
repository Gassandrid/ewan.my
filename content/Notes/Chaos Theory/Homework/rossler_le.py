import numpy as np
import matplotlib.pyplot as plt

def stepit(func, x, p, h):
    s1 = func(x, p)
    s2 = func(x + h*s1/2, p)
    s3 = func(x + h*s2/2, p)
    s4 = func(x + h*s3, p)
    return x + h*(s1 + 2*s2 + 2*s3 + s4)/6

def rossler(x, p):
    a, b, c = p
    return np.array([-x[1] - x[2], x[0] + a*x[1], b + (x[0] - c)*x[2]])

def Df_rossler(x, p):
    a, b, c = p
    return np.array([[0.0, -1.0, -1.0],
                     [1.0,  a,    0.0],
                     [x[2], 0.0,  x[0] - c]])

def LEcalc_ode(f, Df, p, v0, N=1000, tstep=0.01):
    m = len(v0)
    LE = np.zeros(m)
    v = v0.copy()
    q = np.eye(m)
    # variational ODE: dDF1/dt = A DF1, where A = Df(v) held constant over unit interval
    def Jt(X, A): return A @ X
    steps_per_unit = int(round(1.0 / tstep))
    for i in range(N):
        DF1 = np.eye(m)
        for _ in range(steps_per_unit):
            A = Df(v, p)
            DF1 = stepit(Jt, DF1, A, tstep)
            v = stepit(f, v, p, tstep)
        Z = DF1 @ q
        q, r = np.linalg.qr(Z)
        LE += np.log(np.abs(np.diag(r))) / N
    return LE, v

# Rössler params
p = (0.1, 0.1, 14.0)

# burn in
v = np.array([1.0, 1.0, 1.0])
for _ in range(10**5):
    v = stepit(rossler, v, p, 0.01)

# integrate trajectory for attractor plot
T = 2000
dt = 0.01
traj = np.zeros((int(T/dt), 3))
traj[0] = v
for k in range(1, traj.shape[0]):
    traj[k] = stepit(rossler, traj[k-1], p, dt)

# compute LE
LE, _ = LEcalc_ode(rossler, Df_rossler, p, v.copy(), N=1000, tstep=0.01)
print('Lyapunov exponents:', LE)
print('sum:', LE.sum())
print('Lyapunov dim (Kaplan-Yorke):', 2 + LE[0]/abs(LE[2]) if (LE[0]+LE[1])>0 else 'n/a')

# plot
fig = plt.figure(figsize=(13, 5.5))
ax1 = fig.add_subplot(1, 2, 1, projection='3d')
ax1.plot(traj[:,0], traj[:,1], traj[:,2], 'k-', lw=0.3, alpha=0.6)
ax1.set_xlabel('x'); ax1.set_ylabel('y'); ax1.set_zlabel('z')
ax1.set_title(f'Rössler attractor  (a={p[0]}, b={p[1]}, c={p[2]})')

ax2 = fig.add_subplot(1, 2, 2)
ax2.bar(range(3), LE, color=['C3','C7','C0'])
ax2.axhline(0, color='k', lw=0.5)
for i, v_ in enumerate(LE):
    ax2.text(i, v_ + (0.3 if v_>=0 else -0.8), f'{v_:.4f}', ha='center')
ax2.set_xticks(range(3)); ax2.set_xticklabels([r'$\lambda_1$', r'$\lambda_2$', r'$\lambda_3$'])
ax2.set_ylabel('Lyapunov exponent')
ax2.set_title('Lyapunov spectrum')

plt.tight_layout()
plt.savefig('rossler_le.png', dpi=200)
