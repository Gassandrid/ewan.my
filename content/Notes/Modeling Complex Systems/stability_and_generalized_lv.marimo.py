# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "marimo==0.24.2", "numpy==2.4.6", "scipy==1.17.1",
#   "plotly==7.0.0", "wigglystuff==0.5.32", "anywidget==0.11.0",
# ]
# ///

import marimo

__generated_with = "0.24.2"
app = marimo.App(width="medium")


@app.cell(hide_code=True)
def imports():
    import marimo as mo
    import numpy as np
    import plotly.graph_objects as go
    from plotly.subplots import make_subplots
    from scipy.integrate import solve_ivp
    from scipy.linalg import expm
    from scipy.signal import find_peaks
    from wigglystuff import TangleLatex

    return TangleLatex, expm, find_peaks, go, make_subplots, mo, np, solve_ivp


@app.cell(hide_code=True)
def vault_markdown(mo):
    import re
    from urllib.parse import urlencode

    vault_link_paths = {'Andronov Hopf Bifurcation': 'Notes/Chaos Theory/Andronov Hopf Bifurcation.md', 'Eulers Method': 'Notes/Selfstudy Mathematics/Differential/Numerical Approx Methods/Eulers Method.md', 'Finite-Time Lyapunov Exponent': 'Notes/Chaos Theory/Finite-Time Lyapunov Exponent.md', 'Fixed Point Classification': 'Notes/Chaos Theory/Fixed Point Classification.md', 'Limit Cycle': 'Notes/Chaos Theory/Limit Cycle.md', 'Linearization and the Jacobian': 'Notes/Chaos Theory/Linearization and the Jacobian.md', 'Local Lyapunov Exponent': 'Notes/Chaos Theory/Local Lyapunov Exponent.md', 'Logistic Map': 'Notes/Selfstudy Mathematics/Logistic Map.md', 'Lyapunov Exponents': 'Notes/Chaos Theory/Lyapunov Exponents.md', 'Saddle fixed point': 'Notes/Chaos Theory/Saddle fixed point.md', 'Sensitive Dependence on Initial Conditions': 'Notes/Chaos Theory/Sensitive Dependence on Initial Conditions.md', 'Sinks, Sources, and Saddles': 'Notes/Chaos Theory/Sinks, Sources, and Saddles.md', 'Stable and Unstable Manifolds': 'Notes/Chaos Theory/Stable and Unstable Manifolds.md', 'continuous_models.marimo': 'Notes/Modeling Complex Systems/continuous_models.marimo.py', 'lotka_volterra.marimo': 'Notes/Modeling Complex Systems/lotka_volterra.marimo.py'}

    def note_md(text):
        """Keep wiki notation in source; render usable Obsidian links in standalone marimo."""
        def replace_link(match):
            target, _, label = match.group(1).partition('|')
            path = vault_link_paths.get(target)
            if path is None:
                return match.group(0)
            url = 'obsidian://open?' + urlencode({'vault':'VAULT','file':path})
            return f'[{label or target}]({url})'
        text = re.sub(r'\[\[([^\]]+)\]\]', replace_link, text)
        # Display math needs standalone delimiters; preserve inline single-dollar math.
        text = re.sub(r'\$\$(.*?)\$\$', lambda m: '\n\n$$\n'+m.group(1).strip()+'\n$$\n\n', text, flags=re.S)
        return mo.md(text)


    return (note_md,)


@app.cell(hide_code=True)
def heading(note_md):
    note_md(r"""
    ## Stability and generalized Lotka–Volterra

    September 24 · [[continuous_models.marimo|Continuous models]] · [[lotka_volterra.marimo|Lotka–Volterra]]
    """)
    return


@app.cell(hide_code=True)
def presentation(TangleLatex, mo):
    # Theme snapshot compiled from EWAN_THEME_DIR/theme.json (ewan-default v1).
    # The dotfiles theme remains the authority; no local theme configuration is required.
    colors = {'light': '#f5f1eb', 'lightgray': '#e6dfd6', 'gray': '#9a8f82', 'darkgray': '#4a4238', 'dark': '#2d2520', 'secondary': '#a67c6d', 'tertiary': '#8b7f73', 'rust': '#bf6159', 'clay': '#c78d75', 'ochre': '#cc9e54', 'sage': '#869c7a', 'pine': '#56706b', 'slate': '#728c99', 'mauve': '#9d868e'}
    species_colors = [colors['slate'], colors['rust'], colors['pine']]
    def style(fig, height=380):
        fig.update_layout(template='plotly_white', height=height,
            paper_bgcolor=colors['light'], plot_bgcolor=colors['light'],
            font=dict(family='PP Neue Montreal, Arial, sans-serif',color=colors['dark']),
            colorway=species_colors, margin=dict(l=55,r=25,t=45,b=50),
            legend=dict(orientation='h', y=1.13), hovermode='closest')
        fig.update_xaxes(gridcolor=colors['lightgray'], zerolinecolor=colors['gray'])
        fig.update_yaxes(gridcolor=colors['lightgray'], zerolinecolor=colors['gray'])
        return fig

    def tangle(latex, parameters):
        return mo.ui.anywidget(TangleLatex(latex=latex, parameters=parameters, theme='light'))

    def parameter(value, low, high, step=0.1, digits=2):
        return dict(value=value,min_value=low,max_value=high,step=step,digits=digits)

    return colors, parameter, species_colors, style, tangle


@app.cell(hide_code=True)
def flow_map_bridge(note_md):
    note_md(r"""
    [[Linearization and the Jacobian]] describes local dynamics through the derivative at a fixed point. For a discrete map $x_{n+1}=g(x_n)$, a fixed point satisfies $g(x^*)=x^*$ and a small perturbation evolves by $\eta_{n+1}\approx Dg(x^*)\eta_n$. For a flow $\dot x=f(x)$, the fixed-point condition is $f(x^*)=0$ and the corresponding linear system is $\dot\eta=J(x^*)\eta$. Same local approximation, different stability condition: a map contracts when all $\lvert\lambda(Dg)\rvert<1$; a flow is asymptotically stable when all $\operatorname{Re}\lambda(J)<0$. See [[Fixed Point Classification]].

    The time-$h$ flow map has derivative $e^{hJ}$ at the fixed point, with multipliers $e^{h\lambda}$. Negative real parts therefore give magnitudes below one. [[Eulers Method]] approximates this map by $I+hJ$, so its multipliers are $1+h\lambda$; these can leave the unit disk even when the continuous system is stable.
    """)
    return


@app.cell(hide_code=True)
def scalar_controls(note_md):
    note_md(r"""
    ### Time and state derivatives

    For the continuous logistic equation,
    $$\dot x=f(x)=rx(1-x),\qquad f'(x)=r(1-2x).$$
    The graph of $x(t)$ has slope $f(x)$; the graph of $f(x)$ has slope $f'(x)$. Thus $f'(x)<0$ means an increase in population reduces growth velocity. Population still increases wherever $f(x)>0$, as it does for $1/2<x<1$. These are derivatives of different functions, even though both are evaluated at the same state. The discrete [[Logistic Map]] instead advances the state by iteration.
    """)
    return


@app.cell(hide_code=True)
def scalar_widgets(parameter, tangle):
    scalar_inputs = tangle(r"r=\tangle{r},\quad x_0=\tangle{x0},\quad t_{\rm inspect}=\tangle{time},\quad\delta x=\tangle{dx}",
        dict(r=parameter(1,0.2,2),x0=parameter(0.15,0.05,1.8,0.05),
             time=parameter(2,0,8),dx=parameter(0.1,0.01,0.4,0.01)))
    scalar_inputs
    return (scalar_inputs,)


@app.cell(hide_code=True)
def scalar_computation(np, scalar_inputs):
    scalar_values = dict(scalar_inputs.values)
    scalar_r = scalar_values['r']
    scalar_t0 = scalar_values['time']
    scalar_time = np.linspace(0,8,401)
    def logistic_exact(t):
        return 1/(1+(1/scalar_values['x0']-1)*np.exp(-scalar_r*np.asarray(t)))
    scalar_states = logistic_exact(scalar_time)
    scalar_probe = float(logistic_exact(scalar_t0))
    scalar_velocity = scalar_r*scalar_probe*(1-scalar_probe)
    scalar_derivative = scalar_r*(1-2*scalar_probe)
    scalar_dx = scalar_values['dx']
    scalar_velocity_change = scalar_r*(scalar_probe+scalar_dx)*(1-scalar_probe-scalar_dx)-scalar_velocity
    scalar_predicted_change = scalar_derivative*scalar_dx
    return (
        scalar_derivative,
        scalar_dx,
        scalar_predicted_change,
        scalar_probe,
        scalar_r,
        scalar_states,
        scalar_t0,
        scalar_time,
        scalar_velocity,
        scalar_velocity_change,
    )


