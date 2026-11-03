# description: Sliding a short wiggle along a signal separates the slow drop of a fall from its impact.
# tags:
#   - math/waves/signals
#   - engineering/sensors/wearable
#   - generated/claude
# class:
#   - note
# date: 2026-11-03
# updated: 2026-11-03
# /// script
# requires-python = ">=3.12"
# dependencies = [
#     "anywidget",
#     "marimo==0.25.2",
#     "numpy",
#     "traitlets",
#     "wigglystuff==0.5.36",
# ]
# ///
import marimo

__generated_with = "0.25.2"
app = marimo.App(width="medium", app_title="Wavelets Find the Fall")

with app.setup(hide_code=True):
    import base64
    import json
    import zlib

    import anywidget
    import marimo as mo
    import numpy as np
    import traitlets
    from wigglystuff import TangleLatex

    FS = 100                      # Hz, every signal in this notebook
    # The nine BME3740 sample trials: IMU 1 (trunk) acceleration magnitude in g at 100 Hz.
    # Written by `scripts/export-wavelet-trials` in Lab/projects/marimo from DATA/wearable-falls/bme3740-sample-v1.
    TRIAL_DATA = "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"
    THEME_JS = r"""
    function followTheme(root, onChange) {
      const apply = () => {
        const b = document.body, h = document.documentElement;
        const dark = ["dark", "dark-theme"].some((c) => b.classList.contains(c) || h.classList.contains(c))
          || b.dataset.theme === "dark" || h.dataset.theme === "dark" || h.getAttribute("saved-theme") === "dark";
        root.classList.toggle("dark", dark);
        if (onChange) onChange();
      };
      apply();
      const watch = new MutationObserver(apply);
      for (const n of [document.body, document.documentElement])
        watch.observe(n, { attributes: true, attributeFilter: ["class", "data-theme", "saved-theme"] });
      return () => watch.disconnect();
    }
    const NS = "http://www.w3.org/2000/svg";
    function node(tag, attrs, parent) {
      const n = document.createElementNS(NS, tag);
      for (const k in attrs) n.setAttribute(k, attrs[k]);
      if (parent) parent.appendChild(n);
      return n;
    }
    """
    PALETTE_CSS = """
      --pos: #899780; --neg: #AD6E60; --accent: #E89A39;
    }
    .dark {
      --pos: #AEBD9F; --neg: #DB8E88; --accent: #E0BC7E;
    """


@app.cell(hide_code=True)
def _():
    mo.md("""
    *I had Claude create this marimo notebook for visualization as a test of learning capabilities.*
    """)
    return


@app.cell(hide_code=True)
def _():
    mo.md(r"""
    A fall is a slow change of posture with a sharp impact at its end. A wavelet transform measures
    both at once: it slides a short wiggle along the signal and records how much area the two
    share at every moment and every frequency. Below, sliding as area ([[Convolutions|convolution]]),
    then a wavelet you shape, then the nine BME3740 sample trials from a trunk [[Inertial measurement units|IMU]].
    """)
    return


@app.function(hide_code=True)
def toy_signal():
    """12 s: a 0.25 Hz swell with a brief 6 Hz burst near t = 8 s."""
    t = np.arange(0, 12, 1 / FS)
    slow = np.sin(2 * np.pi * 0.25 * t)
    burst = 0.35 * np.exp(-((t - 8) ** 2) / (2 * 0.25**2)) * np.sin(2 * np.pi * 6 * t)
    return t, slow + burst


@app.function(hide_code=True)
def svg_path(xs, ys, x_range, y_range, w, h, close=False):
    x0, x1 = x_range
    y0, y1 = y_range
    px = (np.asarray(xs) - x0) / (x1 - x0) * w
    py = h - (np.asarray(ys) - y0) / (y1 - y0) * h
    d = "M" + "L".join(f"{a:.1f},{b:.1f}" for a, b in zip(px, py))
    return d + ("Z" if close else "")


@app.cell(hide_code=True)
def _():
    _t, _y = toy_signal()
    _amp = 2 * np.abs(np.fft.rfft(_y)) / len(_y)
    _f = np.fft.rfftfreq(len(_y), 1 / FS)
    _keep = _f <= 10
    _w, _h, _sw = 620, 120, 200
    _sig = svg_path(_t, _y, (0, 12), (-1.45, 1.45), _w, _h)
    _spec = svg_path(_f[_keep], _amp[_keep], (0, 10), (0, 1.1), _sw, _h)
    _burst = _amp[(_f > 5) & (_f < 7)].max()
    _bx = 6 / 10 * _sw
    _by = _h - _burst / 1.1 * _h
    mo.md(rf"""
    ## Fourier hears the burst but not when

    The test signal is a slow swell with a small 6 Hz burst riding on it. Its spectrum shows both
    frequencies, but the burst's peak carries no clock: the same [[Fourier Transform|spectrum]] fits a burst at any time.

    {mo.Html(f'''
    <div style="display:flex;gap:28px;flex-wrap:wrap;align-items:flex-end;color:inherit">
      <svg viewBox="0 0 {_w} {_h + 16}" width="{_w}" height="{_h + 16}" style="max-width:100%;height:auto;overflow:visible">
        <line x1="0" x2="{_w}" y1="{_h / 2}" y2="{_h / 2}" stroke="currentColor" stroke-opacity=".12"/>
        <path d="{_sig}" fill="none" stroke="currentColor" stroke-width="1.4"/>
        <text x="0" y="{_h + 14}" font-size="11" fill="currentColor" fill-opacity=".55">0 s</text>
        <text x="{_w}" y="{_h + 14}" font-size="11" text-anchor="end" fill="currentColor" fill-opacity=".55">12 s</text>
      </svg>
      <svg viewBox="0 0 {_sw} {_h + 16}" width="{_sw}" height="{_h + 16}" style="max-width:100%;height:auto;overflow:visible">
        <line x1="0" x2="{_sw}" y1="{_h}" y2="{_h}" stroke="currentColor" stroke-opacity=".2"/>
        <path d="{_spec}" fill="none" stroke="currentColor" stroke-width="1.4"/>
        <text x="{0.25 / 10 * _sw + 6}" y="{_h - 1 / 1.1 * _h + 10}" font-size="11" fill="currentColor" fill-opacity=".7">0.25 Hz</text>
        <text x="{_bx}" y="{_by - 6}" font-size="11" text-anchor="middle" fill="currentColor" fill-opacity=".7">6 Hz</text>
        <text x="{_sw}" y="{_h + 14}" font-size="11" text-anchor="end" fill="currentColor" fill-opacity=".55">10 Hz</text>
      </svg>
    </div>''')}
    """)
    return


