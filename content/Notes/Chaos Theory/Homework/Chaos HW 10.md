---
id: Chaos Hw 10
aliases: []
tags: []
abstract: "Instructions: Graduate students (required) and those planning to go to graduate school in a mathematical science (encouraged) should turn in their solutions in LATEX; you will need to learn this language eventually. Submit your solution in a single PDF in Blackboard, including PDF of your code appended to solutions. Check Teams for sample code. Grading: All questions are worth 3 points unless marked otherwise (3 = perfect or nearly so, 2 = close but something missing, 1 = not close but a reasonable attempt, 0 = way off)."
author:
  - Ewan Pedersen
title: Assignment 10
class:
  - export
date: 2026-04-15T14:37:35-04:00
updated: 2026-04-16T23:37:35-04:00
---

---

## Question 1: Challenge 5 Step 1

> [!Question]
> Assume that $B(x_0)$ differs from $x_0$ by less than or equal to $d$ in each coordinate. In Figure 5.20 we draw a rectangle $S_0$ centered at $x_0$ with dimensions $3d$ in the horizontal direction and $2d$ in the vertical direction. Assume that the rectangle lies near the bottom left of the unit square, nowhere near the line $y = 1/2$, so that it is not chopped in two by the map. Then its image is the rectangle shown; the center of the rectangle is of course $B(x_0)$.
>
> Show that the image of the rectangle is guaranteed to "map across" the original rectangle. Explain why there is a fixed point of $B$ in the overlapping region, within $2d$ of $x_0$.
>
> ![[Screenshot 2026-04-16 at 8.58.39 AM.png]]

skinny baker lower half $y < 1/2$: $B(x,y) = (x/3, 2y)$. $S_0$ far from $y = 1/2 \implies B$ is affine on $S_0$ with const $Df = \text{diag}(1/3, 2)$. image $B(S_0)$ is $d \times 4d$ rect centered at $B(x_0)$, thin/tall vs short/wide $S_0$.

set $x_0 = (a, b)$ and $B(x_0) = (a + \delta, b + \epsilon)$ with $|\delta|, |\epsilon| \leq d$.

**mapping accross:** extents $S_0$ horiz $[a - 3d/2, a + 3d/2]$, $B(S_0)$ horiz $[a + \delta - d/2, a + \delta + d/2]$.

west: $a + \delta - d/2 \geq a - 3d/2$ (since $\delta \geq -d$), east: $a + \delta + d/2 \leq a + 3d/2$ (since $\delta \leq d$)

$B(S_0)$ sits horiz inside $S_0$.

extents: $S_0$ vert $[b - d, b + d]$, $B(S_0)$ vert $[b + \epsilon - 2d, b + \epsilon + 2d]$. south: $b + \epsilon - 2d \leq b - d$ (as $\epsilon \leq d$), north: $b + \epsilon + 2d \geq b + d$ (as $\epsilon \geq -d$)

$B(S_0)$ vert extent containes $S_0$.

thin vert column sits inside horiz band of $S_0$, overshooting top/bottom. that's 'mapping accross'!

**FP:** $B$ affine, solve $(x/3 + c_1, 2y + c_2) = (x, y)$ with constants from $B(x_0) = (a + \delta, b + \epsilon)$. yieldxs unique FP $p$:

$$
p_1 = a + \tfrac{3\delta}{2}, \quad p_2 = b - \epsilon
$$

dist to $x_0$: $|p_1 - a| = 3|\delta|/2 \leq 3d/2$, $|p_2 - b| = |\epsilon| \leq d$. both $< 2d$ (sup norm $\leq 3d/2$).

check overlap $S_0 \cap B(S_0)$:

- $p \in S_0$: $|p_1 - a| \leq 3d/2$, $|p_2 - b| \leq d$ ✓
- $p \in B(S_0)$: $|p_1 - (a + \delta)| = |\delta/2| \leq d/2$, $|p_2 - (b + \epsilon)| = 2|\epsilon| \leq 2d$ ✓

horiz contraction (1/3) forces convergence to vert line, vert expansion (2) gives repelling horiz line. intersecion is the FP; "maps accross" geometry guarantees it's inside.

