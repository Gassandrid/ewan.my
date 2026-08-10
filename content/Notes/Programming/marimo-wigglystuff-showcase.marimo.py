# /// script
# requires-python = ">=3.12"
# dependencies = [
#     "altair>=6,<7",
#     "marimo==0.23.9",
#     "matplotlib>=3.10,<4",
#     "numpy>=2,<3",
#     "pandas>=2.3,<4",
#     "pillow>=11,<13",
#     "plotly>=6,<7",
#     "wigglystuff==0.5.21",
# ]
# ///
# description: An exhaustive interactive field guide to every Marimo 0.23.9 UI constructor and WigglyStuff 0.5.21 export
# tags: cs/data-science

import marimo

__generated_with = "0.23.9"
app = marimo.App(
    app_title="The Reactive Garden — Marimo × WigglyStuff",
    width="full",
)


@app.cell
def _():
    import base64
    import datetime as dt
    import io
    import math
    import random
    import sys

    import marimo as mo

    return base64, dt, io, math, mo, random, sys


@app.cell
async def _(mo, sys):
    # Quartz exports cells as browser-side Marimo islands. Installing explicitly
    # makes the Pyodide dependency boundary visible and deterministic instead of
    # relying on a slow first-use import hook.
    _browser_runtime = sys.platform == "emscripten"
    if _browser_runtime:
        import micropip as _micropip

        await _micropip.install(
            "wigglystuff==0.5.21"
        )

    package_ready = {
        "runtime": "Pyodide in your browser" if _browser_runtime else "local Python",
        "marimo": "0.23.9",
        "wigglystuff": "0.5.21",
    }
    mo.output.replace(
        mo.md(
            f"""
            <div data-showcase-runtime style="display:flex;gap:.55rem;flex-wrap:wrap;margin:.4rem 0 1.2rem">
              <span style="border:1px solid var(--lightgray);border-radius:999px;padding:.2rem .65rem">🐍 {package_ready['runtime']}</span>
              <span style="border:1px solid var(--lightgray);border-radius:999px;padding:.2rem .65rem">marimo {package_ready['marimo']}</span>
              <span style="border:1px solid var(--lightgray);border-radius:999px;padding:.2rem .65rem">WigglyStuff {package_ready['wigglystuff']}</span>
              <span style="border:1px solid var(--lightgray);border-radius:999px;padding:.2rem .65rem">no notebook server</span>
            </div>
            """
        )
    )
    return (package_ready,)


@app.cell
def _(package_ready):
    # This cell deliberately depends on the browser installer above.
    _ = package_ready
    import wigglystuff as ws

    return (ws,)


@app.cell
def _(mo):
    mo.md(
        r"""
        <section data-showcase-hero style="padding:clamp(1.25rem,4vw,3.2rem);border:1px solid var(--lightgray);border-radius:1.2rem;background:linear-gradient(135deg,color-mix(in srgb,var(--secondary) 15%,transparent),color-mix(in srgb,var(--tertiary) 12%,transparent));margin-bottom:1.4rem">
          <div style="font-size:.82rem;letter-spacing:.12em;text-transform:uppercase;opacity:.72">A browser-native notebook field lab</div>
          <h1 style="font-size:clamp(2.4rem,7vw,5.8rem);line-height:.92;margin:.55rem 0 1rem">The Reactive<br/>Garden</h1>
          <p style="font-size:clamp(1.05rem,2vw,1.35rem);max-width:48rem;margin:0">A complete, tactile tour of <strong>every public Marimo UI constructor</strong> and <strong>every WigglyStuff 0.5.21 export</strong>—controls, sketches, graphs, charts, 3D scenes, media, tours, helpers, and the honest edges of what a static website can do.</p>
        </section>

        This is not a screenshot of a notebook. Python runs locally in your tab,
        controls update downstream cells, and WigglyStuff's AnyWidgets exchange
        state with that browser-side Python kernel. Nothing you do below is sent
        back to this website.
        """
    )
    return


@app.cell
def _(mo, ws):
    def anywidget_card(title, factory, note="", badge="live"):
        """Render one WigglyStuff demo without letting an optional extra break its gallery."""
        try:
            _view = mo.ui.anywidget(factory())
            _items = [
                mo.md(
                    f"### {title} &nbsp; <small style='opacity:.65'>{badge}</small>"
                ),
                _view,
            ]
            if note:
                _items.append(mo.md(note))
            return mo.vstack(
                _items,
                gap=0.45,
            )
        except Exception as exc:
            return mo.vstack(
                [
                    mo.md(f'<span data-wiggly-failure="{title}"></span>'),
                    mo.callout(
                        mo.md(
                            f"### {title}\n\n**Capability demo.** This browser build could not "
                            f"start the optional backend: `{type(exc).__name__}: {exc}`\n\n{note}"
                        ),
                        kind="warn",
                    ),
                ],
                gap=0,
            )

    def native_card(title, widget, note=""):
        _items = [mo.md(f"### {title}"), widget]
        if note:
            _items.append(mo.md(note))
        return mo.vstack(
            _items,
            gap=0.4,
        )

    def capability_card(title, requirement, example):
        return mo.callout(
            mo.md(
                f"### {title}\n\n**Requires {requirement}.** The public page keeps the "
                f"boundary visible instead of inventing a successful connection.\n\n"
                f"```python\n{example}\n```"
            ),
            kind="warn",
        )

    _ = ws
    return anywidget_card, capability_card, native_card