@app.cell(hide_code=True)
def scalar_plots(
    colors,
    go,
    make_subplots,
    mo,
    note_md,
    np,
    scalar_derivative,
    scalar_dx,
    scalar_predicted_change,
    scalar_probe,
    scalar_r,
    scalar_states,
    scalar_t0,
    scalar_time,
    scalar_velocity,
    scalar_velocity_change,
    style,
):
    _fig = make_subplots(rows=1,cols=2,subplot_titles=('State over time: slope is f(x)','Velocity over state: slope is f′(x)'))
    _fig.add_trace(go.Scatter(x=scalar_time,y=scalar_states,name='x(t)',line=dict(color=colors['slate'])),1,1)
    _dt = np.array([-0.7,0.7])
    _fig.add_trace(go.Scatter(x=scalar_t0+_dt,y=scalar_probe+scalar_velocity*_dt,name='Time tangent',line=dict(color=colors['rust'],dash='dash')),1,1)
    _fig.add_trace(go.Scatter(x=[scalar_t0],y=[scalar_probe],mode='markers',showlegend=False,marker=dict(size=9,color=colors['dark'])),1,1)
    _x = np.linspace(0,2,401)
    _fig.add_trace(go.Scatter(x=_x,y=scalar_r*_x*(1-_x),name='f(x)',line=dict(color=colors['pine'])),1,2)
    _xlocal = scalar_probe+np.array([-0.4,0.4])
    _fig.add_trace(go.Scatter(x=_xlocal,y=scalar_velocity+scalar_derivative*(_xlocal-scalar_probe),name='State tangent',line=dict(color=colors['rust'],dash='dash')),1,2)
    _fig.add_trace(go.Scatter(x=[scalar_probe,scalar_probe+scalar_dx],y=[scalar_velocity,scalar_velocity+scalar_velocity_change],mode='markers+lines',name='Finite state increment',line=dict(color=colors['ochre'])),1,2)
    _fig.add_trace(go.Scatter(x=[0,1],y=[0,0],mode='markers',name='Fixed points',marker=dict(symbol='diamond',size=8,color=colors['dark'])),1,2)
    _fig.add_hline(y=0,row=1,col=2)
    _fig.update_xaxes(title_text='Time t',range=[0,8],row=1,col=1)
    _fig.update_yaxes(title_text='State x',row=1,col=1)
    _fig.update_xaxes(title_text='State x',range=[0,2],row=1,col=2)
    _fig.update_yaxes(title_text='Velocity dx/dt',row=1,col=2)
    mo.vstack([style(_fig,370),note_md(rf"""
    At $x={scalar_probe:.3f}$, $\dot x={scalar_velocity:.3f}$ and $d\dot x/dx={scalar_derivative:.3f}$. A displacement $\delta x={scalar_dx:.2f}$ changes the velocity by {scalar_velocity_change:.4f}; linearization gives $f'(x)\delta x={scalar_predicted_change:.4f}$, with exact remainder $-r(\delta x)^2={-scalar_r*scalar_dx**2:.4f}$. Differentiation along time introduces another factor through the chain rule:
    $$\ddot x=\frac{{df}}{{dx}}\frac{{dx}}{{dt}}=f'(x)f(x)={scalar_derivative*scalar_velocity:.4f}.$$
    At a fixed point, the sign of $f'$ determines linear stability: $f'(0)=r>0$ gives a source and $f'(1)=-r<0$ gives a sink. With dimensionless $x$, both $f$ and $f'$ have units of inverse time, while $\ddot x$ has units of inverse time squared.
    """)])
    return


@app.cell(hide_code=True)
def fish_intro(note_md):
    note_md(r"""
    ### Predator–prey nullclines

    Let $F$ and $S$ denote fish and shark populations, with unit conversion from consumed fish to new sharks:
    $$\dot F=\mu F-\beta FS,\qquad \dot S=\beta FS-\nu S.$$
    A **nullcline** is the set where one velocity component vanishes. Intersections of the two nullcline sets are [[Fixed Point Classification|fixed points]], since both populations are stationary there:
    $$\dot F=0:\ F=0\ \text{or}\ S=\mu/\beta,\qquad
    \dot S=0:\ S=0\ \text{or}\ F=\nu/\beta.$$
    For positive rates, the fixed points are $(0,0)$ and $(\nu/\beta,\mu/\beta)$. Coordinates below are ordered $(F,S)$.
    """)
    return


@app.cell(hide_code=True)
def fish_controls(parameter, tangle):
    fish_inputs = tangle(
        r"\mu=\tangle{mu},\quad\nu=\tangle{nu},\quad\beta=\tangle{beta},\qquad F_0=\tangle{f0},\quad S_0=\tangle{s0}",
        dict(mu=parameter(1,0.2,2),nu=parameter(0.7,0.2,2),beta=parameter(0.5,0.1,1),
             f0=parameter(1,0.1,6),s0=parameter(1,0.1,6)))
    fish_inputs
    return (fish_inputs,)


@app.cell
def fish_functions(np):
    def fish_rhs(t, state, mu, nu, beta):
        F, S = state
        return np.array([F*(mu-beta*S), S*(beta*F-nu)])

    def fish_jacobian(state, mu, nu, beta):
        F, S = state
        return np.array([[mu-beta*S,-beta*F],[beta*S,beta*F-nu]])

    def fish_integral(states, mu, nu, beta):
        F, S = np.asarray(states).T
        return beta*(F+S)-nu*np.log(F)-mu*np.log(S)

    return fish_integral, fish_jacobian, fish_rhs


@app.cell(hide_code=True)
def fish_computation(fish_inputs, fish_integral, fish_rhs, np, solve_ivp):
    fish_parameters = dict(fish_inputs.values)
    mu, nu, beta = (fish_parameters[k] for k in ('mu','nu','beta'))
    fish_initial = np.array([fish_parameters['f0'],fish_parameters['s0']])
    fish_time = np.linspace(0,30,1201)
    fish_solution = solve_ivp(fish_rhs,(0,30),fish_initial,args=(mu,nu,beta),
                              t_eval=fish_time,method='DOP853',rtol=1e-10,atol=1e-12)
    if not fish_solution.success:
        raise RuntimeError(fish_solution.message)
    fish_states = fish_solution.y.T
    fish_fixed = np.array([nu/beta,mu/beta])
    fish_H = fish_integral(fish_states,mu,nu,beta)
    return beta, fish_H, fish_fixed, fish_states, fish_time, mu, nu


@app.cell(hide_code=True)
def fish_phase(
    beta,
    colors,
    fish_fixed,
    fish_states,
    fish_time,
    go,
    mo,
    mu,
    note_md,
    np,
    nu,
    style,
):
    _fig = go.Figure()
    _upper = np.maximum(fish_states.max(axis=0)*1.1,fish_fixed*1.5)
    _f, _s = np.meshgrid(np.linspace(0,_upper[0],13),np.linspace(0,_upper[1],13))
    _u, _v = _f*(mu-beta*_s), _s*(beta*_f-nu)
    _norm = np.hypot(_u/_upper[0],_v/_upper[1])
    _scale = 0.035/np.maximum(_norm,1e-12)
    for _x,_y,_dx,_dy in zip(_f.flat,_s.flat,(_u*_scale).flat,(_v*_scale).flat):
        _fig.add_annotation(x=_x+_dx,y=_y+_dy,ax=_x,ay=_y,xref='x',yref='y',axref='x',ayref='y',
                            showarrow=True,arrowhead=2,arrowsize=0.7,arrowwidth=1,arrowcolor=colors['gray'])
    _fig.add_trace(go.Scatter(x=fish_states[:,0],y=fish_states[:,1],mode='lines+markers',
        marker=dict(size=3,color=fish_time,colorscale='Viridis',showscale=False),
        line=dict(color=colors['pine'],width=1),customdata=np.arange(len(fish_time)),
        name='Orbit',hovertemplate='F=%{x:.3f}<br>S=%{y:.3f}<extra>Orbit</extra>'))
    _fig.add_trace(go.Scatter(x=[0,fish_fixed[0]],y=[0,fish_fixed[1]],mode='markers',
        marker=dict(symbol='diamond',size=10,color=colors['dark']),name='Fixed points'))
    _fig.add_hline(y=mu/beta,line_color=colors['slate'],line_dash='dash')
    _fig.add_vline(x=nu/beta,line_color=colors['rust'],line_dash='dash')
    _fig.add_vline(x=0,line_color=colors['slate'])
    _fig.add_hline(y=0,line_color=colors['rust'])
    _fig.update_layout(xaxis_title='Fish F',yaxis_title='Sharks S',dragmode='lasso',
                       xaxis_range=[0,_upper[0]],yaxis_range=[0,_upper[1]])
    fish_phase = mo.ui.plotly(style(_fig,430),label='Select orbit points to inspect their local velocity and Jacobian')
    mo.vstack([fish_phase,note_md('The lasso selects the latest enclosed sample for the local calculations below; an empty selection uses the initial state. Arrows are normalized to show direction. Blue nullclines have Ḟ = 0; rust nullclines have Ṡ = 0.')])
    return (fish_phase,)


