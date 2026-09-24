# Morris–Lecar explorer

`/pages/morris-lecar` links the phase portrait, analytic Jacobian, complex spectrum,
nonlinear versus linear perturbations, and equilibrium continuation. The numerical
model lives in `quartz/static/js/morris-lecar-math.js`; the browser controller lives
beside it. The resource plugin loads the ES module only on this page and disposes
listeners and animation on Quartz navigation.

The Hopf preset uses gCa = 4.4, V3 = 2, V4 = 30, phi = 0.04. Its first trace
crossing is I ≈ 93.857618 µA/cm². The saddle-node preset uses gCa = 4, V3 = 12,
V4 = 17.4, phi = 0.0667; its lower pair folds at I ≈ 39.963153 µA/cm². These
values are recomputed, not hardcoded boundaries. Parameter conventions and the
qualitative examples follow [Ermentrout’s XPP tutorial](https://sites.pitt.edu/~phase/bard/bardware/tut/xpptut3.html).

## Numerical and interpretation boundaries

- Equilibria are continued in voltage, then partitioned at folds to find every
  root at the selected current, including the double root. The search spans
  −160 to 200 mV, covering the exposed parameter ranges.
- The Jacobian is analytic, including the recovery-rate derivative off equilibrium.
  At equilibrium the term q′(n∞ − n) vanishes.
- Nonlinear trajectories use RK4 at 0.05 ms without clamping state. Linear
  trajectories use the matrix exponential. The local axes use δV/20 and δn/0.2;
  eigenvalues are invariant under this coordinate scaling.
- Stable saddle manifolds are integrated backward, unstable manifolds forward,
  from both signs of each eigenvector. Arrows always indicate forward time.
  They are finite approximations, not certified global separatrices.
- Re λ controls asymptotic linear growth; |Im λ| is angular frequency, with
  local period 2π/|Im λ|. It is not a nonlinear firing-rate estimate. Euclidean
  perturbation norm need not follow exp(Re λ t) at every instant.
- Trace crossings and folds identify local candidates. No normal-form coefficient
  or periodic-orbit continuation is computed. The page does not infer Hopf
  criticality or SNIC topology from the Jacobian, and does not plot simulated
  extrema as certified limit-cycle branches.

## Verification

`npm run validate` includes the numerical regression tests in
`quartz/custom/morrisLecar.test.js`. The private browser probe is
`private/tooling/scripts/probe-morris-lecar.mjs` (see `private/tooling/README.md`).
It checks Hopf/fold crossings, saddle launches, perturbation controls, playback,
shared state, mobile layouts, theme changes, and Quartz SPA cleanup.
