# description: Smoke test for marimo islands rendering in Quartz
# tags: marimo, test

import marimo

__generated_with = "0.23.6"
app = marimo.App(app_title="Marimo Islands Test")


@app.cell
def _():
    import marimo as mo

    return (mo,)


@app.cell
def _(mo):
    mo.md(r"""
    # Marimo Islands Test

    This page is generated from a `.marimo.py` notebook that gets compiled at
    build time by `MarimoIslandGenerator`, then made interactive in the browser
    by the marimo islands runtime.

    Move the slider — the value below should update reactively:
    """)
    return


@app.cell
def _(mo):
    n = mo.ui.slider(start=1, stop=20, value=5, step=1, label="n")
    n
    return (n,)


@app.cell
def _(mo, n):
    mo.md(f"""
    You picked **n = {n.value}**.  Its square is **{n.value ** 2}**.
    """)
    return


if __name__ == "__main__":
    app.run()