@app.cell(hide_code=True)
def fish_selection(
    beta,
    fish_jacobian,
    fish_phase,
    fish_rhs,
    fish_states,
    mu,
    nu,
):
    fish_selected_ids = sorted({int(p['customdata']) for p in fish_phase.points
                               if p.get('curveNumber') == 0 and p.get('customdata') is not None})
    fish_inspect_id = fish_selected_ids[-1] if fish_selected_ids else 0
    fish_inspect_state = fish_states[fish_inspect_id]
    fish_local_J = fish_jacobian(fish_inspect_state,mu,nu,beta)
    fish_local_velocity = fish_rhs(0,fish_inspect_state,mu,nu,beta)
    return (
        fish_inspect_id,
        fish_inspect_state,
        fish_local_J,
        fish_local_velocity,
    )


@app.cell(hide_code=True)
def jacobian_derivation(
    fish_inspect_id,
    fish_inspect_state,
    fish_local_J,
    fish_local_velocity,
    fish_time,
    note_md,
):
    note_md(rf"""
    ### Jacobian of the velocity field

    In coordinates $(F,S)$, the [[Linearization and the Jacobian|Jacobian]] is
    $$J(F,S)=\begin{{pmatrix}}
    \partial_F\dot F & \partial_S\dot F\\
    \partial_F\dot S & \partial_S\dot S
    \end{{pmatrix}}
    =\begin{{pmatrix}}\mu-\beta S&-\beta F\\\beta S&\beta F-\nu\end{{pmatrix}}.$$
    Column $j$ gives the velocity response to a perturbation in population $j$; row $i$ collects the derivatives of velocity component $i$. In particular, $\partial_F\dot F$ holds $S$ constant, whereas $\ddot F$ follows the changing state along time. At the selected sample $t={fish_time[fish_inspect_id]:.3f}$, $(F,S)=({fish_inspect_state[0]:.3f},{fish_inspect_state[1]:.3f})$,
    $$f(F,S)=\begin{{pmatrix}}{fish_local_velocity[0]:.3f}\\{fish_local_velocity[1]:.3f}\end{{pmatrix}},
    \qquad J=\begin{{pmatrix}}{fish_local_J[0,0]:.3f}&{fish_local_J[0,1]:.3f}\\
    {fish_local_J[1,0]:.3f}&{fish_local_J[1,1]:.3f}\end{{pmatrix}}.$$
    The Jacobian exists along the whole orbit, but its eigenvalues at an arbitrary point do not classify the orbit. At a fixed point $f(x^*)=0$, the constant term disappears from the Taylor expansion:
    $$f(x^*+\eta)=J(x^*)\eta+O(\|\eta\|^2),\qquad \dot\eta\approx J(x^*)\eta.$$
    """)
    return


@app.cell(hide_code=True)
def jacobian_slice_controls(mo):
    slice_entry = mo.ui.dropdown(options={
        '∂Ḟ/∂F':(0,0),'∂Ḟ/∂S':(0,1),'∂Ṡ/∂F':(1,0),'∂Ṡ/∂S':(1,1)},
        value='∂Ḟ/∂S',label='Jacobian entry to inspect')
    slice_entry
    return (slice_entry,)


@app.cell(hide_code=True)
def jacobian_slice(
    beta,
    colors,
    fish_inspect_state,
    fish_local_J,
    fish_local_velocity,
    fish_rhs,
    go,
    mo,
    mu,
    note_md,
    np,
    nu,
    slice_entry,
    style,
):
    _row,_col = slice_entry.value
    _names = ['Fish F','Sharks S']
    _velocity_names = ['Ḟ','Ṡ']
    _center = fish_inspect_state[_col]
    _grid = np.linspace(max(0,_center-1),_center+1,201)
    _states = np.tile(fish_inspect_state,(len(_grid),1))
    _states[:,_col]=_grid
    _values = np.array([fish_rhs(0,x,mu,nu,beta)[_row] for x in _states])
    _tangent = fish_local_velocity[_row]+fish_local_J[_row,_col]*(_grid-_center)
    _fig = go.Figure(go.Scatter(x=_grid,y=_values,name='Exact velocity slice',line=dict(color=colors['pine'],width=4)))
    _fig.add_trace(go.Scatter(x=_grid,y=_tangent,name='Jacobian tangent',line=dict(color=colors['rust'],dash='dash')))
    _fig.add_trace(go.Scatter(x=[_center],y=[fish_local_velocity[_row]],mode='markers',name='Selected state',marker=dict(size=9,color=colors['dark'])))
    _fig.update_layout(xaxis_title=f'{_names[_col]} (other population held fixed)',yaxis_title=_velocity_names[_row])
    mo.vstack([style(_fig,310),note_md(f'The selected partial derivative is {fish_local_J[_row,_col]:.3f}, giving the first-order change in {_velocity_names[_row]} per unit change in {_names[_col]}. Each equation is affine in either population with the other held fixed, so the slice coincides with its tangent. The bilinear term appears when both populations vary.')])
    return


@app.cell(hide_code=True)
def orbit_state_derivative(
    colors,
    fish_inspect_id,
    fish_inspect_state,
    fish_local_velocity,
    fish_states,
    fish_time,
    go,
    mo,
    note_md,
    np,
    style,
):
    # Reparameterizing an orbit by F differs from differentiating its vector field.
    _orbit_start=max(0,fish_inspect_id-30)
    _orbit_end=min(len(fish_time),fish_inspect_id+31)
    _orbit=fish_states[_orbit_start:_orbit_end]
    _speed=np.linalg.norm(fish_local_velocity)
    _scale=max(np.ptp(_orbit[:,0]),np.ptp(_orbit[:,1]),0.1)*0.45
    _tangent_direction=fish_local_velocity/_speed if _speed>1e-12 else np.zeros(2)
    _tangent=fish_inspect_state+np.array([-1,1])[:,None]*_scale*_tangent_direction
    _fig=go.Figure(go.Scatter(x=_orbit[:,0],y=_orbit[:,1],mode='lines',name='Orbit near selected time',line=dict(color=colors['pine'],width=3)))
    _fig.add_trace(go.Scatter(x=_tangent[:,0],y=_tangent[:,1],mode='lines',name='Velocity tangent',line=dict(color=colors['rust'],dash='dash')))
    _fig.add_trace(go.Scatter(x=[fish_inspect_state[0]],y=[fish_inspect_state[1]],mode='markers',name='Selected point',marker=dict(color=colors['dark'],size=9)))
    _fig.update_layout(xaxis_title='Fish F',yaxis_title='Sharks S',yaxis=dict(scaleanchor='x',scaleratio=1))
    if abs(fish_local_velocity[0])>1e-10:
        _slope_text=f"dS/dF = {fish_local_velocity[1]/fish_local_velocity[0]:.3f} and dt/dF = {1/fish_local_velocity[0]:.3f}."
    elif _speed>1e-10:
        _slope_text='Vertical tangent; F cannot parameterize the orbit locally.'
    else:
        _slope_text='Both velocities vanish at a fixed point, leaving the orbit slope undefined (0/0).'
    mo.vstack([note_md(r"""
    ### State as the orbit parameter

    Where $\dot F\ne0$, time can be eliminated locally:
    $$\frac{dS}{dF}=\frac{dS/dt}{dF/dt}=\frac{S(\beta F-\nu)}{F(\mu-\beta S)},\qquad
    \frac{dt}{dF}=\frac{1}{\dot F}.$$
    The ratio $dS/dF$ is the slope of the orbit in the phase plane, with both populations changing. The Jacobian entry $\partial\dot S/\partial F$ instead measures the response of shark velocity to fish abundance at fixed $S$. At a turning point of $F(t)$, the orbit may have a vertical tangent and $F$ ceases to be a local time coordinate. A nonconstant closed orbit therefore requires more than one branch of $S(F)$.
    """),style(_fig,280),note_md(f'At selected time {fish_time[fish_inspect_id]:.2f}: '+_slope_text)])
    return


@app.cell(hide_code=True)
def fish_stability(fish_H, note_md, np):
    note_md(rf"""
    At extinction and coexistence,
    $$J_0=\begin{{pmatrix}}\mu&0\\0&-\nu\end{{pmatrix}},\qquad
    J_* =\begin{{pmatrix}}0&-\nu\\\mu&0\end{{pmatrix}}.$$
    The origin has eigenvalues $\mu,-\nu$ and determinant $-\mu\nu<0$, giving a [[Saddle fixed point|saddle]]. Contraction along one eigendirection coexists with expansion along the other. At coexistence, $\tau=0$, $\Delta=\mu\nu>0$ and $\lambda_\pm=\pm i\sqrt{{\mu\nu}}$, so the linearized system is a center. Nonlinear stability needs another argument. For this model,
    $$H(F,S)=\beta(F+S)-\nu\log F-\mu\log S,\qquad \frac{{dH}}{{dt}}=0.$$
    In the positive quadrant, the level curves of $H$ surround its strict minimum at coexistence and form closed orbits. The numerical drift is $\max|H(t)-H(0)|={np.max(np.abs(fish_H-fish_H[0])):.2e}$. A center is surrounded by a family of closed orbits; a stable [[Limit Cycle|limit cycle]] attracts nearby trajectories onto an isolated periodic orbit, while a stable spiral converges to the fixed point.
    """)
    return