@app.class_definition(hide_code=True)
class Slide(anywidget.AnyWidget):
    """signals / kernels: [{name, symbol, dt, y}]; kernels are centred, odd length.

    The browser computes the sliding area and draws three rows: kernel over
    signal, their product, and the running output. ``position`` (0..1) is
    the kernel centre, kept across re-renders.
    """

    _esm = THEME_JS + r"""
    function render({ model, el }) {
      const root = document.createElement("div");
      root.className = "slide";
      const bar = document.createElement("div");
      bar.className = "bar";
      const play = document.createElement("button");
      play.type = "button";
      play.className = "play";
      const sigPills = document.createElement("div");
      const kerPills = document.createElement("div");
      sigPills.className = kerPills.className = "pills";
      bar.append(play, sigPills, kerPills);
      const svg = node("svg", { class: "plot", tabindex: "0", role: "slider", "aria-label": "Kernel position" });
      root.append(bar, svg);
      el.appendChild(root);
      const unfollow = followTheme(root);

      const ROW = [150, 80, 104], LABEL = 22, PAD = 6;
      const tops = [LABEL, 2 * LABEL + ROW[0], 3 * LABEL + ROW[0] + ROW[1]];
      const H = tops[2] + ROW[2] + 4;
      let W = 640, S, K, out, n = 2, m, c, yMax, kScale, pMax, oLo, oHi, idx = 0, pos = 0;
      let dyn = null, raf = 0, playRaf = 0, playing = false, dragging = false, lastTs = 0;

      const X = (i) => PAD + (i / (n - 1)) * (W - 2 * PAD);
      const Y0 = (v) => tops[0] + ROW[0] / 2 - (v / yMax) * (ROW[0] / 2 - 4);
      const Y1 = (v) => tops[1] + ROW[1] / 2 - (v / pMax) * (ROW[1] / 2 - 3);
      const Y2 = (v) => tops[2] + ((oHi - v) / (oHi - oLo)) * ROW[2];
      const f1 = (v) => v.toFixed(1);

      function pills(box, items, current, key) {
        box.replaceChildren();
        box.hidden = items.length < 2;
        for (const it of items) {
          const b = document.createElement("button");
          b.type = "button";
          b.textContent = it.name;
          b.setAttribute("aria-pressed", String(it.name === current));
          b.addEventListener("click", () => { model.set(key, it.name); model.save_changes(); });
          box.appendChild(b);
        }
      }

      function prepare() {
        const sigs = model.get("signals"), kers = model.get("kernels");
        S = sigs.find((s) => s.name === model.get("signal")) || sigs[0];
        K = kers.find((k) => k.name === model.get("kernel")) || kers[0];
        const y = S.y, k = K.y;
        n = y.length; m = k.length; c = (m - 1) >> 1;
        out = new Float64Array(n);
        for (let i = 0; i < n; i++) {
          let s = 0;
          for (let j = 0; j < m; j++) s += y[Math.min(n - 1, Math.max(0, i + j - c))] * k[j];
          out[i] = s * S.dt;
        }
        yMax = 1e-9; for (const v of y) yMax = Math.max(yMax, Math.abs(v));
        let kMax = 1e-9; for (const v of k) kMax = Math.max(kMax, Math.abs(v));
        kScale = (0.92 * yMax) / kMax;
        pMax = yMax * kMax;
        oLo = 0; oHi = 0; for (const v of out) { oLo = Math.min(oLo, v); oHi = Math.max(oHi, v); }
        const pad = 0.08 * (oHi - oLo || 1); oLo -= pad; oHi += pad;
        pos = model.get("position") * (n - 1);
        idx = Math.round(pos);
        pills(sigPills, sigs, S.name, "signal");
        pills(kerPills, kers, K.name, "kernel");
      }

      function line(arr, Yf, from, to) {
        let d = "";
        for (let i = from; i < to; i++) d += (d ? "L" : "M") + f1(X(i)) + "," + f1(Yf(arr[i]));
        return d;
      }

      function draw() {
        W = Math.max(300, Math.round(root.clientWidth || 640));
        svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
        svg.setAttribute("width", W);
        svg.setAttribute("height", H);
        svg.replaceChildren();
        const s = S.symbol, k = K.symbol;
        [`${s}(t),  ${k}(t − τ)`, `${s}(t) · ${k}(t − τ)`, `∫ ${s}(t) ${k}(t − τ) dt`].forEach((txt, r) => {
          node("text", { class: "lab", x: PAD, y: tops[r] - 7 }, svg).textContent = txt;
        });
        for (const yy of [Y0(0), Y1(0), Y2(0)]) node("line", { class: "axis", x1: PAD, x2: W - PAD, y1: yy, y2: yy }, svg);
        node("path", { class: "sig", d: line(S.y, Y0, 0, n) }, svg);
        node("path", { class: "faint", d: line(out, Y2, 0, n) }, svg);
        dyn = node("g", {}, svg);
        update();
      }

      function fill(a, b, val, Yf, target) {
        let run = "", sgn = 0, last = 0;
        const base = f1(Yf(0));
        const flush = () => { if (run) target[sgn > 0 ? 0 : 1] += run + "L" + f1(X(last)) + "," + base + "Z"; run = ""; };
        for (let j = a; j < b; j++) {
          const i = idx + j - c, p = S.y[i] * K.y[j], sg = p > 0 ? 1 : p < 0 ? -1 : 0;
          if (sg !== sgn) { flush(); sgn = sg; }
          if (sg !== 0) {
            const xx = f1(X(i));
            if (!run) run = "M" + xx + "," + base;
            run += "L" + xx + "," + f1(Yf(val(j, i)));
            last = i;
          }
        }
        flush();
      }

      function update() {
        if (!dyn) return;
        dyn.replaceChildren();
        const a = Math.max(0, c - idx), b = Math.min(m, n - idx + c);
        const top = ["", ""], mid = ["", ""];
        fill(a, b, (j) => K.y[j] * kScale, Y0, top);
        fill(a, b, (j, i) => K.y[j] * S.y[i], Y1, mid);
        node("path", { class: "pos", d: top[0] + mid[0] }, dyn);
        node("path", { class: "neg", d: top[1] + mid[1] }, dyn);
        let dk = "", dp = "";
        for (let j = a; j < b; j++) {
          const i = idx + j - c, xx = f1(X(i));
          dk += (dk ? "L" : "M") + xx + "," + f1(Y0(K.y[j] * kScale));
          dp += (dp ? "L" : "M") + xx + "," + f1(Y1(K.y[j] * S.y[i]));
        }
        node("path", { class: "ker", d: dk }, dyn);
        node("path", { class: "prod", d: dp }, dyn);
        node("path", { class: "out", d: line(out, Y2, 0, idx + 1) }, dyn);
        const x = X(idx);
        node("line", { class: "cursor", x1: x, x2: x, y1: tops[0], y2: tops[2] + ROW[2] }, dyn);
        node("circle", { class: "dot", cx: x, cy: Y2(out[idx]), r: 3.5 }, dyn);
        svg.setAttribute("aria-valuenow", String(idx));
      }

      const schedule = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; update(); }); };
      const commit = () => { model.set("position", idx / (n - 1)); model.save_changes(); };
      const setPlay = () => {
        play.textContent = playing ? "❚❚" : "▶";
        play.setAttribute("aria-label", playing ? "Pause" : "Play");
      };
      function tick(ts) {
        if (!playing) return;
        const dms = lastTs ? ts - lastTs : 16;
        lastTs = ts;
        pos = Math.min(n - 1, pos + ((n - 1) * dms) / 7000);
        idx = Math.round(pos);
        update();
        if (idx >= n - 1) { stop(); return; }
        playRaf = requestAnimationFrame(tick);
      }
      function start() {
        if (idx >= n - 1) { pos = 0; idx = 0; }
        pos = idx; playing = true; lastTs = 0; setPlay();
        playRaf = requestAnimationFrame(tick);
      }
      function stop() {
        if (!playing) return;
        playing = false; cancelAnimationFrame(playRaf); setPlay(); commit();
      }
      play.addEventListener("click", () => (playing ? stop() : start()));

      const at = (e) => {
        const r = svg.getBoundingClientRect();
        const px = (e.clientX - r.left) * (W / r.width);
        return Math.round(Math.min(1, Math.max(0, (px - PAD) / (W - 2 * PAD))) * (n - 1));
      };
      svg.addEventListener("pointerdown", (e) => {
        stop(); dragging = true; svg.setPointerCapture(e.pointerId);
        idx = at(e); pos = idx; schedule();
      });
      svg.addEventListener("pointermove", (e) => { if (dragging) { idx = at(e); pos = idx; schedule(); } });
      const end = () => { if (dragging) { dragging = false; commit(); } };
      svg.addEventListener("pointerup", end);
      svg.addEventListener("pointercancel", end);
      svg.addEventListener("keydown", (e) => {
        const step = Math.max(1, Math.round((n - 1) / (e.shiftKey ? 10 : 100)));
        const next = { ArrowRight: idx + step, ArrowLeft: idx - step, Home: 0, End: n - 1 }[e.key];
        if (next === undefined) return;
        e.preventDefault(); stop();
        idx = Math.min(n - 1, Math.max(0, next)); pos = idx; update(); commit();
      });

      const rebuild = () => { prepare(); draw(); };
      const ro = new ResizeObserver(() => {
        if (Math.abs(Math.round(root.clientWidth) - W) > 1) draw();
      });
      ro.observe(root);
      for (const ev of ["change:signals", "change:kernels", "change:signal", "change:kernel"]) model.on(ev, rebuild);
      setPlay();
      rebuild();

      return () => {
        playing = false;
        cancelAnimationFrame(raf); cancelAnimationFrame(playRaf);
        for (const ev of ["change:signals", "change:kernels", "change:signal", "change:kernel"]) model.off(ev, rebuild);
        ro.disconnect(); unfollow(); root.remove();
      };
    }
    export default { render };
    """
    _css = (
        """
    .slide { color: inherit; font: inherit; font-size: 13px;"""
        + PALETTE_CSS
        + """
    }
    .slide .bar { display: flex; gap: 10px 14px; align-items: center; flex-wrap: wrap; margin-bottom: 4px; }
    .slide .pills { display: flex; gap: 4px; flex-wrap: wrap; }
    .slide .pills[hidden] { display: none; }
    .slide button {
      font: inherit; color: inherit; background: transparent; cursor: pointer;
      border: 1px solid color-mix(in srgb, currentColor 20%, transparent);
      border-radius: 999px; padding: 2px 11px; line-height: 1.5;
    }
    .slide .play { width: 34px; padding: 2px 0; font-size: 11px; }
    .slide button[aria-pressed="true"] {
      background: color-mix(in srgb, currentColor 11%, transparent);
      border-color: color-mix(in srgb, currentColor 45%, transparent);
    }
    .slide .plot { display: block; max-width: 100%; touch-action: none; cursor: ew-resize; user-select: none; }
    .slide .plot:focus-visible { outline: 1px dashed color-mix(in srgb, currentColor 40%, transparent); outline-offset: 2px; }
    .slide .axis { stroke: currentColor; stroke-opacity: .12; }
    .slide .sig { fill: none; stroke: currentColor; stroke-opacity: .38; stroke-width: 1.3; }
    .slide .ker { fill: none; stroke: currentColor; stroke-width: 2; }
    .slide .prod { fill: none; stroke: currentColor; stroke-width: 1.3; }
    .slide .pos { fill: var(--pos); fill-opacity: .6; }
    .slide .neg { fill: var(--neg); fill-opacity: .6; }
    .slide .faint { fill: none; stroke: currentColor; stroke-opacity: .13; stroke-width: 1.3; }
    .slide .out { fill: none; stroke: var(--accent); stroke-width: 2.2; }
    .slide .dot { fill: var(--accent); }
    .slide .cursor { stroke: currentColor; stroke-opacity: .45; stroke-dasharray: 3 4; }
    .slide .lab {
      fill: currentColor; fill-opacity: .75; font-size: 15px;
      font-family: "IM Fell DW Pica", "Iowan Old Style", Georgia, serif; font-style: italic;
    }
    """
    )
    signals = traitlets.List([]).tag(sync=True)
    kernels = traitlets.List([]).tag(sync=True)
    signal = traitlets.Unicode("").tag(sync=True)
    kernel = traitlets.Unicode("").tag(sync=True)
    position = traitlets.Float(0.5).tag(sync=True)


