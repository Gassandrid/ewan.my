---
date: 2026-03-18T08:42:35-04:00
updated: 2026-03-18T09:09:11-04:00
class:
  - note
  - lecture
created_on: "[[03-18-2026]]"
tags:
  - university
  - cs/ai/perceptron
source:
related:
author:
description:
aliases:
course: "[[Machine Learning Course]]"
lecture-number: 15
---

the perceptron is the simplest model of a neuron: takes a weighted sum of inputs, fires if it exceeds a threshold. foundation of everything that follows.

by "firing", we simply mean that after all the inputs have each been multiplied by the **bias** term, they are all added together. This sum is then passed through an [[Activation Functions|Activation Function]],  there are many but this often either just squishes the range of possible values to a scale between 0 and 1 ([[Sigmoid Function]]) or sets to 0 if less than 0 ( [[ReLU]] )

$$
z = \sum_i w_i x_i + b
$$

$$
\hat{y} = \begin{cases} 1 & z \geq 0 \\ 0 & z < 0 \end{cases}
$$

```tikz
\usepackage{tikz}
\usetikzlibrary{arrows.meta, positioning, decorations.pathreplacing}

\begin{document}
\begin{tikzpicture}[
    node distance=1.8cm and 2.5cm,
    input/.style={circle, draw=black, thick, minimum size=0.9cm, fill=blue!8},
    sumnode/.style={circle, draw=black, thick, minimum size=1.3cm, fill=orange!12},
    actnode/.style={rectangle, draw=black, thick, minimum width=1.4cm, minimum height=0.9cm, rounded corners=3pt, fill=green!10},
    output/.style={circle, draw=black, thick, minimum size=0.9cm, fill=red!10},
    weight/.style={font=\small, midway, fill=white, inner sep=1.5pt},
    arr/.style={-{Stealth[length=2.5mm]}, thick}
]

% Input nodes
\node[input] (x1) at (0, 2.4)  {$x_1$};
\node[input] (x2) at (0, 0.8)  {$x_2$};
\node[input] (x3) at (0, -0.8) {$x_3$};
\node[input] (xn) at (0, -2.4) {$x_n$};

% Dots between x3 and xn
\node at (0, -1.6) {$\vdots$};

% Bias node
\node[input, fill=yellow!15] (b) at (2.5, -3.6) {$b$};

% Summation node
\node[sumnode] (sum) at (4, 0) {$\displaystyle\sum$};

% Activation function node
\node[actnode] (act) at (7, 0) {$\sigma(\cdot)$};

% Output node
\node[output] (y) at (9.5, 0) {$\hat{y}$};

% Input-to-sum edges with weights
\draw[arr] (x1) -- node[weight, above] {$w_1$} (sum);
\draw[arr] (x2) -- node[weight, above] {$w_2$} (sum);
\draw[arr] (x3) -- node[weight, below] {$w_3$} (sum);
\draw[arr] (xn) -- node[weight, below] {$w_n$} (sum);

% Bias edge
\draw[arr] (b) -- (sum);

% Sum to activation
\draw[arr] (sum) -- node[weight, above] {$z$} (act);

% Activation to output
\draw[arr] (act) -- (y);

% Labels
\node[above=0.3cm of x1, font=\small\bfseries] {Inputs};
\node[above=0.3cm of sum, font=\small\bfseries] {Sum};
\node[above=0.3cm of act, font=\small\bfseries] {Activation};
\node[above=0.3cm of y, font=\small\bfseries] {Output};

% Equation annotation
\node[below=0.6cm of act, font=\small, text=black!70] {$\hat{y} = \sigma\!\left(\sum_{i=1}^{n} w_i x_i + b\right)$};

\end{tikzpicture}
\end{document}
```