@app.cell
def _():
    MARIMO_COMPONENTS = (
        "altair_chart",
        "anywidget",
        "array",
        "batch",
        "button",
        "chat",
        "checkbox",
        "code_editor",
        "data_editor",
        "data_explorer",
        "dataframe",
        "date",
        "date_range",
        "datetime",
        "dictionary",
        "dropdown",
        "experimental_data_editor",
        "file",
        "file_browser",
        "form",
        "matplotlib",
        "matrix",
        "microphone",
        "multiselect",
        "number",
        "panel",
        "plotly",
        "radio",
        "range_slider",
        "refresh",
        "run_button",
        "slider",
        "switch",
        "table",
        "tabs",
        "text",
        "text_area",
    )

    WIGGLY_GROUPS = {
        "Geometry & tangible math": (
            "Slider2D",
            "BezierCurve",
            "CurveEditor",
            "CircularSlider",
            "CircularRangeSlider",
            "Matrix",
            "TangleSlider",
            "TangleChoice",
            "TangleSelect",
            "TangleLatex",
        ),
        "Sketches & graphs": (
            "Paint",
            "Excalidraw",
            "GraphWidget",
            "GridDraw",
            "EdgeDraw",
            "SortableList",
            "WidgetDAG",
        ),
        "Data & charts": (
            "AltairWidget",
            "ChartPuck",
            "ChartSelect",
            "ChartMultiSelect",
            "ObservablePlot",
            "ParallelCoordinates",
            "RidgelineChart",
            "ScatterLog",
            "ScatterWidget",
            "SplineDraw",
            "Treemap",
            "NestedTable",
            "forecast_chart",
        ),
        "Space, frames & sensors": (
            "ThreeWidget",
            "CubeWidget",
            "FramePlayer",
            "ManimWeb",
            "HoverZoom",
            "WebcamCapture",
            "WebkitSpeechToTextWidget",
            "GamepadWidget",
            "KeystrokeWidget",
        ),
        "Notebook utilities": (
            "AnnotationWidget",
            "ColorPicker",
            "CopyToClipboard",
            "TextCompare",
            "PlaySlider",
            "ProgressBar",
            "HTMLRefreshWidget",
            "ImageRefreshWidget",
            "EsmWidget",
            "LiveEdit",
            "inspect_run",
            "ApiDoc",
        ),
        "Runtime & integrations": (
            "AsyncFlow",
            "CellTour",
            "DriverTour",
            "EnvConfig",
            "ModuleTreeWidget",
            "Neo4jWidget",
            "WandbChart",
        ),
    }
    WIGGLY_COMPONENTS = tuple(
        name for names in WIGGLY_GROUPS.values() for name in names
    )
    return MARIMO_COMPONENTS, WIGGLY_COMPONENTS, WIGGLY_GROUPS


@app.cell
def _(MARIMO_COMPONENTS, WIGGLY_COMPONENTS, mo, ws):
    _published = set(ws.__all__)
    _expected = set(WIGGLY_COMPONENTS)
    _coverage_ok = _published == _expected
    mo.md(
        f"""
        ## Coverage contract

        <div data-component-coverage style="display:grid;grid-template-columns:repeat(auto-fit,minmax(12rem,1fr));gap:.8rem;margin:1rem 0">
          <div style="padding:1rem;border:1px solid var(--lightgray);border-radius:.8rem"><strong style="font-size:2rem">{len(MARIMO_COMPONENTS)}</strong><br/>Marimo UI constructors</div>
          <div style="padding:1rem;border:1px solid var(--lightgray);border-radius:.8rem"><strong style="font-size:2rem">{len(WIGGLY_COMPONENTS)}</strong><br/>WigglyStuff exports</div>
          <div style="padding:1rem;border:1px solid var(--lightgray);border-radius:.8rem"><strong style="font-size:2rem">{len(MARIMO_COMPONENTS) + len(WIGGLY_COMPONENTS)}</strong><br/>named surfaces catalogued</div>
          <div style="padding:1rem;border:1px solid var(--lightgray);border-radius:.8rem"><strong style="font-size:2rem">{'✓' if _coverage_ok else '!'}</strong><br/>{'exact release match' if _coverage_ok else 'manifest drift detected'}</div>
        </div>

        “Every” means the exact public surface of the versions printed above—not a
        hand-picked highlights reel. Switch galleries to instantiate each family;
        the inventory at the end records every name and its runtime boundary.
        """
    )
    return


@app.cell
def _(mo):
    mo.md(
        """
        ## 1 · Signal Studio

        Start with a tiny analysis instrument. Shape a synthetic signal, gate a
        time window, then drag the WigglyStuff puck to inject an intervention.
        The summary, chart, and table all derive from the same reactive state.
        """
    )
    return


@app.cell
def _(mo):
    signal_shape = mo.ui.dropdown(
        ["sine", "triangle", "pulse"], value="sine", label="waveform"
    )
    signal_amplitude = mo.ui.slider(
        0.5, 5.0, value=2.4, step=0.1, show_value=True, label="amplitude"
    )
    signal_frequency = mo.ui.slider(
        1, 8, value=3, step=1, show_value=True, label="frequency"
    )
    signal_window = mo.ui.range_slider(
        0, 47, value=[8, 39], step=1, show_value=True, label="active window"
    )
    signal_noise = mo.ui.slider(
        0, 1, value=0.18, step=0.02, show_value=True, label="deterministic noise"
    )
    signal_palette = mo.ui.radio(
        {"ember": "#db6d28", "moss": "#568259", "violet": "#7457a8"},
        value="ember",
        inline=True,
        label="ink",
    )
    signal_enabled = mo.ui.switch(value=True, label="apply intervention")

    signal_controls = mo.vstack(
        [
            mo.hstack([signal_shape, signal_palette, signal_enabled], widths="equal"),
            mo.hstack([signal_amplitude, signal_frequency], widths="equal"),
            mo.hstack([signal_window, signal_noise], widths="equal"),
        ],
        gap=0.8,
    )
    signal_controls
    return (
        signal_amplitude,
        signal_enabled,
        signal_frequency,
        signal_noise,
        signal_palette,
        signal_shape,
        signal_window,
    )


@app.cell
def _(mo, ws):
    garden_point = mo.ui.anywidget(
        ws.Slider2D(
            x=0.25,
            y=0.35,
            width=620,
            height=250,
            x_bounds=(-1.0, 1.0),
            y_bounds=(-1.0, 1.0),
        )
    )
    mo.vstack(
        [
            mo.md("### Intervention puck · `Slider2D`\nDrag in two dimensions: horizontal position shifts phase; vertical position adds bias."),
            garden_point,
        ]
    )
    return (garden_point,)