@app.function(hide_code=True)
def series(name, y, symbol="y"):
    return {"name": name, "symbol": symbol, "dt": 1 / FS, "y": np.round(np.asarray(y, float), 5).tolist()}


@app.function(hide_code=True)
def centred(width_s):
    """Odd-length time axis, centred on zero, at FS."""
    half = int(round(width_s * FS))
    return np.arange(-half, half + 1) / FS


@app.cell(hide_code=True)
def _():
    _pulse_t = np.arange(0, 8, 1 / FS)
    _toy_t, _toy_y = toy_signal()
    _box = centred(0.4)
    _bump, _edge = centred(0.8), centred(1.0)
    convolution = Slide(
        signals=[
            series("pulse", ((_pulse_t >= 3) & (_pulse_t < 4.5)).astype(float)),
            series("step", (_pulse_t >= 4).astype(float)),
            series("swell + burst", _toy_y),
        ],
        kernels=[
            series("box", np.full(len(_box), 1 / 0.8), "k"),
            series("bump", np.exp(-(_bump**2) / (2 * 0.2**2)) / (np.sqrt(2 * np.pi) * 0.2), "k"),
            series("edge", _edge * np.exp(-(_edge**2) / (2 * 0.25**2)) / 0.25**2, "k"),
        ],
        signal="pulse",
        kernel="box",
        position=0.42,
    )
    mo.vstack([
        mo.md(r"""
        ## Convolution is a sliding area

        Lay a kernel $k$ over the signal $y$, multiply them point by point, and take the area under the
        product. Green is where they agree in sign and add; red is where they disagree and subtract.
        Slide $k$ along and the areas trace the output:

        $$(y \star k)(\tau) = \int y(t)\, k(t-\tau)\, dt$$

        Drag across the plot or press play. A box averages, a bump smooths, an edge kernel fires on steps.
        Strictly, convolution flips $k$ first; wavelet transforms slide it unflipped, as here.
        """),
        convolution,
    ])
    return


