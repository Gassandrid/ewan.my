---
created_on: "[[04-05-2026]]"
class:
  - project-note
tags:
  - projects/evo-robotics
  - generated/claude
  - math/probability/bayesian
  - comp-neuro/models/active-inference
related:
  - "[[Free Energy Principle]]"
description: Full plan and milestones for evo-robotics final project implementing active inference agent in pybullet
updated: 2026-04-07T19:59:37-04:00
date: 2026-04-07T11:07:01-04:00
---

# Active Inference Robotics — Final Project

## Project Summary

Build an active inference agent from scratch using **pybullet** (physics) + **pymdp** (free energy math), replacing the course's evolutionary controller with a Bayesian brain that minimizes expected free energy. The agent acts to reduce surprise about its own sensory states — goal-directed locomotion and epistemic exploration emerge from the math, not from hard-coded rules.

Framework: Karl Friston's Free Energy Principle, implemented as a discrete-state POMDP via pymdp.

Code lives in `active_inference/` on branch `finalProject`.

---

## Milestones

### ✅ Milestone 1 — Pybullet Environment + Observation Pipeline

**Status: Complete.**

Built the full sim from scratch:

- `robot.urdf` — 5-link biped (Torso, FrontThigh, FrontShin, BackThigh, BackShin) with 4 revolute joints (FrontHip, FrontKnee, BackHip, BackKnee). Touch sensors on shin links.
- `env.py` — pybullet world: setup, reset(), step(), contact detection, per-joint discretization, sine perturbation mode.

**Key implementation decisions made:**

- Discretization uses **per-joint ranges** (not a uniform ±π for all): hips use `[-1.6, 1.6]`, knees use `[-1.6, 0.05]` (matching their asymmetric limits). This ensures all 4 bins are actually exercised for every joint — uniform range would leave knees stuck in bins 0–1.
- Discretization and contact reading live in `env.py` directly (no separate `discretize.py`).
- Contact detection uses `getContactPoints(bodyA=robot, bodyB=plane)` and checks link indices: FrontShin = link 1, BackShin = link 3.
- `_disable_default_motors()` must be called at init and after every `reset()` — pybullet re-enables velocity motors on reset.

**Deliverable:** `m1_pipeline.png` — 3-panel figure (raw angles / discretized bins / contact events) under sine perturbation over 4 seconds. Styled with MatplotlibCompiler.

**Observation vector (6 modalities):**

```
[FrontHip_bin, FrontKnee_bin, BackHip_bin, BackKnee_bin, FrontContact, BackContact]
   0..3          0..3           0..3          0..3          0 or 1       0 or 1
```

---

### 🔄 Milestone 2 — Generative Model + Perception (Belief Updating)

**Status: Functional, needs validation.**

`generative_model.py` — A/B/C/D matrices for 2-factor hidden state:

- **Factor 0 (Posture):** Collapsed / Crouched / Upright / Extended
- **Factor 1 (Phase):** Push-off / Flight / Landing / Recovery

`agent.py` — pymdp Agent wrapper with:

- 2 independent control factors (one per hidden state factor), each with 5 named gait actions
- `infer()` — perceive + propagate prior with idle action
- `act()` — full perceive → plan → sample loop

`main.py` — `--perceive-only` flag for M2 mode; default is full AIF loop.

**Observations running:** Beliefs update meaningfully under sine perturbation — agent correctly infers Upright posture early, tracks Collapsed/Extended as robot falls, and cycles through Phase states as legs move.

**Remaining M2 work:**

- [ ] Plot posterior belief time-series (the M2 visualization deliverable) — analogous to `plot_m1.py`
- [ ] Validate A matrix against actual robot kinematics — record (obs, labelled-state) pairs and compare to A predictions
- [ ] Tune B matrix noise — beliefs currently collapse to single states too quickly; B should express more uncertainty

---

### Milestone 3 — Full Active Inference Loop (Action)

**Status: Scaffolding done, behavior not yet tuned.**

The `act()` loop runs (perceive → infer_policies → sample_action → apply_torques) but the `TORQUE_MAP` values in `agent.py` are rough placeholders. No coherent locomotion yet.

**Remaining M3 work:**

- [ ] Tune `TORQUE_MAP` — empirically determine torque magnitudes that produce intended gait primitives
- [ ] Add episode reset logic to `main.py` — robot drifts/falls; need reset when base drops below threshold
- [ ] Increase `policy_len` from 1 to 2 if behavior is too reactive
- [ ] Consider adding base velocity to observation modalities (helps infer locomotion state)

**Visualization:** Video + EFE panel side-by-side.

---