@app.cell
def _(
    garden_point,
    math,
    random,
    signal_amplitude,
    signal_enabled,
    signal_frequency,
    signal_noise,
    signal_shape,
    signal_window,
):
    _rng = random.Random(730)
    _start, _stop = signal_window.value
    signal_rows = []
    for _step in range(48):
        _phase = (_step / 47 + garden_point.value["x"] * 0.12) * signal_frequency.value
        if signal_shape.value == "triangle":
            _raw = 2 * abs(2 * (_phase % 1) - 1) - 1
        elif signal_shape.value == "pulse":
            _raw = 1 if (_phase % 1) < 0.28 else -0.45
        else:
            _raw = math.sin(math.tau * _phase)
        _inside = _start <= _step <= _stop
        _intervention = garden_point.value["y"] if signal_enabled.value and _inside else 0
        _value = signal_amplitude.value * _raw + _intervention
        _value += (_rng.random() - 0.5) * signal_noise.value
        signal_rows.append(
            {
                "step": _step,
                "value": round(_value, 4),
                "active": _inside,
                "wave": signal_shape.value,
            }
        )
    return (signal_rows,)


@app.cell
def _(garden_point, mo, signal_palette, signal_rows):
    _values = [row["value"] for row in signal_rows]
    _mean = sum(_values) / len(_values)
    _energy = sum(value * value for value in _values) / len(_values)
    _width, _height, _pad = 820, 300, 38
    _low, _high = min(_values), max(_values)
    _span = max(_high - _low, 0.001)

    def _sx(step):
        return _pad + step / 47 * (_width - 2 * _pad)

    def _sy(value):
        return _height - _pad - (value - _low) / _span * (_height - 2 * _pad)

    _points = " ".join(
        f"{_sx(row['step']):.1f},{_sy(row['value']):.1f}" for row in signal_rows
    )
    _zero = _sy(0)
    _dots = "".join(
        f'<circle cx="{_sx(row["step"]):.1f}" cy="{_sy(row["value"]):.1f}" r="2.7" />'
        for row in signal_rows
        if row["active"]
    )
    _chart = mo.Html(
        f"""
        <svg data-signal-chart viewBox="0 0 {_width} {_height}" role="img" aria-label="Reactive signal chart"
             style="width:100%;max-width:{_width}px;height:auto;border:1px solid var(--lightgray);border-radius:.75rem;background:color-mix(in srgb,var(--light) 94%,transparent)">
          <line x1="{_pad}" x2="{_width - _pad}" y1="{_zero:.1f}" y2="{_zero:.1f}" stroke="var(--lightgray)" stroke-width="1" />
          <polyline points="{_points}" fill="none" stroke="{signal_palette.value}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" />
          <g fill="{signal_palette.value}">{_dots}</g>
          <text x="{_pad}" y="22" fill="currentColor" opacity=".7" font-size="13">max {_high:+.2f}</text>
          <text x="{_pad}" y="{_height - 12}" fill="currentColor" opacity=".7" font-size="13">min {_low:+.2f}</text>
        </svg>
        """
    )
    mo.vstack(
        [
            mo.md(
                f"**Mean** `{_mean:+.3f}` · **RMS** `{_energy ** .5:.3f}` · "
                f"**puck** `({garden_point.value['x']:+.2f}, {garden_point.value['y']:+.2f})`"
            ),
            _chart,
        ],
        gap=0.5,
    )
    return


@app.cell
def _(mo, signal_rows):
    signal_table = mo.ui.table(
        signal_rows,
        page_size=8,
        selection="multi",
        show_column_summaries=True,
        label="select samples to inspect",
    )
    signal_table
    return (signal_table,)


@app.cell
def _(mo, signal_table):
    mo.md(
        f"Selected **{len(signal_table.value)}** sample(s). "
        "The table is not decorative: its selection is Python state too."
    )
    return


@app.cell
def _(mo):
    mo.md(
        """
        ## 2 · Every native Marimo component

        Pick a deck. Only that deck boots, which keeps the initial page humane.
        Switching decks exercises all 37 public names in `mo.ui` (36 distinct
        constructors plus the `experimental_data_editor` compatibility alias).
        """
    )
    native_deck = mo.ui.dropdown(
        [
            "Inputs & time",
            "Composition & forms",
            "Data & plots",
            "Files, media & agents",
        ],
        value="Inputs & time",
        label="Marimo deck",
        full_width=True,
    )
    native_deck
    return (native_deck,)


@app.cell
def _(dt, mo, native_card, native_deck):
    mo.stop(native_deck.value != "Inputs & time")
    _button = mo.ui.button(label="release a firefly", value=0, on_click=lambda n: n + 1)
    _run = mo.ui.run_button(label="recompute now", kind="success")
    _refresh = mo.ui.refresh(options=["10s", "30s", "1m"], default_interval="30s", label="pulse")
    _cards = [
        native_card("slider", mo.ui.slider(0, 100, value=42, show_value=True, label="canopy")),
        native_card("range_slider", mo.ui.range_slider(0, 24, value=[6, 18], show_value=True, label="daylight")),
        native_card("number", mo.ui.number(0, 999, value=144, label="seed count")),
        native_card("checkbox", mo.ui.checkbox(True, label="show spores")),
        native_card("switch", mo.ui.switch(True, label="night mode for moths")),
        native_card("dropdown", mo.ui.dropdown(["fern", "moss", "lichen"], value="moss", label="specimen")),
        native_card("multiselect", mo.ui.multiselect(["wind", "rain", "sun"], value=["rain"], label="conditions")),
        native_card("radio", mo.ui.radio(["quiet", "curious", "feral"], value="curious", inline=True, label="mood")),
        native_card("text", mo.ui.text("Ada", label="field researcher")),
        native_card("text_area", mo.ui.text_area("The moss is learning.", rows=3, label="observation")),
        native_card("code_editor", mo.ui.code_editor("def bloom(x):\n    return x ** 2", language="python", label="tiny experiment")),
        native_card("button", _button, "Each click increments its reactive event value."),
        native_card("run_button", _run, "A boolean event source for expensive cells."),
        native_card("refresh", _refresh, "An optional reactive clock; left at a gentle cadence."),
        native_card("date", mo.ui.date(value=dt.date(2026, 7, 30), label="survey date")),
        native_card("date_range", mo.ui.date_range(value=(dt.date(2026, 7, 24), dt.date(2026, 7, 30)), label="migration window")),
        native_card("datetime", mo.ui.datetime(value=dt.datetime(2026, 7, 30, 21, 15), precision="minute", label="night watch")),
    ]
    mo.vstack(_cards, gap=1.15)
    return


