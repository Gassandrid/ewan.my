---
source: https://optuna.org/
image: https://www.google.com/s2/favicons?domain=https://optuna.org/&sz=256
class: website
tags:
  - website
  - math/probability/bayesian
  - cs/ai/hyperparameter
related:
status: none
author:
date: 2026-10-13T15:41:24-04:00
updated: 2026-10-13T15:46:07-04:00
---

A [[Bayesian Optimization]]/ Tree Structured [[Parzen Estimator]] approach to [[Hyperparameter Tuning]]

- especially useful for tuning **architecture hyperparameters** as well as standard hyperparams like learning rate etc.
	- allows you to set up conditional search spaces where dependent structural configurations (e.g., matching head dimensions to total hidden width) are evaluated based on the performance of past trials.

---

## Page Content

## Eager search Spaces

Automated search for optimal hyperparameters using Python conditionals, loops, and syntax

## Easy Parallelization

Parallelize hyperparameter searches over multiple threads or processes without modifying code

### Code Examples

A simple optimization problem:

1. Define `objective` function to be optimized. Let's minimize `(x - 2)^2`
2. Suggest hyperparameter values using `trial` object. Here, a float value of `x` is suggested from `-10` to `10`
3. Create a `study` object and invoke the `optimize` method over 100 trials

```python
import optuna

def objective(trial):
    x = trial.suggest_float('x', -10, 10)
    return (x - 2) ** 2

study = optuna.create_study()
study.optimize(objective, n_trials=100)

study.best_params  # E.g. {'x': 2.002108042}
```

You can optimize PyTorch hyperparameters, such as the number of layers and the number of hidden nodes in each layer, in three steps:

1. Wrap model training with an `objective` function and return accuracy
2. Suggest hyperparameters using a `trial` object
3. Create a `study` object and execute the optimization

```python
import torch

import optuna

# 1. Define an objective function to be maximized.
def objective(trial):

    # 2. Suggest values of the hyperparameters using a trial object.
    n_layers = trial.suggest_int('n_layers', 1, 3)
    layers = []

    in_features = 28 * 28
    for i in range(n_layers):
        out_features = trial.suggest_int(f'n_units_l{i}', 4, 128)
        layers.append(torch.nn.Linear(in_features, out_features))
        layers.append(torch.nn.ReLU())
        in_features = out_features
    layers.append(torch.nn.Linear(in_features, 10))
    layers.append(torch.nn.LogSoftmax(dim=1))
    model = torch.nn.Sequential(*layers).to(torch.device('cpu'))
    ...
    return accuracy

# 3. Create a study object and optimize the objective function.
study = optuna.create_study(direction='maximize')
study.optimize(objective, n_trials=100)
```

You can optimize Scikit-Learn hyperparameters, such as the `C` parameter of `SVC` and the `max_depth` of the `RandomForestClassifier`, in three steps:

1. Wrap model training with an `objective` function and return accuracy
2. Suggest hyperparameters using a `trial` object
3. Create a `study` object and execute the optimization

```python
import sklearn

import optuna

# 1. Define an objective function to be maximized.
def objective(trial):

    # 2. Suggest values for the hyperparameters using a trial object.
    classifier_name = trial.suggest_categorical('classifier', ['SVC', 'RandomForest'])
    if classifier_name == 'SVC':
         svc_c = trial.suggest_float('svc_c', 1e-10, 1e10, log=True)
         classifier_obj = sklearn.svm.SVC(C=svc_c, gamma='auto')
    else:
        rf_max_depth = trial.suggest_int('rf_max_depth', 2, 32, log=True)
        classifier_obj = sklearn.ensemble.RandomForestClassifier(max_depth=rf_max_depth, n_estimators=10)
    ...
    return accuracy

# 3. Create a study object and optimize the objective function.
study = optuna.create_study(direction='maximize')
study.optimize(objective, n_trials=100)
```
