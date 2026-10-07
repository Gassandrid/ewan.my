import marimo

__generated_with = "0.24.0"
app = marimo.App(width="medium")


@app.cell(hide_code=True)
def imports():
    import marimo as mo
    import numpy as np
    import plotly.graph_objects as go
    from plotly.subplots import make_subplots

    return go, make_subplots, mo, np


@app.cell(hide_code=True)
def intro(mo):
    mo.md(r"""
    ## Continuous models

    Going from the slope to the next point with [[Eulers Method]]:

    $$\dot{\mathbf{x}}=f(t,\mathbf{x})\quad\Rightarrow\quad \mathbf{x}_{n+1}=\mathbf{x}_n+h f(t_n,\mathbf{x}_n).$$

    We calculate the slopes **before updating anything**. Otherwise the second equation would be using a different state from the first.

    ### Panda capture

    $W$ is wild, $D$ is domesticated. Birth rate $\mu$, death rate $\nu$, capture rate $\beta$:

    $$\begin{aligned}
    \dot W&=-\beta W-\nu_wW+\mu_wW\left(1-\frac{W}{K_w}\right),\\
    \dot D&=\beta W-\nu_dD+\mu_dD\left(1-\frac{D}{K_d}\right).
    \end{aligned}$$

    The $K$ terms limit reproduction. Capturing more pandas helps the zoo, but leaves fewer in the wild to reproduce. So there should be some capture rate between *none* and *everything* which does best.
    """)
    return


@app.cell(hide_code=True)
def panda_initialization(mo):
    from wigglystuff import TangleLatex

    panda_inputs = mo.ui.anywidget(TangleLatex(
        theme="light",
        latex=r"\begin{aligned}W_0 &= \tangle{w0}, & D_0 &= \tangle{d0} \\ K_w &= \tangle{kw}, & K_d &= \tangle{kd} \\ \mu_w &= \tangle{muw}, & \mu_d &= \tangle{mud} \\ \nu_w &= \tangle{nuw}, & \nu_d &= \tangle{nud}\end{aligned}",
        parameters={
            "w0": {"value": 1, "min_value": 0, "max_value": 200, "step": 1, "digits": 0},
            "d0": {"value": 0, "min_value": 0, "max_value": 100, "step": 1, "digits": 0},
            "kw": {"value": 100, "min_value": 1, "max_value": 300, "step": 1, "digits": 0},
            "kd": {"value": 25, "min_value": 1, "max_value": 100, "step": 1, "digits": 0},
            "muw": {"value": 1.0, "min_value": 0.01, "max_value": 2, "step": 0.01, "digits": 2},
            "mud": {"value": 0.1, "min_value": 0.01, "max_value": 2, "step": 0.01, "digits": 2},
            "nuw": {"value": 0.5, "min_value": 0, "max_value": 2, "step": 0.01, "digits": 2},
            "nud": {"value": 0.5, "min_value": 0, "max_value": 2, "step": 0.01, "digits": 2},
        },
    ))
    panda_inputs
    return (panda_inputs,)


@app.cell
def parameters(np, panda_inputs):
    W0 = panda_inputs.values["w0"]
    D0 = panda_inputs.values["d0"]
    K_w = panda_inputs.values["kw"]
    K_d = panda_inputs.values["kd"]
    mu_w = panda_inputs.values["muw"]
    mu_d = panda_inputs.values["mud"]
    nu_w = panda_inputs.values["nuw"]
    nu_d = panda_inputs.values["nud"]
    betas = np.arange(0.0, 1.0, 0.01)
    return D0, K_d, K_w, W0, betas, mu_d, mu_w, nu_d, nu_w


@app.cell(hide_code=True)
def controls(mo):
    step_size = mo.ui.dropdown(options=[0.005, 0.01, 0.02, 0.05, 0.1], value=0.01, label="Step h")
    horizon = mo.ui.slider(start=20, stop=200, step=20, value=100, label="Time T")
    capture_rate = mo.ui.slider(start=0, stop=1, step=0.01, value=0.25, label="Capture β")
    mo.hstack([step_size, horizon, capture_rate])
    return capture_rate, horizon, step_size