@app.cell
def _(mo, native_card, native_deck):
    mo.stop(native_deck.value != "Composition & forms")
    _array = mo.ui.array(
        [mo.ui.slider(0, 10, value=i, label=f"plot {i + 1}") for i in (2, 5, 8)],
        label="array",
    )
    _dictionary = mo.ui.dictionary(
        {"species": mo.ui.text("foxglove"), "count": mo.ui.number(0, 100, value=12)},
        label="dictionary",
    )
    _batch = mo.ui.batch(
        mo.md("A **{adjective}** garden with **{count}** gates."),
        {"adjective": mo.ui.text("reactive"), "count": mo.ui.slider(1, 9, value=3)},
    )
    _form = mo.ui.form(
        mo.ui.dictionary(
            {"name": mo.ui.text("nocturne"), "confidence": mo.ui.slider(0, 1, value=.8, step=.05)}
        ),
        submit_button_label="press specimen",
        show_clear_button=True,
        label="form",
    )
    _tabs = mo.ui.tabs(
        {"leaf": mo.md("🍃 chlorophyll"), "root": mo.md("🫚 mycelial network"), "sky": mo.md("✨ navigation")},
        value="leaf",
        lazy=True,
        label="tabs",
    )
    _cards = [
        native_card("array", _array, "A sequence of widgets becomes one list-valued control."),
        native_card("dictionary", _dictionary, "Named widgets become one dictionary-valued control."),
        native_card("batch", _batch, "Interpolates controls directly into prose."),
        native_card("form", _form, "Downstream cells update only when the form is submitted."),
        native_card("matrix", mo.ui.matrix([[1.0, .2], [.2, 1.0]], min_value=-2, max_value=2, step=.1, symmetric=True, row_labels=["x", "y"], column_labels=["x", "y"], label="correlation")),
        native_card("tabs", _tabs, "Lazy tabs render only the active branch."),
    ]
    mo.vstack(_cards, gap=1.15)
    return


@app.cell
async def _(mo, native_card, native_deck, sys):
    mo.stop(native_deck.value != "Data & plots")
    if sys.platform == "emscripten":
        import micropip as _micropip

        await _micropip.install(["altair>=6,<7", "matplotlib", "numpy", "pandas", "plotly>=6,<7"])
    _alt = __import__("altair")
    _plt = __import__("matplotlib.pyplot", fromlist=["pyplot"])
    _np = __import__("numpy")
    _pd = __import__("pandas")
    _go = __import__("plotly.graph_objects", fromlist=["graph_objects"])

    _records = [
        {"species": "moss", "moisture": 82, "growth": 7.2},
        {"species": "fern", "moisture": 61, "growth": 5.6},
        {"species": "lichen", "moisture": 35, "growth": 3.9},
        {"species": "foxglove", "moisture": 54, "growth": 8.1},
    ]
    _frame = _pd.DataFrame(_records)
    _alt_chart = _alt.Chart(_frame).mark_circle(size=150).encode(
        x="moisture:Q", y="growth:Q", color="species:N", tooltip=list(_frame.columns)
    ).properties(height=280)
    _plotly_figure = _go.Figure(
        data=_go.Scatter(
            x=_frame["moisture"], y=_frame["growth"], mode="markers+text",
            text=_frame["species"], textposition="top center",
            marker={"size": 14, "color": ["#568259", "#3f7f5f", "#b58b48", "#a4516c"]},
        )
    )
    _plotly_figure.update_layout(height=320, margin={"l": 35, "r": 15, "t": 20, "b": 35})
    _x = _np.linspace(-3, 3, 80)
    _fig, _ax = _plt.subplots(figsize=(7, 3))
    _ax.scatter(_x, _np.sin(_x * 2) * _np.exp(-_x**2 / 7), c=_x, cmap="viridis")
    _ax.set_title("drag a box or shift-drag a lasso")
    _fig.tight_layout()
    _cards = [
        native_card("table", mo.ui.table(_records, page_size=4, selection="multi", show_column_summaries=True)),
        native_card("data_editor", mo.ui.data_editor(_records, page_size=4, label="editable field sheet")),
        native_card("experimental_data_editor", mo.ui.experimental_data_editor(_records, page_size=4, label="same API alias"), "Compatibility alias, deliberately included in the exhaustive surface."),
        native_card("dataframe", mo.ui.dataframe(_frame, page_size=4, show_download=True)),
        native_card("data_explorer", mo.ui.data_explorer(_frame, x="moisture", y="growth", color="species")),
        native_card("altair_chart", mo.ui.altair_chart(_alt_chart, chart_selection="interval"), "Brush points; selection returns a filtered dataframe."),
        native_card("plotly", mo.ui.plotly(_plotly_figure), "Box- or lasso-select points."),
        native_card("matplotlib", mo.ui.matplotlib(_ax, debounce=True), "A static Matplotlib render with reactive selection geometry."),
    ]
    mo.vstack(_cards, gap=1.15)
    return


