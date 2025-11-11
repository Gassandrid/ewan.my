"""
Chi-Squared Test for Corn Kernel Genetics Lab
Lab 09: Monohybrid and Dihybrid Cross Analysis

This script performs chi-squared tests on corn kernel data to determine
if observed ratios match expected Mendelian ratios.
"""

from scipy.stats import chisquare
import numpy as np

print("=" * 60)
print("CORN KERNEL GENETICS - CHI-SQUARED ANALYSIS")
print("=" * 60)

# ============================================================================
# MONOHYBRID CROSS: KERNEL COLOR (Dd x Dd)
# Expected ratio: 3 purple : 1 yellow (75% : 25%)
# ============================================================================

print("\n" + "-" * 60)
print("MONOHYBRID ANALYSIS: KERNEL COLOR")
print("-" * 60)

# Observed data
observed_color = np.array([143, 40])  # [purple, yellow]
total_color = sum(observed_color)

# Expected data (based on 3:1 ratio)
expected_color = np.array([total_color * 0.75, total_color * 0.25])

print(f"\nTotal kernels counted: {total_color}")
print(f"\nObserved frequencies:")
print(
    f"  Purple kernels:  {observed_color[0]} ({observed_color[0]/total_color*100:.2f}%)"
)
print(
    f"  Yellow kernels:  {observed_color[1]} ({observed_color[1]/total_color*100:.2f}%)"
)

print(f"\nExpected frequencies (3:1 ratio):")
print(f"  Purple kernels:  {expected_color[0]:.2f} (75.00%)")
print(f"  Yellow kernels:  {expected_color[1]:.2f} (25.00%)")

chi2_color, p_value_color = chisquare(f_obs=observed_color, f_exp=expected_color)

print(f"\nChi-squared statistic: {chi2_color:.4f}")
print(f"Chi-squared p-value:   {p_value_color:.4f}")

if p_value_color > 0.05:
    print(f"\nInterpretation: p-value ({p_value_color:.4f}) > 0.05")
    print("  → FAIL TO REJECT null hypothesis")
    print("  → Observed data MATCHES expected 3:1 ratio")
    print("  → Results are consistent with Mendelian inheritance")
else:
    print(f"\nInterpretation: p-value ({p_value_color:.4f}) ≤ 0.05")
    print("  → REJECT null hypothesis")
    print("  → Observed data DOES NOT match expected 3:1 ratio")
    print("  → Results deviate significantly from Mendelian predictions")


print("\n" + "-" * 60)
print("MONOHYBRID ANALYSIS: KERNEL SUGAR CONTENT")
print("-" * 60)

observed_sugar = np.array([139, 43])  # [smooth/low sugar, wrinkled/high sugar]
total_sugar = sum(observed_sugar)

expected_sugar = np.array([total_sugar * 0.75, total_sugar * 0.25])

print(f"\nTotal kernels counted: {total_sugar}")
print(f"\nObserved frequencies:")
print(
    f"  Smooth (low sugar):     {observed_sugar[0]} ({observed_sugar[0]/total_sugar*100:.2f}%)"
)
print(
    f"  Wrinkled (high sugar):  {observed_sugar[1]} ({observed_sugar[1]/total_sugar*100:.2f}%)"
)

print(f"\nExpected frequencies (3:1 ratio):")
print(f"  Smooth (low sugar):     {expected_sugar[0]:.2f} (75.00%)")
print(f"  Wrinkled (high sugar):  {expected_sugar[1]:.2f} (25.00%)")

# Perform chi-squared test
chi2_sugar, p_value_sugar = chisquare(f_obs=observed_sugar, f_exp=expected_sugar)

print(f"\nChi-squared statistic: {chi2_sugar:.4f}")
print(f"Chi-squared p-value:   {p_value_sugar:.4f}")

# Interpretation
if p_value_sugar > 0.05:
    print(f"\nInterpretation: p-value ({p_value_sugar:.4f}) > 0.05")
    print("  → FAIL TO REJECT null hypothesis")
    print("  → Observed data MATCHES expected 3:1 ratio")
    print("  → Results are consistent with Mendelian inheritance")
else:
    print(f"\nInterpretation: p-value ({p_value_sugar:.4f}) ≤ 0.05")
    print("  → REJECT null hypothesis")
    print("  → Observed data DOES NOT match expected 3:1 ratio")
    print("  → Results deviate significantly from Mendelian predictions")

# ============================================================================
# DIHYBRID CROSS: COLOR AND SUGAR CONTENT
# Testing two scenarios:
# 1. Independent inheritance: 9:3:3:1 ratio (56.25% : 18.75% : 18.75% : 6.25%)
# 2. Linked/inherited together: 3:0:0:1 ratio (75% : 0% : 0% : 25%)
# ============================================================================

print("\n" + "-" * 60)
print("DIHYBRID ANALYSIS: COLOR AND SUGAR CONTENT")
print("-" * 60)

# Observed data from Table 5
observed_dihybrid = np.array([30, 5, 9, 1])  # [purple smooth, purple wrinkled, yellow smooth, yellow wrinkled]
total_dihybrid = sum(observed_dihybrid)

