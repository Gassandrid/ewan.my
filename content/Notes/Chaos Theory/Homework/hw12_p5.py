import numpy as np
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.ticker import FormatStrFormatter


def logistic(a, x):
    return a * x * (1 - x)


def bifurcation_points(a_min, a_max, n_a=2200, burn=3500, keep=250, x0=0.2718281828):
    a = np.linspace(a_min, a_max, n_a)
    x = np.full(n_a, x0, dtype=float)
    for _ in range(burn):
        x = logistic(a, x)

    aa = np.empty(n_a * keep)
    xx = np.empty(n_a * keep)
    for j in range(keep):
        x = logistic(a, x)
        aa[j * n_a : (j + 1) * n_a] = a
        xx[j * n_a : (j + 1) * n_a] = x
    return aa, xx


def period_estimate(
    a, x0=0.123456789, burn=100_000, keep=2_000, max_period=200, tol=1e-10
):
    x = x0
    for _ in range(burn):
        x = logistic(a, x)

    xs = np.empty(keep)
    for i in range(keep):
        x = logistic(a, x)
        xs[i] = x

    tail = xs[keep // 2 :]
    for p in range(1, max_period + 1):
        err = np.max(np.abs(tail[p:] - tail[:-p]))
        if err < tol:
            return p, err, xs[-p:]
    return None, None, xs


def plot_part_a():
    # A length-0.01 interval that looks chaotic at ordinary resolution.
    interval = (3.99, 4.00)
    zoom = (3.99024, 3.99034)
    a_star = 3.99026704
    period, err, cycle = period_estimate(a_star)

    fig, axes = plt.subplots(1, 2, figsize=(12, 4), sharey=True)

    aa, xx = bifurcation_points(*interval, n_a=2600, burn=4000, keep=220)
    axes[0].plot(aa, xx, "k,")
    axes[0].set_xlim(*interval)
    axes[0].set_ylim(0, 1)
    axes[0].set_title(r"$a \in [3.99, 4.00]$")
    axes[0].set_xlabel("a")
    axes[0].set_ylabel("x")

    aa, xx = bifurcation_points(*zoom, n_a=2600, burn=8000, keep=260)
    axes[1].plot(aa, xx, "k,")
    axes[1].axvline(a_star, color="k", lw=1.0, linestyle="--", label=rf"$a={a_star:.8f}$")
    axes[1].set_xlim(*zoom)
    axes[1].set_title(rf"zoom: period-{period} window")
    axes[1].set_xlabel("a")
    axes[1].xaxis.set_major_formatter(FormatStrFormatter("%.5f"))
    axes[1].legend(loc="upper right", frameon=False, fontsize=8)

    fig.tight_layout()
    fig.savefig("hw12_p5a_window.png", dpi=200)
    plt.close(fig)

    return interval, zoom, a_star, period, err, np.sort(cycle)


def plot_part_b():
    a = 3.9

    # p is the 10^4-th point of one trajectory in the basin.
    p = 0.2
    for _ in range(10_000):
        p = logistic(a, p)

    rng = np.random.default_rng(12)
    M = 1000
    N = 100_000
    xs = rng.random(M)
    mins = np.full(M, np.inf)

    checkpoints = np.unique(np.logspace(1, np.log10(N), 260).astype(int))
    checkpoint_set = set(checkpoints.tolist())
    ns, med = [], []

    for n in range(1, N + 1):
        xs = logistic(a, xs)
        dist = np.abs(xs - p)
        mins = np.minimum(mins, dist)
        if n in checkpoint_set:
            ns.append(n)
            med.append(np.median(mins))

    ns = np.array(ns)
    med = np.array(med)

    fit_mask = ns >= 1000
    slope, intercept = np.polyfit(np.log(ns[fit_mask]), np.log(med[fit_mask]), 1)
    C = np.exp(intercept)

    fig, ax = plt.subplots(figsize=(6, 5))
    ax.loglog(ns, med, "k.", markersize=3, label="median $m_n$")
    ax.loglog(
        ns[fit_mask],
        C * ns[fit_mask] ** slope,
        "k--",
        lw=1.5,
        label=rf"fit: ${C:.2f}\, n^{{{slope:.2f}}}$",
    )
    ax.set_xlabel("n")
    ax.set_ylabel(r"$m_n$")
    ax.legend(frameon=False)
    fig.tight_layout()
    fig.savefig("hw12_p5b_min_distance.png", dpi=200)
    plt.close(fig)

    return p, M, N, slope, C, float(np.median(mins))


if __name__ == "__main__":
    interval, zoom, a_star, period, err, cycle = plot_part_a()
    print("part (a)")
    print(f"  length-0.01 interval: [{interval[0]}, {interval[1]}]")
    print(f"  zoom interval: [{zoom[0]}, {zoom[1]}]")
    print(f"  a* = {a_star:.8f}")
    print(f"  detected period = {period}, repeat error = {err:.2e}")
    print(f"  cycle points = {np.array2string(cycle, precision=8)}")

    p, M, N, slope, C, final_median = plot_part_b()
    print("part (b)")
    print(f"  p = {p:.12f}")
    print(f"  sample = {M} initial points, N = {N}")
    print(f"  median fit: m_n ≈ {C:.4f} n^{slope:.4f}")
    print(f"  final median m_N = {final_median:.4e}")