@app.cell
def _(capability_card, mo, native_card, native_deck, ws):
    mo.stop(native_deck.value != "Files, media & agents")

    def _garden_bot(messages, config):
        _question = messages[-1].content if messages else "hello"
        return f"The local garden heard: ‘{_question}’. No API key or network model was used."

    _cards = [
        native_card("file", mo.ui.file(filetypes=[".csv", ".json", ".txt"], kind="area", label="drop local observations"), "Files remain inside this browser tab."),
        native_card("file_browser", mo.ui.file_browser(initial_path="/", restrict_navigation=True, label="Pyodide filesystem"), "This browses the notebook's sandboxed in-memory filesystem."),
        native_card("microphone", mo.ui.microphone(label="record a field note"), "Requires browser microphone permission; audio stays local."),
        native_card("chat", mo.ui.chat(_garden_bot, prompts=["What did the garden hear?", "Name this specimen."], max_height=320), "A deterministic offline model proves the chat protocol without a paid service."),
        native_card("anywidget", mo.ui.anywidget(ws.ColorPicker(color="#db6d28")), "The bridge that lets Marimo host WigglyStuff."),
        capability_card(
            "panel",
            "the optional `panel` Python package and its browser extension",
            "import panel as pn\nmo.ui.panel(pn.widgets.IntSlider(start=0, end=10, value=5))",
        ),
    ]
    mo.vstack(_cards, gap=1.15)
    return


@app.cell
def _(mo, WIGGLY_GROUPS):
    mo.md(
        """
        ## 3 · Every WigglyStuff component

        WigglyStuff is the experimental playground: direct-manipulation math,
        sketching, tours, sensor bridges, animation, model inspection, and odd
        little notebook utilities. Select a lab bench; the exact names on that
        bench appear underneath it.
        """
    )
    wiggly_bench = mo.ui.dropdown(
        list(WIGGLY_GROUPS),
        value="Geometry & tangible math",
        label="WigglyStuff bench",
        full_width=True,
    )
    wiggly_bench
    return (wiggly_bench,)


@app.cell
def _(WIGGLY_GROUPS, mo, wiggly_bench):
    _names = WIGGLY_GROUPS[wiggly_bench.value]
    mo.md(" · ".join(f"`{name}`" for name in _names))
    return


@app.cell
def _(anywidget_card, mo, wiggly_bench, ws):
    mo.stop(wiggly_bench.value != "Geometry & tangible math")
    _cards = [
        anywidget_card("Slider2D", lambda: ws.Slider2D(x=.3, y=-.2, width=620, height=260), "Drag a point through a two-dimensional parameter space."),
        anywidget_card("BezierCurve", lambda: ws.BezierCurve(points=[{"x": .05, "y": .25}, {"x": .28, "y": .95}, {"x": .7, "y": .05}, {"x": .95, "y": .72}], width=620, height=300, show_axes=True, playing=True, loop=True, duration_ms=6000), "Move control points or play the parameter along the curve."),
        anywidget_card("CurveEditor", lambda: ws.CurveEditor(points=[{"x": .05, "y": .15}, {"x": .28, "y": .82}, {"x": .58, "y": .35}, {"x": .94, "y": .75}], curve="catmull_rom", width=620, height=300, show_axes=True), "Editable knots with multiple interpolation families."),
        anywidget_card("CircularSlider", lambda: ws.CircularSlider(0, 360, step=1, value=212, size=190, label="bearing", color="#db6d28")),
        anywidget_card("CircularRangeSlider", lambda: ws.CircularRangeSlider(0, 24, step=.5, value=(18, 5), size=190, label="nocturnal window", color="#7457a8")),
        anywidget_card("Matrix", lambda: ws.Matrix(rows=3, cols=3, min_value=-1, max_value=1, step=.05, digits=2, mirror=True, row_names=["rain", "moss", "moths"], col_names=["rain", "moss", "moths"]), "Edit a symmetric relationship matrix."),
        anywidget_card("TangleSlider", lambda: ws.TangleSlider(amount=2.718, min_value=0, max_value=10, step=.001, prefix="growth = ", suffix="×", digits=3), "Drag the number itself."),
        anywidget_card("TangleChoice", lambda: ws.TangleChoice(["moss", "lichen", "fern", "mycelium"]), "Scrub through words in-place."),
        anywidget_card("TangleSelect", lambda: ws.TangleSelect(["linear", "logistic", "chaotic"]), "A compact textual selector."),
        anywidget_card("TangleLatex", lambda: ws.TangleLatex(r"f(x)=\\tangle{a}x^2+\\tangle{b}x", {"a": {"value": 1.5, "min_value": -4, "max_value": 4, "step": .1, "display": "symbol"}, "b": {"value": -1, "min_value": -5, "max_value": 5, "step": .1, "display": "symbol"}}, reveal_all_on_drag=True), "Drag the highlighted symbols inside the equation."),
    ]
    mo.vstack(_cards, gap=1.3)
    return


