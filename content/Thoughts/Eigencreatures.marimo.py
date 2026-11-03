# description: Paint a small matrix, let a few entries wander, and trace every part of the creature back to the entries that made it.
# /// script
# requires-python = ">=3.12"
# dependencies = [
#     "anywidget",
#     "marimo==0.25.2",
#     "numpy",
#     "traitlets",
# ]
# ///

import marimo

__generated_with = "0.25.2"
app = marimo.App(width="medium", app_title="Eigencreatures")

with app.setup(hide_code=True):
    import base64
    import struct
    import zlib

    import anywidget
    import marimo as mo
    import numpy as np
    import traitlets

    VALUES = {"0": 0, "1": 1, "i": 1j, "-1": -1, "-i": -1j}
    POPULATIONS = {"pm": np.array([1, -1], complex), "ik": np.array([1, 1j, -1, -1j])}
    SLOTS = ("t1", "t2")
    PROBES = 3000
    PAPER, INK = (245, 241, 235), (28, 28, 30)

    def _conradi(changes=()):
        rows = [
            "-i 0 0 0 0 0",
            "0 0 1 1 0 1",
            "i 0 0 1 0 i",
            "0 0 0 -i -i i",
            "-i 1 0 0 -i 1",
            "-i 1 0 0 0 -i",
        ]
        cells = [row.split() for row in rows]
        cells[0][2], cells[0][5] = "t1", "t2"
        for (i, j), code in changes:
            cells[i][j] = code
        return cells

    def _tridiagonal(n, code):
        return [[code if abs(i - j) <= 1 else "0" for j in range(n)] for i in range(n)]

    PRESETS = {
        "Fish": {"cells": _conradi(), "R": 1, "b": 1},
        "Wings": {"cells": _conradi(), "R": 1, "b": 0},
        "Ghosts": {"cells": _conradi([((3, 3), "ik")]), "R": 1, "b": 1},
        "Collage": {"cells": _conradi([((2, 4), "pm"), ((4, 1), "pm")]), "R": 1, "b": 0},
        "Lace": {"cells": _tridiagonal(5, "ik"), "R": 1, "b": 1},
    }
    for _spec in PRESETS.values():
        _spec["key"] = (
            ";".join(",".join(row) for row in _spec["cells"]) + f"|{_spec['R']}|{_spec['b']}"
        )

    CREATURE_ESM = r"""
    const GLYPH = { "0": "", "1": "1", i: "i", "-1": "−1", "-i": "−i", t1: "t₁", t2: "t₂", pm: "±1", ik: "iᵏ" };
    const NAME = { "0": "zero", "1": "one", i: "i", "-1": "minus one", "-i": "minus i", t1: "t one", t2: "t two", pm: "plus or minus one", ik: "a power of i" };
    const BRUSHES = ["1", "i", "-1", "-i", "0", "t1", "t2", "pm", "ik"];
    const POPS = { pm: ["1", "-1"], ik: ["1", "i", "-1", "-i"] };
    const SLOT_COLOR = { t1: "#E89A39", t2: "#56706B" };
    const HEAT = "191,97,89";
    const SNAP = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5, 6, 8, 10, 12, 15, 20];
    const RMAX = 20;

    const make = (tag, cls, parent) => {
      const node = document.createElement(tag);
      if (cls) node.className = cls;
      if (parent) parent.appendChild(node);
      return node;
    };
    const decode = (text, Type) => {
      const raw = atob(text || "");
      const bytes = new Uint8Array(raw.length);
      for (let k = 0; k < raw.length; k++) bytes[k] = raw.charCodeAt(k);
      return new Type(bytes.buffer);
    };
    const keyOf = (spec) => spec.cells.map((row) => row.join(",")).join(";") + `|${spec.R}|${spec.b}`;
    const withKey = (spec) => ({ ...spec, key: keyOf(spec) });
    const clone = (spec) => ({ cells: spec.cells.map((row) => [...row]), R: spec.R, b: spec.b });
    const snap = (value) => SNAP.reduce((best, s) => (Math.abs(s - value) < Math.abs(best - value) ? s : best), 0);

    function ellipseTable(R, b, count = 720) {
      const phi = [], pts = [], arc = [0];
      for (let k = 0; k <= 2048; k++) {
        const p = (2 * Math.PI * k) / 2048;
        phi.push(p);
        pts.push([R * Math.cos(p), b * Math.sin(p)]);
        if (k) arc.push(arc[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
      }
      const total = arc[2048];
      const out = [];
      let j = 0;
      for (let k = 0; k < count; k++) {
        const target = (k / count) * total;
        while (j < 2047 && arc[j + 1] < target) j++;
        const f = total ? (target - arc[j]) / Math.max(arc[j + 1] - arc[j], 1e-12) : 0;
        const p = phi[j] + f * (phi[j + 1] - phi[j]);
        out.push({ u: k / count, x: R * Math.cos(p), y: b * Math.sin(p) });
      }
      return out;
    }

    function render({ model, el }) {
      const root = make("div", "ec", el);
      const pills = make("div", "ec-pills", root);
      const main = make("div", "ec-main", root);
      const stage = make("div", "ec-stage", main);
      stage.setAttribute("role", "img");
      stage.setAttribute("aria-label", "Eigenvalue density of the current matrix");
      const img = make("div", "ec-img", stage);
      const over = make("canvas", "ec-over", stage);
      const side = make("div", "ec-side", main);
      const brushRow = make("div", "ec-brushes", side);
      const grid = make("div", "ec-matrix", side);
      const sizeRow = make("div", "ec-size", side);
      const plane = make("canvas", "ec-plane", side);
      plane.setAttribute("aria-label", "Domain of t: drag the handles to stretch it");
      const hist = make("div", "ec-hist", root);

      let spec = clone(model.get("spec"));
      let frame = null, data = null, view = null, commitTimer = null;
      let hover = null, pinned = null, brush = "1", painting = null, drag = null;
      const history = [];

      const ink = () => getComputedStyle(root).color;
      const fit = (canvas) => {
        const dpr = window.devicePixelRatio || 1;
        const w = canvas.clientWidth;
        if (canvas.width !== Math.round(w * dpr)) {
          canvas.width = Math.round(w * dpr);
          canvas.height = Math.round(w * dpr);
        }
        const ctx = canvas.getContext("2d");
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return [ctx, w];
      };

      // ---------- presets, brushes, size ----------
      const presets = model.get("presets");
      const presetButtons = Object.entries(presets).map(([name, preset]) => {
        const button = make("button", "", pills);
        button.type = "button";
        button.textContent = name;
        button.addEventListener("click", () => commit(clone(preset), true));
        return [button, preset.key];
      });
      const brushButtons = BRUSHES.map((code) => {
        const button = make("button", `ec-brush ec-${code}`, brushRow);
        button.type = "button";
        button.textContent = code === "0" ? "0" : GLYPH[code];
        button.setAttribute("aria-label", `Brush: ${NAME[code]}`);
        button.addEventListener("click", () => {
          brush = code;
          paintBrushes();
        });
        return [button, code];
      });
      const shrink = make("button", "", sizeRow);
      shrink.type = "button";
      shrink.textContent = "−";
      shrink.setAttribute("aria-label", "Remove the last row and column");
      const grow = make("button", "", sizeRow);
      grow.type = "button";
      grow.textContent = "+";
      grow.setAttribute("aria-label", "Add a row and column");
      shrink.addEventListener("click", () => resize(-1));
      grow.addEventListener("click", () => resize(1));

      function resize(delta) {
        const n = spec.cells.length + delta;
        if (n < 2 || n > 10) return;
        const next = clone(spec);
        next.cells = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => spec.cells[i]?.[j] ?? "0"));
        commit(next, true);
      }

      function paintBrushes() {
        for (const [button, code] of brushButtons) button.setAttribute("aria-pressed", String(code === brush));
      }
      function paintPills() {
        const key = keyOf(spec);
        for (const [button, presetKey] of presetButtons) button.setAttribute("aria-pressed", String(presetKey === key));
      }

      function commit(next, resetView) {
        spec = clone(next);
        model.set("spec", withKey(spec));
        if (resetView) model.set("view", []);
        model.save_changes();
        stage.classList.add("pending");
        hover = pinned = null;
        buildMatrix();
        paintPills();
        paintAll();
      }

      // ---------- matrix ----------
      let cellNodes = [];
      function buildMatrix() {
        const n = spec.cells.length;
        grid.replaceChildren();
        grid.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
        cellNodes = [];
        spec.cells.forEach((row, i) =>
          row.forEach((code, j) => {
            const cell = make("button", "ec-cell", grid);
            cell.type = "button";
            cell.dataset.i = i;
            cell.dataset.j = j;
            cellNodes.push(cell);
          })
        );
        paintMatrix();
      }
      function paintMatrix(heat = null, starValues = null) {
        const n = spec.cells.length;
        cellNodes.forEach((cell, k) => {
          const i = Math.floor(k / n), j = k % n, code = spec.cells[i][j];
          const fixed = starValues?.[k];
          cell.textContent = fixed ? GLYPH[fixed] : GLYPH[code];
          const hot = hover?.kind === "cell" && hover.i === i && hover.j === j;
          cell.className = `ec-cell ec-${code}${fixed ? " ec-fixed" : ""}${hot ? " ec-hot" : ""}`;
          cell.setAttribute("aria-label", `Row ${i + 1}, column ${j + 1}: ${NAME[code]}`);
          const h = heat ? heat[k] : 0;
          cell.style.background = h > 0.02 ? `rgba(${HEAT},${(0.1 + 0.62 * h).toFixed(3)})` : "";
        });
      }
      const cellAt = (event) => {
        const rootNode = grid.getRootNode();
        const hit = (rootNode.elementFromPoint ? rootNode : document).elementFromPoint(event.clientX, event.clientY);
        return hit && hit.closest ? hit.closest(".ec-cell") : null;
      };
      const applyBrush = (cell, toggle) => {
        const i = +cell.dataset.i, j = +cell.dataset.j;
        const next = toggle && spec.cells[i][j] === brush ? "0" : brush;
        if (spec.cells[i][j] === next) return;
        spec.cells[i][j] = next;
        painting.changed = true;
        paintMatrix();
      };
      grid.addEventListener("pointerdown", (event) => {
        const cell = cellAt(event);
        if (!cell) return;
        event.preventDefault();
        painting = { changed: false };
        applyBrush(cell, true);
      });
      grid.addEventListener("pointermove", (event) => {
        const cell = cellAt(event);
        if (painting) {
          if (cell) applyBrush(cell, false);
          return;
        }
        const next = cell ? { kind: "cell", i: +cell.dataset.i, j: +cell.dataset.j } : null;
        if (JSON.stringify(next) !== JSON.stringify(hover)) {
          hover = next;
          paintAll();
        }
      });
      grid.addEventListener("pointerleave", () => {
        if (hover?.kind === "cell") {
          hover = null;
          paintAll();
        }
      });
      const endPaint = () => {
        if (!painting) return;
        const changed = painting.changed;
        painting = null;
        if (changed) commit(spec, true);
      };
      window.addEventListener("pointerup", endPaint);

      // ---------- creature geometry ----------
      const width = () => stage.clientWidth || 1;
      const toPx = (x, y) => {
        const [cx, cy, h] = view, w = width();
        return [((x - cx) / h + 1) * 0.5 * w, ((cy - y) / h + 1) * 0.5 * w];
      };
      const fromPx = (px, py) => {
        const [cx, cy, h] = view, w = width();
        return [cx + ((2 * px) / w - 1) * h, cy - ((2 * py) / w - 1) * h];
      };
      function placeImage() {
        if (!frame) return;
        const [fx, fy, fh] = frame.view;
        const [left, top] = toPx(fx - fh, fy + fh);
        const size = (width() * fh) / view[2];
        Object.assign(img.style, { left: `${left}px`, top: `${top}px`, width: `${size}px`, height: `${size}px` });
      }

      function hitsNear(x, y) {
        const { eig, K, n } = data;
        const r = 0.035 * 2 * view[2], r2 = r * r;
        const hits = [];
        for (let p = 0; p < K * n; p++) {
          const dx = eig[2 * p] - x, dy = eig[2 * p + 1] - y;
          if (dx * dx + dy * dy < r2) hits.push(p);
        }
        return hits;
      }

      // ---------- t plane ----------
      let table = [];
      const PLANE_KNEE = 0.15;
      const planeScale = (w) => (w / 2 - 10) / Math.log1p((RMAX * 1.1) / PLANE_KNEE);
      const planePx = (x, y, w) => {
        const rho = Math.hypot(x, y);
        if (rho === 0) return [w / 2, w / 2];
        const s = (planeScale(w) * Math.log1p(rho / PLANE_KNEE)) / rho;
        return [w / 2 + x * s, w / 2 - y * s];
      };
      const planeRho = (d, w) => PLANE_KNEE * Math.expm1(d / planeScale(w));

      function drawPlane(dots = [], marker = null) {
        const [ctx, w] = fit(plane);
        const color = ink();
        ctx.clearRect(0, 0, w, w);
        ctx.strokeStyle = color;
        ctx.globalAlpha = 0.18;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(6, w / 2);
        ctx.lineTo(w - 6, w / 2);
        ctx.moveTo(w / 2, 6);
        ctx.lineTo(w / 2, w - 6);
        ctx.stroke();
        ctx.setLineDash([2, 3]);
        ctx.beginPath();
        const unit = planePx(1, 0, w)[0] - w / 2;
        ctx.arc(w / 2, w / 2, unit, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = color;
        ctx.font = "10px var(--codeFont, ui-monospace, monospace)";
        ctx.fillText("1", w / 2 + unit + 3, w / 2 - 4);

        const R = drag?.axis === "R" ? drag.value : spec.R;
        const b = drag?.axis === "b" ? drag.value : spec.b;
        table = ellipseTable(R, b);
        ctx.globalAlpha = 1;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        table.forEach((p, k) => {
          const [x, y] = planePx(p.x, p.y, w);
          if (k) ctx.lineTo(x, y);
          else ctx.moveTo(x, y);
        });
        ctx.closePath();
        ctx.stroke();

        for (const [x, y, c] of dots) {
          const [px, py] = planePx(x, y, w);
          ctx.fillStyle = c;
          ctx.globalAlpha = 0.75;
          ctx.beginPath();
          ctx.arc(px, py, 2.2, 0, 2 * Math.PI);
          ctx.fill();
        }
        if (marker) {
          const [px, py] = planePx(marker.x, marker.y, w);
          ctx.globalAlpha = 1;
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(px, py, 5, 0, 2 * Math.PI);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
        for (const axis of ["R", "b"]) {
          const value = axis === "R" ? R : b;
          const [px, py] = axis === "R" ? planePx(value, 0, w) : planePx(0, value, w);
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(px, py, drag?.axis === axis ? 6 : 4.5, 0, 2 * Math.PI);
          ctx.fill();
          if (drag?.axis === axis) {
            ctx.font = "11px var(--codeFont, ui-monospace, monospace)";
            ctx.fillText(String(value), px + 8, py - 8);
          }
        }
      }

      const planePoint = (event) => {
        const r = plane.getBoundingClientRect();
        return [event.clientX - r.left, event.clientY - r.top, r.width];
      };
      const handleAt = (px, py, w) => {
        for (const axis of ["R", "b"]) {
          const [hx, hy] = axis === "R" ? planePx(spec.R, 0, w) : planePx(0, spec.b, w);
          if (Math.hypot(px - hx, py - hy) < 13) return axis;
        }
        return null;
      };
      const nearestU = (px, py, w) => {
        let best = null, dist = 18;
        for (const p of table) {
          const [x, y] = planePx(p.x, p.y, w);
          const d = Math.hypot(px - x, py - y);
          if (d < dist) {
            dist = d;
            best = p;
          }
        }
        return best;
      };
      plane.addEventListener("pointerdown", (event) => {
        const [px, py, w] = planePoint(event);
        const axis = handleAt(px, py, w);
        if (axis) {
          plane.setPointerCapture(event.pointerId);
          drag = { axis, value: axis === "R" ? spec.R : spec.b };
          hover = pinned = null;
          paintAll();
          return;
        }
        const p = nearestU(px, py, w);
        pinned = p && !(pinned?.kind === "plane" && Math.abs(pinned.u - p.u) < 0.004) ? { kind: "plane", ...p } : null;
        paintAll();
      });
      plane.addEventListener("pointermove", (event) => {
        const [px, py, w] = planePoint(event);
        if (drag) {
          const d = drag.axis === "R" ? px - w / 2 : w / 2 - py;
          drag.value = Math.min(RMAX, snap(Math.max(0, planeRho(d, w))));
          drawPlane();
          return;
        }
        const axis = handleAt(px, py, w);
        plane.style.cursor = axis === "R" ? "ew-resize" : axis === "b" ? "ns-resize" : "crosshair";
        const p = axis ? null : nearestU(px, py, w);
        hover = p ? { kind: "plane", ...p } : null;
        paintAll();
      });
      const endDrag = () => {
        if (!drag) return;
        const { axis, value } = drag;
        drag = null;
        if (value !== spec[axis]) commit({ ...clone(spec), [axis]: value }, true);
        else paintAll();
      };
      plane.addEventListener("pointerup", endDrag);
      plane.addEventListener("pointercancel", endDrag);
      plane.addEventListener("pointerleave", () => {
        if (!drag && hover?.kind === "plane") {
          hover = null;
          paintAll();
        }
      });

      // ---------- stage interaction ----------
      const stagePoint = (event) => {
        const r = stage.getBoundingClientRect();
        return fromPx(event.clientX - r.left, event.clientY - r.top);
      };
      stage.addEventListener("pointermove", (event) => {
        if (!data) return;
        const [x, y] = stagePoint(event);
        hover = { kind: "stage", x, y };
        paintAll();
      });
      stage.addEventListener("pointerleave", () => {
        hover = null;
        paintAll();
      });
      stage.addEventListener("click", (event) => {
        if (!data) return;
        const [x, y] = stagePoint(event);
        pinned = pinned?.kind === "stage" ? null : { kind: "stage", x, y };
        paintAll();
      });
      stage.addEventListener("dblclick", () => {
        model.set("view", []);
        model.save_changes();
        stage.classList.add("pending");
      });
      stage.addEventListener(
        "wheel",
        (event) => {
          if (!view || !(event.ctrlKey || event.metaKey)) return;
          event.preventDefault();
          const [x, y] = stagePoint(event);
          const f = Math.exp(event.deltaY * 0.01);
          view = [x + (view[0] - x) * f, y + (view[1] - y) * f, view[2] * f];
          placeImage();
          paintAll();
          clearTimeout(commitTimer);
          commitTimer = setTimeout(() => {
            model.set("view", [...view]);
            model.save_changes();
            stage.classList.add("pending");
          }, 250);
        },
        { passive: false }
      );
      const onKey = (event) => {
        if (event.key === "Escape" && pinned) {
          pinned = null;
          paintAll();
        }
      };
      window.addEventListener("keydown", onKey);

      // ---------- linked painting ----------
      function meanShares({ a, b, K, n }) {
        const mean = new Float32Array(n * n);
        for (let p = 0; p < K * n; p++)
          for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) mean[i * n + j] += a[p * n + i] * b[p * n + j];
        return mean.map((v) => v / (K * n));
      }
      // Lift: how much more these eigenvalues depend on an entry than the creature does overall.
      const lift = (local, mean) => {
        const ratio = local.map((v, k) => (mean[k] > 1e-6 ? v / mean[k] : 0));
        const top = Math.max(...ratio);
        return top > 1.05 ? ratio.map((r) => Math.max(0, (r - 1) / (top - 1))) : null;
      };

      function paintAll() {
        if (!data || !view) {
          drawPlane();
          return;
        }
        const [ctx, w] = fit(over);
        ctx.clearRect(0, 0, w, w);
        const active = hover ?? pinned;
        const { eig, a, b, t, u, draws, K, n, slots, stars } = data;
        const m = slots.length;
        let heat = null, starValues = null, dots = [], marker = null;

        if (active?.kind === "stage") {
          const hits = hitsNear(active.x, active.y);
          const [px, py] = toPx(active.x, active.y);
          ctx.strokeStyle = ink();
          ctx.globalAlpha = 0.55;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(px, py, 0.035 * w, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.globalAlpha = 1;
          if (hits.length) {
            heat = new Float32Array(n * n);
            for (const p of hits) {
              const base = p * n;
              for (let i = 0; i < n; i++) {
                const ai = a[base + i];
                if (!ai) continue;
                for (let j = 0; j < n; j++) heat[i * n + j] += ai * b[base + j];
              }
            }
            heat = lift(heat.map((h) => h / hits.length), data.mean);
            const samples = [...new Set(hits.map((p) => Math.floor(p / n)))];
            for (const s of samples) for (let q = 0; q < m; q++) dots.push([t[2 * (s * m + q)], t[2 * (s * m + q) + 1], SLOT_COLOR[slots[q]]]);
            if (stars.length && samples.length >= 6) {
              starValues = {};
              stars.forEach(([i, j, code], q) => {
                const counts = new Array(POPS[code].length).fill(0);
                for (const s of samples) counts[draws[s * stars.length + q]]++;
                const best = counts.indexOf(Math.max(...counts));
                if (counts[best] / samples.length > 0.7) starValues[i * n + j] = POPS[code][best];
              });
            }
          }
        } else if (active?.kind === "cell") {
          const G = 56, raw = new Float32Array(G * G), rawCount = new Float32Array(G * G);
          const { i, j } = active;
          for (let p = 0; p < K * n; p++) {
            const [px, py] = toPx(eig[2 * p], eig[2 * p + 1]);
            const gx = Math.floor((px / w) * G), gy = Math.floor((py / w) * G);
            if (gx < 0 || gy < 0 || gx >= G || gy >= G) continue;
            raw[gy * G + gx] += a[p * n + i] * b[p * n + j];
            rawCount[gy * G + gx]++;
          }
          // Pool each bin with its neighbours so sparse probes read as a field, not speckle.
          const sum = new Float32Array(G * G), count = new Float32Array(G * G);
          for (let gy = 0; gy < G; gy++)
            for (let gx = 0; gx < G; gx++) {
              if (!rawCount[gy * G + gx]) continue;
              for (let dy = -2; dy <= 2; dy++)
                for (let dx = -2; dx <= 2; dx++) {
                  const yy = gy + dy, xx = gx + dx;
                  if (yy < 0 || xx < 0 || yy >= G || xx >= G) continue;
                  sum[gy * G + gx] += raw[yy * G + xx];
                  count[gy * G + gx] += rawCount[yy * G + xx];
                }
            }
          const base = data.mean[i * n + j];
          let top = 0;
          for (let g = 0; g < G * G; g++) if (count[g] >= 6) top = Math.max(top, sum[g] / count[g] / base);
          if (base > 1e-6 && top > 1.05) {
            const off = document.createElement("canvas");
            off.width = off.height = G;
            const octx = off.getContext("2d");
            const image = octx.createImageData(G, G);
            const [r, gg, bb] = HEAT.split(",").map(Number);
            for (let g = 0; g < G * G; g++) {
              if (count[g] < 6) continue;
              const v = Math.max(0, (sum[g] / count[g] / base - 1) / (top - 1));
              image.data.set([r, gg, bb, Math.round(210 * v)], 4 * g);
            }
            octx.putImageData(image, 0, 0);
            ctx.imageSmoothingEnabled = true;
            ctx.drawImage(off, 0, 0, w, w);
          }
        } else if (active?.kind === "plane" && m) {
          marker = active;
          for (let s = 0; s < K; s++) {
            for (let q = 0; q < m; q++) {
              const d = Math.abs(u[s * m + q] - active.u);
              if (Math.min(d, 1 - d) > 0.008) continue;
              ctx.fillStyle = SLOT_COLOR[slots[q]];
              for (let k = 0; k < n; k++) {
                const [px, py] = toPx(eig[2 * (s * n + k)], eig[2 * (s * n + k) + 1]);
                ctx.fillRect(px - 1.25, py - 1.25, 2.5, 2.5);
              }
            }
          }
        }
        paintMatrix(heat, starValues);
        plane.classList.toggle("ec-idle", !spec.cells.some((row) => row.some((code) => code === "t1" || code === "t2")));
        drawPlane(dots, marker);
      }

      // ---------- history ----------
      function paintHistory() {
        hist.replaceChildren();
        if (history.length < 2) return;
        const key = keyOf(spec);
        for (const entry of history) {
          const button = make("button", "ec-thumb", hist);
          button.type = "button";
          button.setAttribute("aria-label", "Return to this creature");
          button.setAttribute("aria-pressed", String(entry.key === key));
          const mask = make("span", "", button);
          mask.style.webkitMaskImage = mask.style.maskImage = `url(${entry.mask})`;
          button.addEventListener("click", () => commit(clone(entry.spec), true));
        }
      }

      // ---------- frames from Python ----------
      function onFrame() {
        frame = model.get("frame");
        if (!frame || !frame.view) return;
        data = {
          K: frame.K,
          n: frame.n,
          slots: frame.slots,
          stars: frame.stars,
          eig: decode(frame.eig, Float32Array),
          a: Float32Array.from(decode(frame.a, Uint8Array), (v) => v / 255),
          b: Float32Array.from(decode(frame.b, Uint8Array), (v) => v / 255),
          t: decode(frame.t, Float32Array),
          u: decode(frame.u, Float32Array),
          draws: decode(frame.draws, Uint8Array),
        };
        data.mean = meanShares(data);
        view = [...frame.view];
        img.style.webkitMaskImage = img.style.maskImage = `url(${frame.mask})`;
        const current = model.get("spec");
        if (frame.key === current.key) {
          spec = clone(current);
          stage.classList.remove("pending");
          if (!history.some((entry) => entry.key === frame.key)) {
            history.push({ key: frame.key, spec: clone(current), mask: frame.thumb });
            if (history.length > 12) history.shift();
          }
        }
        buildMatrix();
        paintPills();
        paintHistory();
        placeImage();
        paintAll();
      }
      const onResize = () => {
        placeImage();
        paintAll();
      };
      const observer = new ResizeObserver(onResize);
      observer.observe(stage);
      // Canvas ink can't follow currentColor, so repaint when the host flips its theme.
      const themeObserver = new MutationObserver(() => paintAll());
      for (const node of [document.documentElement, document.body])
        themeObserver.observe(node, { attributes: true, attributeFilter: ["class", "data-theme", "saved-theme", "style"] });
      model.on("change:frame", onFrame);
      paintBrushes();
      buildMatrix();
      paintPills();
      onFrame();

      return () => {
        model.off("change:frame", onFrame);
        window.removeEventListener("pointerup", endPaint);
        window.removeEventListener("keydown", onKey);
        observer.disconnect();
        themeObserver.disconnect();
        clearTimeout(commitTimer);
        root.remove();
      };
    }
    export default { render };
    """

    CREATURE_CSS = """
    .ec { display: flex; flex-direction: column; gap: 0.9rem; color: inherit; font: inherit; }
    .ec button {
      font: inherit; color: inherit; background: transparent; cursor: pointer;
      border: 1px solid color-mix(in srgb, currentColor 20%, transparent);
    }
    .ec button[aria-pressed="true"] {
      background: color-mix(in srgb, currentColor 11%, transparent);
      border-color: color-mix(in srgb, currentColor 50%, transparent);
    }
    .ec-pills { display: flex; gap: 0.4rem; flex-wrap: wrap; }
    .ec-pills button { border-radius: 999px; padding: 0.1rem 0.75rem; font-size: 0.9rem; }
    .ec-main { display: grid; grid-template-columns: minmax(0, 1fr) 15.5rem; gap: 1.5rem; align-items: start; }
    .ec-stage { position: relative; aspect-ratio: 1; overflow: hidden; cursor: crosshair; }
    .ec-img {
      position: absolute; background: currentColor;
      -webkit-mask-size: 100% 100%; mask-size: 100% 100%;
      -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
      transition: opacity 160ms;
    }
    .ec-stage.pending .ec-img { opacity: 0.4; }
    .ec-over { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
    .ec-side { display: flex; flex-direction: column; gap: 0.6rem; min-width: 0; }
    .ec-brushes { display: grid; grid-template-columns: repeat(9, 1fr); gap: 2px; }
    .ec-brushes button, .ec-size button {
      border-radius: 4px; padding: 0.15rem 0; font-size: 0.78rem;
      font-family: var(--codeFont, ui-monospace, monospace);
    }
    .ec-matrix { display: grid; gap: 2px; touch-action: none; user-select: none; }
    .ec-cell {
      aspect-ratio: 1; border-radius: 3px; padding: 0; min-width: 0;
      font-size: 0.72rem; font-family: var(--codeFont, ui-monospace, monospace);
      border-color: color-mix(in srgb, currentColor 13%, transparent) !important;
      transition: background-color 90ms;
    }
    .ec .ec-t1 { color: #E89A39; font-weight: 600; }
    .ec .ec-t2 { color: #56706B; font-weight: 600; }
    .ec-cell.ec-pm, .ec-cell.ec-ik { font-style: italic; color: color-mix(in srgb, currentColor 65%, transparent); }
    .ec-cell.ec-fixed { font-style: normal; font-weight: 700; color: inherit; }
    .ec-cell.ec-hot { outline: 1.5px solid currentColor; outline-offset: -1px; }
    .ec-size { display: flex; justify-content: flex-end; gap: 2px; }
    .ec-size button { width: 1.8rem; }
    .ec-plane { width: 100%; aspect-ratio: 1; touch-action: none; cursor: crosshair; transition: opacity 160ms; }
    .ec-plane.ec-idle { opacity: 0.35; }
    .ec-hist { display: flex; gap: 0.4rem; flex-wrap: wrap; }
    .ec-thumb { width: 3.25rem; height: 3.25rem; border-radius: 4px; padding: 3px; }
    .ec-thumb span {
      display: block; width: 100%; height: 100%; background: currentColor;
      -webkit-mask-size: 100% 100%; mask-size: 100% 100%;
    }
    @media (max-width: 640px) { .ec-main { grid-template-columns: 1fr; } }
    @media (prefers-reduced-motion: reduce) { .ec-img, .ec-cell { transition: none; } }
    """


