# /// script
# dependencies = [
#     "anywidget==0.11.0",
#     "marimo",
#     "numpy==2.5.3",
#     "plotly==7.1.0",
#     "wigglystuff==0.5.32",
# ]
# requires-python = ">=3.14"
# ///

import marimo

__generated_with = "0.24.0"
app = marimo.App(width="medium")


@app.cell(hide_code=True)
def imports():
    import marimo as mo
    import numpy as np
    import plotly.graph_objects as go
    from wigglystuff import TangleLatex

    return TangleLatex, go, mo, np


@app.cell(hide_code=True)
def heading(mo):
    mo.md(r"""
    # Elementary cellular automata
    October 1, 2026 · Modeling Complex Systems · [Lecture Colab](https://colab.research.google.com/drive/16rRDR19NVCJ6y0o9n_KhsgvHXODY7exc)

    A tape is a one-dimensional array of binary states. The rulebook has shape $(2,2,2)$, indexed by the left, center, and right states:

    $$x_j(t+1)=\mathrm{rule}\left[x_{j-1}(t),x_j(t),x_{j+1}(t)\right].$$

    All cells read from row $t$ and write to row $t+1$: **synchronous update**. The Colab joins the ends with modulo indexing. Its eight outputs, ordered `111 → 000`, are `10111000`, giving **Rule 184**.
    """)
    return


@app.cell(hide_code=True)
def preset(mo):
    preset = mo.ui.dropdown(options={f"Rule {r}": r for r in [184, 30, 90, 110, 0, 255]}, value="Rule 184", label="Starting rule")
    preset
    return (preset,)


@app.cell(hide_code=True)
def rule_editor(mo, preset):
    rule_bits = mo.ui.array([mo.ui.checkbox(value=bool((preset.value >> k) & 1), label=f"{k:03b}") for k in range(7,-1,-1)])
    mo.vstack([mo.md("**Rulebook** · Check an output for 1; clear it for 0. Choosing a starting rule resets these eight outputs."), mo.hstack(list(rule_bits), wrap=True, justify="space-between")])
    return (rule_bits,)


@app.cell(hide_code=True)
def rule_value(mo, np, rule_bits):
    rule_number = sum(int(bit) * (1 << k) for bit, k in zip(rule_bits.value, range(7,-1,-1)))
    rule_table = {f"{k:03b}": (rule_number >> k) & 1 for k in range(7,-1,-1)}
    rule = np.zeros((2,2,2),dtype=np.int8)
    for _key,_value in rule_table.items():
        rule[tuple(map(int,_key))] = _value
    mo.md(f"**Rule {rule_number}** · Outputs `111 → 000`: **{rule_number:08b}**. `rule[left, center, right]` gives the new center state.")
    return rule, rule_number


@app.cell(hide_code=True)
def controls(TangleLatex, mo):
    tape_parameters = mo.ui.anywidget(TangleLatex(
        latex=r"N=\tangle{N},\qquad \rho_0=\tangle{density},\qquad T=\tangle{steps}",
        parameters={
            "N": dict(value=1000,min_value=20,max_value=2000,step=20,digits=0,label="Number of cells"),
            "density": dict(value=0.6,min_value=0,max_value=1,step=0.01,digits=2,label="Initial probability of state 1"),
            "steps": dict(value=500,min_value=2,max_value=1000,step=10,digits=0,label="Stored time rows, including initial state"),
        }, theme="light"))
    initial_mode = mo.ui.dropdown(["Random", "Single center cell", "Alternating"], value="Random", label="Initial state")
    boundary = mo.ui.dropdown(["Periodic ring", "Zero outside"], value="Periodic ring", label="Boundary")
    seed = mo.ui.number(0, 99999, value=7, step=1, label="Random seed")
    mo.vstack([tape_parameters, mo.md(r"Drag the values or click for exact entry. $T$ counts stored rows, including $t=0$; the Colab starts with $T=N//2$. Here $T$ can be varied independently. Random initialization uses $u_j\sim U(0,1)$ and $x_j(0)=\mathbf{1}[u_j<\rho_0]$. The seed keeps the same random draws when density changes."),mo.hstack([initial_mode, boundary, seed],wrap=True)])
    return boundary, initial_mode, seed, tape_parameters