@app.cell(hide_code=True)
def neighborhood_intro(note_md):
    note_md(r"""
    ### Evolution of a neighborhood

    A small circle around $x^*$ gives perturbations $\eta_0$ in every direction. The Jacobian maps these displacements to initial velocities, while the matrix exponential evolves them for a finite time:
    $$\dot\eta(0)=J_*\eta_0,\qquad \eta(t)=e^{tJ_*}\eta_0.$$
    For a flow, $J_*\eta_0$ is a velocity. The neighborhood at time $t$ comes from $e^{tJ_*}$, as follows from the linear system $\dot\eta=J_*\eta$. The nonlinear image agrees to first order as the initial radius tends to zero at fixed time; over longer intervals, neglected terms can accumulate. The two plots compare these velocity and displacement approximations separately.
    """)
    return


@app.cell(hide_code=True)
def neighborhood_controls(mo):
    neighborhood_fixed = mo.ui.dropdown(options=['Coexistence (center)','Origin (saddle)'],value='Coexistence (center)',label='Fixed point')
    neighborhood_radius = mo.ui.slider(0.01,0.4,step=0.01,value=0.12,label='Neighborhood radius / min(F*, S*)',debounce=True)
    neighborhood_time = mo.ui.slider(0,1.5,step=0.05,value=0.8,label='Elapsed time',debounce=True)
    mo.hstack([neighborhood_fixed,neighborhood_radius,neighborhood_time],wrap=True)
    return neighborhood_fixed, neighborhood_radius, neighborhood_time


@app.cell(hide_code=True)
def neighborhood_computation(
    beta,
    fish_fixed,
    fish_jacobian,
    mu,
    neighborhood_fixed,
    neighborhood_radius,
    np,
    nu,
    solve_ivp,
):
    neighborhood_center = fish_fixed if neighborhood_fixed.value.startswith('Coexistence') else np.zeros(2)
    neighborhood_J = fish_jacobian(neighborhood_center,mu,nu,beta)
    neighborhood_absolute_radius = neighborhood_radius.value*min(fish_fixed)
    neighborhood_angles = np.linspace(0,2*np.pi,49)[:-1]
    neighborhood_eta = neighborhood_absolute_radius*np.column_stack([np.cos(neighborhood_angles),np.sin(neighborhood_angles)])
    neighborhood_initial = neighborhood_center+neighborhood_eta

    def neighborhood_rhs(t,flat):
        states = flat.reshape(-1,2)
        F,S = states.T
        return np.column_stack([F*(mu-beta*S),S*(beta*F-nu)]).ravel()

    def neighborhood_guard(t,flat):
        return 100-np.max(np.abs(flat))
    neighborhood_guard.terminal = True
    neighborhood_solution = solve_ivp(neighborhood_rhs,(0,1.5),neighborhood_initial.ravel(),
        method='DOP853',rtol=1e-10,atol=1e-12,dense_output=True,events=neighborhood_guard,max_step=0.05)
    return (
        neighborhood_J,
        neighborhood_absolute_radius,
        neighborhood_angles,
        neighborhood_center,
        neighborhood_eta,
        neighborhood_initial,
        neighborhood_rhs,
        neighborhood_solution,
    )


@app.cell(hide_code=True)
def neighborhood_geometry(
    colors,
    expm,
    go,
    make_subplots,
    mo,
    neighborhood_J,
    neighborhood_absolute_radius,
    neighborhood_angles,
    neighborhood_center,
    neighborhood_eta,
    neighborhood_fixed,
    neighborhood_initial,
    neighborhood_rhs,
    neighborhood_solution,
    neighborhood_time,
    note_md,
    np,
    style,
):
    _nt = min(neighborhood_time.value,float(neighborhood_solution.t[-1]))
    neighborhood_linear = (expm(_nt*neighborhood_J)@neighborhood_eta.T).T
    neighborhood_nonlinear = neighborhood_solution.sol(_nt).reshape(-1,2)-neighborhood_center
    neighborhood_velocity = (neighborhood_J@neighborhood_eta.T).T
    neighborhood_exact_velocity = neighborhood_rhs(0,neighborhood_initial.ravel()).reshape(-1,2)
    neighborhood_error = float(np.sqrt(np.mean(np.sum((neighborhood_linear-neighborhood_nonlinear)**2,axis=1))))
    _fig = make_subplots(rows=1,cols=2,subplot_titles=('Initial displacement → velocity','Displacement after elapsed time'))
    for _points,_label,_color,_dash,_col in [
        (neighborhood_velocity,'Jη₀',colors['rust'],'dash',1),
        (neighborhood_exact_velocity,'f(x* + η₀)',colors['pine'],'solid',1),
        (neighborhood_eta,'Initial circle',colors['gray'],'dot',2),
        (neighborhood_linear,'exp(tJ) η₀',colors['rust'],'dash',2),
        (neighborhood_nonlinear,'Nonlinear displacement',colors['pine'],'solid',2)]:
        _closed=np.vstack([_points,_points[0]])
        _fig.add_trace(go.Scatter(x=_closed[:,0],y=_closed[:,1],mode='lines',name=_label,
            line=dict(color=_color,dash=_dash,width=2)),1,_col)
    # Matched angular markers show where each initial direction travels.
    for _points,_col in [(neighborhood_exact_velocity,1),(neighborhood_nonlinear,2)]:
        _fig.add_trace(go.Scatter(x=_points[::6,0],y=_points[::6,1],mode='markers',showlegend=False,
            marker=dict(size=6,color=neighborhood_angles[::6],colorscale='Viridis')),1,_col)
    _fig.update_xaxes(title_text='Velocity change in F',row=1,col=1)
    _fig.update_yaxes(title_text='Velocity change in S',row=1,col=1)
    _fig.update_xaxes(title_text='Displacement in F',row=1,col=2)
    _fig.update_yaxes(title_text='Displacement in S',row=1,col=2)
    _fig.update_yaxes(scaleanchor='x',scaleratio=1,row=1,col=1)
    _fig.update_yaxes(scaleanchor='x2',scaleratio=1,row=1,col=2)
    _extra = (' At the saddle, the full neighborhood extends into negative populations; its biological part lies in the nonnegative quadrant. The F axis is unstable and the S axis stable, giving the eigendirections of the [[Stable and Unstable Manifolds]].' if neighborhood_fixed.value.startswith('Origin') else ' At coexistence, the linear motion has angular frequency √(μν). Circular neighborhoods generally deform because J need not be a pure rotation in population coordinates.')
    if _nt<neighborhood_time.value or not neighborhood_solution.success:
        _extra+=' Integration stopped early at the neighborhood excursion guard or solver failure; the displayed time is truncated.'
    mo.vstack([style(_fig,380),note_md(f'At t = {_nt:.2f}, RMS nonlinear–linear displacement error = {neighborhood_error:.3g} (radius {neighborhood_absolute_radius:.3g}).'+_extra),
        note_md(r'The linear flow changes area by $\det(e^{tJ})=e^{t\operatorname{tr}J}$. Zero trace at the center gives area preservation, though individual directions can stretch or contract. This instantaneous, direction-dependent growth is described by the [[Local Lyapunov Exponent]].')])
    return


@app.cell(hide_code=True)
def trace_intro(note_md):
    note_md(r"""
    ### Trace and determinant

    For a real $2\times2$ matrix,
    $$\tau=\operatorname{tr}J=J_{11}+J_{22},\qquad
    \Delta=\det J=J_{11}J_{22}-J_{12}J_{21},\qquad
    \lambda_\pm=\frac{\tau\pm\sqrt{\tau^2-4\Delta}}{2}.$$
    If $\Delta<0$, the eigenvalues are real with opposite signs, giving a saddle regardless of trace. With $\Delta>0$, negative trace gives asymptotic stability and positive trace gives instability. The discriminant separates nodes ($\tau^2-4\Delta>0$) from spirals ($\tau^2-4\Delta<0$, $\tau\ne0$); at $\tau=0$, $\Delta>0$, the linear system is a center. On $\tau^2=4\Delta$, eigenvalues repeat and the eigenspace determines the geometry. Negative trace alone is insufficient: contraction in one direction can outweigh expansion in another while the equilibrium remains unstable.

    For a nonlinear system, $\Delta=0$ or $\tau=0,\Delta>0$ leaves a nonhyperbolic equilibrium, so linearization alone is inconclusive. These trace–determinant conditions apply to two dimensions.
    """)
    return


@app.cell(hide_code=True)
def trace_controls(parameter, tangle):
    linear_inputs = tangle(r"\tau=\tangle{tau},\qquad\Delta=\tangle{delta}",
                           dict(tau=parameter(-0.8,-3,3),delta=parameter(1,-2,3)))
    linear_inputs
    return (linear_inputs,)