@app.cell
def _(anywidget_card, mo, wiggly_bench, ws):
    mo.stop(wiggly_bench.value != "Sketches & graphs")
    _dag_a = mo.ui.slider(0, 10, value=4, label="rain")
    _dag_b = mo.ui.slider(0, 10, value=7, label="sun")
    _dag_result = "mean response"
    _cards = [
        anywidget_card("Paint", lambda: ws.Paint(width=700, height=360, rainbow_brush=True), "Paint a local raster and read its pixels back in Python."),
        anywidget_card("Excalidraw", lambda: ws.Excalidraw(height=430, theme="light"), "A full whiteboard scene with synced JSON state."),
        anywidget_card("GraphWidget", lambda: ws.GraphWidget(nodes=[{"id": "seed", "label": "seed"}, {"id": "rain", "label": "rain"}, {"id": "moss", "label": "moss"}, {"id": "moth", "label": "moth"}], edges=[("seed", "moss"), ("rain", "moss"), ("moss", "moth")], height=330), "Drag nodes; add or remove relationships."),
        anywidget_card("GridDraw", lambda: ws.GridDraw(rows=6, cols=10, width=650, height=340, dots=[(1, 1), (2, 3), (4, 7)], lines=[{"source": [1, 1], "target": [2, 3]}]), "Draw paths on a constrained lattice."),
        anywidget_card("EdgeDraw", lambda: ws.EdgeDraw(["capture", "clean", "model", "publish"], links=[("capture", "clean"), ("clean", "model"), ("model", "publish")], width=650, height=320), "Edit a tiny workflow graph."),
        anywidget_card("SortableList", lambda: ws.SortableList(["collect", "question", "model", "verify", "publish"], addable=True, removable=True, editable=True, label="research loop"), "Reorder the pipeline; add and edit steps."),
        mo.vstack([mo.md("### WidgetDAG"), ws.WidgetDAG(nodes={"rain": _dag_a, "sun": _dag_b, "growth": _dag_result}, edges=[("rain", "growth"), ("sun", "growth")]), mo.md("Live Marimo controls laid out as a dependency graph.")]),
    ]
    mo.vstack(_cards, gap=1.3)
    return


@app.cell
async def _(anywidget_card, math, mo, signal_rows, sys, wiggly_bench, ws):
    mo.stop(wiggly_bench.value != "Data & charts")
    if sys.platform == "emscripten":
        import micropip as _micropip

        await _micropip.install(["altair>=6,<7", "matplotlib", "numpy", "pandas"])
    _alt = __import__("altair")
    _plt = __import__("matplotlib.pyplot", fromlist=["pyplot"])
    _np = __import__("numpy")
    _pd = __import__("pandas")

    _frame = _pd.DataFrame(signal_rows)
    _alt_chart = _alt.Chart(_frame).mark_line().encode(x="step:Q", y="value:Q", color="wave:N")

    def _scatter_figure(title):
        _fig, _ax = _plt.subplots(figsize=(6.3, 3.2))
        _x = _np.linspace(-3, 3, 80)
        _ax.scatter(_x, _np.sin(_x * 2) + _x / 4, c=_x, cmap="viridis", s=24)
        _ax.set_title(title)
        _fig.tight_layout()
        return _fig

    def _linear_spline(x, y):
        _order = _np.argsort(x)
        _curve_x = _np.linspace(x.min(), x.max(), 150)
        return _curve_x, _np.interp(_curve_x, x[_order], y[_order])

    _log = ws.ScatterLog(x_label="step", y_label="value", max_points=100, width=640, height=300)
    for _row in signal_rows[::4]:
        _log.append(_row["step"], _row["value"], color=_row["wave"])

    _ridge = _pd.DataFrame(
        {
            "value": [math.sin(i / 3) + band * .7 for band in range(4) for i in range(30)],
            "habitat": [name for name in ["canopy", "meadow", "marsh", "soil"] for _ in range(30)],
        }
    )
    _forecast = _pd.DataFrame({"date": _pd.date_range("2026-01-01", periods=90), "signal": [2 + i * .015 + math.sin(i / 6) * .35 for i in range(90)]})
    _cards = [
        anywidget_card("AltairWidget", lambda: ws.AltairWidget(_alt_chart, width=650, height=300), "Flicker-free reactive Vega updates."),
        anywidget_card("ChartPuck", lambda: ws.ChartPuck(_scatter_figure("drag the puck"), x=0, y=0, puck_color="#db6d28")),
        anywidget_card("ChartSelect", lambda: ws.ChartSelect(_scatter_figure("box or lasso a region"), mode="lasso")),
        anywidget_card("ChartMultiSelect", lambda: ws.ChartMultiSelect(_scatter_figure("paint two classes"), n_classes=2, mode="brush")),
        anywidget_card("ObservablePlot", lambda: ws.ObservablePlot('Plot.plot({marks:[Plot.barY(samples,{x:"step",y:"value",fill:"wave"}),Plot.ruleY([0])]})', variables={"samples": signal_rows}, width=650, height=300, version="0.6.17")),
        anywidget_card("ParallelCoordinates", lambda: ws.ParallelCoordinates(_pd.DataFrame([{"species": "moss", "moisture": 82, "growth": 7.2, "shade": 8}, {"species": "fern", "moisture": 61, "growth": 5.6, "shade": 5}, {"species": "lichen", "moisture": 35, "growth": 3.9, "shade": 2}, {"species": "foxglove", "moisture": 54, "growth": 8.1, "shade": 4}]), color_by="species", height=360)),
        anywidget_card("RidgelineChart", lambda: ws.RidgelineChart(_ridge, width=650, height=360, overlap=.65, x_label="response", y_label="habitat")),
        anywidget_card("ScatterLog", lambda: _log, "A stable chart that accumulates observations instead of resetting on reactivity."),
        anywidget_card("ScatterWidget", lambda: ws.ScatterWidget(n_classes=3, width=650, height=330), "Paint a synthetic classification dataset."),
        anywidget_card("SplineDraw", lambda: ws.SplineDraw(_linear_spline, width=650, height=330), "Draw points; Python fits and returns a curve."),
        anywidget_card("Treemap", lambda: ws.Treemap({"garden": {"plants": {"moss": 34, "fern": 21, "lichen": 13}, "animals": {"moths": 18, "beetles": 8}, "weather": {"rain": 25, "sun": 16}}}, width=650, height=360)),
        anywidget_card("NestedTable", lambda: ws.NestedTable({"garden": {"plants": {"moss": 34, "fern": 21}, "animals": {"moths": 18, "beetles": 8}}, "lab": {"samples": 81, "models": 7}}, initial_expand_depth=2)),
        anywidget_card("forecast_chart", lambda: ws.AltairWidget(ws.forecast_chart(_forecast, "date", "signal", fit_window=45, projection_days=30, title="growth forecast"), width=650, height=340), "The helper returns an Altair chart; AltairWidget keeps it live.", badge="helper function"),
    ]
    mo.vstack(_cards, gap=1.3)
    return