@app.cell(hide_code=True)
def _():
    shape = mo.ui.anywidget(
        TangleLatex(
            latex=r"\begin{gathered} \rule{0pt}{1.4em}\psi(t) = \cos(2\pi \cdot \tangle{f}\, t)\, \exp\!\Big(-\tfrac{1}{2}\big(t/\sigma\big)^{2}\Big) \\[6pt] \sigma = \frac{\tangle{n}}{2\pi \cdot \tangle{f}} \end{gathered}",
            parameters={
                "f": {"value": 6, "min_value": 0.5, "max_value": 15, "step": 0.25, "digits": 2,
                      "display": "symbol", "symbol": "f", "label": "frequency in Hz", "pixels_per_step": 4, "color": {"light": "#C47A1F", "dark": "#E0BC7E"}},
                "n": {"value": 5, "min_value": 0.5, "max_value": 12, "step": 0.5, "digits": 1,
                      "display": "symbol", "symbol": "n", "label": "cycles under the envelope", "pixels_per_step": 8, "color": {"light": "#587571", "dark": "#8DAEB3"}},
            },
            theme=mo.app_meta().theme if mo.app_meta().theme in ("light", "dark") else "auto",
        )
    )
    return (shape,)


@app.cell(hide_code=True)
def _(shape):
    f_wave = float(shape.value["values"]["f"])
    n_cycles = float(shape.value["values"]["n"])
    return f_wave, n_cycles


