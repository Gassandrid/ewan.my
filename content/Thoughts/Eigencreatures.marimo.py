# description: Engineer eigenvalue creatures: draw their outline, paint their body, walk their parameters, and breed them.
# /// script
# requires-python = ">=3.12"
# dependencies = [
#     "anywidget",
#     "marimo==0.23.9",
#     "numpy",
#     "plotly==5.24.1",
#     "traitlets",
#     "wigglystuff==0.5.32",
# ]
# ///

import marimo

__generated_with = "0.23.9"
app = marimo.App(width="columns", app_title="Eigencreatures")

with app.setup(hide_code=True):
    import base64
    import math
    import struct
    import zlib

    import anywidget
    import marimo as mo
    import numpy as np
    import plotly.graph_objects as go
    import traitlets
    from wigglystuff import BezierCurve, CurveEditor

    GAUSSIAN_UNITS = np.array([1, -1, 1j, -1j])
    ALPHABETS = {
        "±1, ±i": GAUSSIAN_UNITS,
        "±1": np.array([1.0, -1.0]),
        "cube roots": np.exp(2j * np.pi * np.arange(3) / 3),
        "5th roots": np.exp(2j * np.pi * np.arange(5) / 5),
    }
    PALETTES = {
        "Paper · ink": {
            "paper": (245, 241, 235),
            "ink": (48, 59, 73),
            "cycle": [(232, 154, 57), (191, 97, 89), (48, 59, 73), (86, 112, 107)],
        },
        "Paper · rust": {
            "paper": (245, 241, 235),
            "ink": (191, 97, 89),
            "cycle": [(191, 97, 89), (232, 154, 57), (86, 112, 107), (48, 59, 73)],
        },
        "Night": {
            "paper": (24, 27, 33),
            "ink": (236, 228, 214),
            "cycle": [(232, 154, 57), (236, 228, 214), (122, 160, 152), (214, 128, 118)],
        },
    }
    OVERLAY = {"paper": (0, 0, 0), "ink": (232, 154, 57), "cycle": []}
    LENSES = {
        "λ": lambda z: z,
        "λ²": lambda z: z * z,
        "1/λ": lambda z: 1 / z,
        "λ + 1/λ": lambda z: z + 1 / z,
        "√λ": np.sqrt,
        "exp λ": np.exp,
    }
    MODES = ["Conradi", "Ensemble", "Outline", "Workbench"]
    SAMPLERS = ["Torus", "Annulus", "Knot", "Drawn path"]
    FEATURES = ["fill", "porosity", "lace", "symmetry", "evenness"]

    PRESETS = {
        "Conradi": {
            "matrix": [
                [-2, 0, 0, 0, 0, 0],
                [0, 0, 1, 1, 0, 1],
                [2, 0, 0, 1, 0, 2],
                [0, 0, 0, -2, -2, 2],
                [-2, 1, 0, 0, -2, 1],
                [-2, 1, 0, 0, 0, -2],
            ],
            "mask": [
                [0, 0, 1, 0, 0, 1],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0],
            ],
        },
        "Sparse": {
            "matrix": [
                [0, 2, 0, 0, -2],
                [-2, 0, 1, 0, 0],
                [0, -1, 0, 2, 0],
                [0, 0, -2, 0, 1],
                [2, 0, 0, -1, 0],
            ],
            "mask": [
                [0, 0, 1, 0, 0],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 1],
                [0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0],
            ],
        },
        "Border": {
            "matrix": [
                [0, 1, 0, 1],
                [2, 0, 2, 0],
                [0, 1, 0, 1],
                [2, 0, 2, 0],
            ],
            "mask": [
                [0, 1, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 1, 0],
            ],
        },
    }
    FISH_OUTLINE = [
        {"x": 1.7, "y": 0.05},
        {"x": 0.9, "y": 0.75},
        {"x": -0.1, "y": 0.85},
        {"x": -0.9, "y": 0.35},
        {"x": -1.6, "y": 0.95},
        {"x": -1.25, "y": 0.0},
        {"x": -1.6, "y": -0.95},
        {"x": -0.9, "y": -0.35},
        {"x": -0.1, "y": -0.8},
        {"x": 0.9, "y": -0.65},
    ]
    PATH_POINTS = [
        {"x": 1.3, "y": 0.0},
        {"x": 0.9, "y": 1.9},
        {"x": -1.9, "y": 1.2},
        {"x": -0.3, "y": -0.2},
        {"x": -1.6, "y": -1.8},
        {"x": 1.4, "y": -1.6},
    ]
    SKETCH_ESM = r"""
    function render({ model, el }) {
      const root = document.createElement("div");
      root.className = "eigen-sketch";
      const canvas = document.createElement("canvas");
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", "Paint the region the spectrum should occupy, over the current creature");
      const layer = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const lctx = layer.getContext("2d");
      const bar = document.createElement("div");
      bar.className = "eigen-sketch-bar";
      const make = (text) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = text;
        bar.appendChild(b);
        return b;
      };
      const paint = make("Paint");
      const erase = make("Erase");
      const undo = make("Undo");
      const clear = make("Clear");
      const label = document.createElement("label");
      label.textContent = "Brush ";
      const brush = document.createElement("input");
      brush.type = "range";
      brush.min = "0.02";
      brush.max = "0.4";
      brush.step = "0.01";
      brush.value = String(model.get("brush"));
      label.appendChild(brush);
      bar.appendChild(label);
      root.append(canvas, bar);
      el.appendChild(root);

      let strokes = model.get("strokes") || [];
      let current = null;
      let mode = "add";
      const image = new Image();

      const setMode = (next) => {
        mode = next;
        paint.setAttribute("aria-pressed", String(mode === "add"));
        erase.setAttribute("aria-pressed", String(mode === "erase"));
      };
      const size = () => model.get("size");
      const extent = () => model.get("extent");
      const toPx = ([x, y]) => [((x / extent() + 1) / 2) * size(), ((1 - y / extent()) / 2) * size()];
      const toData = (event) => {
        const r = canvas.getBoundingClientRect();
        const px = (event.clientX - r.left) / r.width;
        const py = (event.clientY - r.top) / r.height;
        return [Math.round((px * 2 - 1) * extent() * 1000) / 1000, Math.round((1 - py * 2) * extent() * 1000) / 1000];
      };
      const resize = () => {
        const dpr = window.devicePixelRatio || 1;
        for (const c of [canvas, layer]) {
          c.width = size() * dpr;
          c.height = size() * dpr;
        }
        canvas.style.width = `${size()}px`;
        canvas.style.height = `${size()}px`;
      };
      const strokePath = (c, stroke) => {
        c.lineWidth = (stroke.r / extent()) * size();
        c.lineCap = "round";
        c.lineJoin = "round";
        c.beginPath();
        stroke.pts.forEach((p, i) => {
          const [x, y] = toPx(p);
          if (i === 0) c.moveTo(x, y);
          else c.lineTo(x, y);
        });
        if (stroke.pts.length === 1) {
          const [x, y] = toPx(stroke.pts[0]);
          c.lineTo(x + 0.01, y);
        }
        c.stroke();
      };
      const draw = () => {
        const dpr = window.devicePixelRatio || 1;
        const s = size();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, s, s);
        const [cx, cy] = toPx([0, 0]);
        ctx.strokeStyle = "rgba(128,128,128,0.4)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(0, cy);
        ctx.lineTo(s, cy);
        ctx.moveTo(cx, 0);
        ctx.lineTo(cx, s);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(cx, cy, s / (2 * extent()), 0, 2 * Math.PI);
        ctx.stroke();
        ctx.setLineDash([]);

        lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        lctx.globalCompositeOperation = "source-over";
        lctx.clearRect(0, 0, s, s);
        lctx.strokeStyle = "#000";
        for (const stroke of current ? [...strokes, current] : strokes) {
          lctx.globalCompositeOperation = stroke.mode === "erase" ? "destination-out" : "source-over";
          strokePath(lctx, stroke);
        }
        lctx.globalCompositeOperation = "source-in";
        lctx.fillStyle = "#56706B";
        lctx.fillRect(0, 0, s, s);
        lctx.globalCompositeOperation = "source-over";
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.globalAlpha = 0.38;
        ctx.drawImage(layer, 0, 0);
        ctx.restore();
        if (image.complete && image.naturalWidth) ctx.drawImage(image, 0, 0, s, s);
      };
      const commit = () => {
        model.set("strokes", strokes);
        model.set("brush", Number(brush.value));
        model.save_changes();
        draw();
      };

      canvas.addEventListener("pointerdown", (event) => {
        canvas.setPointerCapture(event.pointerId);
        current = { mode, r: Number(brush.value) * extent(), pts: [toData(event)] };
        draw();
      });
      canvas.addEventListener("pointermove", (event) => {
        if (!current) return;
        const p = toData(event);
        const last = current.pts[current.pts.length - 1];
        if (Math.hypot(p[0] - last[0], p[1] - last[1]) > current.r * 0.3) {
          current.pts.push(p);
          draw();
        }
      });
      const finish = () => {
        if (!current) return;
        strokes = [...strokes, current];
        current = null;
        commit();
      };
      canvas.addEventListener("pointerup", finish);
      canvas.addEventListener("pointercancel", finish);
      paint.addEventListener("click", () => setMode("add"));
      erase.addEventListener("click", () => setMode("erase"));
      undo.addEventListener("click", () => {
        strokes = strokes.slice(0, -1);
        commit();
      });
      clear.addEventListener("click", () => {
        strokes = [];
        commit();
      });

      const onBackground = () => {
        image.src = model.get("background") || "";
        if (!model.get("background")) draw();
      };
      const onStrokes = () => {
        strokes = model.get("strokes") || [];
        draw();
      };
      const onSize = () => {
        resize();
        draw();
      };
      image.onload = draw;
      model.on("change:background", onBackground);
      model.on("change:strokes", onStrokes);
      model.on("change:extent", draw);
      model.on("change:size", onSize);
      setMode("add");
      resize();
      onBackground();
      draw();
      return () => {
        model.off("change:background", onBackground);
        model.off("change:strokes", onStrokes);
        model.off("change:extent", draw);
        model.off("change:size", onSize);
        image.onload = null;
      };
    }
    export default { render };
    """
    SKETCH_CSS = """
    .eigen-sketch { display: inline-flex; flex-direction: column; gap: 0.5rem; }
    .eigen-sketch canvas {
      border: 1px solid color-mix(in srgb, currentColor 22%, transparent);
      border-radius: 6px;
      touch-action: none;
      cursor: crosshair;
    }
    .eigen-sketch-bar { display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap; font-size: 0.85rem; }
    .eigen-sketch-bar button {
      font: inherit;
      padding: 0.15rem 0.6rem;
      border-radius: 4px;
      border: 1px solid color-mix(in srgb, currentColor 30%, transparent);
      background: transparent;
      color: inherit;
      cursor: pointer;
    }
    .eigen-sketch-bar button[aria-pressed="true"] { background: color-mix(in srgb, #E89A39 32%, transparent); }
    .eigen-sketch-bar label { display: inline-flex; gap: 0.3rem; align-items: center; }
    """