@app.cell
def euler(D0, K_d, K_w, W0, mu_d, mu_w, np, nu_d, nu_w):
    def panda_rhs(W, D, beta):
        dot_W = -beta * W - nu_w * W + mu_w * W * (1 - W / K_w)
        dot_D = beta * W - nu_d * D + mu_d * D * (1 - D / K_d)
        return dot_W, dot_D


    def euler_pandas(beta, h, T):
        steps = int(np.ceil(T / h))
        time = np.linspace(0.0, T, steps + 1)
        W = np.full(np.shape(beta), W0, dtype=float)
        D = np.full(np.shape(beta), D0, dtype=float)
        history = np.empty((steps + 1, 2) + np.shape(beta))
        history[0] = W, D
        for n, dt in enumerate(np.diff(time)):
            dot_W, dot_D = panda_rhs(W, D, beta)
            W, D = W + dt * dot_W, D + dt * dot_D
            history[n + 1] = W, D
        return time, history

    return euler_pandas, panda_rhs


@app.cell(hide_code=True)
def trajectory(capture_rate, euler_pandas, horizon, step_size):
    times, trajectory = euler_pandas(capture_rate.value, step_size.value, horizon.value)
    return times, trajectory


@app.cell(hide_code=True)
def sweep(
    K_d,
    K_w,
    betas,
    euler_pandas,
    horizon,
    mu_d,
    mu_w,
    np,
    nu_d,
    nu_w,
    panda_rhs,
    step_size,
):
    sweep_times, sweep = euler_pandas(betas, step_size.value, horizon.value)
    final_D = sweep[-1, 1]
    best_beta = float(betas[np.argmax(final_D)])
    beta_star = (mu_w - nu_w) / 2
    wild_equilibrium = K_w * np.maximum(0, 1 - (betas + nu_w) / mu_w)
    immigration = betas * wild_equilibrium
    domestic_equilibrium = ((mu_d - nu_d) + np.sqrt((mu_d - nu_d)**2 + 4 * mu_d * immigration / K_d)) / (2 * mu_d / K_d)
    residual = max(float(np.max(np.abs(v))) for v in panda_rhs(sweep[-1, 0], sweep[-1, 1], betas))
    return best_beta, beta_star, domestic_equilibrium, final_D


@app.cell(hide_code=True)
def plots(
    D0,
    K_d,
    K_w,
    W0,
    beta_star,
    betas,
    capture_rate,
    domestic_equilibrium,
    final_D,
    go,
    make_subplots,
    mu_d,
    mu_w,
    np,
    nu_d,
    nu_w,
    trajectory,
):
    _fig = make_subplots(rows=1, cols=2, subplot_titles=("Panda phase space", "Capture sweep"))
    _fig.add_trace(go.Scatter(x=trajectory[:,0],y=trajectory[:,1],name="Trajectory",line=dict(color="#56706b")),1,1)
    _fig.add_trace(go.Scatter(x=[W0],y=[D0],mode="markers",name="Initial state",marker=dict(symbol="diamond",size=8,color="#2d2520")),1,1)
    _w = np.linspace(0,K_w,200)
    _dnull = ((mu_d-nu_d)+np.sqrt((mu_d-nu_d)**2+4*mu_d*capture_rate.value*_w/K_d))/(2*mu_d/K_d)
    _fig.add_trace(go.Scatter(x=_w,y=_dnull,name="Ḋ = 0",line=dict(dash="dot",color="#a67c6d")),1,1)
    _wstar = K_w*(1-(capture_rate.value+nu_w)/mu_w)
    for _wline in [0,_wstar] if _wstar>0 else [0]:
        _fig.add_vline(x=_wline,line_dash="dash",line_color="#728c99",row=1,col=1)
    _fig.add_trace(go.Scatter(x=betas,y=final_D,name="Euler D(T)",line=dict(color="#56706b")),1,2)
    _fig.add_trace(go.Scatter(x=betas,y=domestic_equilibrium,name="D*",line=dict(dash="dash",color="#a67c6d")),1,2)
    _fig.add_vline(x=capture_rate.value,line_color="#2d2520",row=1,col=2)
    _fig.add_vline(x=beta_star,line_dash="dot",row=1,col=2)
    _fig.update_xaxes(title_text="Wild W",range=[0,K_w],row=1,col=1)
    _fig.update_yaxes(title_text="Domesticated D",row=1,col=1)
    _fig.update_xaxes(title_text="Capture β",row=1,col=2)
    _fig.update_yaxes(title_text="Domesticated D",row=1,col=2)
    _fig.update_layout(height=380,margin=dict(l=45,r=15,t=40,b=40),legend=dict(orientation="h",y=-.23),uirevision="pandas")
    _fig
    return