> [!Success] Answer
> $Df = \text{diag}(1/3, 2)$ makes $B(S_0)$ a $d \times 4d$ rect centered at $B(x_0)$. $|\delta| \leq d \implies$ horiz containment; $|\epsilon| \leq d \implies$ vert overshoot. unique FP $p = (a + 3\delta/2, b - \epsilon)$ in $S_0 \cap B(S_0)$ within $3d/2$ of $x_0$.

---

## Question 2: Challenge 5 Step 2

> [!Question]
> Now suppose our computer makes mistakes in evaluating $B$ of size at most $10^{-6}$, and it tells us that $B(x_0)$ and $x_0$ are equal to within $10^{-6}$. Prove that $B$ has a fixed point within $10^{-5}$ of $x_0$.

$\tilde B(x_0)$ reported value. bounds in sup norm of error: $|\tilde B(x_0) - B(x_0)|_\infty \leq 10^{-6}$  nad reported equality: $|\tilde B(x_0) - x_0|_\infty \leq 10^{-6}$

triangle inequality:

$$
|B(x_0) - x_0|_\infty \leq |B(x_0) - \tilde B(x_0)|_\infty + |\tilde B(x_0) - x_0|_\infty \leq 2 \times 10^{-6}
$$

so true $B(x_0)$ within $d = 2 \cdot 10^{-6}$ of $x_0$. from p1: there existxs true FP $p$ with

$$
|p - x_0|_\infty \leq \tfrac{3d}{2} = 3 \times 10^{-6} < 10^{-5}
$$

> [!Success] Answer
> triangle inequality gives $|B(x_0) - x_0|_\infty \leq 2 \cdot 10^{-6}$. p1 with $d = 2 \cdot 10^{-6}$ ensures FP within $3 \cdot 10^{-6} < 10^{-5}$.

---

## Question 3: Challenge 5 Step 3

> [!Question]
> Prove Theorem 5.19. Let $B$ denote the Skinny Baker Map and let $d > 0$. Assume that there is a set of points $\{x_0, x_1, \ldots, x_{k-1}, x_k = x_0\}$ such that each coordinate of $B(x_i)$ and $x_{i+1}$ differ by less than $d$ for $i = 0, 1, \ldots, k-1$. Then there is a periodic orbit $\{z_0, z_1, \ldots, z_{k-1}, z_k = z_0\}$ such that $|x_i - z_i| < 2d$ for $i = 0, 1, \ldots, k-1$.

pseudo-orbit hypothesis: $|B(x_i) - x_{i+1}|_\infty < d$ (mod $k$). draw $3d \times 2d$ rects $S_i$ at each $x_i$.

**$B(S_i)$ lies accross $S_{i+1}$**

same as p1 but sequence. $S_i$ avoids $y=1/2 \implies B$ affine on $S_i$ with $Df = \text{diag}(1/3, 2)$. $B(S_i)$ is $d \times 4d$ centered at $B(x_i)$.

let $B(x_i) = x_{i+1} + (\delta_i, \epsilon_i)$ with $|\delta_i|, |\epsilon_i| < d$:  horiz is $B(S_i)$ width $d$, center within $d$ of $x_{i+1}$, edges $\in [x_{i+1,x} - 3d/2, x_{i+1,x} + 3d/2] = S_{i+1}$'s horiz span. vert is $B(S_i)$ height $4d$, center within $d$ of $x_{i+1}$, overshoots $S_{i+1}$'s vert span $[x_{i+1,y}-d, x_{i+1,y}+d]$.

'mapping accross' satisfied for all $i$.

**applying corollary 5.13** yields cyclic chain $S_0 \to S_1 \to \cdots \to S_0$ with crossing implies periodic orbit $z_i \in S_i$. 

[[Gram-Schmidt Process|Gram Schmidt]] / horseshoe-like crossings trap periodic orbit. $z_i \in S_i$ implies:

$$
|z_i - x_i|_\infty \leq \tfrac{3d}{2} < 2d
$$

shadowing bound constitent with theory.