@app.function(hide_code=True)
def real_wavelet(f, n):
    """cos(2πft) under a Gaussian with n/2π cycles per σ, cut at ±3.5σ."""
    sigma = n / (2 * np.pi * f)
    t = centred(3.5 * sigma)
    env = np.exp(-(t**2) / (2 * sigma**2))
    return env * np.cos(2 * np.pi * f * t), env


@app.function(hide_code=True)
def wavelet_preview(f, n, half=1.5, w=300, h=120):
    """ψ on a fixed ±half s axis, so f changes its spacing and n its width."""
    sigma = n / (2 * np.pi * f)
    t = np.linspace(-half, half, 1200)
    env = np.exp(-(t**2) / (2 * sigma**2))
    psi = env * np.cos(2 * np.pi * f * t)
    rng, mid = (-half, half), (-1.1, 1.1)
    line = svg_path(t, psi, rng, mid, w, h)
    base = h / 2
    pos = svg_path(np.r_[-half, t, half], np.r_[0, np.maximum(psi, 0), 0], rng, mid, w, h, close=True)
    neg = svg_path(np.r_[-half, t, half], np.r_[0, np.minimum(psi, 0), 0], rng, mid, w, h, close=True)
    up = svg_path(t, env, rng, mid, w, h)
    down = svg_path(t, -env, rng, mid, w, h)
    muted = 'fill="currentColor" fill-opacity=".5" font-size="11"'
    return mo.Html(f'''
    <svg viewBox="0 0 {w} {h + 16}" width="{w}" height="{h + 16}" style="max-width:100%;height:auto;color:inherit;overflow:visible" aria-label="The wavelet ψ">
      <line x1="0" x2="{w}" y1="{base}" y2="{base}" stroke="currentColor" stroke-opacity=".12"/>
      <path d="{pos}" fill="#899780" fill-opacity=".45"/>
      <path d="{neg}" fill="#AD6E60" fill-opacity=".45"/>
      <path d="{up}" fill="none" stroke="currentColor" stroke-opacity=".35" stroke-dasharray="3 3"/>
      <path d="{down}" fill="none" stroke="currentColor" stroke-opacity=".35" stroke-dasharray="3 3"/>
      <path d="{line}" fill="none" stroke="currentColor" stroke-width="1.6"/>
      <text x="0" y="{h + 14}" {muted}>−{half:g} s</text>
      <text x="{w}" y="{h + 14}" text-anchor="end" {muted}>{half:g} s</text>
    </svg>''')


@app.cell(hide_code=True)
def _(f_wave, n_cycles, shape):
    psi, _env = real_wavelet(f_wave, n_cycles)
    leak = abs(psi.sum()) / _env.sum()
    _share = f"{leak:.1%}" if leak >= 0.001 else "under 0.1%"
    _why = (
        "so a slow wave passing under it cancels itself out"
        if leak < 0.02
        else "so even a flat offset registers; more cycles bring it to zero"
    )
    mo.md(rf"""
    ## A wavelet is a kernel with a frequency

    Wrap a cosine in a Gaussian and you have a kernel that responds only to its own frequency, and only
    where it sits. Drag $f$ (frequency, Hz) and $n$ (cycles under the envelope) in the equation.

    {mo.hstack([shape, wavelet_preview(f_wave, n_cycles)], justify="start", align="center", gap=1.5, wrap=True)}

    Its net area is {_share} of its envelope's, {_why}. Slide it over the swell and burst: near 6 Hz the
    output stays flat across the swell and rings only at the burst. Drop $f$ toward 0.25 Hz and the
    swell takes over.
    """)
    return (psi,)


@app.cell(hide_code=True)
def _():
    _t, _y = toy_signal()
    wavelet_view = Slide(signals=[series("swell + burst", _y)], kernels=[], position=0.62)
    return (wavelet_view,)


@app.cell(hide_code=True)
def _(psi, wavelet_view):
    wavelet_view.kernels = [series("ψ", psi, "ψ")]
    wavelet_view
    return


@app.function(hide_code=True)
def conv_same(x, k):
    """Linear convolution, output aligned with x (odd-length k), via the FFT."""
    size = len(x) + len(k) - 1
    nfft = 1 << (size - 1).bit_length()
    full = np.fft.ifft(np.fft.fft(x, nfft) * np.fft.fft(k, nfft))[:size]
    start = (len(k) - 1) // 2
    return full[start : start + len(x)]


@app.function(hide_code=True)
def scalogram(x, freqs, n):
    """|complex Morlet transform|, scaled so a sinusoid of amplitude A reads A."""
    rows = []
    for f in freqs:
        sigma = n / (2 * np.pi * f)
        t = centred(3.5 * sigma)
        env = np.exp(-(t**2) / (2 * sigma**2))
        w = env * np.exp(2j * np.pi * f * t) / (env.sum() / 2)
        rows.append(np.abs(conv_same(x, np.conj(w)[::-1])))
    return np.array(rows)