@app.function(hide_code=True)
def png_bytes(pixels):
    """Encode a uint8 array (gray+alpha, RGB or RGBA) as PNG without an imaging dependency."""
    height, width, channels = pixels.shape

    def chunk(kind, data):
        crc = struct.pack(">I", zlib.crc32(kind + data) & 0xFFFFFFFF)
        return struct.pack(">I", len(data)) + kind + data + crc

    rows = b"".join(b"\x00" + row.tobytes() for row in pixels)
    header = struct.pack(">IIBBBBB", width, height, 8, {2: 4, 3: 2, 4: 6}[channels], 0, 0, 0)
    return (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", header)
        + chunk(b"IDAT", zlib.compress(rows, 6))
        + chunk(b"IEND", b"")
    )


@app.function(hide_code=True)
def b64(array, dtype):
    return base64.b64encode(np.ascontiguousarray(array, dtype=dtype).tobytes()).decode("ascii")


@app.function(hide_code=True)
def ellipse(R, b, u):
    """The ellipse R cos φ + i b sin φ at arclength fractions u: a circle at b = R, the segment [−R, R] at b = 0."""
    phi = np.linspace(0, 2 * np.pi, 2049)
    points = R * np.cos(phi) + 1j * b * np.sin(phi)
    arc = np.concatenate([[0], np.cumsum(np.abs(np.diff(points)))])
    if arc[-1] == 0:
        return np.zeros(np.shape(u), complex)
    at = np.interp(np.asarray(u) * arc[-1], arc, phi)
    return R * np.cos(at) + 1j * b * np.sin(at)


