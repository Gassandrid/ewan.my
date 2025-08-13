---
id: Automatic Differentiation
aliases: []
tags:
  - cs/ai/gradient-descent
  - math/calculus
date: 2025-08-13
fileClass:
  - note
source: "[[What is Automatic Differentiation?]]"
updated: 2025-08-13
---

Automatic differentiation (AD) is a computational technique used to evaluate the derivative of a function specified by a computer program. It is particularly useful in machine learning and optimization tasks, where gradients are needed for algorithms like gradient descent.

In Layman's terms, automatic differentiation is like a smart calculator that can compute how much a function changes when you change its inputs, without needing to do the math by hand. It does this by breaking down the function into smaller parts and applying the chain rule of calculus automatically.

![[AutomaticDifferentiationExcalidraw.png]]

We will explore the above image in more detail in the next section.

---

## Computing Derivatives Efficiently

In the context of machine learning algorithms like [[Gradient Descent]], there exists a need for an efficient method for computing the derivatives of functions. 

What one might think to do from high school calculus is to manually code out the derivative and call it a day.

$$
f(x) = e^{2x}-x^3 \to f'(x)=2e^{2x}-3x^2
$$

```python
def f(x):
	return np.exp(2*x) - x**3

def f_prime(x):
	return 2*np.exp(2*x)-3*x**2

print(f(10))
print(f_prime(10))
```