### Milestone 4 — A/B Comparison: Pragmatic vs. Epistemic Drive

**Status: Not started.** Depends on M3 producing coherent locomotion.

- [ ] `run_experiment.py` — harness for two-condition comparison
- [ ] Metrics: cumulative forward distance, mean posterior entropy over time
- [ ] Visualization: side-by-side behavior + entropy/distance plot (mc-styled)

---

## Actual File Structure

```
active_inference/
  robot.urdf          ✅  5-link biped morphology
  env.py              ✅  pybullet env, sensors, discretization, perturbation
  generative_model.py ✅  A, B, C, D matrix builders
  agent.py            ✅  pymdp Agent wrapper + TORQUE_MAP
  main.py             ✅  perceive-only (M2) and full AIF (M3) loops
  plot_m1.py          ✅  M1 deliverable figure (MatplotlibCompiler)
  m1_pipeline.png     ✅  M1 deliverable output
  plot_m2.py          ☐   belief time-series visualization (not yet written)
  run_experiment.py   ☐   M4 A/B harness (not yet written)
```

---

## Stack — Actual Versions

| Component | Library | Notes |
|---|---|---|
| Physics | `pybullet` (Oct 2025 build) | conda env `pyb` only |
| Active inference | `inferactively-pymdp` v1.0.0 | **JAX-based rewrite** — API differs significantly from older numpy pymdp |
| Numerics | `numpy` 2.2.6 | |
| Visualization | `matplotlib` 3.10 + MatplotlibCompiler | mc toolkit at `/Users/gassandrid/cs/tools/MatplotlibCompiler` |

---

## Pymdp V1.0.0 — Critical API Notes

The installed version (`inferactively-pymdp==1.0.0`) is a JAX/equinox rewrite. The original plan's code does **not** work as written. Key differences:

**Array type:** All A/B/C/D must be `jax.numpy` arrays (or plain numpy, auto-converted). Not `obj_array`.

**Batch dimension:** Every matrix has a leading batch dimension, even with `batch_size=1`. `D[f].shape = (1, num_states[f])`, etc.

**No `agent.qs`:** Posterior beliefs are returned by `infer_states()`, not stored on the agent.

**Immutable agent:** Agent is an equinox Module. `infer_parameters()` returns a new agent — must reassign.

**RNG required for action sampling:**

```python
rng_key, subkey = jr.split(rng_key)
action = agent.sample_action(q_pi, rng_key=subkey[None])
```

**Observation format:** Pass a list of per-modality integer indices wrapped in shape `(1,)` arrays:

```python
batched_obs = [jnp.array([o]) for o in obs_list]
qs = agent.infer_states(batched_obs, empirical_prior=prior)
```

**Temporal propagation:** Must manually call `update_empirical_prior(action, qs)` each step to propagate beliefs forward through B. Action shape: `(batch=1, num_control_factors)`.

**One-step loop:**

```python
qs = agent.infer_states(obs, empirical_prior)
q_pi, neg_efe = agent.infer_policies(qs)
action = agent.sample_action(q_pi, rng_key=keys)
empirical_prior = agent.update_empirical_prior(action, qs)
```

---

## Known Issues & Cleanup TODO

### Bugs / Correctness

- [ ] **JAX static warning:** `UserWarning: A JAX array is being set as static!` fires on Agent construction — from equinox storing jax arrays in static fields. Harmless for now but worth investigating; may interact badly with jit compilation later.
- [ ] **TORQUE_MAP untuned:** Current values (`±1.0–1.5 N·m`) are placeholders. Need to empirically determine what torque magnitude produces each intended gait at the robot's mass.
- [ ] **No reset in main.py:** Once the robot falls or drifts far from origin, the episode just continues. Add a reset trigger (e.g., base height < 0.2 m).

### Model Quality

- [ ] **A matrix validation:** The hand-crafted likelihood peaks are educated guesses. Validate by running the sim with a labelled fixed gait and comparing predicted vs. actual observation distributions.
- [ ] **B matrix too confident:** Beliefs collapse to near-certainty quickly (e.g., `Landing: 1.00`). The B transitions may be too sharp — increase noise in `_noisy_identity()` to keep beliefs softer.
- [ ] **C matrix tuning:** Pragmatic preferences (contact + centered angles) may be too weak or strong relative to epistemic gain. Needs empirical calibration once M3 is running.

### Code Quality