> [!Success] Answer
> $3d \times 2d$ rects $S_i$ at $x_i$. p1 geometry shows $B(S_i)$ crossing $S_{i+1}$. corollary 5.13 on cyclic chain yieldxs true periodic orbit $z_i \in S_i$, thus $|x_i - z_i|_\infty \leq 3d/2 < 2d$.

diagram attempt below was made in excalidraw. it may be on another page.

![[Screenshot 2026-04-16 at 11.19.27 PM.png]]

---

## Question 4: Challenge 5 Step 4

> [!Question]
> Let $f$ be a continuous map, and assume that there is a set of rectangles $S_0, S_1, \ldots, S_k$ such that $f(S_i)$ lies across $S_{i+1}$ for $i = 0, 1, \ldots, k-1$, each with the same orientation. Prove that there is a point $x_0 \in S_0$ such that $f^i(x_0)$ lies in the rectangle $S_i$ for all $i \in \{0, 1, \ldots, k-1\}$. By the way, does $k$ have to be finite?

same orientation for $S_i$. crossing means $f(S_i)$ inside horiz and overshoots vert relative to $S_{i+1}$.

**nested preimages**

$R_k = \{x \in S_0 : f^j(x) \in S_j, 0 \leq j \leq k\}$. want to show $R_k \neq \emptyset$.

claim: $R_k$ contains horiz sub-strip of $S_0$.

induction: $R_0 = S_0$ is strip. assume $R_k$ contains strip $H_k \subset S_0$. $f^k(H_k)$ spans $S_k$ horiz. crossing $S_k \to S_{k+1}$ means $f(f^k(H_k))$ overshoots $S_{k+1}$ vert while staying inside horiz. preimage of crossing column is sub-strip via continuity + IVT. call it $H_{k+1} \subset R_{k+1}$.

**finite $k$ vs infinite**

for finite $k$, pick any $x_0 \in H_k$.

for infinite $k$, $H_k$ nested compact nonempty sets. Cantor intersection $\implies H_\infty = \bigcap H_k \neq \emptyset$. any $x_0 \in H_\infty$ works for all $j \geq 0$.

shadowing for pseudo-orbits of hyperbolic maps!

> [!Success] Answer
> $R_k$ contains horiz-spanning strip $H_k$ by induction (preimage of crossing column is sub-strip via IVT). $H_k \neq \emptyset \implies$ existxs for finite $k$. infinite case via Cantor's intersection theorem on nested compact $H_k$.

---

## Question 5: Challenge 5 Step 7

> [!Question]
> Assume that a plot of length one million iterates of the cat map is made on a computer screen, and that the computer is capable of calculating an iteration of the cat map accurately within $10^{-6}$. Do you believe that the dots plotted represent a true orbit of the map (to within the pixels of the screen)?

yes! shadowing theorem works here.

cat map $f(x,y) = (x+y, x+2y) \bmod 1$. $Df = \begin{pmatrix} 1 & 1 \\ 1 & 2 \end{pmatrix}$. 

$\lambda_\pm = (3 \pm \sqrt{5})/2 \implies \lambda_+ \approx 2.618$. uniformly hyperbolic, $h_1 = \ln \lambda_+ \approx 0.962$.

naive error propagation: $10^{-6} \cdot \lambda_+^{10^6} \approx e^{962,000}$ - huge! million-dot orbit is NOT forward orbit of its initial point.

real question: does a DIFFERENT true orbit stay close? yes , as cat map uniformly hyperbolic, so $10^{-6}$-pseudo-orbit is shadowed by true orbit $z_i$.

shadowing dist $\sim 10^{-6}$. 

pixels $\sim 10^{-3}$ wide. shadowing dist $\sim 10^{-6}$ is $1000\times$ smaller. true orbit and pseudo-orbit fall in same pixel every step. dots faithfully represent true orbit at screen resolution.

requires hyperbolicity! fails for generic non-hyperbolic maps.

> [!Success] Answer
> yeah. cat map uniformly hyperbolic ($\lambda_+ \approx 2.618$), so $10^{-6}$-pseudo-orbit is shadowed by genuine orbit within $\sim 10^{-6}$ (generalized p4). screen pixels $\sim 10^{-3}$, so pseudo-orbit and true orbit look orthonganaly identical.