@app.function(hide_code=True)
def sample(spec, count, seed=7):
    """Draw `count` matrices: constants stay, t₁ and t₂ walk the domain, ±1 and iᵏ cells are drawn afresh."""
    cells = np.array(spec["cells"])
    rng = np.random.default_rng(seed)
    base = np.vectorize(lambda code: VALUES.get(code, 0), otypes=[complex])(cells)
    matrices = np.broadcast_to(base, (count, *base.shape)).copy()
    slots = [name for name in SLOTS if (cells == name).any()]
    u = rng.uniform(0, 1, (count, len(slots)))
    t = ellipse(spec["R"], spec["b"], u)
    for m, name in enumerate(slots):
        matrices[:, cells == name] = t[:, m : m + 1]
    stars = [(int(i), int(j), str(cells[i, j])) for i, j in np.argwhere(np.isin(cells, list(POPULATIONS)))]
    draws = np.zeros((count, len(stars)), np.uint8)
    for q, (i, j, code) in enumerate(stars):
        draws[:, q] = rng.integers(len(POPULATIONS[code]), size=count)
        matrices[:, i, j] = POPULATIONS[code][draws[:, q]]
    return {"A": matrices, "t": t, "u": u, "draws": draws, "slots": slots, "stars": stars}


@app.function(hide_code=True)
def sample_count(n):
    return int(min(30000, 30000 * (6 / n) ** 2))