@app.cell(hide_code=True)
def trace_map(colors, go, mo, note_md, np, style):
    _tau, _delta = np.meshgrid(np.arange(-3,3.01,0.2),np.arange(-2,3.01,0.2))
    _fig = go.Figure(go.Scatter(x=_tau.ravel(),y=_delta.ravel(),mode='markers',
        marker=dict(size=7,color=colors['pine'],opacity=0.55),name='Choose a system',
        hovertemplate='τ=%{x:.1f}<br>Δ=%{y:.1f}<extra></extra>'))
    _x = np.linspace(-3,3,201)
    _fig.add_trace(go.Scatter(x=_x,y=_x**2/4,mode='lines',line=dict(color=colors['rust']),name='Δ = τ² / 4'))
    _fig.add_hline(y=0,line_color=colors['dark'])
    _fig.add_vline(x=0,line_color=colors['dark'])
    for _x,_y,_label in [(-1.5,-1,'Saddles'),(-1.8,2,'Stable spirals'),(1.8,2,'Unstable spirals'),(-2.2,0.35,'Stable nodes'),(2.2,0.35,'Unstable nodes')]:
        _fig.add_annotation(x=_x,y=_y,text=_label,showarrow=False)
    _fig.update_layout(xaxis_title='Trace τ',yaxis_title='Determinant Δ',dragmode='select',clickmode='event+select')
    trace_map = mo.ui.plotly(style(_fig,390),label='Select trace and determinant')
    mo.vstack([trace_map,note_md('A selected point sets (τ, Δ); multiple selected points use their mean. An empty selection uses the formula values above.')])
    return (trace_map,)


@app.cell(hide_code=True)
def linear_computation(expm, linear_inputs, np, trace_map):
    _trace_points = [p for p in trace_map.points if p.get('curveNumber') == 0]
    linear_tau = float(np.mean([p['x'] for p in _trace_points])) if _trace_points else linear_inputs.values['tau']
    linear_delta = float(np.mean([p['y'] for p in _trace_points])) if _trace_points else linear_inputs.values['delta']
    # One representative with the chosen trace and determinant, not a unique matrix.
    linear_J = np.array([[0.,1.],[-linear_delta,linear_tau]])
    linear_eigenvalues = np.linalg.eigvals(linear_J)
    linear_discriminant = linear_tau**2-4*linear_delta
    if linear_delta < -1e-8:
        linear_class = 'Saddle (unstable)'
    elif abs(linear_delta)<1e-8:
        linear_class = 'Zero eigenvalue: degenerate boundary'
    elif abs(linear_tau)<1e-8:
        linear_class = 'Linear center; nonlinear classification needs more evidence'
    else:
        _stability = 'Stable' if linear_tau<0 else 'Unstable'
        _kind = 'spiral' if linear_discriminant < -1e-8 else ('node' if linear_discriminant>1e-8 else 'repeated-eigenvalue node')
        linear_class = f'{_stability} {_kind}'
    linear_time = np.linspace(0,8,250)
    linear_propagators = np.array([expm(linear_J*t) for t in linear_time])
    return (
        linear_class,
        linear_delta,
        linear_discriminant,
        linear_eigenvalues,
        linear_propagators,
        linear_tau,
    )


@app.cell(hide_code=True)
def linear_portrait(
    colors,
    go,
    linear_class,
    linear_delta,
    linear_discriminant,
    linear_eigenvalues,
    linear_propagators,
    linear_tau,
    mo,
    note_md,
    np,
    style,
):
    _fig = go.Figure()
    for _theta in np.linspace(0,2*np.pi,9)[:-1]:
        _start = 0.7*np.array([np.cos(_theta),np.sin(_theta)])
        _orbit = linear_propagators@_start
        # Clip only the displayed segment when it leaves the local plotting neighborhood.
        _outside = np.flatnonzero(np.max(np.abs(_orbit),axis=1)>3)
        if len(_outside): _orbit = _orbit[:_outside[0]+1]
        _fig.add_trace(go.Scatter(x=_orbit[:,0],y=_orbit[:,1],mode='lines',showlegend=False,line=dict(width=1.5)))
        _fig.add_trace(go.Scatter(x=[_start[0]],y=[_start[1]],mode='markers',showlegend=False,marker=dict(size=4,color=colors['dark'])))
    _fig.update_layout(xaxis_title='Displacement η₁',yaxis_title='Displacement η₂',xaxis_range=[-3,3],yaxis_range=[-3,3])
    _eigs = ', '.join(f'{v.real:.3f}{v.imag:+.3f}i' for v in linear_eigenvalues)
    mo.vstack([note_md(f'**{linear_class}** · τ = {linear_tau:.2f}, Δ = {linear_delta:.2f}, τ² − 4Δ = {linear_discriminant:.2f}. Eigenvalues: {_eigs}.'),
        style(_fig),note_md(r'The representative system is $\dot\eta=\begin{pmatrix}0&1\\-\Delta&\tau\end{pmatrix}\eta$, integrated forward from the marked initial states for 8 time units. Curves are truncated at the plotting boundary. Trace and determinant fix the eigenvalues, while orientation and transient growth also depend on the matrix entries.')])
    return


@app.cell(hide_code=True)
def multiplier_controls(mo):
    multiplier_step = mo.ui.slider(0.05,3,step=0.05,value=0.5,label='Sampling / Euler step h',debounce=True)
    multiplier_step
    return (multiplier_step,)


@app.cell(hide_code=True)
def multiplier_geometry(
    colors,
    go,
    linear_eigenvalues,
    make_subplots,
    mo,
    multiplier_step,
    note_md,
    np,
    style,
):
    _h = multiplier_step.value
    flow_multipliers = np.exp(_h*linear_eigenvalues)
    euler_multipliers = 1+_h*linear_eigenvalues
    _fig = make_subplots(rows=1,cols=2,subplot_titles=('Flow eigenvalues: left half-plane is stable','Map multipliers: unit disk is stable'))
    _fig.add_trace(go.Scatter(x=linear_eigenvalues.real,y=linear_eigenvalues.imag,mode='markers',name='λ(J)',marker=dict(size=11,color=colors['pine'])),1,1)
    _fig.add_vline(x=0,line_dash='dash',row=1,col=1)
    _theta=np.linspace(0,2*np.pi,200)
    _fig.add_trace(go.Scatter(x=np.cos(_theta),y=np.sin(_theta),mode='lines',name='Unit circle',line=dict(color=colors['gray'])),1,2)
    for _z,_name,_color,_symbol in [(flow_multipliers,'exp(hλ): exact flow',colors['pine'],'circle'),(euler_multipliers,'1 + hλ: Euler',colors['rust'],'x')]:
        _fig.add_trace(go.Scatter(x=_z.real,y=_z.imag,mode='markers',name=_name,marker=dict(size=10,color=_color,symbol=_symbol)),1,2)
    _fig.update_xaxes(title_text='Real part',row=1,col=1)
    _fig.update_yaxes(title_text='Imaginary part',row=1,col=1)
    _fig.update_xaxes(title_text='Real part',row=1,col=2)
    _fig.update_yaxes(title_text='Imaginary part',scaleanchor='x2',scaleratio=1,row=1,col=2)
    mo.vstack([style(_fig,340),note_md(rf"""
    At $h={_h:.2f}$, the largest multiplier magnitude is {np.max(np.abs(flow_multipliers)):.3f} for the exact flow and {np.max(np.abs(euler_multipliers)):.3f} for Euler. The unit-disk criterion from [[Sinks, Sources, and Saddles]] applies to these sampled maps. For a center, $\lambda=\pm i\omega$ gives
    $$|1+ih\omega|=\sqrt{{1+h^2\omega^2}}>1,$$
    so forward Euler produces an outward spiral for every $h>0$, even though the exact linear flow has closed orbits. For $\lambda=\alpha\pm i\omega$, $\alpha$ determines asymptotic linear growth and $|\omega|$ gives angular frequency. A crossing of the imaginary axis is part of an [[Andronov Hopf Bifurcation]], but the existence and stability of an emerging limit cycle also depend on nonlinear terms and nondegeneracy conditions.
    """)])
    return


@app.cell(hide_code=True)
def glv_intro(note_md):
    note_md(r"""
    ### Generalized Lotka–Volterra

    The three-species model is
    $$\dot x_i=x_i\sum_{j=1}^{3}A_{ij}(1-x_j),\qquad
    A=\begin{pmatrix}0.5&0.5&0.1\\-0.5&-0.1&0.1\\a&0.1&0.1\end{pmatrix}.$$
    Row $i$ corresponds to the affected population and column $j$ to the influencing population. For $i\ne j$, $\partial\dot x_i/\partial x_j=-x_iA_{ij}$, so positive entries inhibit growth and negative entries promote it at fixed $x_i>0$. Thus $A_{21}=-0.5$ describes the positive effect of species 1 on species 2, while $A_{12}=0.5$ describes the negative effect of species 2 on species 1. The parameter $a=A_{31}$ controls the effect of species 1 on species 3.

    Expansion gives $\dot x_i=x_i(r_i-\sum_jA_{ij}x_j)$ with $r=A\mathbf1=(1.1,-0.5,a+0.2)^T$. Intrinsic growth therefore depends on the row sum; changing $a$ changes both $r_3$ and an interaction coefficient. The abundance $x_i=1$ is a reference value, not a hard upper bound. The simulations compare initial states $x_0$ and $x_0+\varepsilon(1,1,-1)$.
    """)
    return


