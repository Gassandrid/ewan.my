# description: Smoke test for marimo islands widgets and reactive layout in Quartz
# tags: marimo, test, widgets

import marimo

__generated_with = "0.23.8"
app = marimo.App(app_title="Marimo Widgets Smoke Test")


@app.cell
def _():
    import math
    import marimo as mo

    return math, mo


@app.cell
def _(mo):
    mo.md(
        r"""
        # Marimo Widgets Smoke Test

        This page exercises the Quartz marimo-islands bridge: hydrated widgets,
        reactive cells, tables, layout helpers, and markdown updates.
        """
    )
    return


@app.cell
def _(mo):
    amplitude = mo.ui.slider(start=1, stop=10, value=4, step=1, label="amplitude")
    frequency = mo.ui.slider(start=1, stop=8, value=3, step=1, label="frequency")
    phase = mo.ui.range_slider(start=0, stop=6, value=[1, 4], step=1, label="active phase")
    enabled = mo.ui.switch(value=True, label="animate")
    mode = mo.ui.dropdown(["sine", "square", "triangle"], value="sine", label="wave")
    palette = mo.ui.radio(["rust", "sage", "slate"], value="rust", label="palette")

    mo.vstack(
        [
            mo.hstack([amplitude, frequency], widths="equal", gap=1),
            mo.hstack([phase, enabled], widths="equal", gap=1),
            mo.hstack([mode, palette], widths="equal", gap=1),
        ],
        gap=1,
    )
    return amplitude, enabled, frequency, mode, palette, phase


@app.cell
def _(amplitude, enabled, frequency, math, mode, palette, phase):
    rows = []
    start, stop = phase.value

    for step in range(12):
        x = step / 11
        theta = x * math.tau * frequency.value
        if mode.value == "square":
            raw = 1 if math.sin(theta) >= 0 else -1
        elif mode.value == "triangle":
            raw = 2 * abs(2 * ((x * frequency.value) % 1) - 1) - 1
        else:
            raw = math.sin(theta)

        active = start <= step <= stop and enabled.value
        rows.append(
            {
                "step": step,
                "active": active,
                "wave": mode.value,
                "palette": palette.value,
                "value": round(raw * amplitude.value if active else 0, 3),
            }
        )

    return rows


@app.cell
def _(amplitude, enabled, frequency, mode, mo, palette, phase, rows):
    max_value = max(abs(row["value"]) for row in rows)
    mo.md(
        f"""
        **{mode.value.title()}** wave, amplitude **{amplitude.value}**,
        frequency **{frequency.value}**, palette **{palette.value}**.

        Active phase window: **{phase.value[0]} to {phase.value[1]}**.
        Animation switch: **{"on" if enabled.value else "off"}**.
        Max absolute value: **{max_value:.3f}**.
        """
    )
    return


@app.cell
def _(mo, rows):
    mo.ui.table(
        rows,
        page_size=6,
        selection="single",
        show_column_summaries=True,
        label="computed wave samples",
    )
    return


if __name__ == "__main__":
    app.run()