@app.function(hide_code=True)
def solve(spec):
    """Eigenvalues of every sample, plus left and right eigenvectors for the first PROBES.

    For a simple eigenvalue λ with right vector x and left vector y,
    ∂λ/∂A_ij = ȳ_i x_j / (y*x). Its share for entry (i, j) is |y_i||x_j| / (Σ|y|·Σ|x|),
    so a, b below hold the normalised |y| and |x| of each probed eigenvalue.
    """
    n = len(spec["cells"])
    drawn = sample(spec, sample_count(n))
    A = drawn["A"]
    probe = min(PROBES, len(A))
    lam, X = np.linalg.eig(A[:probe])
    try:
        Y = np.linalg.inv(X)
    except np.linalg.LinAlgError:
        Y = np.linalg.pinv(X)
    left = np.abs(Y)
    right = np.abs(X).transpose(0, 2, 1)
    left /= left.sum(-1, keepdims=True) + 1e-12
    right /= right.sum(-1, keepdims=True) + 1e-12
    rest = np.linalg.eigvals(A[probe:]) if len(A) > probe else np.empty((0, n), complex)
    return {
        **drawn,
        "A": None,
        "n": n,
        "lam": lam,
        "left": left,
        "right": right,
        "z": np.concatenate([lam.reshape(-1), rest.reshape(-1)]),
    }