@app.cell(hide_code=True)
def result(best_beta, beta_star, mo):
    mo.md(f"""
    **Finite time vs fixed point:** the sweep peaks at β = {best_beta:.2f}; the prediction is {beta_star:.2f}. Increase T to see whether the curve has settled. Dashed vertical lines in the phase portrait are Ẇ = 0; the dotted curve is Ḋ = 0.
    """)
    return


@app.cell(hide_code=True)
def nullclines(mo):
    mo.md(r"""
    ### Where does the optimum come from?

    Setting $\dot W=0$ gives two solutions:

    $$W_1=0,\qquad W_2=K_w\left(1-\frac{\beta+\nu_w}{\mu_w}\right).$$

    $W_2$ only makes physical sense when $\beta<\mu_w-\nu_w$. The supply to the zoo is then

    $$J(\beta)=\beta W_2=\frac{K_w}{\mu_w}\beta(\mu_w-\nu_w-\beta).$$

    More supply gives a larger domestic fixed point. So we just maximize $J$:

    $$J'(\beta)=0\quad\Rightarrow\quad \beta^*=\frac{\mu_w-\nu_w}{2}=0.25.$$

    This assumes $\mu_w>\nu_w$ and that we can choose this capture rate. It is a long-term prediction; the best rate over a short interval can be different.
    """)
    return


@app.cell(hide_code=True)
def event_simulation_notes(mo):
    mo.md(r"""
    ## Event-time panda simulation

    Now the populations are integer counts. Each event changes them by one; time jumps by a random amount. For event rates \(a_j(W,D)\), let \(A=\sum_j a_j\). Then

    \[
    \tau \sim \operatorname{Exponential}(\text{rate }A),\qquad
    P(\text{next event}=j\mid W,D)=\frac{a_j}{A}.
    \]

    The exponential sampler takes **scale** \(1/A\), not \(A\). Store both event times and states because event index is no longer a time step. If \(A=0\), the state is absorbing.

    | Event | \(\Delta W\) | \(\Delta D\) | Rate |
    |---|---:|---:|---:|
    | Wild birth | +1 | 0 | \(\mu_w W\) |
    | Wild crowding death | −1 | 0 | \(\mu_w W^2/K_w\) |
    | Wild ordinary death | −1 | 0 | \(\nu_w W\) |
    | Capture | −1 | +1 | \(\beta W\) |
    | Domestic birth | 0 | +1 | \(\mu_d D\) |
    | Domestic crowding death | 0 | −1 | \(\mu_d D^2/K_d\) |
    | Domestic ordinary death | 0 | −1 | \(\nu_d D\) |

    The ODE's logistic term cannot be used as one birth rate: it becomes negative above \(K\). Splitting it into births and crowding deaths gives nonnegative event rates with the same conditional drift. This is **one** stochastic model consistent with the ODE, not a unique consequence of it. The total-clock and weighted-event procedure is Gillespie's [direct method](https://www.ma.imperial.ac.uk/~nsjones/gillespie_1977.pdf).
    """)
    return


