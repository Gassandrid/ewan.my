import Mathlib.Analysis.SpecialFunctions.Pow.Real
import Mathlib.Dynamics.PeriodicPts
import Mathlib.Data.Real.Basic
import Mathlib.Tactic

/-!
# Problem 1: Periodic Orbits of the Logistic Map

Let G(x) = 4x(1 - x). Prove that for each positive integer k,
there is an orbit of period k.

Proof Path:
1. Conjugating G to the tent map via the change of variables x = sin²(πθ/2)
2. Showing the tent map has periodic orbits of all periods
3. Using the conjugacy to transfer this property back to G

-/

namespace ChaosHw4.Problem1

-- logistic map
def G (x : ℝ) : ℝ := 4 * x * (1 - x)

-- logistic map domain
def UnitInterval : Set ℝ := Set.Icc 0 1

-- g mapping unit intercal on itself
theorem G_maps_unit_interval_to_itself :
    ∀ x ∈ UnitInterval, G x ∈ UnitInterval := by
  intro x ⟨hx0, hx1⟩
  unfold G UnitInterval Set.Icc
  simp
  constructor
  · nlinarith [sq_nonneg (x - 1/2)]
  · nlinarith [sq_nonneg (x - 1/2)]

-- n fold composition of G
def G_iter : ℕ → ℝ → ℝ
  | 0 => id
  | n + 1 => G ∘ G_iter n

-- point has period k if G^k(x) = x and if k is min
def HasPeriod (k : ℕ) (x : ℝ) : Prop :=
  k > 0 ∧ G_iter k x = x ∧ ∀ j ∈ Finset.range k, j > 0 → G_iter j x ≠ x

-- for each pos int k, ∃ periodic orbit of period k
theorem exists_periodic_orbit_of_all_periods :
    ∀ k : ℕ, k > 0 → ∃ x ∈ UnitInterval, HasPeriod k x := by
  sorry

def tent_map (x : ℝ) : ℝ :=
  if x ≤ 1/2 then 2 * x else 2 * (1 - x)

def conjugacy (θ : ℝ) : ℝ :=
  Real.sin (Real.pi * θ / 2) ^ 2

theorem conjugacy_relation :
    ∀ θ ∈ Set.Icc (0 : ℝ) 1,
      G (conjugacy θ) = conjugacy (2 * θ % 1) := by
  sorry

end ChaosHw4.Problem1
