const Theme = {
        _dark: true,
        palettes: {
          dark: {
            bg: "#1a1714",
            surface: "#2a2520",
            border: "#6b6158",
            text: "#ebe7e1",
            textSecondary: "#d4cec7",
            textMuted: "#6b6158",
            accent: "#c59b8d",
            tertiary: "#a89a8d",
            rust: "#db8e88",
            clay: "#deaea0",
            ochre: "#e0bc7e",
            sage: "#aebd9f",
            pine: "#8daeb3",
            slate: "#9bb0bd",
            mauve: "#c9b1b9",
            canvasBg: "#1a1714",
            gridLine: "rgba(212,206,199,0.06)",
            gridText: "rgba(212,206,199,0.3)",
            vectorField: "rgba(168,154,141,0.3)",
            fpStroke: "#ebe7e1",
          },
          light: {
            bg: "#f5f1eb",
            surface: "#e6dfd6",
            border: "#9a8f82",
            text: "#2d2520",
            textSecondary: "#4a4238",
            textMuted: "#9a8f82",
            accent: "#a67c6d",
            tertiary: "#8b7f73",
            rust: "#bf6159",
            clay: "#c78d75",
            ochre: "#cc9e54",
            sage: "#869c7a",
            pine: "#56706b",
            slate: "#728c99",
            mauve: "#9d868e",
            canvasBg: "#f5f1eb",
            gridLine: "rgba(74,66,56,0.08)",
            gridText: "rgba(74,66,56,0.35)",
            vectorField: "rgba(139,127,115,0.35)",
            fpStroke: "#2d2520",
          },
        },
        get c() {
          return this._dark ? this.palettes.dark : this.palettes.light;
        },
        get isDark() {
          return this._dark;
        },
        toggle() {
          this._dark = !this._dark;
          document.documentElement.classList.toggle("light", !this._dark);
          document.getElementById("theme-toggle").innerHTML = this._dark
            ? "&#9789;"
            : "&#9788;";
        },
        // Trajectory palette
        get trajColors() {
          const p = this.c;
          return [
            p.slate,
            p.sage,
            p.ochre,
            p.rust,
            p.mauve,
            p.pine,
            p.clay,
            p.accent,
          ];
        },
        // Swatch colors for toggles
        get swatches() {
          const p = this.c;
          return {
            vectorField: p.tertiary,
            vNullcline: p.slate,
            nNullcline: p.clay,
            limitCycle: p.ochre,
            unstableCycle: p.mauve,
            stableManifolds: p.sage,
            unstableManifolds: p.rust,
            separatrix: p.ochre,
          };
        },
      };

      class MorrisLecarModel {
        constructor() {
          this.params = {
            gCa: 4.4,
            gK: 8.0,
            gL: 2.0,
            ECa: 120.0,
            EK: -84.0,
            EL: -60.0,
            V1: -1.2,
            V2: 18.0,
            V3: 2.0,
            V4: 30.0,
            phi: 0.04,
            C: 20.0,
            Iext: 0.0,
          };
        }

        mInf(V) {
          return 0.5 * (1 + Math.tanh((V - this.params.V1) / this.params.V2));
        }

        nInf(V) {
          return 0.5 * (1 + Math.tanh((V - this.params.V3) / this.params.V4));
        }

        tauN(V) {
          return (
            1.0 /
            (this.params.phi *
              Math.cosh((V - this.params.V3) / (2 * this.params.V4)))
          );
        }

        dVdt(V, n) {
          const p = this.params;
          const ICa = p.gCa * this.mInf(V) * (p.ECa - V);
          const IK = p.gK * n * (p.EK - V);
          const IL = p.gL * (p.EL - V);
          return (ICa + IK + IL + p.Iext) / p.C;
        }

        dndt(V, n) {
          return (this.nInf(V) - n) / this.tauN(V);
        }

        getDerivatives(V, n) {
          return [this.dVdt(V, n), this.dndt(V, n)];
        }

        setParams(obj) {
          Object.assign(this.params, obj);
        }

        cloneParams() {
          return { ...this.params };
        }
      }

      // we using runge kutta 4
      class RK4Integrator {
        constructor(model) {
          this.model = model;
        }

        step(V, n, dt) {
          const m = this.model;
          const k1v = m.dVdt(V, n);
          const k1n = m.dndt(V, n);

          const k2v = m.dVdt(V + 0.5 * dt * k1v, n + 0.5 * dt * k1n);
          const k2n = m.dndt(V + 0.5 * dt * k1v, n + 0.5 * dt * k1n);

          const k3v = m.dVdt(V + 0.5 * dt * k2v, n + 0.5 * dt * k2n);
          const k3n = m.dndt(V + 0.5 * dt * k2v, n + 0.5 * dt * k2n);

          const k4v = m.dVdt(V + dt * k3v, n + dt * k3n);
          const k4n = m.dndt(V + dt * k3v, n + dt * k3n);

          return [
            V + (dt / 6) * (k1v + 2 * k2v + 2 * k3v + k4v),
            n + (dt / 6) * (k1n + 2 * k2n + 2 * k3n + k4n),
          ];
        }

        integrate(V0, n0, dt, steps) {
          const trajectory = [{ V: V0, n: n0, t: 0 }];
          let V = V0,
            n = n0;
          for (let i = 0; i < steps; i++) {
            [V, n] = this.step(V, n, dt);
            V = Math.max(-150, Math.min(150, V));
            n = Math.max(-0.5, Math.min(1.5, n));
            trajectory.push({ V, n, t: (i + 1) * dt });
          }
          return trajectory;
        }
      }

      // for stoch sims
      class EulerMaruyamaIntegrator {
        constructor(model) {
          this.model = model;
          this._spareReady = false;
          this._spare = 0;
        }

        randn() {
          if (this._spareReady) {
            this._spareReady = false;
            return this._spare;
          }
          let u, v, s;
          do {
            u = Math.random() * 2 - 1;
            v = Math.random() * 2 - 1;
            s = u * u + v * v;
          } while (s >= 1 || s === 0);
          const mul = Math.sqrt((-2 * Math.log(s)) / s);
          this._spare = v * mul;
          this._spareReady = true;
          return u * mul;
        }

        step(V, n, dt, sigmaV, sigmaN) {
          const sqrtDt = Math.sqrt(Math.abs(dt));
          const sign = dt >= 0 ? 1 : -1;
          const dV =
            this.model.dVdt(V, n) * dt + sigmaV * sqrtDt * this.randn() * sign;
          const dn =
            this.model.dndt(V, n) * dt + sigmaN * sqrtDt * this.randn() * sign;
          const newV = Math.max(-150, Math.min(150, V + dV));
          const newN = Math.max(-0.5, Math.min(1.5, n + dn));
          return [newV, newN];
        }

        integrate(V0, n0, dt, steps, sigmaV, sigmaN) {
          const trajectory = [{ V: V0, n: n0, t: 0 }];
          let V = V0,
            n = n0;
          for (let i = 0; i < steps; i++) {
            [V, n] = this.step(V, n, dt, sigmaV, sigmaN);
            trajectory.push({ V, n, t: (i + 1) * Math.abs(dt) });
          }
          return trajectory;
        }
      }

      // dyanm system nullclines
      class NullclineComputer {
        constructor(model) {
          this.model = model;
        }

        computeVNullcline(Vmin, Vmax, numPoints = 500) {
          const pts = [];
          const p = this.model.params;
          const dV = (Vmax - Vmin) / numPoints;
          for (let i = 0; i <= numPoints; i++) {
            const V = Vmin + i * dV;
            const denom = p.gK * (p.EK - V);
            if (Math.abs(denom) < 1e-12) continue;
            const n =
              -(
                p.gCa * this.model.mInf(V) * (p.ECa - V) +
                p.gL * (p.EL - V) +
                p.Iext
              ) / denom;
            pts.push({ V, n });
          }
          return pts;
        }

        computeNNullcline(Vmin, Vmax, numPoints = 500) {
          const pts = [];
          const dV = (Vmax - Vmin) / numPoints;
          for (let i = 0; i <= numPoints; i++) {
            const V = Vmin + i * dV;
            pts.push({ V, n: this.model.nInf(V) });
          }
          return pts;
        }
      }

      class FixedPointFinder {
        constructor(model) {
          this.model = model;
        }

        findIntersections(vNull, nNull) {
          const seeds = [];
          const nNullInterp = (V) => this.model.nInf(V);

          for (let i = 0; i < vNull.length - 1; i++) {
            const Va = vNull[i].V,
              na = vNull[i].n;
            const Vb = vNull[i + 1].V,
              nb = vNull[i + 1].n;
            const diffA = na - nNullInterp(Va);
            const diffB = nb - nNullInterp(Vb);
            if (diffA * diffB <= 0) {
              const frac =
                Math.abs(diffA) / (Math.abs(diffA) + Math.abs(diffB) + 1e-15);
              const Vseed = Va + frac * (Vb - Va);
              const nseed = na + frac * (nb - na);
              seeds.push([Vseed, nseed]);
            }
          }
          return seeds;
        }

        newtonRefine(V0, n0, maxIter = 50, tol = 1e-10) {
          let V = V0,
            n = n0;
          for (let i = 0; i < maxIter; i++) {
            const fV = this.model.dVdt(V, n);
            const fn = this.model.dndt(V, n);
            if (Math.abs(fV) < tol && Math.abs(fn) < tol) break;

            const h = 1e-6;
            const J00 =
              (this.model.dVdt(V + h, n) - this.model.dVdt(V - h, n)) / (2 * h);
            const J01 =
              (this.model.dVdt(V, n + h) - this.model.dVdt(V, n - h)) / (2 * h);
            const J10 =
              (this.model.dndt(V + h, n) - this.model.dndt(V - h, n)) / (2 * h);
            const J11 =
              (this.model.dndt(V, n + h) - this.model.dndt(V, n - h)) / (2 * h);

            const det = J00 * J11 - J01 * J10;
            if (Math.abs(det) < 1e-15) break;

            const dV = (J11 * fV - J01 * fn) / det;
            const dn = (-J10 * fV + J00 * fn) / det;
            V -= dV;
            n -= dn;

            if (Math.abs(dV) < tol && Math.abs(dn) < tol) break;
          }
          return [V, n];
        }

        findAll(Vmin, Vmax) {
          const nc = new NullclineComputer(this.model);
          const vNull = nc.computeVNullcline(Vmin, Vmax, 1000);
          const nNull = nc.computeNNullcline(Vmin, Vmax, 1000);
          const seeds = this.findIntersections(vNull, nNull);

          const fps = [];
          for (const [Vs, ns] of seeds) {
            const [V, n] = this.newtonRefine(Vs, ns);
            if (
              Math.abs(this.model.dVdt(V, n)) > 1e-6 ||
              Math.abs(this.model.dndt(V, n)) > 1e-6
            )
              continue;
            let dup = false;
            for (const fp of fps) {
              if (Math.abs(fp.V - V) < 0.1 && Math.abs(fp.n - n) < 1e-4) {
                dup = true;
                break;
              }
            }
            if (!dup) fps.push({ V, n });
          }
          return fps;
        }
      }

      class JacobianAnalyzer {
        constructor(model) {
          this.model = model;
        }

        computeJacobian(V, n, h = 0.001) {
          const m = this.model;
          return [
            [
              (m.dVdt(V + h, n) - m.dVdt(V - h, n)) / (2 * h),
              (m.dVdt(V, n + h) - m.dVdt(V, n - h)) / (2 * h),
            ],
            [
              (m.dndt(V + h, n) - m.dndt(V - h, n)) / (2 * h),
              (m.dndt(V, n + h) - m.dndt(V, n - h)) / (2 * h),
            ],
          ];
        }

        analyzeEigenvalues(J) {
          const tr = J[0][0] + J[1][1];
          const det = J[0][0] * J[1][1] - J[0][1] * J[1][0];
          const disc = tr * tr - 4 * det;

          let lambda1,
            lambda2,
            isComplex = false;
          if (disc >= 0) {
            const sqrtDisc = Math.sqrt(disc);
            lambda1 = (tr + sqrtDisc) / 2;
            lambda2 = (tr - sqrtDisc) / 2;
          } else {
            isComplex = true;
            const realPart = tr / 2;
            const imagPart = Math.sqrt(-disc) / 2;
            lambda1 = { re: realPart, im: imagPart };
            lambda2 = { re: realPart, im: -imagPart };
          }

          return { lambda1, lambda2, isComplex, trace: tr, det, disc };
        }

        computeEigenvectors(J, eigen) {
          if (eigen.isComplex) return null;

          const vecs = [];
          for (const lam of [eigen.lambda1, eigen.lambda2]) {
            const a = J[0][0] - lam;
            const b = J[0][1];
            const c = J[1][0];
            const d = J[1][1] - lam;

            let vx, vy;
            if (Math.abs(b) > Math.abs(a) * 1e-10) {
              vx = -b;
              vy = a;
            } else if (Math.abs(d) > Math.abs(c) * 1e-10) {
              vx = -d;
              vy = c;
            } else {
              vx = 1;
              vy = 0;
            }

            const norm = Math.sqrt(vx * vx + vy * vy);
            if (norm > 1e-15) {
              vx /= norm;
              vy /= norm;
            }
            vecs.push({ x: vx, y: vy, eigenvalue: lam });
          }
          return vecs;
        }

        classify(eigen) {
          if (eigen.isComplex) {
            const re = eigen.lambda1.re;
            if (Math.abs(re) < 1e-8) return "center";
            return re < 0 ? "stable focus" : "unstable focus";
          }
          const l1 = eigen.lambda1,
            l2 = eigen.lambda2;
          if (l1 * l2 < 0) return "saddle";
          if (l1 < 0 && l2 < 0) return "stable node";
          if (l1 > 0 && l2 > 0) return "unstable node";
          if (Math.abs(l1) < 1e-10 || Math.abs(l2) < 1e-10) return "degenerate";
          return "unknown";
        }

        analyze(V, n) {
          const J = this.computeJacobian(V, n);
          const eigen = this.analyzeEigenvalues(J);
          const evecs = this.computeEigenvectors(J, eigen);
          const type = this.classify(eigen);
          return { J, eigen, eigenvectors: evecs, type, V, n };
        }
      }

      class ManifoldComputer {
        constructor(model) {
          this.model = model;
          this.integrator = new RK4Integrator(model);
        }

        computeManifolds(saddle, eigenvectors, dt = 0.05, steps = 6000) {
          if (!eigenvectors) return null;
          const eps = 0.5;
          const result = { stable: [], unstable: [] };

          for (const evec of eigenvectors) {
            const isUnstable = evec.eigenvalue > 0;
            const directions = [1, -1];

            for (const dir of directions) {
              const V0 = saddle.V + dir * eps * evec.x;
              const n0 = saddle.n + dir * eps * evec.y;
              const useDt = isUnstable ? dt : -dt;
              const traj = this.integrator.integrate(V0, n0, useDt, steps);

              if (isUnstable) {
                result.unstable.push(traj);
              } else {
                result.stable.push(traj);
              }
            }
          }
          return result;
        }
      }

      class LimitCycleDetector {
        constructor(model) {
          this.model = model;
          this.integrator = new RK4Integrator(model);
        }

        detect(V0, n0, dt = 0.05, totalSteps = 40000, transientSteps = 10000) {
          let V = V0,
            n = n0;
          for (let i = 0; i < transientSteps; i++) {
            [V, n] = this.integrator.step(V, n, dt);
            V = Math.max(-150, Math.min(150, V));
            n = Math.max(-0.5, Math.min(1.5, n));
          }

          const trajectory = [{ V, n, t: 0 }];
          const remainingSteps = totalSteps - transientSteps;

          for (let i = 0; i < remainingSteps; i++) {
            [V, n] = this.integrator.step(V, n, dt);
            V = Math.max(-150, Math.min(150, V));
            n = Math.max(-0.5, Math.min(1.5, n));
            trajectory.push({ V, n, t: (i + 1) * dt });
          }

          let Vmin = Infinity,
            Vmax = -Infinity;
          for (
            let i = Math.floor(trajectory.length / 2);
            i < trajectory.length;
            i++
          ) {
            Vmin = Math.min(Vmin, trajectory[i].V);
            Vmax = Math.max(Vmax, trajectory[i].V);
          }

          const amplitude = Vmax - Vmin;
          if (amplitude < 5) return null;

          const halfLen = Math.floor(trajectory.length / 2);
          const peaks = [];
          for (let i = halfLen + 1; i < trajectory.length - 1; i++) {
            if (
              trajectory[i].V > trajectory[i - 1].V &&
              trajectory[i].V >= trajectory[i + 1].V
            ) {
              if (trajectory[i].V > (Vmin + Vmax) / 2) {
                peaks.push(i);
              }
            }
          }

          if (peaks.length < 2) return null;

          const cycleStart = peaks[peaks.length - 2];
          const cycleEnd = peaks[peaks.length - 1];
          const cycle = trajectory.slice(cycleStart, cycleEnd + 1);
          const period = (cycleEnd - cycleStart) * dt;

          return { cycle, period, amplitude, Vmin, Vmax };
        }

        detectUnstable(
          stableFP,
          dt = 0.05,
          totalSteps = 60000,
          transientSteps = 20000,
        ) {
          if (!stableFP) return null;

          const perturbations = [2, 5, 8, 12, 18, 25];
          let bestCycle = null;

          for (const pert of perturbations) {
            let V = stableFP.V + pert;
            let n = stableFP.n;

            const bdt = -dt;
            for (let i = 0; i < transientSteps; i++) {
              [V, n] = this.integrator.step(V, n, bdt);
              V = Math.max(-150, Math.min(150, V));
              n = Math.max(-0.5, Math.min(1.5, n));
            }

            const trajectory = [{ V, n, t: 0 }];
            for (let i = 0; i < totalSteps - transientSteps; i++) {
              [V, n] = this.integrator.step(V, n, bdt);
              V = Math.max(-150, Math.min(150, V));
              n = Math.max(-0.5, Math.min(1.5, n));
              trajectory.push({ V, n, t: (i + 1) * dt });
            }

            let Vmin = Infinity,
              Vmax = -Infinity;
            const checkStart = Math.floor(trajectory.length * 0.6);
            for (let i = checkStart; i < trajectory.length; i++) {
              Vmin = Math.min(Vmin, trajectory[i].V);
              Vmax = Math.max(Vmax, trajectory[i].V);
            }

            const amplitude = Vmax - Vmin;
            if (amplitude < 3) continue;

            const halfLen = Math.floor(trajectory.length * 0.6);
            const peaks = [];
            for (let i = halfLen + 1; i < trajectory.length - 1; i++) {
              if (
                trajectory[i].V > trajectory[i - 1].V &&
                trajectory[i].V >= trajectory[i + 1].V
              ) {
                if (trajectory[i].V > (Vmin + Vmax) / 2) {
                  peaks.push(i);
                }
              }
            }

            if (peaks.length < 2) continue;

            if (peaks.length >= 3) {
              const p1 = peaks[peaks.length - 1] - peaks[peaks.length - 2];
              const p2 = peaks[peaks.length - 2] - peaks[peaks.length - 3];
              if (Math.abs(p1 - p2) / Math.max(p1, p2) > 0.05) continue;
            }

            const cycleStart = peaks[peaks.length - 2];
            const cycleEnd = peaks[peaks.length - 1];
            const cycle = trajectory.slice(cycleStart, cycleEnd + 1);
            const period = (cycleEnd - cycleStart) * dt;

            if (!bestCycle || amplitude < bestCycle.amplitude) {
              bestCycle = { cycle, period, amplitude, Vmin, Vmax };
            }
          }

          return bestCycle;
        }
      }

      class BifurcationAnalyzer {
        constructor(model) {
          this.model = model;
        }

        async analyze(IextMin, IextMax, steps, onProgress, onComplete) {
          const origIext = this.model.params.Iext;
          const results = [];
          const chunkSize = 10;

          const doChunk = (startIdx) => {
            const endIdx = Math.min(startIdx + chunkSize, steps);
            for (let i = startIdx; i < endIdx; i++) {
              const Iext = IextMin + ((IextMax - IextMin) * i) / (steps - 1);
              this.model.params.Iext = Iext;

              const fpFinder = new FixedPointFinder(this.model);
              const fps = fpFinder.findAll(-80, 60);

              const jacobAnalyzer = new JacobianAnalyzer(this.model);
              const analyzedFPs = fps.map((fp) => {
                const analysis = jacobAnalyzer.analyze(fp.V, fp.n);
                return {
                  V: fp.V,
                  n: fp.n,
                  type: analysis.type,
                  eigen: analysis.eigen,
                };
              });

              const lcd = new LimitCycleDetector(this.model);
              let lcInfo = null;
              const lcResult = lcd.detect(0, 0.1, 0.1, 15000, 5000);
              if (lcResult) {
                lcInfo = {
                  Vmin: lcResult.Vmin,
                  Vmax: lcResult.Vmax,
                  period: lcResult.period,
                };
              }

              results.push({
                Iext,
                fixedPoints: analyzedFPs,
                limitCycle: lcInfo,
              });
            }

            this.model.params.Iext = origIext;

            if (onProgress) onProgress(endIdx / steps);

            if (endIdx < steps) {
              this.model.params.Iext = origIext;
              setTimeout(() => doChunk(endIdx), 0);
            } else {
              this.model.params.Iext = origIext;
              if (onComplete) onComplete(results);
            }
          };

          doChunk(0);
        }
      }

      // main state tracker
      window.MorrisLecarTheme = Theme;

      class AppState {
        constructor() {
          this.model = new MorrisLecarModel();
          this.trajectories = [];
          this.selectedTrajectory = null;

          this.viewport = { Vmin: -80, Vmax: 60, nMin: -0.1, nMax: 0.7 };
          this.defaultViewport = { ...this.viewport };

          this.vNullcline = [];
          this.nNullcline = [];
          this.fixedPoints = [];
          this.manifolds = null;
          this.limitCycle = null;
          this.unstableCycle = null;

          this.show = {
            vectorField: true,
            flowSpeed: false,
            vNullcline: true,
            nNullcline: true,
            fixedPoints: true,
            eigenvalues: true,
            eigenvectors: true,
            trajectories: true,
            limitCycle: true,
            unstableCycle: true,
            stableManifolds: true,
            unstableManifolds: true,
            separatrix: false,
            timeSeries: true,
          };

          this.dirty = {
            vectorField: true,
            nullclines: true,
            fixedPoints: true,
            manifolds: true,
            limitCycle: true,
            trajectories: true,
            all: true,
          };

          this.trajColorIdx = 0;

          this.noisyTrajEnabled = false;
          this.noisySigmaV = 2.0;
          this.noisySigmaN = 0.005;

          this.liveSimActive = false;
          this.liveParticle = null;
          this.liveTrail = [];
          this.liveRunning = false;
          this.liveStochastic = false;
          this.liveSigmaV = 2.0;
          this.liveSigmaN = 0.005;
          this.liveSpeed = 1.0;
          this.livePulseActive = false;
          this.livePulseRemaining = 0;
          this.livePulseAmount = 50;
        }

        nextTrajColor() {
          const colors = Theme.trajColors;
          const c = colors[this.trajColorIdx % colors.length];
          this.trajColorIdx++;
          return c;
        }

        markAllDirty() {
          for (const k of Object.keys(this.dirty)) this.dirty[k] = true;
        }

        resetViewport() {
          Object.assign(this.viewport, this.defaultViewport);
          this.dirty.vectorField = true;
          this.dirty.all = true;
        }
      }

      class PhaseCanvasRenderer {
        constructor(canvas, state) {
          this.canvas = canvas;
          this.ctx = canvas.getContext("2d");
          this.state = state;
          this.dpr = window.devicePixelRatio || 1;
          this.resize();
        }

        resize() {
          const rect = this.canvas.parentElement.getBoundingClientRect();
          this.width = rect.width;
          this.height = rect.height;
          this.canvas.width = this.width * this.dpr;
          this.canvas.height = this.height * this.dpr;
          this.canvas.style.width = this.width + "px";
          this.canvas.style.height = this.height + "px";
          this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
          this.state.dirty.vectorField = true;
          this.state.dirty.all = true;
        }

        toScreenX(V) {
          const vp = this.state.viewport;
          return ((V - vp.Vmin) / (vp.Vmax - vp.Vmin)) * this.width;
        }

        toScreenY(n) {
          const vp = this.state.viewport;
          return (
            this.height - ((n - vp.nMin) / (vp.nMax - vp.nMin)) * this.height
          );
        }

        toModelV(sx) {
          const vp = this.state.viewport;
          return vp.Vmin + (sx / this.width) * (vp.Vmax - vp.Vmin);
        }

        toModelN(sy) {
          const vp = this.state.viewport;
          return (
            vp.nMin + ((this.height - sy) / this.height) * (vp.nMax - vp.nMin)
          );
        }

        render() {
          const ctx = this.ctx;
          const t = Theme.c;
          ctx.clearRect(0, 0, this.width, this.height);

          ctx.fillStyle = t.canvasBg;
          ctx.fillRect(0, 0, this.width, this.height);

          this.drawGrid();

          if (this.state.show.vectorField) this.drawVectorField();
          if (this.state.show.vNullcline)
            this.drawNullcline(this.state.vNullcline, t.slate, "V-null");
          if (this.state.show.nNullcline)
            this.drawNullcline(this.state.nNullcline, t.clay, "n-null");
          if (
            this.state.show.stableManifolds ||
            this.state.show.unstableManifolds
          )
            this.drawManifolds();
          if (this.state.show.limitCycle) this.drawLimitCycle();
          if (this.state.show.unstableCycle) this.drawUnstableCycle();
          if (this.state.show.trajectories) this.drawTrajectories();
          if (this.state.liveSimActive) this.drawLiveTrail();
          if (this.state.show.fixedPoints) this.drawFixedPoints();

          this.drawAxesLabels();
        }

        drawGrid() {
          const ctx = this.ctx;
          const vp = this.state.viewport;
          const t = Theme.c;

          ctx.strokeStyle = t.gridLine;
          ctx.lineWidth = 0.5;

          const vStep = this.niceStep(vp.Vmax - vp.Vmin, 10);
          let v0 = Math.ceil(vp.Vmin / vStep) * vStep;
          ctx.font = "10px 'Inter', sans-serif";
          ctx.fillStyle = t.gridText;
          for (let v = v0; v <= vp.Vmax; v += vStep) {
            const x = this.toScreenX(v);
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.height);
            ctx.stroke();
            ctx.fillText(v.toFixed(0), x + 2, this.height - 4);
          }

          const nStep = this.niceStep(vp.nMax - vp.nMin, 8);
          let n0 = Math.ceil(vp.nMin / nStep) * nStep;
          for (let n = n0; n <= vp.nMax; n += nStep) {
            const y = this.toScreenY(n);
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.width, y);
            ctx.stroke();
            ctx.fillText(n.toFixed(2), 4, y - 3);
          }
        }

        niceStep(range, targetTicks) {
          const rough = range / targetTicks;
          const mag = Math.pow(10, Math.floor(Math.log10(rough)));
          const norm = rough / mag;
          let step;
          if (norm < 1.5) step = 1;
          else if (norm < 3) step = 2;
          else if (norm < 7) step = 5;
          else step = 10;
          return step * mag;
        }

        drawVectorField() {
          const ctx = this.ctx;
          const vp = this.state.viewport;
          const model = this.state.model;
          const t = Theme.c;
          const spacing = 22;
          const cols = Math.ceil(this.width / spacing);
          const rows = Math.ceil(this.height / spacing);

          for (let i = 0; i <= cols; i++) {
            for (let j = 0; j <= rows; j++) {
              const sx = i * spacing + spacing / 2;
              const sy = j * spacing + spacing / 2;
              const V = this.toModelV(sx);
              const n = this.toModelN(sy);

              const dv = model.dVdt(V, n);
              const dn = model.dndt(V, n);

              const dvScreen = (dv / (vp.Vmax - vp.Vmin)) * this.width;
              const dnScreen = (-dn / (vp.nMax - vp.nMin)) * this.height;

              const speed = Math.sqrt(
                dvScreen * dvScreen + dnScreen * dnScreen,
              );
              if (speed < 0.001) continue;

              const maxLen = spacing * 0.45;
              const scale = Math.min(maxLen / speed, maxLen / 5);
              const dx = dvScreen * scale;
              const dy = dnScreen * scale;

              if (this.state.show.flowSpeed) {
                const normSpeed = Math.min(speed / 50, 1);
                const lo = this.hexToRgb(t.tertiary);
                const hi = this.hexToRgb(t.rust);
                const r = Math.floor(lo.r + (hi.r - lo.r) * normSpeed);
                const g = Math.floor(lo.g + (hi.g - lo.g) * normSpeed);
                const b = Math.floor(lo.b + (hi.b - lo.b) * normSpeed);
                ctx.strokeStyle = `rgba(${r},${g},${b},0.55)`;
              } else {
                ctx.strokeStyle = t.vectorField;
              }

              ctx.lineWidth = 0.7;
              ctx.beginPath();
              ctx.moveTo(sx - dx * 0.5, sy - dy * 0.5);
              ctx.lineTo(sx + dx * 0.5, sy + dy * 0.5);
              ctx.stroke();

              const len = Math.sqrt(dx * dx + dy * dy);
              if (len > 2) {
                const ax = dx / len,
                  ay = dy / len;
                const tipX = sx + dx * 0.5,
                  tipY = sy + dy * 0.5;
                const headLen = Math.min(3, len * 0.3);
                ctx.beginPath();
                ctx.moveTo(tipX, tipY);
                ctx.lineTo(
                  tipX - headLen * (ax - ay * 0.4),
                  tipY - headLen * (ay + ax * 0.4),
                );
                ctx.moveTo(tipX, tipY);
                ctx.lineTo(
                  tipX - headLen * (ax + ay * 0.4),
                  tipY - headLen * (ay - ax * 0.4),
                );
                ctx.stroke();
              }
            }
          }
        }

        hexToRgb(hex) {
          const n = parseInt(hex.slice(1), 16);
          return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
        }

        drawNullcline(points, color, label) {
          if (!points || points.length < 2) return;
          const ctx = this.ctx;
          ctx.strokeStyle = color;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          let started = false;
          for (const p of points) {
            const x = this.toScreenX(p.V);
            const y = this.toScreenY(p.n);
            if (
              x < -50 ||
              x > this.width + 50 ||
              y < -50 ||
              y > this.height + 50
            ) {
              started = false;
              continue;
            }
            if (!started) {
              ctx.moveTo(x, y);
              started = true;
            } else ctx.lineTo(x, y);
          }
          ctx.stroke();

          const midIdx = Math.floor(points.length * 0.3);
          if (midIdx < points.length) {
            const lx = this.toScreenX(points[midIdx].V);
            const ly = this.toScreenY(points[midIdx].n);
            if (
              lx > 10 &&
              lx < this.width - 30 &&
              ly > 10 &&
              ly < this.height - 10
            ) {
              ctx.font = "500 11px 'Inter', sans-serif";
              ctx.fillStyle = color;
              ctx.fillText(label, lx + 5, ly - 5);
            }
          }
        }

        drawFixedPoints() {
          const ctx = this.ctx;
          const t = Theme.c;
          const analyzer = new JacobianAnalyzer(this.state.model);

          for (const fp of this.state.fixedPoints) {
            const x = this.toScreenX(fp.V);
            const y = this.toScreenY(fp.n);
            const analysis = analyzer.analyze(fp.V, fp.n);
            const type = analysis.type;

            const r = 6;

            if (type === "stable node" || type === "stable focus") {
              ctx.fillStyle = t.sage;
              ctx.beginPath();
              ctx.arc(x, y, r, 0, Math.PI * 2);
              ctx.fill();
              ctx.strokeStyle = t.fpStroke;
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.arc(x, y, r, 0, Math.PI * 2);
              ctx.stroke();
            } else if (type === "unstable node" || type === "unstable focus") {
              ctx.strokeStyle = t.rust;
              ctx.lineWidth = 2.5;
              ctx.beginPath();
              ctx.arc(x, y, r, 0, Math.PI * 2);
              ctx.stroke();
            } else if (type === "saddle") {
              ctx.fillStyle = t.ochre;
              ctx.beginPath();
              ctx.moveTo(x, y - r - 1);
              ctx.lineTo(x + r + 1, y);
              ctx.lineTo(x, y + r + 1);
              ctx.lineTo(x - r - 1, y);
              ctx.closePath();
              ctx.fill();
              ctx.strokeStyle = t.fpStroke;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(x, y - r - 1);
              ctx.lineTo(x + r + 1, y);
              ctx.lineTo(x, y + r + 1);
              ctx.lineTo(x - r - 1, y);
              ctx.closePath();
              ctx.stroke();
            } else {
              ctx.fillStyle = t.textMuted;
              ctx.beginPath();
              ctx.arc(x, y, r, 0, Math.PI * 2);
              ctx.fill();
            }

            if (this.state.show.eigenvectors && analysis.eigenvectors) {
              const vp = this.state.viewport;
              const evLen = 30;
              for (const ev of analysis.eigenvectors) {
                const dvx = (ev.x / (vp.Vmax - vp.Vmin)) * this.width;
                const dvy = (-ev.y / (vp.nMax - vp.nMin)) * this.height;
                const enorm = Math.sqrt(dvx * dvx + dvy * dvy);
                if (enorm < 0.01) continue;
                const edx = (dvx / enorm) * evLen;
                const edy = (dvy / enorm) * evLen;

                const evRgb = this.hexToRgb(
                  ev.eigenvalue > 0 ? t.rust : t.sage,
                );
                ctx.strokeStyle = `rgba(${evRgb.r},${evRgb.g},${evRgb.b},0.6)`;
                ctx.lineWidth = 1.5;
                ctx.setLineDash([4, 3]);
                ctx.beginPath();
                ctx.moveTo(x - edx, y - edy);
                ctx.lineTo(x + edx, y + edy);
                ctx.stroke();
                ctx.setLineDash([]);
              }
            }

            if (this.state.show.eigenvalues) {
              ctx.font = "9px 'Inter', monospace";
              ctx.fillStyle = t.textSecondary;
              const eigen = analysis.eigen;
              let txt;
              if (eigen.isComplex) {
                txt = `\u03BB=${eigen.lambda1.re.toFixed(2)}\u00B1${Math.abs(eigen.lambda1.im).toFixed(2)}i`;
              } else {
                txt = `\u03BB\u2081=${eigen.lambda1.toFixed(2)}, \u03BB\u2082=${eigen.lambda2.toFixed(2)}`;
              }
              ctx.fillText(txt, x + 10, y - 10);
              ctx.fillStyle = t.textMuted;
              ctx.fillText(type, x + 10, y + 2);
            }
          }
        }

        drawTrajectories() {
          const ctx = this.ctx;
          for (let ti = 0; ti < this.state.trajectories.length; ti++) {
            const traj = this.state.trajectories[ti];
            if (!traj.points || traj.points.length < 2) continue;

            ctx.strokeStyle = traj.color;
            ctx.lineWidth = ti === this.state.selectedTrajectory ? 2.5 : 1.5;
            ctx.globalAlpha = ti === this.state.selectedTrajectory ? 1.0 : 0.8;
            ctx.beginPath();
            let started = false;
            for (const p of traj.points) {
              const x = this.toScreenX(p.V);
              const y = this.toScreenY(p.n);
              if (!started) {
                ctx.moveTo(x, y);
                started = true;
              } else ctx.lineTo(x, y);
            }
            ctx.stroke();

            const sx = this.toScreenX(traj.points[0].V);
            const sy = this.toScreenY(traj.points[0].n);
            ctx.fillStyle = traj.color;
            ctx.beginPath();
            ctx.arc(sx, sy, 3, 0, Math.PI * 2);
            ctx.fill();

            const pts = traj.points;
            if (pts.length > 10) {
              const endIdx = Math.min(
                pts.length - 1,
                Math.floor(pts.length * 0.6),
              );
              const ex = this.toScreenX(pts[endIdx].V);
              const ey = this.toScreenY(pts[endIdx].n);
              const px = this.toScreenX(pts[endIdx - 5].V);
              const py = this.toScreenY(pts[endIdx - 5].n);
              const adx = ex - px,
                ady = ey - py;
              const al = Math.sqrt(adx * adx + ady * ady);
              if (al > 2) {
                const ax = adx / al,
                  ay = ady / al;
                const hl = 6;
                ctx.beginPath();
                ctx.moveTo(ex, ey);
                ctx.lineTo(
                  ex - hl * (ax - ay * 0.5),
                  ey - hl * (ay + ax * 0.5),
                );
                ctx.moveTo(ex, ey);
                ctx.lineTo(
                  ex - hl * (ax + ay * 0.5),
                  ey - hl * (ay - ax * 0.5),
                );
                ctx.stroke();
              }
            }

            ctx.globalAlpha = 1.0;
          }
        }

        drawLiveTrail() {
          const trail = this.state.liveTrail;
          const particle = this.state.liveParticle;
          const ctx = this.ctx;
          const t = Theme.c;

          if (trail.length > 1) {
            const trailColor = this.hexToRgb(t.accent);
            for (let i = 1; i < trail.length; i++) {
              const alpha = (i / trail.length) * 0.8;
              ctx.strokeStyle = `rgba(${trailColor.r},${trailColor.g},${trailColor.b},${alpha.toFixed(2)})`;
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.moveTo(
                this.toScreenX(trail[i - 1].V),
                this.toScreenY(trail[i - 1].n),
              );
              ctx.lineTo(
                this.toScreenX(trail[i].V),
                this.toScreenY(trail[i].n),
              );
              ctx.stroke();
            }
          }

          if (particle) {
            const px = this.toScreenX(particle.V);
            const py = this.toScreenY(particle.n);

            const grad = ctx.createRadialGradient(px, py, 0, px, py, 12);
            const accentRgb = this.hexToRgb(t.accent);
            grad.addColorStop(
              0,
              `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},0.5)`,
            );
            grad.addColorStop(
              1,
              `rgba(${accentRgb.r},${accentRgb.g},${accentRgb.b},0)`,
            );
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(px, py, 12, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = t.accent;
            ctx.beginPath();
            ctx.arc(px, py, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = t.fpStroke;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(px, py, 4, 0, Math.PI * 2);
            ctx.stroke();

            const model = this.state.model;
            const dv = model.dVdt(particle.V, particle.n);
            const dn = model.dndt(particle.V, particle.n);
            const vp = this.state.viewport;
            const dvS = (dv / (vp.Vmax - vp.Vmin)) * this.width;
            const dnS = (-dn / (vp.nMax - vp.nMin)) * this.height;
            const spd = Math.sqrt(dvS * dvS + dnS * dnS);
            if (spd > 0.5) {
              const ux = dvS / spd,
                uy = dnS / spd;
              const arrLen = 14;
              const tipX = px + ux * arrLen;
              const tipY = py + uy * arrLen;
              ctx.strokeStyle = t.accent;
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(tipX, tipY);
              ctx.lineTo(
                tipX - 5 * (ux - uy * 0.4),
                tipY - 5 * (uy + ux * 0.4),
              );
              ctx.moveTo(tipX, tipY);
              ctx.lineTo(
                tipX - 5 * (ux + uy * 0.4),
                tipY - 5 * (uy - ux * 0.4),
              );
              ctx.stroke();
            }
          }
        }

        drawManifolds() {
          if (!this.state.manifolds) return;
          const t = Theme.c;
          const m = this.state.manifolds;

          if (this.state.show.stableManifolds && m.stable) {
            for (const branch of m.stable) {
              this.drawManifoldBranch(branch, t.sage, [6, 4]);
            }
          }
          if (this.state.show.unstableManifolds && m.unstable) {
            for (const branch of m.unstable) {
              this.drawManifoldBranch(branch, t.rust, [6, 4]);
            }
          }
        }

        drawManifoldBranch(points, color, dash) {
          if (!points || points.length < 2) return;
          const ctx = this.ctx;
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.8;
          ctx.setLineDash(dash);
          ctx.globalAlpha = 0.7;
          ctx.beginPath();
          let started = false;
          for (const p of points) {
            const x = this.toScreenX(p.V);
            const y = this.toScreenY(p.n);
            if (
              x < -200 ||
              x > this.width + 200 ||
              y < -200 ||
              y > this.height + 200
            ) {
              started = false;
              continue;
            }
            if (!started) {
              ctx.moveTo(x, y);
              started = true;
            } else ctx.lineTo(x, y);
          }
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha = 1.0;
        }

        drawLimitCycle() {
          if (!this.state.limitCycle || !this.state.limitCycle.cycle) return;
          const ctx = this.ctx;
          const t = Theme.c;
          const cycle = this.state.limitCycle.cycle;

          ctx.strokeStyle = t.ochre;
          ctx.lineWidth = 3;
          ctx.setLineDash([8, 5]);
          ctx.globalAlpha = 0.9;
          ctx.beginPath();
          let started = false;
          for (const p of cycle) {
            const x = this.toScreenX(p.V);
            const y = this.toScreenY(p.n);
            if (!started) {
              ctx.moveTo(x, y);
              started = true;
            } else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.globalAlpha = 1.0;

          if (cycle.length > 10) {
            const lp = cycle[Math.floor(cycle.length / 4)];
            const lx = this.toScreenX(lp.V);
            const ly = this.toScreenY(lp.n);
            ctx.font = "500 11px 'Inter', sans-serif";
            ctx.fillStyle = t.ochre;
            ctx.fillText("limit cycle", lx + 8, ly - 8);
          }
        }

        drawUnstableCycle() {
          if (!this.state.unstableCycle || !this.state.unstableCycle.cycle)
            return;
          const ctx = this.ctx;
          const t = Theme.c;
          const cycle = this.state.unstableCycle.cycle;

          const rgb = this.hexToRgb(t.mauve);
          const fpRgb = this.hexToRgb(t.fpStroke);
          const glowPasses = [
            { width: 10, alpha: 0.08, r: rgb.r, g: rgb.g, b: rgb.b },
            { width: 6, alpha: 0.15, r: rgb.r, g: rgb.g, b: rgb.b },
            {
              width: 3,
              alpha: 0.4,
              r: Math.floor((rgb.r + fpRgb.r) / 2),
              g: Math.floor((rgb.g + fpRgb.g) / 2),
              b: Math.floor((rgb.b + fpRgb.b) / 2),
            },
            { width: 1.5, alpha: 0.9, r: fpRgb.r, g: fpRgb.g, b: fpRgb.b },
          ];

          for (const pass of glowPasses) {
            ctx.strokeStyle = `rgba(${pass.r},${pass.g},${pass.b},${pass.alpha})`;
            ctx.lineWidth = pass.width;
            ctx.globalAlpha = 1;
            ctx.setLineDash([]);
            ctx.beginPath();
            let started = false;
            for (const p of cycle) {
              const x = this.toScreenX(p.V);
              const y = this.toScreenY(p.n);
              if (!started) {
                ctx.moveTo(x, y);
                started = true;
              } else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
          }

          ctx.globalAlpha = 1.0;

          if (cycle.length > 10) {
            const lp = cycle[Math.floor(cycle.length / 3)];
            const lx = this.toScreenX(lp.V);
            const ly = this.toScreenY(lp.n);
            ctx.font = "500 11px 'Inter', sans-serif";
            ctx.fillStyle = t.mauve;
            ctx.fillText("unstable cycle", lx + 8, ly - 8);
          }
        }

        drawAxesLabels() {
          const ctx = this.ctx;
          const t = Theme.c;
          ctx.font = "500 12px 'Fraunces', serif";
          ctx.fillStyle = t.textMuted;
          ctx.fillText("V (mV)", this.width / 2 - 20, this.height - 4);
          ctx.save();
          ctx.translate(14, this.height / 2 + 8);
          ctx.rotate(-Math.PI / 2);
          ctx.fillText("n", 0, 0);
          ctx.restore();
        }
      }

      // renderer for those live neuron sims
      class TimeSeriesRenderer {
        constructor(canvas, state) {
          this.canvas = canvas;
          this.ctx = canvas.getContext("2d");
          this.state = state;
          this.dpr = window.devicePixelRatio || 1;
          this.resize();
        }

        resize() {
          const rect = this.canvas.parentElement.getBoundingClientRect();
          this.width = rect.width;
          this.height = rect.height - 28;
          if (this.height < 10) this.height = 10;
          this.canvas.width = this.width * this.dpr;
          this.canvas.height = (this.height + 28) * this.dpr;
          this.canvas.style.width = this.width + "px";
          this.canvas.style.height = this.height + 28 + "px";
          this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        }

        render() {
          const ctx = this.ctx;
          const t = Theme.c;
          ctx.clearRect(0, 0, this.width, this.height + 28);
          ctx.fillStyle = t.canvasBg;
          ctx.fillRect(0, 0, this.width, this.height + 28);

          if (!this.state.show.timeSeries) return;

          if (this.state.liveSimActive && this.state.liveTrail.length > 1) {
            this.renderLiveTimeSeries(ctx, t);
            return;
          }

          const traj =
            this.state.selectedTrajectory !== null
              ? this.state.trajectories[this.state.selectedTrajectory]
              : this.state.trajectories.length > 0
                ? this.state.trajectories[this.state.trajectories.length - 1]
                : null;

          if (!traj || !traj.points || traj.points.length < 2) {
            ctx.font = "11px 'Inter', sans-serif";
            ctx.fillStyle = t.textMuted;
            ctx.fillText(
              "Click phase plane to launch a trajectory",
              20,
              this.height / 2 + 14,
            );
            return;
          }

          const pts = traj.points;
          const yOff = 24;
          const h = this.height - 10;
          const w = this.width - 20;
          const x0 = 10;

          const tMax = pts[pts.length - 1].t;
          let Vmin = Infinity,
            Vmax = -Infinity;
          let nMin = Infinity,
            nMax = -Infinity;
          for (const p of pts) {
            Vmin = Math.min(Vmin, p.V);
            Vmax = Math.max(Vmax, p.V);
            nMin = Math.min(nMin, p.n);
            nMax = Math.max(nMax, p.n);
          }
          const Vrange = Vmax - Vmin || 1;
          const nRange = nMax - nMin || 0.01;

          ctx.strokeStyle = t.slate;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          for (let i = 0; i < pts.length; i++) {
            const px = x0 + (pts[i].t / tMax) * w;
            const py = yOff + h - ((pts[i].V - Vmin) / Vrange) * h;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();

          // n(t)
          ctx.strokeStyle = t.clay;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          for (let i = 0; i < pts.length; i++) {
            const px = x0 + (pts[i].t / tMax) * w;
            const py = yOff + h - ((pts[i].n - nMin) / nRange) * h;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();

          ctx.font = "10px 'Inter', sans-serif";
          ctx.fillStyle = t.slate;
          ctx.fillText("V(t)", x0 + 2, yOff + 10);
          ctx.fillStyle = t.clay;
          ctx.fillText("n(t)", x0 + 35, yOff + 10);
          ctx.fillStyle = t.textMuted;
          ctx.fillText(
            `t: 0 \u2192 ${tMax.toFixed(0)}`,
            x0 + w - 80,
            yOff + h + 10,
          );
        }

        renderLiveTimeSeries(ctx, t) {
          const pts = this.state.liveTrail;
          const yOff = 24;
          const h = this.height - 10;
          const w = this.width - 20;
          const x0 = 10;

          const tEnd = pts[pts.length - 1].t;
          const windowSize = Math.max(50, pts.length * 0.05);
          const tStart = tEnd - windowSize;

          let Vmin = -80,
            Vmax = 60;
          let nMin = -0.1,
            nMax = 0.7;
          for (const p of pts) {
            Vmin = Math.min(Vmin, p.V - 5);
            Vmax = Math.max(Vmax, p.V + 5);
            nMin = Math.min(nMin, p.n - 0.02);
            nMax = Math.max(nMax, p.n + 0.02);
          }
          const Vrange = Vmax - Vmin || 1;
          const nRange = nMax - nMin || 0.01;

          ctx.strokeStyle = t.slate;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          let started = false;
          for (const p of pts) {
            if (p.t < tStart) continue;
            const px = x0 + ((p.t - tStart) / windowSize) * w;
            const py = yOff + h - ((p.V - Vmin) / Vrange) * h;
            if (!started) {
              ctx.moveTo(px, py);
              started = true;
            } else ctx.lineTo(px, py);
          }
          ctx.stroke();

          ctx.strokeStyle = t.clay;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          started = false;
          for (const p of pts) {
            if (p.t < tStart) continue;
            const px = x0 + ((p.t - tStart) / windowSize) * w;
            const py = yOff + h - ((p.n - nMin) / nRange) * h;
            if (!started) {
              ctx.moveTo(px, py);
              started = true;
            } else ctx.lineTo(px, py);
          }
          ctx.stroke();

          ctx.font = "10px 'Inter', sans-serif";
          ctx.fillStyle = t.slate;
          ctx.fillText("V(t)", x0 + 2, yOff + 10);
          ctx.fillStyle = t.clay;
          ctx.fillText("n(t)", x0 + 35, yOff + 10);
          ctx.fillStyle = t.textMuted;
          ctx.fillText(
            `t: ${tStart.toFixed(0)} \u2192 ${tEnd.toFixed(0)} (live)`,
            x0 + w - 120,
            yOff + h + 10,
          );
        }
      }

      class BifurcationRenderer {
        constructor(canvas) {
          this.canvas = canvas;
          this.ctx = canvas.getContext("2d");
          this.dpr = window.devicePixelRatio || 1;
          this.resize();
        }

        resize() {
          const rect = this.canvas.getBoundingClientRect();
          this.width = rect.width;
          this.height = rect.height;
          this.canvas.width = this.width * this.dpr;
          this.canvas.height = this.height * this.dpr;
          this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        }

        render(results) {
          this.resize();
          const ctx = this.ctx;
          const t = Theme.c;
          ctx.clearRect(0, 0, this.width, this.height);
          ctx.fillStyle = t.canvasBg;
          ctx.fillRect(0, 0, this.width, this.height);

          if (!results || results.length === 0) return;

          const pad = { left: 50, right: 20, top: 20, bottom: 40 };
          const w = this.width - pad.left - pad.right;
          const h = this.height - pad.top - pad.bottom;

          const IextMin = results[0].Iext;
          const IextMax = results[results.length - 1].Iext;
          const Vmin = -80,
            Vmax = 60;

          ctx.strokeStyle = t.gridLine;
          ctx.lineWidth = 0.5;
          ctx.font = "10px 'Inter', sans-serif";
          ctx.fillStyle = t.textMuted;

          for (let I = Math.ceil(IextMin / 20) * 20; I <= IextMax; I += 20) {
            const x = pad.left + ((I - IextMin) / (IextMax - IextMin)) * w;
            ctx.beginPath();
            ctx.moveTo(x, pad.top);
            ctx.lineTo(x, pad.top + h);
            ctx.stroke();
            ctx.fillText(I.toFixed(0), x - 8, pad.top + h + 14);
          }
          for (let V = -60; V <= 40; V += 20) {
            const y = pad.top + h - ((V - Vmin) / (Vmax - Vmin)) * h;
            ctx.beginPath();
            ctx.moveTo(pad.left, y);
            ctx.lineTo(pad.left + w, y);
            ctx.stroke();
            ctx.fillText(V.toFixed(0), pad.left - 30, y + 4);
          }

          ctx.font = "500 12px 'Fraunces', serif";
          ctx.fillStyle = t.textMuted;
          ctx.fillText("I_ext", pad.left + w / 2 - 15, pad.top + h + 32);
          ctx.save();
          ctx.translate(14, pad.top + h / 2 + 5);
          ctx.rotate(-Math.PI / 2);
          ctx.fillText("V (mV)", 0, 0);
          ctx.restore();

          for (const r of results) {
            const ix =
              pad.left + ((r.Iext - IextMin) / (IextMax - IextMin)) * w;
            for (const fp of r.fixedPoints) {
              const iy = pad.top + h - ((fp.V - Vmin) / (Vmax - Vmin)) * h;
              const isStable = fp.type.startsWith("stable");
              const isSaddle = fp.type === "saddle";
              ctx.fillStyle = isStable ? t.sage : isSaddle ? t.ochre : t.rust;
              ctx.fillRect(ix - 1.5, iy - 1.5, 3, 3);
            }

            if (r.limitCycle) {
              const yMin =
                pad.top + h - ((r.limitCycle.Vmin - Vmin) / (Vmax - Vmin)) * h;
              const yMax =
                pad.top + h - ((r.limitCycle.Vmax - Vmin) / (Vmax - Vmin)) * h;
              ctx.fillStyle = t.ochre;
              ctx.globalAlpha = 0.6;
              ctx.fillRect(ix - 1, yMin - 1, 2, 2);
              ctx.fillRect(ix - 1, yMax - 1, 2, 2);
              ctx.globalAlpha = 1.0;
            }
          }

          const ly = pad.top + 10;
          const lx = pad.left + 10;
          ctx.font = "10px 'Inter', sans-serif";
          const items = [
            [t.sage, "Stable FP"],
            [t.rust, "Unstable FP"],
            [t.ochre, "Saddle"],
            [t.ochre, "Limit cycle"],
          ];
          items.forEach((it, i) => {
            ctx.fillStyle = it[0];
            ctx.fillRect(lx, ly + i * 14, 8, 8);
            ctx.fillStyle = t.textSecondary;
            ctx.fillText(it[1], lx + 12, ly + i * 14 + 8);
          });
        }
      }

      const PRESETS = {
        "Type I (SNIC)": {
          gCa: 4.4,
          gK: 8,
          gL: 2,
          ECa: 120,
          EK: -84,
          EL: -60,
          V1: -1.2,
          V2: 18,
          V3: 12,
          V4: 17.4,
          phi: 0.067,
          C: 20,
          Iext: 40,
        },
        "Type II (Hopf)": {
          gCa: 4.4,
          gK: 8,
          gL: 2,
          ECa: 120,
          EK: -84,
          EL: -60,
          V1: -1.2,
          V2: 18,
          V3: 2,
          V4: 30,
          phi: 0.04,
          C: 20,
          Iext: 90,
        },
        "Supercritical Hopf": {
          gCa: 4.4,
          gK: 8,
          gL: 2,
          ECa: 120,
          EK: -84,
          EL: -60,
          V1: -1.2,
          V2: 18,
          V3: 2,
          V4: 30,
          phi: 0.04,
          C: 20,
          Iext: 95,
        },
        "Subcritical Hopf": {
          gCa: 4.4,
          gK: 8,
          gL: 2,
          ECa: 120,
          EK: -84,
          EL: -60,
          V1: -1.2,
          V2: 18,
          V3: 12,
          V4: 17.4,
          phi: 0.04,
          C: 20,
          Iext: 45,
        },
        Bistable: {
          gCa: 4.4,
          gK: 8,
          gL: 2,
          ECa: 120,
          EK: -84,
          EL: -60,
          V1: -1.2,
          V2: 18,
          V3: 12,
          V4: 17.4,
          phi: 0.04,
          C: 20,
          Iext: 39,
        },
        "Near Saddle-Node": {
          gCa: 4.4,
          gK: 8,
          gL: 2,
          ECa: 120,
          EK: -84,
          EL: -60,
          V1: -1.2,
          V2: 18,
          V3: 12,
          V4: 17.4,
          phi: 0.04,
          C: 20,
          Iext: 38,
        },
        "Relaxation Oscillator": {
          gCa: 4.4,
          gK: 8,
          gL: 2,
          ECa: 120,
          EK: -84,
          EL: -60,
          V1: -1.2,
          V2: 18,
          V3: 2,
          V4: 30,
          phi: 0.005,
          C: 20,
          Iext: 50,
        },
        Integrator: {
          gCa: 4.4,
          gK: 8,
          gL: 2,
          ECa: 120,
          EK: -84,
          EL: -60,
          V1: -1.2,
          V2: 18,
          V3: 12,
          V4: 17.4,
          phi: 0.04,
          C: 20,
          Iext: 36,
        },
        Resonator: {
          gCa: 4.4,
          gK: 8,
          gL: 2,
          ECa: 120,
          EK: -84,
          EL: -60,
          V1: -1.2,
          V2: 18,
          V3: 2,
          V4: 30,
          phi: 0.04,
          C: 20,
          Iext: 80,
        },
        "Post-Inhibitory Rebound": {
          gCa: 4.4,
          gK: 8,
          gL: 2,
          ECa: 120,
          EK: -84,
          EL: -60,
          V1: -1.2,
          V2: 18,
          V3: 2,
          V4: 30,
          phi: 0.04,
          C: 20,
          Iext: 42,
        },
        "Homoclinic Bifurcation": {
          gCa: 4.4,
          gK: 8,
          gL: 2,
          ECa: 120,
          EK: -84,
          EL: -60,
          V1: -1.2,
          V2: 18,
          V3: 12,
          V4: 17.4,
          phi: 0.23,
          C: 20,
          Iext: 41,
        },
      };

      class UIController {
        constructor(state) {
          this.state = state;
          this.sliders = {};
          this.swatchEls = {};
          this.callbacks = {
            onParamChange: null,
            onPresetChange: null,
            onToggleChange: null,
          };
          this.buildSidebar();
          this.buildPresetSelector();
        }

        buildSidebar() {
          const sidebar = document.getElementById("sidebar");
          sidebar.innerHTML = "";

          const presetSection = this.makeSection("Preset");
          const presetInfo = document.createElement("div");
          presetInfo.id = "preset-info";
          presetInfo.style.cssText =
            "font-size:11px;color:var(--text-muted);margin-bottom:8px;";
          presetInfo.textContent = "Select a preset from the toolbar";
          presetSection.appendChild(presetInfo);
          sidebar.appendChild(presetSection);

          const paramGroups = [
            {
              name: "External Input",
              params: [
                { key: "Iext", label: "I_ext", min: -20, max: 200, step: 0.5 },
              ],
            },
            {
              name: "Conductances",
              params: [
                { key: "gCa", label: "gCa", min: 0, max: 10, step: 0.1 },
                { key: "gK", label: "gK", min: 0, max: 20, step: 0.1 },
                { key: "gL", label: "gL", min: 0, max: 5, step: 0.1 },
              ],
            },
            {
              name: "Reversal Potentials",
              params: [
                { key: "ECa", label: "ECa", min: 50, max: 150, step: 1 },
                { key: "EK", label: "EK", min: -100, max: -50, step: 1 },
                { key: "EL", label: "EL", min: -80, max: -40, step: 1 },
              ],
            },
            {
              name: "Gating (V1-V4)",
              params: [
                { key: "V1", label: "V1", min: -20, max: 20, step: 0.1 },
                { key: "V2", label: "V2", min: 1, max: 40, step: 0.1 },
                { key: "V3", label: "V3", min: -10, max: 30, step: 0.1 },
                { key: "V4", label: "V4", min: 1, max: 50, step: 0.1 },
              ],
            },
            {
              name: "Dynamics",
              params: [
                {
                  key: "phi",
                  label: "\u03C6",
                  min: 0.001,
                  max: 1,
                  step: 0.001,
                },
                { key: "C", label: "C", min: 1, max: 50, step: 0.5 },
              ],
            },
          ];

          for (const group of paramGroups) {
            const section = this.makeSection(group.name);
            for (const p of group.params) {
              const row = this.makeSlider(p);
              section.appendChild(row);
            }
            sidebar.appendChild(section);
          }

          const toggleSection = this.makeSection("Display");
          const swatches = Theme.swatches;
          const toggles = [
            {
              key: "vectorField",
              label: "Vector field",
              swatchKey: "vectorField",
            },
            { key: "flowSpeed", label: "Flow speed coloring", swatchKey: null },
            {
              key: "vNullcline",
              label: "V-nullcline",
              swatchKey: "vNullcline",
            },
            {
              key: "nNullcline",
              label: "n-nullcline",
              swatchKey: "nNullcline",
            },
            { key: "fixedPoints", label: "Fixed points", swatchKey: null },
            { key: "eigenvalues", label: "Eigenvalues", swatchKey: null },
            { key: "eigenvectors", label: "Eigenvectors", swatchKey: null },
            { key: "trajectories", label: "Trajectories", swatchKey: null },
            {
              key: "limitCycle",
              label: "Limit cycle (stable)",
              swatchKey: "limitCycle",
            },
            {
              key: "unstableCycle",
              label: "Unstable cycle",
              swatchKey: "unstableCycle",
            },
            {
              key: "stableManifolds",
              label: "Stable manifolds",
              swatchKey: "stableManifolds",
            },
            {
              key: "unstableManifolds",
              label: "Unstable manifolds",
              swatchKey: "unstableManifolds",
            },
            { key: "separatrix", label: "Separatrix", swatchKey: "separatrix" },
            { key: "timeSeries", label: "Time series panel", swatchKey: null },
          ];

          for (const t of toggles) {
            const row = document.createElement("div");
            row.className = "toggle-row";
            const label = document.createElement("label");
            const cb = document.createElement("input");
            cb.type = "checkbox";
            cb.checked = this.state.show[t.key];
            cb.addEventListener("change", () => {
              this.state.show[t.key] = cb.checked;
              if (t.key === "timeSeries") {
                const tsContainer = document.getElementById(
                  "timeseries-container",
                );
                if (cb.checked) tsContainer.classList.remove("collapsed");
                else tsContainer.classList.add("collapsed");
              }
              this.state.dirty.all = true;
              if (this.callbacks.onToggleChange)
                this.callbacks.onToggleChange(t.key);
            });

            label.appendChild(cb);
            if (t.swatchKey) {
              const swatch = document.createElement("span");
              swatch.className = "swatch";
              swatch.style.background = swatches[t.swatchKey] || "";
              label.appendChild(swatch);
              this.swatchEls[t.swatchKey] = swatch;
            }
            label.appendChild(document.createTextNode(" " + t.label));
            row.appendChild(label);
            toggleSection.appendChild(row);
          }
          sidebar.appendChild(toggleSection);

          const noiseSection = this.makeSection("Stochastic");
          this.noisySection = noiseSection;

          const noisyRow = document.createElement("div");
          noisyRow.className = "toggle-row";
          const noisyLabel = document.createElement("label");
          const noisyCb = document.createElement("input");
          noisyCb.type = "checkbox";
          noisyCb.checked = this.state.noisyTrajEnabled;
          noisyCb.addEventListener("change", () => {
            this.state.noisyTrajEnabled = noisyCb.checked;
            this.updateNoiseVisibility();
          });
          noisyLabel.appendChild(noisyCb);
          noisyLabel.appendChild(
            document.createTextNode(" Noisy trajectories"),
          );
          noisyRow.appendChild(noisyLabel);
          noiseSection.appendChild(noisyRow);

          const noiseSigmaVRow = this.makeSliderCustom(
            "σ_V",
            0,
            10,
            0.1,
            this.state.noisySigmaV,
            (v) => {
              this.state.noisySigmaV = v;
            },
          );
          noiseSigmaVRow.classList.add("noise-param");
          noiseSection.appendChild(noiseSigmaVRow);

          const noiseSigmaNRow = this.makeSliderCustom(
            "σ_n",
            0,
            0.05,
            0.001,
            this.state.noisySigmaN,
            (v) => {
              this.state.noisySigmaN = v;
            },
          );
          noiseSigmaNRow.classList.add("noise-param");
          noiseSection.appendChild(noiseSigmaNRow);

          const noiseInfo = document.createElement("div");
          noiseInfo.className = "noise-info";
          noiseInfo.style.cssText =
            "font-size:10px;color:var(--text-muted);margin-top:4px;display:none;";
          noiseInfo.textContent =
            "Alt+Click: launch ensemble (10 noisy trajectories)";
          noiseSection.appendChild(noiseInfo);
          this.noiseInfoEl = noiseInfo;

          sidebar.appendChild(noiseSection);
          this.updateNoiseVisibility();

          const liveSection = this.makeSection("Live Simulation");
          liveSection.id = "live-sim-section";
          liveSection.style.display = "none";

          const liveSpeedRow = this.makeSliderCustom(
            "Speed",
            0.25,
            4,
            0.25,
            this.state.liveSpeed,
            (v) => {
              this.state.liveSpeed = v;
            },
          );
          liveSection.appendChild(liveSpeedRow);

          const liveStochRow = document.createElement("div");
          liveStochRow.className = "toggle-row";
          const liveStochLabel = document.createElement("label");
          const liveStochCb = document.createElement("input");
          liveStochCb.type = "checkbox";
          liveStochCb.id = "live-stoch-cb";
          liveStochCb.checked = this.state.liveStochastic;
          liveStochCb.addEventListener("change", () => {
            this.state.liveStochastic = liveStochCb.checked;
            this.updateLiveNoiseVisibility();
          });
          liveStochLabel.appendChild(liveStochCb);
          liveStochLabel.appendChild(
            document.createTextNode(" Stochastic noise"),
          );
          liveStochRow.appendChild(liveStochLabel);
          liveSection.appendChild(liveStochRow);

          const liveSigmaVRow = this.makeSliderCustom(
            "σ_V",
            0,
            10,
            0.1,
            this.state.liveSigmaV,
            (v) => {
              this.state.liveSigmaV = v;
            },
          );
          liveSigmaVRow.classList.add("live-noise-param");
          liveSection.appendChild(liveSigmaVRow);

          const liveSigmaNRow = this.makeSliderCustom(
            "σ_n",
            0,
            0.05,
            0.001,
            this.state.liveSigmaN,
            (v) => {
              this.state.liveSigmaN = v;
            },
          );
          liveSigmaNRow.classList.add("live-noise-param");
          liveSection.appendChild(liveSigmaNRow);

          const liveInfo = document.createElement("div");
          liveInfo.style.cssText =
            "font-size:10px;color:var(--text-muted);margin-top:6px;";
          liveInfo.innerHTML =
            "Click: teleport particle<br>Shift+Click: current pulse";
          liveSection.appendChild(liveInfo);

          sidebar.appendChild(liveSection);
          this.updateLiveNoiseVisibility();

          const fpSection = this.makeSection("Fixed Points");
          const fpInfo = document.createElement("div");
          fpInfo.id = "fp-info";
          fpInfo.textContent = "Computing...";
          fpSection.appendChild(fpInfo);
          sidebar.appendChild(fpSection);
        }

        updateSwatchColors() {
          const swatches = Theme.swatches;
          for (const [key, el] of Object.entries(this.swatchEls)) {
            if (swatches[key]) el.style.background = swatches[key];
          }
        }

        makeSliderCustom(labelText, min, max, step, initial, onChange) {
          const row = document.createElement("div");
          row.className = "param-row";

          const label = document.createElement("span");
          label.className = "param-label";
          label.textContent = labelText;

          const slider = document.createElement("input");
          slider.type = "range";
          slider.className = "param-slider";
          slider.min = min;
          slider.max = max;
          slider.step = step;
          slider.value = initial;

          const valueSpan = document.createElement("span");
          valueSpan.className = "param-value";
          valueSpan.textContent = Number(initial).toFixed(
            step < 0.01 ? 3 : step < 0.1 ? 2 : 1,
          );

          slider.addEventListener("input", () => {
            const val = parseFloat(slider.value);
            valueSpan.textContent = val.toFixed(
              step < 0.01 ? 3 : step < 0.1 ? 2 : 1,
            );
            onChange(val);
          });

          row.appendChild(label);
          row.appendChild(slider);
          row.appendChild(valueSpan);
          return row;
        }

        updateNoiseVisibility() {
          const show = this.state.noisyTrajEnabled;
          const params = this.noisySection.querySelectorAll(".noise-param");
          params.forEach((el) => (el.style.display = show ? "" : "none"));
          if (this.noiseInfoEl)
            this.noiseInfoEl.style.display = show ? "" : "none";
        }

        updateLiveNoiseVisibility() {
          const show = this.state.liveStochastic;
          const section = document.getElementById("live-sim-section");
          if (section) {
            const params = section.querySelectorAll(".live-noise-param");
            params.forEach((el) => (el.style.display = show ? "" : "none"));
          }
        }

        updateLiveSectionVisibility() {
          const section = document.getElementById("live-sim-section");
          if (section) {
            section.style.display = this.state.liveSimActive ? "" : "none";
          }
        }

        makeSection(title) {
          const div = document.createElement("div");
          div.className = "sidebar-section";
          const h3 = document.createElement("h3");
          h3.textContent = title;
          div.appendChild(h3);
          return div;
        }

        makeSlider(p) {
          const row = document.createElement("div");
          row.className = "param-row";

          const label = document.createElement("span");
          label.className = "param-label";
          label.textContent = p.label;

          const slider = document.createElement("input");
          slider.type = "range";
          slider.className = "param-slider";
          slider.min = p.min;
          slider.max = p.max;
          slider.step = p.step;
          slider.value = this.state.model.params[p.key];

          const valueSpan = document.createElement("span");
          valueSpan.className = "param-value";
          valueSpan.textContent = this.formatValue(
            this.state.model.params[p.key],
            p.key,
          );

          slider.addEventListener("input", () => {
            const val = parseFloat(slider.value);
            this.state.model.params[p.key] = val;
            valueSpan.textContent = this.formatValue(val, p.key);
            this.state.markAllDirty();
            if (this.callbacks.onParamChange)
              this.callbacks.onParamChange(p.key, val);
          });

          this.sliders[p.key] = { slider, valueSpan };

          row.appendChild(label);
          row.appendChild(slider);
          row.appendChild(valueSpan);
          return row;
        }

        formatValue(val, key) {
          if (key === "phi") return val.toFixed(3);
          if (Math.abs(val) < 10 && key !== "Iext") return val.toFixed(1);
          return val.toFixed(1);
        }

        buildPresetSelector() {
          const select = document.getElementById("preset-select");
          for (const name of Object.keys(PRESETS)) {
            const opt = document.createElement("option");
            opt.value = name;
            opt.textContent = name;
            select.appendChild(opt);
          }
          select.addEventListener("change", () => {
            const preset = PRESETS[select.value];
            if (!preset) return;
            this.state.model.setParams(preset);
            this.syncSliders();
            this.state.markAllDirty();
            if (this.callbacks.onPresetChange)
              this.callbacks.onPresetChange(select.value);
          });
        }

        syncSliders() {
          for (const [key, s] of Object.entries(this.sliders)) {
            s.slider.value = this.state.model.params[key];
            s.valueSpan.textContent = this.formatValue(
              this.state.model.params[key],
              key,
            );
          }
        }

        updateFixedPointInfo(fps) {
          const fpInfo = document.getElementById("fp-info");
          if (!fps || fps.length === 0) {
            fpInfo.textContent = "No fixed points found";
            return;
          }

          fpInfo.innerHTML = "";
          const analyzer = new JacobianAnalyzer(this.state.model);

          for (const fp of fps) {
            const analysis = analyzer.analyze(fp.V, fp.n);
            const div = document.createElement("div");
            div.className = "fp-entry";
            if (analysis.type.startsWith("stable")) div.classList.add("stable");
            else if (analysis.type === "saddle") div.classList.add("saddle");
            else div.classList.add("unstable");

            let eigenStr;
            if (analysis.eigen.isComplex) {
              eigenStr = `\u03BB = ${analysis.eigen.lambda1.re.toFixed(3)} \u00B1 ${Math.abs(analysis.eigen.lambda1.im).toFixed(3)}i`;
            } else {
              eigenStr = `\u03BB\u2081=${analysis.eigen.lambda1.toFixed(3)}, \u03BB\u2082=${analysis.eigen.lambda2.toFixed(3)}`;
            }

            div.innerHTML = `
        <b>${analysis.type}</b><br>
        V=${fp.V.toFixed(2)}, n=${fp.n.toFixed(4)}<br>
        ${eigenStr}<br>
        tr=${analysis.eigen.trace.toFixed(3)}, det=${analysis.eigen.det.toFixed(3)}
      `;
            fpInfo.appendChild(div);
          }
        }
      }

      class App {
        constructor() {
          this.state = new AppState();
          this._alive = true;
          this._liveBaseIext = this.state.model.params.Iext;
          this.phaseCanvas = document.getElementById("phase-canvas");
          this.tsCanvas = document.getElementById("ts-canvas");
          this.bifurcCanvas = document.getElementById("bifurc-canvas");

          this.phaseRenderer = new PhaseCanvasRenderer(
            this.phaseCanvas,
            this.state,
          );
          this.tsRenderer = new TimeSeriesRenderer(this.tsCanvas, this.state);
          this.bifurcRenderer = new BifurcationRenderer(this.bifurcCanvas);

          this.ui = new UIController(this.state);
          this.ui.callbacks.onParamChange = (key) => {
            this._liveRK4 = null;
            this._liveEM = null;
            if (key === "Iext")
              this._liveBaseIext = this.state.model.params.Iext;
            this.recompute();
          };
          this.ui.callbacks.onPresetChange = (name) => {
            document.getElementById("preset-info").textContent =
              `Active: ${name}`;
            this.state.trajectories = [];
            this.state.selectedTrajectory = null;
            this.state.trajColorIdx = 0;
            this.state.liveTrail = [];
            this.state.liveParticle = null;
            this._liveRK4 = null;
            this._liveEM = null;
            this._liveBaseIext = this.state.model.params.Iext;
            this.recompute();
          };
          this.ui.callbacks.onToggleChange = () => this.scheduleRender();

          this.isPanning = false;
          this.panStart = null;
          this.panViewportStart = null;

          this.setupInteractions();
          this.setupToolbar();
          this.setupKeyboard();
          this.setupResize();

          this.recompute();
          this.renderLoop();
        }

        destroy() {
          this._alive = false;
          this.state.liveRunning = false;
          if (this._keydownHandler) document.removeEventListener("keydown", this._keydownHandler);
          if (this._resizeHandler) window.removeEventListener("resize", this._resizeHandler);
        }

        toggleTheme() {
          Theme.toggle();
          this.ui.updateSwatchColors();
          this.scheduleRender();
        }

        recompute() {
          const model = this.state.model;
          const vp = this.state.viewport;

          const nc = new NullclineComputer(model);
          this.state.vNullcline = nc.computeVNullcline(
            vp.Vmin - 20,
            vp.Vmax + 20,
          );
          this.state.nNullcline = nc.computeNNullcline(
            vp.Vmin - 20,
            vp.Vmax + 20,
          );

          const fpFinder = new FixedPointFinder(model);
          this.state.fixedPoints = fpFinder.findAll(vp.Vmin - 20, vp.Vmax + 20);
          this.ui.updateFixedPointInfo(this.state.fixedPoints);

          const analyzer = new JacobianAnalyzer(model);
          this.state.manifolds = null;
          for (const fp of this.state.fixedPoints) {
            const analysis = analyzer.analyze(fp.V, fp.n);
            if (analysis.type === "saddle" && analysis.eigenvectors) {
              const mc = new ManifoldComputer(model);
              this.state.manifolds = mc.computeManifolds(
                fp,
                analysis.eigenvectors,
              );
              break;
            }
          }

          this.state.limitCycle = null;
          this.state.unstableCycle = null;

          let stableFocus = null;
          let hasUnstable = false;
          for (const fp of this.state.fixedPoints) {
            const analysis = analyzer.analyze(fp.V, fp.n);
            if (
              analysis.type === "unstable focus" ||
              analysis.type === "unstable node"
            ) {
              hasUnstable = true;
            }
            if (
              analysis.type === "stable focus" ||
              analysis.type === "stable node"
            ) {
              stableFocus = fp;
            }
          }

          const lcd = new LimitCycleDetector(model);
          if (hasUnstable || this.state.fixedPoints.length === 0) {
            const startV =
              this.state.fixedPoints.length > 0
                ? this.state.fixedPoints[0].V + 10
                : -20;
            this.state.limitCycle = lcd.detect(startV, 0.15);
          }
          if (!this.state.limitCycle && stableFocus) {
            const farStarts = [
              [stableFocus.V + 40, stableFocus.n],
              [stableFocus.V - 30, stableFocus.n + 0.3],
              [stableFocus.V + 50, 0.1],
              [20, 0.05],
            ];
            for (const [sv, sn] of farStarts) {
              this.state.limitCycle = lcd.detect(sv, sn);
              if (this.state.limitCycle) break;
            }
          }

          if (stableFocus && this.state.limitCycle) {
            const unstable = lcd.detectUnstable(stableFocus);
            if (unstable) {
              const stableAmp = this.state.limitCycle.amplitude;
              if (
                unstable.amplitude < stableAmp * 0.9 &&
                unstable.amplitude > 2
              ) {
                this.state.unstableCycle = unstable;
              }
            }
          }

          this.state.dirty.all = true;
          this.scheduleRender();
        }

        scheduleRender() {
          this._needsRender = true;
        }

        renderLoop() {
          if (!this._alive) return;
          if (
            this.state.liveSimActive &&
            this.state.liveRunning &&
            this.state.liveParticle
          ) {
            this.stepLiveSim();
            this._needsRender = true;
          }
          if (this._needsRender) {
            this.phaseRenderer.render();
            this.tsRenderer.render();
            this._needsRender = false;
          }
          requestAnimationFrame(() => this.renderLoop());
        }

        setupInteractions() {
          const canvas = this.phaseCanvas;

          canvas.addEventListener("click", (e) => {
            if (this.isPanning) return;
            const rect = canvas.getBoundingClientRect();
            const sx = e.clientX - rect.left;
            const sy = e.clientY - rect.top;
            const V = this.phaseRenderer.toModelV(sx);
            const n = this.phaseRenderer.toModelN(sy);

            if (this.state.liveSimActive) {
              if (e.shiftKey) {
                // Current pulse perturbation
                this.state.livePulseActive = true;
                this.state.livePulseRemaining = 5.0; // 5ms sim time
                if (!this.state.liveRunning) {
                  this.state.liveRunning = true;
                  this.updateLiveButtons();
                }
              } else {
                // Teleport particle
                this.state.liveParticle = {
                  V,
                  n,
                  t: this.state.liveParticle ? this.state.liveParticle.t : 0,
                };
                this.state.liveTrail = [{ V, n, t: this.state.liveParticle.t }];
                if (!this.state.liveRunning) {
                  this.state.liveRunning = true;
                  this.updateLiveButtons();
                }
              }
              this.scheduleRender();
            } else if (e.altKey && this.state.noisyTrajEnabled) {
              this.launchEnsemble(V, n, 10);
            } else {
              this.launchTrajectory(V, n, e.shiftKey);
            }
          });

          canvas.addEventListener("mousedown", (e) => {
            if (e.button !== 0) return;
            this.isPanning = false;
            this.panStart = { x: e.clientX, y: e.clientY };
            this.panViewportStart = { ...this.state.viewport };

            const onMove = (me) => {
              const dx = me.clientX - this.panStart.x;
              const dy = me.clientY - this.panStart.y;
              if (Math.abs(dx) + Math.abs(dy) > 5) this.isPanning = true;

              if (this.isPanning) {
                const vp = this.state.viewport;
                const pvp = this.panViewportStart;
                const vRange = pvp.Vmax - pvp.Vmin;
                const nRange = pvp.nMax - pvp.nMin;
                vp.Vmin = pvp.Vmin - (dx / this.phaseRenderer.width) * vRange;
                vp.Vmax = pvp.Vmax - (dx / this.phaseRenderer.width) * vRange;
                vp.nMin = pvp.nMin + (dy / this.phaseRenderer.height) * nRange;
                vp.nMax = pvp.nMax + (dy / this.phaseRenderer.height) * nRange;
                this.state.dirty.vectorField = true;
                this.recompute();
              }
            };

            const onUp = () => {
              document.removeEventListener("mousemove", onMove);
              document.removeEventListener("mouseup", onUp);
              setTimeout(() => {
                this.isPanning = false;
              }, 50);
            };

            document.addEventListener("mousemove", onMove);
            document.addEventListener("mouseup", onUp);
          });

          canvas.addEventListener(
            "wheel",
            (e) => {
              e.preventDefault();
              const rect = canvas.getBoundingClientRect();
              const sx = e.clientX - rect.left;
              const sy = e.clientY - rect.top;
              const V = this.phaseRenderer.toModelV(sx);
              const n = this.phaseRenderer.toModelN(sy);

              const factor = e.deltaY > 0 ? 1.1 : 0.9;
              const vp = this.state.viewport;
              vp.Vmin = V + (vp.Vmin - V) * factor;
              vp.Vmax = V + (vp.Vmax - V) * factor;
              vp.nMin = n + (vp.nMin - n) * factor;
              vp.nMax = n + (vp.nMax - n) * factor;

              this.recompute();
            },
            { passive: false },
          );

          canvas.addEventListener("mousemove", (e) => {
            const rect = canvas.getBoundingClientRect();
            const sx = e.clientX - rect.left;
            const sy = e.clientY - rect.top;
            const V = this.phaseRenderer.toModelV(sx);
            const n = this.phaseRenderer.toModelN(sy);
            document.getElementById("coord-display").textContent =
              `V: ${V.toFixed(1)} mV, n: ${n.toFixed(4)}`;
          });

          this.tsCanvas.addEventListener("click", (e) => {
            if (this.state.trajectories.length > 0) {
              this.state.selectedTrajectory =
                this.state.trajectories.length - 1;
              this.scheduleRender();
            }
          });
        }

        launchTrajectory(V, n, backward = false) {
          const dt = 0.05;
          const steps = 10000;
          const noisy = this.state.noisyTrajEnabled;

          let fwd;
          if (noisy) {
            const em = new EulerMaruyamaIntegrator(this.state.model);
            fwd = em.integrate(
              V,
              n,
              dt,
              steps,
              this.state.noisySigmaV,
              this.state.noisySigmaN,
            );
          } else {
            const integrator = new RK4Integrator(this.state.model);
            fwd = integrator.integrate(V, n, dt, steps);
          }
          const color = this.state.nextTrajColor();

          if (backward) {
            //  always uses deterministic RK4 for back sim
            const rk4 = new RK4Integrator(this.state.model);
            const bwd = rk4.integrate(V, n, -dt, steps);
            bwd.reverse();
            const combined = [...bwd, ...fwd.slice(1)];
            const totalLen = combined.length;
            for (let i = 0; i < totalLen; i++) {
              combined[i].t = i * dt;
            }
            this.state.trajectories.push({ points: combined, color });
          } else {
            this.state.trajectories.push({ points: fwd, color });
          }

          this.state.selectedTrajectory = this.state.trajectories.length - 1;
          this.state.dirty.trajectories = true;
          this.scheduleRender();
        }

        launchEnsemble(V, n, count = 10) {
          const dt = 0.05;
          const steps = 10000;
          const baseColor = this.state.nextTrajColor();

          for (let i = 0; i < count; i++) {
            const em = new EulerMaruyamaIntegrator(this.state.model);
            const traj = em.integrate(
              V,
              n,
              dt,
              steps,
              this.state.noisySigmaV,
              this.state.noisySigmaN,
            );
            // Vary opacity via color
            const opacity = 0.3 + 0.7 * (i / (count - 1));
            const rgb = this.phaseRenderer.hexToRgb(baseColor);
            const color = `rgba(${rgb.r},${rgb.g},${rgb.b},${opacity.toFixed(2)})`;
            this.state.trajectories.push({ points: traj, color });
          }

          this.state.selectedTrajectory = this.state.trajectories.length - 1;
          this.state.dirty.trajectories = true;
          this.scheduleRender();
        }

        setupToolbar() {
          document
            .getElementById("btn-reset-view")
            .addEventListener("click", () => {
              this.state.resetViewport();
              this.recompute();
            });

          document
            .getElementById("btn-clear-traj")
            .addEventListener("click", () => {
              this.state.trajectories = [];
              this.state.selectedTrajectory = null;
              this.state.trajColorIdx = 0;
              this.scheduleRender();
            });

          document
            .getElementById("btn-bifurc")
            .addEventListener("click", () => {
              this.openBifurcation();
            });

          document
            .getElementById("btn-live-sim")
            .addEventListener("click", () => {
              this.toggleLiveSim();
            });

          document
            .getElementById("btn-live-play")
            .addEventListener("click", () => {
              this.state.liveRunning = !this.state.liveRunning;
              this.updateLiveButtons();
              if (this.state.liveRunning) this.scheduleRender();
            });

          document
            .getElementById("btn-live-reset")
            .addEventListener("click", () => {
              this.state.liveParticle = null;
              this.state.liveTrail = [];
              this.state.liveRunning = false;
              this.state.livePulseActive = false;
              this.updateLiveButtons();
              this.scheduleRender();
            });

          document.getElementById("btn-help").addEventListener("click", () => {
            document.getElementById("help-overlay").classList.toggle("visible");
          });

          document
            .getElementById("theme-toggle")
            .addEventListener("click", () => {
              this.toggleTheme();
            });

          document
            .getElementById("bifurc-close")
            .addEventListener("click", () => {
              document
                .getElementById("bifurc-modal")
                .classList.remove("visible");
            });

          document.getElementById("ts-toggle").addEventListener("click", () => {
            const container = document.getElementById("timeseries-container");
            container.classList.toggle("collapsed");
            const isCollapsed = container.classList.contains("collapsed");
            document.getElementById("ts-toggle").innerHTML = isCollapsed
              ? "&#9654; Time Series"
              : "&#9660; Time Series";
            setTimeout(() => {
              this.phaseRenderer.resize();
              this.tsRenderer.resize();
              this.recompute();
            }, 50);
          });
        }

        setupKeyboard() {
          this._keydownHandler = (e) => {
            if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT")
              return;

            switch (e.key) {
              case "c":
                this.state.trajectories = [];
                this.state.selectedTrajectory = null;
                this.state.trajColorIdx = 0;
                this.scheduleRender();
                break;
              case "r":
                this.state.resetViewport();
                this.recompute();
                break;
              case "d":
                this.toggleTheme();
                break;
              case "h":
              case "?":
                document
                  .getElementById("help-overlay")
                  .classList.toggle("visible");
                break;
              case " ":
                if (this.state.liveSimActive) {
                  e.preventDefault();
                  this.state.liveRunning = !this.state.liveRunning;
                  this.updateLiveButtons();
                  if (this.state.liveRunning) this.scheduleRender();
                }
                break;
              case "p":
                this.toggleLiveSim();
                break;
              case "Escape":
                document
                  .getElementById("help-overlay")
                  .classList.remove("visible");
                document
                  .getElementById("bifurc-modal")
                  .classList.remove("visible");
                break;
            }
          };
          document.addEventListener("keydown", this._keydownHandler);
        }

        setupResize() {
          this._resizeHandler = () => {
            this.phaseRenderer.resize();
            this.tsRenderer.resize();
            this.recompute();
          };
          window.addEventListener("resize", this._resizeHandler);
        }

        toggleLiveSim() {
          this.state.liveSimActive = !this.state.liveSimActive;
          const btn = document.getElementById("btn-live-sim");
          btn.classList.toggle("active", this.state.liveSimActive);

          const playBtn = document.getElementById("btn-live-play");
          const resetBtn = document.getElementById("btn-live-reset");
          const speedDisp = document.getElementById("live-speed-display");

          if (this.state.liveSimActive) {
            playBtn.style.display = "";
            resetBtn.style.display = "";
            speedDisp.style.display = "";
            this.phaseCanvas.style.cursor = "pointer";
          } else {
            playBtn.style.display = "none";
            resetBtn.style.display = "none";
            speedDisp.style.display = "none";
            this.state.liveRunning = false;
            this.state.livePulseActive = false;
            this.phaseCanvas.style.cursor = "crosshair";
          }

          this.ui.updateLiveSectionVisibility();
          this.updateLiveButtons();
          this.scheduleRender();
        }

        updateLiveButtons() {
          const playBtn = document.getElementById("btn-live-play");
          if (this.state.liveRunning) {
            playBtn.innerHTML = "&#9646;&#9646; Pause";
          } else {
            playBtn.innerHTML = "&#9654; Play";
          }
          const speedDisp = document.getElementById("live-speed-display");
          speedDisp.textContent = this.state.liveSpeed.toFixed(2) + "x";
        }

        stepLiveSim() {
          if (
            !this.state.liveSimActive ||
            !this.state.liveRunning ||
            !this.state.liveParticle
          )
            return;

          const dt = 0.05;
          const subStepsBase = 20;
          const subSteps = Math.round(subStepsBase * this.state.liveSpeed);
          const model = this.state.model;

          if (!this._liveBaseIext) this._liveBaseIext = model.params.Iext;

          let { V, n, t } = this.state.liveParticle;

          for (let i = 0; i < subSteps; i++) {
            model.params.Iext =
              this._liveBaseIext +
              (this.state.livePulseActive ? this.state.livePulseAmount : 0);

            if (this.state.liveStochastic) {
              if (!this._liveEM)
                this._liveEM = new EulerMaruyamaIntegrator(model);
              [V, n] = this._liveEM.step(
                V,
                n,
                dt,
                this.state.liveSigmaV,
                this.state.liveSigmaN,
              );
            } else {
              if (!this._liveRK4) this._liveRK4 = new RK4Integrator(model);
              [V, n] = this._liveRK4.step(V, n, dt);
              V = Math.max(-150, Math.min(150, V));
              n = Math.max(-0.5, Math.min(1.5, n));
            }
            t += dt;

            this.state.liveTrail.push({ V, n, t });
            if (this.state.liveTrail.length > 2000) {
              this.state.liveTrail.shift();
            }

            if (this.state.livePulseActive) {
              this.state.livePulseRemaining -= dt;
              if (this.state.livePulseRemaining <= 0) {
                this.state.livePulseActive = false;
              }
            }
          }

          model.params.Iext = this._liveBaseIext;

          this.state.liveParticle = { V, n, t };
          document.getElementById("live-speed-display").textContent =
            this.state.liveSpeed.toFixed(2) + "x";
        }

        openBifurcation() {
          const modal = document.getElementById("bifurc-modal");
          modal.classList.add("visible");
          const status = document.getElementById("bifurc-status");
          status.textContent = "Computing bifurcation diagram...";

          this.bifurcRenderer.resize();

          const ba = new BifurcationAnalyzer(this.state.model);
          ba.analyze(
            -10,
            150,
            300,
            (progress) => {
              status.textContent = `Computing... ${Math.round(progress * 100)}%`;
            },
            (results) => {
              status.textContent = `Done (${results.length} points)`;
              this.bifurcRenderer.render(results);
            },
          );
        }
      }

      window.MorrisLecarApp = App;