@app.cell
def panda_jump_model(D0, K_d, K_w, W0, mu_d, mu_w, np, nu_d, nu_w):
    def panda_event_rates(W, D, beta):
        return (
            mu_w * W, mu_w * W * W / K_w, nu_w * W, beta * W,
            mu_d * D, mu_d * D * D / K_d, nu_d * D,
        )


    def simulate_panda_events(beta, T, seed):
        if W0 != round(W0) or D0 != round(D0):
            raise ValueError("Event simulation requires integer initial populations.")
        W, D = int(W0), int(D0)
        rng = np.random.default_rng(seed)
        t = 0.0
        event_times, wild, domestic = [t], [W], [D]
        while t < T:
            rates = panda_event_rates(W, D, beta)
            total = sum(rates)
            if total == 0:
                break
            next_t = t + rng.exponential(1 / total)
            if next_t > T:
                break
            draw = rng.random() * total
            for event, rate in enumerate(rates):
                draw -= rate
                if draw < 0:
                    break
            if event == 0:
                W += 1
            elif event in (1, 2):
                W -= 1
            elif event == 3:
                W, D = W - 1, D + 1
            elif event == 4:
                D += 1
            else:
                D -= 1
            t = next_t
            event_times.append(t)
            wild.append(W)
            domestic.append(D)
            if len(event_times) > 100_000:
                raise RuntimeError("Event limit reached; shorten T or reduce rates.")
        if event_times[-1] < T:
            event_times.append(float(T))
            wild.append(W)
            domestic.append(D)
        return np.array(event_times), np.array(wild), np.array(domestic)

    return (simulate_panda_events,)


@app.cell(hide_code=True)
def stochastic_seed_control(mo):
    stochastic_seed = mo.ui.slider(
        start=0, stop=99, step=1, value=7, label="Random seed", show_value=True
    )
    stochastic_seed
    return (stochastic_seed,)


@app.cell(hide_code=True)
def stochastic_paths(
    capture_rate,
    horizon,
    simulate_panda_events,
    stochastic_seed,
):
    panda_sample_paths = [
        simulate_panda_events(capture_rate.value, horizon.value, stochastic_seed.value + run)
        for run in range(6)
    ]
    return (panda_sample_paths,)


@app.cell(hide_code=True)
def stochastic_path_plot(go, panda_sample_paths, times, trajectory):
    _fig = go.Figure()
    for _run, (_t, _w, _d) in enumerate(panda_sample_paths):
        _fig.add_scatter(
            x=_t, y=_d, mode="lines", line_shape="hv",
            line=dict(color="#56706b", width=1.4), opacity=0.48,
            name="Event paths", showlegend=_run == 0,
        )
    _fig.add_scatter(
        x=times, y=trajectory[:, 1], mode="lines",
        line=dict(color="#bf6159", width=3), name="ODE (Euler)",
    )
    _fig.update_layout(
        height=350, xaxis_title="Time", yaxis_title="Domestic pandas D",
        margin=dict(l=45, r=15, t=15, b=40),
        legend=dict(orientation="h", y=-0.28), uirevision="panda-events",
    )
    _fig
    return


@app.cell(hide_code=True)
def stochastic_interpretation(horizon, mo, panda_sample_paths, trajectory):
    mo.md(fr"""
    The six paths use the same initial state and capture rate. At \(T={horizon.value:g}\), their zoo populations range from **{min(path[2][-1] for path in panda_sample_paths)}** to **{max(path[2][-1] for path in panda_sample_paths)}**; Euler gives **{trajectory[-1, 1]:.1f}**. These are simulated paths, not recorded panda counts.

    ### What should agree?

    The event model has \(\mathbb{{E}}[\Delta W\mid W,D]/\mathrm{{d}}t=\dot W\) and \(\mathbb{{E}}[\Delta D\mid W,D]/\mathrm{{d}}t=\dot D\). That matches the ODE's **conditional drift**. It does not imply that the ODE trajectory equals the average of stochastic runs: \(\mathbb{{E}}[W^2]\) generally differs from \(\mathbb{{E}}[W]^2\), and extinction is absorbing.

    The prediction \(\beta^*=0.25\) maximizes the deterministic long-run domestic fixed point for the original rates. A finite-time stochastic objective needs repeated runs at each \(\beta\).

    *Lecture source: Aletheia ASR, 2026-09-22 14:56–15:29 EDT; turn IDs 3379d1b5-fe6a-5564-b645-21d1b6805ff1:82f9a34e272833ee714aa66dc9793737bd2d35da4536733f20927bd3676e4d46:0 and 9c1205ec-1192-51ed-abf9-89177e34321d:b35472fedda1d16f118a327b31074d6fa5fad8cc79c980fe50bf3a4f26912bff:1. Words were not listening-verified.*
    """)
    return


