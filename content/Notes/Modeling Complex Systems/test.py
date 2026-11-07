import marimo

__generated_with = "0.25.2"
app = marimo.App(width="medium", layout_file="layouts/test.slides.json")


@app.cell
def _():
    import marimo as mo
    import pandas as pd

    return mo, pd


@app.cell
def _(pd):
    df = pd.read_csv("https://raw.githubusercontent.com/ageron/handson-ml/refs/heads/master/datasets/housing/housing.csv")
    df
    return


@app.cell
def _(mo):
    slider = mo.ui.slider(0,1,0.01)
    slider
    return (slider,)


@app.cell
def _(slider):
    print(slider.value)
    return


if __name__ == "__main__":
    app.run()
