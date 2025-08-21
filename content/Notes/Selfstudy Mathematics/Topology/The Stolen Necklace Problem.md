---
id: The Stolen Necklace Problem
aliases: []
tags: [math/topology, seed, todo/math]
date: 2025-08-19
fileClass:
  - note
source:
  - "[[Using topology for discrete problems - The Borsuk-Ulam theorem and stolen necklaces]]"
updated: 2025-08-19
---

The stolen necklace problem presents itself as a simple problem: given a necklace with `n` beads, each of which can be one of `k` colors, how many distinct necklaces can be formed?

I found out about this problem while watching a video from [[3blue1brown]] on the [[Borsuk-Ulam theorem]]. The problem is a classic example of how topology can be applied to discrete problems, and it has a surprisingly elegant solution.

![[Pasted image 20250819160648.png]]

---

## In Layman's Terms

Given what we said above using the variables $n$ and $k$, the number of distinct necklaces can be calculated using the formula:

$$
f(n, k) = \frac{1}{n} \sum_{d | n} \phi(d) k^{n/d}
$$

Computationally, we can implement this using the following steps:

_quite a long script, so I don't expect you to read it all, but I will explain the main parts below_

```python-r
from collections import Counter, defaultdict
from typing import List, Dict, Tuple, Optional

Color = str


def validate_even_counts(beads: List[Color]) -> Tuple[bool, Dict[Color, int]]:
    counts = Counter(beads)
    for c, v in counts.items():
        if v % 2 != 0:
            return False, counts
    return True, counts


def half_targets(counts: Dict[Color, int]) -> Dict[Color, int]:
    return {c: v // 2 for c, v in counts.items()}


def prefix_counts(seq: List[Color], colors: List[Color]) -> List[Dict[Color, int]]:
    pref = [defaultdict(int)]
    cur = defaultdict(int)
    for x in seq:
        cur = cur.copy()
        cur[x] += 1
        pref.append(cur)
    return [dict(d) for d in pref]


def window_counts(pref: List[Dict[Color, int]], l: int, r: int) -> Dict[Color, int]:
    res = {}
    for c in pref[0].keys() | pref[-1].keys():
        res[c] = pref[r].get(c, 0) - pref[l].get(c, 0)
    return res


def two_cut_solution(beads: List[Color], counts: Dict[Color, int]) -> Optional[Dict]:
    n = len(beads)
    colors = list(counts.keys())
    targets = half_targets(counts)

    doubled = beads + beads
    pref = prefix_counts(doubled, colors)

    for start in range(n):
        for length in range(1, n):
            end = start + length
            wc = window_counts(pref, start, end)
            if all(wc.get(c, 0) == targets.get(c, 0) for c in colors):
                # Two cuts: between (start-1, start) and (end-1, end) mod n
                cut1 = (start - 1) % n
                cut2 = (end - 1) % n
                arc_indices = [(i % n) for i in range(start, end)]
                return {
                    "cuts": sorted({cut1, cut2}),
                    "assignment": "A gets arc [start,end) along the circle, B gets the complement",
                    "arc_start": start % n,
                    "arc_end": end % n,
                    "verification": wc,
                }
    return None


def suffix_count_array(beads: List[Color], colors: List[Color]) -> List[Dict[Color, int]]:
    n = len(beads)
    suf = [defaultdict(int) for _ in range(n + 1)]
    for i in range(n - 1, -1, -1):
        suf[i] = suf[i + 1].copy()
        suf[i][beads[i]] += 1
    return [dict(d) for d in suf]


def backtrack_min_cuts(
    beads: List[Color],
    counts: Dict[Color, int],
    max_circle_cuts: int,
) -> Optional[Dict]:
    n = len(beads)
    colors = list(counts.keys())
    targets = half_targets(counts)
    suf = suffix_count_array(beads, colors)

    def feasible_bound(i: int, assignedA: Dict[Color, int]) -> bool:
        for c in colors:
            if assignedA.get(c, 0) > targets[c]:
                return False
            if assignedA.get(c, 0) + suf[i].get(c, 0) < targets[c]:
                return False
        return True

    best_solution = None

    for line_cuts_cap in range(1, max(1, max_circle_cuts + 1)):
        visited = set()

        def dfs(i: int, cuts_used: int, ownerA: bool, assignedA: Dict[Color, int], cut_positions_line: List[int]):
            nonlocal best_solution
            if best_solution is not None:
                return
            # State pruning key
            key = (i, cuts_used, ownerA, tuple(sorted(assignedA.items())))
            if key in visited:
                return
            visited.add(key)

            if not feasible_bound(i, assignedA):
                return

            if i == n:
                if all(assignedA.get(c, 0) == targets[c] for c in colors):
                    circle_cuts = cuts_used + (0 if ownerA else 1)  # need a cut at end if owner toggled
                    if circle_cuts <= max_circle_cuts:
                        # Build result
                        cuts_circle = set(cut_positions_line)
                        if not ownerA:
                            cuts_circle.add(n - 1)  # cut between last and first to close
                        best_solution = {
                            "cuts": sorted((x % n) for x in cuts_circle),
                            "assignment": "A/B alternate segments starting at index 0 with A",
                            "line_cuts": cuts_used,
                            "circle_cuts": circle_cuts,
                        }
                return

            color_i = beads[i]
            if ownerA:
                assignedA[color_i] = assignedA.get(color_i, 0) + 1

            dfs(i + 1, cuts_used, ownerA, assignedA, cut_positions_line)

            if cuts_used < line_cuts_cap:
                cut_pos = i  # cut between i and i+1
                dfs(i + 1, cuts_used + 1, not ownerA, assignedA, cut_positions_line + [cut_pos])

            if ownerA:
                assignedA[color_i] -= 1
                if assignedA[color_i] == 0:
                    del assignedA[color_i]

        dfs(0, 0, True, {}, [])
        if best_solution is not None:
            return best_solution

    return None


def fair_split_beads(beads: List[Color], max_factor: int = 2) -> Dict:
    if not beads:
        raise ValueError("Beads list is empty")

    ok, counts = validate_even_counts(beads)
    if not ok:
        raise ValueError(f"Impossible: some color counts are odd: {counts}")

    k = len(counts)
    # two cut
    two = two_cut_solution(beads, counts)
    if two is not None:
        two["method"] = "two-cuts"
        two["circle_cuts"] = 2
        return two

    cap = max(2, max_factor * k)
    for C in range(2, cap + 1):  # search increasing cut budgets
        res = backtrack_min_cuts(beads, counts, max_circle_cuts=C)
        if res is not None:
            res["method"] = "backtracking"
            return res

    raise ValueError("No fair split found within the search limits. Consider increasing max_factor or check input size.")


if __name__ == "__main__":
    try:
        beads  # type: ignore # noqa: F821
    except NameError:
        beads = [
            "Ruby", "Emerald", "Sapphire", "Ruby", "Emerald", "Sapphire",
            "Ruby", "Emerald", "Sapphire", "Ruby", "Emerald", "Sapphire",
            "Ruby", "Emerald", "Sapphire", "Ruby", "Emerald", "Sapphire",
            "Ruby", "Emerald", "Sapphire", "Ruby", "Emerald", "Sapphire",
        ]

    print(f"Total beads: {len(beads)}")
    counts = Counter(beads)
    print("Counts per color:", dict(counts))
    try:
        result = fair_split_beads(beads)
        print("Method:", result.get("method"))
        print("Circle cuts:", result.get("circle_cuts"))
        print("Cut positions (between i and i+1 mod n):", result.get("cuts"))
        if result.get("method") == "two-cuts":
            print("Arc start:", result.get("arc_start"), "Arc end:", result.get("arc_end"))
        print("Assignment rule:", result.get("assignment"))

        n = len(beads)
        cuts = set(result.get("cuts", []))
        ownerA = True
        assignedA = Counter()
        for i in range(n):
            if ownerA:
                assignedA[beads[i]] += 1
            if i in cuts:
                ownerA = not ownerA
        if (n - 1) in cuts:
            ownerA = not ownerA
        print("Verification A counts:", dict(assignedA))
        print("Target half counts:", half_targets(Counter(beads)))
        ok = all(assignedA.get(c, 0) == counts[c] // 2 for c in counts)
        print("Fair split verified:", ok)
    except ValueError as e:
        print("Error:", e)
```

### How it Works

- Sanity check: every color shows up an even number of times, otherwise a perfect split is impossible.
- Quick win: try a two‑cut solution by sliding an arc around the circle; if an arc contains exactly half of each color, we’re done.
- If that fails: run a bounded backtracking search that alternates ownership across segments and prunes branches that can’t possibly hit the half‑counts, increasing the cut budget until something fits.
- Output: cut indices (between i and i+1 mod n), method used, and a tiny verification that simulates a lap around the necklace.

But this computation isnt really following the Borsuk-Ulam theorem, which states that any continuous function from an `n`-sphere to `R^n` must have a pair of antipodal points that map to the same value. The necklace problem is a discrete version of this, where we are looking for pairs of points (cuts) that yield the same color distribution.

---

## The Full Explanation

todo.... will reference video and minimizing function... [[Borsuk-Ulam Theorem]] 