@app.cell(hide_code=True)
def capture_sweep_notes(mo):
    mo.md(r"""
    ## Test the capture prediction

    Compare final zoo size \(D(T)\) at several capture rates while holding the initial state, horizon, and rate parameters fixed. The dots below are individual simulated outcomes; the line joins their sample means. The ODE curve is the deterministic calculation already shown above. With only eight runs per rate, the means are exploratory.
    """)
    return


@app.cell(hide_code=True)
def capture_sweep_control(mo):
    run_capture_sweep = mo.ui.run_button(label="Run stochastic β sweep")
    run_capture_sweep
    return (run_capture_sweep,)


@app.cell(hide_code=True)
def capture_sweep_simulation(
    horizon,
    mo,
    np,
    run_capture_sweep,
    simulate_panda_events,
    stochastic_seed,
):
    mo.stop(not run_capture_sweep.value, mo.md("Run the sweep to sample final zoo populations."))
    stochastic_betas = np.array([0.0, 0.1, 0.2, 0.25, 0.3, 0.4, 0.5])
    stochastic_final_D = np.array([
        [simulate_panda_events(float(beta), horizon.value, stochastic_seed.value + 1000 * j + run)[2][-1]
         for run in range(8)]
        for j, beta in enumerate(stochastic_betas)
    ])
    stochastic_mean_D = stochastic_final_D.mean(axis=1)
    return stochastic_betas, stochastic_final_D, stochastic_mean_D


@app.cell(hide_code=True)
def capture_sweep_plot(
    beta_star,
    betas,
    final_D,
    go,
    stochastic_betas,
    stochastic_final_D,
    stochastic_mean_D,
):
    _fig = go.Figure()
    for _j, _beta in enumerate(stochastic_betas):
        _fig.add_scatter(
            x=[_beta] * 8, y=stochastic_final_D[_j], mode="markers",
            marker=dict(color="#56706b", size=6, opacity=0.45),
            name="Individual runs", showlegend=_j == 0,
        )
    _fig.add_scatter(
        x=stochastic_betas, y=stochastic_mean_D, mode="lines+markers",
        line=dict(color="#56706b", width=2), name="Mean of 8 runs",
    )
    _fig.add_scatter(
        x=betas, y=final_D, mode="lines",
        line=dict(color="#bf6159", width=2), name="ODE D(T)",
    )
    _fig.add_vline(x=beta_star, line_dash="dash", line_color="#9a8f82")
    _fig.update_layout(
        height=350, xaxis_title="Capture rate β", yaxis_title="Domestic pandas at T",
        margin=dict(l=45, r=15, t=15, b=40),
        legend=dict(orientation="h", y=-0.28), uirevision="stochastic-beta-sweep",
    )
    _fig
    return


@app.cell(hide_code=True)
def capture_sweep_result(
    beta_star,
    mo,
    np,
    stochastic_betas,
    stochastic_mean_D,
):
    _peak = int(np.argmax(stochastic_mean_D))
    mo.md(f"""At these settings, the largest sampled mean is **{stochastic_mean_D[_peak]:.2f} pandas at β={stochastic_betas[_peak]:.2f}** (8 runs per rate). The deterministic long-run prediction is β*={beta_star:.2f}. This small finite-time sample does not establish a different optimum.""")
    return