@app.cell
def model(np):
    def run_rule(tape, steps, rule, boundary_mode="Periodic ring"):
        """Colab update, vectorized over cells; steps includes the initial row."""
        N = tape.shape[0]
        tapes = np.zeros((steps, N), dtype=np.int8)
        tapes[0, :] = tape
        for n in range(steps - 1):
            previous = tapes[n]
            if boundary_mode == "Periodic ring":
                left = np.roll(previous, 1)
                right = np.roll(previous, -1)
            elif boundary_mode == "Zero outside":
                padded = np.pad(previous, 1, constant_values=0)
                left, right = padded[:-2], padded[2:]
            else:
                raise ValueError("Unknown boundary mode")
            tapes[n + 1] = rule[left, previous, right]
        return tapes

    return (run_rule,)


@app.cell(hide_code=True)
def simulation(
    boundary,
    initial_mode,
    np,
    rule,
    run_rule,
    seed,
    tape_parameters,
):
    N = int(tape_parameters.values["N"])
    density = float(tape_parameters.values["density"])
    steps = int(tape_parameters.values["steps"])
    if initial_mode.value == "Random":
        tape = (np.random.default_rng(int(seed.value)).uniform(0,1,N) < density).astype(np.int8)
    elif initial_mode.value == "Single center cell":
        tape = np.zeros(N,dtype=np.int8)
        tape[N//2] = 1
    else:
        tape = (np.arange(N) % 2).astype(np.int8)
    tapes = run_rule(tape,steps,rule,boundary.value)
    active_fraction = tapes.mean(axis=1)
    return N, active_fraction, steps, tapes


@app.cell(hide_code=True)
def palette():
    # Snapshot of ledger-owned EWAN_THEME_DIR/theme.json, 2026-10-01.
    ca_colors = {"paper": "#F5F1EB", "ink": "#303B49", "accent": "#E89A39"}
    return (ca_colors,)


@app.cell(hide_code=True)
def space_time(
    N,
    active_fraction,
    boundary,
    ca_colors,
    go,
    mo,
    rule_number,
    steps,
    tapes,
):
    ca_figure = go.Figure(go.Heatmap(z=tapes, zmin=0, zmax=1, colorscale=[[0,ca_colors["paper"]],[1,ca_colors["ink"]]], showscale=False, hovertemplate="cell j=%{x}<br>time t=%{y}<br>state=%{z}<extra></extra>"))
    ca_figure.update_layout(title=f"Rule {rule_number} · {N} cells · {steps} rows · {boundary.value}",height=500,margin=dict(l=55,r=20,t=45,b=45),paper_bgcolor=ca_colors["paper"],plot_bgcolor=ca_colors["paper"],font=dict(family="PP Neue Montreal, sans-serif",color=ca_colors["ink"]),xaxis=dict(title="Cell index j"),yaxis=dict(title="Time t ↓",autorange="reversed"))
    mo.vstack([mo.as_html(ca_figure),mo.md(f"Simulated states · dark = 1, light = 0. Initial realized density **{active_fraction[0]:.3f}**; final density **{active_fraction[-1]:.3f}**. The requested density is a probability, so a finite random tape need not contain exactly that fraction of ones.")])
    return


@app.cell(hide_code=True)
def inspect_controls(N, mo, steps):
    inspect_time = mo.ui.slider(0, steps-2, value=0, label="Inspect update t → t+1", show_value=True)
    inspect_cell = mo.ui.slider(0, N-1, value=N//2, label="Cell index j", show_value=True)
    mo.vstack([mo.md("## One local update"),mo.hstack([inspect_time,inspect_cell],wrap=True)])
    return inspect_cell, inspect_time


@app.cell(hide_code=True)
def inspect_update(
    N,
    boundary,
    ca_colors,
    go,
    inspect_cell,
    inspect_time,
    mo,
    rule,
    tapes,
):
    _t,_j=inspect_time.value,inspect_cell.value
    _row=tapes[_t]
    _l=int(_row[(_j-1)%N]) if boundary.value=="Periodic ring" or _j>0 else 0
    _c=int(_row[_j])
    _r=int(_row[(_j+1)%N]) if boundary.value=="Periodic ring" or _j<N-1 else 0
    _result=int(rule[_l,_c,_r])
    _start,_end=max(0,_j-10),min(N,_j+11)
    _detail=go.Figure(go.Heatmap(z=tapes[_t:_t+2,_start:_end].tolist(),x=list(range(_start,_end)),y=[f"t={_t}",f"t={_t+1}"],text=tapes[_t:_t+2,_start:_end].tolist(),texttemplate="%{text}",colorscale=[[0,ca_colors["paper"]],[1,ca_colors["ink"]]],zmin=0,zmax=1,showscale=False,xgap=2,ygap=2))
    _detail.add_shape(type="rect",x0=_j-0.5,x1=_j+0.5,y0=-0.5,y1=1.5,line=dict(color=ca_colors["accent"],width=3))
    _detail.update_layout(height=190,margin=dict(l=60,r=20,t=15,b=40),xaxis=dict(title="Cell index j",dtick=1),yaxis=dict(autorange="reversed"),paper_bgcolor=ca_colors["paper"],font=dict(color=ca_colors["ink"]))
    mo.vstack([mo.md(f"At **t={_t}, j={_j}**: `rule[{_l}, {_c}, {_r}] = {_result}`. The outlined cell changes from **{_c}** to **{_result}**. Up to ten neighbors on either side are shown."),mo.as_html(_detail)])
    return


@app.cell(hide_code=True)
def sources(mo):
    colab_snapshot = {'url': 'https://colab.research.google.com/drive/16rRDR19NVCJ6y0o9n_KhsgvHXODY7exc', 'retrieved_at': '2026-10-01T19:43:11.584125+00:00', 'sha256': '0c8aba6f9eb92a79be2abc08dac08b7a10096afcdd7de952bcba3676e59e2039', 'previous_exploration': {'width': 137, 'generations': 150, 'initial_mode': 'Single center cell', 'boundary': 'Periodic ring', 'seed': 7, 'rule': 30}}
    lecture_anchors = [{'start_timestamp': '2026-10-01T19:07:41.760775Z', 'source_ref': '/v1/audio/turns/74e952b5-eebe-53b3-bd27-34380a44afb4:3d2c383e2a5b5e177d044048706aee2f26cad826e767d658fb37601a269929a7:8', 'transcript_sha256': '3d2c383e2a5b5e177d044048706aee2f26cad826e767d658fb37601a269929a7'}, {'start_timestamp': '2026-10-01T19:06:29.040775Z', 'source_ref': '/v1/audio/turns/6002aec4-3aac-5bad-bb8c-79d1b7d69df2:118b478f1d4215b2057c4b725557c32d58f33a8fd73238e0e2ab74ac08e9f3fd:7', 'transcript_sha256': '118b478f1d4215b2057c4b725557c32d58f33a8fd73238e0e2ab74ac08e9f3fd'}, {'start_timestamp': '2026-10-01T19:05:53.600775Z', 'source_ref': '/v1/audio/turns/6002aec4-3aac-5bad-bb8c-79d1b7d69df2:118b478f1d4215b2057c4b725557c32d58f33a8fd73238e0e2ab74ac08e9f3fd:2', 'transcript_sha256': '118b478f1d4215b2057c4b725557c32d58f33a8fd73238e0e2ab74ac08e9f3fd'}, {'start_timestamp': '2026-10-01T19:03:51.200775Z', 'source_ref': '/v1/audio/turns/182a9d13-4a38-5fda-b2c7-470a169599e2:c1599617a53712672875529e2493b51cbb776a103ffd016ad9142c519ebdbb6f:1', 'transcript_sha256': 'c1599617a53712672875529e2493b51cbb776a103ffd016ad9142c519ebdbb6f'}]
    mo.accordion({"Lecture source and notebook choices": mo.vstack([mo.md("Lecture started at 14:50 EDT (confirmed by Ewan). Transcript retrieved October 1 at 15:09 EDT from the recorded lecture, queried 14:40–16:05 EDT; 144 indexed turns were available through approximately 15:07:45, with one pending recording. This is a snapshot of an ongoing lecture. ASR text and timestamps have not been checked against the audio. The lecture portion establishes binary 1D states, radius-one neighborhoods, rulebook ordering, and synchronous updates. The original starter used Rule 30; the notebook now follows the linked Colab snapshot with Rule 184, N=1000, density=0.6, and 500 stored rows. A fixed random seed, editable rule outputs, alternate initial conditions, and zero-outside boundaries extend the Colab. CA in general can also be stochastic."), mo.ui.table(lecture_anchors, selection=None)])})
    return


@app.cell(hide_code=True)
def colab_reference(np):
    def run_rule_colab(tape, steps):
      rule = np.zeros((2,2,2))
      rule[1,1,1]=1
      rule[1,1,0]=0
      rule[1,0,1]=1
      rule[1,0,0]=1
      rule[0,1,1]=1
      rule[0,1,0]=0
      rule[0,0,1]=0
      rule[0,0,0]=0
      N=tape.shape[0]
      tapes = np.zeros((steps,N),dtype=np.int8)
      tapes[0,:] = tape
      for n in range(steps-1):
        for j in range(N):
          neighborhood = tapes[n, [(j-1)%N, j, (j+1)%N]]
          tapes[(n+1), j] = rule[tuple(neighborhood)]
      return tapes

    return


if __name__ == "__main__":
    app.run()
