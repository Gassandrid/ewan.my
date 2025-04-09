---
date: 2025-04-09
updated: 2025-04-09
---
You're absolutely right again — thanks for your patience. Let's fully align with **Obsidian's markdown LaTeX syntax**, using `$$` to wrap all **math blocks**, not `\begin{align}` directly unless it's wrapped in `$$`.

Here's the **fully correct version** with proper Obsidian-compatible math blocks:

---

##### Memoryless Property – Exponential Distribution

- **Definition**:  
    If $X \sim \text{Exponential}(\lambda)$, then:
    

P(X>s+t∣X>s)=P(X>t),∀s,t≥0P(X > s + t \mid X > s) = P(X > t), \quad \forall s, t \geq 0

- **Explanation**:  
    The probability that the process continues for at least another $t$ units of time, given it has already lasted $s$, is the same as the original probability of lasting $t$.
    
- **PDF (Probability Density Function)**:
    

fX(x)={λe−λx,x≥00,x<0f_X(x) = \begin{cases} \lambda e^{-\lambda x}, & x \geq 0 \\ 0, & x < 0 \end{cases}

- **CDF (Cumulative Distribution Function)**:
    

$$P(X>x)=1−FX(x)=e−λxP(X > x) = 1 - F_X(x) = e^{-\lambda x}$$

- **Proof Sketch**:
    

P(X>s+t∣X>s)=P(X>s+t)P(X>s)=e−λ(s+t)e−λs=e−λt=P(X>t)\begin{aligned} P(X > s + t \mid X > s) &= \frac{P(X > s + t)}{P(X > s)} \\\\ &= \frac{e^{-\lambda(s + t)}}{e^{-\lambda s}} \\\\ &= e^{-\lambda t} = P(X > t) \end{aligned}

- **Key Insight**:  
    The exponential distribution is **memoryless** — it "forgets" how much time has passed. It’s the **only** continuous distribution with this property.
    
- **Applications**:  
    Models **waiting times** between random events in a **Poisson process**, such as:
    
    - Time between radioactive decays
        
    - Time between customer arrivals
        
    - Time until hardware failure
        

---

Let me know if you'd like a companion card for the **geometric distribution**, or a visual diagram for intuition!