@app.cell(hide_code=True)
def taylor_integration_notes(mo):
    mo.md(r"""
    ## Numerical integration from Taylor

    The ODE specifies a slope \(\dot{\mathbf{x}}=f(t,\mathbf{x})\). Over one step,

    \[
    \mathbf{x}(t+h)=\mathbf{x}(t)+h f(t,\mathbf{x}(t))
    +\frac{h^2}{2}\ddot{\mathbf{x}}(t)+O(h^3).
    \]

    Euler keeps the first slope and drops the curvature term, giving **local error** \(O(h^2)\) for a smooth solution. Over a fixed time interval, about \(T/h\) steps accumulate into **global error** \(O(h)\) under the usual stability assumptions. Reducing \(h\) improves this **ODE approximation**. It does not turn an ODE trajectory into a stochastic sample path or estimate extinction probability.

    Higher derivatives are not supplied directly by the model, though they can be derived from a smooth \(f\). Other integrators use extra evaluations of \(f\) to capture more of the curve within a step.

    *Lecture source: Aletheia ASR, 2026-09-22 15:39–15:43 EDT; turn IDs 8833aaa1-f440-5bce-8363-9fd3b14f64fd:a8815b127af63029065fda9b7b73586b3ce12c94613a70cbc690500d79c1edcd:0 and 735e750d-2825-5f28-a7ba-49160d101fe6:9ac2e9991864ea684307c05f3a733d07b4f76d21b64b1dcfdff77ee927f6ca03:0. Words were not listening-verified.*
    """)
    return


@app.cell(hide_code=True)
def sis_notes(mo):
    mo.md(r"""
    ## SIS: fixed points

    Resuming the [[sis_model|SIS model]], we have $S+I=N$, so there is only **one degree of freedom**:

    $$\dot I=\beta(N-I)I-\alpha I=I[\beta(N-I)-\alpha].$$

    For a continuous system, a [[Fixed Point Classification|fixed point]] satisfies $\dot I=0$. This gives

    $$I_1=0,\qquad I_2=N-\frac{\alpha}{\beta}\quad(\beta>0).$$

    The subscripts label the two solutions, **not time steps**. $I_1$ has no infection. At $I_2$, infection and recovery still happen, but their rates balance.

    ### Phase space

    Phase space is the space of possible states. We can draw $(S,I)$ on two axes, but the system is stuck on $S+I=N$, with $0\leq I\leq N$. The rest of the plane is not available to it.

    To remove redundant parameters, let $i=I/N$, $\tau=\alpha t$, and $R=\beta N/\alpha$ ($\alpha>0$):

    $$\frac{di}{d\tau}=i[R(1-i)-1],\qquad i_1=0,\quad i_2=1-\frac1R.$$

    The threshold is $R=1$, or $\beta_c=\alpha/N$. Change $R$ across 1 and compare the direction of motion with the fixed-point branches. Changing $i_0$ moves the starting point on the same phase-space line.
    """)
    return


@app.cell(hide_code=True)
def sis_controls(mo):
    sis_R = mo.ui.slider(start=0,stop=3,step=.05,value=1.5,label="R = βN/α",show_value=True)
    sis_initial = mo.ui.slider(start=0,stop=1,step=.01,value=.1,label="Initial infected fraction i₀",show_value=True)
    mo.hstack([sis_R,sis_initial])
    return sis_R, sis_initial


@app.cell
def sis_math(np, sis_R, sis_initial):
    def sis_rhs(i, R):
        return i * (R * (1-i) - 1)


    def sis_exact(t, i0, R):
        if i0 == 0:
            return np.zeros_like(t)
        a = R-1
        if abs(a)<1e-12:
            return i0/(1+i0*t)
        exp_at = np.exp(a*t)
        return i0*exp_at/(1+(R*i0/a)*np.expm1(a*t))

    sis_time = np.linspace(0,30,601)
    sis_path = sis_exact(sis_time,sis_initial.value,sis_R.value)
    sis_branch = None if sis_R.value == 0 else 1-1/sis_R.value
    sis_grid = np.linspace(0,1,201)
    sis_velocity = sis_rhs(sis_grid,sis_R.value)
    return sis_branch, sis_grid, sis_path, sis_rhs, sis_time, sis_velocity