@app.function(hide_code=True)
def auto_view(z, mass=0.99, pad=1.08):
    z = z[np.isfinite(z)]
    if len(z) == 0:
        return (0.0, 0.0, 1.0)
    q = (1 - mass) / 2
    low_re, high_re = np.quantile(z.real, [q, 1 - q])
    low_im, high_im = np.quantile(z.imag, [q, 1 - q])
    half = max(high_re - low_re, high_im - low_im, 1e-3) / 2 * pad
    return (float(low_re + high_re) / 2, float(low_im + high_im) / 2, float(half))


@app.function(hide_code=True)
def tone(z, view, size):
    """Opacity of stacked translucent points, 1 − (1 − α)^count, with α set so a typical lit pixel reads 0.35."""
    cx, cy, half = view
    x = np.floor((z.real - cx + half) / (2 * half) * size)
    y = np.floor((cy + half - z.imag) / (2 * half) * size)
    inside = np.isfinite(z) & (x >= 0) & (x < size) & (y >= 0) & (y < size)
    flat = (y[inside] * size + x[inside]).astype(np.intp)
    density = np.bincount(flat, minlength=size * size).reshape(size, size).astype(np.float32)
    lit = density[density > 0]
    k = -np.log(0.65) / (np.median(lit) if len(lit) else 1.0)
    return 1 - np.exp(-k * density)