@app.class_definition(hide_code=True)
class Scalogram(anywidget.AnyWidget):
    """groups: [{label, panels: [{title, y, duration, fmin, fmax, rows, cols, power, vmax, unit}]}].

    ``power`` is base64 uint8, rows ordered high to low frequency (log spaced).
    ``band`` [lo, hi] Hz is drawn on every panel; lo == hi draws one line.
    """

    _esm = THEME_JS + r"""
    function render({ model, el }) {
      const root = document.createElement("div");
      root.className = "scalo";
      el.appendChild(root);
      let cells = [];
      const unfollow = followTheme(root);

      function build() {
        root.replaceChildren();
        cells = [];
        for (const g of model.get("groups")) {
          if (g.label) {
            const h = document.createElement("div");
            h.className = "glabel";
            h.textContent = g.label;
            root.appendChild(h);
          }
          const grid = document.createElement("div");
          grid.className = "grid";
          grid.style.setProperty("--cols", model.get("columns"));
          root.appendChild(grid);
          for (const p of g.panels) cells.push(panel(p, grid));
        }
        cells.forEach(paint);
      }

      function panel(p, grid) {
        const box = document.createElement("div");
        box.className = "panel";
        const head = document.createElement("div");
        head.className = "head";
        const title = document.createElement("span");
        title.textContent = p.title;
        const read = document.createElement("span");
        read.className = "read";
        head.append(title, read);
        const trace = node("svg", { class: "trace" });
        const wrap = document.createElement("div");
        wrap.className = "map";
        const cv = document.createElement("div");
        cv.className = "heat";
        const over = node("svg", { class: "over" });
        wrap.append(cv, over);
        box.append(head, trace, wrap);
        grid.appendChild(box);
        const bin = atob(p.power);
        const arr = new Uint8ClampedArray(bin.length);
        for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
        const off = document.createElement("canvas");
        off.width = p.cols; off.height = p.rows;
        const img = new ImageData(p.cols, p.rows);
        for (let i = 0; i < arr.length; i++) img.data[4 * i + 3] = arr[i];
        off.getContext("2d").putImageData(img, 0, 0);
        const mask = `url(${off.toDataURL()})`;
        cv.style.maskImage = cv.style.webkitMaskImage = mask;
        const cell = { p, wrap, trace, cv, over, read, arr, w: 0 };
        wrap.addEventListener("pointermove", (e) => hover(cell, e));
        wrap.addEventListener("pointerleave", () => { cell.read.textContent = ""; cell.cross && (cell.cross.style.display = "none"); });
        return cell;
      }

      const logY = (p, f, h) => ((Math.log(p.fmax) - Math.log(f)) / (Math.log(p.fmax) - Math.log(p.fmin))) * h;

      function paint(cell) {
        const { p, wrap, trace, cv, over } = cell;
        const w = Math.max(80, Math.round(wrap.clientWidth || 300));
        const h = model.get("height"), th = model.get("trace_height");
        const [lo, hi] = model.get("yrange");
        cell.w = w;
        trace.setAttribute("viewBox", `0 0 ${w} ${th}`);
        trace.setAttribute("width", w); trace.setAttribute("height", th);
        let d = "";
        p.y.forEach((v, i) => {
          const x = (i / (p.y.length - 1)) * w, y = th - 2 - ((v - lo) / (hi - lo)) * (th - 4);
          d += (d ? "L" : "M") + x.toFixed(1) + "," + y.toFixed(1);
        });
        trace.replaceChildren(node("path", { d }));

        cv.style.height = h + "px";

        over.setAttribute("viewBox", `0 0 ${w} ${h}`);
        over.setAttribute("width", w); over.setAttribute("height", h);
        over.replaceChildren();
        const band = model.get("band");
        if (band && band.length === 2) {
          const y1 = logY(p, Math.min(p.fmax, band[1]), h), y0 = logY(p, Math.max(p.fmin, band[0]), h);
          if (band[0] === band[1]) node("line", { class: "band", x1: 0, x2: w, y1, y2: y1 }, over);
          else node("rect", { class: "band", x: 0.5, y: y1, width: w - 1, height: Math.max(1, y0 - y1) }, over);
        }
        for (const f of [0.5, 2, 8]) {
          if (f <= p.fmin || f >= p.fmax) continue;
          node("text", { class: "tick", x: w - 3, y: logY(p, f, h) + 3.5 }, over).textContent = f + " Hz";
        }
        cell.cross = node("line", { class: "cross", x1: 0, x2: 0, y1: 0, y2: h, style: "display:none" }, over);
      }

      function hover(cell, e) {
        const { p, wrap, arr } = cell;
        const r = wrap.getBoundingClientRect(), h = model.get("height");
        const fx = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
        const fy = Math.min(1, Math.max(0, (e.clientY - r.top) / h));
        const col = Math.min(p.cols - 1, Math.floor(fx * p.cols)), row = Math.min(p.rows - 1, Math.floor(fy * p.rows));
        const f = Math.exp(Math.log(p.fmax) - fy * (Math.log(p.fmax) - Math.log(p.fmin)));
        const v = (arr[row * p.cols + col] / 255) ** 2 * p.vmax;
        cell.read.textContent = `${(fx * p.duration).toFixed(2)} s · ${f.toFixed(1)} Hz · ${v.toFixed(2)} ${p.unit}`;
        const x = fx * cell.w;
        cell.cross.setAttribute("x1", x); cell.cross.setAttribute("x2", x);
        cell.cross.style.display = "";
      }

      const ro = new ResizeObserver(() => cells.forEach((c) => { if (Math.abs(c.wrap.clientWidth - c.w) > 1) paint(c); }));
      ro.observe(root);
      const repaint = () => cells.forEach(paint);
      model.on("change:groups", build);
      model.on("change:band", repaint);
      build();
      return () => {
        model.off("change:groups", build); model.off("change:band", repaint);
        ro.disconnect(); unfollow(); root.remove();
      };
    }
    export default { render };
    """
    _css = (
        """
    .scalo { color: inherit; font: inherit; font-size: 12px;"""
        + PALETTE_CSS
        + """
    }
    .scalo .grid { display: grid; grid-template-columns: repeat(var(--cols), minmax(0, 1fr)); gap: 16px 18px; }
    @media (max-width: 640px) { .scalo .grid { grid-template-columns: repeat(min(var(--cols), 2), minmax(0, 1fr)); } }
    .scalo .glabel { margin: 14px 0 6px; opacity: .6; }
    .scalo .glabel:first-child { margin-top: 0; }
    .scalo .head { display: flex; justify-content: space-between; gap: 8px; min-height: 1.4em; }
    .scalo .read { font-family: "IBM Plex Mono", ui-monospace, monospace; font-variant-numeric: tabular-nums; font-size: 11px; opacity: .65; white-space: nowrap; }
    .scalo .trace { display: block; overflow: visible; }
    .scalo .trace path { fill: none; stroke: currentColor; stroke-opacity: .75; stroke-width: 1; }
    .scalo .map { position: relative; cursor: crosshair; }
    .scalo .heat {
      display: block; width: 100%; background: currentColor;
      mask-size: 100% 100%; -webkit-mask-size: 100% 100%; mask-repeat: no-repeat; -webkit-mask-repeat: no-repeat;
    }
    .scalo .over { position: absolute; inset: 0; pointer-events: none; overflow: visible; }
    .scalo .tick { text-anchor: end; fill: currentColor; fill-opacity: .55; font-size: 10px; font-family: "IBM Plex Mono", ui-monospace, monospace; }
    .scalo .band { fill: none; stroke: var(--accent); stroke-width: 1.4; }
    .scalo .cross { stroke: var(--accent); stroke-opacity: .7; }
    """
    )
    groups = traitlets.List([]).tag(sync=True)
    columns = traitlets.Int(1).tag(sync=True)
    height = traitlets.Int(140).tag(sync=True)
    trace_height = traitlets.Int(48).tag(sync=True)
    yrange = traitlets.List([-1.0, 1.0]).tag(sync=True)
    band = traitlets.List([]).tag(sync=True)