@app.class_definition
class SpectrumSketch(anywidget.AnyWidget):
    """Paint a target region in the complex plane over the current spectrum.

    `strokes` holds capsules in complex-plane coordinates:
    `{"mode": "add" | "erase", "r": radius, "pts": [[x, y], ...]}`.
    """

    _esm = SKETCH_ESM
    _css = SKETCH_CSS
    strokes = traitlets.List([]).tag(sync=True)
    background = traitlets.Unicode("").tag(sync=True)
    extent = traitlets.Float(2.5).tag(sync=True)
    brush = traitlets.Float(0.12).tag(sync=True)
    size = traitlets.Int(420).tag(sync=True)


@app.function
def png_bytes(pixels):
    """Encode an RGB or RGBA uint8 array as PNG without an imaging dependency."""
    height, width, channels = pixels.shape

    def chunk(kind, data):
        crc = struct.pack(">I", zlib.crc32(kind + data) & 0xFFFFFFFF)
        return struct.pack(">I", len(data)) + kind + data + crc

    rows = b"".join(b"\x00" + row.tobytes() for row in pixels)
    header = struct.pack(">IIBBBBB", width, height, 8, {3: 2, 4: 6}[channels], 0, 0, 0)
    return (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", header)
        + chunk(b"IDAT", zlib.compress(rows, 6))
        + chunk(b"IEND", b"")
    )


@app.function
def data_url(pixels):
    return "data:image/png;base64," + base64.b64encode(png_bytes(pixels)).decode("ascii")


@app.function
def decode_matrix(encoded):
    """Conradi's integer codes: −2 → −i, −1, 0, 1, 2 → i."""
    encoded = np.asarray(encoded, dtype=int)
    matrix = np.zeros(encoded.shape, dtype=np.complex128)
    for code, value in ((-2, -1j), (-1, -1), (1, 1), (2, 1j)):
        matrix[encoded == code] = value
    return matrix


@app.function
def slot_body(name, base, rows, cols):
    """A pencil whose parameters replace single entries: A(t) = B + Σ tₘ e_{iₘjₘ}."""
    base = np.array(base, dtype=np.complex128)
    base[rows, cols] = 0
    directions = np.zeros((len(rows), *base.shape), dtype=np.complex128)
    directions[np.arange(len(rows)), rows, cols] = 1
    labels = [f"t{index + 1}" for index in range(len(rows))]
    return {"name": name, "B": base, "E": directions, "labels": labels}


@app.function
def conradi_body(matrix, mask):
    rows, cols = np.nonzero(np.asarray(mask, dtype=float) >= 0.5)
    return slot_body("Conradi matrix", decode_matrix(matrix), rows, cols)