- [ ] `plot_m1.py` has a hardcoded path to MatplotlibCompiler (`sys.path.insert`). Should use a `PYTHONPATH` env var or install mc as a package.
- [ ] `main.py` prints beliefs but has no structured logging — add numpy save for belief/obs/pos arrays for offline analysis.
- [ ] The `apply_sine_perturbation` amplitude of 1.5 rad pushes knees past their `-1.57` limit limit briefly — clamp is in place but the interaction with POSITION_CONTROL at 5N force means the robot drifts forward over time. Consider fixing the base or using a lower amplitude.

---

## Key Design Challenges & Mitigations

### 1. Action Space

Using 2 independent control factors × 5 actions each = 25 policy combos (manageable). Factor 0 controls posture transitions (via `TORQUE_MAP`), factor 1 controls phase transitions. Chosen over 3^4=81 flat policies for speed.

### 2. A Matrix Design

Most challenging part. Current approach: peaked categorical distributions hand-tuned per (posture, phase) pair. Validation step needed before M3.

### 3. Continuous → Discrete Mismatch

Solved with per-joint ranges. 4 bins per joint covers the full joint range. Total obs space: 4^4 × 2^2 = 1024 — fine for pymdp.

### 4. Temporal Depth

`policy_len=1` (myopic) for now. Increase to 2 if locomotion is too reactive. `policy_len=3` is likely too slow (cubic policy scaling).

### 5. Equinox / JAX JIT

pymdp v1.0.0 uses equinox for vmapping over batch. First call to `infer_states` incurs a JIT compilation delay (~1-2s). Subsequent calls are fast. Don't mistake the first-call lag for a bug.

---

## Theoretical Background

**Variational Free Energy (perception):**

$$
F = \mathbb{E}_q[\log q(s)] - \mathbb{E}_q[\log P(o,s)] = \text{KL}[q(s) \| P(s|o)]
$$

Minimizing F = making posterior beliefs match the true posterior = perception.

**Expected Free Energy (action):**

$$
G(\pi) = \sum_\tau \left[ \mathbb{E}_q[\log q(s_\tau|\pi) - \log P(s_\tau|\pi)] \right] = \underbrace{\text{epistemic value}}_{\text{information gain}} + \underbrace{\text{pragmatic value}}_{\text{preferred obs}}
$$

Policies that minimize G are selected. Exploration and exploitation follow from a single objective — no explicit tradeoff parameter.

---

## References

- [pymdp paper (arXiv 2201.03904)](https://arxiv.org/abs/2201.03904) — Da Costa et al., official library reference
- [pymdp documentation](https://pymdp-rtd.readthedocs.io/) — tutorials, Agent API
- [Active inference on discrete state-spaces: a synthesis](https://pmc.ncbi.nlm.nih.gov/articles/PMC7732703/) — Da Costa et al. 2020
- [Active inference and robot control: a case study](https://pmc.ncbi.nlm.nih.gov/articles/PMC5046960/) — Friston et al. 2016
- [Active inference and epistemic value](https://pubmed.ncbi.nlm.nih.gov/25689102/) — Friston et al., epistemic foraging
- [How active inference could help revolutionise robotics](https://pmc.ncbi.nlm.nih.gov/articles/PMC8946999/) — PMC review

---

Project description:

my project seeks to implement an active inference agent, Bayesian controller founded in Karl Friston's Free Energy Principle, to drive a simulated biped robot in pybullet. instead of evolving a controller, agent will maintain a probabilistic belief model using its own posture/locomotion phase information, and then selects "actions" to make by minimizing its expected free energy. This should unify both goal directed behavior and epistemic exploration, along with presenting an environment to test the efficacy of such theoretical principles that have no falsifiability!

Project seeks to utilize the JAX implementation of pymdp to utilize a comparisson metric between a "pragmatic agent"(has a preference for uppright/grounded posture) and a pure "epistemic agent"(flat preferences). Hopefully, this will demostrate that exploration emerges organically through the math, even in the absense of instrumental goals.

  Milestones:

  1. pybullet environment / observation pipeline: we need to discretize the pybullet data so as to be handled by pymdp, so we will load a hand-written biped URDF, implement joint angle / contact sensor reads each timestep, and discretize continuous observations into integer bins for discrete state agent.
  2. generative model / perception: define rudimentary A/B/C/D matrices that encode robot's kinematics as the prior, wire in pymdp's belief-updating loop, then verify that posterior beliefs over hidden states trakc robots actual posture and gait phase under passive perturbation.
  3. full active inference loop: connect policy inference (expected free energy minimization) to our joint torque control, produce goal directed locomotion driven entirely by free energy minimization(hopefully)
  4. actual pragmatic vs. epistemic comparison: we will perturb only the C matrix between conditions hten compare cumulative distance traveled and posterior belief entropy, looking for epistemic foraging to emerge without defined exploration rewards