@app.cell(hide_code=True)
def sis_geometry(
    go,
    make_subplots,
    np,
    sis_R,
    sis_branch,
    sis_grid,
    sis_initial,
    sis_path,
    sis_rhs,
    sis_velocity,
):
    _r=sis_R.value
    _i0=sis_initial.value
    _fig=make_subplots(rows=1,cols=3,subplot_titles=("Phase space", "Slope along the line", "Bifurcation diagram"))
    _fig.add_trace(go.Scatter(x=[1,0],y=[0,1],mode="lines",line=dict(color="#9a8f82"),showlegend=False),1,1)
    _fig.add_trace(go.Scatter(x=1-sis_path,y=sis_path,line=dict(color="#56706b",width=4),showlegend=False),1,1)
    _fig.add_trace(go.Scatter(x=[1-_i0],y=[_i0],mode="markers",marker=dict(symbol="diamond",size=10,color="#cc9e54"),name="Initial state"),1,1)
    for _i in np.linspace(.08,.92,8):
        _v=float(sis_rhs(_i,_r))
        if abs(_v)>1e-5:
            _d=.035*np.sign(_v)
            _fig.add_annotation(x=1-_i-_d,y=_i+_d,ax=1-_i+_d,ay=_i-_d,xref="x",yref="y",axref="x",ayref="y",showarrow=True,arrowhead=2,arrowcolor="#4a4238",row=1,col=1)
    _fig.add_trace(go.Scatter(x=sis_grid,y=sis_velocity,line=dict(color="#56706b"),showlegend=False),1,2)
    _fig.add_hline(y=0,line_color="#9a8f82",row=1,col=2)
    _fig.add_trace(go.Scatter(x=[_i0],y=[sis_rhs(_i0,_r)],mode="markers",marker=dict(symbol="diamond",size=9,color="#cc9e54"),showlegend=False),1,2)
    for _lo,_hi,_dash,_name in [(0,1,"solid","Attracting"),(1,3,"dash","Repelling")]:
        _rs=np.linspace(_lo,_hi,151)
        _fig.add_trace(go.Scatter(x=_rs,y=np.zeros_like(_rs),line=dict(color="#728c99",dash=_dash),name=_name),1,3)
    _rs=np.linspace(.25,1,151)
    _fig.add_trace(go.Scatter(x=_rs,y=1-1/_rs,line=dict(color="#a67c6d",dash="dash"),name="Nonphysical branch"),1,3)
    _rs=np.linspace(1,3,201)
    _fig.add_trace(go.Scatter(x=_rs,y=1-1/_rs,line=dict(color="#56706b"),name="Endemic branch"),1,3)
    _fig.add_hrect(y0=-1,y1=0,fillcolor="#e6dfd6",opacity=.45,line_width=0,row=1,col=3)
    _fig.add_vline(x=_r,line_color="#2d2520",row=1,col=3)
    for _p,_stable in [(0,_r<1)]+([(sis_branch,_r>1)] if sis_branch is not None else []):
        _symbol="circle" if _stable else "circle-open"
        if _r==1: _symbol="diamond"
        _fig.add_trace(go.Scatter(x=[_r],y=[_p],mode="markers",marker=dict(symbol=_symbol,size=10,color="#2d2520"),showlegend=False),1,3)
        if 0<=_p<=1:
            _fig.add_trace(go.Scatter(x=[1-_p],y=[_p],mode="markers",marker=dict(symbol=_symbol,size=11,color="#2d2520"),showlegend=False),1,1)
            _fig.add_trace(go.Scatter(x=[_p],y=[0],mode="markers",marker=dict(symbol=_symbol,size=10,color="#2d2520"),showlegend=False),1,2)
    _fig.update_xaxes(title_text="s = S/N",range=[-.05,1.05],row=1,col=1)
    _fig.update_yaxes(title_text="i = I/N",range=[-.05,1.05],scaleanchor="x",scaleratio=1,row=1,col=1)
    _fig.update_xaxes(title_text="i",range=[0,1],row=1,col=2)
    _fig.update_yaxes(title_text="di/dτ",range=[-1.05,.4],row=1,col=2)
    _fig.update_xaxes(title_text="R = βN/α",range=[0,3],row=1,col=3)
    _fig.update_yaxes(title_text="Fixed point i*",range=[-1,1],row=1,col=3)
    _fig.update_layout(height=380,margin=dict(l=45,r=15,t=40,b=40),legend=dict(orientation="h",y=-.25),uirevision="sis-geometry")
    _fig
    return