@app.cell(hide_code=True)
def glv_controls(mo, note_md, parameter, tangle):
    glv_inputs = tangle(
        r"a=\tangle{a},\quad\varepsilon=\tangle{epsilon},\qquad x_1(0)=\tangle{x1},\ x_2(0)=\tangle{x2},\ x_3(0)=\tangle{x3}",
        dict(a=parameter(1.5,-5,5,0.01),epsilon=parameter(0.01,0,0.09,0.001,3),
             x1=parameter(0.5,0.1,2),x2=parameter(0.5,0.1,2),x3=parameter(0.5,0.1,2)))
    glv_horizon = mo.ui.slider(50,500,step=50,value=200,label='Time horizon',debounce=True)
    mo.vstack([glv_inputs,glv_horizon,
        note_md('Lecture parameter values: a = 0.7, 1.2, 1.3 and 1.32; the Colab default is 1.5. Their observed trajectories depend on the initial state, transient and integration interval.')])
    return glv_horizon, glv_inputs


@app.cell
def glv_functions(np, solve_ivp):
    def interaction_matrix(a):
        return np.array([[0.5,0.5,0.1],[-0.5,-0.1,0.1],[a,0.1,0.1]])

    def glv_rhs(t, x, A):
        return x*(A@(1-x))

    def glv_jacobian(x,A):
        return np.diag(A@(1-x))-np.diag(x)@A

    def integrate_glv(A,x0,T,rtol=1e-9,atol=1e-11):
        # Signed states are retained. Stop large excursions rather than hiding them with abs/clipping.
        def excursion(t,x):
            return 1e3-np.max(np.abs(x))
        excursion.terminal = True
        excursion.direction = -1
        return solve_ivp(
            lambda t,x:glv_rhs(t,x,A),(0,float(T)),np.asarray(x0,dtype=float),
            method='DOP853',rtol=rtol,atol=atol,dense_output=True,events=excursion)

    def forward_euler(A,x0,T,h):
        steps = int(np.ceil(T/h))
        dt = T/steps
        # Store at most ~5001 displayed samples; every Euler step is still calculated.
        stride = max(1,int(np.ceil(steps/5000)))
        times, states = [0.], [np.asarray(x0,dtype=float).copy()]
        x = states[0].copy()
        status = 'complete'
        for n in range(steps):
            x = x+dt*glv_rhs(n*dt,x,A)
            if not np.all(np.isfinite(x)) or np.max(np.abs(x))>1e3:
                status = 'stopped at nonfinite state or |x| > 1000'
                break
            if (n+1)%stride == 0 or n==steps-1 or np.any(x<0):
                times.append((n+1)*dt); states.append(x.copy())
            if np.any(x<0):
                status = 'stopped at first negative abundance; decrease h'
                break
        return np.asarray(times),np.asarray(states),status,dt

    return forward_euler, integrate_glv, interaction_matrix


@app.cell(hide_code=True)
def glv_computation(
    glv_horizon,
    glv_inputs,
    integrate_glv,
    interaction_matrix,
    np,
):
    glv_parameters = dict(glv_inputs.values)
    glv_a = float(glv_parameters['a'])
    glv_A = interaction_matrix(glv_a)
    glv_x0 = np.array([glv_parameters[k] for k in ('x1','x2','x3')])
    glv_epsilon = float(glv_parameters['epsilon'])
    glv_x0_near = glv_x0+glv_epsilon*np.array([1,1,-1])
    glv_base = integrate_glv(glv_A,glv_x0,glv_horizon.value)
    glv_near = integrate_glv(glv_A,glv_x0_near,glv_horizon.value)
    glv_end = min(glv_base.t[-1],glv_near.t[-1])
    glv_time = np.linspace(0,glv_end,4001)
    glv_states = glv_base.sol(glv_time).T
    glv_states_near = glv_near.sol(glv_time).T
    glv_separation = np.linalg.norm(glv_states_near-glv_states,axis=1)
    glv_eigenvalues = np.linalg.eigvals(-glv_A)
    return (
        glv_base,
        glv_eigenvalues,
        glv_end,
        glv_near,
        glv_parameters,
        glv_separation,
        glv_states,
        glv_states_near,
        glv_time,
    )


@app.cell(hide_code=True)
def glv_equilibrium(glv_eigenvalues, note_md, np):
    _max_real = float(np.max(glv_eigenvalues.real))
    _local = 'locally asymptotically stable' if _max_real < -1e-8 else ('unstable' if _max_real>1e-8 else 'nonhyperbolic: linearization is inconclusive')
    _eigs = ', '.join(f'{z.real:.4f}{z.imag:+.4f}i' for z in glv_eigenvalues)
    note_md(rf"""
    The reference state $x^*=(1,1,1)$ is a fixed point for every $a$, since
    $$J(x)=\operatorname{{diag}}(A(\mathbf1-x))-\operatorname{{diag}}(x)A,
    \qquad J(x^*)=-A.$$
    The eigenvalues are {_eigs}; the reference equilibrium is {_local}. This classifies local stability at $x^*$; the long-run trajectory may approach another invariant set. In three dimensions the full spectrum is needed, beyond the two-dimensional trace–determinant diagram.
    """)
    return


@app.cell(hide_code=True)
def glv_time_plot(
    glv_base,
    glv_end,
    glv_horizon,
    glv_near,
    glv_states,
    glv_states_near,
    glv_time,
    go,
    mo,
    note_md,
    np,
    species_colors,
    style,
):
    _fig = go.Figure()
    for _i,_name in enumerate(['x₁','x₂','x₃']):
        for _states,_dash,_suffix in [(glv_states,'solid','base'),(glv_states_near,'dash','nearby')]:
            _fig.add_trace(go.Scatter(x=glv_time,y=_states[:,_i],mode='lines',
                line=dict(color=species_colors[_i],dash=_dash,width=1.4),name=f'{_name} {_suffix}',
                customdata=np.arange(len(glv_time))))
    _fig.update_layout(xaxis_title='Time',yaxis_title='Abundance xᵢ (signed)',dragmode='select',selectdirection='h')
    glv_time_plot = mo.ui.plotly(style(_fig,430),label='Select a time interval for phase portrait, separation and peaks')
    _warnings=[]
    if not glv_base.success or not glv_near.success:
        _warnings.append('Integration failed: '+glv_base.message+' / '+glv_near.message)
    if glv_end < glv_horizon.value:
        _warnings.append(f'Run ended early at t={glv_end:.4g}; |x|=1000 is an excursion guard, not a biological bound.')
    if min(glv_states.min(),glv_states_near.min())<0:
        _warnings.append('Negative numerical abundances occurred; these require a tolerance check. Signed values are retained without reflection or clipping.')
    mo.vstack([glv_time_plot,note_md('Horizontal selection sets the interval for the phase portrait, separation fit and peak sequence. An empty selection uses the full trajectory.'),
        *[mo.callout(w,kind='warn') for w in _warnings]])
    return (glv_time_plot,)


@app.cell(hide_code=True)
def glv_window(glv_end, glv_time, glv_time_plot, np):
    _range = glv_time_plot.ranges.get('x')
    _points = glv_time_plot.points
    if _range is not None:
        glv_window = tuple(sorted(map(float,_range)))
    elif _points:
        glv_window = (min(float(p['x']) for p in _points),max(float(p['x']) for p in _points))
    else:
        glv_window = (0.,float(glv_end))
    glv_window_mask = (glv_time>=glv_window[0]) & (glv_time<=glv_window[1])
    glv_window_ids = np.flatnonzero(glv_window_mask)
    return glv_window, glv_window_ids, glv_window_mask


@app.cell(hide_code=True)
def glv_geometry(
    colors,
    glv_states,
    glv_states_near,
    glv_time,
    glv_window,
    glv_window_ids,
    go,
    make_subplots,
    mo,
    note_md,
    np,
    style,
):
    _fig = make_subplots(rows=1,cols=2,specs=[[{'type':'scene'},{'type':'xy'}]],
                         subplot_titles=('Three-dimensional state','Projection onto (x₁, x₂)'))
    _ids = glv_window_ids
    for _states,_name,_color in [(glv_states,'base',colors['pine']),(glv_states_near,'nearby',colors['rust'])]:
        _fig.add_trace(go.Scatter3d(x=_states[_ids,0],y=_states[_ids,1],z=_states[_ids,2],mode='lines',
            name=_name,line=dict(color=_color,width=3)),1,1)
    _fig.add_trace(go.Scatter(x=glv_states[_ids,0],y=glv_states[_ids,1],mode='markers',showlegend=False,
        marker=dict(size=3,color=glv_states[_ids,2],colorscale='Viridis'),
        customdata=np.column_stack([glv_time[_ids],glv_states[_ids,2]]),
        hovertemplate='x₁=%{x:.3f}<br>x₂=%{y:.3f}<br>x₃=%{customdata[1]:.3f}<br>t=%{customdata[0]:.2f}<extra></extra>'),1,2)
    _fig.update_layout(scene=dict(xaxis_title='x₁',yaxis_title='x₂',zaxis_title='x₃'),
                       xaxis_title='x₁',yaxis_title='x₂')
    mo.vstack([note_md(f'**Selected interval:** {glv_window[0]:.2f}–{glv_window[1]:.2f} · {len(_ids)} sampled states'),style(_fig,410),
        note_md('Projected crossings can correspond to different x₃ values. Uniqueness for a smooth autonomous ODE prevents distinct orbits from crossing in the full state space, where the vector field assigns a single velocity to each state.')])
    return


