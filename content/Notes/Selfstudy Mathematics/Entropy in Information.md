---
class:
  - note
tags:
  - math/information/entropy
  - math/information
source:
  - "[[Entropy for Data science clearly explained]]"
related:
author:
date: 2025-09-15
updated: 2025-11-14
---

Entropy is a very simple concept, but it has a lot of depth. It is a measure of uncertainty or randomness in a system. In information theory, entropy quantifies the amount of information contained in a message or data source. The more uncertain or random the data, the higher the entropy.

---

## Quantifying Surprise

Entropy in a sense is the [[CH28 - Expected Values of Continuous Random Variables|expected value]] of **surprise**. If you have a fair coin, the outcome of a flip is uncertain, and thus has high entropy. If you have a biased coin that always lands on heads, the outcome is certain, and thus has low entropy.

Surprise should be high when something unlikely happens, and low when something likely happens. The key difference between surprise and probability is that surprise is inversely related to probability, AND that compounding suprise is additive, not multiplicative.

To achieve this, we use the negative logarithm of the probability:

$$
  h(s) = -\log_b(P(s))
$$

Where $s$ is the [[Notes/Statistics/Conceptual Notes/Event|event]], $P(s)$ is the probability of the event, and $b$ is the base of the logarithm. The base determines the unit of measurement for surprise. ommon bases are 2 (bits), e (nats), and 10 (hartleys).

What you will notice is that for an example where someone gets a 1 on a 6 sided die 3 times in a row, the probability is:

$$
p(x=1,3) = \frac{1}{6^3} 
$$

But the surprise would instead be:

$$
h(x=1,3) = -\log_2\left(\frac{1}{6^3}\right) = 3 \cdot -\log_2\left(\frac{1}{6}\right) = 3 \cdot \log_2(6)
$$

In essence, the logarithm turns the multiplication of probabilities into an addition of surprise. In the case of **rolling 3 dice**, the surprise would be that 3 times that of a single dice, whereas the probability of seeing that particular combination is instead $\frac{1}{216}$.

---

## Entropy of a Random Variable

We achieve entropy by taking the expected value of the surprise over all possible outcomes of a random variable.

This involves first multiplying the surprise of each outcome by its respective probability, and then summing these products over all possible outcomes.

Defined formally, the entropy $H(X)$ of a discrete random variable $X$ with possible outcomes ${x_1, x_2, ..., x_n}$ and corresponding probabilities ${P(x_1), P(x_2), ..., P(x_n)}$ is given by:

$$
H(X) = -\sum_{i=1}^{n} P(x_i) \log_b(P(x_i))
$$

_This reframes the surprise function $h(s)$ into the entropy function $H(X)$ by taking the weighted average of surprise across all outcomes._

### What Entropy Tells Us

Entropy provides a measure of the uncertainty or unpredictability associated with a random variable. A higher entropy value indicates greater uncertainty, while a lower entropy value indicates less uncertainty.

While not clear from this introduction, entropy can be applied in various contexts, the main ones being comparing different probability distributions, optimizing data encoding schemes, and measuring information gain in machine learning.