@app.cell(hide_code=True)
def sis_stability(mo):
    mo.md(r"""
    ### Bifurcation diagram

    A bifurcation diagram puts the **parameter** on one axis and the **fixed points** on the other. We are comparing different systems, rather than following one trajectory through time. Compare [[Logistic Map#Plotting Bifurcations]].

    For $g(i)=i[R(1-i)-1]$:

    $$g'(0)=R-1,\qquad g'(i_2)=1-R.$$

    - $R<1$: zero is [[Attracting fixed point|attracting]]. The other solution is negative, so it is outside the population model.
    - $R>1$: zero is [[Repelling fixed point|repelling]], and the positive solution attracts nearby states.
    - $R=1$: the branches meet. Here $i'=-i^2$, so positive initial states still approach zero, but only algebraically.

    This exchange of stability is a **transcritical bifurcation**. Solid branches attract; dashed branches repel. The diamond at the crossing marks the nonhyperbolic case. Starting *exactly* at zero stays there even above threshold.

    For flows the sign of $g'$ gives local stability. For the discrete maps in [[Fixed Point Classification]], the condition was $|f'|<1$. Related: [[Linearization and the Jacobian]].

    ### Why can't it oscillate?

    At any given $i$, an autonomous equation gives one value of $i'$. It cannot point right now and left later at the same point. Under uniqueness, a trajectory also cannot cross a fixed point. So this one-dimensional flow cannot have a nonconstant periodic orbit.

    Discrete maps can jump over fixed points. Two-dimensional flows can move around them and form a [[Limit Cycle]]. If a rate varies with time, as in the class's seasonal-birth example, time (or seasonal phase) is additional information needed to specify the dynamics.
    """)
    return


@app.cell(hide_code=True)
def euler_step(mo):
    euler_h = mo.ui.slider(start=.05,stop=2,step=.05,value=.5,label="Euler step Δτ",show_value=True)
    euler_h
    return (euler_h,)


@app.cell(hide_code=True)
def euler_comparison(
    euler_h,
    go,
    np,
    sis_R,
    sis_initial,
    sis_path,
    sis_rhs,
    sis_time,
):
    euler_times = np.arange(0,30+1e-9,euler_h.value)
    euler_values = np.full(len(euler_times),np.nan)
    euler_values[0] = sis_initial.value
    for _n in range(len(euler_times)-1):
        _next = euler_values[_n]+euler_h.value*sis_rhs(euler_values[_n],sis_R.value)
        if not np.isfinite(_next) or abs(_next)>1e6:
            break
        euler_values[_n+1]=_next
    _euler_fig=go.Figure()
    _euler_fig.add_scatter(x=sis_time,y=sis_path,name="Continuous solution",line=dict(color="#56706b"))
    _euler_fig.add_scatter(x=euler_times,y=euler_values,name="Euler steps",mode="lines+markers",line=dict(color="#bf6159"),marker=dict(size=4))
    _euler_fig.update_layout(height=310,xaxis_title="τ = αt",yaxis_title="Infected fraction i",margin=dict(l=45,r=15,t=15,b=40),uirevision="euler-check")
    _euler_fig.update_yaxes(range=[-.1,1.1])
    _euler_fig
    return


@app.cell(hide_code=True)
def euler_explanation(mo):
    mo.md(r"""
    Euler is itself a discrete map. Near an attracting fixed point its multiplier is $1+h g'(i^*)$, so numerical stability needs

    $$|1+h g'(i^*)|<1.$$

    Try $R=3$, $i_0=0.1$, and increase the step past $h=1$. The continuous solution still approaches its fixed point; Euler can oscillate or leave $[0,1]$. That behavior belongs to the approximation. Values are not clipped back into the population range.
    """)
    return


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""
    ##
    """)
    return


if __name__ == "__main__":
    app.run()