@app.function
def structure_support(structure, size):
    i, j = np.indices((size, size))
    offset = (j - i) % size
    return {
        "free": np.ones((size, size), dtype=bool),
        "cyclic band": (offset <= 2) | (offset >= size - 1),
        "Hessenberg": j >= i - 1,
        "tridiagonal": np.abs(i - j) <= 1,
        "shift + chords": (offset == 1) | (offset == 0) | (offset == size // 2),
    }[structure]


@app.function
def ensemble_body(size, density, alphabet, structure, slots, seed):
    """A random sparse matrix over a small alphabet, with `slots` torus entries."""
    rng = np.random.default_rng(seed)
    support = structure_support(structure, size)
    keep = support & (rng.random((size, size)) < density)
    base = np.where(keep, rng.choice(ALPHABETS[alphabet], (size, size)), 0)
    candidates = np.argwhere(support)
    picks = candidates[rng.choice(len(candidates), min(slots, len(candidates)), replace=False)]
    body = slot_body(f"Ensemble · seed {seed}", base, picks[:, 0], picks[:, 1])
    body["alphabet"] = alphabet
    return body


@app.function
def closed_spline(points, per_segment=48):
    """Closed uniform Catmull–Rom spline through the knots."""
    z = np.array([point["x"] + 1j * point["y"] for point in points])
    if len(z) < 3:
        return z
    u = np.linspace(0, 1, per_segment, endpoint=False)[:, None]
    p0, p1, p2, p3 = np.roll(z, 1), z, np.roll(z, -1), np.roll(z, -2)
    curve = 0.5 * (
        2 * p1
        + (p2 - p0) * u
        + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u**2
        + (3 * p1 - p0 - 3 * p2 + p3) * u**3
    )
    return curve.T.reshape(-1)


@app.function
def resample_closed(z, count=512):
    """Resample a closed polyline at equal arclength."""
    loop = np.append(z, z[0])
    arc = np.concatenate([[0], np.cumsum(np.abs(np.diff(loop)))])
    target = np.linspace(0, arc[-1], count, endpoint=False)
    return np.interp(target, arc, loop.real) + 1j * np.interp(target, arc, loop.imag)


@app.function
def outline_body(points, harmonics, size, texture, texture_slots, seed):
    """A twisted circulant whose spectrum is the drawn outline.

    The outline is γ(θ) = Σ_{|k|≤K} c_k e^{ikθ}. The n×n matrix with c_k on the
    k-th cyclic diagonal has eigenvalues γ(2πj/n). Multiply its wrap-around
    entries by τ₊ (above) and τ₋ (below): when τ₊ = z^n and τ₋ = z^{−n}, the
    eigenvalues are γ evaluated at the n-th roots of z, so a knot with windings
    (1, −1) traces the outline exactly. Other paths leave the curve and fill it.
    """
    curve = resample_closed(closed_spline(points))
    coefficients = np.fft.fft(curve) / len(curve)
    n = max(size, 2 * harmonics + 1)
    base = np.zeros((n, n), dtype=np.complex128)
    upper = np.zeros_like(base)
    lower = np.zeros_like(base)
    for k in range(-harmonics, harmonics + 1):
        c = coefficients[k % len(curve)]
        for row in range(n):
            col = row + k
            if col >= n:
                upper[row, col - n] += c
            elif col < 0:
                lower[row, col + n] += c
            else:
                base[row, col] += c
    rng = np.random.default_rng(seed)
    if texture > 0:
        sprinkle = rng.random((n, n)) < 2.5 / n
        base = base + texture * np.where(sprinkle, rng.choice(GAUSSIAN_UNITS, (n, n)), 0)
    directions = [upper, lower]
    labels = ["τ₊", "τ₋"]
    for index in range(texture_slots if texture > 0 else 0):
        direction = np.zeros_like(base)
        direction[rng.integers(n), rng.integers(n)] = texture
        directions.append(direction)
        labels.append(f"t{index + 3}")
    return {
        "name": f"Outline · {harmonics} harmonics",
        "B": base,
        "E": np.array(directions),
        "labels": labels,
        "outline": curve,
    }


@app.function
def bezier_points(points, closed):
    z = np.array([point["x"] + 1j * point["y"] for point in points])
    return np.append(z, z[0]) if closed and len(z) else z


@app.function
def bezier_eval(control, u):
    """Evaluate one Bezier curve of arbitrary degree at parameters u."""
    degree = len(control) - 1
    result = np.zeros(np.shape(u), dtype=np.complex128)
    for k, point in enumerate(control):
        result += math.comb(degree, k) * u**k * (1 - u) ** (degree - k) * point
    return result


@app.function
def parse_windings(text):
    values = []
    for token in text.replace(",", " ").split():
        try:
            values.append(int(token))
        except ValueError:
            pass
    return values or [1]


@app.function
def sample_parameters(kind, m, count, rng, radius, radii, windings, jitter, path, lag):
    """Draw parameter vectors t ∈ ℂ^m and a scalar position s ∈ [0, 1) per sample."""
    s = rng.uniform(0, 1, count)
    if m == 0:
        return np.zeros((count, 0), dtype=np.complex128), s
    if kind == "Drawn path":
        u = (s[:, None] + lag * np.arange(m)[None, :]) % 1
        noise = rng.normal(size=(count, m)) + 1j * rng.normal(size=(count, m))
        return bezier_eval(path, u) + jitter * noise / np.sqrt(2), s
    phase = rng.uniform(0, 2 * np.pi, (count, m))
    if kind == "Torus":
        return radius * np.exp(1j * phase), phase[:, 0] / (2 * np.pi)
    if kind == "Annulus":
        low, high = np.log(radii[0]), np.log(radii[1])
        return np.exp(rng.uniform(low, high, (count, m)) + 1j * phase), phase[:, 0] / (2 * np.pi)
    for index, winding in enumerate(windings[:m]):
        phase[:, index] = 2 * np.pi * winding * s
    phase += jitter * rng.normal(size=phase.shape)
    modulus = radius * np.exp(0.5 * jitter * rng.normal(size=phase.shape))
    return modulus * np.exp(1j * phase), s


@app.function
def pencil(body, t):
    return body["B"][None] + np.einsum("sm,mij->sij", t, body["E"])


@app.function
def spectrum(body, t):
    return np.linalg.eigvals(pencil(body, t))


@app.function
def apply_lens(lens, eigenvalues):
    with np.errstate(all="ignore"):
        return LENSES[lens](eigenvalues.astype(np.complex128))


@app.function
def auto_view(z, pad=1.08):
    z = z[np.isfinite(z)]
    if len(z) == 0:
        return 0j, 1.0
    low_re, high_re = np.quantile(z.real, [0.002, 0.998])
    low_im, high_im = np.quantile(z.imag, [0.002, 0.998])
    center = complex((low_re + high_re) / 2, (low_im + high_im) / 2)
    return center, max(high_re - low_re, high_im - low_im, 1e-6) / 2 * pad


@app.function
def bin_points(z, center, half, size):
    finite = np.isfinite(z)
    z = np.where(finite, z, center + 4 * half)
    x = np.floor((z.real - center.real + half) / (2 * half) * size)
    y = np.floor((center.imag + half - z.imag) / (2 * half) * size)
    inside = finite & (x >= 0) & (x < size) & (y >= 0) & (y < size)
    return (y[inside] * size + x[inside]).astype(np.intp), inside


@app.function
def soften(image):
    out = image.copy()
    for dy, dx, weight in (
        (-1, 0, 0.5), (1, 0, 0.5), (0, -1, 0.5), (0, 1, 0.5),
        (-1, -1, 0.22), (-1, 1, 0.22), (1, -1, 0.22), (1, 1, 0.22),
    ):
        out += weight * np.roll(image, (dy, dx), axis=(0, 1))
    return out


@app.function
def cycle_colors(angle, colors):
    colors = np.asarray(colors, dtype=np.float32)
    position = (angle % (2 * np.pi)) / (2 * np.pi) * len(colors)
    lower = np.floor(position).astype(int) % len(colors)
    fraction = (position - np.floor(position))[..., None]
    return colors[lower] * (1 - fraction) + colors[(lower + 1) % len(colors)] * fraction


@app.function
def render_creature(z, palette, hue=None, size=760, gamma=0.72, view=None, transparent=False):
    """Log-density image of points z; with `hue` (radians), colour by circular mean."""
    center, half = view or auto_view(z)
    flat, inside = bin_points(z, center, half, size)
    count = size * size
    density = soften(np.bincount(flat, minlength=count).astype(np.float32).reshape(size, size))
    tone = np.log1p(density)
    lit = tone[tone > 0]
    exposure = float(np.quantile(lit, 0.997)) if len(lit) else 1.0
    tone = np.clip(tone / max(exposure, 1e-6), 0, 1) ** gamma
    ink = np.asarray(palette["ink"], dtype=np.float32)
    color = np.broadcast_to(ink, (size, size, 3))
    if hue is not None:
        angle = np.asarray(hue)[inside]
        cos = soften(np.bincount(flat, np.cos(angle), count).reshape(size, size).astype(np.float32))
        sin = soften(np.bincount(flat, np.sin(angle), count).reshape(size, size).astype(np.float32))
        coherence = np.clip(np.hypot(cos, sin) / np.maximum(density, 1e-6), 0, 1)[..., None]
        color = ink + coherence * (cycle_colors(np.arctan2(sin, cos), palette["cycle"]) - ink)
    if transparent:
        return np.rint(np.dstack([color, 255 * tone])).astype(np.uint8)
    paper = np.asarray(palette["paper"], dtype=np.float32)
    return np.rint(paper + tone[..., None] * (color - paper)).astype(np.uint8)


@app.function
def shape_features(z, grid=64):
    """Cheap descriptors on a coarse occupancy grid, in [0, 1]."""
    center, half = auto_view(z)
    flat, _ = bin_points(z, center, half, grid)
    counts = np.bincount(flat, minlength=grid * grid).reshape(grid, grid).astype(float)
    occupied = counts > 0
    if not occupied.any():
        return dict.fromkeys(FEATURES, 0.0)
    padded = np.pad(~occupied, 1, constant_values=True)
    reached = np.zeros_like(padded)
    reached[0, :] = reached[-1, :] = reached[:, 0] = reached[:, -1] = True
    for _ in range(4 * grid):
        grown = reached.copy()
        for axis in (0, 1):
            for shift in (1, -1):
                grown |= np.roll(reached, shift, axis=axis)
        grown &= padded
        if (grown == reached).all():
            break
        reached = grown
    enclosed = (padded & ~reached)[1:-1, 1:-1]
    edge = occupied & ~(
        np.roll(occupied, 1, 0) & np.roll(occupied, -1, 0)
        & np.roll(occupied, 1, 1) & np.roll(occupied, -1, 1)
    )
    p = counts / counts.sum()
    coarse = p.reshape(16, grid // 16, 16, grid // 16).sum(axis=(1, 3))
    mirror = max(
        float((coarse * coarse[:, ::-1]).sum()),
        float((coarse * coarse[::-1, :]).sum()),
        float((coarse * coarse[::-1, ::-1]).sum()),
    ) / float((coarse * coarse).sum())
    q = p[occupied]
    return {
        "fill": float(occupied.mean()),
        "porosity": float(enclosed.sum() / (occupied.sum() + enclosed.sum())),
        "lace": float(edge.sum() / occupied.sum()),
        "symmetry": mirror,
        "evenness": float(-(q * np.log(q)).sum() / max(np.log(len(q)), 1e-9)),
    }


@app.function
def mutate(body, strength, rng, name):
    """Edit a few entries: flip to a unit, zero out, nudge, or move a slot."""
    base = body["B"].copy()
    directions = body["E"].copy()
    n = len(base)
    nonzero = np.abs(base[base != 0])
    scale = float(np.median(nonzero)) if len(nonzero) else 1.0
    slots = [m for m in range(len(directions)) if np.count_nonzero(directions[m]) == 1]
    for _ in range(strength):
        i, j = rng.integers(n), rng.integers(n)
        operation = rng.choice(["flip", "flip", "nudge", "slot"])
        if operation == "slot" and slots:
            m = rng.choice(slots)
            weight = directions[m][directions[m] != 0][0]
            directions[m] = 0
            directions[m, i, j] = weight
            base[i, j] = 0
        elif operation == "nudge":
            base[i, j] += 0.35 * scale * (rng.normal() + 1j * rng.normal())
        else:
            base[i, j] = 0 if rng.random() < 0.3 else scale * rng.choice(GAUSSIAN_UNITS)
    return {**body, "name": name, "B": base, "E": directions}


@app.function
def rasterize_strokes(strokes, extent, grid=128):
    """Rasterize capsule strokes (complex-plane units) onto a grid over [−e, e]²."""
    cell = 2 * extent / grid
    xs = -extent + (np.arange(grid) + 0.5) * cell
    ys = extent - (np.arange(grid) + 0.5) * cell
    mask = np.zeros((grid, grid), dtype=bool)
    for stroke in strokes:
        points = np.asarray(stroke.get("pts", []), dtype=float).reshape(-1, 2)
        if len(points) == 0:
            continue
        radius = float(stroke.get("r", 0.1))
        segments = list(zip(points[:-1], points[1:])) or [(points[0], points[0])]
        for a, b in segments:
            c0 = max(int((min(a[0], b[0]) - radius + extent) / cell), 0)
            c1 = min(int((max(a[0], b[0]) + radius + extent) / cell) + 2, grid)
            r0 = max(int((extent - max(a[1], b[1]) - radius) / cell), 0)
            r1 = min(int((extent - min(a[1], b[1]) + radius) / cell) + 2, grid)
            if c0 >= c1 or r0 >= r1:
                continue
            x = xs[c0:c1][None, :] - a[0]
            y = ys[r0:r1][:, None] - a[1]
            d = b - a
            length = float(d @ d)
            u = 0 if length == 0 else np.clip((x * d[0] + y * d[1]) / length, 0, 1)
            hit = (x - u * d[0]) ** 2 + (y - u * d[1]) ** 2 <= radius**2
            if stroke.get("mode") == "erase":
                mask[r0:r1, c0:c1] &= ~hit
            else:
                mask[r0:r1, c0:c1] |= hit
    return mask


@app.function
def sculpt(body, target, extent, sampler, steps, rate, coverage, keep_sparsity, seed):
    """Adam on B so that the spectrum of B + Σ tₘEₘ lands inside and fills `target`.

    For a simple eigenvalue λₖ = eig(A) with right vectors V and left vectors V⁻¹,
    ∂λₖ/∂A_ij = (V⁻¹)_ki V_jk. A real loss with gradient gₖ = ∂L/∂Re λₖ + i ∂L/∂Im λₖ
    then has steepest-ascent direction G = V⁻ᴴ diag(g) Vᴴ in each sample.
    Attraction pulls eigenvalues outside the region to their nearest painted point;
    coverage pulls the nearest eigenvalue toward random painted points.
    """
    rng = np.random.default_rng(seed)
    grid = target.shape[0]
    cell = 2 * extent / grid
    rows, cols = np.nonzero(target)
    painted = (-extent + (cols + 0.5) * cell) + 1j * (extent - (rows + 0.5) * cell)
    base = body["B"].copy()
    support = (base != 0) if keep_sparsity else np.ones(base.shape, dtype=bool)
    first = np.zeros_like(base)
    second = np.zeros(base.shape)
    step_size = rate * extent / 2.5
    losses = []
    for step in range(steps):
        t, _ = sampler(len(body["E"]), 160, rng)
        values, vectors = np.linalg.eig(base[None] + np.einsum("sm,mij->sij", t, body["E"]))
        try:
            inverse = np.linalg.inv(vectors)
        except np.linalg.LinAlgError:
            continue
        stable = np.abs(inverse).max(axis=(1, 2)) < 1e3
        flat = values.reshape(-1)
        col = np.floor((flat.real + extent) / cell).astype(int)
        row = np.floor((extent - flat.imag) / cell).astype(int)
        valid = (col >= 0) & (col < grid) & (row >= 0) & (row < grid)
        inside = valid & target[row.clip(0, grid - 1), col.clip(0, grid - 1)]
        anchors = painted[rng.choice(len(painted), min(600, len(painted)), replace=False)]
        distance = np.abs(flat[:, None] - anchors[None, :]) ** 2
        pull = np.where(inside, 0, flat - anchors[distance.argmin(axis=1)])
        gradient = 2 * pull / flat.size
        probes = min(300, len(anchors))
        nearest = distance[:, :probes].argmin(axis=0)
        reach = flat[nearest] - anchors[:probes]
        np.add.at(gradient, nearest, coverage * 2 * reach / probes)
        losses.append(float(np.mean(np.abs(pull) ** 2) + coverage * np.mean(np.abs(reach) ** 2)))
        g = gradient.reshape(values.shape) * stable[:, None]
        direction = np.conj(np.swapaxes(inverse, 1, 2)) @ (g[:, :, None] * np.conj(np.swapaxes(vectors, 1, 2)))
        grad = direction.sum(axis=0) * support
        first = 0.9 * first + 0.1 * grad
        second = 0.999 * second + 0.001 * np.abs(grad) ** 2
        corrected = first / (1 - 0.9 ** (step + 1))
        base -= step_size * corrected / (np.sqrt(second / (1 - 0.999 ** (step + 1))) + 1e-12)
    return {**body, "B": base}, losses


@app.function
def anatomy_html(body, palette):
    """B as a grid: hue = phase, opacity = magnitude; outlined cells carry parameters."""
    base, directions = body["B"], body["E"]
    n = len(base)
    peak = max(float(np.abs(base).max()), 1e-9)
    active = np.abs(directions).sum(axis=0) > 0 if len(directions) else np.zeros(base.shape, bool)
    owner = {}
    for m, direction in enumerate(directions):
        if np.count_nonzero(direction) == 1:
            i, j = np.argwhere(direction)[0]
            owner[(i, j)] = body["labels"][m]
    cell = max(10, min(34, 300 // n))
    colors = cycle_colors(np.angle(base), palette["cycle"])
    rows = []
    for i in range(n):
        tds = []
        for j in range(n):
            value = base[i, j]
            alpha = abs(value) / peak
            r, g, b = (int(v) for v in colors[i, j])
            border = "2px solid #E89A39" if active[i, j] else "1px solid rgba(128,128,128,.18)"
            label = owner.get((i, j), "")
            tds.append(
                f'<td title="B[{i + 1},{j + 1}] = {value.real:+.3f}{value.imag:+.3f}i" '
                f'style="width:{cell}px;height:{cell}px;padding:0;border:{border};'
                f'background:rgba({r},{g},{b},{alpha:.3f});font-size:9px;text-align:center">{label}</td>'
            )
        rows.append("<tr>" + "".join(tds) + "</tr>")
    return f'<table style="border-collapse:collapse;margin:0">{"".join(rows)}</table>'


@app.cell(column=0, hide_code=True)
def _():
    mo.md(r"""
    # Eigencreatures

    Every creature is the spectrum of a matrix pencil
    $A(t) = B + \sum_m t_m E_m$, sampled over many parameter vectors $t$.
    Classic eigenfish ([[Simone Conradi]]) replace a few entries of a small
    $\{\pm1, \pm i\}$ matrix with points on the unit torus. Here you can also
    draw the outline, paint the body, walk the parameters along a path or knot,
    and breed variants.
    """)
    return


@app.cell(column=0, hide_code=True)
def _():
    get_mode, set_mode = mo.state("Conradi")
    get_bench, set_bench = mo.state(None)
    return get_bench, get_mode, set_bench, set_mode


@app.cell(column=0, hide_code=True)
def _(get_mode, set_mode):
    mode = mo.ui.radio(MODES, value=get_mode(), on_change=set_mode, inline=True, label="**Body**")
    return (mode,)


@app.cell(column=0, hide_code=True)
def _():
    preset = mo.ui.dropdown(options=list(PRESETS), value="Conradi", label="Preset")
    return (preset,)


@app.cell(column=0, hide_code=True)
def _(preset):
    _selected = PRESETS[preset.value]
    _labels = [str(index + 1) for index in range(len(_selected["matrix"]))]
    matrix_editor = mo.ui.matrix(
        _selected["matrix"], min_value=-2, max_value=2, step=1, precision=0,
        row_labels=_labels, column_labels=_labels, debounce=True, label="Codes",
    )
    mask_editor = mo.ui.matrix(
        _selected["mask"], min_value=0, max_value=1, step=1, precision=0,
        row_labels=_labels, column_labels=_labels, debounce=True, label="Parameter slots",
    )
    return mask_editor, matrix_editor


@app.cell(column=0, hide_code=True)
def _():
    ensemble = mo.ui.dictionary({
        "size": mo.ui.slider(3, 12, value=6, label="Size", show_value=True),
        "density": mo.ui.slider(0.1, 1.0, step=0.05, value=0.45, label="Density", show_value=True),
        "alphabet": mo.ui.dropdown(list(ALPHABETS), value="±1, ±i", label="Alphabet"),
        "structure": mo.ui.dropdown(
            ["free", "cyclic band", "Hessenberg", "tridiagonal", "shift + chords"],
            value="free", label="Structure",
        ),
        "slots": mo.ui.slider(1, 4, value=2, label="Parameter slots", show_value=True),
        "seed": mo.ui.number(start=0, stop=10**6, value=11, label="Seed"),
    })
    return (ensemble,)


@app.cell(column=0, hide_code=True)
def _():
    outline_editor = mo.ui.anywidget(CurveEditor(
        points=FISH_OUTLINE, curve="catmull_rom", closed=True,
        x_bounds=(-2.0, 2.0), y_bounds=(-2.0, 2.0), width=360, height=360,
        show_axes=True, sync_throttle_ms=400,
    ))
    outline_controls = mo.ui.dictionary({
        "harmonics": mo.ui.slider(2, 15, value=8, label="Harmonics K", show_value=True),
        "size": mo.ui.slider(8, 32, value=17, label="Matrix size n", show_value=True),
        "texture": mo.ui.slider(0.0, 1.0, step=0.02, value=0.3, label="Texture ε", show_value=True),
        "slots": mo.ui.slider(0, 3, value=1, label="Texture slots", show_value=True),
        "seed": mo.ui.number(start=0, stop=10**6, value=3, label="Texture seed"),
    })
    return outline_controls, outline_editor


@app.cell(column=0, hide_code=True)
def _(
    ensemble,
    get_bench,
    mask_editor,
    matrix_editor,
    mode,
    outline_controls,
    outline_editor,
    preset,
):
    _bench = get_bench()
    if mode.value == "Conradi":
        _panel = mo.vstack([
            preset,
            mo.hstack([matrix_editor, mask_editor], justify="start", gap=1.5),
            mo.md("Codes: `−2 = −i`, `−1`, `0`, `1`, `2 = i`. A `1` in the slot grid turns that entry into a parameter."),
        ])
    elif mode.value == "Ensemble":
        _panel = mo.vstack([
            mo.hstack([ensemble["size"], ensemble["density"], ensemble["slots"]], justify="start"),
            mo.hstack([ensemble["alphabet"], ensemble["structure"], ensemble["seed"]], justify="start"),
        ])
    elif mode.value == "Outline":
        _panel = mo.hstack([
            outline_editor,
            mo.vstack([
                *outline_controls.elements.values(),
                mo.md(r"""
                Drag knots; double-click to add or remove one. The outline's Fourier
                series becomes a twisted circulant: path **Knot** with windings `1, -1`
                and no jitter walks exactly along it, jitter makes it a tube, and
                **Torus** fills it in.
                """),
            ]),
        ], justify="start", gap=1.5)
    elif _bench is None:
        _panel = mo.callout(mo.md("The workbench fills when you **sculpt** or **adopt** a bred creature."), kind="info")
    else:
        _panel = mo.md("Lineage: " + " → ".join(_bench["history"]))
    mo.vstack([mode, _panel], gap=0.75)
    return


@app.cell(column=0, hide_code=True)
def _(
    ensemble,
    get_bench,
    mask_editor,
    matrix_editor,
    mode,
    outline_controls,
    outline_editor,
):
    if mode.value == "Conradi":
        body = conradi_body(matrix_editor.value, mask_editor.value)
    elif mode.value == "Ensemble":
        _e = ensemble.value
        body = ensemble_body(_e["size"], _e["density"], _e["alphabet"], _e["structure"], _e["slots"], int(_e["seed"]))
    elif mode.value == "Outline":
        _o = outline_controls.value
        body = outline_body(
            outline_editor.value["points"], _o["harmonics"], _o["size"],
            _o["texture"], _o["slots"], int(_o["seed"]),
        )
    else:
        body = get_bench()["body"] if get_bench() else None
    return (body,)


@app.cell(column=0, hide_code=True)
def _():
    path_kind = mo.ui.dropdown(SAMPLERS, value="Torus", label="**Parameter path**")
    path_controls = mo.ui.dictionary({
        "samples": mo.ui.slider(2000, 60000, step=2000, value=20000, debounce=True, show_value=True, label="Samples"),
        "radius": mo.ui.slider(0.25, 2.0, step=0.05, value=1.0, debounce=True, show_value=True, label="Radius"),
        "radii": mo.ui.range_slider(0.2, 3.0, step=0.05, value=[0.7, 1.4], debounce=True, show_value=True, label="Radii"),
        "windings": mo.ui.text(value="1, -1", label="Windings"),
        "jitter": mo.ui.slider(0.0, 0.6, step=0.01, value=0.06, debounce=True, show_value=True, label="Jitter"),
        "lag": mo.ui.slider(0.0, 1.0, step=0.01, value=0.25, debounce=True, show_value=True, label="Lag between slots"),
    })
    path_curve = mo.ui.anywidget(BezierCurve(
        points=PATH_POINTS, closed=True, x_bounds=(-2.0, 2.0), y_bounds=(-2.0, 2.0),
        width=320, height=320, show_axes=True, sync_throttle_ms=400,
    ))
    return path_controls, path_curve, path_kind


@app.cell(column=0, hide_code=True)
def _(path_controls, path_curve, path_kind):
    _c = path_controls
    _notes = {
        "Torus": "Each slot gets an independent phase on a circle of fixed radius: the classic eigenfish.",
        "Annulus": "Phases are free and radii log-uniform between the bounds, which thickens every strand.",
        "Knot": "One loop s ∈ [0, 1) drives slot m at phase 2π·wₘ·s; slots without a winding stay free. Jitter turns the loop into a tubule.",
        "Drawn path": "Slot 1 follows the Bezier path (double-click to add control points); slot m follows it shifted by m·lag. Jitter widens the tube.",
    }
    _shown = {
        "Torus": [_c["radius"]],
        "Annulus": [_c["radii"]],
        "Knot": [_c["windings"], _c["radius"], _c["jitter"]],
        "Drawn path": [_c["lag"], _c["jitter"]],
    }[path_kind.value]
    _parts = [mo.hstack([path_kind, _c["samples"]], justify="start"), mo.hstack(_shown, justify="start"), mo.md(_notes[path_kind.value])]
    if path_kind.value == "Drawn path":
        _parts.append(path_curve)
    mo.vstack(_parts, gap=0.6)
    return


@app.cell(column=0, hide_code=True)
def _(path_controls, path_curve, path_kind):
    _v = path_controls.value
    _path = bezier_points(path_curve.value["points"], path_curve.value.get("closed", True))
    _windings = parse_windings(_v["windings"])

    def sampler(m, count, rng):
        return sample_parameters(
            path_kind.value, m, count, rng, _v["radius"], _v["radii"],
            _windings, _v["jitter"], _path, _v["lag"],
        )

    sample_count = _v["samples"]
    return sample_count, sampler


@app.cell(column=0, hide_code=True)
def _():
    look = mo.ui.dictionary({
        "palette": mo.ui.dropdown(list(PALETTES), value="Paper · ink", label="Palette"),
        "color": mo.ui.dropdown(["Ink", "Phase of t₁", "Phase of t₂", "Path position s"], value="Ink", label="Colour by"),
        "lens": mo.ui.dropdown(list(LENSES), value="λ", label="Lens"),
        "gamma": mo.ui.slider(0.3, 1.5, step=0.02, value=0.72, show_value=True, label="Gamma"),
    })
    mo.vstack([mo.md("**Look**"), mo.hstack(list(look.elements.values()), justify="start")])
    return (look,)


@app.cell(column=0, hide_code=True)
def _():
    sketch_widget = SpectrumSketch()
    sketch = mo.ui.anywidget(sketch_widget)
    sculpt_controls = mo.ui.dictionary({
        "extent": mo.ui.number(start=0.5, stop=20, step=0.5, value=2.5, label="Canvas half-width"),
        "steps": mo.ui.slider(10, 300, step=10, value=80, show_value=True, label="Steps"),
        "rate": mo.ui.slider(0.002, 0.1, step=0.002, value=0.02, show_value=True, label="Step size"),
        "coverage": mo.ui.slider(0.0, 3.0, step=0.1, value=1.0, show_value=True, label="Fill pressure"),
        "sparse": mo.ui.checkbox(value=False, label="Only move nonzero entries"),
    })
    return sculpt_controls, sketch, sketch_widget


@app.cell(column=0, hide_code=True)
def _(sculpt_controls, sketch):
    mo.vstack([
        mo.md(r"""
        ## Paint the body

        Paint where the creature should live, over its current spectrum (ochre).
        **Sculpt** runs gradient descent on $B$ through
        $\partial\lambda_k/\partial A_{ij} = (V^{-1})_{ki}V_{jk}$: eigenvalues outside the
        paint are pulled to it, and fill pressure drags eigenvalues out to empty paint.
        The result lands on the workbench, so pressing again keeps sculpting.
        """),
        mo.hstack([
            sketch,
            mo.vstack(list(sculpt_controls.elements.values())),
        ], justify="start", gap=1.5),
    ])
    return


@app.cell(column=0, hide_code=True)
def _(look, sculpt_controls, sketch_widget, z):
    _extent = float(sculpt_controls.value["extent"])
    sketch_widget.extent = _extent
    sketch_widget.background = data_url(render_creature(
        z, OVERLAY, size=420, gamma=look.value["gamma"], view=(0j, _extent), transparent=True,
    ))
    return


@app.cell(column=0, hide_code=True)
def _(sculpt_controls, sketch):
    target = rasterize_strokes(sketch.value["strokes"], float(sculpt_controls.value["extent"]))
    return (target,)


@app.cell(column=0, hide_code=True)
def _(body, get_bench, sampler, sculpt_controls, set_bench, set_mode, target):
    # The action lives in on_click: a rerun from the workbench update rebuilds the
    # button but cannot press it again.
    def _sculpt(clicks):
        _s = sculpt_controls.value
        _history = (get_bench() or {}).get("history") or [body["name"]]
        _sculpted, _losses = sculpt(
            body, target, float(_s["extent"]), sampler, _s["steps"], _s["rate"],
            _s["coverage"], _s["sparse"], seed=len(_history),
        )
        _sculpted["name"] = f"sculpted ×{_s['steps']}"
        set_bench({"body": _sculpted, "history": [*_history, _sculpted["name"]], "losses": _losses})
        set_mode("Workbench")
        return clicks + 1

    _ready = body is not None and bool(target.any())
    sculpt_button = mo.ui.button(value=0, on_click=_sculpt, label="Sculpt", kind="warn", disabled=not _ready)
    mo.hstack([
        sculpt_button,
        mo.md("Sculpting continues from the current body." if _ready else "Paint a region to enable sculpting."),
    ], justify="start", align="center")
    return


@app.cell(column=1, hide_code=True)
def _(body, look, sample_count, sampler):
    mo.stop(
        body is None,
        mo.callout(mo.md("The workbench is empty: sculpt a painted region or adopt a bred creature."), kind="info"),
    )
    mo.stop(len(body["E"]) == 0, mo.callout(mo.md("Give the matrix at least one parameter slot."), kind="warn"))
    _rng = np.random.default_rng(7)
    params, positions = sampler(len(body["E"]), sample_count, _rng)
    eigenvalues = spectrum(body, params)
    z = apply_lens(look.value["lens"], eigenvalues).reshape(-1)
    return eigenvalues, params, positions, z


@app.cell(column=1, hide_code=True)
def _(eigenvalues, look, params, positions):
    _n = eigenvalues.shape[1]
    _choice = look.value["color"]
    if _choice == "Phase of t₁" and params.shape[1] >= 1:
        hue = np.repeat(np.angle(params[:, 0]), _n)
    elif _choice == "Phase of t₂" and params.shape[1] >= 2:
        hue = np.repeat(np.angle(params[:, 1]), _n)
    elif _choice == "Path position s":
        hue = np.repeat(2 * np.pi * positions, _n)
    else:
        hue = None
    return (hue,)


@app.cell(column=1, hide_code=True)
def _(body, eigenvalues, hue, look, path_kind, z):
    _palette = PALETTES[look.value["palette"]]
    _image = render_creature(z, _palette, hue=hue, gamma=look.value["gamma"])
    _n = eigenvalues.shape[1]

    def _poster():
        return png_bytes(render_creature(z, _palette, hue=hue, size=2048, gamma=look.value["gamma"]))

    mo.vstack([
        mo.Html(
            f'<img src="{data_url(_image)}" style="width:100%;max-width:760px;border-radius:6px" '
            f'alt="Eigenvalue density of the current creature" />'
        ),
        mo.hstack([
            mo.md(
                f"{z.size:,} eigenvalues · {_n}×{_n} · {len(body['E'])} parameters "
                f"({', '.join(body['labels'])}) · {path_kind.value} · lens {look.value['lens']}"
            ),
            mo.download(_poster, filename="eigencreature.png", mimetype="image/png", label="PNG 2048²"),
        ], justify="space-between", align="center"),
    ])
    return


@app.cell(column=1, hide_code=True)
def _(body, get_bench, look, mode):
    _bench = get_bench()
    _parts = [
        mo.md("### Anatomy of B\nHue is phase, opacity is magnitude, and outlined cells move with a parameter. Hover a cell for its value."),
        mo.Html(anatomy_html(body, PALETTES[look.value["palette"]])),
    ]
    if mode.value == "Workbench" and _bench and _bench.get("losses"):
        _losses = _bench["losses"]
        _fig = go.Figure(go.Scatter(y=_losses, mode="lines", line={"color": "#E89A39"}))
        _fig.update_layout(height=160, margin={"l": 40, "r": 10, "t": 24, "b": 30}, title="Last sculpt: loss per step",
                           paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)", font={"color": "#888"})
        _parts.append(_fig)
    _source = (
        "import numpy as np\n"
        f"B = np.array({np.array2string(body['B'], precision=3, separator=', ', suppress_small=True, max_line_width=110)})\n"
        f"E = np.array({np.array2string(body['E'], precision=3, separator=', ', suppress_small=True, max_line_width=110, threshold=10**6)})\n"
        "# A(t) = B + np.einsum('sm,mij->sij', t, E)"
    )
    _parts.append(mo.accordion({"Matrix source": mo.ui.code_editor(_source, language="python", disabled=True)}))
    mo.vstack(_parts)
    return


@app.cell(column=1, hide_code=True)
def _(eigenvalues, hue, look, params, positions, z):
    _rng = np.random.default_rng(1)
    _count = min(9000, z.size)
    probe_index = np.sort(_rng.choice(z.size, _count, replace=False))
    probe_sample = probe_index // eigenvalues.shape[1]
    _palette = PALETTES[look.value["palette"]]
    _colors = [f"rgb{tuple(c)}" for c in _palette["cycle"]]
    _scale = [[k / len(_colors), c] for k, c in enumerate(_colors)] + [[1.0, _colors[0]]]
    _hue = hue[probe_index] if hue is not None else 2 * np.pi * positions[probe_sample]
    _fig = go.Figure(go.Scattergl(
        x=z.real[probe_index], y=z.imag[probe_index], mode="markers",
        marker={"size": 3, "opacity": 0.55, "color": np.mod(_hue, 2 * np.pi), "colorscale": _scale, "cmin": 0, "cmax": 2 * np.pi},
        hoverinfo="skip",
    ))
    _center, _half = auto_view(z)
    _fig.update_layout(
        height=440, dragmode="lasso", margin={"l": 30, "r": 10, "t": 10, "b": 30},
        paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)", font={"color": "#888"},
        xaxis={"range": [_center.real - _half, _center.real + _half], "showgrid": False, "zeroline": False},
        yaxis={"range": [_center.imag - _half, _center.imag + _half], "scaleanchor": "x", "showgrid": False, "zeroline": False},
    )
    probe = mo.ui.plotly(_fig)
    mo.vstack([
        mo.md("## Probe\nLasso part of the creature to see which parameters produce it."),
        probe,
    ])
    return probe, probe_sample


@app.cell(column=1, hide_code=True)
def _(params, path_kind, probe, probe_sample):
    _chosen = np.unique(probe_sample[np.asarray(probe.indices, dtype=int)]) if probe.indices else np.array([], int)
    _all = np.unique(probe_sample)
    _m = params.shape[1]

    def _coords(rows):
        p = params[rows]
        if path_kind.value == "Drawn path" or _m == 1:
            return p[:, 0].real, p[:, 0].imag, "Re t₁", "Im t₁"
        return np.mod(np.angle(p[:, 0]), 2 * np.pi), np.mod(np.angle(p[:, 1]), 2 * np.pi), "arg t₁", "arg t₂"

    _x, _y, _xl, _yl = _coords(_all)
    _fig = go.Figure(go.Scattergl(x=_x, y=_y, mode="markers", marker={"size": 3, "color": "rgba(128,128,128,0.25)"}, name="all"))
    if len(_chosen):
        _cx, _cy, _, _ = _coords(_chosen)
        _fig.add_trace(go.Scattergl(x=_cx, y=_cy, mode="markers", marker={"size": 4, "color": "#E89A39"}, name="selected"))
    _fig.update_layout(
        height=340, showlegend=False, margin={"l": 40, "r": 10, "t": 10, "b": 40},
        paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)", font={"color": "#888"},
        xaxis_title=_xl, yaxis_title=_yl,
    )
    _note = (
        f"{len(_chosen):,} of {len(_all):,} probed samples contribute to the selection."
        if len(_chosen) else "No selection: every probed parameter sample is shown in grey."
    )
    mo.vstack([mo.md(f"**Preimage in parameter space.** {_note}"), _fig])
    return


@app.cell(column=1, hide_code=True)
def _():
    breed = mo.ui.dictionary({
        "source": mo.ui.radio(["Mutate current", "Fresh ensemble"], value="Mutate current", inline=True, label="Source"),
        "count": mo.ui.slider(8, 48, step=4, value=24, show_value=True, label="Candidates"),
        "strength": mo.ui.slider(1, 8, value=2, show_value=True, label="Edits per mutant"),
        "x": mo.ui.dropdown(FEATURES, value="fill", label="x"),
        "y": mo.ui.dropdown(FEATURES, value="porosity", label="y"),
    })
    reroll = mo.ui.button(value=0, on_click=lambda count: count + 1, label="New litter")
    mo.vstack([
        mo.md("## Breed\nEach dot is a candidate placed by its shape features. Lasso the ones you like, then adopt one onto the workbench."),
        mo.hstack([breed["source"], breed["count"], breed["strength"]], justify="start"),
        mo.hstack([breed["x"], breed["y"], reroll], justify="start"),
    ])
    return breed, reroll


@app.cell(column=1, hide_code=True)
def _(body, breed, ensemble, look, reroll, sampler):
    mo.stop(body is None and breed.value["source"] == "Mutate current", mo.md("Nothing to mutate yet."))
    _rng = np.random.default_rng(1000 + reroll.value)
    _e = ensemble.value
    candidates = []
    for _k in range(breed.value["count"]):
        if breed.value["source"] == "Mutate current":
            _child = mutate(body, breed.value["strength"], _rng, f"mutant #{_k}")
        else:
            _seed = int(_rng.integers(10**6))
            _child = ensemble_body(_e["size"], _e["density"], _e["alphabet"], _e["structure"], _e["slots"], _seed)
        _t, _ = sampler(len(_child["E"]), 1500, _rng)
        _z = apply_lens(look.value["lens"], spectrum(_child, _t)).reshape(-1)
        candidates.append({
            "id": _k,
            "body": _child,
            "features": shape_features(_z),
            "thumb": data_url(render_creature(_z, PALETTES[look.value["palette"]], size=150, gamma=look.value["gamma"])),
        })
    return (candidates,)


@app.cell(column=1, hide_code=True)
def _(breed, candidates):
    _x = [c["features"][breed.value["x"]] for c in candidates]
    _y = [c["features"][breed.value["y"]] for c in candidates]
    _fig = go.Figure(go.Scatter(
        x=_x, y=_y, mode="markers+text", text=[str(c["id"]) for c in candidates], textposition="top center",
        marker={"size": 11, "color": "#E89A39", "line": {"width": 1, "color": "#303B49"}},
    ))
    _fig.update_layout(
        height=320, dragmode="lasso", margin={"l": 50, "r": 10, "t": 10, "b": 40},
        paper_bgcolor="rgba(0,0,0,0)", plot_bgcolor="rgba(0,0,0,0)", font={"color": "#888"},
        xaxis_title=breed.value["x"], yaxis_title=breed.value["y"],
    )
    litter_plot = mo.ui.plotly(_fig)
    litter_plot
    return (litter_plot,)


@app.cell(column=1, hide_code=True)
def _(candidates, litter_plot):
    _picked = sorted(set(litter_plot.indices)) if litter_plot.indices else []
    shown = [candidates[i] for i in _picked] or candidates
    _tiles = "".join(
        f'<figure style="margin:0;text-align:center"><img src="{c["thumb"]}" width="150" height="150" '
        f'style="border-radius:4px" alt="Candidate {c["id"]}"/><figcaption style="font-size:11px;opacity:.75">'
        f'#{c["id"]} · fill {c["features"]["fill"]:.2f} · pores {c["features"]["porosity"]:.2f}</figcaption></figure>'
        for c in shown
    )
    adopt_choice = mo.ui.dropdown({f"#{c['id']}": c["id"] for c in shown}, value=f"#{shown[0]['id']}", label="Candidate")
    mo.vstack([
        mo.md(f"{'Selected' if _picked else 'All'} {len(shown)} candidates"),
        mo.Html(f'<div style="display:grid;grid-template-columns:repeat(auto-fill,150px);gap:10px">{_tiles}</div>'),
    ])
    return (adopt_choice,)


@app.cell(column=1, hide_code=True)
def _(adopt_choice, body, candidates, get_bench, set_bench, set_mode):
    def _adopt(clicks):
        _child = candidates[adopt_choice.value]["body"]
        _history = (get_bench() or {}).get("history") or [body["name"] if body else "litter"]
        set_bench({"body": _child, "history": [*_history, _child["name"]]})
        set_mode("Workbench")
        return clicks + 1

    adopt_button = mo.ui.button(value=0, on_click=_adopt, label="Adopt onto workbench", kind="success")
    mo.hstack([adopt_choice, adopt_button], justify="start")
    return


if __name__ == "__main__":
    app.run()
