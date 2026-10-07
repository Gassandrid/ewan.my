---
class:
  - note
tags:
  - math/linear-algebra/markhov-chains
  - math/probability/bayesian
source:
related:
author:
description:
aliases:
  - HMM
  - HMMs
  - Hidden Markov Model
date: 2026-03-08T13:45:19-07:00
updated: 2026-09-29T17:27:54-04:00
---

HMMs stem from a simple premise:

- have a internal marhov model that is unobservable, and traversing its random walk at each tick.
- **external observation** states, which are receive only marhov nodes that have a probability of observation based on internal state.
	- gets tricky, as if you observe blue, the internal state could either be happy or sad.
	- best chance when happy, as $P(Blue|Happy)$ is 0.4

```tikz
\usepackage{tikz}
\usetikzlibrary{arrows.meta, positioning}

\begin{document}

\begin{tikzpicture}[
  every node/.style={font=\small},
  state/.style={circle, draw=black, thick, minimum size=1.5cm},
  obs/.style={rectangle, rounded corners=3pt, draw=black, thick,
              minimum width=1.3cm, minimum height=0.9cm, fill=gray!10},
  trans/.style={-{Stealth[length=6pt]}, thick},
  emit/.style={-{Stealth[length=5pt]}, dashed, gray}
]

\node[state, fill=blue!15]   (H) at (0, 0)   {Happy};
\node[state, fill=orange!15] (S) at (5.5, 0) {Sad};

\draw[trans, bend left=25] (H) to node[above] {$a_{HS}=0.3$} (S);
\draw[trans, bend left=25] (S) to node[below] {$a_{SH}=0.4$} (H);
\draw[trans] (H) edge[loop above] node[above] {$0.7$} (H);
\draw[trans] (S) edge[loop above] node[above] {$0.6$} (S);

\node[obs, fill=red!20]    (R) at (-1.2, -3.5) {Red};
\node[obs, fill=blue!20]   (B) at (2.75, -3.5) {Blue};
\node[obs, fill=yellow!30] (Y) at (6.7,  -3.5) {Yellow};

\draw[emit] (H) -- node[left,  font=\scriptsize] {$b_{H}(R)=0.6$} (R);
\draw[emit] (H) -- node[right, font=\scriptsize] {$b_{H}(B)=0.4$} (B);
\draw[emit] (S) -- node[left,  font=\scriptsize] {$b_{S}(B)=0.3$} (B);
\draw[emit] (S) -- node[right, font=\scriptsize] {$b_{S}(Y)=0.7$} (Y);

\node[font=\footnotesize\itshape, gray] at (-3, 0)    {hidden $z_t$};
\node[font=\footnotesize\itshape, gray] at (-3, -3.5) {observed $x_t$};

\end{tikzpicture}

\end{document}
```

HMMs are particularly useful when we seek to predict a sequence of unobservable states given our series of observable events. 

- particularly useful applications for speech related stuff, been doing a lot of with with [[HealthTRAC]] work and whatnot. 
	- [[Viterbi decoder]] and [[Forward Backward Algorithm]] are of particular application here