@app.cell(hide_code=True)
def separation_computation(glv_separation, glv_time, glv_window_ids, np):
    fit_ids = glv_window_ids[(glv_separation[glv_window_ids]>1e-12) &
                             np.isfinite(glv_separation[glv_window_ids])]
    separation_slope = None
    separation_r2 = None
    separation_fit = None
    if len(fit_ids)>=3 and np.ptp(glv_time[fit_ids])>0:
        _t = glv_time[fit_ids]
        _y = np.log(glv_separation[fit_ids])
        _slope,_intercept = np.polyfit(_t,_y,1)
        separation_slope = float(_slope)
        separation_fit = _slope*_t+_intercept
        _total = np.sum((_y-_y.mean())**2)
        separation_r2 = float(1-np.sum((_y-separation_fit)**2)/_total) if _total>0 else None
    return fit_ids, separation_fit, separation_r2, separation_slope


@app.cell(hide_code=True)
def separation_plot(
    colors,
    fit_ids,
    glv_separation,
    glv_time,
    glv_window,
    go,
    mo,
    note_md,
    np,
    separation_fit,
    separation_r2,
    separation_slope,
    style,
):
    _fig = go.Figure(go.Scatter(x=glv_time,y=np.where(glv_separation>0,glv_separation,np.nan),
                               mode='lines',name='‖xnear − xbase‖₂',line=dict(color=colors['pine'])))
    if separation_fit is not None:
        _fig.add_trace(go.Scatter(x=glv_time[fit_ids],y=np.exp(separation_fit),name='Selected-window fit',line=dict(color=colors['rust'],dash='dash')))
    _fig.add_vrect(x0=glv_window[0],x1=glv_window[1],fillcolor=colors['sage'],opacity=0.12,line_width=0)
    _fig.update_layout(xaxis_title='Time',yaxis_title='State separation (log scale)',yaxis_type='log')
    _result = 'The fit requires at least three selected samples with separation above 10⁻¹².' if separation_slope is None else f'Window slope of log separation: **{separation_slope:.4f} per time unit**; R² = {separation_r2:.3f}.' if separation_r2 is not None else f'Window slope: **{separation_slope:.4f} per time unit**.'
    mo.vstack([style(_fig,320),note_md(_result),note_md(r"""
    For $d(t)\approx d(0)e^{\lambda t}$, the graph of $\log d(t)$ has slope $\lambda$. The fitted slope measures separation over the selected interval; a [[Lyapunov Exponents|Lyapunov exponent]] additionally requires control of perturbation size, tangent evolution and averaging. Transient growth, phase drift, saturation and integration error can all affect two finite trajectories. Dependence on the selected interval and initial perturbation therefore matters when interpreting [[Sensitive Dependence on Initial Conditions]]; see also [[Finite-Time Lyapunov Exponent]]. At $\varepsilon=0$, the trajectories coincide and $\log d$ is undefined, so zero distances are omitted.
    """)])
    return


@app.cell(hide_code=True)
def peak_controls(mo):
    peak_species = mo.ui.dropdown(options={'x₁':0,'x₂':1,'x₃':2},value='x₁',label='Population for peaks')
    peak_species
    return (peak_species,)


@app.cell(hide_code=True)
def peak_computation(find_peaks, glv_states, glv_window_mask, peak_species):
    # Detect on the full uniformly sampled base trajectory, then select consecutive peak pairs.
    _peak_ids,_ = find_peaks(glv_states[:,peak_species.value])
    peak_ids = _peak_ids[glv_window_mask[_peak_ids]]
    peak_values = glv_states[peak_ids,peak_species.value]
    return peak_ids, peak_values


@app.cell(hide_code=True)
def peak_plot(
    glv_time,
    go,
    make_subplots,
    mo,
    note_md,
    peak_ids,
    peak_values,
    style,
):
    _fig = make_subplots(rows=1,cols=2,subplot_titles=('Peak sequence in selected interval','Consecutive peaks'))
    _fig.add_trace(go.Scatter(x=glv_time[peak_ids],y=peak_values,mode='lines+markers',name='Peaks'),1,1)
    _fig.add_trace(go.Scatter(x=peak_values[:-1],y=peak_values[1:],mode='markers',name='Return pairs'),1,2)
    _fig.update_xaxes(title_text='Time of peak',row=1,col=1)
    _fig.update_yaxes(title_text='Peak abundance',row=1,col=1)
    _fig.update_xaxes(title_text='Peak n',row=1,col=2)
    _fig.update_yaxes(title_text='Peak n + 1',row=1,col=2)
    _message = f'{len(peak_ids)} sampled local maxima in the selected interval.'
    if len(peak_ids)<3: _message += ' Fewer than three peaks give fewer than two return pairs.'
    mo.vstack([style(_fig,320),note_md(_message+' After the transient, one recurring peak height is consistent with a simple cycle, while alternating heights can indicate period doubling. Irregular heights can also arise from transients or numerical sampling. The peak sequence uses sampled maxima, so its resolution depends on the output time grid.')])
    return


@app.cell(hide_code=True)
def euler_intro(note_md):
    note_md(r"""
    ### Numerical integration

    The Colab uses simultaneous forward Euler updates with $h=10^{-4}$ for nearly 200 time units, starting from $(0.5,0.5,0.5)$ and $(0.51,0.51,0.49)$:
    $$x_{n+1}=x_n+h\,x_n\odot A(\mathbf1-x_n).$$
    The trajectories above use DOP853 with relative tolerance $10^{-9}$ and absolute tolerance $10^{-11}$. The 4001 plotted times are output samples; the solver chooses its internal steps adaptively. The comparison below runs Euler at $h$ and $h/2$ against a tighter DOP853 solution, using the model inputs held in the form at submission. Changing the model resets the comparison.

    The continuous equations preserve nonnegative populations while a finite solution exists. Forward Euler can violate this, so the comparison stops at the first negative state and retains its signed value. Reflection through an absolute value would conceal the numerical failure.
    """)
    return


@app.cell(hide_code=True)
def euler_controls(glv_parameters, mo):
    # Recreated when model inputs change: the expensive comparison returns to its unsubmitted gate.
    _euler_model = dict(glv_parameters)
    euler_config = mo.ui.dictionary({
        **{k:mo.ui.number(value=_euler_model[k],disabled=True,label=f'Current {k}') for k in ('a','x1','x2','x3')},
        'h':mo.ui.dropdown(options=[0.0001,0.001,0.01,0.05,0.1],value=0.01,label='Euler step h'),
        'T':mo.ui.slider(5,100,step=5,value=20,label='Comparison horizon'),
    }).form(submit_button_label='Compare Euler steps',show_clear_button=True)
    euler_config
    return (euler_config,)


@app.cell(hide_code=True)
def euler_snapshot(
    euler_config,
    forward_euler,
    integrate_glv,
    interaction_matrix,
    mo,
    note_md,
    np,
):
    mo.stop(euler_config.value is None,note_md('The integration comparison runs on submission.'))
    euler_run = dict(a=euler_config.value['a'],x0=np.array([euler_config.value[k] for k in ('x1','x2','x3')]),h=euler_config.value['h'],T=euler_config.value['T'])
    euler_coarse = forward_euler(interaction_matrix(euler_run['a']),euler_run['x0'],euler_run['T'],euler_run['h'])
    euler_fine = forward_euler(interaction_matrix(euler_run['a']),euler_run['x0'],euler_run['T'],euler_run['h']/2)
    euler_reference = integrate_glv(interaction_matrix(euler_run['a']),euler_run['x0'],euler_run['T'],rtol=1e-11,atol=1e-13)
    return euler_coarse, euler_fine, euler_reference, euler_run


@app.cell(hide_code=True)
def euler_result(
    euler_coarse,
    euler_fine,
    euler_reference,
    euler_run,
    go,
    mo,
    note_md,
    np,
    style,
):
    _fig = go.Figure()
    _summary=[]
    for _run,_name in [(euler_coarse,'h'),(euler_fine,'h/2')]:
        _t,_x,_status,_dt = _run
        _mask = _t<=euler_reference.t[-1]
        _err = np.linalg.norm(_x[_mask]-euler_reference.sol(_t[_mask]).T,axis=1)
        _fig.add_trace(go.Scatter(x=_t[_mask],y=_err,mode='lines',name=f'{_name} = {_dt:g}'))
        _summary.append(f'{_name}: {_status}; maximum sampled error {_err.max():.3g}')
    _fig.update_layout(xaxis_title='Time',yaxis_title='‖Euler − tighter DOP853‖₂')
    mo.vstack([style(_fig,320),note_md('; '.join(_summary)),
        note_md(f"Comparison: a={euler_run['a']:g}, x₀={euler_run['x0'].tolist()}, T={euler_run['T']:g}. On a fixed smooth interval in the convergence regime, Euler has global error O(h), so halving h approximately halves the error. Sensitive dynamics can produce large long-time trajectory errors without changing the underlying attractor.")])
    return


