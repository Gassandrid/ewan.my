## SIS model

Going from *discrete* to continuous models here.

```mermaid
flowchart LR
        S["S"] -->|infection| I["I"]
        I -->|recovery| S
```

$S$: susceptible. $I$: infectious. Recovery returns individuals to $S$, so the total population stays constant:

$$N=S+I \quad\Rightarrow\quad S=N-I.$$

### Discrete version

In one step, a susceptible individual becomes infected with probability $1-(1-\beta)^{I_t}$, assuming independent encounters. A fraction $\alpha$ of infectious individuals recovers.

$$\Delta I=\underbrace{S_t[1-(1-\beta)^{I_t}]}_{\text{new infections}}-\underbrace{\alpha I_t}_{\text{recoveries}}.$$

Substitute $S_t=N-I_t$:

$$\Delta I=I_{t+1}-I_t=(N-I_t)\left[1-(1-\beta)^{I_t}\right]-\alpha I_t.$$

### Taking the time step to zero

For a step of length $h$, use infection probability $\beta h$ and recovery probability $\alpha h$. Here $\alpha$ and $\beta$ are rates per unit time; choose $h$ small enough that both probabilities lie in $[0,1]$.

$$
\Delta I_h=I(t+h)-I(t)
=S\left[1-(1-\beta h)^I\right]-\alpha Ih,
$$

where $S=S(t)$ and $I=I(t)$. The change $\Delta I_h\to0$ as $h\to0^+$. For the **rate of change**, divide by $h$:

$$
\frac{dI}{dt}
=\lim_{h\to0^+}\frac{\Delta I_h}{h}
=\lim_{h\to0^+}\left[S\frac{1-(1-\beta h)^I}{h}-\alpha I\right].
$$

Holding $S$ and $I$ fixed in this limit,

$$
(1-\beta h)^I=1-I\beta h+O(h^2),
$$

which gives the continuous mean-field model:

$$
\frac{dI}{dt}=\beta SI-\alpha I
=\beta(N-I)I-\alpha I.
$$

## Taylor series

Expand $f$ around $x$ to describe its value a small distance $h$ away:

$$
f(x+h)=f(x)+f'(x)h+f''(x)\frac{h^2}{2!}+f'''(x)\frac{h^3}{3!}+\dots
$$

More compactly,

$$
f(x+h)=\sum_{n=0}^{\infty}\frac{f^{(n)}(x)}{n!}h^n.
$$

The infinite series equals $f(x+h)$ when $f$ is analytic and $h$ is within its radius of convergence. Here $f^{(n)}$ is the $n$th derivative, $f^{(0)}=f$, and $0!=1$.

Keeping only the constant and linear terms gives the first-order approximation:

$$f(x+h)\approx f(x)+f'(x)h.$$

### Applying Taylor to the infection probability

Let $f(h)=(1-\beta h)^I$, holding $I$ fixed. Expand around $h=0$:

$$
\begin{aligned}
f(0)&=1,\\
f'(h)&=-\beta I(1-\beta h)^{I-1},\\
f'(0)&=-\beta I.
\end{aligned}
$$

To first order,

$$
(1-\beta h)^I=f(0)+f'(0)h+O(h^2)
=1-\beta Ih+O(h^2).
$$

So the probability of infection becomes linear in $h$:

$$
\begin{aligned}
p(h)&=1-(1-\beta h)^I\\
&=\beta Ih+O(h^2)\approx\beta Ih.
\end{aligned}
$$

Multiplying by $S$ gives the expected new infections over the step:

$$Sp(h)\approx\beta SIh.$$

This goes to zero with $h$. Divide by $h$ to obtain the infection rate:

$$
\lim_{h\to0^+}S\frac{1-(1-\beta h)^I}{h}
=\lim_{h\to0^+}S\left[\beta I+O(h)\right]
=\beta SI.
$$

Including recovery,

$$\frac{dI}{dt}=\beta SI-\alpha I=\beta(N-I)I-\alpha I.$$

The approximation is linear in the time step $h$; the resulting SIS equation is still nonlinear in $I$.