print(f"\nTotal kernels counted: {total_dihybrid}")
print(f"\nObserved frequencies:")
print(f"  Purple, smooth:    {observed_dihybrid[0]} ({observed_dihybrid[0]/total_dihybrid*100:.2f}%)")
print(f"  Purple, wrinkled:  {observed_dihybrid[1]} ({observed_dihybrid[1]/total_dihybrid*100:.2f}%)")
print(f"  Yellow, smooth:    {observed_dihybrid[2]} ({observed_dihybrid[2]/total_dihybrid*100:.2f}%)")
print(f"  Yellow, wrinkled:  {observed_dihybrid[3]} ({observed_dihybrid[3]/total_dihybrid*100:.2f}%)")

# Scenario 1: Independent inheritance (9:3:3:1 ratio)
print("\n" + "~" * 60)
print("SCENARIO 1: INDEPENDENT INHERITANCE")
print("~" * 60)

expected_independent = np.array([
    total_dihybrid * 0.5625,  # 9/16 = 56.25% purple, smooth
    total_dihybrid * 0.1875,  # 3/16 = 18.75% purple, wrinkled
    total_dihybrid * 0.1875,  # 3/16 = 18.75% yellow, smooth
    total_dihybrid * 0.0625   # 1/16 = 6.25% yellow, wrinkled
])

print(f"\nExpected frequencies (9:3:3:1 ratio):")
print(f"  Purple, smooth:    {expected_independent[0]:.2f} (56.25%)")
print(f"  Purple, wrinkled:  {expected_independent[1]:.2f} (18.75%)")
print(f"  Yellow, smooth:    {expected_independent[2]:.2f} (18.75%)")
print(f"  Yellow, wrinkled:  {expected_independent[3]:.2f} (6.25%)")

chi2_independent, p_value_independent = chisquare(f_obs=observed_dihybrid, f_exp=expected_independent)

print(f"\nChi-squared statistic: {chi2_independent:.4f}")
print(f"Chi-squared p-value:   {p_value_independent:.4f}")

if p_value_independent > 0.05:
    print(f"\nInterpretation: p-value ({p_value_independent:.4f}) > 0.05")
    print("  → FAIL TO REJECT null hypothesis")
    print("  → Observed data MATCHES expected 9:3:3:1 ratio")
    print("  → Genes are likely INDEPENDENTLY ASSORTED")
else:
    print(f"\nInterpretation: p-value ({p_value_independent:.4f}) ≤ 0.05")
    print("  → REJECT null hypothesis")
    print("  → Observed data DOES NOT match expected 9:3:3:1 ratio")
    print("  → Genes may NOT be independently assorted")

# Scenario 2: Linked/inherited together (3:0:0:1 ratio)
print("\n" + "~" * 60)
print("SCENARIO 2: LINKED/INHERITED TOGETHER")
print("~" * 60)

# Note: We use a small value (0.0001) instead of 0 to avoid division issues
# Adjust values to ensure sum matches exactly
small_val = 0.0001
expected_linked = np.array([
    total_dihybrid * 0.75 - small_val,    # 75% purple, smooth (adjusted)
    small_val,                             # 0% purple, wrinkled (use small value)
    small_val,                             # 0% yellow, smooth (use small value)
    total_dihybrid * 0.25 - small_val     # 25% yellow, wrinkled (adjusted)
])

print(f"\nExpected frequencies (3:0:0:1 ratio):")
print(f"  Purple, smooth:    {expected_linked[0]:.2f} (75.00%)")
print(f"  Purple, wrinkled:  ~0 (0.00%)")
print(f"  Yellow, smooth:    ~0 (0.00%)")
print(f"  Yellow, wrinkled:  {expected_linked[3]:.2f} (25.00%)")

chi2_linked, p_value_linked = chisquare(f_obs=observed_dihybrid, f_exp=expected_linked)

print(f"\nChi-squared statistic: {chi2_linked:.4f}")
print(f"Chi-squared p-value:   {p_value_linked:.4f}")

if p_value_linked > 0.05:
    print(f"\nInterpretation: p-value ({p_value_linked:.4f}) > 0.05")
    print("  → FAIL TO REJECT null hypothesis")
    print("  → Observed data MATCHES expected 3:0:0:1 ratio")
    print("  → Genes are likely LINKED (on same chromosome)")
else:
    print(f"\nInterpretation: p-value ({p_value_linked:.4f}) ≤ 0.05")
    print("  → REJECT null hypothesis")
    print("  → Observed data DOES NOT match expected 3:0:0:1 ratio")
    print("  → Genes are likely NOT linked")


# ============================================================================
# SUMMARY
# ============================================================================

print("\n" + "=" * 60)
print("SUMMARY OF RESULTS")
print("=" * 60)

print("\nMONOHYBRID TESTS:")
print(f"  Kernel Color Chi-squared p-value:        {p_value_color:.4f}")
print(f"  Kernel Sugar Content Chi-squared p-value: {p_value_sugar:.4f}")

print("\nDIHYBRID TESTS:")
print(f"  Independent Inheritance p-value:         {p_value_independent:.4f}")
print(f"  Linked/Inherited Together p-value:       {p_value_linked:.4f}")

print("\nCONCLUSION:")
if p_value_independent > p_value_linked:
    print(f"  → Independent inheritance has HIGHER p-value ({p_value_independent:.4f} vs {p_value_linked:.4f})")
    print(f"  → Data better fits INDEPENDENT ASSORTMENT model")
else:
    print(f"  → Linked inheritance has HIGHER p-value ({p_value_linked:.4f} vs {p_value_independent:.4f})")
    print(f"  → Data better fits LINKED GENES model")

print("\n" + "=" * 60)