@app.cell
async def _(anywidget_card, base64, io, math, mo, sys, wiggly_bench, ws):
    mo.stop(wiggly_bench.value != "Space, frames & sensors")
    if sys.platform == "emscripten":
        import micropip as _micropip

        await _micropip.install("pillow")
    _pil = __import__("PIL", fromlist=["Image", "ImageDraw"])
    _Image = _pil.Image
    _ImageDraw = _pil.ImageDraw

    _points = [
        {"x": math.cos(i / 8) * (1 + i / 80), "y": math.sin(i / 8) * (1 + i / 80), "z": i / 25 - 2, "color": "#db6d28" if i % 2 else "#568259"}
        for i in range(80)
    ]
    _frames = []
    for _frame_i in range(12):
        _image = _Image.new("RGB", (420, 180), "#111827")
        _draw = _ImageDraw.Draw(_image)
        for _star in range(16):
            _x = (_star * 47 + _frame_i * (_star % 4 + 1) * 5) % 420
            _y = (_star * 31) % 180
            _r = 2 + (_star % 3)
            _draw.ellipse((_x - _r, _y - _r, _x + _r, _y + _r), fill="#f4d35e")
        _frames.append(_image)
    _preview_buffer = io.BytesIO()
    _frames[3].save(_preview_buffer, format="PNG")
    _preview_uri = "data:image/png;base64," + base64.b64encode(_preview_buffer.getvalue()).decode()
    _cards = [
        anywidget_card("ThreeWidget", lambda: ws.ThreeWidget(data=_points, width=650, height=380, show_grid=True, show_axes=True, axis_labels=["x", "y", "time"], auto_rotate=True)),
        anywidget_card("CubeWidget", lambda: ws.CubeWidget(x_axis={"name": "angle", "values": list(range(0, 91, 10))}, y_axis={"name": "force", "values": list(range(0, 101, 10))}, z_axis={"name": "time", "values": [round(i * .25, 2) for i in range(21)]}), "Lock axes to move from volume → plane → line → point."),
        anywidget_card("FramePlayer", lambda: ws.FramePlayer(_frames, interval_ms=90, loop=True, width=650), "A sequence of PIL frames becomes a tiny local movie."),
        anywidget_card("ManimWeb", lambda: ws.ManimWeb(code="""from manim import *\nclass Orbit(Scene):\n    def construct(self):\n        dot = Dot(color=ORANGE)\n        self.play(dot.animate.shift(RIGHT * 2), run_time=2)\n""", width=650, height=360), "Runs Manim WebAssembly in the tab; its own runtime may take a moment."),
        anywidget_card("HoverZoom", lambda: ws.HoverZoom(_preview_uri, zoom_factor=4, width=650), "Hover the generated star field for a magnifying lens."),
        anywidget_card("WebcamCapture", lambda: ws.WebcamCapture(interval_ms=1200, facing_mode="user"), "Requires explicit camera permission; frames remain in the browser.", badge="permission-gated"),
        anywidget_card("WebkitSpeechToTextWidget", lambda: ws.WebkitSpeechToTextWidget(), "Uses the browser's speech-recognition capability where available.", badge="browser-dependent"),
        anywidget_card("GamepadWidget", lambda: ws.GamepadWidget(), "Connect or press a gamepad to inspect axes and buttons.", badge="hardware-optional"),
        anywidget_card("KeystrokeWidget", lambda: ws.KeystrokeWidget(), "Focus the widget and press keys; the event becomes Python state.", badge="focus-gated"),
    ]
    mo.vstack(_cards, gap=1.3)
    return


@app.cell
async def _(anywidget_card, base64, io, mo, sys, wiggly_bench, ws):
    mo.stop(wiggly_bench.value != "Notebook utilities")
    if sys.platform == "emscripten":
        import micropip as _micropip

        await _micropip.install(["numpy", "pillow"])
    _np = __import__("numpy")
    _pil = __import__("PIL", fromlist=["Image", "ImageDraw"])
    _Image = _pil.Image
    _ImageDraw = _pil.ImageDraw

    _image = _Image.new("RGB", (520, 190), "#18212f")
    _draw = _ImageDraw.Draw(_image)
    for _i in range(28):
        _draw.line((0, _i * 7, 520, 190 - _i * 5), fill=(35 + _i * 5, 150, 120), width=2)
    _buffer = io.BytesIO()
    _image.save(_buffer, format="PNG")
    _image_uri = "data:image/png;base64," + base64.b64encode(_buffer.getvalue()).decode()

    def _tiny_model(x, curve=1.7):
        return [{"x": float(v), "y": float(v**curve)} for v in x]

    _cards = [
        anywidget_card("AnnotationWidget", lambda: ws.AnnotationWidget(actions=["keep", "question", "discard"], keyboard_mapping={"1": "keep", "2": "question", "3": "discard"}, width=650), "Label examples by button, key, or gamepad."),
        anywidget_card("ColorPicker", lambda: ws.ColorPicker(color="#568259")),
        anywidget_card("CopyToClipboard", lambda: ws.CopyToClipboard("The garden is a graph with weather."), "Copies only after your click."),
        anywidget_card("TextCompare", lambda: ws.TextCompare("Reactive notebooks make dependencies visible and reproducible.", "Reactive gardens make relationships visible, playful, and reproducible.", min_match_words=2)),
        anywidget_card("PlaySlider", lambda: ws.PlaySlider(value=12, min_value=0, max_value=47, step=1, interval_ms=120, loop=True, width=620)),
        anywidget_card("ProgressBar", lambda: ws.ProgressBar(value=73, max_value=100, color="#568259", width="100%", height=25)),
        anywidget_card("HTMLRefreshWidget", lambda: ws.HTMLRefreshWidget(html="<div style='padding:1rem;border-radius:.7rem;background:linear-gradient(90deg,#56825944,#db6d2844)'><strong>Live HTML state</strong><br/>Useful for server-generated snippets that update in place.</div>")),
        anywidget_card("ImageRefreshWidget", lambda: ws.ImageRefreshWidget(src=_image_uri), "A data URI stands in for a repeatedly regenerated plot."),
        anywidget_card("EsmWidget", lambda: ws.EsmWidget("""export default { render({model, el}) { const b=document.createElement('button'); b.textContent='poke the JavaScript ↔ Python bridge'; b.style.cssText='padding:1rem;border-radius:999px;border:1px solid currentColor;background:transparent;color:inherit'; b.onclick=()=>{ const n=(model.get('data').pokes||0)+1; model.set('data',{pokes:n}); model.save_changes(); b.textContent=`bridge poked ${n}×`; }; el.appendChild(b); } }""", data={"pokes": 0}, width=650, height=90), "A trusted inline ES module with a two-way data trait."),
        anywidget_card("LiveEdit", lambda: ws.LiveEdit("def power_curve(x, curve=1.7):\n    return [{'x': float(v), 'y': float(v ** curve)} for v in x]", args=(_np.linspace(0, 1, 12),), function_name="power_curve", editable=True, height=330), "Edit and rerun a small function inside the widget."),
        anywidget_card("inspect_run", lambda: ws.inspect_run(_tiny_model, _np.linspace(0, 1, 12), curve=1.7), "Function helper that produces a LiveEdit inspector.", badge="helper function"),
        anywidget_card("ApiDoc", lambda: ws.ApiDoc(ws.Slider2D, width=650), "Live signature and documentation for a Python object."),
    ]
    mo.vstack(_cards, gap=1.3)
    return


