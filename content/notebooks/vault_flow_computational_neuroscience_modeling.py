import marimo

__generated_with = "scripts/vault-ctx marimo-lab"

app = marimo.App(width="medium")

@app.cell
def _():
    import json
    from pathlib import Path
    import pandas as pd
    import altair as alt
    SNAPSHOT = Path('.ctx-vault/computational-neuroscience-modeling-flow.json')
    data = json.loads(SNAPSHOT.read_text())
    data
    return alt, data, pd

@app.cell
def _(data, pd):
    rows = data.get("series") or data.get("states") or data.get("features") or []
    df = pd.DataFrame(rows)
    df
    return df,

@app.cell
def _(alt, df):
    numeric = [c for c in df.columns if df[c].dtype.kind in "if" and c not in {"rank"}]
    charts = []
    if "period" in df.columns:
        for c in numeric[:6]:
            charts.append(alt.Chart(df).mark_line(point=True).encode(x="period:N", y=f"{c}:Q", tooltip=list(df.columns[:8])).properties(title=c))
    elif "degree" in df.columns and "words" in df.columns:
        charts.append(alt.Chart(df).mark_circle(size=80).encode(x="words:Q", y="degree:Q", tooltip=list(df.columns[:8])))
    alt.vconcat(*charts) if charts else df
    return

if __name__ == "__main__":
    app.run()