@app.cell(hide_code=True)
def class_context(mo, note_md):
    mo.accordion({'Stochastic extinction and interventions':note_md(r"""
    The stochastic panda model in [[continuous_models.marimo|Continuous models]] retains extinction events that disappear under a mean-field approximation. Starting from one wild panda, capture or death can occur before reproduction. The lecture compared 200 runs per capture rate with the deterministic trajectory; standard-deviation bars describe variation across runs, whereas standard errors would describe uncertainty in the estimated mean. The original stochastic runs are unavailable here.

    A discrete intervention is a jump applied once at a specified time. With an adaptive solver, integration proceeds to the intervention, the state is changed, and integration restarts. Applying the jump inside the right-hand side makes it depend on the solver evaluation schedule, since the same interval can require repeated evaluations.
    """), 'Period doubling and chaos':note_md(r"""
    The lecture ended with oscillations, possible period doubling and separation of nearby trajectories. A finite trajectory cannot establish nonperiodicity for all future time. For smooth autonomous planar flows, uniqueness prevents orbit crossings and the Poincaré–Bendixson restrictions exclude strange attractors under their usual hypotheses. Discrete maps and periodically forced systems need separate treatment.

    A projected figure eight can hide separation in a third coordinate. Its two lobes do not establish two centers, and an attracting periodic orbit has different local geometry from a center surrounded by closed orbits. Peak sequences and trajectory separation give finite-time evidence about the simulated dynamics; a chaos classification requires further analysis.
    """)})
    return


@app.cell(hide_code=True)
def sources(mo, note_md):
    source_anchors = [{'topic': 'Opening and mean-field context', 'indexed_utc': '2026-09-24T18:50:07.315769Z', 'source_ref': '/v1/audio/turns/effb9e69-51b7-5f49-9dbd-acbccb5f3475:c0573562ea5274ee7d1a2358fcd9afbed9b9b98c5a382fe0328e0ad5a123f497:7', 'session_id': 'effb9e69-51b7-5f49-9dbd-acbccb5f3475', 'transcript_sha256': 'c0573562ea5274ee7d1a2358fcd9afbed9b9b98c5a382fe0328e0ad5a123f497'}, {'topic': 'Stochastic panda recap', 'indexed_utc': '2026-09-24T18:56:38.435769Z', 'source_ref': '/v1/audio/turns/cef3acdc-119f-58fa-bf9b-b47f926eb04f:3c97c67d4d0e43ef8785479bace47113332c02e26c5f3bd4a22c7e62e0948736:0', 'session_id': 'cef3acdc-119f-58fa-bf9b-b47f926eb04f', 'transcript_sha256': '3c97c67d4d0e43ef8785479bace47113332c02e26c5f3bd4a22c7e62e0948736'}, {'topic': 'Predator–prey analysis', 'indexed_utc': '2026-09-24T19:01:00.535769Z', 'source_ref': '/v1/audio/turns/846b0197-76c6-5f01-9034-937864427578:cc8ac9679a5f26cb268f1a6ae6628ec1f588b0d3055ab180d400f618cf61c56a:4', 'session_id': '846b0197-76c6-5f01-9034-937864427578', 'transcript_sha256': 'cc8ac9679a5f26cb268f1a6ae6628ec1f588b0d3055ab180d400f618cf61c56a'}, {'topic': 'Jacobian entries', 'indexed_utc': '2026-09-24T19:15:45.135769Z', 'source_ref': '/v1/audio/turns/ab6b0fa5-91bd-5d89-b5a1-05a5b3d495e0:5fb1365234cd6a992bd10c6c829e6e3314bc143027c755a1f4fb1f201778278f:1', 'session_id': 'ab6b0fa5-91bd-5d89-b5a1-05a5b3d495e0', 'transcript_sha256': '5fb1365234cd6a992bd10c6c829e6e3314bc143027c755a1f4fb1f201778278f'}, {'topic': 'Saddle classification', 'indexed_utc': '2026-09-24T19:26:19.205769Z', 'source_ref': '/v1/audio/turns/8e8c8c8d-6329-5638-8f09-1e18c9463f04:f4f63526f4b0452159cc41bfef35897518c922b767c2973e07550950034f427c:5', 'session_id': '8e8c8c8d-6329-5638-8f09-1e18c9463f04', 'transcript_sha256': 'f4f63526f4b0452159cc41bfef35897518c922b767c2973e07550950034f427c'}, {'topic': 'Coexistence trace and determinant', 'indexed_utc': '2026-09-24T19:34:12.535769Z', 'source_ref': '/v1/audio/turns/a7c01d0d-d14a-59ab-aba2-1efe3ad863f2:bdd42d984519e79fd7c86bd114e4c5164b1842135df83faba124b9c476f37326:9', 'session_id': 'a7c01d0d-d14a-59ab-aba2-1efe3ad863f2', 'transcript_sha256': 'bdd42d984519e79fd7c86bd114e4c5164b1842135df83faba124b9c476f37326'}, {'topic': 'Neighboring orbits', 'indexed_utc': '2026-09-24T19:40:45.235769Z', 'source_ref': '/v1/audio/turns/b23f8f8e-14d8-55b1-b5dd-e29c166fd4ae:2a7d032448a5744d0d2130b69a02bab08c8fc4d7be2dff22801a2de80ad5580c:4', 'session_id': 'b23f8f8e-14d8-55b1-b5dd-e29c166fd4ae', 'transcript_sha256': '2a7d032448a5744d0d2130b69a02bab08c8fc4d7be2dff22801a2de80ad5580c'}, {'topic': 'Generalized model', 'indexed_utc': '2026-09-24T19:49:22.635769Z', 'source_ref': '/v1/audio/turns/58f0ae7c-9c55-5f94-8c35-672c2c1b15fa:db8a0fcda239ce0475af220083919acb69560f404439746e2d74e982f227ec6c:5', 'session_id': '58f0ae7c-9c55-5f94-8c35-672c2c1b15fa', 'transcript_sha256': 'db8a0fcda239ce0475af220083919acb69560f404439746e2d74e982f227ec6c'}, {'topic': 'Nearby initial states', 'indexed_utc': '2026-09-24T20:00:13.975769Z', 'source_ref': '/v1/audio/turns/335e6e57-fdef-583f-90af-89aa7bb3fa1d:72416737e423d9fd25a24d7cb2ac2f233ee744425b7fe67a870ced6b46bec4d7:7', 'session_id': '335e6e57-fdef-583f-90af-89aa7bb3fa1d', 'transcript_sha256': '72416737e423d9fd25a24d7cb2ac2f233ee744425b7fe67a870ced6b46bec4d7'}, {'topic': 'Period-doubling discussion', 'indexed_utc': '2026-09-24T20:02:58.805769Z', 'source_ref': '/v1/audio/turns/84d5cdcb-7579-534a-9401-7a39e41cfec5:3f11b336c3f4d382adc1c0abc95e961044695aa0710727801a95dfa67e2a6c18:3', 'session_id': '84d5cdcb-7579-534a-9401-7a39e41cfec5', 'transcript_sha256': '3f11b336c3f4d382adc1c0abc95e961044695aa0710727801a95dfa67e2a6c18'}, {'topic': 'Adjacent closing remarks, beyond requested end', 'indexed_utc': '2026-09-24T20:05:26.105769Z', 'source_ref': '/v1/audio/turns/09a14cf3-7877-5eb0-9af5-8aef5a825dbb:1dc1cbb42badbe86e011b0e96412d6132e614c5a8c65394307058aecb03ef750:12', 'session_id': '09a14cf3-7877-5eb0-9af5-8aef5a825dbb', 'transcript_sha256': '1dc1cbb42badbe86e011b0e96412d6132e614c5a8c65394307058aecb03ef750'}]
    mo.accordion({'Sources and timing':mo.vstack([note_md(r"""
    [Generalized Lotka–Volterra](https://colab.research.google.com/drive/1z3Fr_6V6gS89W5vkpje1NVphb3H1Bz0Q?usp=sharing), downloaded September 25, 2026. SHA-256: `e0a4688b0fde24a90103181adfb362d44fd8a68d1b4dceb101e95e404ec7e5a9`.

    Lecture: September 24, 2026, nominally 14:40–16:05 EDT. Transcript retrieval covered 14:20–16:25 to allow for a suspected timestamp offset, yielding 1097 turns. Identifiable lecture content spans approximately 14:50–16:06 in the index, including the adjacent closing remarks. No clock correction was established. Transcription and segment timing are automated and were not checked by listening; mathematical notation was reconciled with the equations. Retrieval reported 112 indexed recordings and one omitted untimed segment from an incompletely indexed session. The references below retain the transcript revisions; coverage may be incomplete.

    The linked Chaos Theory notes develop the discrete-map version of local stability. The conserved quantity, continuous-flow neighborhood comparison, generalized-model Jacobian and numerical diagnostics supplement the lecture. Further references: [MIT nonlinear systems](https://ocw.mit.edu/courses/18-03sc-differential-equations-fall-2011/pages/unit-iv-first-order-systems/nonlinear-systems/) and [SciPy solve_ivp](https://docs.scipy.org/doc/scipy/reference/generated/scipy.integrate.solve_ivp.html).
    """),mo.ui.table(source_anchors,selection=None)])})
    return


if __name__ == "__main__":
    app.run()