@app.cell
def _(anywidget_card, capability_card, mo, wiggly_bench, ws):
    mo.stop(wiggly_bench.value != "Runtime & integrations")
    _cards = [
        capability_card("AsyncFlow", "Python 3.12 `sys.monitoring` in a full Marimo kernel", "flow = await ws.AsyncFlow.trace(my_async_pipeline())\nmo.ui.anywidget(flow)"),
        anywidget_card("CellTour", lambda: ws.CellTour(steps=[{"cell_name": "native_deck", "popover": {"title": "Marimo deck", "description": "Switch component families here.", "side": "bottom"}}], auto_start=False), "Targets named cells in the full editor; exported islands may not retain those names.", badge="editor-context"),
        anywidget_card("DriverTour", lambda: ws.DriverTour(steps=[{"element": "[data-showcase-hero]", "popover": {"title": "The Reactive Garden", "description": "This tour targets ordinary page CSS.", "side": "bottom"}}], auto_start=False), "A CSS-targeted tour can guide either an app or a published page."),
        anywidget_card("EnvConfig", lambda: ws.EnvConfig({"DEMO_GARDEN_NAME": None}), "A harmless placeholder demonstrates validation. Never paste a real secret into a public notebook.", badge="local environment"),
        capability_card("ModuleTreeWidget", "a live PyTorch module and the optional `torch` extra", "model = torch.nn.Sequential(...)\nmo.ui.anywidget(ws.ModuleTreeWidget(model))"),
        capability_card("Neo4jWidget", "a Neo4j driver, database URL, and credentials", "mo.ui.anywidget(ws.Neo4jWidget(driver, initial_query='MATCH (n) RETURN n LIMIT 50'))"),
        capability_card("WandbChart", "a Weights & Biases run plus authenticated network access", "mo.ui.anywidget(ws.WandbChart(run, chart='loss'))"),
    ]
    mo.vstack(_cards, gap=1.3)
    return


@app.cell
def _(MARIMO_COMPONENTS, WIGGLY_COMPONENTS, WIGGLY_GROUPS, mo):
    mo.md(
        """
        ## 4 · Exhaustive inventory

        This is the audit trail. “Live” means it can run in this static browser
        notebook; the other labels name a real requirement. Use the search box
        and column filters to find a component by purpose or runtime.
        """
    )
    _permission = {
        "microphone", "WebcamCapture", "WebkitSpeechToTextWidget",
        "GamepadWidget", "KeystrokeWidget",
    }
    _server = {"panel", "AsyncFlow", "ModuleTreeWidget", "Neo4jWidget", "WandbChart"}
    _context = {"file_browser", "CellTour", "EnvConfig"}
    _helpers = {"forecast_chart", "inspect_run", "WidgetDAG"}
    _rows = []
    for _name in MARIMO_COMPONENTS:
        _mode = "permission" if _name in _permission else "server/extra" if _name in _server else "contextual" if _name in _context else "live"
        _rows.append({"library": "Marimo", "component": _name, "mode": _mode, "family": "native UI"})
    for _family, _names in WIGGLY_GROUPS.items():
        for _name in _names:
            _mode = "permission" if _name in _permission else "server/extra" if _name in _server else "contextual" if _name in _context else "helper" if _name in _helpers else "live"
            _rows.append({"library": "WigglyStuff", "component": _name, "mode": _mode, "family": _family})
    component_inventory = mo.ui.table(
        _rows,
        page_size=20,
        selection="multi",
        show_column_summaries=True,
        freeze_columns_left=["library", "component"],
        label=f"{len(MARIMO_COMPONENTS)} Marimo names + {len(WIGGLY_COMPONENTS)} WigglyStuff names",
    )
    component_inventory
    return (component_inventory,)


@app.cell
def _(component_inventory, mo):
    mo.md(
        f"""
        Selected inventory rows: **{len(component_inventory.value)}**.

        ### What this page proves

        - Quartz can publish a Marimo notebook as a normal garden note while its Python runs locally.
        - Native controls, tabular analysis, plots, and third-party AnyWidgets share one reactive graph.
        - A static site can still expose honest permission, hardware, package, credential, and server boundaries.

        The best notebook widgets are not ornamental. They make the model's
        assumptions graspable—something you can drag, sketch, select, reorder,
        inspect, and contradict.
        """
    )
    return


if __name__ == "__main__":
    app.run()