@app.function(hide_code=True)
def mask_url(opacity):
    """A PNG whose alpha is the creature, so CSS can paint it in the page's own ink."""
    alpha = np.rint(255 * opacity).astype(np.uint8)
    pixels = np.dstack([np.zeros_like(alpha), alpha])
    return "data:image/png;base64," + base64.b64encode(png_bytes(pixels)).decode("ascii")


@app.function(hide_code=True)
def figure(opacity, label):
    return (
        f'<div role="img" aria-label="{label}" style="aspect-ratio:1;background:currentColor;'
        f'-webkit-mask:url({mask_url(opacity)}) center/100% 100% no-repeat;'
        f'mask:url({mask_url(opacity)}) center/100% 100% no-repeat"></div>'
    )


@app.class_definition(hide_code=True)
class Creature(anywidget.AnyWidget):
    """Paint a matrix, stretch the domain of t, and hover to trace features to entries.

    spec: {"cells": n×n codes, "R": float, "b": float, "key": str}, set by the browser.
    view: [cx, cy, half] or [] for automatic framing.
    frame: the rendered mask plus probed eigenvalues, eigenvector shares, t and draws.
    """

    _esm = CREATURE_ESM
    _css = CREATURE_CSS
    spec = traitlets.Dict({}).tag(sync=True)
    view = traitlets.List([]).tag(sync=True)
    presets = traitlets.Dict({}).tag(sync=True)
    frame = traitlets.Dict({}).tag(sync=True)

    def __init__(self, spec, **kwargs):
        self._solved = None
        super().__init__(spec=spec, presets=PRESETS, **kwargs)
        if self._solved is None:
            self._solve()

    @traitlets.observe("spec")
    def _on_spec(self, change):
        self._solve()

    @traitlets.observe("view")
    def _on_view(self, change):
        if self._solved is not None:
            self._draw()

    def _solve(self):
        self._solved = solve(self.spec)
        self._draw()

    def current_view(self):
        return tuple(self.view) if len(self.view) == 3 else auto_view(self._solved["z"])

    def poster(self, size=2048):
        opacity = tone(self._solved["z"], self.current_view(), size)[..., None]
        paper, ink = np.array(PAPER, np.float32), np.array(INK, np.float32)
        return png_bytes(np.rint(paper + opacity * (ink - paper)).astype(np.uint8))

    def _draw(self):
        s = self._solved
        view = self.current_view()
        lam = s["lam"]
        self.frame = {
            "key": self.spec.get("key", ""),
            "view": list(view),
            "mask": mask_url(tone(s["z"], view, 720)),
            "thumb": mask_url(tone(s["z"], auto_view(s["z"]), 96)),
            "n": s["n"],
            "K": int(lam.shape[0]),
            "slots": s["slots"],
            "stars": [list(star) for star in s["stars"]],
            "eig": b64(np.stack([lam.real, lam.imag], -1), np.float32),
            "a": b64(np.rint(255 * s["left"]), np.uint8),
            "b": b64(np.rint(255 * s["right"]), np.uint8),
            "t": b64(np.stack([s["t"].real, s["t"].imag], -1)[: lam.shape[0]], np.float32),
            "u": b64(s["u"][: lam.shape[0]], np.float32),
            "draws": b64(s["draws"][: lam.shape[0]], np.uint8),
        }