@app.function(hide_code=True)
def panel(title, trace, power, freqs, vmax, unit="", cols=480):
    """Pack one scalogram: sqrt-compressed, high frequency first, uint8 base64."""
    step = max(1, power.shape[1] // cols)
    p = power[::-1, ::step]
    q = np.clip(np.sqrt(p / vmax), 0, 1) * 255
    trace = np.asarray(trace)[:: max(1, len(trace) // cols)]
    return {
        "title": title, "y": np.round(trace, 4).tolist(), "duration": power.shape[1] / FS,
        "fmin": float(freqs[0]), "fmax": float(freqs[-1]), "rows": p.shape[0], "cols": p.shape[1],
        "power": base64.b64encode(q.astype(np.uint8).tobytes()).decode(), "vmax": float(vmax), "unit": unit,
    }


@app.cell(hide_code=True)
def _(f_wave, n_cycles):
    _t, _y = toy_signal()
    _freqs = np.geomspace(0.15, 15, 64)
    _power = scalogram(_y, _freqs, n_cycles)
    toy_scalogram = Scalogram(
        groups=[{"label": "", "panels": [panel("", _y, _power, _freqs, float(_power.max()))]}],
        columns=1, height=170, trace_height=56, yrange=[-1.45, 1.45], band=[f_wave, f_wave],
    )
    mo.vstack([
        mo.md(rf"""
        ## Every frequency at once is a scalogram

        Pair the cosine with a sine and take the magnitude: the ringing above becomes a smooth envelope.
        Do that for every $f$ and stack the rows. The swell and the burst separate cleanly in time and
        frequency; the line marks your $f$. More cycles sharpen frequency and blur time.
        """),
        toy_scalogram,
    ])
    return


@app.function(hide_code=True)
def load_trials():
    """The nine BME3740 sample trials, embedded: name, fall label, trunk |a| in g at 100 Hz."""
    rows = json.loads(zlib.decompress(base64.b64decode(TRIAL_DATA)))
    return [{"name": r["name"], "fall": r["fall"], "mag": np.asarray(r["mag"])} for r in rows]


@app.cell(hide_code=True)
def _():
    trials = load_trials()
    window = 6 * FS                            # 4 s before the largest peak, 2 s after
    for _tr in trials:
        _start = int(np.clip(_tr["mag"].argmax() - 4 * FS, 0, len(_tr["mag"]) - window))
        _tr["window"] = slice(_start, _start + window)
    return trials, window


@app.cell(hide_code=True)
def _(trials):
    imu_view = Slide(
        signals=[series(_tr["name"], _tr["mag"][_tr["window"]] - 1, "a") for _tr in trials],
        kernels=[],
        signal="Forward fall",
        position=0.6,
    )
    return (imu_view,)


@app.cell(hide_code=True)
def _(imu_view, psi):
    imu_view.kernels = [series("ψ", psi, "ψ")]
    mo.vstack([
        mo.md(r"""
        ## A fall is a slow wave with a burst at its end

        Each trial is the acceleration magnitude from the trunk sensor minus 1 g, 4 s before its largest
        peak to 2 s after. (IMU 1 stays upright through the hard sit while IMU 2 ends horizontal, so IMU 1
        is the trunk.) The wavelet is still yours: around 1 Hz it swells over the whole drop, around 8 Hz
        it rings only at impact. Compare a fall with the hard sit.
        """),
        imu_view,
    ])
    return


@app.cell(hide_code=True)
def _():
    band = mo.ui.range_slider(
        steps=[0.3, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24],
        value=[0.5, 1.5], label="Band (Hz)", show_value=True,
    )
    return (band,)


@app.cell(hide_code=True)
def _(n_cycles, trials):
    imu_freqs = np.geomspace(0.3, 24, 60)
    imu_power = [scalogram(_tr["mag"] - 1, imu_freqs, n_cycles)[:, _tr["window"]] for _tr in trials]
    return imu_freqs, imu_power


@app.cell(hide_code=True)
def _(band, imu_freqs, imu_power, trials):
    _vmax = float(np.percentile([p.max() for p in imu_power], 75))
    _panels = [panel(_tr["name"], _tr["mag"][_tr["window"]], p, imu_freqs, _vmax, "g", cols=300)
               for _tr, p in zip(trials, imu_power)]
    _ymax = max(float(_tr["mag"][_tr["window"]].max()) for _tr in trials)
    _falls = [p for p, _tr in zip(_panels, trials) if _tr["fall"]]
    _rest = [p for p, _tr in zip(_panels, trials) if not _tr["fall"]]
    trial_scalograms = Scalogram(
        groups=[{"label": "Falls", "panels": _falls}, {"label": "Not falls", "panels": _rest}],
        columns=5, height=96, trace_height=40, yrange=[0.0, min(_ymax, 8.0)], band=list(band.value),
    )
    mo.vstack([
        mo.md("""
        Every trial's scalogram on one colour scale, impacts aligned two seconds from the right edge.
        Each fall darkens around 1 Hz under its impact, where the body drops; the box marks the band
        scored below.
        """),
        band,
        trial_scalograms,
    ])
    return


@app.function(hide_code=True)
def who(names):
    if not names:
        return "no other trial", "does"
    names = [f"the {n.lower()}" for n in names]
    joined = names[0] if len(names) == 1 else ", ".join(names[:-1]) + " and " + names[-1]
    return joined, "does" if len(names) == 1 else "do"


@app.function(hide_code=True)
def strip(rows, falls, names, width=640):
    """Dot rows on their own scales; filled = fall. Labels only non-falls at or above the weakest fall."""
    row_h, left, right = 70, 10, 30
    parts = []
    for r, (title, values) in enumerate(rows):
        values = np.asarray(values)
        top = r * row_h
        y = top + 42
        vmax = values.max() * 1.05
        x = lambda v: left + v / vmax * (width - left - right)
        floor = values[falls].min()
        parts.append(f'<text x="{left}" y="{top + 14}" font-size="12" fill="currentColor" fill-opacity=".7">{title}</text>')
        parts.append(f'<line x1="{left}" x2="{width - right}" y1="{y}" y2="{y}" stroke="currentColor" stroke-opacity=".15"/>')
        parts.append(f'<line x1="{x(floor):.1f}" x2="{x(floor):.1f}" y1="{y - 14}" y2="{y + 14}" stroke="#E89A39" stroke-dasharray="2 3"/>')
        parts.append(f'<text x="{width - right + 4}" y="{y + 4}" font-size="11" fill="currentColor" fill-opacity=".55">{vmax / 1.05:.1f}</text>')
        for v, fall, name in sorted(zip(values, falls, names), key=lambda z: z[1]):
            fill = 'fill="currentColor"' if fall else 'fill="none" stroke="currentColor" stroke-width="1.4"'
            cy = y - 5 if fall else y + 5
            parts.append(f'<circle cx="{x(v):.1f}" cy="{cy}" r="5" {fill} fill-opacity=".85"><title>{name}: {v:.2f}</title></circle>')
            if not fall and v >= floor:
                parts.append(f'<text x="{x(v):.1f}" y="{y + 25}" font-size="11" text-anchor="middle" fill="currentColor" fill-opacity=".8">{name.lower()}</text>')
    h = row_h * len(rows)
    return mo.Html(f'<svg viewBox="0 0 {width} {h}" style="width:100%;max-width:{width}px;color:inherit;overflow:visible">{"".join(parts)}</svg>')


@app.cell(hide_code=True)
def _(band, imu_freqs, imu_power, trials):
    _lo, _hi = band.value
    _rows = (imu_freqs >= _lo) & (imu_freqs <= _hi)
    peak = np.array([_tr["mag"][_tr["window"]].max() for _tr in trials])
    band_amp = np.array([p[_rows].max() if _rows.any() else 0.0 for p in imu_power])
    _falls = np.array([_tr["fall"] for _tr in trials])
    _names = [_tr["name"] for _tr in trials]
    _over = lambda v: [n for n, x, f in zip(_names, v, _falls) if not f and x >= v[_falls].min()]
    _p, _pv = who(_over(peak))
    _b, _bv = who(_over(band_amp))
    mo.vstack([
        mo.md(f"""
        ## Peak acceleration confuses a hard sit with a fall

        A threshold on peak acceleration is the usual first detector. Filled dots are falls; the dashed
        tick is the gentlest fall. On peak acceleration {_p} {_pv} at least as well; on the largest
        {_lo:g}–{_hi:g} Hz wavelet amplitude, {_b} {_bv}.
        """),
        strip(
            [("Peak acceleration (g)", peak), (f"Largest {_lo:g}–{_hi:g} Hz wavelet amplitude (g)", band_amp)],
            _falls, _names,
        ),
        mo.md("""
        I chose the default band by looking at these same nine trials, from one session, so this is a
        place to look, not a threshold; the trick was built to fool a detector. The test is the same band
        on falls from other people. The shape is the opening example again: a slow swell with a burst at
        its end, and a wavelet scores the two separately.
        """),
    ])
    return


if __name__ == "__main__":
    app.run()
