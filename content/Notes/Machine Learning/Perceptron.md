---
date: 2026-03-18T08:42:35-04:00
updated: 2026-03-19T15:31:57-04:00
class:
  - note
  - lecture
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
\begin{document}
\usetikzlibrary{arrows.meta, positioning}
\begin{tikzpicture}[
    input/.style={circle, draw, thick, minimum size=10mm, fill=blue!8, text=black},
    sumnode/.style={circle, draw, thick, minimum size=14mm, fill=orange!12, text=black},
    actnode/.style={rectangle, draw, thick, minimum width=16mm, minimum height=10mm, rounded corners=3pt, fill=green!10, text=black},
    output/.style={circle, draw, thick, minimum size=10mm, fill=red!10, text=black},
    bias/.style={circle, draw, thick, minimum size=10mm, fill=yellow!15, text=black},
    weight/.style={font=\small, midway, fill=white, inner sep=2pt, text=black},
    arr/.style={-{Stealth[length=2.5mm]}, thick},
    lbl/.style={font=\small\bfseries, text=black!40}
]

% Input nodes
\node[input] (x1) at (0, 2)  {$x_1$};
\node[input] (x2) at (0, 0)  {$x_2$};
\node at (0, -1.2) {$\vdots$};
\node[input] (xn) at (0, -2.4) {$x_n$};

% Summation node
\node[sumnode] (sum) at (4, 0) {$\sum$};

% Bias
\node[bias] (b) at (4, -3.2) {$b$};

% Activation
\node[actnode] (act) at (7, 0) {$\sigma(\cdot)$};

% Output
\node[output] (y) at (9.5, 0) {$\hat{y}$};

% Weighted edges
\draw[arr] (x1) -- node[weight, above] {$w_1$} (sum);
\draw[arr] (x2) -- node[weight, above] {$w_2$} (sum);
\draw[arr] (xn) -- node[weight, below] {$w_n$} (sum);

% Bias edge
\draw[arr] (b) -- (sum);

% Sum to activation
\draw[arr] (sum) -- node[weight, above] {$z$} (act);

% Activation to output
\draw[arr] (act) -- (y);

% Labels
\node[lbl, above=3mm of x1] {Inputs};
\node[lbl, above=3mm of sum] {Sum};
\node[lbl, above=3mm of act] {Activation};
\node[lbl, above=3mm of y] {Output};

\end{tikzpicture}
\end{document}
```