@app.cell(hide_code=True)
def _():
    mo.md(r"""
    An eigencreature is the set of eigenvalues of a small matrix in which a few
    entries wander. [[Simone Conradi]]'s fish send two entries $t_1, t_2$ around
    the unit circle; Bohemian matrices draw entries from a finite set such as
    $\{-1, 1\}$. Both are density plots of the same thing: every eigenvalue of
    every sample, laid down as a translucent point. Two things shape them:
    where the wandering entries may go, and which entries each part of the
    creature listens to.
    """)
    return


@app.cell(hide_code=True)
def _():
    _flattening = (1, 0.45, 0.15, 0)
    _spec = PRESETS["Fish"]
    _panels = []
    for _b in _flattening:
        _z = np.linalg.eigvals(sample({**_spec, "b": _b}, 16000)["A"]).reshape(-1)
        _panels.append(figure(tone(_z, auto_view(_z), 360), f"Creature with the domain of t squashed to height {_b}"))
    mo.vstack([
        mo.md(rf"""
        ## Flatten the circle and the fish opens

        Below, the same $6\times6$ matrix is drawn with $t$ on an ellipse of
        width 2, squashed from the unit circle down to the segment $[-1, 1]$.
        On the circle every path through the parameters returns to its start,
        so the strands close into a body. On the segment, $t$ turns back at the
        ends, and the strands fold back as open wings. Conradi's black-and-white
        series lives at this end, with $t$ on the interval $[-20, 20]$.
        """),
        mo.Html(
            '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(9rem,1fr));gap:1rem">'
            + "".join(_panels)
            + "</div>"
        ),
    ], gap=0.5)
    return


@app.cell(hide_code=True)
def _():
    mo.md(r"""
    ## Every feature has an address

    Paint the matrix: constants, $t_1$ and $t_2$, which walk the ellipse, and
    $\pm1$ or $i^k$, which are drawn afresh for every sample as in a Bohemian
    matrix. Drag the ellipse's handles to reshape where $t$ walks.

    Hover the creature and the matrix lights the entries those eigenvalues
    lean on more than the rest of the creature does, by
    $\partial\lambda/\partial A_{ij} = \bar y_i x_j / y^{*}x$. The ellipse
    marks where $t_1$ and $t_2$ were at the time. Hover an entry or the ellipse
    to go the other way.
    """)
    return


@app.cell(hide_code=True)
def _():
    creature = mo.ui.anywidget(Creature(dict(PRESETS["Fish"])))
    creature
    return (creature,)


@app.cell(hide_code=True)
def _(creature):
    mo.download(creature.widget.poster, filename="eigencreature.png", mimetype="image/png", label="PNG 2048²")
    return


if __name__ == "__main__":
    app.run()
